import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  return (
    <div>
      {/*Home do usuário aluno/professor*/}
      {/* Overlay para escurecer o fundo quando o menu ou modal estiver aberto */}
      <div className="overlay" id="overlay" onClick="closeAllOverlays()"></div>

      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Cabeçalho e Busca */}
        <section className="top-section">
          <h1>Descubra novos livros</h1>
          <div className="search-and-notify">
            <div className="search-box">
              <i className="fi fi-rr-search"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Pesquise por livro, autores, ISBN..."
                onKeyUp="filterBooks()"
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

        {/* Carrossel / Grade de Livros */}
        <section className="books-section">
          <div className="section-header">
            <h2>Recomendações para você</h2>
            <Link to="/catalogo" className="link-more">
              Ver mais &rsaquo;
            </Link>
          </div>

          <div className="books-grid" id="booksGrid">
            {/* Card 1 */}
            <article className="book-card" onClick="goToBook('harry-potter')">
              <div className="cover-wrapper">
                <span className="badge badge-borrowed">• Emprestado</span>
                <img
                  src="https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg"
                  alt="Harry Potter e o Cálice de Fogo"
                />
              </div>
              <h3>Harry Potter e o Cálice de fogo</h3>
              <p className="author">J.K Rowling</p>
              <div className="tags">
                <span className="tag">Ficção</span>
              </div>
            </article>

            {/* Card 2 */}
            <article className="book-card" onClick="goToBook('ux-design')">
              <div className="cover-wrapper">
                <span className="badge badge-available">• Disponível</span>
                <img
                  src="https://m.media-amazon.com/images/I/6113p03+Y6L._AC_UF1000,1000_QL80_.jpg"
                  alt="UX Design"
                />
              </div>
              <h3>UX Desing</h3>
              <p className="author">Will Grant</p>
              <div className="tags">
                <span className="tag">Desing</span>
                <span className="tag">UX</span>
                <span className="tag">Acadêmico</span>
              </div>
            </article>

            {/* Card 3 */}
            <article
              className="book-card"
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

            {/* Card 4 */}
            <article
              className="book-card"
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
                <span className="tag">Desing</span>
                <span className="tag">UX</span>
                <span className="tag">Acadêmico</span>
              </div>
            </article>

            {/* Card 5 */}
            <article
              className="book-card"
              onClick="goToBook('manual-de-assassinato')"
            >
              <div className="cover-wrapper">
                <span className="badge badge-borrowed">• Emprestado</span>
                <img
                  src="https://m.media-amazon.com/images/I/81180N97m0L._AC_UF1000,1000_QL80_.jpg"
                  alt="Manual de assassinato para boas garotas"
                />
              </div>
              <h3>Manual de assassinato...</h3>
              <p className="author">Holly Jackson</p>
              <div className="tags">
                <span className="tag">Ficção</span>
              </div>
            </article>
          </div>
        </section>

        {/* Cards de Atalho / Informações */}
        <section className="info-cards-section">
          <div className="info-card">
            <div className="card-icon-wrapper">
              <i className="fi fi-rs-calendar-day"></i>
            </div>
            <div className="card-body">
              <h3>Datas de devoluções</h3>
              <p>Saiba quando você precisa fazer a devolução dos seus livros</p>
            </div>
            <div className="card-footer">
              <span className="date-info">Hoje é 02/09/2026</span>
              <button
                type="button"
                className="btn-action"
                onClick="openModal('modalDates')"
              >
                Ver datas
              </button>
            </div>
          </div>

          <div className="info-card">
            <div className="card-icon-wrapper">
              <i className="fi fi-rs-book-bookmark"></i>
            </div>
            <div className="card-body">
              <h3>Como renovar seus livros?</h3>
              <p>
                Saiba como fazer a renovação dos seus livros que precisam de
                mais tempo para ler.
              </p>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn-action"
                onClick="openModal('modalRenewInfo')"
              >
                Ver informações
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* MODAIS */}

      {/* Modal 1: Notificações */}
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

      {/* Modal 2: Datas de Devoluções */}
      <div className="modal" id="modalDates">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <i className="fi fi-rs-calendar-day"></i> Datas de Devolução
            </h3>
            <button
              className="btn-modal-close"
              onClick="closeModal('modalDates')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="calendar-preview">
              <p className="calendar-month">Setembro 2026</p>
              <div className="calendar-grid">
                <span>Dom</span>
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span className="empty"></span>
                <span className="empty"></span>
                <span>1</span>
                <span className="today">2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span className="due-date">15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span className="due-date">20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
              </div>
            </div>
            <div className="dates-details">
              <h4>Livros emprestados:</h4>
              <ul>
                <li>
                  <strong>Harry Potter e o Cálice de fogo:</strong> 15/09/2026
                </li>
                <li>
                  <strong>Manual de assassinato para boas garotas:</strong>{" "}
                  20/09/2026
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 3: Informações de Renovação */}
      <div className="modal" id="modalRenewInfo">
        <div className="modal-content">
          <div className="modal-header">
            <h3>
              <i className="fi fi-rs-book-bookmark"></i> Como renovar seus
              livros
            </h3>
            <button
              className="btn-modal-close"
              onClick="closeModal('modalRenewInfo')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>
              Alunos e professores podem realizar a solicitação de renovação
              diretamente pelo sistema através de sua conta acadêmica.
            </p>
            <br></br>
            <p>
              <strong>Atenção:</strong> Após realizar a solicitação digital, é
              obrigatório comparecer presencialmente à biblioteca munido do
              livro para validação final junto ao bibliotecário.
            </p>
          </div>
        </div>
      </div>

      {/*Home do usuário bibliotecário*/}
      
      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Topo: Título e Busca */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Visão geral</h1>
            <p className="page-subtitle">Veja a visão geral de hoje:</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <i className="fi fi-rr-search"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Pesquise por livros, atividades ..."
                onKeyUp="handleSearch()"
              />
            </div>
            <button className="btn-icon" title="Notificações">
              <i className="fi fi-rr-bell"></i>
            </button>
          </div>
        </div>

        {/* Cards Principais de Estatísticas */}
        <section className="stats-grid">
          {/* Card 1: Empréstimos de Hoje */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">EMPRÉSTIMOS DE HOJE</span>
              <div className="icon-circle circle-blue">
                <i className="fi fi-rr-refresh"></i>
              </div>
            </div>
            <div className="stat-value">8</div>
          </div>

          {/* Card 2: Devoluções Pendentes */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">DEVOLUÇÕES PENDENTES</span>
              <div className="icon-circle circle-red-light">
                <i className="fi fi-rr-exclamation"></i>
              </div>
            </div>
            <div className="stat-body">
              <span className="stat-value">5</span>
              <span className="stat-sub">Com vencimento para hoje</span>
            </div>
          </div>

          {/* Card 3: Novos Membros */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">NOVOS MEMBROS</span>
              <div className="icon-circle circle-blue-light">
                <i className="fi fi-rr-user-add"></i>
              </div>
            </div>
            <div className="stat-body">
              <span className="stat-value">15</span>
              <span className="stat-sub">Essa semana</span>
            </div>
          </div>
        </section>

        {/* Grid Inferior: Atividades Recentes e Atenção Necessária */}
        <div className="bottom-grid">
          {/* Painel de Atividades Recentes */}
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">Atividades recentes</h2>
              <Link to="/inventario" className="link-see-all">
                Ver tudo
              </Link>
            </div>

            <div className="activity-list" id="activityList">
              <div className="activity-item">
                <div className="activity-icon icon-green">
                  <i className="fi fi-rr-check"></i>
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>Sarah Jenkins</strong> devolveu{" "}
                    <em>O Design do Dia a Dia</em>
                  </p>
                  <span className="activity-time">10 mins atrás</span>
                </div>
                <span className="badge badge-return">Devolvido</span>
              </div>

              <div className="activity-item">
                <div className="activity-icon icon-blue">
                  <i className="fi fi-rr-bookmark"></i>
                </div>
                <div className="activity-info">
                  <p className="activity-text">
                    <strong>Michael Chen</strong> pegou emprestado{" "}
                    <em>Clean Code</em>
                  </p>
                  <span className="activity-time">25 mins atrás</span>
                </div>
                <span className="badge badge-borrow">Empréstimo</span>
              </div>
            </div>
          </section>

          {/* Painel de Atenção Necessária */}
          <section className="section-card">
            <h2 className="section-title">Atenção necessária</h2>

            <div className="alert-box">
              <div className="alert-header">
                <i className="fi fi-rr-triangle-warning alert-icon"></i>
                <div>
                  <strong className="alert-title">Itens em atraso (3)</strong>
                  <p className="alert-desc">Requer acompanhamento imediato.</p>
                </div>
              </div>
              <button className="btn-alert" onClick="goToOverdue()">
                Revisar agora
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
