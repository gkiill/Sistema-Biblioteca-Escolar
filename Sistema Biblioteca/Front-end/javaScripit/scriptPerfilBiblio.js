// Base de Dados Simulado
const libraryData = {
  overdueBooksCount: 18, // Se for > 10, a biblioteca fica "Fora dos Conformidade"
  notifications: [
    "3 livros do acervo de Ciência da Computação estão atrasados.",
    "Novo exemplar 'Clean Code' foi adicionado por um administrador.",
    "Relatório de devoluções pendente de aprovação.",
    "Lembrete: Atualização do sistema agendada para o fim de semana."
  ],
  selectedImageBase64: null
};

document.addEventListener('DOMContentLoaded', () => {
  updateLibraryStatus();
  updateNotificationsUI();
});

// Controle de Modais
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  if (id === 'modalPassword') {
    document.getElementById('passErrorMsg').innerText = '';
  }
}

// Atualiza o Card de Status Conforme os Atrasos
function updateLibraryStatus() {
  const card = document.getElementById('statusCard');
  const icon = document.getElementById('statusIcon');
  const text = document.getElementById('statusText');

  if (libraryData.overdueBooksCount > 10) {
    card.className = 'card-status irregular';
    icon.className = 'fi fi-rr-cross';
    text.innerText = 'Fora dos Conformidade';
  } else {
    card.className = 'card-status regular';
    icon.className = 'fi fi-rr-check';
    text.innerText = 'Situação Regular';
  }
}

// Atualiza a Área de Notificações
function updateNotificationsUI() {
  const count = libraryData.notifications.length;
  const summaryText = document.getElementById('notifSummaryText');
  
  if (count > 0) {
    summaryText.innerText = `Você tem ${count} alertas sobre o sistema e empréstimos.`;
  } else {
    summaryText.innerText = 'Nenhuma notificação no momento.';
  }

  const fullList = document.getElementById('fullNotifList');
  fullList.innerHTML = '';
  libraryData.notifications.forEach(msg => {
    const li = document.createElement('li');
    li.innerText = msg;
    fullList.appendChild(li);
  });
}

// Ler Arquivo Selecionado
function previewSelectedFile(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      libraryData.selectedImageBase64 = e.target.result;
      
      const img = document.getElementById('modalPreviewImg');
      const icon = document.getElementById('modalPreviewIcon');
      
      img.src = e.target.result;
      img.style.display = 'block';
      icon.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

// Salvar Foto Selecionada
function saveProfilePhoto() {
  if (libraryData.selectedImageBase64) {
    // Atualizar Card Principal
    const mainImg = document.getElementById('mainAvatarImg');
    const mainIcon = document.getElementById('mainAvatarIcon');
    mainImg.src = libraryData.selectedImageBase64;
    mainImg.style.display = 'block';
    mainIcon.style.display = 'none';

    // Atualizar Sidebar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    sidebarAvatar.innerHTML = `<img src="${libraryData.selectedImageBase64}" alt="Perfil">`;

    closeModal('modalPhoto');
  } else {
    alert('Por favor, selecione um arquivo de imagem.');
  }
}

// Ação de Alterar Senha
function savePasswordChange() {
  const current = document.getElementById('inputCurrentPass').value;
  const newPass = document.getElementById('inputNewPass').value;
  const confirm = document.getElementById('inputConfirmPass').value;
  const errorMsg = document.getElementById('passErrorMsg');

  if (!current || !newPass || !confirm) {
    errorMsg.innerText = 'Preencha todos os campos.';
    return;
  }

  if (newPass !== confirm) {
    errorMsg.innerText = 'A nova senha e a confirmação não correspondem.';
    return;
  }

  alert('Senha alterada com sucesso!');
  closeModal('modalPassword');
}

// Ação de Alterar E-mail
function saveEmailPreference() {
  const newEmail = document.getElementById('inputNewEmail').value.trim();
  if (newEmail) {
    document.getElementById('inputCurrentEmail').value = newEmail;
    alert('E-mail de preferência atualizado!');
    closeModal('modalEmail');
  } else {
    alert('Por favor, digite um e-mail válido.');
  }
}