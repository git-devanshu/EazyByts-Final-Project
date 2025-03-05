import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // Inline styles
  const styles = {
    container: {
      textAlign: "center",
      color: "#ffffff",
      backgroundColor: "#121826",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#2daaff",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "#bbbbbb",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#2daaff",
      color: "white",
      padding: "12px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.3s",
    },
    buttonHover: {
      backgroundColor: "#1a8cd8",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Are You Lost?</h1>
      <p style={styles.text}>
        Sorry, we couldn't find the page you're looking for.
      </p>
      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={() => navigate("/dashboard")}
      >
        Go Back to Homepage
      </button>
    </div>
  );
};

export default NotFound;
