import { useRouter } from "next/router";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (username) => {
    localStorage.setItem("admin_logged_in", "true");
    localStorage.setItem("admin_name", username);
    router.push("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
