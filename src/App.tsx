import { ThemeProvider } from "@/components/theme-provider";
import SidePanel from "@/components/SidePanel";
import { Timeline } from "@/components/Timeline";

const frames = [
  "https://picsum.photos/100/67?random=1",
  "https://picsum.photos/100/67?random=2",
  "https://picsum.photos/100/67?random=3",
  "https://picsum.photos/100/67?random=4",
  "https://picsum.photos/100/67?random=5",
  "https://picsum.photos/100/67?random=6",
  "https://picsum.photos/100/67?random=7",
  "https://picsum.photos/100/67?random=8",
  "https://picsum.photos/100/67?random=9",
  "https://picsum.photos/100/67?random=10",
];

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex p-8 gap-4">
        <div className="w-8/12">
          <video className="w-full">
            <source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
            <source src="https://placehold.co/1920x1080.ogg" type="video/ogg" />
            Your browser does not support HTML video.
          </video>
          <div className="flex gap-1 overflow-auto relative w-full float-left">
            <Timeline frames={frames.length} />
            {frames.map((frame, index) => (
              <img
                key={index}
                src={frame}
                alt={`Frame ${index}`}
                loading="lazy"
                draggable={false}
              />
            ))}
          </div>
        </div>
        <div id="right-panel" className="w-4/12">
          <SidePanel />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
