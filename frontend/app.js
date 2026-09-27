const cadastroCard = document.getElementById('cadastroCard');
const loginCard = document.getElementById('loginCard');
const homeCard = document.getElementById('homeCard');
const cadastroForm = document.getElementById('cadastroForm');
const loginForm = document.getElementById('loginForm');
const mensagemForm = document.getElementById('mensagemForm');
const cadastroMensagem = document.getElementById('cadastroMensagem');
const loginMensagem = document.getElementById('loginMensagem');
const dadosUsuario = document.getElementById('dadosUsuario');
const notificacoes = document.getElementById('notificacoes');
const toast = document.getElementById('toast');

function mostrarCard(card) {
  [cadastroCard, loginCard, homeCard].forEach((item) => item.classList.add('hidden'));
  card.classList.remove('hidden');
}

function exibirToast(texto) {
  toast.textContent = texto;
  toast.classList.remove('hidden');
  window.setTimeout(() => toast.classList.add('hidden'), 4500);
}

async function jsonRequest(url, options = {}) {
  const resposta = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.mensagem || 'Erro na requisição.');
  return dados;
}

function tokenHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

document.getElementById('irLogin').onclick = () => mostrarCard(loginCard);
document.getElementById('irCadastro').onclick = () => mostrarCard(cadastroCard);

document.getElementById('logout').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  mostrarCard(loginCard);
};

cadastroForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  cadastroMensagem.textContent = 'Cadastrando...';

  try {
    const dados = await jsonRequest('/api/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({
        nome: document.getElementById('cadNome').value,
        senha: document.getElementById('cadSenha').value,
        email: document.getElementById('cadEmail').value,
        celular: document.getElementById('cadCelular').value
      })
    });

    cadastroMensagem.textContent = dados.mensagem;
    cadastroForm.reset();
    setTimeout(() => mostrarCard(loginCard), 800);
  } catch (erro) {
    cadastroMensagem.textContent = erro.message;
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMensagem.textContent = 'Entrando...';

  try {
    const login = await jsonRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        nome: document.getElementById('loginNome').value,
        senha: document.getElementById('loginSenha').value
      })
    });

    localStorage.setItem('token', login.token);
    localStorage.setItem('usuario', JSON.stringify(login.usuario));
    await carregarTelaInicial();
  } catch (erro) {
    loginMensagem.textContent = erro.message;
  }
});

mensagemForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const canais = [...document.querySelectorAll('.canais input:checked')].map((item) => item.value);

  if (canais.length === 0) {
    exibirToast('Selecione pelo menos um canal.');
    return;
  }

  try {
    const dados = await jsonRequest('/api/auth/notificar', {
      method: 'POST',
      headers: tokenHeaders(),
      body: JSON.stringify({
        canais,
        assunto: document.getElementById('mensagemAssunto').value,
        texto: document.getElementById('mensagemTexto').value
      })
    });

    renderizarNotificacoes(dados.notificacoes);
    exibirToast('Mensagem processada pelos canais selecionados.');
    dispararNotificacaoNativa(document.getElementById('mensagemTexto').value);
  } catch (erro) {
    exibirToast(erro.message);
  }
});

async function carregarTelaInicial() {
  const token = localStorage.getItem('token');
  if (!token) {
    mostrarCard(loginCard);
    return;
  }

  try {
    const dados = await jsonRequest('/api/auth/entrada', {
      method: 'GET',
      headers: tokenHeaders()
    });

    renderizarHome(dados);
    exibirToast('Olá! Suas notificações de entrada foram processadas.');
    await solicitarPermissaoNotificacao();
    dispararNotificacaoNativa(dados.mensagem);
  } catch (erro) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    loginMensagem.textContent = erro.message;
    mostrarCard(loginCard);
  }
}

function renderizarHome(dados) {
  mostrarCard(homeCard);
  document.getElementById('boasVindas').textContent = dados.mensagem;
  dadosUsuario.innerHTML = `
    <div class="item"><strong>ID:</strong> ${escapeHtml(dados.usuario.id)}</div>
    <div class="item"><strong>Nome:</strong> ${escapeHtml(dados.usuario.nome)}</div>
    <div class="item"><strong>E-mail:</strong> ${escapeHtml(dados.usuario.email)}</div>
    <div class="item"><strong>Celular:</strong> ${escapeHtml(dados.usuario.celular)}</div>
  `;
  renderizarNotificacoes(dados.notificacoes);
}

function renderizarNotificacoes(lista) {
  notificacoes.innerHTML = '';

  lista.forEach((item) => {
    const linha = document.createElement('div');
    linha.className = item.sucesso ? 'item sucesso' : 'item erro';
    const detalhe = item.observacao ? ` — ${item.observacao}` : '';
    linha.textContent = `${item.sucesso ? '✓' : '✗'} ${item.canal}: ${item.sucesso ? 'processado com sucesso' : item.erro}${detalhe}`;
    notificacoes.appendChild(linha);
  });
}

async function solicitarPermissaoNotificacao() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

function dispararNotificacaoNativa(texto) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Mensageria', { body: texto });
  }
}

function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

carregarTelaInicial();
