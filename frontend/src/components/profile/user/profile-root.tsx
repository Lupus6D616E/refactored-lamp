import { createRoot } from "react-dom/client";
import {UserProfile} from "./profile";

function App() {
  return (
    <main>
        <UserProfile id={getPostId()} /> 
    </main>
  );
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
    return params.get("id")!;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
