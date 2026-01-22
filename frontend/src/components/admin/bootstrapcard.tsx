import { authClient } from "@lib/auth-client";
import { useState } from "react";
import { edenApi } from "@lib/eden";

export function BootstrapCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
    const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await edenApi.admin.bootstrap.post({
        email: email,
        name: name,
        password: password,
        secret: key,
    })

    setLoading(false);
    if(res.error !== null && res.error.status === 403){
        const responseerror = res.error.value
      setError(responseerror);
    }
    else if(res.error !== null){
        setError("something happened")
    }
    else{
        setError(res.data)
    }
    // Optionally redirect after signup
    //window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Create an admin account</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
     <input
        type="text"
        placeholder="Key"
        required
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
