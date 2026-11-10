import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Historico() {
  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Quadrados de Estatísticas (Cards) */}
        <section className="stats-section">
          {/* Card 1: Total */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">
                <i className="fi fi-rr-book-alt"></i>
                <span>Total de Livros</span>
              </div>
              <div className="circle-bg circle-gray"></div>
            </div>
            <div className="stat-body">
              <span className="stat-number" id="totalBooks">
                50
              </span>
              <span className="stat-sub">Livros até o momento</span>
            </div>
          </div>

          {/* Card 2: Limite */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">
                <i className="fi fi-rr-bookmark"></i>
                <span>Limite de empréstimos</span>
              </div>
              <div className="circle-bg circle-green"></div>
            </div>
            <div className="stat-body">
              <div className="limit-info">
                <span className="stat-number" id="borrowedLimit">
                  4
                </span>
                <span className="limit-sub">livros</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  id="progressBar"
                  style="width: 40%;"
                ></div>
              </div>
              <span className="max-info">Máx. 10</span>
            </div>
          </div>

          {/* Card 3: Atrasados */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title title-alert">
                <i className="fi fi-rr-exclamation"></i>
                <span>Livros atrasados</span>
              </div>
              <div className="circle-bg circle-red"></div>
            </div>
            <div className="stat-body">
              <span className="stat-number number-alert" id="lateBooks">
                2
              </span>
              <span className="stat-sub sub-alert">Livros em atraso</span>
            </div>
          </div>
        </section>

        {/* Barra de Filtros por Aba e Pesquisa */}
        <section className="filter-bar">
          <div className="tab-buttons">
            <button
              className="tab-btn active"
              onClick="filterTab('todos', this)"
            >
              Todos os livros
            </button>
            <button className="tab-btn" onClick="filterTab('emprestado', this)">
              Livros emprestados
            </button>
            <button className="tab-btn" onClick="filterTab('devolvido', this)">
              Devolvidos
            </button>
          </div>

          <div className="search-box">
            <i className="fi fi-rr-search"></i>
            <input
              type="text"
              id="searchInput"
              placeholder="Buscar por livros ou autores"
              onKeyUp="filterSearch()"
              required
            />
          </div>
        </section>

        {/* Lista de Livros no Histórico */}
        <section className="history-list" id="historyList">
          {/* Item 1: Atrasado */}
          <article
            className="history-card status-atrasado"
            data-status="emprestado"
            data-late="true"
          >
            <div className="card-left-border red-border"></div>
            <img
              src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
              alt="O Design do Dia a Dia"
              className="book-cover"
            />

            <div className="book-details">
              <span className="badge badge-late">• Com 2 dias de atraso</span>
              <h3 className="book-title">O Design do Dia a Dia</h3>
              <p className="book-author">Don Norman</p>

              <div className="dates-row">
                <div>
                  <span className="date-label">Emprestado</span>
                  <span className="date-value">Oct 12, 2023</span>
                </div>
                <div>
                  <span className="date-label">Data de devolução</span>
                  <span className="date-value date-red">Nov 12, 2023</span>
                </div>
              </div>
            </div>

            <div className="card-action">
              <Link
                to="/renovacao/design-dia-a-dia"
                className="btn-action btn-renovar"
              >
                Renovar
              </Link>
            </div>
          </article>

          {/* Item 2: Emprestado */}
          <article
            className="history-card"
            data-status="emprestado"
            data-late="false"
          >
            <img
              src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
              alt="Rápido e Devagar"
              className="book-cover"
            />

            <div className="book-details">
              <span className="badge badge-borrowed">• Emprestado</span>
              <h3 className="book-title">
                Rápido e Devagar: Duas Formas de Pensar
              </h3>
              <p className="book-author">Daniel Kahneman</p>

              <div className="dates-row">
                <div>
                  <span className="date-label">Emprestado</span>
                  <span className="date-value">Oct 28, 2023</span>
                </div>
                <div>
                  <span className="date-label">Data de devolução</span>
                  <span className="date-value">Nov 28, 2023</span>
                </div>
              </div>
            </div>

            <div className="card-action">
              <Link
                to="/renovacao/rapido-e-devagar"
                className="btn-action btn-renovar"
              >
                Renovar
              </Link>
            </div>
          </article>

          {/* Item 3: Devolvido */}
          <article
            className="history-card"
            data-status="devolvido"
            data-late="false"
          >
            <img
              src="https://m.media-amazon.com/images/I/71N15Eit3ML._AC_UF1000,1000_QL80_.jpg"
              alt="Sapiens"
              className="book-cover"
            />

            <div className="book-details">
              <span className="badge badge-returned">
                <i className="fi fi-rr-refresh"></i> Devolvido
              </span>
              <h3 className="book-title">
                Sapiens: Uma Breve História da Humanidade
              </h3>
              <p className="book-author">Yuval Noah Harari</p>

              <div className="dates-row">
                <div>
                  <span className="date-label">Emprestado</span>
                  <span className="date-value">Sep 01, 2023</span>
                </div>
                <div>
                  <span className="date-label">Data de devolução</span>
                  <span className="date-value">Oct 02, 2023</span>
                </div>
              </div>
            </div>

            <div className="card-action">
              <button
                className="btn-text-action"
                onClick="borrowAgain('sapiens')"
              >
                Pegar novamente
              </button>
            </div>
          </article>

          {/* Item 4: Extra (Devolvido) */}
          <article
            className="history-card extra-item"
            data-status="devolvido"
            data-late="false"
          >
            <img
              src="https://m.media-amazon.com/images/I/81180N97m0L._AC_UF1000,1000_QL80_.jpg"
              alt="Jantar Secreto"
              className="book-cover"
            />

            <div className="book-details">
              <span className="badge badge-returned">
                <i className="fi fi-rr-refresh"></i> Devolvido
              </span>
              <h3 className="book-title">Jantar Secreto</h3>
              <p className="book-author">Raphael Montes</p>

              <div className="dates-row">
                <div>
                  <span className="date-label">Emprestado</span>
                  <span className="date-value">Sep 01, 2023</span>
                </div>
                <div>
                  <span className="date-label">Data de devolução</span>
                  <span className="date-value">Oct 02, 2023</span>
                </div>
              </div>
            </div>

            <div className="card-action">
              <button
                className="btn-text-action"
                onClick="borrowAgain('jantar-secreto')"
              >
                Pegar novamente
              </button>
            </div>
          </article>

          {/* Item 5: Extra (Devolvido) */}
          <article
            className="history-card extra-item"
            data-status="devolvido"
            data-late="false"
          >
            <img
              src="https://m.media-amazon.com/images/I/71+y-f3IOfL._AC_UF1000,1000_QL80_.jpg"
              alt="O Massacre da Família Hope"
              className="book-cover"
            />

            <div className="book-details">
              <span className="badge badge-returned">
                <i className="fi fi-rr-refresh"></i> Devolvido
              </span>
              <h3 className="book-title">O Massacre da Família Hope</h3>
              <p className="book-author">Riley Sager</p>

              <div className="dates-row">
                <div>
                  <span className="date-label">Emprestado</span>
                  <span className="date-value">Sep 01, 2023</span>
                </div>
                <div>
                  <span className="date-label">Data de devolução</span>
                  <span className="date-value">Oct 02, 2023</span>
                </div>
              </div>
            </div>

            <div className="card-action">
              <button
                className="btn-text-action"
                onClick="borrowAgain('massacre-familia-hope')"
              >
                Pegar novamente
              </button>
            </div>
          </article>
        </section>

        {/* Botão Ver Mais */}
        <div className="see-more-container" id="seeMoreContainer">
          <button className="btn-see-more" onClick="showAllBooks()">
            Ver mais ...
          </button>
        </div>
      </main>
    </div>
  );
}

export default Historico;
