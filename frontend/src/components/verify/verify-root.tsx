import { createRoot } from "react-dom/client";
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";
import { VerificationPage } from "./verify";
import { authClient } from "@lib/auth-client";
import { ForbiddenPage } from "@components/auxilliary/Forbidden";
import { VerifyPage } from "./admin/business/adminBusinessVerification";
import { SeekerVerifyPage } from "./admin/seeker/adminSeekerVerification";

function App() {

  const { data: session, isPending } = authClient.useSession();
  return (
    <main>
        <ApplyTheme />
        {session?.user.role === "business" && session !== null && <VerificationPage />}
        {session?.user.role === "admin" &&  <><VerifyPage /><SeekerVerifyPage /></>}
        {(session?.user.role === "user" || session === null) && <ForbiddenPage />}
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
