import { Thumb } from "@/components/Timeline/Thumb";

export type FrameSize = {
  width: number;
  height: number;
};

interface TimelineProps {
  framesCount: number;
  frameSize: FrameSize;
  setCurrentFrame: (frame: number) => void;
}

export function Timeline(props: TimelineProps): JSX.Element {
  const { framesCount, frameSize, setCurrentFrame } = props;
  const adjustedWidth = (frameSize.width * 80) / frameSize.height;
  const timelineWidth = `calc(${adjustedWidth}*${framesCount}px + 0.25rem*${
    framesCount - 1
  })`;
  const min: number = 0;
  const max: number = framesCount - 1;

  return (
    <>
      <Thumb
        defaultValue={[min, max]}
        min={min}
        max={max}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: timelineWidth,
        }}
        onValueChange={(value) => {
          console.log(value);
        }}
      />
      <Thumb
        isCurrent
        defaultValue={[0]}
        min={min}
        max={max}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: timelineWidth,
        }}
        onValueChange={(value) => {
          setCurrentFrame(value[0]);
        }}
      />
    </>
  );
}
