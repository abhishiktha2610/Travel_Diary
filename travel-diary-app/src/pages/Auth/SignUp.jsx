import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  // Validate email function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted!");

    // Validation checks
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear previous errors

    try {
      console.log("Sending request to API...");

      const response = await axiosInstance.post("/create-account", {
        fullName,
        email,
        password,
      });

      console.log("Signup Response:", response);

      if (response.data && !response.data.error && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        console.log("Navigating to login...");
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup request failed:", error);
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-signup-bg-img bg-cover bg-center h-full flex items-center justify-center">
        <div>
          <h4 className="text-3xl font-bold text-white">Start Your Journey</h4>
          <p className="text-white">
            Join us to start capturing your travel memories today!
          </p>
        </div>
      </div>
      {/* Right Side - Sign Up Form */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100 relative">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="w-48 h-48 bg-cyan-500 rounded-full absolute bottom-10 left-10 opacity-30"></div>
          <div className="w-72 h-72 bg-cyan-500 rounded-full absolute top-10 right-10 opacity-30"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-96 bg-white p-8 rounded-lg shadow-lg z-10 relative"
        >
          <h4 className="text-2xl font-semibold mb-6">Create Account</h4>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            required
          />

          <button
            type="submit"
            className="w-full p-3 bg-cyan-500 text-white rounded-md"
          >
            SIGN UP
          </button>

          <p className="mt-4 text-center">Already have an account?</p>

          <button
            type="button"
            className="w-full p-3 bg-gray-300 text-black rounded-md mt-2"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
