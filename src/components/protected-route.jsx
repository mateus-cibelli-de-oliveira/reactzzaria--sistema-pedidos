import { Navigate, useLocation } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useAuth } from "@/hooks";
import { HOME, LOGIN } from "@/routes";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LinearProgress />;
  }

  const isLoginPage = location.pathname === LOGIN;

  // logado tentando acessar /login
  if (user && isLoginPage) {
    return <Navigate to={HOME} replace />;
  }

  // não logado tentando acessar rota protegida
  if (!user && !isLoginPage) {
    return <Navigate to={LOGIN} replace />;
  }

  return children;
}
