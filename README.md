
## O que e o padrao Factory?

Factory (fabrica) e um nome usado para padroes e tecnicas que encapsulam a criacao de objetos. Em vez de o codigo principal instanciar diretamente cada classe concreta, ele pede o objeto a uma fabrica e trabalha com um contrato comum. Assim, quem usa o objeto nao precisa conhecer todos os detalhes de como ele foi criado.

Neste projeto, o padrao utilizado e o **Factory Method**. Uma classe base declara o metodo de criacao, e cada fabrica concreta implementa esse metodo para devolver um produto especifico. O codigo cliente usa a fabrica e a interface do produto, sem instanciar diretamente a classe concreta.

### Como funciona

O fluxo geral e:

1. O codigo identifica o tipo de produto necessario, por exemplo, uma notificacao por e-mail.
2. Uma fabrica concreta implementa o metodo de criacao e instancia o produto correspondente.
3. O codigo cliente recebe o produto pelo contrato comum e chama sua operacao, sem depender da classe concreta.

No sistema deste laboratorio, o `factoryRegistry.js` encontra a fabrica correspondente ao canal solicitado. Em seguida, `criarNotificacao()` instancia o produto, e o servico envia a mensagem pelo metodo `enviar()`:

```text
Canal (EMAIL)
  |
  v
FactoryRegistry -> EmailFactory -> EmailNotificacao -> enviar()
```

O registro e responsavel por selecionar a fabrica; o Factory Method e responsavel por criar o produto. Sao responsabilidades relacionadas, mas diferentes.

### Vantagens

- **Menor acoplamento:** o servico depende do contrato `Notificacao`, nao de cada classe concreta.
- **Responsabilidades separadas:** a criacao fica nas fabricas, enquanto o servico coordena o envio.
- **Facilidade para testar e substituir:** produtos podem ser trocados ou simulados sem reescrever o fluxo principal.
- **Extensibilidade:** novos tipos de produto podem ser adicionados com suas implementacoes e fabricas, mantendo o fluxo cliente baseado na abstracao.

### Desvantagens

- **Mais estrutura:** cada tipo pode exigir uma classe de produto e uma classe de fabrica, aumentando a quantidade de arquivos e conceitos.
- **Alteracoes coordenadas:** adicionar um tipo pode exigir atualizar o registro de fabricas, alem de criar o produto e a fabrica.
- **Pode ser excesso:** para poucos objetos simples e estaveis, instanciar diretamente pode ser mais claro e simples.

### Quando usar

Use uma fabrica quando a escolha do tipo concreto variar conforme canal, configuracao ou contexto; quando a construcao do objeto tiver detalhes que nao devem ficar espalhados pelo codigo cliente; ou quando quiser que o cliente dependa de uma interface comum em vez de classes concretas.

Evite adicionar essa camada quando ha somente um tipo simples, sem variacao prevista, e a fabrica nao reduz acoplamento nem simplifica testes. O padrao deve resolver uma necessidade real de criacao e variacao de objetos, nao apenas adicionar classes.

# Sistema de Mensageria Multicanal

Aplicacao em JavaScript/Node.js desenvolvida para o Laboratorio 02 de **Padrao de Projeto Factory Method**. O sistema permite cadastrar usuarios, autenticar sessoes e enviar notificacoes por diferentes canais, mantendo a criacao dos produtos de notificacao separada do servico principal.

## O que a aplicacao faz

- Cadastra usuarios com nome, senha, e-mail e celular.
- Armazena os dados no MySQL.
- Protege senhas com `bcryptjs`.
- Autentica usuarios com JWT.
- Busca novamente os dados do usuario a partir do ID presente no token.
- Envia uma mensagem de boas-vindas ao entrar na plataforma.
- Permite selecionar canais e enviar uma nova mensagem.
- Envia e-mail usando SMTP do Gmail e Nodemailer.
- Envia SMS usando a API da Infobip.
- Envia WhatsApp usando Baileys e uma sessao do WhatsApp Web.
- Exibe notificacoes Push usando a Web Notification API do navegador.
- Mantem Telegram como produto preparado para a extensao do laboratorio, sem integracao externa obrigatoria.

## Requisitos

- Node.js com suporte a `fetch` nativo e modulos ES carregados dinamicamente.
- npm.
- MySQL, por exemplo o MySQL incluido no XAMPP.
- Uma conta Gmail com senha de aplicativo para SMTP.
- Uma conta Infobip com API Key, Base URL e remetente SMS habilitado.
- Um numero de WhatsApp para parear com o Baileys.

## Estrutura principal

```text
backend/
  app.js                         Servidor Express
  config/
    database.js                  Conexao com MySQL
    email.js                     Transporte SMTP
    infobip.js                   Cliente HTTP da Infobip
    whatsapp.js                  Sessao Baileys
  controllers/
    authController.js            Cadastro, login e notificacoes
  factories/                     Factory Method
  middlewares/
    authMiddleware.js            Validacao do JWT
  products/                      Produtos concretos de notificacao
  routes/                        Rotas da API
  services/
    mensageriaService.js         Selecao de fabrica e envio
frontend/
  index.html                     Interface
  app.js                         Logica do navegador
  style.css                      Estilos
sql/
  schema.sql                     Estrutura do banco
tests/                            Testes automatizados
```

