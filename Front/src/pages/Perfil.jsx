import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, PERFIS } from "../context/AuthContext";
import api from "../services/api";

const ROTAS = {
  foto: "/me/foto",
  senha: "/me/senha",
  emailAlertas: "/me/email-alertas",
};

const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const TAMANHO_MAX_FOTO = 2 * 1024 * 1024; // 2 MB

const ESTILO_ACADEMICO = {
  caixa: "modal-container",
  titulo: "h2",
  fechar: "btn-close-modal",
  cancelar: "btn-secondary",
  salvar: "btn-primary",
};

function dadosDoUsuario(usuario) {
  return {
    nome: usuario.nome ?? usuario.name ?? usuario.nome_completo ?? "Usuário",
    email: usuario.email ?? "",
    identificacao: usuario.identificacao || usuario.ra || usuario.matricula || "—",
    foto: usuario.foto_url ?? usuario.foto ?? null,
  };
}

function useAcoesPerfil(usuario) {
  const [modalAberto, setModalAberto] = useState(null);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(null);
  const [fotoSalva, setFotoSalva] = useState(null);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [novoEmail, setNovoEmail] = useState("");
  const [emailSalvo, setEmailSalvo] = useState(null);

  function abrir(nome) {
    setErro(null);
    setAviso(null);
    setModalAberto(nome);
  }

  function fechar() {
    if (previa) URL.revokeObjectURL(previa);
    setModalAberto(null);
    setErro(null);
    setArquivo(null);
    setPrevia(null);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setNovoEmail("");
  }

  async function enviar(requisicao, mensagemSucesso, aoSucesso) {
    setErro(null);
    setEnviando(true);
    try {
      const resposta = await requisicao();
      aoSucesso?.(resposta.data);
      fechar();
      setAviso(mensagemSucesso);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
          "Não foi possível concluir. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  function selecionarFoto(e) {
    const escolhido = e.target.files?.[0];
    if (!escolhido) return;

    if (previa) URL.revokeObjectURL(previa);
    setArquivo(null);
    setPrevia(null);

    if (!TIPOS_FOTO.includes(escolhido.type)) {
      setErro("Use uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (escolhido.size > TAMANHO_MAX_FOTO) {
      setErro("A imagem deve ter no máximo 2 MB.");
      return;
    }

    setErro(null);
    setArquivo(escolhido);
    setPrevia(URL.createObjectURL(escolhido));
  }

  function salvarFoto() {
    if (!arquivo) {
      setErro("Selecione uma imagem.");
      return;
    }
    const formulario = new FormData();
    formulario.append("foto", arquivo);

    enviar(
      () => api.post(ROTAS.foto, formulario),
      "Foto atualizada com sucesso.",
      (data) => setFotoSalva(data?.foto_url ?? URL.createObjectURL(arquivo))
    );
  }

  function salvarSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação não confere com a nova senha.");
      return;
    }
    if (novaSenha === senhaAtual) {
      setErro("A nova senha deve ser diferente da atual.");
      return;
    }

    enviar(
      () =>
        api.post(ROTAS.senha, {
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
          nova_senha_confirmation: confirmarSenha,
        }),
      "Senha atualizada com sucesso."
    );
  }

  function salvarEmail() {
    const email = novoEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    enviar(
      () => api.patch(ROTAS.emailAlertas, { email_alertas: email }),
      "E-mail de alertas atualizado.",
      () => setEmailSalvo(email)
    );
  }

  return {
    modalAberto,
    abrir,
    fechar,
    erro,
    aviso,
    enviando,
    previa,
    fotoAtual: fotoSalva ?? usuario.foto_url ?? usuario.foto ?? null,
    selecionarFoto,
    salvarFoto,
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    salvarSenha,
    emailAlertas: emailSalvo ?? usuario.email_alertas ?? usuario.email ?? "",
    novoEmail,
    setNovoEmail,
    salvarEmail,
  };
}

function Avatar({ foto }) {
  if (foto) {
    return (
      <img
        src={foto}
        alt="Foto de perfil"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    );
  }
  return <i className="fi fi-sr-user"></i>;
}

function Aviso({ texto }) {
  if (!texto) return null;
  return (
    <div
      role="status"
      style={{
        padding: "12px",
        marginBottom: "16px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "500",
        color: "var(--color-success)",
        backgroundColor: "var(--color-success-bg)",
      }}
    >
      {texto}
    </div>
  );
}

function MensagemErro({ texto }) {
  if (!texto) return null;
  return (
    <p
      className="error-text"
      role="alert"
      style={{ color: "var(--color-danger)", fontSize: "13px" }}
    >
      {texto}
    </p>
  );
}

