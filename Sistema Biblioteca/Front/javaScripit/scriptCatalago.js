// Variável global para rastrear a página atual
let currentPage = "1";

// Inicializa mostrando apenas os livros da página 1
document.addEventListener("DOMContentLoaded", () => {
  renderPage(currentPage);
});

// Alternar menu lateral
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Controle do Modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('overlay');

  if (modal) {
    modal.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (modal) {
    modal.classList.remove('active');
  }

  if (!sidebar.classList.contains('active')) {
    overlay.classList.remove('active');
  }
}

function closeAllOverlays() {
  const sidebar = document.getElementById('sidebar');
  const modals = document.querySelectorAll('.modal');
  const overlay = document.getElementById('overlay');

  sidebar.classList.remove('active');
  modals.forEach(modal => modal.classList.remove('active'));
  overlay.classList.remove('active');
}

// Redirecionamento para a página do livro
function goToBook(bookId) {
  window.location.href = `pagLivro.html?id=${bookId}`;
}

// Renderiza apenas os livros pertencentes à página selecionada
function renderPage(pageNum) {
  currentPage = pageNum.toString();
  filterBooks();
}

// Controle de Paginação (Botões azuis)
function setPage(element) {
  const pageButtons = document.querySelectorAll('.page-num');
  pageButtons.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  
  renderPage(element.textContent.trim());
}

function changePage(direction) {
  const pageButtons = Array.from(document.querySelectorAll('.page-num'));
  let currentIndex = pageButtons.findIndex(btn => btn.classList.contains('active'));

  if (direction === 'next' && currentIndex < pageButtons.length - 1) {
    setPage(pageButtons[currentIndex + 1]);
  } else if (direction === 'prev' && currentIndex > 0) {
    setPage(pageButtons[currentIndex - 1]);
  }
}

// Filtro Combinado (Busca + Checkboxes + Select + Paginação)
function filterBooks() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const subjectSelect = document.getElementById('subjectSelect').value;
  
  const checkedBoxes = Array.from(document.querySelectorAll('.filters-section input[type="checkbox"]:checked'))
                             .map(cb => cb.value);

  const books = document.querySelectorAll('.book-card');

  books.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const author = card.querySelector('.author').textContent.toLowerCase();
    const status = card.getAttribute('data-status');
    const category = card.getAttribute('data-category');
    const bookPage = card.getAttribute('data-page');

    const matchesSearch = title.includes(searchInput) || author.includes(searchInput);
    const matchesSubject = (subjectSelect === 'todos' || category === subjectSelect);

    let matchesCheckboxes = true;
    if (checkedBoxes.length > 0) {
      matchesCheckboxes = checkedBoxes.includes(status) || checkedBoxes.includes(category);
    }

    // Se o usuário estiver pesquisando ou usando filtros, mostra em todas as páginas
    const isFiltering = searchInput !== '' || subjectSelect !== 'todos' || checkedBoxes.length > 0;
    const matchesPage = isFiltering ? true : (bookPage === currentPage);

    if (matchesSearch && matchesSubject && matchesCheckboxes && matchesPage) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}