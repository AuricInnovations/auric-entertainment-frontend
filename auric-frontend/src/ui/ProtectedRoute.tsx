import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export const ProtectedRoute: React.FC<{children: React.ReactNode; role?: "ADMIN" | "USER"}> = ({ children, role }) => {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (role && !user.authorities?.includes(`ROLE_${role}`)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
