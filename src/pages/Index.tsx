import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page just redirects to the login page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in, otherwise redirect to login
    const isLoggedIn = false; // This would check a token or session in a real app
    
    if (!isLoggedIn) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return null; // No render needed as we're redirecting
};

export default Index;
