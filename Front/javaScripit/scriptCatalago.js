const API_URL = 'http://localhost:8000/api/v1';

// Variável global para rastrear a página atual
let currentPage = "1";
let totalPages = 1;
const BOOKS_PER_PAGE = 8;

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
  
  // Atualiza botões de paginação
  const total = document.querySelectorAll('.book-card').length;
  atualizarPaginacao(total);

  filterBooks();
}

// Controle de Paginação (Botões azuis)
function setPage(element) {
  renderPage(element.textContent.trim());
}

function changePage(direction) {
  let curr = parseInt(currentPage);
  if (direction === 'next' && curr < totalPages) {
    renderPage(curr + 1);
  } else if (direction === 'prev' && curr > 1) {
    renderPage(curr - 1);
  }
}

// Atualiza os botões de paginação dinamicamente com base na quantidade real de livros
function atualizarPaginacao(total) {
  totalPages = Math.ceil(total / BOOKS_PER_PAGE) || 1;
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    currentPage = "1";
    return;
  }

  paginationContainer.style.display = 'flex';
  const curr = parseInt(currentPage);
  let html = `<button class="page-btn page-nav" onclick="changePage('prev')">Anterior</button>`;

  const pagesToShow = new Set();
  pagesToShow.add(1);
  pagesToShow.add(totalPages);
  for (let i = Math.max(1, curr - 2); i <= Math.min(totalPages, curr + 2); i++) {
    pagesToShow.add(i);
  }

  const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
  let prevPage = 0;

  for (const page of sortedPages) {
    if (prevPage && page - prevPage > 1) {
      html += `<span class="dots" style="display:inline-flex;align-items:center;padding:0 6px;color:#9ca3af;font-weight:700;">...</span>`;
    }
    html += `<button class="page-btn page-num ${page.toString() === currentPage ? 'active' : ''}" onclick="setPage(this)">${page}</button>`;
    prevPage = page;
  }

  html += `<button class="page-btn page-nav" onclick="changePage('next')">Próximo</button>`;
  paginationContainer.innerHTML = html;
}

// Filtro Combinado (Busca + Checkboxes + Select + Paginação)
function filterBooks() {
  const searchInput = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
  const subjectSelect = document.getElementById('subjectSelect')?.value || 'todos';
  
  const checkedBoxes = Array.from(document.querySelectorAll('.filters-section input[type="checkbox"]:checked'))
                             .map(cb => cb.value);

  const books = document.querySelectorAll('.book-card');
  const booksGrid = document.getElementById('booksGrid');
  let visibleCount = 0;

  books.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const author = card.querySelector('.author')?.textContent.toLowerCase() || '';
    const status = card.getAttribute('data-status') || '';
    const category = card.getAttribute('data-category') || '';
    const bookPage = card.getAttribute('data-page') || '1';

    const matchesSearch = title.includes(searchInput) || author.includes(searchInput);
    const matchesSubject = (subjectSelect === 'todos' || category.toLowerCase().includes(subjectSelect.toLowerCase()));

    let matchesCheckboxes = true;
    if (checkedBoxes.length > 0) {
      matchesCheckboxes = checkedBoxes.some(val => status.includes(val) || category.includes(val));
    }

    // Se estiver pesquisando, ignora a paginação e mostra tudo que deu match
    const isFiltering = searchInput !== '' || subjectSelect !== 'todos' || checkedBoxes.length > 0;
    const matchesPage = isFiltering ? true : (bookPage === currentPage);

    if (matchesSearch && matchesSubject && matchesCheckboxes && matchesPage) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Mensagem amigável caso nenhum livro seja encontrado
  let emptyMsg = document.getElementById('emptyCatalogMsg');
  if (visibleCount === 0 && books.length > 0) {
    if (!emptyMsg) {
      emptyMsg = document.createElement('div');
      emptyMsg.id = 'emptyCatalogMsg';
      emptyMsg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #6b7280; font-size: 15px; font-weight: 500;';
      if (booksGrid) booksGrid.appendChild(emptyMsg);
    }
    emptyMsg.textContent = 'Nenhum livro encontrado para esta seleção.';
    emptyMsg.style.display = 'block';
  } else if (emptyMsg) {
    emptyMsg.style.display = 'none';
  }
}

// Carregar catálogo dinâmico da API Laravel
async function carregarCatalogoApi() {
  const booksGrid = document.getElementById('booksGrid');
  if (!booksGrid) return;

  try {
    const response = await fetch(`${API_URL}/livros?per_page=300`);
    if (!response.ok) return;

    const json = await response.json();
    const livros = json.data || [];

    if (livros.length > 0) {
      booksGrid.innerHTML = livros.map((livro, index) => {
        const disponivel = (livro.quantidade ?? 1) > 0;
        const autorNome = livro.autor?.nome || 'Autor Desconhecido';
        const capaUrl = livro.capa_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
        const pageNum = Math.floor(index / BOOKS_PER_PAGE) + 1;
        const categoriaNome = (livro.categorias && livro.categorias.length > 0) ? livro.categorias[0].nome : 'Geral';
        const categoriaSlug = categoriaNome.toLowerCase();
        const statusSlug = disponivel ? 'disponivel' : 'emprestado';

        return `
          <article class="book-card clickable" data-page="${pageNum}" data-status="${statusSlug}" data-category="${categoriaSlug}" onclick="goToBook(${livro.id})">
            <div class="cover-wrapper">
              <span class="badge ${disponivel ? 'badge-available' : 'badge-borrowed'}">
                • ${disponivel ? 'Disponível' : 'Emprestado'}
              </span>
              <img src="${capaUrl}" alt="${livro.titulo}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';">
            </div>
            <h3>${livro.titulo}</h3>
            <p class="author">${autorNome}</p>
            <div class="tags">
              <span class="tag">${categoriaNome}</span>
            </div>
          </article>
        `;
      }).join('');

      atualizarPaginacao(livros.length);
      renderPage("1");
    }
  } catch (err) {
    console.warn('Erro ao carregar catálogo da API:', err);
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Sincroniza dados do usuário logado na sidebar
  const userSaved = localStorage.getItem('usuario_logado');
  if (userSaved) {
    try {
      const user = JSON.parse(userSaved);
      const nameEl = document.querySelector('.user-info strong');
      const emailEl = document.querySelector('.user-info span');
      const avatarEl = document.querySelector('.user-profile .avatar-icon');

      if (nameEl && user.name) nameEl.textContent = user.name;
      if (emailEl) {
        const doc = user.documento || user.ra;
        emailEl.textContent = doc ? `RA: ${doc}` : user.email;
      }

      const foto = localStorage.getItem(`foto_perfil_${user.email}`);
      if (foto && avatarEl) {
        avatarEl.innerHTML = `<img src="${foto}" alt="${user.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      }
    } catch(e) {}
  }

  carregarCatalogoApi();

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