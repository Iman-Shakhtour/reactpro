import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © {new Date().getFullYear()} Hayat LMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    width: "100%",
    minHeight: "60px",
    background: "#F9F9F6", // نفس خلفية الصفحة مش أخضر
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 0",
    fontFamily: "'Quicksand', sans-serif",
    },
  container: {
    width: "100%",
    maxWidth: "1200px",
    padding: "0 24px",
    textAlign: "center",
  },
  text: {
    color: "#5C4634", // نفس لون النص في الهيدر
    fontSize: 14,
    margin: 0,
    fontWeight: 500,
  },
};

export default Footer;
