import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { resolverCapaLivro } from "../components/LivroCard";

function Livro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(null);
  const [coverSrc, setCoverSrc] = useState("");
  const [fallbackSrc, setFallbackSrc] = useState("");

  useEffect(() => {
    let ativo = true;
    setErro(null);

    api
      .get(`/livros/${id}`)
      .then(({ data }) => {
        if (!ativo) return;
        setLivro(data);
        const { primary, fallback } = resolverCapaLivro(data);
        setCoverSrc(primary);
        setFallbackSrc(fallback);
      })
      .catch(() => {
        if (ativo) setErro("Livro não encontrado no acervo.");
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  const titulo = erro || livro?.title || livro?.titulo || "Carregando...";
  const autor = livro?.author?.name || livro?.autor?.nome || "";
  const isbn = livro?.isbn || "";
  const ano = livro?.year ? String(livro.year) : livro?.ano_publicacao ? String(livro.ano_publicacao) : "";
  const categorias = livro?.categories || livro?.categorias || [];
  const categoriaPrincipal = categorias.length > 0 ? (categorias[0].name || categorias[0].nome) : "Geral";
  const sinopse = livro?.synopsis || livro?.sinopse || "Sem sinopse cadastrada.";

  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Botão Voltar */}
        <div className="top-actions">
          <button className="btn-back" onClick={() => navigate("/catalogo")}>
            <div className="btn-back-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
            <span>Voltar</span>
          </button>
        </div>

        {/* Grid do Livro */}
        <div className="book-details-grid">
          {/* Coluna Esquerda: Capa com Borda Pontoada */}
          <div className="left-column">
            <div className="cover-wrapper">
              {coverSrc && (
                <img
                  id="bookCover"
                  src={coverSrc}
                  alt={titulo}
                  onError={() => {
                    if (coverSrc !== fallbackSrc) setCoverSrc(fallbackSrc);
                  }}
                />
              )}
            </div>
          </div>

          {/* Coluna Direita: Formulários e Dados */}
          <div className="right-column">
            {/* Card: Informações Principais */}
            <section className="card">
              <h1 className="book-title" id="bookTitle">
                {titulo}
              </h1>

              <div className="form-row">
                <div className="form-group">
                  <label>Autor(a)</label>
                  <input type="text" id="bookAuthor" value={autor} readOnly />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input type="text" id="bookIsbn" value={isbn} readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exemplares</label>
                  <input type="text" id="bookPublisher" value={livro ? `${livro.amount ?? 1} exemplar(es)` : ""} readOnly />
                </div>
                <div className="form-group">
                  <label>Ano de publicação</label>
                  <input type="text" id="bookPublicationDate" value={ano} readOnly />
                </div>
              </div>
            </section>

            {/* Card: Classificação */}
            <section className="card">
              <div className="card-title-group">
                <i className="fi fi-rr-boxes"></i>
                <h2>Classificação</h2>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria principal</label>
                  <input type="text" id="bookCategory" value={livro ? categoriaPrincipal : ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-container" id="bookTags">
                    {categorias.map((c) => (
                      <span key={c.id} className="tag-item">
                        {c.name || c.nome}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Card: Sinopse */}
            <section className="card">
              <div className="card-title-group">
                <i className="fi fi-rr-document"></i>
                <h2>Sinopse</h2>
              </div>

              <div className="synopsis-box">
                <p id="bookSynopsis">{sinopse}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Livro;
