// SIMULAÇÃO DE BANCO DE DADOS DE LIVROS
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
    synopsis: "Um grupo de jovens deixa uma pequena cidade no Paraná para viver no Rio de Janeiro. Eles alugam um apartamento em Copacabana e fazem o possível para pagar a faculdade e manter vivos seus sonhos de sucesso na capital fluminense. Mas o dinheiro está curto e o aluguel está vencido. Para sair do buraco e manter o apartamento, os amigos adotam uma estratégia heterodoxa: arrecadar fundos por meio de jantares secretos, divulgados pela internet para uma clientela exclusiva da elite carioca. A partir daí, eles se envolvem em uma espiral de crimes, descobrem uma rede de contrabando de corpos, matadouros clandestinos e grã-finos excêntricos, e levam ao limite uma índole perversa que jamais imaginaram existir em cada um deles."
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

// PREENCHER A PÁGINA COM BASE NO PARÂMETRO 'id' DA URL
document.addEventListener("DOMContentLoaded", () => {
  // Pega os parâmetros da URL (Ex: detalhesLivro.html?id=jantar-secreto)
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id') || "jantar-secreto"; // Padrão "jantar-secreto" caso não passe ID

  // Busca o livro no nosso banco de dados
  const book = booksDatabase[bookId];

  if (book) {
    // Preenche os campos de texto com os dados do livro
    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookIsbn").value = book.isbn;
    document.getElementById("bookPublisher").value = book.publisher;
    document.getElementById("bookPublicationDate").value = book.publicationDate;
    document.getElementById("bookCategory").value = book.category;
    document.getElementById("bookCover").src = book.cover;
    document.getElementById("bookSynopsis").textContent = book.synopsis;

    // Gerar as Tags Dinamicamente
    const tagsContainer = document.getElementById("bookTags");
    tagsContainer.innerHTML = ""; // Limpa tags anteriores

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