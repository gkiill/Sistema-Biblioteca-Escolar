import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  return (
    <div>
      {/*Perfil do Usuário Aluno/Professor*/}
      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">Visão Geral do Perfil</h1>
          <p className="page-subtitle">
            Gerencie sua conta e suas configurações da biblioteca.
          </p>
        </header>

        <div className="profile-grid">
          {/* Card do Perfil */}
          <section className="card profile-card">
            <div className="avatar-large" id="avatarDisplay">
              <i className="fi fi-sr-user"></i>
            </div>
            <h2 className="user-name" id="profileUserName">
              Estudante
            </h2>
            <p className="user-dept" id="profileUserDept">
              Análise e Desenvolvimento de Sistemas
            </p>

            <div className="ra-badge">
              <span id="profileDocLabel">RA do Aluno</span>
              <strong id="profileUserDoc">2024001</strong>
            </div>

            <button
              className="btn-secondary btn-full"
              onClick="openModal('modalEditProfile')"
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
              <div className="config-item" onClick="openModal('modalEmail')">
                <div>
                  <h3>Preferências de email</h3>
                  <p>Gerenciar o email de preferência e os alertas</p>
                </div>
                <i className="fi fi-rr-angle-right"></i>
              </div>

              <div className="config-item" onClick="openModal('modalPassword')">
                <div>
                  <h3>Mudar a senhas</h3>
                  <p>Atualize suas credenciais de segurança</p>
                </div>
                <i className="fi fi-rr-angle-right"></i>
              </div>
            </div>
          </section>

          {/* Card Status da Biblioteca */}
          <section className="card status-card">
            <h2 className="card-title">Status da biblioteca</h2>

            <div className="status-list">
              <div className="status-item">
                <div className="icon-circle icon-green">
                  <i className="fi fi-rr-check"></i>
                </div>
                <div>
                  <span className="status-label">Situação da conta</span>
                  <strong className="status-value text-green">
                    Situação Regular
                  </strong>
                </div>
              </div>

              <div className="status-item">
                <div className="icon-circle icon-blue">
                  <i className="fi fi-rr-bookmark"></i>
                </div>
                <div>
                  <span className="status-label">Empréstimos</span>
                  <strong className="status-value">3 / 10 Books</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Card Notificações */}
          <section className="card info-card">
            <div className="card-header-simple">
              <i className="fi fi-rr-bell"></i>
              <h2 className="card-title">Notificações</h2>
            </div>
            <p className="info-text">
              Você tem 2 novos alertas sobre seus empréstimos.
            </p>
            <Link to="#" className="card-link">
              Ver todas as notificações
            </Link>
          </section>

          {/* Card Segurança */}
          <section className="card info-card">
            <div className="card-header-simple">
              <i className="fi fi-rr-shield-check"></i>
              <h2 className="card-title">Segurança</h2>
            </div>
            <p className="info-text">
              Último acesso: Hoje, às 10h45, a partir da rede do campus.
            </p>
            <Link to="#" className="card-link link-danger">
              Rever Atividade
            </Link>
          </section>
        </div>
      </main>

      {/* MODAL: Editar Perfil (Apenas Foto) */}
      <div className="modal-overlay" id="modalEditProfile">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Editar Perfil</h2>
            <button
              className="btn-close-modal"
              onClick="closeModal('modalEditProfile')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                id="modalEditName"
                disabled
                className="input-disabled"
              />
            </div>
            <div className="form-group">
              <label>Curso / Departamento</label>
              <input
                type="text"
                id="modalEditDept"
                placeholder="ex. Análise e Desenvolvimento de Sistemas"
              />
            </div>
            <div className="form-group">
              <label>Foto de Perfil</label>
              <input type="file" id="photoInput" accept="image/*" />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick="closeModal('modalEditProfile')"
            >
              Cancelar
            </button>
            <button className="btn-primary" onClick="saveProfileChanges()">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Preferências de Email */}
      <div className="modal-overlay" id="modalEmail">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Preferências de Email</h2>
            <button
              className="btn-close-modal"
              onClick="closeModal('modalEmail')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Email Atual</label>
              <input
                type="email"
                id="modalCurrentEmail"
                disabled
                className="input-disabled"
              />
            </div>
            <div className="form-group">
              <label>Novo Email de Preferência</label>
              <input
                type="email"
                id="newEmail"
                placeholder="Digite seu novo email para alertas"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick="closeModal('modalEmail')"
            >
              Cancelar
            </button>
            <button className="btn-primary" onClick="saveEmail()">
              Salvar Alteração
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Mudar a Senha */}
      <div className="modal-overlay" id="modalPassword">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Mudar a Senha</h2>
            <button
              className="btn-close-modal"
              onClick="closeModal('modalPassword')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                placeholder="Sua senha atual"
              />
            </div>
            <div className="form-group">
              <label>Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Sua nova senha"
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick="closeModal('modalPassword')"
            >
              Cancelar
            </button>
            <button className="btn-primary" onClick="savePassword()">
              Atualizar Senha
            </button>
          </div>
        </div>
      </div>



      {/*Perfil do Usuário Bibliotecário*/}
      {/* Área de Conteúdo Principal */}
      <div className="main-wrapper">
        <main className="main-content">
          <header className="page-title-area">
            <h1>Visão Geral do Perfil</h1>
            <p>Gerencie sua conta e suas configurações da biblioteca.</p>
          </header>

          {/* Grid Principal */}
          <section className="profile-grid-top">
            {/* Card 1: Informações do Usuário */}
            <div className="card-user-info">
              <div className="avatar-large-container" id="mainAvatarContainer">
                <i className="fi fi-sr-user" id="mainAvatarIcon"></i>
                <img
                  id="mainAvatarImg"
                  className="avatar-img-hidden"
                  src=""
                  alt="Foto de perfil"
                />
              </div>

              <h2 className="user-name">José Oliveira</h2>
              <p className="user-dept">Departamento da Biblioteca</p>

              <div className="id-badge-box">
                <span>ID Funcionário:</span>
                <strong>2140008</strong>
              </div>

              <button
                className="btn-edit-profile"
                onClick="openModal('modalPhoto')"
              >
                Editar Perfil
              </button>
            </div>

            {/* Card 2: Configurações de Conta */}
            <div className="card-account-settings">
              <div className="card-settings-header">
                <h3>Configurações de Conta</h3>
                <i className="fi fi-rr-settings"></i>
              </div>

              <div className="settings-list">
                <div className="setting-item" onClick="openModal('modalEmail')">
                  <div className="setting-text">
                    <strong>Preferências de email</strong>
                    <p>Gerenciar o email de preferência</p>
                  </div>
                  <i className="fi fi-rr-angle-right arrow-icon"></i>
                </div>

                <div
                  className="setting-item"
                  onClick="openModal('modalPassword')"
                >
                  <div className="setting-text">
                    <strong>Mudar a senhas</strong>
                    <p>Atualize suas credenciais de segurança</p>
                  </div>
                  <i className="fi fi-rr-angle-right arrow-icon"></i>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Inferior: Status, Notificações e Segurança */}
          <section className="profile-grid-bottom">
            {/* Status da Biblioteca */}
            <div className="card-status regular" id="statusCard">
              <h3>Status da biblioteca</h3>
              <div className="status-content">
                <div className="status-icon-circle" id="statusIconBox">
                  <i className="fi fi-rr-check" id="statusIcon"></i>
                </div>
                <div className="status-details">
                  <span>Situação da biblioteca</span>
                  <strong id="statusText">Situação Regular</strong>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="card-notifications">
              <div className="notif-header">
                <i className="fi fi-rr-bell"></i>
                <h3>Notificações</h3>
              </div>
              <p id="notifSummaryText">
                Você tem 2 novos alertas sobre seus empréstimos.
              </p>
              <Link
                to="#"
                className="link-action"
                onClick="openModal('modalAllNotifs'); return false;"
              >
                Ver todas as notificações
              </Link>
            </div>

            {/* Segurança */}
            <div className="card-security">
              <div className="security-header">
                <i className="fi fi-rr-shield-check"></i>
                <h3>Segurança</h3>
              </div>
              <p>Último acesso: Hoje, às 10h45, a partir da rede do campus.</p>
              <Link to="#" className="link-action-danger">
                Rever Atividade
              </Link>
            </div>
          </section>
        </main>
      </div>

      {/* MODAL 1: EDITAR FOTO DO PERFIL */}
      <div className="modal-overlay" id="modalPhoto">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Editar Foto do Perfil</h3>
            <button className="btn-close" onClick="closeModal('modalPhoto')">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p className="read-only-notice">
              Nome e Departamento são gerenciados apenas pelos Administradores
              do sistema.
            </p>

            <div className="form-group">
              <label htmlFor="fileUploadInput">
                Selecione uma foto (Arquivo de Imagem):
              </label>
              <input
                type="file"
                id="fileUploadInput"
                accept="image/*"
                onChange="previewSelectedFile(this)"
              />
            </div>

            <div className="file-preview-area">
              <span>Pré-visualização:</span>
              <div className="preview-avatar-circle" id="modalPreviewContainer">
                <i className="fi fi-sr-user" id="modalPreviewIcon"></i>
                <img
                  id="modalPreviewImg"
                  className="avatar-img-hidden"
                  src=""
                  alt="Prévia"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick="closeModal('modalPhoto')">
              Cancelar
            </button>
            <button className="btn-save" onClick="saveProfilePhoto()">
              Salvar Foto
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 2: MUDAR A SENHA */}
      <div className="modal-overlay" id="modalPassword">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Mudar a Senha</h3>
            <button className="btn-close" onClick="closeModal('modalPassword')">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Senha atual:</label>
              <input
                type="password"
                id="inputCurrentPass"
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="form-group">
              <label>Nova senha:</label>
              <input
                type="password"
                id="inputCurrentPass"
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="form-group">
              <label>Nova senha:</label>
              <input
                type="password"
                id="inputNewPass"
                placeholder="Digite a nova senha"
              />
            </div>
            <div className="form-group">
              <label>Confirmar nova senha:</label>
              <input
                type="password"
                id="inputConfirmPass"
                placeholder="Confirme a nova senha"
              />
            </div>
            <p className="error-text" id="passErrorMsg"></p>
          </div>
          <div className="modal-footer">
            <button
              className="btn-cancel"
              onClick="closeModal('modalPassword')"
            >
              Cancelar
            </button>
            <button className="btn-save" onClick="savePasswordChange()">
              Atualizar Senha
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 3: PREFERÊNCIA DE EMAIL */}
      <div className="modal-overlay" id="modalEmail">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Preferências de E-mail</h3>
            <button className="btn-close" onClick="closeModal('modalEmail')">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>E-mail atual de alertas:</label>
              <input
                type="email"
                id="inputCurrentEmail"
                value="jose.oliveira@biblioteca.edu.br"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Novo e-mail de preferência:</label>
              <input
                type="email"
                id="inputNewEmail"
                placeholder="Digite seu novo e-mail para receber os alertas"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick="closeModal('modalEmail')">
              Cancelar
            </button>
            <button className="btn-save" onClick="saveEmailPreference()">
              Salvar Preferência
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 4: TODAS AS NOTIFICAÇÕES */}
      <div className="modal-overlay" id="modalAllNotifs">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Central de Notificações</h3>
            <button
              className="btn-close"
              onClick="closeModal('modalAllNotifs')"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <ul className="notif-full-list" id="fullNotifList">
              {/* Gerado via JS */}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="btn-cancel"
              onClick="closeModal('modalAllNotifs')"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
