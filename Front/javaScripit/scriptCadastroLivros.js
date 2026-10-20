const API_URL = 'http://localhost:8000/api/v1';

// Alternar Menu Lateral
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

/* --- MODAL CAPA DO LIVRO --- */
let tempCoverDataUrl = null;
let bookCoverUrlFromApi = null;

function openCoverModal() {
  document.getElementById('modalCover').classList.add('active');
}

function closeCoverModal() {
  document.getElementById('modalCover').classList.remove('active');
}

function previewCoverImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      tempCoverDataUrl = e.target.result;
      document.getElementById('coverPreviewImg').src = tempCoverDataUrl;
      document.getElementById('modalPreviewArea').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function confirmCoverUpload() {
  if (!tempCoverDataUrl) {
    alert('Por favor, selecione uma imagem primeiro.');
    return;
  }

  const dropzoneContent = document.getElementById('dropzoneContent');
  dropzoneContent.innerHTML = `
    <div class="cover-success-box" style="text-align: center;">
      <img src="${tempCoverDataUrl}" style="max-height: 180px; border-radius: 6px; margin-bottom: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
      <p class="cover-success-text" style="color: #166534; font-weight: 600;">Capa carregada com sucesso!</p>
    </div>
  `;

  closeCoverModal();
}

/* --- BUSCA DE LIVRO NA API PÚBLICA (Requisito 6) --- */
async function buscarDadosIsbn() {
  const isbnInput = document.getElementById('bookIsbn');
  const feedback = document.getElementById('isbnFeedback');
  const btn = document.getElementById('btnBuscarIsbn');
  const rawIsbn = isbnInput.value.replace(/[^0-9X]/gi, '');

  if (!rawIsbn) {
    alert('Por favor, digite o ISBN antes de buscar na API.');
    isbnInput.focus();
    return;
  }

  btn.disabled = true;
  btn.innerHTML = 'Buscando...';
  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.color = '#2563eb';
    feedback.textContent = 'Consultando API pública externa...';
  }

  try {
    const response = await fetch(`${API_URL}/livros/externo/isbn/${rawIsbn}`);
    const res = await response.json();

    if (!response.ok || !res.sucesso) {
      throw new Error(res.mensagem || 'Livro não encontrado na API pública.');
    }

    const livro = res.dados;

    // Preenche os campos do formulário automaticamente
    if (livro.titulo) document.getElementById('bookTitle').value = livro.titulo;
    if (livro.autor) document.getElementById('bookAuthor').value = livro.autor;
    if (livro.editora) document.getElementById('bookPublisher').value = livro.editora;
    if (livro.ano_publicacao) {
      document.getElementById('bookPublicationDate').value = `${livro.ano_publicacao}-01-01`;
    }
    if (livro.sinopse) {
      const synopsisEl = document.getElementById('bookSynopsis');
      if (synopsisEl) synopsisEl.value = livro.sinopse;
    }

    // Se a API retornou URL de capa, atualiza a pré-visualização
    if (livro.capa_url) {
      bookCoverUrlFromApi = livro.capa_url;
      const dropzoneContent = document.getElementById('dropzoneContent');
      dropzoneContent.innerHTML = `
        <div style="text-align: center;">
          <img src="${livro.capa_url}" alt="Capa do Livro" style="max-height: 180px; border-radius: 6px; margin-bottom: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);" />
          <p style="color: #166534; font-size: 12px; font-weight: 600;">Capa obtida via ${livro.origem}</p>
        </div>
      `;
    }

    if (feedback) {
      feedback.style.color = '#166534';
      feedback.textContent = `Encontrado via ${livro.origem}! Campos preenchidos automaticamente.`;
    }
  } catch (error) {
    if (feedback) {
      feedback.style.color = '#dc2626';
      feedback.textContent = error.message;
    } else {
      alert(error.message);
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fi fi-rr-search"></i> Buscar na API';
  }
}

