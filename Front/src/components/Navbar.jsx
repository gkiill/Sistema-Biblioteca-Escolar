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
          <i className="fi fi-rr-menu-burger"></i>
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