// Máscara para o formato 000-00-0000-0
function applyISBNMask(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  if (value.length > 9) {
    value = value.replace(/^(\d{3})(\d{2})(\d{4})(\d{1})$/, '$1-$2-$3-$4');
  } else if (value.length > 5) {
    value = value.replace(/^(\d{3})(\d{2})(\d{0,4})$/, '$1-$2-$3');
  } else if (value.length > 3) {
    value = value.replace(/^(\d{3})(\d{0,2})$/, '$1-$2');
  }

  input.value = value;
}

// Alternar Menu Lateral
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

/* --- MODAL CAPA DO LIVRO --- */
let tempCoverDataUrl = null;

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

  // Atualizar visual da Dropzone na tela principal
  const dropzoneContent = document.getElementById('dropzoneContent');
  dropzoneContent.innerHTML = `
    <div class="cover-success-box">
      <div class="success-icon-circle">
        <i class="fi fi-rr-check"></i>
      </div>
      <p class="cover-success-text">Upload feito com sucesso!</p>
    </div>
  `;

  closeCoverModal();
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

// Fechar dropdown ao clicar fora
document.addEventListener('click', function(e) {
  const selectBox = document.querySelector('.custom-select-group');
  if (selectBox && !selectBox.contains(e.target)) {
    document.getElementById('categoryList').classList.remove('active');
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

/* --- ENVIO DO FORMULÁRIO (LOADING -> SUCESSO) --- */
function handleFormSubmit(event) {
  event.preventDefault();

  const statusModal = document.getElementById('statusModal');
  const statusLoading = document.getElementById('statusLoading');
  const statusSuccess = document.getElementById('statusSuccess');

  // Exibir Modal no estado Loading
  statusModal.classList.add('active');
  statusLoading.style.display = 'flex';
  statusSuccess.style.display = 'none';

  // Simulação de tempo de carregamento de 2.5 segundos
  setTimeout(() => {
    statusLoading.style.display = 'none';
    statusSuccess.style.display = 'flex';
  }, 2500);
}

function finishRegistration() {
  document.getElementById('statusModal').classList.remove('active');
  resetForm();
}

function resetForm() {
  document.getElementById('bookForm').reset();
  
  // Restaurar estado da Dropzone
  const dropzoneContent = document.getElementById('dropzoneContent');
  dropzoneContent.innerHTML = `
    <div class="upload-circle">
      <i class="fi fi-rr-cloud-upload"></i>
    </div>
    <strong class="upload-title">Fazer upload da capa</strong>
    <p class="upload-desc">Arraste e solte ou clique para procurar.<br>Tamanho recomendado: 600x900px</p>
  `;
  tempCoverDataUrl = null;
}