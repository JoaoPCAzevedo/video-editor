import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertSecondsToClock } from "@/lib/utils";

type TranscriptItem = {
  time: {
    start: number;
    end: number;
  };
  text: string;
};

export interface TranscriptProps {
  transcript: TranscriptItem[];
  removeTranscript: (item: number) => void;
  startEnd: number[];
}

export default function Transcript(props: TranscriptProps): JSX.Element {
  const { transcript, removeTranscript, startEnd } = props;

  function renderItems() {
    return transcript.map((item, key) => {
      if (item.time.end >= startEnd[0] && item.time.end < startEnd[1]) {
        return (
          <CardContent key={item.time.start}>
            <div className="flex items-center">
              <span className="text-muted-foreground">
                {convertSecondsToClock(item.time.start)} -{" "}
                {convertSecondsToClock(item.time.end)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-1"
                onClick={() => removeTranscript(key)}
              >
                ❌
              </Button>
            </div>
            <p className="mt-2">{item.text}</p>
          </CardContent>
        );
      }
    });
  }

  return (
    <Card className="max-h-[90vh] overflow-auto">
      <CardHeader>
        <Input id="search" placeholder="🔍 Search" />
      </CardHeader>
      {renderItems()}
    </Card>
  );
}
