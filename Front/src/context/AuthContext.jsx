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

/** Descobre o perfil pelo final do e-mail. Retorna null se o domínio não for aceito. */
export function descobrirPerfil(email = "") {
  const emailLimpo = email.trim().toLowerCase();
  const dominio = Object.keys(DOMINIOS).find((d) => emailLimpo.endsWith(d));
  return dominio ? DOMINIOS[dominio] : null;
}

/** Perfil informado pela API (campo perfil ou role). Só aceita valores conhecidos. */
function perfilDaApi(u) {
  const bruto = String(u.perfil || u.role || "").trim().toLowerCase();
  if (bruto === "admin") return PERFIS.BIBLIOTECARIO;
  return Object.values(PERFIS).includes(bruto) ? bruto : null;
}

/**
 * Normaliza o usuário vindo do back-end.
 * - perfil: o e-mail manda; se o domínio não for reconhecido, usa o da API.
 * - identificacao: aceita identificacao, documento ou ra.
 */
function normalizarUsuario(u) {
  if (!u) return null;
  return {
    ...u,
    perfil: descobrirPerfil(u.email) ?? perfilDaApi(u),
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
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/login", { email, password });
    // o e-mail digitado entra junto, para o perfil sair certo mesmo que a API não o devolva
    setUsuario(normalizarUsuario({ email, ...(data.usuario || data) }));
    localStorage.setItem("token", data.token || "sessao_ativa");
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // prossegue com logout local mesmo se a sessão já expirou
    } finally {
      localStorage.removeItem("token");
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