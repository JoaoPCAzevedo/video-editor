import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Transcript() {
  return (
    <Card>
      <CardHeader>
        <Input id="search" placeholder="🔍 Search" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <span className="rounded-full bg-teal-500 text-white size-8 inline-flex items-center justify-center mr-2">
            KR
          </span>
          <span className="font-semibold text-base mr-2">Katie Rowe</span>
          <span className="text-muted-foreground">00:01</span>
        </div>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          euismod, nunc nec consectetur tincidunt, nisl lacus tempor urna, quis
          ullamcorper risus quam quis nisi. Donec sit amet nunc condimentum,
          lacinia nunc id, tempor nisi. Donec sit amet nunc condimentum, lacinia
          nunc id, tempor nisi.
        </p>
      </CardContent>
      <CardContent>
        <div className="flex items-center">
          <span className="rounded-full bg-teal-500 text-white size-8 inline-flex items-center justify-center mr-2">
            KR
          </span>
          <span className="font-semibold text-base mr-2">Katie Rowe</span>
          <span className="text-muted-foreground">00:01</span>
        </div>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          euismod, nunc nec consectetur tincidunt, nisl lacus tempor urna, quis
          ullamcorper risus quam quis nisi. Donec sit amet nunc condimentum,
          lacinia nunc id, tempor nisi. Donec sit amet nunc condimentum, lacinia
          nunc id, tempor nisi.
        </p>
      </CardContent>
    </Card>
  );
}
