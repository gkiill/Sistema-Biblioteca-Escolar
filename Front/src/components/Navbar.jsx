import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*onAbrirMenu: função chamada ao clicar no botão do menu (hambúrguer)*/
export default function Navbar({ onAbrirMenu }) {
  const { logout } = useAuth();

  function handleSair(e) {
    // Evita navegar na hora: quando o logout limpar o usuário,
    // o RotasProtegidas já leva sozinho para /login.
    e.preventDefault();
    logout();
  }

  return (
    <header className="navbar">
      <div className="nav-left">
        <button
          className="btn-menu"
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="nav-right">
        <span className="brand">Biblioteca Paulo Freire</span>
        <span className="divider">|</span>
        <Link to="/login" className="link-logout" onClick={handleSair}>
          SAIR
        </Link>
      </div>
    </header>
  );
}