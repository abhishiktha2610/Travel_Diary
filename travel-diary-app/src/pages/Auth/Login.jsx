import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    console.log("Form submitted");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      console.log("Email is invalid");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      console.log("Password is missing");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      console.log("Sending login request..."); // Confirm the request is sent
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      console.log("Login Response:", response); // Log the response to see if the API call is successful

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login request failed:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden flex">
      {/* Left side: Background image */}
      <div className="w-1/2 bg-login-bg-img bg-cover bg-center h-full flex items-center justify-center">
        <div className="text-white text-center">
          <h4 className="text-4xl font-bold">
            Capture Your <br /> Journeys
          </h4>
          <p className="mt-4 text-black text-sm leading-6 max-w-xs mx-auto">
            Record your travel experiences and memories in your personal travel
            journal.
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-1/2 h-full bg-white p-12 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="w-48 h-48 bg-cyan-500 rounded-full absolute bottom-10 left-10 opacity-30"></div>
          <div className="w-72 h-72 bg-cyan-500 rounded-full absolute top-10 right-10 opacity-30"></div>
        </div>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg z-10"
        >
          <h4 className="text-2xl font-semibold mb-7 text-center">Login</h4>

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            required
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded"
            required
          />

          {/* Display error message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Login button */}
          <button
            type="submit"
            className="w-full p-3 bg-cyan-500 text-white rounded-md mb-4"
          >
            Login
          </button>

          <p className="text-center text-sm mb-4">Or</p>

          {/* Create account button */}
          <button
            type="button"
            className="w-full p-3 bg-gray-300 text-black rounded-md"
            onClick={() => navigate("/signup")}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
