import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/* Envolve as páginas que têm menu. A página em si aparece no <Outlet />. */
export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname } = useLocation();

  // A tela de Perfil usa o menu fixo (sem Navbar)
  const menuFixo = pathname === "/perfil";

  return (
    <>
      <Sidebar
        fixa={menuFixo}
        aberta={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      {!menuFixo && <Navbar onAbrirMenu={() => setMenuAberto(true)} />}

      <Outlet />
    </>
  );
}