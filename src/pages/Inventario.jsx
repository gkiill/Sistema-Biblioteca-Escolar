import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Inventario() {
  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Gestão de estoque</h1>
            <p className="page-subtitle">
              Rastreie, gerencie e audite recursos de biblioteca.
            </p>
          </div>
          <Link to="/cadastrolivro" className="btn-add-resource">
            <i className="fi fi-rr-plus"></i> Adicionar novo livro
          </Link>
        </header>

        {/* Cards de Métricas (Dashboard) */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-info">
              <span className="metric-label">TOTAL DO ESTOQUE</span>
              <strong className="metric-value" id="statTotal">
                0
              </strong>
              <span className="metric-sub positive">+12 nesse mês</span>
            </div>
            <div className="metric-icon-bg">
              <i className="fi fi-rr-document"></i>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <span className="metric-label">JÁ DISPONÍVEL</span>
              <strong className="metric-value" id="statAvailable">
                0
              </strong>
              <span className="metric-sub" id="statAvailablePercent">
                0% do total
              </span>
            </div>
            <div className="metric-icon-bg success-bg">
              <i className="fi fi-rr-check-circle"></i>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <span className="metric-label">ATUALMENTE EM EMPRÉSTIMO</span>
              <strong className="metric-value" id="statBorrowed">
                0
              </strong>
              <span className="metric-sub negative" id="statOverdue">
                0 Atrasados
              </span>
            </div>
            <div className="metric-icon-bg warning-bg">
              <i className="fi fi-rr-time-fast"></i>
            </div>
          </div>
        </section>

        {/* Barra de Filtros */}
        <section className="filter-bar">
          <div className="search-box">
            <i className="fi fi-rr-search"></i>
            <input
              type="text"
              id="searchInput"
              placeholder="Pesquise por título, autor ou ISBN..."
              onChange="handleFilter()"
              required
            />
          </div>

          <div className="filter-buttons">
            <select
              id="categoryFilter"
              className="btn-filter-select"
              onChange="handleFilter()"
            >
              <option value="ALL">Todas as categorias</option>
              <option value="Design">Design</option>
              <option value="Ciência da Computação">
                Ciência da Computação
              </option>
              <option value="Suspense">Suspense</option>
              <option value="Romance">Romance</option>
              <option value="Ficção Científica">Ficção Científica</option>
              <option value="História">História</option>
            </select>

            <button
              className="btn-filter-tag"
              data-status="disponivel"
              onClick="toggleStatusFilter(this)"
            >
              Disponível
            </button>
            <button
              className="btn-filter-tag"
              data-status="emprestado"
              onClick="toggleStatusFilter(this)"
            >
              Emprestado
            </button>
            <button
              className="btn-filter-tag status-atrasado"
              data-status="atrasado"
              onClick="toggleStatusFilter(this)"
            >
              Atrasado
            </button>
          </div>
        </section>

        {/* Tabela de Inventário */}
        <section className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>TÍTULO E DETALHES</th>
                <th>CATEGORIA</th>
                <th>STATUS</th>
                <th>ÚLTIMA ATIVIDADE</th>
              </tr>
            </thead>
            <tbody id="inventoryTableBody">
              {/* Conteúdo gerado via JS */}
            </tbody>
          </table>

          {/* Rodapé com Paginação */}
          <footer className="table-footer">
            <span className="table-info" id="tableRecordInfo">
              Exibindo 0 registros
            </span>

            <div className="pagination" id="paginationControls">
              {/* Botões gerados via JS */}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Inventario;
