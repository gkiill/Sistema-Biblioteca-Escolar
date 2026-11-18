import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/* Rotas do Laravel usadas nesta página.
   - listar: já existe no api.php (GET emprestimos).
   - renovar e pegarNovamente: AINDA NÃO existem como pedidos do aluno/professor;
     o back-end precisa criar/ajustar (ou você muda os caminhos aqui, em um lugar só). */
const ROTAS = {
  listar: "/emprestimos",
  renovar: (id) => `/emprestimos/${id}/renovacao`,
  pegarNovamente: "/emprestimos",
};

const LIMITE_EMPRESTIMOS = 10;
const POR_PAGINA = 5; 
const MS_DIA = 24 * 60 * 60 * 1000;

const TEXTOS_ACAO = {
  renovar: {
    titulo: "Renovar empréstimo",
    pergunta: "Deseja enviar um pedido de renovação para o livro",
    botao: "Pedir renovação",
    sucesso: "Pedido de renovação enviado com sucesso!",
  },
  novamente: {
    titulo: "Pegar novamente",
    pergunta: "Deseja fazer um novo pedido de empréstimo do livro",
    botao: "Fazer pedido",
    sucesso: "Pedido de empréstimo enviado com sucesso!",
  },
};

/* Funções auxiliares*/

/** Converte "2026-11-16" (ou ISO) em Date no fuso local. Evita o erro de "um dia a menos". */
function paraData(valor) {
  if (!valor) return null;
  const texto = String(valor);
  const partes = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (partes) {
    return new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  }
  const data = new Date(texto);
  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarData(data) {
  return data ? data.toLocaleDateString("pt-BR") : "—";
}

/** Tira acentos e deixa minúsculo, para a busca achar "Crônica" digitando "cronica". */
function simplificar(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Transforma o empréstimo que a API devolve no formato usado pela tela.
 * Se a sua API usa outros nomes de campo, ajuste SÓ aqui.
 */
function normalizarEmprestimo(e, hoje) {
  const livro = e.livro ?? {};
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const statusBruto = String(e.status ?? e.situacao ?? "").toLowerCase();
  const devolvido = statusBruto.includes("devolv");

  const retirada = paraData(e.data_retirada ?? e.dataRetirada);
  const devolucao = paraData(e.data_devolucao ?? e.dataDevolucao);

  // dias de atraso: usa o que a API mandou; se não mandou, calcula pela data
  let diasAtraso = 0;
  if (!devolvido) {
    if (Number(e.dias_atraso) > 0) {
      diasAtraso = Number(e.dias_atraso);
    } else if (devolucao && devolucao < inicioHoje) {
      diasAtraso = Math.round((inicioHoje - devolucao) / MS_DIA);
    }
  }

  return {
    id: e.id,
    isbn: livro.isbn ?? e.isbn ?? e.livro_isbn ?? e.livro_id,
    titulo: livro.titulo ?? e.titulo ?? "Livro sem título",
    autor: livro.autor?.nome ?? livro.autor ?? e.autor ?? "",
    capa: livro.capa_url ?? livro.capa ?? e.capa_url ?? e.capa ?? null,
    retirada,
    devolucao,
    devolvido,
    diasAtraso,
    atrasado: diasAtraso > 0,
  };
}


/* Peças da tela*/
function Capa({ capa, titulo }) {
  if (capa) {
    return <img src={capa} alt={titulo} className="book-cover" />;
  }
  // sem capa cadastrada: mostra um quadrado com ícone, com o mesmo tamanho da capa
  return (
    <div
      className="book-cover"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-surface-alt)",
        color: "var(--color-text-faint)",
      }}
    >
      <i className="fi fi-rr-book-alt"></i>
    </div>
  );
}

function CartaoEmprestimo({ item, onRenovar, onPegarNovamente }) {
  const classeCartao = item.atrasado
    ? "history-card status-atrasado"
    : "history-card";

  return (
    <article className={classeCartao}>
      {item.atrasado && <div className="card-left-border red-border"></div>}
      <Capa capa={item.capa} titulo={item.titulo} />

      <div className="book-details">
        {item.atrasado && (
          <span className="badge badge-late">
            • Com {item.diasAtraso} {item.diasAtraso === 1 ? "dia" : "dias"} de
            atraso
          </span>
        )}
        {!item.atrasado && !item.devolvido && (
          <span className="badge badge-borrowed">• Emprestado</span>
        )}
        {item.devolvido && (
          <span className="badge badge-returned">
            <i className="fi fi-rr-refresh"></i> Devolvido
          </span>
        )}

        <h3 className="book-title">{item.titulo}</h3>
        <p className="book-author">{item.autor}</p>

        <div className="dates-row">
          <div>
            <span className="date-label">Emprestado</span>
            <span className="date-value">{formatarData(item.retirada)}</span>
          </div>
          <div>
            <span className="date-label">Data de devolução</span>
            <span className={`date-value ${item.atrasado ? "date-red" : ""}`}>
              {formatarData(item.devolucao)}
            </span>
          </div>
        </div>
      </div>

      <div className="card-action">
        {item.devolvido ? (
          <button
            type="button"
            className="btn-text-action"
            onClick={() => onPegarNovamente(item)}
          >
            Pegar novamente
          </button>
        ) : (
          <button
            type="button"
            className="btn-action btn-renovar"
            onClick={() => onRenovar(item)}
          >
            Renovar
          </button>
        )}
      </div>
    </article>
  );
}

