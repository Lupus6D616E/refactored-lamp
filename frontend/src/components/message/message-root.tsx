import { createRoot } from "react-dom/client";
import {Message} from "./message";

function App() {
  return (
    <main>
        <Message id={getPostId()} /> 
    </main>
  );
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
    return params.get("id")!;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
