// Função para abrir e fechar a barra lateral
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Filtro por abas (Todos, Emprestados, Devolvidos)
let currentTab = 'todos';

function filterTab(type, button) {
  currentTab = type;

  // Atualizar visual dos botões
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  applyFilters();
}

// Filtro pela caixa de texto (Busca)
function filterSearch() {
  applyFilters();
}

// Aplicação conjunta dos filtros (Abas + Busca)
function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.history-card');

  cards.forEach(card => {
    const status = card.getAttribute('data-status');
    const title = card.querySelector('.book-title').textContent.toLowerCase();
    const author = card.querySelector('.book-author').textContent.toLowerCase();

    const matchesTab = (currentTab === 'todos' || status === currentTab);
    const matchesSearch = title.includes(query) || author.includes(query);

    // Esconde itens ocultos do "Ver Mais" a menos que a pesquisa esteja sendo feita
    const isExtra = card.classList.contains('extra-item');
    const showingAll = document.getElementById('seeMoreContainer').style.display === 'none';

    if (matchesTab && matchesSearch) {
      if (isExtra && !showingAll && query === '') {
        card.style.display = 'none';
      } else {
        card.style.display = 'flex';
      }
    } else {
      card.style.display = 'none';
    }
  });
}

// Função para exibir todos os livros (ao clicar em "Ver mais ...")
function showAllBooks() {
  const extraItems = document.querySelectorAll('.extra-item');
  extraItems.forEach(item => {
    item.style.display = 'flex';
  });

  // Oculta o botão "Ver mais"
  document.getElementById('seeMoreContainer').style.display = 'none';
}

// Ação de Pegar Novamente
function borrowAgain(bookId) {
  alert(`Solicitação para emprestar novamente enviada com sucesso!`);
}