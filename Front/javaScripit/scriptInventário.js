// Base de Dados do Inventário
const inventoryData = [
  {
    id: 1,
    title: "A Arquitetura da Modernidade",
    author: "Dr. Evelyn Vance",
    isbn: "9783161404100",
    cover: "https://via.placeholder.com/36x52/03254c/ffffff?text=Capa",
    category: "Design",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Devolvido há 2 dias atrás"
  },
  {
    id: 2,
    title: "Engenharia de Sistemas Digitais",
    author: "William J. Dally",
    isbn: "97805211061759",
    cover: "https://via.placeholder.com/36x52/2b6cb0/ffffff?text=Capa",
    category: "Ciência da Computação",
    status: "emprestado",
    dueDate: "24/09/2026",
    lastActivity: "Emprestado há 1 semana atrás"
  },
  {
    id: 3,
    title: "Jantar Secreto",
    author: "Raphael Montes",
    isbn: "9788535928356",
    cover: "https://via.placeholder.com/36x52/e53e3e/ffffff?text=Capa",
    category: "Suspense",
    status: "atrasado",
    dueDate: "01/09/2026",
    lastActivity: "Notificado há 2 dias atrás"
  },
  {
    id: 4,
    title: "Algoritmos: Teoria e Prática",
    author: "Thomas H. Cormen",
    isbn: "9788535236996",
    cover: "https://via.placeholder.com/36x52/2f855a/ffffff?text=Capa",
    category: "Ciência da Computação",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Cadastrado há 3 dias atrás"
  },
  {
    id: 5,
    title: "O Povo Brasileiro",
    author: "Darcy Ribeiro",
    isbn: "9788535928311",
    cover: "https://via.placeholder.com/36x52/d69e2e/ffffff?text=Capa",
    category: "História",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Devolvido há 5 horas atrás"
  },
  {
    id: 6,
    title: "Duna",
    author: "Frank Herbert",
    isbn: "9788576573135",
    cover: "https://via.placeholder.com/36x52/805ad5/ffffff?text=Capa",
    category: "Ficção Científica",
    status: "emprestado",
    dueDate: "18/09/2026",
    lastActivity: "Emprestado há 3 dias atrás"
  },
  {
    id: 7,
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    isbn: "9788535902785",
    cover: "https://via.placeholder.com/36x52/b83280/ffffff?text=Capa",
    category: "Romance",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Devolvido há 1 semana atrás"
  },
  {
    id: 8,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    cover: "https://via.placeholder.com/36x52/319795/ffffff?text=Capa",
    category: "Ciência da Computação",
    status: "atrasado",
    dueDate: "28/08/2026",
    lastActivity: "Notificado há 4 dias atrás"
  },
  {
    id: 9,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    isbn: "9788508152209",
    cover: "https://via.placeholder.com/36x52/4a5568/ffffff?text=Capa",
    category: "Romance",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Cadastrado há 2 semanas atrás"
  },
  {
    id: 10,
    title: "Design Thinking",
    author: "Tim Brown",
    isbn: "9788576088219",
    cover: "https://via.placeholder.com/36x52/dd6b20/ffffff?text=Capa",
    category: "Design",
    status: "emprestado",
    dueDate: "20/09/2026",
    lastActivity: "Emprestado ontem"
  },
  {
    id: 11,
    title: "Neuromancer",
    author: "William Gibson",
    isbn: "9788576573005",
    cover: "https://via.placeholder.com/36x52/3182ce/ffffff?text=Capa",
    category: "Ficção Científica",
    status: "disponivel",
    dueDate: null,
    lastActivity: "Devolvido há 3 dias atrás"
  }
];

// Estado Global da Aplicação
let activeStatusFilter = null;
let currentPage = 1;
const itemsPerPage = 4;

document.addEventListener('DOMContentLoaded', () => {
  calculateMetrics();
  renderTable();
});

// Sidebar Toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}

