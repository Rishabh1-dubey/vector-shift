import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <PipelineToolbar />
      <main className="flex-1 overflow-hidden relative">
        <PipelineUI />
      </main>
      <SubmitButton />
    </div>
  );
}

export default App;
