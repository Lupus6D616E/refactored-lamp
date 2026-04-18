import { useState } from "react";
import { authClient } from "backend/src/lib/auth-client";


export function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message!);
      return;
    }

    // Redirect after successful sign in
    window.location.href = "/public/dashboard.html";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-4xl btn-primary font-semibold text-center">Sign in</h1>


      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full rounded-xl text-lg shadow-lg shadow-blue-200"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
       <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "hide Password" : "show Password"}
                </button>
    </form>
  );
}
