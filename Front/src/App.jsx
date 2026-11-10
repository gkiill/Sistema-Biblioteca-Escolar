import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";

import RotasProtegidas, { RotaPublica } from "./components/RotasProtegidas";
import Layout from "./components/Layout";
import { PERFIS } from "./context/AuthContext";

// Páginas
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Catalogo from "./pages/Catalogo";
import Livro from "./pages/Livro";
import CadastroLivro from "./pages/CadastroLivro";
import Inventario from "./pages/Inventario";
import Emprestimo from "./pages/Emprestimo";
import Historico from "./pages/Historico";

export default function App() {
  return (
    <Routes>
      {/* Raiz: manda para /home (se não estiver logado, o porteiro leva ao /login) */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* PÚBLICAS (sem menu) */}
      <Route element={<RotaPublica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      {/* QUALQUER USUÁRIO LOGADO */}
      <Route element={<RotasProtegidas />}>
        {/* Com Layout (Sidebar + Navbar automáticos) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/livro/:id" element={<Livro />} />
        </Route>

        {/* Fora do Layout: o Catálogo monta a própria Sidebar (com filtros) */}
        <Route path="/catalogo" element={<Catalogo />} />
      </Route>

      {/* SOMENTE BIBLIOTECÁRIO (@biblio.instituicao.edu.br) */}
      <Route
        element={<RotasProtegidas perfisPermitidos={[PERFIS.BIBLIOTECARIO]} />}
      >
        <Route element={<Layout />}>
          <Route path="/cadastrolivro" element={<CadastroLivro />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/emprestimo" element={<Emprestimo />} />
        </Route>
      </Route>

      {/* SOMENTE ALUNO E PROFESSOR */}
      <Route
        element={
          <RotasProtegidas
            perfisPermitidos={[PERFIS.ALUNO, PERFIS.PROFESSOR]}
          />
        }
      >
        <Route element={<Layout />}>
          <Route path="/historico" element={<Historico />} />
        </Route>
      </Route>

      {/* Qualquer endereço que não existe volta para o início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}