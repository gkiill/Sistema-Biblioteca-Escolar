import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Cadastro() {

// Guarda o perfil selecionado pelo usuário
  const [role, setRole] = useState("");
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null); // { tipo: "erro" | "sucesso", texto: "..." }
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();
  setFeedback(null);
  setEnviando(true);

  try {
    // Ajuste a rota e os campos conforme o seu back-end
    await api.post("/register", {
      name: nome,
      documento,
      email,
      password,
      role,
    });

    setFeedback({ tipo: "sucesso", texto: "Conta criada! Redirecionando..." });
    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    setFeedback({
      tipo: "erro",
      texto: err.response?.data?.message || "Não foi possível concluir o cadastro.",
    });
  } finally {
    setEnviando(false);
  }
}

 // Atualiza o perfil quando o usuário clica em um botão
  function selectRole(perfil) {
  setRole(perfil);
  setDocumento(""); // limpa o RA/Registro ao trocar de perfil
}

  return (
    <div className="card">
      {/* Painel Esquerdo Informativo */}
      <section className="info-panel">
        <div>
          <h2>Fique por dentro dos novos livros</h2>
          <p className="subtitle">
            Tenha acesso a várias coleções de livros, base para pesquisas,
            tarefas e espaços de estudos.
          </p>

          <ul className="features">
            <li>
              <div className="icon">
                <i className="fi fi-rs-book-open-cover"></i>
              </div>
              <div>
                <strong>Acesso à livros</strong>
                <p>Vários livros para você</p>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fi fi-ss-door-open"></i>
              </div>
              <div>
                <strong>Espaço para estudos</strong>
                <p>Livros que colaboram com seus estudos</p>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fi fi-rr-graduation-cap"></i>
              </div>
              <div>
                <strong>Biblioteca escolar</strong>
                <p>Foco para o ambiente escolar</p>
              </div>
            </li>
          </ul>
        </div>

        <Link to="#" className="support-link">
          Precisa de ajuda? Entre em contato com o suporte
        </Link>
      </section>

      {/* Painel Direito Formulário */}
      <section className="form-panel">
        <div className="form-header">
          <h3>Crie sua conta!</h3>
          <p>
            Por favor, preencha seus dados institucionais para se cadastrar.
          </p>
        </div>

        <label className="label-title">Estou entrando como:</label>
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === "aluno" ? "active" : ""}`}
            id="btnAluno"
            onClick={() => selectRole("aluno")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span>Aluno</span>
          </button>
          <button
            type="button"
            className={`role-btn ${role === "professor" ? "active" : ""}`}
            id="btnProfessor"
            onClick={() => selectRole("professor")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Professor</span>
          </button>
        </div>

        {/* Campos Dinâmicos */}
        <form
          className={`register-form ${role === "" ? "hidden" : ""}`}
          onSubmit={handleSubmit}
        >
          {feedback && (
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "8px",
              fontSize: "13px",
              textAlign: "center",
              fontWeight: "500",
              color: feedback.tipo === "erro" ? "var(--color-danger)" : "var(--color-success)",
              backgroundColor:
                feedback.tipo === "erro" ? "var(--color-danger-bg)" : "var(--color-success-bg)",
            }}
          >
            {feedback.texto}
          </div>
          )}

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nome">Nome completo:</label>
              <input
                type="text"
                id="nome"
                placeholder="Nome e Sobrenome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="documento">
                {role === "professor" ? "Registro/ID" : "RA"}
              </label>
              <input
                type="text"
                id="documento"
                placeholder={role === "professor" ? "ex. 2140008" : "ex. 2024001"}
                maxLength="12"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Institucional</label>
            <input
              type="email"
              id="email"
              placeholder={
                role === "professor"
                  ? "nome.sobrenome@prof.instituicao.edu.br"
                  : "nome.sobrenome@aluno.instituicao.edu.br"
              }
              value={email}
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
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="hint">Deve ter pelo menos 6 caracteres.</small>
          </div>

          <button type="submit" className="btn-submit" disabled={enviando}>
            {enviando ? "Cadastrando..." : <>Finalizar o cadastro &rarr;</>}
          </button>

          <p className="terms-text">
            Ao se cadastrar, você concorda com os{" "}
            <Link to="#">Termos de Serviço</Link> e a{" "}
            <Link to="#">Política de Privacidade</Link>.
          </p>
        </form>
      </section>
    </div>
  );
}

export default Cadastro;
