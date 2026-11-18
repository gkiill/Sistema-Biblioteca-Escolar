import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LivroCard from "../components/LivroCard";
import Paginacao from "../components/Paginacao";

function Catalogo() {
  const { user } = useAuth();

  // Array estruturado com múltiplos livros e suas respectivas páginas, categorias e status
  const [livros] = useState([
    {
      id: "harry-potter",
      titulo: "Harry Potter e o Cálice de fogo",
      isbn: "9788532530780",
      autor: "J.K Rowling",
      categoria: "ficcao",
      status: "emprestado", // 'disponivel' ou 'emprestado'
      tags: ["Ficção"],
      pagina: "1",
    },
    {
      id: "ux-design",
      titulo: "UX Design",
      isbn: "9788575227763",
      autor: "Will Grant",
      categoria: "design",
      status: "disponivel", // 'disponivel' ou 'emprestado'
      tags: ["Ficção"],
      pagina: "1",
    },
    {
      id: "um-de-nos-esta-mentindo",
      titulo: "Um de nós está mentindo",
      isbn: "9788551001550",
      autor: "Karen McManus",
      categoria: "misterio",
      status: "disponivel",
      tags: ["Mistério", "Suspense"],
      pagina: "2",
    },
    {
      id: "logica-programacao",
      titulo: "Lógica de programação...",
      isbn: "9788575227763",
      autor: "Raphael R",
      categoria: "design",
      status: "disponivel",
      tags: ["Design", "UX", "Acadêmico"],
      pagina: "3",
    },
  ]);

  // Paginação: cada livro diz em qual página aparece (campo "pagina")
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(1, ...livros.map((l) => Number(l.pagina) || 1));
  const livrosDaPagina = livros.filter(
    (l) => (Number(l.pagina) || 1) === paginaAtual,
  );

  const closeAllOverlays = () => {
    const overlay = document.getElementById("overlay");
    const sidebar = document.getElementById("sidebar");
    if (overlay) overlay.style.display = "none";
    if (sidebar) sidebar.classList.remove("active");
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar) sidebar.classList.toggle("active");
    if (overlay) {
      overlay.style.display =
        overlay.style.display === "block" ? "none" : "block";
    }
  };

  const filterBooks = () => {
    const searchTerm =
      document.getElementById("searchInput")?.value.toLowerCase() || "";
    const cards = document.querySelectorAll(".book-card");

    cards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const author =
        card.querySelector(".author")?.textContent.toLowerCase() || "";
      if (title.includes(searchTerm) || author.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  };

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "flex";
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
  };

  return (
    <div>
      <div className="overlay" id="overlay" onClick={closeAllOverlays}></div>

      {/* Sidebar */}
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <button className="btn-close" onClick={toggleSidebar}>
            <i className="fi fi-rr-cross"></i>
          </button>
        </div>

        <div className="user-profile">
          <div className="avatar-icon">
            <i className="fi fi-sr-user"></i>
          </div>
          <div className="user-info">
            <strong>Perfil Estudante</strong>
            <span>RA Aluno: 2024001</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/home" className="nav-item">
            <i className="fi fi-rr-home"></i>
            <span>Home</span>
          </Link>
          <Link to="/perfil" className="nav-item">
            <i className="fi fi-rr-user"></i>
            <span>Perfil</span>
          </Link>
          <Link to="/historico" className="nav-item">
            <i className="fi fi-rr-time-past"></i>
            <span>Histórico de Livros</span>
          </Link>
          <Link to="/catalogo" className="nav-item active">
            <i className="fi fi-rr-book-alt"></i>
            <span>Catálogo de Livros</span>
          </Link>
        </nav>
        <div className="filters-section" style={{ display: "none" }}></div>
      </aside>

      <main className="main-content">
        <section className="top-section">
          <h1>Catálogo de Livros</h1>
          <div className="search-and-notify">
            <div className="search-box">
              <i className="fi fi-rr-search"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Pesquise por livro, autores, ISBN..."
                onKeyUp={filterBooks}
              />
            </div>
            <button
              className="btn-notification"
              onClick={() => openModal("modalNotifications")}
            >
              <i className="fi fi-rr-bell"></i>
            </button>
          </div>
        </section>

        {/*CARDS DOS LIVROS*/}
        <section className="books-grid" id="booksGrid">
          {livrosDaPagina.map((livro) => (
            <LivroCard key={livro.id} livro={livro} />
          ))}
        </section>

        {/* Paginação */}
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudar={setPaginaAtual}
        />
      </main>

      {/* MODAL DE NOTIFICAÇÕES */}
      <div
        className="modal"
        id="modalNotifications"
        style={{ display: "none" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <i className="fi fi-rr-bell"></i> Notificações
            </h3>
            <button
              className="btn-modal-close"
              onClick={() => closeModal("modalNotifications")}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <ul className="notif-list">
              <li>
                <strong>Devolução próxima:</strong> O livro{" "}
                <em>Harry Potter e o Cálice de fogo</em> deve ser devolvido até
                15/09/2026.
              </li>
              <li>
                <strong>Renovação solicitada:</strong> O pedido de renovação
                para <em>Manual de assassinato para boas garotas</em> está sob
                análise.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalogo;