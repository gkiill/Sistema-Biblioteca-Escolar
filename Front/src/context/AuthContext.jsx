import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Perfis possíveis no sistema
export const PERFIS = {
  BIBLIOTECARIO: "bibliotecario",
  ALUNO: "aluno",
  PROFESSOR: "professor",
};

// Domínio do e-mail -> perfil
const DOMINIOS = {
  "@biblio.instituicao.edu.br": PERFIS.BIBLIOTECARIO,
  "@aluno.instituicao.edu.br": PERFIS.ALUNO,
  "@prof.instituicao.edu.br": PERFIS.PROFESSOR,
};

// Chave usada para lembrar o login ao recarregar a página (F5)
const CHAVE_STORAGE = "biblioteca:usuario";

/** Descobre o perfil pelo final do e-mail. Retorna null se o domínio não for aceito. */
export function descobrirPerfil(email = "") {
  const emailLimpo = email.trim().toLowerCase();
  const dominio = Object.keys(DOMINIOS).find((d) => emailLimpo.endsWith(d));
  return dominio ? DOMINIOS[dominio] : null;
}

/** Normaliza os campos retornados pelo backend (role/documento -> perfil/identificacao). */
function normalizarUsuario(u) {
  if (!u) return null;
  const rawRole = u.perfil || u.role || "";
  const perfil =
    rawRole === "admin" || rawRole === PERFIS.BIBLIOTECARIO || u.email?.includes("admin")
      ? PERFIS.BIBLIOTECARIO
      : rawRole || descobrirPerfil(u.email) || PERFIS.ALUNO;

  return {
    ...u,
    perfil,
    identificacao: u.identificacao || u.documento || u.ra || "",
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCarregando(false);
      return;
    }
    api
      .get("/me")
      .then((res) => {
        const dados = res.data?.usuario || res.data;
        setUsuario(normalizarUsuario(dados));
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem(CHAVE_STORAGE);
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/login", { email, password });
    const userNormalizado = normalizarUsuario(data.usuario || data);
    localStorage.setItem("token", data.token || "sessao_ativa");
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(userNormalizado));
    setUsuario(userNormalizado);
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // prossegue com logout local mesmo se a sessão já expirou
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem(CHAVE_STORAGE);
      setUsuario(null);
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Atalho para usar o contexto nos componentes. */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>.");
  }
  return contexto;
}
