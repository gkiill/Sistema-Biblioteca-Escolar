// Função para abrir/fechar Menu Lateral
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Filtro rápido da barra de pesquisa do bibliotecário
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const activities = document.querySelectorAll('.activity-item');

  activities.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Redirecionamento ao clicar no botão de "Revisar agora"
function goToOverdue() {
  window.location.href = 'emprestimos.html?filter=atrasados';
}