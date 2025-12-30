import { APITester } from "./APITester";
import "@public/output.css";

import logo from "@public/images/logo.svg";
import reactLogo from '@public/images/react.svg';
import {SignupForm} from "./auth/signupform";


export function Bingus() {
  return (
    <div className="app">
      <div className="logo-container">
        <img src={logo} alt="Bun Logo" width={250} height={250} className="logo bun-logo" />
        <img src={reactLogo} alt="React Logo"  width={250} height={250} className="logo react-logo" />
      </div>

      <h1>Bun + React</h1>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <APITester />
      <SignupForm />
    </div>
  );
}

export default Bingus;
