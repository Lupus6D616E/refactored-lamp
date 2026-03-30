import { createRoot } from "react-dom/client";
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";
import { VerificationPage } from "./verify";

function App() {
  return (
    <main>
        <ApplyTheme />
        <VerificationPage />
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
