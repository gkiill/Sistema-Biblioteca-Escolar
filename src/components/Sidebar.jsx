import { Link, NavLink } from "react-router-dom";
import { useAuth, PERFIS } from "../context/AuthContext";

/* Links do menu para cada tipo de usuário.
   (mesmos ícones, textos e ordem que você já tinha nas páginas) */
const MENU_BIBLIOTECARIO = [
  { to: "/home", icone: "fi fi-rr-home", texto: "Home" },
  { to: "/perfil", icone: "fi fi-rr-user", texto: "Perfil" },
  {
    to: "/cadastrolivro",
    icone: "fi fi-sr-square-plus",
    texto: "Registro de novos Livros",
  },
  {
    to: "/emprestimo",
    icone: "fi fi-rr-calendar",
    texto: "Área de Empréstimos",
  },
  { to: "/inventario", icone: "fi fi-rr-box", texto: "Inventário" },
];

const MENU_LEITOR = [
  { to: "/home", icone: "fi fi-rr-home", texto: "Home" },
  { to: "/perfil", icone: "fi fi-rr-user", texto: "Perfil" },
  {
    to: "/historico",
    icone: "fi fi-rr-time-past",
    texto: "Histórico de Livros",
  },
  { to: "/catalogo", icone: "fi fi-rr-book-alt", texto: "Catálogo de Livros" },
];

/* Texto do bloco "user-profile" para cada perfil */
const INFO_PERFIL = {
  [PERFIS.BIBLIOTECARIO]: {
    titulo: "Perfil Bibliotecário",
    rotulo: "ID Funcionário",
    padrao: "2140008",
  },
  [PERFIS.ALUNO]: {
    titulo: "Perfil Estudante",
    rotulo: "RA Aluno",
    padrao: "2024001",
  },
  [PERFIS.PROFESSOR]: {
    titulo: "Perfil Professor",
    rotulo: "ID Professor",
    padrao: "",
  },
};

/**
 * Props:
 *  - aberta:   true/false -> menu aberto (só no modo "retrátil")
 *  - onFechar: função chamada ao clicar no X, no overlay ou em um link
 *  - fixa:     true -> menu fixo na lateral (tela de Perfil): sem overlay,
 *              sem botão X, e com "marca | SAIR" no rodapé do menu
 *  - children: conteúdo extra no fim do menu (ex.: <div className="filters-section">
 *              do Catálogo)
 */
export default function Sidebar({ aberta, onFechar, fixa = false, children }) {
  const { usuario, logout } = useAuth();

  const perfil = usuario?.perfil;
  const itens =
    perfil === PERFIS.BIBLIOTECARIO ? MENU_BIBLIOTECARIO : MENU_LEITOR;
  const info = INFO_PERFIL[perfil] ?? INFO_PERFIL[PERFIS.ALUNO];

  // ATENÇÃO: "identificacao" é um nome de campo suposto.
  // Ajuste para o nome que a sua API devolve em /me.
  const identificacao = usuario?.identificacao ?? info.padrao;

  function handleSair(e) {
    e.preventDefault();
    logout();
  }

  /* No modo fixo, usamos as três classes porque o seu App.css tem:
       .sidebar--fixed  -> posição/largura   (2 traços)
       .sidebar-fixed   -> margem do conteúdo ao lado (1 traço)
       .sidebar         -> fundo, padding, layout */
  const classeAside = fixa
    ? "sidebar sidebar--fixed sidebar-fixed"
    : `sidebar ${aberta ? "active" : ""}`;

  return (
    <>
      {/* Overlay para o Menu Lateral (só no modo retrátil) */}
      {!fixa && (
        <div
          className={`overlay ${aberta ? "active" : ""}`}
          onClick={onFechar}
        ></div>
      )}

      {/* Menu Lateral (Sidebar) */}
      <aside className={classeAside}>
        {!fixa && (
          <div className="sidebar-header">
            <button
              className="btn-close"
              onClick={onFechar}
              aria-label="Fechar menu"
            >
              <i className="fi fi-rr-cross"></i>
            </button>
          </div>
        )}

        <div className="user-profile">
          <div className="avatar-icon">
            <i className="fi fi-sr-user"></i>
          </div>
          <div className="user-info">
            <strong>{info.titulo}</strong>
            <span>
              {info.rotulo}: {identificacao}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {itens.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onFechar}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <i className={item.icone}></i>
              <span>{item.texto}</span>
            </NavLink>
          ))}
        </nav>

        {/* Conteúdo extra (ex.: filtros do Catálogo) */}
        {children}

        {/* Rodapé do menu fixo: marca + Sair */}
        {fixa && (
          <div className="sidebar-footer">
            <span className="brand">Biblioteca Paulo Freire</span>
            <span className="divider">|</span>
            <Link to="/login" className="link-logout" onClick={handleSair}>
              SAIR
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}