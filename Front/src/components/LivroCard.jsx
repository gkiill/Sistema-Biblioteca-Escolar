import { useNavigate } from "react-router-dom";


export default function LivroCard({ livro, onClick }) {
  const navigate = useNavigate();

  const isDisponivel = livro.status === "disponivel";
  const autor = livro.autor?.nome ?? livro.autor;

  // Usa a capa cadastrada; se não houver, tenta a do Open Library pelo ISBN
  const capa =
    livro.capa ??
    (livro.isbn
      ? `https://covers.openlibrary.org/b/isbn/${livro.isbn}-S.jpg`
      : null);

  function abrirLivro() {
    if (onClick) {
      onClick(livro);
    } else {
      navigate(`/livro/${livro.id}`);
    }
  }

  return (
    <article
      className="book-card clickable"
      data-page={livro.pagina}
      data-status={livro.status}
      data-category={livro.categoria}
      onClick={abrirLivro}
    >
      <div className="cover-wrapper">
        <span
          className={`badge badge-${isDisponivel ? "available" : "borrowed"}`}
        >
          • {isDisponivel ? "Disponível" : "Emprestado"}
        </span>
        {capa ? (
          <img src={capa} alt={livro.titulo} />
        ) : (
          // sem capa e sem ISBN: quadrado com ícone no lugar da imagem
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "var(--color-surface-alt)",
              color: "var(--color-text-faint)",
            }}
          >
            <i className="fi fi-rr-book-alt"></i>
          </div>
        )}
      </div>
      <h3>{livro.titulo}</h3>
      <p className="author">{autor}</p>
      <div className="tags">
        {(livro.tags ?? []).map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}