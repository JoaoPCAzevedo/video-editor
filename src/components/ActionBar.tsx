import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { convertSecondsToClock } from "@/lib/utils";
import { useRef } from "react";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/ogg"];

export type WatermarkPositions =
  | "none"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface ActionBarProps {
  startEnd: number[];
  currentFrame: number;
  exportVideo: () => void;
  handleWatermarkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWaterMarkPositionChange: (position: WatermarkPositions) => void;
  watermark: File | undefined;
  isExporting: boolean;
  handleIntroChange: (
    e: React.ChangeEvent<HTMLInputElement> | undefined
  ) => void;
  intro: File | undefined;
}

export default function ActionBar(props: ActionBarProps): JSX.Element {
  const inputLogoRef = useRef<HTMLInputElement>(null);
  const inputIntroRef = useRef<HTMLInputElement>(null);
  const {
    startEnd,
    currentFrame,
    exportVideo,
    handleWatermarkChange,
    handleWaterMarkPositionChange,
    watermark,
    isExporting,
    handleIntroChange,
    intro,
  } = props;
  return (
    <div className="bg-muted rounded-md w-full p-4 gap-4 flex-wrap flex content-between items-center">
      <div className="border border-primary rounded-full h-fit flex items-center">
        <p className="text-xs font-semibold px-2.5">Start</p>
        <Badge>{convertSecondsToClock(startEnd[0])}</Badge>
      </div>
      <div className="border border-primary rounded-full h-fit flex items-center">
        <p className="text-xs font-semibold px-2.5">End</p>
        <Badge>{convertSecondsToClock(startEnd[1] + 1)}</Badge>
      </div>
      <div className="border border-primary rounded-full h-fit flex items-center">
        <p className="text-xs font-semibold px-2.5">Current</p>
        <Badge>{convertSecondsToClock(currentFrame)}</Badge>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <select
          title="logoPosition"
          id="logoPosition"
          className="text-xs font-semibold rounded-md text-primary-foreground px-2.5 py-1 border-r-8 border-transparent"
          onChange={(e) => {
            if (inputLogoRef.current) {
              if (!watermark) {
                inputLogoRef.current?.click();
              }
            }
            handleWaterMarkPositionChange(e.target.value as WatermarkPositions);
          }}
        >
          <option value="none">
            {!watermark ? "Add logo" : "Remove logo"}
          </option>
          <option value="top-left">Top left</option>
          <option value="top-right">Top right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="bottom-right">Bottom right</option>
        </select>
        {!watermark && (
          <input
            type="file"
            name="logo"
            id="logo"
            hidden
            accept={".png"}
            ref={inputLogoRef}
            onChange={(e) => handleWatermarkChange(e)}
          />
        )}
      </form>
      <Button
        className="text-xs font-semibold px-2.5 py-1 h-auto"
        onClick={() => inputIntroRef?.current?.click()}
      >
        Add intro
      </Button>
      {!intro ? (
        <input
          type="file"
          name="intro"
          id="intro"
          hidden
          accept={ACCEPTED_VIDEO_TYPES.join(",")}
          ref={inputIntroRef}
          onChange={(e) => handleIntroChange(e)}
        />
      ) : (
        <div className="border border-primary rounded-full h-fit flex items-center">
          <p className="text-xs font-semibold px-2.5">{intro.name}</p>
          <Badge
            className="cursor-pointer"
            onClick={() => handleIntroChange(undefined)}
          >
            ❌
          </Badge>
        </div>
      )}
      {!isExporting ? (
        <Button
          className="text-xs font-semibold px-2.5 py-1 h-auto"
          onClick={exportVideo}
        >
          Export
        </Button>
      ) : (
        <Button className="text-xs font-semibold px-2.5 py-1 h-auto" disabled>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25 stroke-primary-foreground"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75 fill-primary-foreground"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exporting...
        </Button>
      )}
    </div>
  );
}
