// Máscara para o formato 000-00-0000-0
function applyISBNMask(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  if (value.length > 9) {
    value = value.replace(/^(\d{3})(\d{2})(\d{4})(\d{1})$/, '$1-$2-$3-$4');
  } else if (value.length > 5) {
    value = value.replace(/^(\d{3})(\d{2})(\d{0,4})$/, '$1-$2-$3');
  } else if (value.length > 3) {
    value = value.replace(/^(\d{3})(\d{0,2})$/, '$1-$2');
  }

  input.value = value;
}

// Preencher automaticamente a data de hoje e devolução (padrão 14 dias)
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 14);
  const returnFormatted = defaultReturn.toISOString().split("T")[0];

  document.getElementById("pickupDate").value = today;
  document.getElementById("returnDate").value = returnFormatted;
});

// Alternar Menu Lateral
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

/* --- LÓGICA DO MODAL INICIAL DE ACESSO --- */
function confirmAccess() {
  document.getElementById("modalConfirmAccess").classList.remove("active");
}

function rejectAccess() {
  window.location.href = "homeADMIN.html";
}

/* --- SUBMISSÃO E ANIMAÇÃO DO EMPRÉSTIMO --- */
function handleLoanSubmit(event) {
  event.preventDefault();

  const returnDateValue = document.getElementById("returnDate").value;

  if (!returnDateValue) {
    alert("Por favor, selecione uma data de devolução válida.");
    return;
  }

  // Formatar a data para o padrão exibido (DD/MM/AAAA)
  const parts = returnDateValue.split("-");
  const formattedReturnDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

  const statusModal = document.getElementById("statusModal");
  const statusLoading = document.getElementById("statusLoading");
  const statusSuccess = document.getElementById("statusSuccess");

  // Exibir Modal em Estado de Carregamento
  statusModal.classList.add("active");
  statusLoading.style.display = "flex";
  statusSuccess.style.display = "none";

  // Simular processamento por 2.5 segundos
  setTimeout(() => {
    statusLoading.style.display = "none";
    document.getElementById("displayReturnDate").textContent = formattedReturnDate;
    statusSuccess.style.display = "flex";
  }, 2500);
}

function finishLoanProcess() {
  document.getElementById("statusModal").classList.remove("active");
  window.location.href = "homeADMIN.html";
}

function cancelLoan() {
  if (confirm("Deseja cancelar o processo de empréstimo?")) {
    window.location.href = "homeADMIN.html";
  }
}