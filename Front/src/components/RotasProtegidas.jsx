import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotasProtegidas({ perfisPermitidos }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    // "state" guarda a página que a pessoa tentou abrir, para voltar depois do login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export function RotaPublica() {
  const { usuario, carregando } = useAuth();
  
  if (carregando) return <p>Carregando...</p>;

  if (usuario) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}