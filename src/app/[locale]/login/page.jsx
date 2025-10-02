import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LoginClient from "./LoginClient";

export const metadata= {
  title: 'Login - Netflix Clone',
  description: 'Sign in to your account',
};

async function checkAuth() {
  return false;
}

export default async function LoginPage() {
  const t = await getTranslations("Login");
  const isAuthenticated = await checkAuth();

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <LoginClient
      translations={{
        title: t("title"),
        placeholderEmail: t("placeholder.email"),
        placeholderPassword: t("placeholder.password"),
        loggingIn: t("loggingIn"),
        signin: t("signin"),
        prompttext: t("prompttext"),
        signup: t("signup")
      }}
    />
  );
}