## Instalacao

Na pasta do projeto, instale as dependencias:

```powershell
npm install
```

As principais bibliotecas utilizadas sao:

- `express`: servidor HTTP e API.
- `mysql2`: acesso ao MySQL.
- `dotenv`: carregamento do `.env`.
- `bcryptjs`: hash de senhas.
- `jsonwebtoken`: autenticacao por JWT.
- `nodemailer`: envio de e-mail via SMTP.
- `@whiskeysockets/baileys`: conexao com o WhatsApp Web.
- `qrcode-terminal`: exibicao compacta do QR Code no terminal.
- `pino`: logger usado pela sessao Baileys.
- `jest`: testes automatizados.

## Banco de dados

1. Inicie o MySQL no XAMPP.
2. Abra o phpMyAdmin ou um cliente MySQL.
3. Execute o arquivo `sql/schema.sql`.
4. Confira no `.env` se `DB_NAME` esta como `mensageria`.

O schema cria a tabela `usuarios` com os campos `nome`, `senha_hash`, `email`, `celular` e `criado_em`.

## Configuracao do `.env`

Copie o modelo:

```powershell
Copy-Item .env.example .env
```

Preencha o `.env` com os dados reais. Nunca publique esse arquivo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mensageria

JWT_SECRET=crie-uma-chave-longa-e-aleatoria
JWT_EXPIRES_IN=2h

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_aplicativo
EMAIL_FROM=seu_email@gmail.com

INFOBIP_BASE_URL=https://sua-conta.api.infobip.com
INFOBIP_API_KEY=sua_api_key
INFOBIP_SMS_SENDER=seu_remetente_sms

WHATSAPP_AUTH_DIR=.baileys-auth
```

### Gmail e SMTP

Para o Gmail:

1. Ative a verificacao em duas etapas na conta Google.
2. Gere uma senha de aplicativo.
3. Use a senha gerada em `EMAIL_PASSWORD`, sem espacos.
4. Use `smtp.gmail.com`, porta `587` e `EMAIL_SECURE=false`.

Se houver antivirus com inspecao de e-mail, como o Avast, ele pode substituir o certificado TLS e causar `self-signed certificate in certificate chain`. Nesse caso, desative somente a inspecao de e-mail ou configure uma excecao para o SMTP, sem desativar a seguranca geral do antivirus.

### Infobip

O SMS usa a API HTTP da Infobip. Sao necessarios:

- `INFOBIP_BASE_URL`: Base URL exibida no painel da conta.
- `INFOBIP_API_KEY`: chave criada em Developer Tools/API Keys.
- `INFOBIP_SMS_SENDER`: remetente SMS autorizado pela Infobip.

O codigo chama o endpoint avancado `/sms/2/text/advanced`. O numero do destinatario e lido do campo `celular` do usuario autenticado e normalizado para o formato internacional, por exemplo `+5511999999999` vira `5511999999999`.

## Cadastro na Infobip

No cadastro inicial da Infobip, selecione **Transacoes** para mensagens operacionais, como boas-vindas e confirmacoes. Na opcao de uso da plataforma, selecione **Usando codigos (APIs, SDKs)**, pois a aplicacao integra a API diretamente.

Depois de criar a conta:

1. Acesse **Ferramentas para Desenvolvedores** e crie uma API Key.
2. Copie a Base URL da conta.
3. Acesse **Canais e Numeros -> Canais -> SMS**.
4. Confira em **Meus numeros** ou na configuracao do SMS qual remetente esta disponivel.
5. Use o remetente autorizado no `INFOBIP_SMS_SENDER`.

Nao solicite um remetente alfanumerico exclusivo sem conferir a cobranca apresentada pelo painel. Um remetente compartilhado pode ser suficiente para testes. A conta de avaliacao tambem pode limitar destinos, saldo e volume de mensagens.

## Configuracao do WhatsApp com Baileys

O WhatsApp nao usa mais Twilio nem Infobip neste projeto. Ele usa Baileys, uma biblioteca que conecta o backend a uma sessao do WhatsApp Web.

As dependencias foram instaladas com:

```powershell
npm install @whiskeysockets/baileys qrcode qrcode-terminal pino
```

O arquivo `backend/config/whatsapp.js`:

- abre a sessao Baileys somente quando o canal WhatsApp e usado;
- exibe um QR Code compacto no terminal;
- salva as credenciais em `.baileys-auth`;
- reconecta automaticamente se a conexao cair;
- envia para enderecos no formato `5511999999999@s.whatsapp.net`.

Para conectar:

1. Inicie a aplicacao com `npm start`.
2. Marque somente WhatsApp e envie uma mensagem, se a sessao ainda nao estiver conectada.
3. No terminal, aguarde o QR Code.
4. No celular que sera usado como remetente, abra o WhatsApp.
5. Acesse **Configuracoes -> Dispositivos conectados -> Conectar dispositivo**.
6. Escaneie o QR Code.
7. Aguarde a mensagem `WhatsApp conectado pelo Baileys.`.
8. Envie novamente a mensagem pela aplicacao.

O QR Code aparece somente na primeira conexao porque a sessao fica salva em `.baileys-auth`. Para conectar outro numero ou gerar um novo QR Code, encerre o servidor e remova a sessao:

```powershell
Remove-Item -Recurse -Force .baileys-auth
npm start
```

Baileys nao e uma API oficial do WhatsApp. Use somente para testes e para mensagens autorizadas, evitando spam e disparos em massa. A conta pareada pode ser desconectada ou sofrer restricoes conforme as regras do WhatsApp.

## Executando a aplicacao

Inicie o servidor:

```powershell
npm start
```

Ou use o modo de desenvolvimento com reinicio automatico:

```powershell
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Para reiniciar quando a porta `3000` estiver ocupada:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
Stop-Process -Id NUMERO_DO_PROCESSO
npm start
```

## Como usar

1. Abra `http://localhost:3000`.
2. Cadastre um usuario com celular em formato internacional, por exemplo `+5511999999999`.
3. Faca login.
4. Na entrada, o sistema consulta o usuario no MySQL e tenta enviar a mensagem de boas-vindas por e-mail, SMS, WhatsApp e Push.
5. Para uma nova mensagem, preencha assunto e texto.
6. Marque os canais desejados.
7. Clique em **Enviar pelos canais selecionados**.
8. Consulte **Status dos canais** para ver o sucesso ou o erro individual de cada envio.

