import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Categorias agrupadas (antes estavam repetidas no JSX)
const CATEGORY_GROUPS = [
  {
    title: "Ficção",
    items: ["Romance", "Novela", "Conto", "Crônica"],
  },
  {
    title: "Subgêneros da Ficção",
    items: [
      "Fantasia",
      "Ficção Científica",
      "Suspense (Thriller)",
      "Horror/Terror",
      "Romance de Época",
      "Aventura",
      "Ficção Policial",
    ],
  },
  {
    title: "Não Ficção",
    items: [
      "Biografias, Autobiografias e Memórias",
      "Divulgação Científica",
      "Ensaios",
      "Livros Didáticos e Técnicos",
    ],
  },
];

const EMPTY_FORM = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publicationDate: "",
  synopsis: "",
};

// A API do Google Books pode devolver "2008" ou "2008-05";
// o <input type="date"> só aceita "AAAA-MM-DD".
function normalizeDate(value) {
  if (!value) return "";
  if (/^\d{4}$/.test(value)) return `${value}-01-01`;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`;
  return value;
}

function CadastroLivro() {
  const navigate = useNavigate();

  // ---- Campos do formulário ----
  const [form, setForm] = useState(EMPTY_FORM);
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tags, setTags] = useState(["Clássico"]);
  const [tagInput, setTagInput] = useState("");

  // ---- Capa ----
  const [savedCover, setSavedCover] = useState(null); // { file, url }
  const coverInputRef = useRef(null);

  // ---- ISBN ----
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [isbnFeedback, setIsbnFeedback] = useState({ text: "", type: "" });

  // ---- Status do cadastro: null | "loading" | "success" ----
  const [status, setStatus] = useState(null);

  // Atualiza qualquer campo simples pelo atributo name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= Capa =================
  // Abre direto a janela de arquivos do computador/celular
  const openFilePicker = () => coverInputRef.current?.click();

  const applyCoverFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem (JPG, PNG, WEBP...).");
      return;
    }
    // Libera a prévia anterior da memória
    if (savedCover?.url) URL.revokeObjectURL(savedCover.url);
    setSavedCover({ file, url: URL.createObjectURL(file) });
  };

  const handleCoverChange = (e) => {
    applyCoverFile(e.target.files?.[0]);
    e.target.value = ""; // permite escolher o mesmo arquivo de novo
  };

  const removeCover = (e) => {
    e.stopPropagation(); // não reabrir o seletor ao clicar em "Remover"
    if (savedCover?.url) URL.revokeObjectURL(savedCover.url);
    setSavedCover(null);
  };

  // Arrastar e soltar na dropzone
  const handleDrop = (e) => {
    e.preventDefault();
    applyCoverFile(e.dataTransfer.files?.[0]);
  };

  // ================= Categoria =================
  const filteredGroups = CATEGORY_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLowerCase().includes(category.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const selectCategory = (name) => {
    setCategory(name);
    setCategoryOpen(false);
  };

  // ================= Tags =================
  const addTag = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // evita enviar o formulário ao apertar Enter
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // ================= Busca por ISBN =================
  const buscarDadosIsbn = async () => {
    const isbn = form.isbn.replace(/[^0-9Xx]/g, "");
    if (!isbn) {
      setIsbnFeedback({ text: "Digite um ISBN primeiro.", type: "error" });
      return;
    }

    setIsbnLoading(true);
    setIsbnFeedback({ text: "Buscando...", type: "info" });

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      if (!res.ok) throw new Error("Falha na requisição");
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        setIsbnFeedback({ text: "Nenhum livro encontrado.", type: "error" });
        return;
      }

      const info = data.items[0].volumeInfo;

      setForm((prev) => ({
        ...prev,
        title: info.title || prev.title,
        author: info.authors?.join(", ") || prev.author,
        publisher: info.publisher || prev.publisher,
        publicationDate:
          normalizeDate(info.publishedDate) || prev.publicationDate,
        synopsis: info.description || prev.synopsis,
      }));

      setIsbnFeedback({ text: "Dados preenchidos com sucesso!", type: "success" });
    } catch (err) {
      console.error(err);
      setIsbnFeedback({ text: "Erro ao buscar na API.", type: "error" });
    } finally {
      setIsbnLoading(false);
    }
  };

  const feedbackColor = {
    success: "#16a34a",
    error: "#dc2626",
    info: "#2563eb",
  }[isbnFeedback.type];

  // ================= Envio =================
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setCategory("");
    setCategoryOpen(false);
    setTags([]);
    setTagInput("");
    if (savedCover?.url) URL.revokeObjectURL(savedCover.url);
    setSavedCover(null);
    setIsbnFeedback({ text: "", type: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append("category", category);
      payload.append("tags", JSON.stringify(tags));
      if (savedCover?.file) payload.append("cover", savedCover.file);

      // TODO: troque pela chamada real ao seu back-end, por exemplo:
      // const res = await fetch("/api/livros", { method: "POST", body: payload });
      // if (!res.ok) throw new Error("Erro ao cadastrar");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus(null);
      alert("Não foi possível cadastrar o livro. Tente novamente.");
    }
  };

  const finishRegistration = () => {
    setStatus(null);
    resetForm();
    navigate("/"); // ajuste para a rota que você quiser (ex.: "/livros")
  };

  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">Registrar um novo livro</h1>
          <p className="page-subtitle">
            Pronto para adicionar novos livros à biblioteca?
          </p>
        </header>

        <form id="bookForm" onSubmit={handleFormSubmit}>
          <div className="form-grid">
            {/* Coluna da Esquerda: Upload e Ações */}
            <div className="left-column">
              {/* Input de arquivo oculto: é ele que abre a janela de arquivos */}
              <input
                type="file"
                id="coverFileInput"
                accept="image/*"
                ref={coverInputRef}
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />

              <div
                className="card dropzone-card"
                id="dropzone"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
                onClick={openFilePicker}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {savedCover ? (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={savedCover.url}
                      alt="Capa do livro"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="dropzone-content" id="dropzoneContent">
                    <div className="upload-circle">
                      <i className="fi fi-rr-cloud-upload"></i>
                    </div>
                    <strong className="upload-title">Fazer upload da capa</strong>
                    <p className="upload-desc">
                      Arraste e solte ou clique para procurar.
                      <br />
                      Tamanho recomendado: 600x900px
                    </p>
                  </div>
                )}
              </div>

              <div className="action-box">
                <button type="submit" className="btn-submit">
                  <i className="fi fi-rr-disk"></i> Salvar novo título
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </div>

            {/* Coluna da Direita: Formulários */}
            <div className="right-column">
              {/* Card: Informações Principais */}
              <section className="card">
                <div className="card-title-group">
                  <i className="fi fi-rr-info"></i>
                  <h2>Informações principais</h2>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bookTitle">Título do livro</label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="ex. The Great Gatsby"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookAuthor">Autor(a)</label>
                    <input
                      type="text"
                      id="bookAuthor"
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="ex. F. Scott Fitzgerald"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <label htmlFor="bookIsbn" style={{ marginBottom: 0 }}>
                        ISBN
                      </label>
                      <button
                        type="button"
                        id="btnBuscarIsbn"
                        onClick={buscarDadosIsbn}
                        disabled={isbnLoading}
                        style={{
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          cursor: isbnLoading ? "wait" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 500,
                          opacity: isbnLoading ? 0.7 : 1,
                        }}
                      >
                        <i className="fi fi-rr-search"></i>{" "}
                        {isbnLoading ? "Buscando..." : "Buscar na API"}
                      </button>
                    </div>
                    <input
                      type="text"
                      id="bookIsbn"
                      name="isbn"
                      value={form.isbn}
                      onChange={handleChange}
                      placeholder="ex. 9788532511010"
                      maxLength={20}
                      required
                    />
                    {isbnFeedback.text && (
                      <small
                        id="isbnFeedback"
                        style={{
                          display: "block",
                          fontSize: "11px",
                          marginTop: "4px",
                          fontWeight: 500,
                          color: feedbackColor,
                        }}
                      >
                        {isbnFeedback.text}
                      </small>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookPublisher">Editora</label>
                    <input
                      type="text"
                      id="bookPublisher"
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      placeholder="ex. Scribner"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookPublicationDate">Data de publicação</label>
                    <input
                      type="date"
                      id="bookPublicationDate"
                      name="publicationDate"
                      value={form.publicationDate}
                      onChange={handleChange}
                      required
                    />
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
                  {/* Select/Search Interativo */}
                  <div className="form-group custom-select-group">
                    <label htmlFor="categoryInput">Categoria principal</label>
                    <div
                      className="select-box"
                      onClick={() => setCategoryOpen((open) => !open)}
                    >
                      <input
                        type="text"
                        id="categoryInput"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setCategoryOpen(true);
                        }}
                        placeholder="Selecione ou digite a categoria"
                        autoComplete="off"
                      />
                      <i className="fi fi-rr-angle-small-down"></i>
                    </div>

                    <ul
                      className="dropdown-list"
                      id="categoryList"
                      style={{ display: categoryOpen ? "block" : "none" }}
                    >
                      {filteredGroups.length === 0 && (
                        <li className="dropdown-header">
                          Nenhuma categoria encontrada
                        </li>
                      )}
                      {filteredGroups.map((group) => (
                        <div key={group.title}>
                          <li className="dropdown-header">{group.title}</li>
                          {group.items.map((item) => (
                            <li key={item} onClick={() => selectCategory(item)}>
                              {item}
                            </li>
                          ))}
                        </div>
                      ))}
                    </ul>
                  </div>

                  {/* Input de Tags */}
                  <div className="form-group">
                    <label htmlFor="tagInput">Tags</label>
                    <div className="tags-container" id="tagsContainer">
                      <div className="tags-list" id="tagsList">
                        {tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}{" "}
                            <button type="button" onClick={() => removeTag(tag)}>
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="tagInput"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Escreva e aperte enter"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Card: Sinopse */}
              <section className="card">
                <div className="card-title-group">
                  <i className="fi fi-rr-document"></i>
                  <h2>Sinopse do Livro</h2>
                </div>

                <div className="form-group full-width">
                  <textarea
                    id="bookSynopsis"
                    name="synopsis"
                    value={form.synopsis}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Escreva a sinopse do livro ou um pequeno texto sobre o livro"
                  ></textarea>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>

      {/* OVERLAY DE CARREGAMENTO / SUCESSO DO CADASTRO */}
      <div
        className="modal-overlay"
        id="statusModal"
        style={{ display: status ? "flex" : "none" }}
      >
        <div className="status-card-modal">
          {/* Estado 1: Loading */}
          {status === "loading" && (
            <div id="statusLoading" className="status-state">
              <div className="spinner"></div>
              <p>Cadastrando novo livro...</p>
            </div>
          )}

          {/* Estado 2: Sucesso */}
          {status === "success" && (
            <div id="statusSuccess" className="status-state">
              <div className="success-circle">
                <i className="fi fi-rr-check"></i>
              </div>
              <p className="success-msg">
                Cadastro do novo livro foi efetuado com sucesso!
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={finishRegistration}
              >
                Concluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CadastroLivro;