const API_URL = 'http://localhost:8000/api/v1';

// Controle do Menu Lateral (Sidebar)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.toggle('active');
  
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

// Redirecionamento para a página de detalhes do livro
function goToBook(bookId) {
  window.location.href = `pagLivro.html?id=${bookId}`;
}

// Filtro de pesquisa na lista de livros
function filterBooks() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const books = document.querySelectorAll('.book-card');

  books.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const author = card.querySelector('.author')?.textContent.toLowerCase() || '';

    if (title.includes(input) || author.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Carregamento dinâmico dos livros reais da API
async function carregarLivrosHome() {
  const booksGrid = document.getElementById('booksGrid');
  if (!booksGrid) return;

  try {
    const response = await fetch(`${API_URL}/livros?per_page=12`);
    if (!response.ok) throw new Error('Falha ao obter livros');
    
    const json = await response.json();
    const livros = json.data || [];

    if (livros.length === 0) {
      booksGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280; padding: 30px;">Nenhum livro cadastrado no momento.</p>';
      return;
    }

    booksGrid.innerHTML = livros.map(livro => {
      const disponivel = (livro.quantidade ?? 1) > 0;
      const autorNome = livro.autor?.nome || 'Autor Desconhecido';
      const capaUrl = livro.capa_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
      const categorias = (livro.categorias && livro.categorias.length > 0)
        ? livro.categorias.map(c => `<span class="tag">${c.nome}</span>`).join('')
        : '<span class="tag">Geral</span>';

      return `
        <article class="book-card clickable" onclick="goToBook(${livro.id})">
          <div class="cover-wrapper">
            <span class="badge ${disponivel ? 'badge-available' : 'badge-borrowed'}">
              • ${disponivel ? 'Disponível' : 'Indisponível'}
            </span>
            <img src="${capaUrl}" alt="${livro.titulo}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';">
          </div>
          <h3>${livro.titulo}</h3>
          <p class="author">${autorNome}</p>
          <div class="tags">
            ${categorias}
          </div>
        </article>
      `;
    }).join('');

  } catch (error) {
    console.error('Erro ao conectar com API de livros:', error);
  }
}

// Inicialização e dados do usuário
document.addEventListener('DOMContentLoaded', () => {
  // Atualiza nome do usuário logado se existir
  const userSaved = localStorage.getItem('usuario_logado');
  if (userSaved) {
    try {
      const user = JSON.parse(userSaved);
      const nameEl = document.querySelector('.user-info strong');
      const emailEl = document.querySelector('.user-info span');
      if (nameEl && user.name) nameEl.textContent = user.name;
      if (emailEl && user.email) emailEl.textContent = user.email;
    } catch(e) {}
  }

  // Busca os livros reais do banco de dados
  carregarLivrosHome();

  // Controle de Logout com sessão real
  document.querySelectorAll('.link-logout').forEach(link => {
    link.addEventListener('click', async function(e) {
      e.preventDefault();
      try {
        await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
      } catch (err) {
        console.warn('Logout API:', err);
      }
      localStorage.removeItem('usuario_logado');
      window.location.href = 'login.html';
    });
  });
});