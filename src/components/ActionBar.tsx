import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { convertSecondsToClock } from "@/lib/utils";

interface ActionBarProps {
  startEnd: number[];
  currentFrame: number;
  exportVideo: () => void;
}

export default function ActionBar(props: ActionBarProps): JSX.Element {
  const { startEnd, currentFrame, exportVideo } = props;
  return (
    <div className="bg-muted rounded-md w-full p-4 gap-4 flex content-between">
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
      <Button className="text-xs font-semibold px-2.5 py-0.5 h-auto">
        Add logo
      </Button>
      <Button className="text-xs font-semibold px-2.5 py-0.5 h-auto">
        Add intro
      </Button>
      <Button
        className="text-xs font-semibold px-2.5 py-0.5 h-auto"
        onClick={exportVideo}
      >
        Export
      </Button>
    </div>
  );
}
