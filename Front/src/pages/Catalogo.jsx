import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Catalogo() {
  return (
    <div>
      <div className="overlay" id="overlay" onClick="closeAllOverlays()"></div>

      {/* Sidebar com Filtros Incorporados */}
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
            <span>Catálago de Livros</span>
          </Link>
        </nav>

        {/* Seção de Filtros */}
        <div className="filters-section">
          <span className="filter-title-main">FILTROS</span>

          <div className="filter-group">
            <label className="filter-label">Categoria</label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="ficcao"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Ficção (124)
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="design"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Acadêmico (342)
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="misterio"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Suspense (89)
            </label>
          </div>

          <div className="filter-group">
            <label className="filter-label">Livros Disponíveis</label>
            <select
              className="select-filter"
              id="subjectSelect"
              onChange="filterBooks()"
            >
              <option value="todos">Todos os Livros</option>
              <option value="ficcao">Ficção</option>
              <option value="design">Design / UX / Acadêmico</option>
              <option value="misterio">Mistério / Suspense</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Disponibilidade</label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="disponivel"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Disponível
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="emprestado"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Emprestados
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                value="atrasado"
                onChange="filterBooks()"
                required
              />
              <span className="checkmark"></span>
              Atrasados
            </label>
          </div>
        </div>
      </aside>

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <button className="btn-menu" onClick={toggleSidebar}>
            <i className="fi fi-rr-menu-burger"></i>
          </button>
        </div>
        <div className="nav-right">
          <span className="brand">Biblioteca Paulo Freire</span>
          <span className="divider">|</span>
          <Link to="/login" className="link-logout">
            SAIR
          </Link>
        </div>
      </header>

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
                onKeyUp="filterBooks()"
                required
              />
            </div>
            <button
              className="btn-notification"
              onClick="openModal('modalNotifications')"
            >
              <i className="fi fi-rr-bell"></i>
            </button>
          </div>
        </section>

        {/* Grid de Livros */}
        <section className="books-grid" id="booksGrid">
          {/* PÁGINA 1 */}
          <article
            className="book-card clickable"
            data-page="1"
            data-status="emprestado"
            data-category="ficcao"
            onClick="goToBook('harry-potter')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-borrowed">• Emprestado</span>
              <img
                src="https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg"
                alt="Harry Potter"
              />
            </div>
            <h3>Harry Potter e o Cálice de fogo</h3>
            <p className="author">J.K Rowling</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('ux-design')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
                alt="UX Design"
              />
            </div>
            <h3>UX Design</h3>
            <p className="author">Will Grant</p>
            <div className="tags">
              <span className="tag">Design</span>
              <span className="tag">UX</span>
              <span className="tag">Acadêmico</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="misterio"
            onClick="goToBook('um-de-nos-esta-mentindo')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/71N15Eit3ML._AC_UF1000,1000_QL80_.jpg"
                alt="Um de nós está mentindo"
              />
            </div>
            <h3>Um de nós está mentindo</h3>
            <p className="author">Karen McManus</p>
            <div className="tags">
              <span className="tag">Mistério</span>
              <span className="tag">Suspense</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('logica-programacao')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/71+y-f3IOfL._AC_UF1000,1000_QL80_.jpg"
                alt="Lógica de programação"
              />
            </div>
            <h3>Lógica de programação...</h3>
            <p className="author">Raphael R</p>
            <div className="tags">
              <span className="tag">Design</span>
              <span className="tag">UX</span>
              <span className="tag">Acadêmico</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="emprestado"
            data-category="ficcao"
            onClick="goToBook('manual-de-assassinato')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-borrowed">• Emprestado</span>
              <img
                src="https://m.media-amazon.com/images/I/81180N97m0L._AC_UF1000,1000_QL80_.jpg"
                alt="Manual de assassinato"
              />
            </div>
            <h3>Manual de assassinato...</h3>
            <p className="author">J.K Rowling</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="emprestado"
            data-category="ficcao"
            onClick="goToBook('harry-potter')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-borrowed">• Emprestado</span>
              <img
                src="https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg"
                alt="Harry Potter"
              />
            </div>
            <h3>Harry Potter e o Cálice de fogo</h3>
            <p className="author">J.K Rowling</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('ux-design')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
                alt="UX Design"
              />
            </div>
            <h3>UX Design</h3>
            <p className="author">Will Grant</p>
            <div className="tags">
              <span className="tag">Design</span>
              <span className="tag">UX</span>
              <span className="tag">Acadêmico</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="misterio"
            onClick="goToBook('um-de-nos-esta-mentindo')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/71N15Eit3ML._AC_UF1000,1000_QL80_.jpg"
                alt="Um de nós está mentindo"
              />
            </div>
            <h3>Um de nós está mentindo</h3>
            <p className="author">Karen McManus</p>
            <div className="tags">
              <span className="tag">Mistério</span>
              <span className="tag">Suspense</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('logica-programacao')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/71+y-f3IOfL._AC_UF1000,1000_QL80_.jpg"
                alt="Lógica de programação"
              />
            </div>
            <h3>Lógica de programação...</h3>
            <p className="author">Raphael R</p>
            <div className="tags">
              <span className="tag">Design</span>
              <span className="tag">UX</span>
              <span className="tag">Acadêmico</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="1"
            data-status="emprestado"
            data-category="ficcao"
            onClick="goToBook('manual-de-assassinato')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-borrowed">• Emprestado</span>
              <img
                src="https://m.media-amazon.com/images/I/81180N97m0L._AC_UF1000,1000_QL80_.jpg"
                alt="Manual de assassinato"
              />
            </div>
            <h3>Manual de assassinato...</h3>
            <p className="author">J.K Rowling</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>

          {/* PÁGINA 2 */}
          <article
            className="book-card clickable"
            data-page="2"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('ux-design')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
                alt="UX Design"
              />
            </div>
            <h3>UX Desing - Avançado</h3>
            <p className="author">Will Grant</p>
            <div className="tags">
              <span className="tag">Design</span>
              <span className="tag">UX</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="2"
            data-status="emprestado"
            data-category="misterio"
            onClick="goToBook('um-de-nos-esta-mentindo')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-borrowed">• Emprestado</span>
              <img
                src="https://m.media-amazon.com/images/I/71N15Eit3ML._AC_UF1000,1000_QL80_.jpg"
                alt="Um de nós está mentindo"
              />
            </div>
            <h3>Um de nós é o próximo</h3>
            <p className="author">Karen McManus</p>
            <div className="tags">
              <span className="tag">Mistério</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="2"
            data-status="disponivel"
            data-category="ficcao"
            onClick="goToBook('harry-potter')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg"
                alt="Harry Potter"
              />
            </div>
            <h3>Harry Potter e a Ordem da Fênix</h3>
            <p className="author">J.K Rowling</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>

          {/* PÁGINA 3 */}
          <article
            className="book-card clickable"
            data-page="3"
            data-status="disponivel"
            data-category="design"
            onClick="goToBook('logica-programacao')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/71+y-f3IOfL._AC_UF1000,1000_QL80_.jpg"
                alt="Lógica de programação"
              />
            </div>
            <h3>Algoritmos e Estrutura de Dados</h3>
            <p className="author">Raphael R</p>
            <div className="tags">
              <span className="tag">Acadêmico</span>
            </div>
          </article>

          <article
            className="book-card clickable"
            data-page="3"
            data-status="disponivel"
            data-category="ficcao"
            onClick="goToBook('manual-de-assassinato')"
          >
            <div className="cover-wrapper">
              <span className="badge badge-available">• Disponível</span>
              <img
                src="https://m.media-amazon.com/images/I/81180N97m0L._AC_UF1000,1000_QL80_.jpg"
                alt="Boa Garota, Segredo Mortal"
              />
            </div>
            <h3>Boa Garota, Segredo Mortal</h3>
            <p className="author">Holly Jackson</p>
            <div className="tags">
              <span className="tag">Ficção</span>
            </div>
          </article>
        </section>

        {/* Paginação */}
        <div className="pagination">
          <button className="page-btn page-nav" onClick="changePage('prev')">
            Anterior
          </button>
          <button className="page-btn page-num active" onClick="setPage(this)">
            1
          </button>
          <button className="page-btn page-num" onClick="setPage(this)">
            2
          </button>
          <button className="page-btn page-num" onClick="setPage(this)">
            3
          </button>
          <span className="dots">...</span>
          <button className="page-btn page-nav" onClick="changePage('next')">
            Próximo
          </button>
        </div>
      </main>

      {/* MODAL DE NOTIFICAÇÕES */}
      <div className="modal" id="modalNotifications">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <i className="fi fi-rr-bell"></i> Notificações
            </h3>
            <button
              className="btn-modal-close"
              onClick="closeModal('modalNotifications')"
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
