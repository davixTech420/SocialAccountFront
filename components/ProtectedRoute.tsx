// components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null; // aquí puedes poner un Splash o Loader
  }

  if (!token) {
    // si no hay token, redirige a (tabs) o login
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
