import { Thumb } from "@/components/Timeline/Thumb";

export type FrameSize = {
  width: number;
  height: number;
};

interface TimelineProps {
  framesCount: number;
  frameSize: FrameSize;
}

const MIN: number = 0;

export function Timeline(props: TimelineProps): JSX.Element {
  const { framesCount, frameSize } = props;
  const adjustedWidth = (frameSize.width * 80) / frameSize.height;
  const timelineWidth = `calc(${adjustedWidth}*${framesCount}px + 0.25rem*${
    framesCount - 1
  })`;

  return (
    <>
      <Thumb
        defaultValue={[MIN, 19]}
        min={MIN}
        max={framesCount}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: timelineWidth,
        }}
        onMouseLeave={(e) => {
          console.log(e.target);
        }}
      />
      <Thumb
        isCurrent
        defaultValue={[1]}
        min={MIN}
        max={framesCount}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: timelineWidth,
        }}
      />
    </>
  );
}
