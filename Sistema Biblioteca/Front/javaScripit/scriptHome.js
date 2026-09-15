// Controle do Menu Lateral (Sidebar)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.toggle('active');
  
  // Se nenhum modal estiver ativo, alterna o overlay
  if (!document.querySelector('.modal.active')) {
    overlay.classList.toggle('active');
  }
}

// Controle de Modais
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

  // Desativa overlay se nem a sidebar nem outro modal estiverem ativos
  if (!sidebar.classList.contains('active')) {
    overlay.classList.remove('active');
  }
}

// Fecha tudo ao clicar no fundo escuro
function closeAllOverlays() {
  const sidebar = document.getElementById('sidebar');
  const modals = document.querySelectorAll('.modal');
  const overlay = document.getElementById('overlay');

  sidebar.classList.remove('active');
  modals.forEach(modal => modal.classList.remove('active'));
  overlay.classList.remove('active');
}

// Redirecionamento de livro
function goToBook(bookId) {
  window.location.href = `pagLivro.html?id=${bookId}`;
}

// Filtro de livros
function filterBooks() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const books = document.querySelectorAll('.book-card');

  books.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const author = card.querySelector('.author').textContent.toLowerCase();

    if (title.includes(input) || author.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}