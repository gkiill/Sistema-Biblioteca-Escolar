import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    try {
      console.log("Tentando fazer login com:", email, password);
      await login(email, password);
      console.log("Login bem-sucedido!");
      navigate("/home");
    } catch (err) {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Ícone e Título */}
        <div className="header">
          <svg
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h1>Biblioteca Paulo Freire</h1>
          <p>
            Bem-vindo de volta a biblioteca virtual. Por favor faça seu login
            com seu acesso academico
          </p>
        </div>

       {/* Formulário de Login */}
        <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
          {/* Caixa de feedback de erro / sucesso */}
          <div
            id="loginFeedback"
            style={{
              display: erro ? "block" : "none",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              marginBottom: "14px",
              borderRadius: "6px",
              fontSize: "13px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >{erro}</div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Digite seu email educacional"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="btn-submit-container">
            <button type="submit" className="btn-submit">
              Entrar
            </button>
          </div>
        </form>

        {/* Link de Cadastro */}
        <div className="footer">
          <Link to="/cadastro">Não tem conta? Crie por aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
