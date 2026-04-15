
import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";

type userType = "user" | "business"

interface ApiResponse {
  success: boolean,
  message?: string;
};
interface UserPayload {
        name: string
        email: string
        password: string
        type: userType
}
export function SignupCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    let selectedType: userType = "user"
    if(userType === "business"){
      selectedType = "business"
    }
    try {
      setLoading(true);
      const payload:UserPayload = {
        name: name,
        email: email,
        password: password,
        type: selectedType
    }
      const res = await edenTreatyApi.user.createuser.post(payload)

      if (!res.data) {
        throw new Error("Server error");
      }

      const data: ApiResponse = await res.data;

      if (data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUserType("user");
      } else {
        setError(data.message ?? "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

    window.location.href = "/public/dashboard.html";
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create an account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* User Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">User type</span>
              </label>
              <select
                className="select select-bordered"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="user">Seeker</option>
                <option value="business">business</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-sm  absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "hide Password" : "show Password"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span https://refactored-lamp-production.up.railway.app/public/signin.htmlclassName="label-text">Confirm password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowConfirmPassword((v) => !v)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "hide password" : "show password"}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {error && (
              <div className="alert alert-error text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success text-sm">
                Account created successfully!
              </div>
            )}

            {/* Submit */}
            <div className="form-control">
              <button
                className="btn btn-secondary btn-sm md:btn-md lg:btn-lg w-full md:w-auto md:px-10"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
