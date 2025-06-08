import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturesSection from "../components/home/Features";
import Footer from "../components/home/Footer";
import AuthModals from "../components/home/AuthModal";

export default function Home() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        backendURL + "/api/auth/login",
        loginData
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("Login successful:", data);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordsMatch = signupData.password === signupData.confirmPassword;
    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupPayload } = signupData;
      const response = await axios.post(
        backendURL + "/api/auth/signup",
        signupPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Account created successfully! Please login.");
        setShowSignupModal(false);
        setShowLoginModal(true);
        setSignupData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        if (data.errors) {
          data.errors.forEach((error) => toast.error(error.message));
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.message));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setLoginData({ email: "", password: "" });
    setSignupData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-white">
      <ToastContainer
        position="top-center"
        toastClassName="backdrop-blur-sm bg-white/90 text-gray-800 border border-purple-200"
      />

      <Navbar
        scrollToSection={scrollToSection}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
      />

      <HeroSection
        setShowSignupModal={setShowSignupModal}
        scrollToSection={scrollToSection}
      />

      <HowItWorks />

      <FeaturesSection />

      <Footer
        setShowSignupModal={setShowSignupModal}
        scrollToSection={scrollToSection}
      />

      {/* Authentication Modals */}
      <AuthModals
        showLoginModal={showLoginModal}
        showSignupModal={showSignupModal}
        loginData={loginData}
        setLoginData={setLoginData}
        signupData={signupData}
        setSignupData={setSignupData}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        loading={loading}
        closeModals={closeModals}
        setShowLoginModal={setShowLoginModal}
        setShowSignupModal={setShowSignupModal}
      />
    </div>
  );
}