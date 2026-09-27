const API_URL = 'http://localhost:8000/api/v1';

// Variável global para rastrear a página atual
let currentPage = "1";
let totalPages = 1;
const BOOKS_PER_PAGE = 6;

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
  
  // Atualiza classe active nos botões
  document.querySelectorAll('.page-num').forEach(btn => {
    if (btn.textContent.trim() === currentPage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

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

  // Se tem apenas 1 página, oculta a barra de paginação para não confundir o usuário
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    currentPage = "1";
    return;
  }

  paginationContainer.style.display = 'flex';
  let html = `<button class="page-btn page-nav" onclick="changePage('prev')">Anterior</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn page-num ${i.toString() === currentPage ? 'active' : ''}" onclick="setPage(this)">${i}</button>`;
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
      emptyMsg.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #4b5563; font-size: 15px; font-weight: 500;';
      if (booksGrid) booksGrid.appendChild(emptyMsg);
    }
    
    if (searchInput) {
      emptyMsg.innerHTML = `
        <div style="max-width: 480px; margin: 0 auto; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 12px; padding: 24px;">
          <p style="margin-bottom: 12px; font-size: 15px; color: #374151;">
            Nenhum livro com <strong>"${searchInput}"</strong> no acervo local da escola.
          </p>
          <button type="button" onclick="buscarNoAcervoGlobal('${searchInput.replace(/'/g, "\\'")}')" style="background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fi fi-rr-globe"></i> Pesquisar na Open Library API
          </button>
        </div>
      `;
    } else {
      emptyMsg.textContent = 'Nenhum livro encontrado para esta seleção.';
    }
    emptyMsg.style.display = 'block';
  } else if (emptyMsg) {
    emptyMsg.style.display = 'none';
  }
}

// Busca direta na API Aberta (Open Library)
async function buscarNoAcervoGlobal(termoCustomizado = null) {
  const searchInput = document.getElementById('searchInput');
  const termo = termoCustomizado || (searchInput ? searchInput.value.trim() : '') || 'tecnologia';
  const booksGrid = document.getElementById('booksGrid');
  const paginationContainer = document.querySelector('.pagination');
  if (!booksGrid) return;

  if (paginationContainer) paginationContainer.style.display = 'none';

  booksGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: #2563eb; font-weight: 600; font-size: 16px;">
      <i class="fi fi-rr-spinner" style="font-size: 24px; animation: spin 1s linear infinite; display: inline-block; margin-bottom: 10px;"></i>
      <p>Consultando acervo global da Open Library API para "<strong>${termo}</strong>"...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_URL}/livros/externo/buscar?q=${encodeURIComponent(termo)}&limit=12`);
    if (!response.ok) throw new Error('Falha na resposta da API');

    const json = await response.json();
    const dados = json.dados || [];

    if (dados.length === 0) {
      booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">
          <p>Nenhum livro encontrado na Open Library API para "${termo}".</p>
          <button onclick="carregarCatalogoApi()" style="margin-top: 14px; background: #374151; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-weight: 600;">
            Voltar ao Acervo Local
          </button>
        </div>
      `;
      return;
    }

    const bannerHtml = `
      <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 18px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px; color: #1e40af; font-size: 14px; font-weight: 600;">
          <i class="fi fi-rr-globe" style="font-size: 18px;"></i>
          <span>Exibindo ${dados.length} obras encontradas na Open Library API</span>
        </div>
        <button onclick="carregarCatalogoApi()" style="background: #1e40af; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; cursor: pointer;">
          ← Voltar ao Acervo da Escola
        </button>
      </div>
    `;

    const cardsHtml = dados.map((item, idx) => {
      const capaUrl = item.capa_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
      const itemEncoded = encodeURIComponent(JSON.stringify(item));

      return `
        <article class="book-card" data-page="1" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="cover-wrapper">
              <span class="badge" style="background: #7c3aed; color: #fff;">
                • Open Library API
              </span>
              <img src="${capaUrl}" alt="${item.titulo}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';">
            </div>
            <h3>${item.titulo}</h3>
            <p class="author">${item.autor}</p>
            <div class="tags">
              <span class="tag">${item.categoria || 'Geral'}</span>
              ${item.ano_publicacao ? `<span class="tag" style="background:#f3f4f6;color:#374151;">${item.ano_publicacao}</span>` : ''}
            </div>
          </div>
          <button type="button" class="btn-import-book" onclick="importarLivroExterno('${itemEncoded}', this)" style="margin-top: 12px; background: #059669; color: #fff; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fi fi-rr-download"></i> Salvar na Biblioteca
          </button>
        </article>
      `;
    }).join('');

    booksGrid.innerHTML = bannerHtml + cardsHtml;

  } catch (err) {
    booksGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #dc2626;">
        <p>Não foi possível conectar à Open Library API no momento.</p>
        <button onclick="carregarCatalogoApi()" style="margin-top: 14px; background: #374151; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-weight: 600;">
          Voltar ao Acervo Local
        </button>
      </div>
    `;
  }
}

// Salva um livro da Open Library diretamente no banco de dados local
async function importarLivroExterno(encodedData, btnElement) {
  try {
    const livro = JSON.parse(decodeURIComponent(encodedData));
    if (btnElement) {
      btnElement.disabled = true;
      btnElement.innerHTML = '<i class="fi fi-rr-spinner"></i> Salvando...';
    }

    const payload = {
      titulo: livro.titulo,
      autor_nome: livro.autor,
      isbn: livro.isbn || ('978' + Math.floor(1000000000 + Math.random() * 9000000000)),
      capa_url: livro.capa_url || null,
      ano_publicacao: livro.ano_publicacao || new Date().getFullYear(),
      sinopse: `Livro importado do acervo internacional Open Library API.`,
      quantidade: 3
    };

    const response = await fetch(`${API_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar livro');
    }

    if (btnElement) {
      btnElement.style.background = '#16a34a';
      btnElement.innerHTML = '✓ Salvo no Acervo!';
    }
  } catch (err) {
    console.error('Erro ao importar livro da API:', err);
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = '⚠️ Erro ao salvar';
    }
  }
}

// Carregar catálogo dinâmico da API Laravel
async function carregarCatalogoApi() {
  const booksGrid = document.getElementById('booksGrid');
  if (!booksGrid) return;

  try {
    const response = await fetch(`${API_URL}/livros?per_page=100`);
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