// Cálculo das Métricas dos Cards Superiores
function calculateMetrics() {
  const total = inventoryData.length;
  const available = inventoryData.filter(item => item.status === 'disponivel').length;
  const borrowed = inventoryData.filter(item => item.status === 'emprestado').length;
  const overdue = inventoryData.filter(item => item.status === 'atrasado').length;

  document.getElementById('statTotal').innerText = total.toLocaleString('pt-BR');
  document.getElementById('statAvailable').innerText = available.toLocaleString('pt-BR');
  document.getElementById('statBorrowed').innerText = (borrowed + overdue).toLocaleString('pt-BR');
  document.getElementById('statOverdue').innerText = `${overdue} Atrasados`;

  const availablePercent = total > 0 ? Math.round((available / total) * 100) : 0;
  document.getElementById('statAvailablePercent').innerText = `${availablePercent}% do total`;
}

// Ativar/Desativar Filtros de Status
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
  renderTable();
}

// Filtro Combinado (Texto + Categoria + Status)
function getFilteredData() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  return inventoryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search) || 
                          item.author.toLowerCase().includes(search) || 
                          item.isbn.includes(search);
    
    const matchesCategory = (category === 'ALL') || (item.category === category);
    const matchesStatus = !activeStatusFilter || (item.status === activeStatusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function handleFilter() {
  currentPage = 1;
  renderTable();
}

// Renderizar Tabela e Paginação
function renderTable() {
  const filtered = getFilteredData();
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = '';

  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const pageItems = filtered.slice(startIndex, endIndex);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #a0aec0; padding: 24px;">Nenhum recurso encontrado.</td></tr>`;
  } else {
    pageItems.forEach(item => {
      let statusBadge = '';
      if (item.status === 'disponivel') {
        statusBadge = `<span class="status-pill disponivel"><i class="fi fi-sr-bullet"></i> Disponível</span>`;
      } else if (item.status === 'emprestado') {
        statusBadge = `
          <span class="status-pill emprestado"><i class="fi fi-rr-user"></i> Emprestado</span>
          <span class="due-date-sub">Devolução: ${item.dueDate}</span>
        `;
      } else if (item.status === 'atrasado') {
        statusBadge = `
          <span class="status-pill atrasado"><i class="fi fi-rr-exclamation"></i> Atrasado</span>
          <span class="due-date-sub">Devolução: ${item.dueDate}</span>
        `;
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="book-info-cell">
            <img src="${item.cover}" alt="Capa" class="book-cover-thumb">
            <div class="book-details">
              <strong>${item.title}</strong>
              <span>${item.author}</span>
              <span>ISBN: ${item.isbn}</span>
            </div>
          </div>
        </td>
        <td><span class="badge-category">${item.category}</span></td>
        <td>${statusBadge}</td>
        <td><span style="color: #4a5568;">${item.lastActivity}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Atualizar Info de Registros
  const infoText = totalRecords > 0 
    ? `Exibindo ${startIndex + 1} a ${endIndex} de ${totalRecords} registros`
    : `Exibindo 0 registros`;
  document.getElementById('tableRecordInfo').innerText = infoText;

  renderPaginationControls(totalPages);
}

// Renderização dos Botões da Paginação
function renderPaginationControls(totalPages) {
  const container = document.getElementById('paginationControls');
  container.innerHTML = '';

  // Botão Anterior
  const prevBtn = document.createElement('button');
  prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = `<i class="fi fi-rr-angle-small-left"></i>`;
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
  container.appendChild(prevBtn);

  // Páginas
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.innerText = i;
    pageBtn.onclick = () => { currentPage = i; renderTable(); };
    container.appendChild(pageBtn);
  }

  // Botão Próximo
  const nextBtn = document.createElement('button');
  nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = `<i class="fi fi-rr-angle-small-right"></i>`;
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderTable(); } };
  container.appendChild(nextBtn);
}