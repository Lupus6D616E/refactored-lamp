import { createRoot } from "react-dom/client";
import {Message} from "./message";
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";

function App() {
  return (
    <main>
        <ApplyTheme />
        <Message recursionDepth={0} id={getPostId()} businessId={getBusinessId()} /> 
    </main>
  );
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
    return params.get("id")!;
}


function getBusinessId() {
  const params = new URLSearchParams(window.location.search);
    return params.get("businessId")!;
}
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
