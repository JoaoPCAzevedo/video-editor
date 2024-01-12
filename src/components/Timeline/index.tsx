import { Thumb } from "@/components/Timeline/Thumb";

interface TimelineProps {
  frames: number;
}

const MIN: number = 0;
const MAX: number = 100;

export function Timeline(props: TimelineProps): JSX.Element {
  const { frames } = props;

  return (
    <>
      <Thumb
        defaultValue={[MIN, MAX]}
        min={MIN}
        max={MAX}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: `calc(100px*${frames} + 0.25rem*${frames - 1})`,
        }}
      />
      <Thumb
        isCurrent
        defaultValue={[20]}
        min={MIN}
        max={MAX}
        step={1}
        className="absolute top-0 bottom-0 w-full"
        style={{
          width: `calc(100px*${frames} + 0.25rem*${frames - 1})`,
        }}
      />
    </>
  );
}
