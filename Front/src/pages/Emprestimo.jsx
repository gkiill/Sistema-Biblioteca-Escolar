import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY_FORM = {
  userName: "",
  userId: "",
  userEmail: "",
  bookTitle: "",
  bookIsbn: "",
  pickupDate: "",
  returnDate: "",
  librarianName: "",
  librarianId: "",
};

// Máscara de ISBN: 000-00-0000-0 (ISBN-10) ou 000-00-0000-000-0 (ISBN-13)
function formatIsbn(value) {
  const digits = value
    .replace(/[^\dXx]/g, "")
    .toUpperCase()
    .slice(0, 13);
  const groups = digits.length <= 10 ? [3, 2, 4, 1] : [3, 2, 4, 3, 1];

  const parts = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  return parts.join("-");
}

// "2026-11-20" -> "20/11/2026" (sem usar Date, para evitar erro de fuso horário)
function formatDateBR(isoDate) {
  if (!isoDate) return "--/--/----";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function Emprestimo() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [autoRenew, setAutoRenew] = useState(false);

  // Modal 1: já começa aberto, como no código original
  const [confirmAccessOpen, setConfirmAccessOpen] = useState(true);

  // Modal 2: null | "loading" | "success"
  const [status, setStatus] = useState(null);
  const [confirmedReturnDate, setConfirmedReturnDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIsbnChange = (e) => {
    const masked = formatIsbn(e.target.value);
    setForm((prev) => ({ ...prev, bookIsbn: masked }));
  };

  // ---- Modal de confirmação de acesso ----
  const confirmAccess = () => setConfirmAccessOpen(false);

  const rejectAccess = () => {
    setConfirmAccessOpen(false);
    navigate("/"); // ajuste para a rota para onde o usuário deve voltar
  };

  // ---- Ações do formulário ----
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setAutoRenew(false);
  };

  const cancelLoan = () => resetForm();

  const handleLoanSubmit = async (e) => {
    e.preventDefault();

    if (form.returnDate < form.pickupDate) {
      alert("A data de devolução não pode ser anterior à data de retirada.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/v1/emprestimos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...form, autoRenew }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.erro || errData.message || "Erro ao registrar empréstimo");
      }

      setConfirmedReturnDate(formatDateBR(form.returnDate));
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus(null);
      alert(err.message || "Não foi possível registrar o empréstimo. Tente novamente.");
    }
  };

  const finishLoanProcess = () => {
    setStatus(null);
    resetForm();
    navigate("/"); // ajuste para a rota que você quiser
  };

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
          onSubmit={handleLoanSubmit}
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
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
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
                      name="userId"
                      value={form.userId}
                      onChange={handleChange}
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
                    name="userEmail"
                    value={form.userEmail}
                    onChange={handleChange}
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
                      name="bookTitle"
                      value={form.bookTitle}
                      onChange={handleChange}
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
                      name="bookIsbn"
                      value={form.bookIsbn}
                      onChange={handleIsbnChange}
                      placeholder="ex. 000-00-0000-0"
                      maxLength={17}
                      inputMode="numeric"
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
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={form.pickupDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="returnDate">Data de devolução</label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={form.returnDate}
                    min={form.pickupDate || undefined}
                    onChange={handleChange}
                    required
                  />
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
                      name="librarianName"
                      value={form.librarianName}
                      onChange={handleChange}
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
                      name="librarianId"
                      value={form.librarianId}
                      onChange={handleChange}
                      placeholder="ex. 20258926"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Box Renovação Automática */}
              <div className="renovation-box">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                  />
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
              <button type="button" className="btn-cancel" onClick={cancelLoan}>
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
      <div
        className={`modal-overlay${confirmAccessOpen ? " active" : ""}`}
        id="modalConfirmAccess"
        style={{ display: confirmAccessOpen ? "flex" : "none" }}
      >
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
              onClick={rejectAccess}
            >
              Fechar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={confirmAccess}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 2: Processamento e Sucesso do Empréstimo */}
      <div
        className={`modal-overlay${status ? " active" : ""}`}
        id="statusModal"
        style={{ display: status ? "flex" : "none" }}
      >
        <div className="status-card-modal">
          {/* Estado 1: Loading */}
          {status === "loading" && (
            <div id="statusLoading" className="status-state">
              <div className="spinner"></div>
              <p>Processando empréstimo...</p>
            </div>
          )}

          {/* Estado 2: Sucesso */}
          {status === "success" && (
            <div id="statusSuccess" className="status-state">
              <div className="success-circle">
                <i className="fi fi-rr-check"></i>
              </div>
              <h3 className="success-title">
                Empréstimo efetuado com sucesso!
              </h3>
              <p className="success-date-msg">
                O livro deve ser devolvido até:{" "}
                <strong id="displayReturnDate">{confirmedReturnDate}</strong>
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={finishLoanProcess}
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

export default Emprestimo;