/* Janela de confirmação do pedido (renovar / pegar novamente) */
function ModalAcao({ acao, etapa, erro, onConfirmar, onFechar }) {
  const textos = TEXTOS_ACAO[acao.tipo];

  // Enviando ou concluído: usa o cartão de status que já existe no CSS
  if (etapa === "enviando" || etapa === "sucesso") {
    return (
      <div className="modal-overlay active">
        <div className="status-card-modal">
          {etapa === "enviando" ? (
            <div className="status-state">
              <div className="spinner"></div>
              <p>Enviando pedido...</p>
            </div>
          ) : (
            <div className="status-state">
              <div className="success-circle">
                <i className="fi fi-rr-check"></i>
              </div>
              <p className="success-msg">{textos.sucesso}</p>
              <button type="button" className="btn-primary" onClick={onFechar}>
                Concluir
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay active" onClick={onFechar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{textos.titulo}</h2>
          <button type="button" className="btn-close-modal" onClick={onFechar}>
            &times;
          </button>
        </div>
        <div className="modal-body text-center">
          <i className="fi fi-rr-document-signed modal-icon-big"></i>
          <p className="modal-text">
            {textos.pergunta} <strong>{acao.item.titulo}</strong>?
          </p>
          {erro && (
            <p
              role="alert"
              style={{ color: "var(--color-danger)", fontSize: "13px" }}
            >
              {erro}
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={onConfirmar}>
            {textos.botao}
          </button>
        </div>
      </div>
    </div>
  );
}
/* Página de Histórico */
function Historico() {
  const { usuario } = useAuth();

  const [emprestimos, setEmprestimos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);
  const [versao, setVersao] = useState(0); // aumenta para recarregar a lista

  const [aba, setAba] = useState("todos"); // "todos" | "emprestado" | "devolvido"
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState(POR_PAGINA);

  const [acao, setAcao] = useState(null); // { tipo: "renovar" | "novamente", item }
  const [etapa, setEtapa] = useState("confirmar"); // "confirmar" | "enviando" | "sucesso"
  const [erroAcao, setErroAcao] = useState(null);

  // Busca os empréstimos do usuário logado
  useEffect(() => {
    let ativo = true;

    api
      .get(ROTAS.listar)
      .then(({ data }) => {
        if (!ativo) return;
        // a API pode devolver uma lista direta ou { data: [...] }
        const lista = Array.isArray(data) ? data : (data?.data ?? []);
        const hoje = new Date();

        // Segurança extra: se o empréstimo traz o dono, só aceita os do usuário logado.
        // O certo é o Laravel já devolver só os dele.
        const doUsuario = lista.filter(
          (e) => e.usuario_id == null || String(e.usuario_id) === String(usuario.id),
        );

        setEmprestimos(
          doUsuario
            .map((e) => normalizarEmprestimo(e, hoje))
            .sort((a, b) => (b.retirada ?? 0) - (a.retirada ?? 0)),
        );
        setErroCarga(null);
      })
      .catch(() => {
        if (ativo) setErroCarga("Não foi possível carregar o seu histórico.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario.id, versao]);

  // Números dos cards (mudam conforme o usuário logado)
  const total = emprestimos.length;
  const atuais = emprestimos.filter((e) => !e.devolvido).length;
  const atrasados = emprestimos.filter((e) => e.atrasado).length;
  const porcentagemLimite = Math.min(100, (atuais / LIMITE_EMPRESTIMOS) * 100);

  // Filtro por aba + busca
  const termo = simplificar(busca.trim());
  const filtrados = emprestimos.filter((e) => {
    const naAba =
      aba === "todos" ||
      (aba === "emprestado" && !e.devolvido) ||
      (aba === "devolvido" && e.devolvido);
    const naBusca =
      !termo || simplificar(`${e.titulo} ${e.autor}`).includes(termo);
    return naAba && naBusca;
  });
  const visiveis = filtrados.slice(0, quantidade);
  const temMais = filtrados.length > visiveis.length;

  function trocarAba(novaAba) {
    setAba(novaAba);
    setQuantidade(POR_PAGINA);
  }

  function mudarBusca(e) {
    setBusca(e.target.value);
    setQuantidade(POR_PAGINA);
  }

  function abrirAcao(tipo, item) {
    setAcao({ tipo, item });
    setEtapa("confirmar");
    setErroAcao(null);
  }

  function fecharAcao() {
    setAcao(null);
  }

  async function confirmarAcao() {
    setEtapa("enviando");
    setErroAcao(null);

    try {
      if (acao.tipo === "renovar") {
        await api.patch(ROTAS.renovar(acao.item.id));
      } else {
        await api.post(ROTAS.pegarNovamente, { isbn: acao.item.isbn });
      }
      setEtapa("sucesso");
      setVersao((v) => v + 1); // recarrega a lista e os números dos cards
    } catch (err) {
      setErroAcao(
        err.response?.data?.message ||
          "Não foi possível enviar o pedido. Tente novamente.",
      );
      setEtapa("confirmar");
    }
  }

  return (
    <div>
      <main className="main-content">
        {/* Quadrados de Estatísticas (Cards) */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">
                <i className="fi fi-rr-book-alt"></i>
                <span>Total de Livros</span>
              </div>
              <div className="circle-bg circle-gray"></div>
            </div>
            <div className="stat-body">
              <span className="stat-number">{total}</span>
              <span className="stat-sub">Livros até o momento</span>
            </div>
          </div>

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
                <span className="stat-number">{atuais}</span>
                <span className="limit-sub">livros</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${porcentagemLimite}%` }}
                ></div>
              </div>
              <span className="max-info">Máx. {LIMITE_EMPRESTIMOS}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title title-alert">
                <i className="fi fi-rr-exclamation"></i>
                <span>Livros atrasados</span>
              </div>
              <div className="circle-bg circle-red"></div>
            </div>
            <div className="stat-body">
              <span className="stat-number number-alert">{atrasados}</span>
              <span className="stat-sub sub-alert">Livros em atraso</span>
            </div>
          </div>
        </section>

        {/* Barra de Filtros por Aba e Pesquisa */}
        <section className="filter-bar">
          <div className="tab-buttons">
            <button
              type="button"
              className={`tab-btn ${aba === "todos" ? "active" : ""}`}
              onClick={() => trocarAba("todos")}
            >
              Todos os livros
            </button>
            <button
              type="button"
              className={`tab-btn ${aba === "emprestado" ? "active" : ""}`}
              onClick={() => trocarAba("emprestado")}
            >
              Livros emprestados
            </button>
            <button
              type="button"
              className={`tab-btn ${aba === "devolvido" ? "active" : ""}`}
              onClick={() => trocarAba("devolvido")}
            >
              Devolvidos
            </button>
          </div>

          <div className="search-box">
            <i className="fi fi-rr-search"></i>
            <input
              type="text"
              placeholder="Buscar por livros ou autores"
              value={busca}
              onChange={mudarBusca}
            />
          </div>
        </section>

        {/* Lista de Livros no Histórico */}
        <section className="history-list">
          {carregando && <p>Carregando seu histórico...</p>}

          {!carregando && erroCarga && (
            <p role="alert" style={{ color: "var(--color-danger)" }}>
              {erroCarga}
            </p>
          )}

          {!carregando && !erroCarga && visiveis.length === 0 && (
            <p>
              {total === 0
                ? "Você ainda não pegou nenhum livro emprestado."
                : "Nenhum livro encontrado com esses filtros."}
            </p>
          )}

          {visiveis.map((item) => (
            <CartaoEmprestimo
              key={item.id}
              item={item}
              onRenovar={(i) => abrirAcao("renovar", i)}
              onPegarNovamente={(i) => abrirAcao("novamente", i)}
            />
          ))}
        </section>

        {/* Botão Ver Mais: só aparece se ainda houver livros escondidos */}
        {temMais && (
          <div className="see-more-container">
            <button
              type="button"
              className="btn-see-more"
              onClick={() => setQuantidade((q) => q + POR_PAGINA)}
            >
              Ver mais ...
            </button>
          </div>
        )}
      </main>

      {acao && (
        <ModalAcao
          acao={acao}
          etapa={etapa}
          erro={erroAcao}
          onConfirmar={confirmarAcao}
          onFechar={fecharAcao}
        />
      )}
    </div>
  );
}

export default Historico;