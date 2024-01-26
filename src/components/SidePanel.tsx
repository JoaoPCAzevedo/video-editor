import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Transcript, { type TranscriptProps } from "@/components/Transcript";

interface SidePanelProps {
  transcript: Pick<TranscriptProps, "transcript">;
  removeTranscript: (item: number) => void;
}

export default function SidePanel(props: SidePanelProps): JSX.Element {
  const {
    transcript: { transcript },
    removeTranscript,
  } = props;

  return (
    <Tabs defaultValue="transcript" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="transcript" className="capitalize">
          transcript
        </TabsTrigger>
        <TabsTrigger value="summary" className="capitalize">
          summary
        </TabsTrigger>
      </TabsList>
      <TabsContent value="transcript">
        <Transcript
          transcript={transcript}
          removeTranscript={removeTranscript}
        />
      </TabsContent>
      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              This could be a description of this tab content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
              beatae nobis non alias? Facere deleniti eaque quos quidem
              explicabo, doloribus ratione vitae accusamus iure quas rerum velit
              earum reprehenderit aut?
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
