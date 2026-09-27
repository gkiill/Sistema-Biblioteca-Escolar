const API_URL = 'http://localhost:8000/api/v1';

// SIMULAÇÃO DE BANCO DE DADOS DE LIVROS (Fallback Legado)
const booksDatabase = {
  "jantar-secreto": {
    title: "Jantar Secreto",
    author: "Raphael Montes",
    isbn: "978-85-3592-835-6",
    publisher: "Companhia das Letras",
    publicationDate: "14/11/2016",
    category: "Ficção",
    tags: ["Suspense/Thriller", "Terror", "Crime"],
    cover: "https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg",
    synopsis: "Um grupo de jovens deixa uma pequena cidade no Paraná para viver no Rio de Janeiro. Eles alugam um apartamento em Copacabana e fazem o possível para pagar a faculdade e manter vivos seus sonhos de sucesso na capital fluminense."
  },
  "harry-potter": {
    title: "Harry Potter e o Cálice de Fogo",
    author: "J.K. Rowling",
    isbn: "978-85-3253-080-6",
    publisher: "Rocco",
    publicationDate: "01/11/2000",
    category: "Ficção",
    tags: ["Fantasia", "Aventura", "Magia"],
    cover: "https://m.media-amazon.com/images/I/81S88mY0eaL._AC_UF1000,1000_QL80_.jpg",
    synopsis: "Haverá um torneio em Hogwarts que reunirá três escolas de magia. Harry Potter é misteriosamente selecionado para participar do perigoso Torneio Tribruxo, enfrentando dragões, sereianos e os seus piores medos."
  }
};

// ALTERNAR VISIBILIDADE DA SIDEBAR
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// VOLTAR À PÁGINA ANTERIOR
function goBack() {
  window.history.back();
}

// PREENCHER A PÁGINA COM BASE NO PARÂMETRO 'id' DA URL (Consumindo a API RESTful)
document.addEventListener("DOMContentLoaded", async () => {
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

  // Logout com sessão real
  document.querySelectorAll('.link-logout').forEach(link => {
    link.addEventListener('click', async function(e) {
      e.preventDefault();
      try {
        await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
      } catch(err){}
      localStorage.removeItem('usuario_logado');
      window.location.href = 'login.html';
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id') || "1";

  // 1. Tentar buscar dados reais do banco PostgreSQL via API Laravel
  try {
    const response = await fetch(`${API_URL}/livros/${bookId}`);
    if (response.ok) {
      const livro = await response.json();

      document.getElementById("bookTitle").textContent = livro.titulo;
      document.getElementById("bookAuthor").value = livro.autor ? livro.autor.nome : "Autor Desconhecido";
      document.getElementById("bookIsbn").value = livro.isbn || "-";
      document.getElementById("bookPublisher").value = livro.editora || "Biblioteca Paulo Freire";
      document.getElementById("bookPublicationDate").value = livro.ano_publicacao || "-";
      document.getElementById("bookCategory").value = (livro.categorias && livro.categorias.length > 0) ? livro.categorias[0].nome : "Geral";
      
      const coverImg = document.getElementById("bookCover");
      const defaultImg = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400";
      coverImg.src = livro.capa_url || defaultImg;
      coverImg.onerror = function() { this.src = defaultImg; };

      document.getElementById("bookSynopsis").textContent = livro.sinopse || "Sem sinopse cadastrada.";

      // Gerar as Tags Dinamicamente
      const tagsContainer = document.getElementById("bookTags");
      tagsContainer.innerHTML = "";

      if (livro.categorias && livro.categorias.length > 0) {
        livro.categorias.forEach(cat => {
          const tagSpan = document.createElement("span");
          tagSpan.className = "tag-item";
          tagSpan.textContent = cat.nome;
          tagsContainer.appendChild(tagSpan);
        });
      } else {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag-item";
        tagSpan.textContent = "Acervo Geral";
        tagsContainer.appendChild(tagSpan);
      }
      return;
    }
  } catch (err) {
    console.warn("Falha ao buscar livro da API, utilizando fallback local:", err);
  }

  // 2. Fallback caso o ID seja um slug estático legado
  const book = booksDatabase[bookId];
  if (book) {
    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookIsbn").value = book.isbn;
    document.getElementById("bookPublisher").value = book.publisher;
    document.getElementById("bookPublicationDate").value = book.publicationDate;
    document.getElementById("bookCategory").value = book.category;
    document.getElementById("bookCover").src = book.cover;
    document.getElementById("bookSynopsis").textContent = book.synopsis;

    const tagsContainer = document.getElementById("bookTags");
    tagsContainer.innerHTML = "";
    book.tags.forEach(tagText => {
      const tagSpan = document.createElement("span");
      tagSpan.className = "tag-item";
      tagSpan.textContent = tagText;
      tagsContainer.appendChild(tagSpan);
    });
  } else {
    document.getElementById("bookTitle").textContent = "Livro não encontrado!";
  }
});