const API_URL = 'http://localhost:8000/api/v1';

// Envio do Login com Cookies/Sessão reais
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = this.querySelector('.btn-submit');
  const feedback = document.getElementById('loginFeedback');

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (feedback) {
    feedback.style.display = 'none';
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Autenticando...';

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Envia e armazena os cookies de sessão do Laravel
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Credenciais inválidas.');
    }

    // Salva os dados do usuário autenticado no navegador preservando RA e dados locais
    const existingRaw = localStorage.getItem('usuario_logado');
    let existing = {};
    try { existing = existingRaw ? JSON.parse(existingRaw) : {}; } catch(e){}

    const usuarioMerged = {
      ...existing,
      ...data.usuario,
      documento: data.usuario?.documento || existing.documento || existing.ra || '2024001',
      departamento: data.usuario?.departamento || existing.departamento || (data.usuario?.role === 'professor' ? 'Corpo Docente' : 'Análise e Desenvolvimento de Sistemas')
    };

    localStorage.setItem('usuario_logado', JSON.stringify(usuarioMerged));

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.backgroundColor = '#dcfce7';
      feedback.style.color = '#166534';
      feedback.textContent = 'Login realizado com sucesso! Redirecionando...';
    }

    // Redireciona para o painel de administrador se for admin
    setTimeout(() => {
      if (data.usuario?.role === 'admin' || email.includes('admin')) {
        window.location.href = 'homeADMIN.html';
      } else {
        window.location.href = 'home.html';
      }
    }, 600);

  } catch (error) {
    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.backgroundColor = '#fee2e2';
      feedback.style.color = '#991b1b';
      feedback.textContent = error.message;
    } else {
      alert(error.message);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
});