/* Modais apenas para Foto, Senha e E-mail (Notificações removido) */
function Modais({ acoes, estilo }) {
  const { modalAberto, fechar, erro, enviando } = acoes;
  const Titulo = estilo.titulo;
  const overlay = (nome) => `modal-overlay ${modalAberto === nome ? "active" : ""}`;
  const naoFechar = (e) => e.stopPropagation();

  return (
    <>
      <div className={overlay("foto")} onClick={fechar}>
        <div className={estilo.caixa} onClick={naoFechar}>
          <div className="modal-header">
            <Titulo>Editar Foto do Perfil</Titulo>
            <button type="button" className={estilo.fechar} onClick={fechar}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p className="read-only-notice">
              Nome e departamento são gerenciados apenas pelos administradores do sistema.
            </p>
            <div className="form-group">
              <label htmlFor="fotoInput">Selecione uma foto (JPG, PNG ou WEBP, até 2 MB):</label>
              <input
                type="file"
                id="fotoInput"
                accept="image/jpeg,image/png,image/webp"
                onChange={acoes.selecionarFoto}
              />
            </div>
            <div className="file-preview-area">
              <span>Pré-visualização:</span>
              <div className="preview-avatar-circle">
                <Avatar foto={acoes.previa} />
              </div>
            </div>
            <MensagemErro texto={modalAberto === "foto" ? erro : null} />
          </div>
          <div className="modal-footer">
            <button type="button" className={estilo.cancelar} onClick={fechar}>
              Cancelar
            </button>
            <button
              type="button"
              className={estilo.salvar}
              onClick={acoes.salvarFoto}
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar Foto"}
            </button>
          </div>
        </div>
      </div>

      <div className={overlay("senha")} onClick={fechar}>
        <div className={estilo.caixa} onClick={naoFechar}>
          <div className="modal-header">
            <Titulo>Mudar a Senha</Titulo>
            <button type="button" className={estilo.fechar} onClick={fechar}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="senhaAtual">Senha atual:</label>
              <input
                type="password"
                id="senhaAtual"
                placeholder="Digite sua senha atual"
                value={acoes.senhaAtual}
                onChange={(e) => acoes.setSenhaAtual(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="novaSenha">Nova senha:</label>
              <input
                type="password"
                id="novaSenha"
                placeholder="Digite a nova senha"
                value={acoes.novaSenha}
                onChange={(e) => acoes.setNovaSenha(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar nova senha:</label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Confirme a nova senha"
                value={acoes.confirmarSenha}
                onChange={(e) => acoes.setConfirmarSenha(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <MensagemErro texto={modalAberto === "senha" ? erro : null} />
          </div>
          <div className="modal-footer">
            <button type="button" className={estilo.cancelar} onClick={fechar}>
              Cancelar
            </button>
            <button
              type="button"
              className={estilo.salvar}
              onClick={acoes.salvarSenha}
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Atualizar Senha"}
            </button>
          </div>
        </div>
      </div>

      <div className={overlay("email")} onClick={fechar}>
        <div className={estilo.caixa} onClick={naoFechar}>
          <div className="modal-header">
            <Titulo>Preferências de E-mail</Titulo>
            <button type="button" className={estilo.fechar} onClick={fechar}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="emailAtual">E-mail atual de alertas:</label>
              <input
                type="email"
                id="emailAtual"
                value={acoes.emailAlertas}
                className="input-disabled"
                readOnly
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="novoEmail">Novo e-mail de preferência:</label>
              <input
                type="email"
                id="novoEmail"
                placeholder="Digite seu novo e-mail para receber os alertas"
                value={acoes.novoEmail}
                onChange={(e) => acoes.setNovoEmail(e.target.value)}
              />
            </div>
            <MensagemErro texto={modalAberto === "email" ? erro : null} />
          </div>
          <div className="modal-footer">
            <button type="button" className={estilo.cancelar} onClick={fechar}>
              Cancelar
            </button>
            <button
              type="button"
              className={estilo.salvar}
              onClick={acoes.salvarEmail}
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar Preferência"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Perfil() {
  const { usuario } = useAuth();
  const dados = dadosDoUsuario(usuario);
  const acoes = useAcoesPerfil(usuario);

  if (!usuario) return null;

  const isBibliotecario = usuario.perfil === PERFIS.BIBLIOTECARIO;
  const ehProfessor = usuario.perfil === PERFIS.PROFESSOR;

  // Rótulos dinâmicos com base no cargo
  const rotuloDocumento = isBibliotecario
    ? "ID Funcionário"
    : ehProfessor
    ? "ID do Professor"
    : "RA do Aluno";

  const descricao =
    usuario.curso ??
    usuario.departamento ??
    (isBibliotecario ? "Departamento da Biblioteca" : ehProfessor ? "Professor" : "Aluno");

  // Dados vindos do back-end (com fallbacks seguros)
  const qtdEmprestados = usuario.emprestimos_ativos_count ?? usuario.livros_emprestados ?? 0;
  const limiteEmprestimos = usuario.limite_emprestimos ?? 10;
  
  // Alertas dinâmicos baseados no back-end
  const qtdAlertas = usuario.notificacoes_nao_lidas ?? 0;

  // Formatação de último acesso vindo do back-end
  const ultimoAcesso = usuario.ultimo_acesso 
    ? `Hoje, às ${new Date(usuario.ultimo_acesso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
    : "Agora mesmo";

  // Rota de redirecionamento do link de notificações baseada no tipo de perfil
  const rotaNotificacoes = isBibliotecario ? "/inventario" : "/historico";

  return (
    <div>
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">Visão Geral do Perfil</h1>
          <p className="page-subtitle">
            Gerencie sua conta e suas configurações da biblioteca.
          </p>
        </header>

        <Aviso texto={acoes.aviso} />

        <div className="profile-grid">
          {/* Card do Perfil */}
          <section className="card profile-card">
            <div className="avatar-large" style={{ width: "100px", height: "100px", margin: "0 auto" }}>
              <Avatar foto={acoes.fotoAtual} />
            </div>
            <h2 className="user-name">{dados.nome}</h2>
            <p className="user-dept">{descricao}</p>

            <div className="ra-badge">
              <span>{rotuloDocumento}</span>
              <strong>{dados.identificacao}</strong>
            </div>

            <button
              type="button"
              className="btn-secondary btn-full"
              onClick={() => acoes.abrir("foto")}
            >
              Editar Perfil
            </button>
          </section>

          {/* Card Configurações de Conta */}
          <section className="card config-card">
            <div className="card-header">
              <h2 className="card-title">Configurações de Conta</h2>
              <i className="fi fi-rr-settings"></i>
            </div>

            <div className="config-list">
              <div className="config-item" onClick={() => acoes.abrir("email")}>
                <div>
                  <h3>Preferências de email</h3>
                  <p>Gerenciar o email de preferência e os alertas</p>
                </div>
                <i className="fi fi-rr-angle-right"></i>
              </div>

              <div className="config-item" onClick={() => acoes.abrir("senha")}>
                <div>
                  <h3>Mudar a senha</h3>
                  <p>Atualize suas credenciais de segurança</p>
                </div>
                <i className="fi fi-rr-angle-right"></i>
              </div>
            </div>
          </section>

          {/* Status da Biblioteca: Exibido APENAS para o Bibliotecário */}
          {isBibliotecario && (
            <section className="card status-card">
              <h2 className="card-title">Status da biblioteca</h2>
              <div className="status-list">
                <div className="status-item">
                  <div className="icon-circle icon-green">
                    <i className="fi fi-rr-check"></i>
                  </div>
                  <div>
                    <span className="status-label">Situação da biblioteca</span>
                    <strong className="status-value text-green">Situação Regular</strong>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Quantidade de livros emprestados: Exibido APENAS para Alunos e Professores */}
          {!isBibliotecario && (
            <section className="card status-card">
              <h2 className="card-title">Status da biblioteca</h2>
              <div className="status-list">
                <div className="status-item">
                  <div className="icon-circle icon-green">
                    <i className="fi fi-rr-check"></i>
                  </div>
                  <div>
                    <span className="status-label">Situação da conta</span>
                    <strong className="status-value text-green">Situação Regular</strong>
                  </div>
                </div>

                <div className="status-item">
                  <div className="icon-circle icon-blue">
                    <i className="fi fi-rr-bookmark"></i>
                  </div>
                  <div>
                    <span className="status-label">Empréstimos</span>
                    <strong className="status-value">
                      {qtdEmprestados} / {limiteEmprestimos} Livros
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Notificações Dinâmicas (Link direto para /inventario ou /historico) */}
          <section className="card info-card">
            <div className="card-header-simple">
              <i className="fi fi-rr-bell"></i>
              <h2 className="card-title">Notificações</h2>
            </div>
            <p className="info-text">
              {qtdAlertas > 0
                ? `Você tem ${qtdAlertas} novo${qtdAlertas > 1 ? "s" : ""} alerta${qtdAlertas > 1 ? "s" : ""} sobre seus empréstimos.`
                : "Você não possui novos alertas no momento."}
            </p>
            <Link to={rotaNotificacoes} className="card-link">
              Ver todas as notificações
            </Link>
          </section>

          {/* Segurança Dinâmica (Último acesso por login real) */}
          <section className="card info-card">
            <div className="card-header-simple">
              <i className="fi fi-rr-shield-check"></i>
              <h2 className="card-title">Segurança</h2>
            </div>
            <p className="info-text">
              Último acesso: {ultimoAcesso}, a partir da rede do campus.
            </p>
            <Link to="#" className="card-link link-danger">
              Rever Atividade
            </Link>
          </section>
        </div>
      </main>

      <Modais acoes={acoes} estilo={ESTILO_ACADEMICO} />
    </div>
  );
}