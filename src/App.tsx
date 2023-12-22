import { ThemeProvider } from "@/components/theme-provider";
import SidePanel from "@/components/SidePanel";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex p-8 gap-4">
        <div id="video" className="w-8/12">
          <video
            src="https://player.vimeo.com/external/451966658.hd.mp4?s=3f4a6c8f2e2b5a2f1a3e3a8f7d2d9b0e3d5c1f9f&profile_id=175"
            controls
            className="w-full"
          />
        </div>
        <div id="right-panel" className="w-4/12">
          <SidePanel />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
