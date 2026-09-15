// Abrir Modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

// Fechar Modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Salvar Foto de Perfil (Modal Editar Perfil)
function saveProfilePhoto() {
  const photoInput = document.getElementById('photoInput');
  const avatarDisplay = document.getElementById('avatarDisplay');

  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      avatarDisplay.innerHTML = `<img src="${e.target.result}" alt="Foto de Perfil">`;
    };

    reader.readAsDataURL(photoInput.files[0]);
    alert('Foto de perfil atualizada com sucesso!');
    closeModal('modalEditProfile');
  } else {
    alert('Por favor, selecione uma foto.');
  }
}

// Salvar Preferências de Email
function saveEmail() {
  const newEmail = document.getElementById('newEmail').value;

  if (newEmail.trim() === '') {
    alert('Por favor, insira um email válido.');
    return;
  }

  alert(`Email de preferência alterado para: ${newEmail}`);
  closeModal('modalEmail');
}

// Salvar Nova Senha
function savePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Por favor, preencha todos os campos de senha.');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('A nova senha e a confirmação não coincidem.');
    return;
  }

  alert('Senha alterada com sucesso!');
  
  // Limpa os campos e fecha o modal
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  closeModal('modalPassword');
}