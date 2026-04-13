import { createRoot } from "react-dom/client";
import { Front } from "./front";


function App() {
  return (
    <main>
        <Front />
    </main>
  );
}


const root = createRoot(document.getElementById("root")!);
root.render(<App />);
