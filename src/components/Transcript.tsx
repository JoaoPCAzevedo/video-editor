import { Card, CardContent, CardHeader } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
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
        <input
          id="search"
          placeholder="🔍 Search"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </CardHeader>
      {renderItems()}
    </Card>
  );
}
