import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; // Importação do serviço axios

export default function Inventario() {
  const { usuario } = useAuth(); // Obtém o usuário logado corretamente
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);

    api
      .get("/livros") // Ajuste para a rota correta do seu back-end de inventário/livros
      .then(({ data }) => {
        if (!ativo) return;
        const lista = Array.isArray(data) ? data : (data?.data ?? []);
        setLivros(lista);
        setErro(null);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar o inventário de livros.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []); // Executa ao carregar a página

  if (!usuario) return null;

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

        {/* Mensagem de Erro ou Aviso */}
        {erro && <div className="error-banner" style={{ color: "red", marginBottom: "16px" }}>{erro}</div>}

        {/* Cards de Métricas (Dashboard) */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-info">
              <span className="metric-label">TOTAL DO ESTOQUE</span>
              <strong className="metric-value" id="statTotal">
                {livros.length}
              </strong>
              <span className="metric-sub positive">Atualizado</span>
            </div>
            <div className="metric-icon-bg">
              <i className="fi fi-rr-document"></i>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <span className="metric-label">JÁ DISPONÍVEL</span>
              <strong className="metric-value" id="statAvailable">
                {livros.filter(l => l.status === 'disponivel').length}
              </strong>
              <span className="metric-sub" id="statAvailablePercent">
                {livros.length > 0 ? Math.round((livros.filter(l => l.status === 'disponivel').length / livros.length) * 100) : 0}% do total
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
                {livros.filter(l => l.status === 'emprestado' || l.status === 'atrasado').length}
              </strong>
              <span className="metric-sub negative" id="statOverdue">
                {livros.filter(l => l.status === 'atrasado').length} Atrasados
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
            />
          </div>

          <div className="filter-buttons">
            <select
              id="categoryFilter"
              className="btn-filter-select"
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

            <button className="btn-filter-tag" data-status="disponivel">
              Disponível
            </button>
            <button className="btn-filter-tag" data-status="emprestado">
              Emprestado
            </button>
            <button className="btn-filter-tag status-atrasado" data-status="atrasado">
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
              {carregando ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    Carregando inventário...
                  </td>
                </tr>
              ) : livros.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    Nenhum livro encontrado no estoque.
                  </td>
                </tr>
              ) : (
                livros.map((livro) => (
                  <tr key={livro.id}>
                    <td>{livro.titulo}</td>
                    <td>{livro.categoria}</td>
                    <td>{livro.status}</td>
                    <td>{livro.updated_at ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Rodapé com Paginação */}
          <footer className="table-footer">
            <span className="table-info" id="tableRecordInfo">
              Exibindo {livros.length} registros
            </span>

            <div className="pagination" id="paginationControls"></div>
          </footer>
        </section>
      </main>
    </div>
  );
}