O envio de um canal nao interrompe os demais. O servico usa `Promise.allSettled`, portanto cada canal informa seu proprio resultado.

## Factory Method aplicado

O produto abstrato e `Notificacao`. Cada produto concreto implementa `enviar()`:

```text
Notificacao
|-- EmailNotificacao
|-- SmsNotificacao
|-- WhatsAppNotificacao
|-- PushNotificacao
`-- TelegramNotificacao
```

As fabricas concretas implementam `criarNotificacao()`:

```text
NotificacaoFactory
|-- EmailFactory
|-- SmsFactory
|-- WhatsAppFactory
|-- PushFactory
`-- TelegramFactory
```

O `factoryRegistry.js` escolhe a fabrica pelo nome do canal. O `mensageriaService.js` trabalha com a fabrica e com o contrato `Notificacao`, sem criar diretamente `EmailNotificacao`, `SmsNotificacao` ou `WhatsAppNotificacao`.

Essa separacao atende ao objetivo do laboratorio: a criacao do objeto concreto fica nas fabricas, enquanto o servico utiliza a abstracao. Para adicionar outro canal, crie o produto, crie sua fabrica e registre-a no catalogo.

## Push e Telegram

O Push e preparado pelo backend e exibido no navegador autenticado usando a Web Notification API. Permita notificacoes para `localhost:3000` no Chrome.

O Telegram esta implementado como produto e fabrica demonstrativos, sem integracao externa obrigatoria. Ele retorna o estado preparado para representar a extensao solicitada no laboratorio.

## Testes

Execute todos os testes:

```powershell
npm test
```

Execute somente os testes principais de fabrica e mensageria:

```powershell
npm test -- --runInBand tests/factoryMethod.test.js tests/mensageriaService.test.js
```

Os testes de mensageria usam mocks para nao enviar mensagens reais durante a execucao.

## Solucao de problemas

### A porta 3000 ja esta em uso

Encerre o processo que esta escutando a porta e execute `npm start` novamente.

### O SMS nao chega

Confira o status em **Status dos canais** e na Infobip. Verifique o `INFOBIP_SMS_SENDER`, o saldo da conta, as restricoes da avaliacao e o formato internacional do celular. Um resultado `PENDING_ACCEPTED` significa que a Infobip aceitou a mensagem, mas ela ainda pode estar aguardando a entrega da operadora.

### O WhatsApp nao envia

Confirme que o QR Code foi escaneado e que o terminal exibiu `WhatsApp conectado pelo Baileys.`. Se a sessao estiver corrompida, remova `.baileys-auth` e faca o pareamento novamente.

### O e-mail falha com certificado

Verifique o antivirus e a configuracao SMTP do Gmail. Para testes, use `smtp.gmail.com`, porta `587`, `EMAIL_SECURE=false` e uma senha de aplicativo valida.

### A interface mostra erro 400 ao enviar

Confirme que o checkbox do canal esta marcado. A requisicao deve conter, por exemplo, `canais: ["SMS"]`. Recarregue a pagina com `Ctrl + F5` depois de alteracoes no frontend.

## Seguranca

- Nunca publique `.env`, API Keys, senhas de aplicativo ou tokens.
- O `.env` e `.baileys-auth` ja estao protegidos pelo `.gitignore`.
- As credenciais expostas anteriormente devem ser revogadas e substituidas.
- Use uma chave JWT longa e aleatoria.
- Em producao, use HTTPS, cookies HttpOnly/Secure, rate limiting, validacao de entrada e gerenciamento seguro de segredos.
