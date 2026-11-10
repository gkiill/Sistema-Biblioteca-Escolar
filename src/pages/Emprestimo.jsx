import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Emprestimo() {
  return (
    <div>
      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">Autorização para Empréstimo</h1>
          <p className="page-subtitle">
            Registre um novo empréstimo de livro e defina os parâmetros de
            devolução.
          </p>
        </header>

        <form
          id="loanForm"
          onSubmit="handleLoanSubmit(event)"
          className="loan-card-container"
        >
          <div className="card">
            {/* Seção 1: Dados do usuário */}
            <section className="form-section">
              <h2 className="section-title">Dados do usuário</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="userName">Nome completo</label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-user"></i>
                    <input
                      type="text"
                      id="userName"
                      placeholder="ex. Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="userId">
                    RA do estudante / Identificação do funcionário
                  </label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-id-badge"></i>
                    <input
                      type="text"
                      id="userId"
                      placeholder="ex. 20248921"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="userEmail">Email educacional completo</label>
                <div className="input-icon-box">
                  <i className="fi fi-rr-envelope"></i>
                  <input
                    type="email"
                    id="userEmail"
                    placeholder="ex. jane.doe@aluno.instituicao.edu.br / jane.doe@professor.instituicao.edu.br"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Seção 2: Dados do livro */}
            <section className="form-section">
              <h2 className="section-title">Dados do livro</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookTitle">Nome do livro</label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-book-alt"></i>
                    <input
                      type="text"
                      id="bookTitle"
                      placeholder="Insira o título"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bookIsbn">ISBN</label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-barcode"></i>
                    <input
                      type="text"
                      id="bookIsbn"
                      placeholder="ex. 000-00-0000-0"
                      maxLength="13"
                      onChange="applyISBNMask(this)"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Seção 3: Termos de empréstimo */}
            <section className="form-section">
              <h2 className="section-title">Termos de empréstimo</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupDate">Data de retirada</label>
                  <input type="date" id="pickupDate" required />
                </div>

                <div className="form-group">
                  <label htmlFor="returnDate">Data de devolução</label>
                  <input type="date" id="returnDate" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="librarianName">
                    Nome do bibliotecário responsável
                  </label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-user"></i>
                    <input
                      type="text"
                      id="librarianName"
                      placeholder="ex. Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="librarianId">
                    Identificação do bibliotecário
                  </label>
                  <div className="input-icon-box">
                    <i className="fi fi-rr-id-badge"></i>
                    <input
                      type="text"
                      id="librarianId"
                      placeholder="ex. 20258926"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Box Renovação Automática */}
              <div className="renovation-box">
                <label className="checkbox-container">
                  <input type="checkbox" id="autoRenew" required />
                  <span className="checkmark"></span>
                  <div className="checkbox-text">
                    <strong>Ativar renovação automática</strong>
                    <p>
                      Renovar automaticamente o empréstimo por 7 dias se não
                      houver reservas feitas por outros membros.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Botões de Ação */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick="cancelLoan()"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                <i className="fi fi-rr-check"></i> Autorizar empréstimo
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* MODAL 1: Confirmação Inicial de Acesso */}
      <div className="modal-overlay active" id="modalConfirmAccess">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Confirmar Acesso</h2>
          </div>
          <div className="modal-body text-center">
            <i className="fi fi-rr-document-signed modal-icon-big"></i>
            <p className="modal-text">
              Deseja preencher as informações para o empréstimo do livro agora?
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick="rejectAccess()"
            >
              Fechar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick="confirmAccess()"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 2: Processamento e Sucesso do Empréstimo */}
      <div className="modal-overlay" id="statusModal">
        <div className="status-card-modal">
          {/* Estado 1: Loading */}
          <div id="statusLoading" className="status-state">
            <div className="spinner"></div>
            <p>Processando empréstimo...</p>
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
            <h3 className="success-title">Empréstimo efetuado com sucesso!</h3>
            <p className="success-date-msg">
              O livro deve ser devolvido até:{" "}
              <strong id="displayReturnDate">--/--/----</strong>
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick="finishLoanProcess()"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emprestimo;
