import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⛔ No token found, redirecting to login...");
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // لو ما حددنا role للصفحة، فقط نتاكد انه التوكن موجود
    if (!role) {
      return children;
    }

    const userRole = decoded.role;

    console.log("🔒 Checking access:", { expected: role, actual: userRole });

    if (userRole === role) {
      return children; // ✅ الرول صحيح اسمحله يدخل
    } else {
      console.warn("⛔ Role mismatch, redirecting to login...");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("⛔ Invalid token, redirecting to login...");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
