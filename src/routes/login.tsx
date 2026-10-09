import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoginScreen } from "@/components/login-screen";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return null;
  if (user) return <Navigate to="/" />;
  return <LoginScreen />;
}
