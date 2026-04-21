import { createRoot } from "react-dom/client";
import UserProfile from "./profile";
import NavBar from "@components/auxilliary/navbar";

function App() {
  return (
    <main>
        <NavBar />
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
