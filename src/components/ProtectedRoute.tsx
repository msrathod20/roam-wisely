import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authReady } = useApp();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
