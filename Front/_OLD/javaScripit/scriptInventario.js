const API_URL = 'http://localhost:8000/api/v1';

// Estado Global
let activeStatusFilter = null;
let currentPage = 1;
const itemsPerPage = 8;
let debounceTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarMetricas();
  carregarCategorias();
  carregarTabela(1);
  sincronizarPerfilAdmin();
});

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

// Sincroniza dados do bibliotecário logado na sidebar
function sincronizarPerfilAdmin() {
  const raw = localStorage.getItem('usuario_logado');
  if (!raw) return;
  try {
    const user = JSON.parse(raw);
    const nameEl = document.querySelector('.user-info strong');
    const docEl = document.querySelector('.user-info span');
    if (nameEl && user.name) nameEl.textContent = user.name;
    if (docEl && user.email) docEl.textContent = user.email;
  } catch (e) {}
}

// 1. Carrega métricas consolidadas do estoque direto do PostgreSQL
async function carregarMetricas() {
  try {
    const response = await fetch(`${API_URL}/inventario/metricas`);
    if (!response.ok) return;

    const data = await response.json();

    const statTotal = document.getElementById('statTotal');
    const statAvailable = document.getElementById('statAvailable');
    const statAvailablePercent = document.getElementById('statAvailablePercent');
    const statBorrowed = document.getElementById('statBorrowed');
    const statOverdue = document.getElementById('statOverdue');

    if (statTotal) statTotal.textContent = data.total_estoque.toLocaleString('pt-BR');
    if (statAvailable) statAvailable.textContent = data.disponivel.toLocaleString('pt-BR');
    if (statAvailablePercent) statAvailablePercent.textContent = `${data.percentual_disponivel}% do total`;
    if (statBorrowed) statBorrowed.textContent = data.emprestados.toLocaleString('pt-BR');
    if (statOverdue) statOverdue.textContent = `${data.atrasados} Atrasados`;
  } catch (err) {
    console.error('Erro ao buscar métricas de estoque:', err);
  }
}

// 2. Carrega categorias dinâmicas do banco de dados
async function carregarCategorias() {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) return;

    const categorias = await response.json();
    const select = document.getElementById('categoryFilter');
    if (!select) return;

    select.innerHTML = '<option value="ALL">Todas as categorias</option>';
    categorias.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.nome;
      select.appendChild(opt);
    });
  } catch (err) {
    console.warn('Erro ao carregar categorias:', err);
  }
}

// 3. Filtro por status
function toggleStatusFilter(button) {
  const status = button.getAttribute('data-status');

  if (activeStatusFilter === status) {
    activeStatusFilter = null;
    button.classList.remove('active');
  } else {
    document.querySelectorAll('.btn-filter-tag').forEach(b => b.classList.remove('active'));
    activeStatusFilter = status;
    button.classList.add('active');
  }

  currentPage = 1;
  carregarTabela(1);
}

// 4. Busca com debounce
function handleFilter() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage = 1;
    carregarTabela(1);
  }, 350);
}

