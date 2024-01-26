import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
}

function convertTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  return formattedTime;
}

export default function Transcript(props: TranscriptProps): JSX.Element {
  const { transcript, removeTranscript } = props;
  return (
    <Card className="max-h-[90vh] overflow-auto">
      <CardHeader>
        <Input id="search" placeholder="🔍 Search" />
      </CardHeader>
      {transcript.map((item, key) => (
        <CardContent key={item.time.start}>
          <div className="flex items-center">
            <span className="text-muted-foreground">
              {convertTime(item.time.start)} - {convertTime(item.time.end)}
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
      ))}
    </Card>
  );
}