/* --- CLASSIFICAÇÃO / DROPDOWN INTERATIVO --- */
function toggleCategoryDropdown() {
  const list = document.getElementById('categoryList');
  list.classList.toggle('active');
}

function selectCategory(name) {
  document.getElementById('categoryInput').value = name;
  document.getElementById('categoryList').classList.remove('active');
}

function filterCategories() {
  const filter = document.getElementById('categoryInput').value.toLowerCase();
  const list = document.getElementById('categoryList');
  const items = list.getElementsByTagName('li');

  list.classList.add('active');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.classList.contains('dropdown-header')) continue;

    const txtValue = item.textContent || item.innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
}

document.addEventListener('click', function(e) {
  const selectBox = document.querySelector('.custom-select-group');
  if (selectBox && !selectBox.contains(e.target)) {
    const list = document.getElementById('categoryList');
    if (list) list.classList.remove('active');
  }
});

/* --- TAGS SYSTEM --- */
function addTag(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = document.getElementById('tagInput');
    const value = input.value.trim();

    if (value !== '') {
      const tagsList = document.getElementById('tagsList');
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.innerHTML = `${value} <button type="button" onclick="removeTag(this)">&times;</button>`;
      tagsList.appendChild(tagSpan);
      input.value = '';
    }
  }
}

function removeTag(button) {
  button.parentElement.remove();
}

/* --- ENVIO DO FORMULÁRIO (SALVAMENTO REAL NO POSTGRESQL) --- */
async function handleFormSubmit(event) {
  event.preventDefault();

  const statusModal = document.getElementById('statusModal');
  const statusLoading = document.getElementById('statusLoading');
  const statusSuccess = document.getElementById('statusSuccess');

  const titulo = document.getElementById('bookTitle').value.trim();
  const autor_nome = document.getElementById('bookAuthor').value.trim();
  const rawIsbn = document.getElementById('bookIsbn').value.trim();
  const dataPub = document.getElementById('bookPublicationDate').value;
  const sinopse = document.getElementById('bookSynopsis')?.value || null;

  let ano_publicacao = null;
  if (dataPub) {
    ano_publicacao = parseInt(dataPub.substring(0, 4));
  }

  const payload = {
    titulo,
    autor_nome,
    isbn: rawIsbn,
    ano_publicacao,
    sinopse,
    capa_url: bookCoverUrlFromApi || null,
    quantidade: 1
  };

  // Exibir Modal de Carregamento
  statusModal.classList.add('active');
  statusLoading.style.display = 'flex';
  statusSuccess.style.display = 'none';

  try {
    const response = await fetch(`${API_URL}/livros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.errors ? Object.values(data.errors).flat().join('\n') : (data.mensagem || data.message || 'Erro ao cadastrar livro.');
      throw new Error(errorMsg);
    }

    // Sucesso real gravado no PostgreSQL!
    statusLoading.style.display = 'none';
    statusSuccess.style.display = 'flex';

  } catch (error) {
    statusModal.classList.remove('active');
    alert('Erro no cadastro:\n' + error.message);
  }
}

function finishRegistration() {
  document.getElementById('statusModal').classList.remove('active');
  resetForm();
}

function resetForm() {
  document.getElementById('bookForm').reset();
  const dropzoneContent = document.getElementById('dropzoneContent');
  dropzoneContent.innerHTML = `
    <div class="upload-circle">
      <i class="fi fi-rr-cloud-upload"></i>
    </div>
    <strong class="upload-title">Fazer upload da capa</strong>
    <p class="upload-desc">Arraste e solte ou clique para procurar.<br>Tamanho recomendado: 600x900px</p>
  `;
  tempCoverDataUrl = null;
  bookCoverUrlFromApi = null;
  const feedback = document.getElementById('isbnFeedback');
  if (feedback) feedback.style.display = 'none';
}

// Controle de Logout (Requisito 5)
document.querySelectorAll('.link-logout').forEach(link => {
  link.addEventListener('click', async function(e) {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Logout API:', err);
    }
    localStorage.removeItem('usuario_logado');
    window.location.href = 'login.html';
  });
});