// 5. Carrega a tabela de inventário com os livros reais do banco de dados
async function carregarTabela(page = 1) {
  currentPage = page;
  const tbody = document.getElementById('inventoryTableBody');
  const recordInfo = document.getElementById('tableRecordInfo');
  const pagination = document.getElementById('paginationControls');

  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #718096; padding: 32px;"><i class="fi fi-rr-spinner" style="animation: spin 1s infinite linear;"></i> Carregando estoque do banco de dados...</td></tr>`;
  }

  const search = document.getElementById('searchInput')?.value.trim() || '';
  const categoryId = document.getElementById('categoryFilter')?.value || 'ALL';

  const params = new URLSearchParams({
    page: page,
    per_page: itemsPerPage
  });

  if (search) params.append('busca', search);
  if (categoryId !== 'ALL') params.append('categoria_id', categoryId);
  if (activeStatusFilter) params.append('status', activeStatusFilter);

  try {
    const response = await fetch(`${API_URL}/livros?${params.toString()}`);
    if (!response.ok) throw new Error('Falha ao consultar livros');

    const data = await response.json();
    const livros = data.data || [];
    const totalRecords = data.total || 0;
    const totalPages = data.last_page || 1;

    tbody.innerHTML = '';

    if (livros.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #a0aec0; padding: 28px;">Nenhum livro encontrado com os filtros aplicados.</td></tr>`;
    } else {
      livros.forEach(livro => {
        const autorNome = livro.autor?.nome || 'Autor não informado';
        const categoriaNome = (livro.categorias && livro.categorias.length > 0)
          ? livro.categorias.map(c => c.nome).join(', ')
          : 'Geral';
        const capa = livro.capa_url || 'https://via.placeholder.com/36x52/03254c/ffffff?text=Capa';
        const totalQtd = livro.quantidade || 1;
        const emprestadosQtd = livro.emprestimos_ativos_count || 0;
        const disponivelQtd = Math.max(0, totalQtd - emprestadosQtd);

        let statusBadge = '';
        if (disponivelQtd > 0) {
          statusBadge = `<span class="status-pill disponivel"><i class="fi fi-sr-bullet"></i> ${disponivelQtd} de ${totalQtd} disponíveis</span>`;
        } else {
          statusBadge = `<span class="status-pill emprestado"><i class="fi fi-rr-time-fast"></i> Esgotado (${totalQtd} emprestados)</span>`;
        }

        const dataFormatada = livro.created_at 
          ? new Date(livro.created_at).toLocaleDateString('pt-BR') 
          : 'Disponível';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="book-info-cell">
              <img src="${capa}" alt="${livro.titulo}" class="book-cover-thumb" onerror="this.src='https://via.placeholder.com/36x52/03254c/ffffff?text=Livro'">
              <div class="book-details">
                <strong>${livro.titulo}</strong>
                <span>${autorNome}</span>
                <span>ISBN: ${livro.isbn || 'N/A'}</span>
              </div>
            </div>
          </td>
          <td><span class="badge-category">${categoriaNome}</span></td>
          <td>${statusBadge}</td>
          <td><span style="color: #4a5568; font-size: 13px;">Atualizado em ${dataFormatada}</span></td>
        `;
        tbody.appendChild(row);
      });
    }

    // Info do rodapé
    if (recordInfo) {
      const from = data.from || (totalRecords > 0 ? 1 : 0);
      const to = data.to || totalRecords;
      recordInfo.textContent = `Exibindo ${from} a ${to} de ${totalRecords} títulos cadastrados`;
    }

    renderPagination(totalPages);

  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #e53e3e; padding: 24px;">Erro ao carregar dados do inventário: ${err.message}</td></tr>`;
    }
  }
}

// 6. Paginação responsiva
function renderPagination(totalPages) {
  const container = document.getElementById('paginationControls');
  if (!container) return;
  container.innerHTML = '';

  if (totalPages <= 1) return;

  // Botão Anterior
  const prevBtn = document.createElement('button');
  prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = `<i class="fi fi-rr-angle-small-left"></i>`;
  prevBtn.onclick = () => { if (currentPage > 1) carregarTabela(currentPage - 1); };
  container.appendChild(prevBtn);

  // Páginas com elipses
  let pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  pages.forEach(p => {
    if (p === '...') {
      const span = document.createElement('span');
      span.textContent = '...';
      span.style.padding = '0 6px';
      span.style.color = '#a0aec0';
      container.appendChild(span);
    } else {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${p === currentPage ? 'active' : ''}`;
      pageBtn.innerText = p;
      pageBtn.onclick = () => carregarTabela(p);
      container.appendChild(pageBtn);
    }
  });

  // Botão Próximo
  const nextBtn = document.createElement('button');
  nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = `<i class="fi fi-rr-angle-small-right"></i>`;
  nextBtn.onclick = () => { if (currentPage < totalPages) carregarTabela(currentPage + 1); };
  container.appendChild(nextBtn);
}
