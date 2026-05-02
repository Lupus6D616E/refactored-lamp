
import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";
import zxcvbn from "zxcvbn";

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
  const [score, setScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

// --- Modal State ---
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  const isStrong = score >= 3
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const result = zxcvbn(value);
    setScore(result.score);
  };
// --- Modal Handlers ---
  const openModal = (e: React.MouseEvent, type: 'terms' | 'privacy') => {
    e.preventDefault();
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

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
      <div className="card w-89 bg-base-100 shadow-xl"> 
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Create an Account</h2>

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
                <p>{strengthLabels[score]}</p>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                />
                <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none right-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
                >
                {showPassword ? (
  
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (

               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          )}
        </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password</span>
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
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none right-2"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                {showConfirmPassword ? (
  
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (

               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          )}
        </button>
              </div>
            </div>
          
          {/* Terms and Privacy Text */}
            <p className="text-[11px] text-gray-500 text-center leading-relaxed px-2">
              By clicking Continue to sign in or sign up, you agree to FlexiHire's{' '}
              <a 
                href="#" 
                onClick={(e) => openModal(e, 'terms')}
                className="text-blue-600 hover:underline font-bold"
              >
                Terms and Conditions
              </a>
              , and{' '}
              <a 
                href="#" 
                onClick={(e) => openModal(e, 'privacy')}
                className="text-blue-600 hover:underline font-bold"
              >
                Privacy Policy
              </a>.
            </p>

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
                className="btn btn-primary w-full rounded-xl text-lg shadow-lg shadow-blue-200"
                type="submit"
                disabled={loading || !isStrong}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>  
             <p className="pt-4 text-[15px] text-gray-600 text-center leading-relaxed px-2">
               Already have an account?<a href="/public/signin.html" className="text-blue-500 hover:underline"> Log In</a>
            </p>     
            </div>
          </form>
        </div>
      </div>
      
       {/* MODAL COMPONENT */}
{modalType && (
  /* 
     The wrapper uses 'fixed top-0 left-0' and 'w-screen h-screen' 
     to ensure it covers the entire viewport, bypassing any sidebar constraints.
  */
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    
    <div 
      className="absolute inset-0 cursor-pointer" 
      onClick={closeModal}
    ></div>

    <div 
      className="relative z-10 bg-white rounded-3xl shadow-2xl w-[92%] max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-200"
      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-gray-800">
          {modalType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
        </h2>
        <button 
          onClick={closeModal}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-8 overflow-y-auto text-gray-600 space-y-6 scrollbar-thin">
        {modalType === 'terms' ? (
          <>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">1. Acceptance of Terms</h3>
              <p className="leading-relaxed">
                By accessing or using <span className="text-blue-600 font-semibold">FlexiHire</span>, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you must not use the platform.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">2. Description of Service</h3>
              <p className="leading-relaxed">
                FlexiHire is a community-focused web-based recruitment platform that connects:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Students</li>
                <li>Persons with Disabilities (PWDs)</li> 
                <li>Local employers</li>
                </ul>
                The platform facilitates <span className="text-black-600 font-bold">job posting, job searching, applicant profiles, and employer communication</span>.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">3. User Eligibility</h3>
              <p className="leading-relaxed">
                You must:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Be at least <span className="text-black-600 font-bold"> 18 years old</span></li>
                <li>Provide <span className="text-black-600 font-bold">accurate and complete information</span></li>
                <li>Use the platform for <span className="text-black-600 font-bold"> lawful purposes only</span></li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">4. User Accounts</h3>
              <p className="leading-relaxed">
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Users are responsible for maintaining account confidentiality.</li>
                    <li>You are liable for all activities under your account.</li>
                    <li>FlexiHire may suspend or terminate accounts for violations.</li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">5. Acceptable Use</h3>
              <p className="leading-relaxed">
                  You agree NOT to:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Provide false or misleading information.</li>
                    <li>Engage in discrimination, harassment, or exploitation.</li>
                    <li>Use the platform for illegal recruitment or scams.</li>
                    <li>Attempt unauthorized system access.</li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">6. Job Listings and Applications</h3>
              <p className="leading-relaxed">
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Employers are responsible for the accuracy of job postings.</li>
                    <li>FlexiHire does<span className="text-black-600 font-bold">not guarantee employment outcomes.</span></li>
                    <li>Hiring decisions are solely made by employers.</li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">7. Communication Rules</h3>
              <p className="leading-relaxed">
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Communication is limited between<span className="text-black-600 font-bold"> employers and applicants only.</span></li>
                    <li>Peer-to-peer messaging between job seekers is restricted for safety.</li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">8. Intellectual Property</h3>
              <p className="leading-relaxed">
                All platform content, design, and system features are owned by FlexiHire. Users may not copy or distribute without permission.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">9. Limitation of Liability</h3>
              <p className="leading-relaxed">
                FlexiHire is<span className="text-black-600 font-bold"> not liable</span> for:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Employment disputes</li>
                    <li>Misconduct by users</li>
                    <li>Accuracy of job listings or applicant information</li>
                </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">10. Termination</h3>
              <p className="leading-relaxed">
                FlexiHire reserves the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">11. Modifications</h3>
              <p className="leading-relaxed">
                These terms may be updated at any time. Continued use means acceptance of changes.
              </p>
            </section>
            <p className="text-xs text-gray-400 italic pt-4 border-t border-gray-50">Last updated: 2026</p>
          </>
        ) : (
          <>
            <section>
              <p className="leading-relaxed">Effective Date: 2026</p>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">1. Introduction</h3>
              <p className="leading-relaxed">
                FlexiHire is committed to protecting user data in compliance with the<span className="text-black-600 font-bold"> Philippine Data Privacy Act of 2012 (RA 10173).</span>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">2. Information We Collect</h3>
              <p className="leading-relaxed">
                <span className="text-black-600 font-bold">a. Personal Information:</span>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Resume/CV </li>
              </ul>
              <span className="text-black-600 font-bold">b. Usage Data:</span>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Login activity</li>
                <li>Platform interactions</li>
                <li>Job applications and postings</li>
              </ul>
              <span className="text-black-600 font-bold">c. Optional Information:</span>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accessibility needs (to improve inclusivity features)</li>
              </ul>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">3. How We Use Your Data</h3>
              <p className="leading-relaxed">
                We use collected data to:  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Provide recruitment services</li>
                    <li>Match applicants to job opportunities</li>
                    <li>Improve platform usability and accessibility</li>
                    <li>Ensure system security and prevent misuse</li>   
                </ul>            
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">4. Data Sharing</h3>
              <p className="leading-relaxed">
                We may share data with:  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Employers (for job applications)</li>
                    <li>Authorized system administrators</li>   
                </ul>   
                We do<span className="text-black-600 font-bold"> NOT sell personal data</span>.
              </p>
            </section>
             <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">5. Data Security</h3>
              <p className="leading-relaxed">
                FlexiHire implements:  
                <ul className="list-disc list-inside mt-2 space-y-1 text-black-600 font-bold">
                    <li>Encrypted database storage (Supabase)</li>
                    <li>Secure authentication (BetterAuth)</li> 
                    <li>Access control mechanisms</li>
                </ul>   
                Despite safeguards, no system is 100% secure.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">6. Data Retention</h3>
              <p className="leading-relaxed">
                User data is retained:  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>While the account is active</li>
                    <li>As required for research and system evaluation</li> 
                    <li>Or until the user requests deletion</li>
                </ul>   
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">7. User Rights</h3>
              <p className="leading-relaxed">
                You have the right to:  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Access your personal data</li>
                    <li>Request corrections</li> 
                    <li>Request deletion of your account</li>
                    <li>Withdraw consent</li> 
                </ul>   
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">8. Cookies and Tracking</h3>
              <p className="leading-relaxed">
                FlexiHire may use cookies to:  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Maintain sessions</li>
                    <li>Improve user experience</li> 
                </ul>   
              </p>
            </section>
             <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">9. Protection of Vulnerable Users</h3>
              <p className="leading-relaxed">
                <span className="text-black-600 font-bold">FlexiHire is designed to protect:</span>  
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Students</li>
                    <li>Persons with Disabilities</li> 
                </ul>   
                <span className="text-black-600 font-bold">Safety measures include:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Restricted messaging</li>
                    <li>Accessibility features (e.g., screen reader compatibility)</li> 
                </ul> 
              </p>
            </section>
          <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">10. Third-Party Services</h3>
              <p className="leading-relaxed">
                FlexiHire may use third-party tools (e.g., hosting, authentication), which follow their own privacy policies.  
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">11. Changes to this Policy</h3>
              <p className="leading-relaxed">
                We may update this Privacy Policy. Users will be notified of significant changes.  
              </p>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">12. Contact Information</h3>
              <p className="leading-relaxed">
                For concerns, contact:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  📧 flexihire@gmail.com
                </ul>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  📍 123 Main Street, City, Country
                </ul>
              </p>
            </section>
          </>
        )}
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
        <button
          onClick={closeModal}
          className="btn btn-primary w-full rounded-xl text-lg shadow-lg shadow-blue-200 px-10 py-3 font-bold hover:bg-black transition-all active:scale-95"
        >
          Got it, Thanks
        </button>
      </div>
    </div>
  </div>
)
      }
    </div>
  );
}
