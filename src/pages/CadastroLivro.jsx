import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CadastroLivro() {
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

        <form id="bookForm" onSubmit="handleFormSubmit(event)">
          <div className="form-grid">
            {/* Coluna da Esquerda: Upload e Ações */}
            <div className="left-column">
              <div
                className="card dropzone-card"
                id="dropzone"
                onClick="openCoverModal()"
              >
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
              </div>

              <div className="action-box">
                <button type="submit" className="btn-submit">
                  <i className="fi fi-rr-disk"></i> Salvar novo título
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick="resetForm()"
                >
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
                      placeholder="ex. F. Scott Fitzgerald"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                      <label htmlFor="bookIsbn" style="margin-bottom: 0;">
                        ISBN
                      </label>
                      <button
                        type="button"
                        id="btnBuscarIsbn"
                        onClick="buscarDadosIsbn()"
                        style="background: #2563eb; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 500;"
                      >
                        <i className="fi fi-rr-search"></i> Buscar na API
                      </button>
                    </div>
                    <input
                      type="text"
                      id="bookIsbn"
                      placeholder="ex. 9788532511010"
                      maxLength="20"
                      required
                    />
                    <small
                      id="isbnFeedback"
                      style="display:none; font-size: 11px; margin-top: 4px; font-weight: 500;"
                    ></small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bookPublisher">Editora</label>
                    <input
                      type="text"
                      id="bookPublisher"
                      placeholder="ex. Scribner"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookPublicationDate">
                      Data de publicação
                    </label>
                    <input type="date" id="bookPublicationDate" required />
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
                    <label>Categoria principal</label>
                    <div
                      className="select-box"
                      onClick="toggleCategoryDropdown()"
                    >
                      <input
                        type="text"
                        id="categoryInput"
                        placeholder="Selecione ou digite a categoria"
                        onKeyUp="filterCategories()"
                        autoComplete="off"
                      />
                      <i className="fi fi-rr-angle-small-down"></i>
                    </div>
                    <ul className="dropdown-list" id="categoryList">
                      {/* Ficção */}
                      <li className="dropdown-header">Ficção</li>
                      <li onClick="selectCategory('Romance')">Romance</li>
                      <li onClick="selectCategory('Novela')">Novela</li>
                      <li onClick="selectCategory('Conto')">Conto</li>
                      <li onClick="selectCategory('Crônica')">Crônica</li>

                      {/* Subgêneros */}
                      <li className="dropdown-header">Subgêneros da Ficção</li>
                      <li onClick="selectCategory('Fantasia')">Fantasia</li>
                      <li onClick="selectCategory('Ficção Científica')">
                        Ficção Científica
                      </li>
                      <li onClick="selectCategory('Suspense (Thriller)')">
                        Suspense (Thriller)
                      </li>
                      <li onClick="selectCategory('Horror/Terror')">
                        Horror/Terror
                      </li>
                      <li onClick="selectCategory('Romance de Época')">
                        Romance de Época
                      </li>
                      <li onClick="selectCategory('Aventura')">Aventura</li>
                      <li onClick="selectCategory('Ficção Policial')">
                        Ficção Policial
                      </li>

                      {/* Não Ficção */}
                      <li className="dropdown-header">Não Ficção</li>
                      <li onClick="selectCategory('Biografias, Autobiografias e Memórias')">
                        Biografias, Autobiografias e Memórias
                      </li>
                      <li onClick="selectCategory('Divulgação Científica')">
                        Divulgação Científica
                      </li>
                      <li onClick="selectCategory('Ensaios')">Ensaios</li>
                      <li onClick="selectCategory('Livros Didáticos e Técnicos')">
                        Livros Didáticos e Técnicos
                      </li>
                    </ul>
                  </div>

                  {/* Input de Tags */}
                  <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-container" id="tagsContainer">
                      <div className="tags-list" id="tagsList">
                        <span className="tag">
                          Clássico{" "}
                          <button type="button" onClick="removeTag(this)">
                            &times;
                          </button>
                        </span>
                      </div>
                      <input
                        type="text"
                        id="tagInput"
                        placeholder="Escreva e aperte do enter"
                        onKeyDown="addTag(event)"
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
                    rows="5"
                    placeholder="Escreva a sinopse do livro ou um pequeno texto sobre o livro"
                  ></textarea>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>

      {/* MODAL: Upload da Capa */}
      <div className="modal-overlay" id="modalCover">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Upload da Capa do Livro</h2>
            <button
              type="button"
              className="btn-close-modal"
              onClick="closeCoverModal()"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="file-upload-area">
              <input
                type="file"
                id="coverFileInput"
                accept="image/*"
                onChange="previewCoverImage(event)"
              />
              <i className="fi fi-rr-cloud-upload"></i>
              <p>Clique aqui para selecionar a imagem da capa</p>
            </div>
            <div
              className="preview-area"
              id="modalPreviewArea"
              style="display: none;"
            >
              <img id="coverPreviewImg" src="" alt="Prévia da Capa" />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick="closeCoverModal()"
            >
              Fechar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick="confirmCoverUpload()"
            >
              Salvar Capa
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY DE CARREGAMENTO / SUCESSO DO CADASTRO */}
      <div className="modal-overlay" id="statusModal">
        <div className="status-card-modal">
          {/* Estado 1: Loading */}
          <div id="statusLoading" className="status-state">
            <div className="spinner"></div>
            <p>Cadastrando novo livro...</p>
          </div>

          {/* Estado 2: Sucesso */}
          <div
            id="statusSuccess"
            className="status-state"
            style="display: none;"
          >
            <div className="success-circle">
              <i className="fi fi-rr-check"></i>
            </div>
            <p className="success-msg">
              Cadastro do novo livro foi efetuado com sucesso!
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick="finishRegistration()"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroLivro;
