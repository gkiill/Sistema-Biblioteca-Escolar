import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function gerarCapaFallbackSvg(titulo, autor) {
  const safeTitle = String(titulo || "Livro").replace(/[<>&"]/g, "").slice(0, 26);
  const safeAuthor = String(autor || "Biblioteca Paulo Freire").replace(/[<>&"]/g, "").slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="340" viewBox="0 0 240 340"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f2b4c"/><stop offset="100%" stop-color="#1e40af"/></linearGradient></defs><rect width="240" height="340" rx="10" fill="url(#g)"/><rect x="12" y="12" width="216" height="316" rx="8" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/><text x="120" y="120" font-size="44" text-anchor="middle">📖</text><text x="120" y="180" fill="#ffffff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">${safeTitle}</text><text x="120" y="208" fill="#cbd5e1" font-size="11" font-family="sans-serif" text-anchor="middle">${safeAuthor}</text><text x="120" y="295" fill="#93c5fd" font-size="10" font-family="sans-serif" text-anchor="middle">Biblioteca Paulo Freire</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Mapeia ISBNs brasileiros sem capa na Open Library para a edição internacional equivalente com capa verificada
const OPENLIBRARY_ISBN_FALLBACK = {
  "9788535909555": "9780451526342", // A Revolução dos Bichos
  "9788575226506": "9781617292231", // Algoritmos e Estruturas de Dados
  "9788551007426": "9781984896407", // Boa Garota, Segredo Mortal
  "9788551006764": "9781984896360", // Manual de Assassinato para Boas Garotas
  "9788543005850": "9780132126953", // Redes de Computadores (Tanenbaum)
  "9788575227244": "9780134757599", // Refatoração (Martin Fowler)
  "9788501119056": "9780525707967", // Um de Nós É o Próximo
  "9788575226162": "9781788837361", // UX Design: 101 Regras Práticas (Will Grant)
  "9788575227749": "9780321965516", // UX Design Avançado
};

export function resolverCapaLivro(livro) {
  const titulo = livro.title ?? livro.titulo ?? "Livro";
  const autor = livro.author?.name ?? livro.autor?.nome ?? livro.autor ?? "";
  const fallback = gerarCapaFallbackSvg(titulo, autor);
  const capaBruta = livro.capa_url ?? livro.capa ?? "";

  if (capaBruta && !capaBruta.includes("amazon") && !capaBruta.includes("via.placeholder")) {
    return { primary: capaBruta, fallback };
  }

  const isbnLimpo = String(livro.isbn ?? "").replace(/\D/g, "");
  if (isbnLimpo) {
    const isbnCapa = OPENLIBRARY_ISBN_FALLBACK[isbnLimpo] || isbnLimpo;
    return {
      primary: `https://covers.openlibrary.org/b/isbn/${isbnCapa}-M.jpg?default=false`,
      fallback,
    };
  }

  return { primary: fallback, fallback };
}

export default function LivroCard({ livro, onClick }) {
  const navigate = useNavigate();

  const titulo = livro.title ?? livro.titulo ?? "Sem título";
  const autor = livro.author?.name ?? livro.autor?.nome ?? livro.autor ?? "Autor desconhecido";

  const amount = livro.amount ?? livro.quantidade;
  const emprestados = livro.emprestimos_ativos_count ?? 0;
  const isDisponivel =
    amount !== undefined ? Number(amount) > Number(emprestados) : livro.status === "disponivel";

  const tags =
    Array.isArray(livro.categories) && livro.categories.length > 0
      ? livro.categories.map((c) => c.name ?? c.nome)
      : Array.isArray(livro.tags) && livro.tags.length > 0
      ? livro.tags
      : ["Acervo"];

  const { primary, fallback } = resolverCapaLivro(livro);
  const [imgSrc, setImgSrc] = useState(primary);

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
      data-status={isDisponivel ? "disponivel" : "emprestado"}
      data-category={livro.categoria ?? tags[0]}
      onClick={abrirLivro}
    >
      <div className="cover-wrapper">
        <span
          className={`badge badge-${isDisponivel ? "available" : "borrowed"}`}
        >
          • {isDisponivel ? "Disponível" : "Emprestado"}
        </span>
        <img
          src={imgSrc}
          alt={titulo}
          loading="lazy"
          onError={() => {
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />
      </div>
      <h3>{titulo}</h3>
      <p className="author">{autor}</p>
      <div className="tags">
        {tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}