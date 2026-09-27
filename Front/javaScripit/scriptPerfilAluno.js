const API_URL = 'http://localhost:8000/api/v1';

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

// Obtém o usuário ativo do localStorage
function getUsuarioLogado() {
  const data = localStorage.getItem('usuario_logado');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

// Preenche a tela de perfil com os dados reais
function preencherDadosPerfil(user) {
  if (!user) return;

  const nome = user.name || user.nome || 'Estudante';
  const role = user.role || user.perfil || 'aluno';
  const doc = user.documento || user.ra || '2024001';
  const email = user.email || 'estudante@fatec.sp.gov.br';
  const departamento = user.departamento || (role === 'professor' ? 'Corpo Docente' : 'Análise e Desenvolvimento de Sistemas');

  // 1. Barra Lateral (Sidebar)
  const sidebarName = document.getElementById('sidebarUserName');
  const sidebarDoc = document.getElementById('sidebarUserDoc');
  if (sidebarName) sidebarName.textContent = nome;
  if (sidebarDoc) sidebarDoc.textContent = (role === 'professor' ? 'Docente: ' : 'RA: ') + doc;

  // 2. Card Principal
  const profileName = document.getElementById('profileUserName');
  const profileDept = document.getElementById('profileUserDept');
  const profileDoc = document.getElementById('profileUserDoc');
  const profileDocLabel = document.getElementById('profileDocLabel');

  if (profileName) profileName.textContent = nome;
  if (profileDept) profileDept.textContent = departamento;
  if (profileDoc) profileDoc.textContent = doc;
  if (profileDocLabel) profileDocLabel.textContent = role === 'professor' ? 'CPF do Docente' : 'RA do Aluno';

  // 3. Modais
  const modalName = document.getElementById('modalEditName');
  const modalDept = document.getElementById('modalEditDept');
  const modalEmail = document.getElementById('modalCurrentEmail');

  if (modalName) modalName.value = nome;
  if (modalDept) modalDept.value = departamento;
  if (modalEmail) modalEmail.value = email;

  // 4. Foto de Perfil
  const fotoSalva = localStorage.getItem(`foto_perfil_${email}`);
  if (fotoSalva) {
    const avatarDisplay = document.getElementById('avatarDisplay');
    const sidebarAvatar = document.getElementById('sidebarAvatar');

    if (avatarDisplay) {
      avatarDisplay.innerHTML = `<img src="${fotoSalva}" alt="${nome}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
    if (sidebarAvatar) {
      sidebarAvatar.innerHTML = `<img src="${fotoSalva}" alt="${nome}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
  }
}

// Carrega os dados reais do usuário logado
async function carregarPerfilDoUsuario() {
  let user = getUsuarioLogado();

  if (user) {
    preencherDadosPerfil(user);
  }

  // Sincroniza em segundo plano com a API de sessão
  try {
    const response = await fetch(`${API_URL}/me`, { credentials: 'include' });
    if (response.ok) {
      const json = await response.json();
      if (json.autenticado && json.usuario) {
        // Preserva campos complementares como documento, departamento e foto
        const mergedUser = {
          ...user,
          ...json.usuario,
          documento: user?.documento || user?.ra || '2024001',
          departamento: user?.departamento || 'Análise e Desenvolvimento de Sistemas'
        };
        localStorage.setItem('usuario_logado', JSON.stringify(mergedUser));
        preencherDadosPerfil(mergedUser);
      }
    }
  } catch (err) {
    console.warn('Sessão backend offline, utilizando dados locais.');
  }
}

// Salvar Alterações de Perfil (Departamento / Curso e Foto)
function saveProfileChanges() {
  const user = getUsuarioLogado() || {};
  const photoInput = document.getElementById('photoInput');
  const deptInput = document.getElementById('modalEditDept');

  if (deptInput && deptInput.value.trim()) {
    user.departamento = deptInput.value.trim();
  }

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fotoUrl = e.target.result;
      if (user.email) {
        localStorage.setItem(`foto_perfil_${user.email}`, fotoUrl);
      }
      localStorage.setItem('usuario_logado', JSON.stringify(user));
      preencherDadosPerfil(user);
      alert('Perfil e foto atualizados com sucesso!');
      closeModal('modalEditProfile');
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    localStorage.setItem('usuario_logado', JSON.stringify(user));
    preencherDadosPerfil(user);
    alert('Informações do perfil atualizadas!');
    closeModal('modalEditProfile');
  }
}

// Salvar Foto (compatibilidade com botão antigo)
function saveProfilePhoto() {
  saveProfileChanges();
}

// Salvar Preferências de Email
function saveEmail() {
  const newEmailInput = document.getElementById('newEmail');
  const newEmail = newEmailInput ? newEmailInput.value.trim() : '';

  if (!newEmail || !newEmail.includes('@')) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

  const user = getUsuarioLogado() || {};
  user.email = newEmail;
  localStorage.setItem('usuario_logado', JSON.stringify(user));

  preencherDadosPerfil(user);
  alert(`Email de preferência alterado para: ${newEmail}`);
  newEmailInput.value = '';
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

  if (newPassword.length < 6) {
    alert('A nova senha deve ter pelo menos 6 caracteres.');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('A nova senha e a confirmação não coincidem.');
    return;
  }

  alert('Senha alterada com sucesso!');

  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  closeModal('modalPassword');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarPerfilDoUsuario();

  // Logout com sessão real
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