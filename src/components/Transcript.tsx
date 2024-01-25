import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TranscriptItem = {
  timeStamp: string;
  text: string;
};

export interface TranscriptProps {
  transcript: TranscriptItem[];
}

export default function Transcript(props: TranscriptProps): JSX.Element {
  const { transcript } = props;
  return (
    <Card className="max-h-[90vh] overflow-auto">
      <CardHeader>
        <Input id="search" placeholder="🔍 Search" />
      </CardHeader>
      {transcript.map((item) => (
        <CardContent key={item.timeStamp}>
          <div className="flex items-center">
            <span className="text-muted-foreground">{item.timeStamp}</span>
            <span className="ml-4 text-xs">❌</span>
          </div>
          <p className="mt-2">{item.text}</p>
        </CardContent>
      ))}
    </Card>
  );
}
