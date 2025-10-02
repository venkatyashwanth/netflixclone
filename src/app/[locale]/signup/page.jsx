import { redirect } from "next/navigation";
import SignupClient from "./SignupClient";

export const metadata= {
  title: 'SignUp - Netflix Clone',
  description: 'Sign up to access',
};

// Fake server-side auth check
async function checkAuth() {
  return false; // Replace with real authentication logic
}

export default async function SignupPage() {
  const isAuthenticated = await checkAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return <SignupClient />;
}