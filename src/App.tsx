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

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/ogg"];
const ACCEPTED_TRANSCRIPT_TYPES = ["application/json"];
const maxFileSize = 1024 * 1024 * 1024; // 1gb

export default function App() {
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(true);
  const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameSize, setFrameSize] = useState<FrameSize>({
    width: 0,
    height: 0,
  });
  const [video, setVideo] = useState<File | undefined>();
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
  };

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
              !frames && !video && "animate-pulse bg-muted"
            } h-fit w-8/12`}
          >
            <video className="w-full">
              <source
                src="https://placehold.co/1920x1080.mp4"
                type="video/mp4"
              />
              <source
                src="https://placehold.co/1920x1080.ogg"
                type="video/ogg"
              />
              Your browser does not support HTML video.
            </video>
            <div className="flex gap-1 overflow-auto relative w-full float-left">
              <Timeline framesCount={frames.length} frameSize={frameSize} />
              {frames.map((frame, index) => (
                <img
                  alt={`frame-${index}`}
                  key={index}
                  src={frame}
                  loading="lazy"
                  draggable={false}
                  className="h-20 w-auto"
                />
              ))}
            </div>
          </div>
          <div id="right-panel" className="w-4/12">
            {transcript && <SidePanel transcript={transcript} />}
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
