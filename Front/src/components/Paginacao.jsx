function montarItens(paginaAtual, totalPaginas) {
  if (totalPaginas <= 5) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  // sempre mostra a primeira, a última e a atual com uma vizinha de cada lado
  const numeros = [
    ...new Set([1, totalPaginas, paginaAtual - 1, paginaAtual, paginaAtual + 1]),
  ]
    .filter((n) => n >= 1 && n <= totalPaginas)
    .sort((a, b) => a - b);

  const itens = [];
  numeros.forEach((n, i) => {
    if (i > 0 && n - numeros[i - 1] > 1) itens.push("dots");
    itens.push(n);
  });
  return itens;
}

export default function Paginacao({ paginaAtual, totalPaginas, onMudar }) {
  // com uma página só não há o que paginar
  if (totalPaginas <= 1) return null;

  const itens = montarItens(paginaAtual, totalPaginas);

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-btn page-nav"
        onClick={() => onMudar(paginaAtual - 1)}
        disabled={paginaAtual <= 1}
      >
        Anterior
      </button>

      {itens.map((item, i) =>
        item === "dots" ? (
          <span key={`dots-${i}`} className="dots">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`page-btn page-num ${item === paginaAtual ? "active" : ""}`}
            onClick={() => onMudar(item)}
            aria-current={item === paginaAtual ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className="page-btn page-nav"
        onClick={() => onMudar(paginaAtual + 1)}
        disabled={paginaAtual >= totalPaginas}
      >
        Próximo
      </button>
    </div>
  );
}