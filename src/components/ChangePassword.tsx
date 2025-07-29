// import { useEffect, useState } from "react";
// import {
//   loadCaptchaEnginge,
//   LoadCanvasTemplate,
//   validateCaptcha,
// } from "react-simple-captcha";

// const ChangeAdminPassword = () => {
//   const [email, setEmail] = useState("");
//   const [oldPass, setOldPass] = useState("");
//   const [userCaptcha, setUserCaptcha] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");
//   const [step, setStep] = useState(1);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     loadCaptchaEnginge(6); // 6 characters captcha
//   }, []);

//   const handleCaptchaCheck = () => {
//     if (validateCaptcha(userCaptcha)) {
//       setStep(2); // Proceed to password change
//     } else {
//       alert("Captcha is incorrect");
//     }
//   };

//   const handleSubmit = async () => {
//     if (newPass !== confirmPass)
//       return alert("Passwords don't match");
//     if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPass)) {
//       return alert("Password must be strong (uppercase, digit, symbol, 8+ chars)");
//     }

//     try {
//       const res = await fetch(`${backendUrl}/api/admin/change-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           oldPassword: oldPass,
//           newPassword: newPass,
//         }),
//       });

//       const data = await res.json();
//       alert(data.message);
//     } catch (err: any) {
//       alert(err?.message || "Error");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
//       <h2 className="text-xl font-bold mb-4">Change Admin Password</h2>

//       <input
//         type="email"
//         placeholder="Admin Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="input mb-2 w-full"
//       />

//       <input
//         type="password"
//         placeholder="Old Password"
//         value={oldPass}
//         onChange={(e) => setOldPass(e.target.value)}
//         className="input mb-2 w-full"
//         disabled={step !== 1}
//       />

//       {step === 1 && (
//         <>
//           <LoadCanvasTemplate />
//           <input
//             type="text"
//             placeholder="Enter Captcha"
//             value={userCaptcha}
//             onChange={(e) => setUserCaptcha(e.target.value)}
//             className="input mb-2 w-full"
//           />
//           <button
//             onClick={handleCaptchaCheck}
//             className="btn bg-blue-500 text-white w-full"
//           >
//             Verify Captcha
//           </button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPass}
//             onChange={(e) => setNewPass(e.target.value)}
//             className="input mb-2 w-full"
//           />
//           <input
//             type="password"
//             placeholder="Confirm New Password"
//             value={confirmPass}
//             onChange={(e) => setConfirmPass(e.target.value)}
//             className="input mb-2 w-full"
//           />
//           <button
//             onClick={handleSubmit}
//             className="btn bg-green-600 text-white w-full"
//           >
//             Change Password
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ChangeAdminPassword;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const ChangeAdminPassword = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [step, setStep] = useState(1);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2)
      return { level: "weak", color: "bg-red-500", text: "Weak" };
    if (strength <= 3)
      return { level: "medium", color: "bg-yellow-500", text: "Medium" };
    return { level: "strong", color: "bg-green-500", text: "Strong" };
  };

  const handleCaptchaCheck = () => {
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    if (!oldPass) {
      setErrors({ oldPass: "Current password is required" });
      return;
    }

    if (!userCaptcha) {
      setErrors({ captcha: "Please enter the captcha" });
      return;
    }

    if (validateCaptcha(userCaptcha)) {
      setStep(2);
    } else {
      setErrors({ captcha: "Captcha is incorrect. Please try again." });
      loadCaptchaEnginge(6); // Reload captcha
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    if (!newPass) {
      setErrors({ newPass: "New password is required" });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(newPass)) {
      setErrors({
        newPass:
          "Password must contain at least 8 characters, one uppercase letter, one number, and one special character",
      });
      setIsLoading(false);
      return;
    }

    if (newPass !== confirmPass) {
      setErrors({ confirmPass: "Passwords don't match" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3); // Success step
      } else {
        setErrors({ submit: data.message || "Failed to change password" });
      }
    } catch (err: any) {
      setErrors({ submit: err?.message || "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setUserCaptcha("");
    setErrors({});
    loadCaptchaEnginge(6);
  };

  const passwordStrength = getPasswordStrength(newPass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Change Admin Password
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 && "Verify your identity to proceed"}
              {step === 2 && "Set your new secure password"}
              {step === 3 && "Password changed successfully"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 3 ? "bg-green-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Step 1: Verification */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Current Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showOldPass ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.oldPass ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.oldPass && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.oldPass}
                  </p>
                )}
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Verification
                </label>
                <div className="bg-gray-50 p-4 rounded-lg mb-3 flex items-center justify-between">
                  <LoadCanvasTemplate />
                  <button
                    type="button"
                    onClick={() => loadCaptchaEnginge(6)}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh captcha"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter the captcha above"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.captcha ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.captcha && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.captcha}
                  </p>
                )}
              </div>

              <button
                onClick={handleCaptchaCheck}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify & Continue
              </button>
            </div>
          )}

          {/* Step 2: New Password */}
          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to verification
              </button>

              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.newPass ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPass && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.level === "weak"
                            ? "text-red-600"
                            : passwordStrength.level === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width:
                            passwordStrength.level === "weak"
                              ? "33%"
                              : passwordStrength.level === "medium"
                              ? "66%"
                              : "100%",
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {errors.newPass && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.newPass}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.confirmPass
                        ? "border-red-500"
                        : confirmPass && newPass === confirmPass
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPass && newPass === confirmPass && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Passwords match
                  </p>
                )}
                {errors.confirmPass && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPass}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        newPass.length >= 8 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /[A-Z]/.test(newPass) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    One uppercase letter
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /\d/.test(newPass) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    One number
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /[@$!%*?&]/.test(newPass)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Password Changed Successfully!
                </h3>
                <p className="text-gray-600">
                  Your admin password has been updated. Please use your new
                  password for future logins.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Change Another Password
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">© 2025 Hikae Aluminium.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangeAdminPassword;
