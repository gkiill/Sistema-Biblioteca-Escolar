import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Livro() {
  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        {/* Botão Voltar */}
        <div className="top-actions">
          <button className="btn-back" onClick="goBack()">
            <div className="btn-back-icon">
              <i className="fi fi-rr-arrow-left"></i>
            </div>
            <span>Voltar</span>
          </button>
        </div>

        {/* Grid do Livro */}
        <div className="book-details-grid">
          {/* Coluna Esquerda: Capa com Borda Pontoada */}
          <div className="left-column">
            <div className="cover-wrapper">
              <img id="bookCover" src="" alt="Capa do Livro" />
            </div>
          </div>

          {/* Coluna Direita: Formulários e Dados */}
          <div className="right-column">
            {/* Card: Informações Principais */}
            <section className="card">
              <h1 className="book-title" id="bookTitle">
                Carregando...
              </h1>

              <div className="form-row">
                <div className="form-group">
                  <label>Autor(a)</label>
                  <input type="text" id="bookAuthor" readOnly />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input type="text" id="bookIsbn" readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Editora</label>
                  <input type="text" id="bookPublisher" readOnly />
                </div>
                <div className="form-group">
                  <label>Data de publicação</label>
                  <input type="text" id="bookPublicationDate" readOnly />
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
                  <input type="text" id="bookCategory" readOnly />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-container" id="bookTags">
                    {/* As tags serão geradas dinamicamente aqui pelo JS */}
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
                <p id="bookSynopsis"></p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Livro;
