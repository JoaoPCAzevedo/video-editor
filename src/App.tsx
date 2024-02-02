import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { ThemeProvider } from "@/components/theme-provider";
import SidePanel from "@/components/SidePanel";
import { type FrameSize, Timeline } from "@/components/Timeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type TranscriptProps } from "@/components/Transcript";
import ActionBar, { WatermarkPositions } from "@/components/ActionBar";
import { convertSecondsToClock } from "@/lib/utils";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/ogg"];
const ACCEPTED_TRANSCRIPT_TYPES = ["application/json"];
const maxFileSize = 1024 * 1024 * 1024; // 1gb

export default function App() {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(true);
  const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 0,
    height: 0,
  });
  const [video, setVideo] = useState<File | undefined>();
  const [intro, setIntro] = useState<File | undefined>();
  const [watermark, setWatermark] = useState<File | undefined>();
  const [watermarkPosition, setWatermarkPosition] =
    useState<WatermarkPositions | null>();
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [startEnd, setStartEnd] = useState<number[]>([]);
  const [transcript, setTranscript] = useState<TranscriptProps>();
  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setFfmpegLoaded(true);
  };

  const splitIntoFrames = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));
    await ffmpeg.exec(["-i", "input.mp4", "-vf", "fps=1", "frame%04d.png"]);
    // Read the names of the output files
    const files = await ffmpeg.listDir("/");
    const imagesOnly = files.filter(
      (file) => !file.isDir && file.name.match(/\.png$/)
    );
    // Create an array of image URLs from the output files
    const frames = await Promise.all(
      // Use Promise.all to handle the promises
      imagesOnly.map(async (image) => {
        // Read the data of the file and create a blob URL
        const data = (await ffmpeg.readFile(image.name)) as Uint8Array;
        return URL.createObjectURL(
          new Blob([data.buffer], { type: "image/png" })
        );
      })
    );
    // Use the Image object to get the dimensions of the image
    const imageElement = new Image();
    imageElement.src = frames[0];

    // Set images dimensions
    const dimensions = new Promise((resolve) => {
      imageElement.onload = () => {
        const { width, height } = imageElement;
        resolve({ width, height });
      };
    });

    setFrameSize((await dimensions) as FrameSize);
    setFrames(frames);
    setStartEnd([0, frames.length - 1]);
  };

  const editVideo = async () => {
    setIsExporting(true);
    try {
      const ffmpeg = ffmpegRef.current;
      /**
       * Handle main video
       */
      const mainVideo = "main.mp4";
      await ffmpeg.writeFile(mainVideo, await fetchFile(video));
      const mainVideoInfo = ["-i", mainVideo];
      /**
       * Handle intro video
       */
      let introInfo: string | string[] = "";
      if (intro) {
        const introVideo = "intro.mp4";
        await ffmpeg.writeFile(introVideo, await fetchFile(intro));
        introInfo = ["-i", introVideo];
        const introComand = [
          "-filter_complex",
          `[0:v]scale=360x640,setsar=1[v0]; \
        [1:v]scale=360x640,setsar=1[v1]; \
        [v1][1:a][v0][0:a] concat=n=2:v=1:a=1 [v] [a]; \
        [v] [2:v] ${getWaterMarkPosition("ffmpeg")} [outv]`,
          "-map",
          "[outv]",
          "-map",
          "[a]",
          "-vsync",
          "2",
        ];
      }
      /**
       * Handle watermark image
       */
      let watermarkInfo: string | string[] = "";
      if (watermark) {
        const watermarkImage = "image.png";
        await ffmpeg.writeFile(watermarkImage, await fetchFile(watermark));
        watermarkInfo = ["-i", watermarkImage];
      }
      /**
       * Build the command
       */
      const outputVideo = "output.mp4";
      let command = [
        "-ss",
        convertSecondsToClock(startEnd[0]),
        "-to",
        convertSecondsToClock(startEnd[1] + 1),
        ...mainVideoInfo,
        outputVideo,
      ];
      if (intro) {
        command = [
          "-ss",
          convertSecondsToClock(startEnd[0]),
          "-to",
          convertSecondsToClock(startEnd[1] + 1),
          ...mainVideoInfo,
          ...introInfo,
          "-filter_complex",
          "[0:v]scale=360x640,setsar=1[v0]; \
        [1:v]scale=360x640,setsar=1[v1]; \
        [v1][1:a][v0][0:a] concat=n=2:v=1:a=1 [v] [a]",
          "-map",
          "[v]",
          "-map",
          "[a]",
          "-vsync",
          "2",
          outputVideo,
        ];
        if (watermark) {
          command = [
            "-ss",
            convertSecondsToClock(startEnd[0]),
            "-to",
            convertSecondsToClock(startEnd[1] + 1),
            ...mainVideoInfo,
            ...introInfo,
            ...watermarkInfo,
            "-filter_complex",
            `[0:v]scale=360x640,setsar=1[v0]; \
            [1:v]scale=360x640,setsar=1[v1]; \
            [v1][1:a][v0][0:a] concat=n=2:v=1:a=1 [v] [a]; \
            [v] [2:v] ${getWaterMarkPosition("ffmpeg")} [outv]`,
            "-map",
            "[outv]",
            "-map",
            "[a]",
            "-vsync",
            "2",
            outputVideo,
          ];
        }
      } else if (watermark && !intro) {
        command = [
          "-ss",
          convertSecondsToClock(startEnd[0]),
          "-to",
          convertSecondsToClock(startEnd[1] + 1),
          ...mainVideoInfo,
          ...watermarkInfo,
          "-filter_complex",
          getWaterMarkPosition("ffmpeg"),
          outputVideo,
        ];
      }
      /**
       * Execute video editing commands
       */
      await ffmpeg.exec(command);
      // Read the data of the output file and create a blob URL
      const data = (await ffmpeg.readFile(outputVideo)) as Uint8Array;
      const editedVideo = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      setIsExporting(false);
      return editedVideo;
    } catch (error) {
      console.error(error);
      setIsExporting(false);
    }
  };

  const exportVideo = async () => {
    // Call the trimVideo function and get the URL
    const url = await editVideo();
    // Create an anchor element and set the href and download attributes
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";
    // Append the anchor to the document body and click it
    document.body.appendChild(a);
    a.click();
    // Remove the anchor from the document
    document.body.removeChild(a);
  };

  function getWaterMarkPosition(type: "css" | "ffmpeg") {
    const watermarkPositionValues = {
      "top-left": {
        css: "top-0 left-0",
        ffmpeg: "overlay=x=0:y=0",
      },
      "top-right": {
        css: "top-0 right-0",
        ffmpeg: "overlay=x=W-w:y=0",
      },
      "bottom-left": {
        css: "bottom-0 left-0",
        ffmpeg: "overlay=x=0:y=H-h",
      },
      "bottom-right": {
        css: "bottom-0 right-0",
        ffmpeg: "overlay=x=W-w:y=H-h",
      },
    };

    switch (watermarkPosition) {
      case "top-left":
        return watermarkPositionValues["top-left"][type];
      case "top-right":
        return watermarkPositionValues["top-right"][type];
      case "bottom-left":
        return watermarkPositionValues["bottom-left"][type];
      case "bottom-right":
        return watermarkPositionValues["bottom-right"][type];
      default:
        return "";
    }
  }

  function onSubmitVideo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    splitIntoFrames();
    setUploadModalOpen(false);
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const video = e.target.files?.[0];
    if (video) {
      setVideo(video);
    }
  }

  function handleIntroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newIntro = e?.target?.files?.[0];
    if (newIntro) {
      setIntro(newIntro);
    } else {
      setIntro(undefined);
    }
  }

  function handleWatermarkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const watermark = e.target.files?.[0];
    if (watermark) {
      setWatermark(watermark);
    }
  }

  function handleTranscriptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const transcript = e.target.files?.[0];
    if (transcript) {
      const fileReader = new FileReader();
      fileReader.readAsText(transcript, "UTF-8");
      fileReader.onload = (e) => {
        const result = e.target?.result;
        const transcriptJSON = JSON.parse(result as string);
        setTranscript(transcriptJSON);
      };
    }
  }

  function handleWaterMarkPositionChange(position: WatermarkPositions) {
    if (position === "none") {
      setWatermark(undefined);
    }
    setWatermarkPosition(position);
  }

  function removeTranscript(item: number) {
    const copyTranscript = { ...(transcript as TranscriptProps) };
    if (copyTranscript?.transcript) {
      // Update future items time
      const duration =
        copyTranscript.transcript[item].time.end -
        copyTranscript.transcript[item].time.start;
      for (let i = item; i < copyTranscript.transcript.length; i++) {
        copyTranscript.transcript[i].time.start =
          copyTranscript.transcript[i].time.start - duration;
        copyTranscript.transcript[i].time.end =
          copyTranscript.transcript[i].time.end - duration;
      }
      // Remove item from transcript
      const updatedTranscript = copyTranscript.transcript.filter(
        (_, i) => i !== item
      );
      // Update transcript state
      copyTranscript.transcript = updatedTranscript;
      setTranscript(copyTranscript as TranscriptProps);
      // Remove corresponding frames
      const copyFrames = [...frames];
      copyFrames.splice(item, duration);
      setFrames(copyFrames);
      setCurrentFrame(0);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              {ffmpegLoaded ? (
                <>
                  <DialogTitle>Select your video</DialogTitle>
                  <DialogDescription>
                    <form onSubmit={(e) => onSubmitVideo(e)}>
                      <label htmlFor="video">Upload video</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2 mb-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        title="video"
                        id="video"
                        type="file"
                        accept={ACCEPTED_VIDEO_TYPES.join(",")}
                        size={maxFileSize}
                        onChange={(e) => handleVideoChange(e)}
                      />
                      <label htmlFor="transcript">Upload transcript</label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2 mb-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        title="transcript"
                        id="transcript"
                        type="file"
                        accept={ACCEPTED_TRANSCRIPT_TYPES.join(",")}
                        onChange={(e) => handleTranscriptChange(e)}
                      />
                      <Button
                        type="submit"
                        disabled={video && transcript ? false : true}
                      >
                        Submit
                      </Button>
                    </form>
                  </DialogDescription>
                </>
              ) : (
                <DialogTitle>Loading...</DialogTitle>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="flex p-8 gap-4">
          <div
            className={`${
              frames.length === 0 && "animate-pulse bg-muted"
            } h-fit min-h-96 w-8/12 rounded-lg border flex flex-wrap justify-center relative`}
          >
            {frames.length > 0 && (
              <>
                <div className="relative">
                  {watermark && (
                    <div className={`absolute ${getWaterMarkPosition("css")}`}>
                      <img
                        src={URL.createObjectURL(watermark)}
                        alt="Watermark"
                      />
                    </div>
                  )}
                  <img
                    alt={`frame-${currentFrame}`}
                    src={frames[currentFrame]}
                    className="max-h-screen w-auto"
                  />
                </div>
                <ActionBar
                  startEnd={startEnd}
                  currentFrame={currentFrame}
                  exportVideo={exportVideo}
                  handleWatermarkChange={handleWatermarkChange}
                  handleWaterMarkPositionChange={handleWaterMarkPositionChange}
                  watermark={watermark}
                  isExporting={isExporting}
                  handleIntroChange={handleIntroChange}
                  intro={intro}
                />
                <div className="flex overflow-auto relative w-full float-left">
                  <Timeline
                    framesCount={frames.length}
                    frameSize={frameSize}
                    setCurrentFrame={setCurrentFrame}
                    setStartEnd={setStartEnd}
                  />
                  {frames.map((frame, index) => (
                    <img
                      alt={`frame-${index}`}
                      key={index}
                      src={frame}
                      loading="lazy"
                      draggable={false}
                      className={`h-28 w-auto transition ${
                        (startEnd[0] > index && "blur-sm grayscale") ||
                        (startEnd[1] < index && "blur-sm grayscale")
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div id="right-panel" className="w-4/12">
            {transcript && (
              <SidePanel
                transcript={transcript}
                removeTranscript={removeTranscript}
                startEnd={startEnd}
              />
            )}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
