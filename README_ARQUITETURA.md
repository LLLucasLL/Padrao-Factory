# Arquitetura e relação com o Laboratório 02

## 1. Problema inicial

Uma implementação com `if/else` criaria diretamente `new EmailNotificacao()`, `new SmsNotificacao()` e `new WhatsAppNotificacao()` dentro do sistema principal. Isso faz o consumidor conhecer as classes concretas e mistura decisão, criação e execução.

## 2. Solução com Factory Method

O projeto separa essas responsabilidades:

```text
Sistema / Service
      |
      v
FactoryRegistry
      |
      +--> EmailFactory --------> EmailNotificacao
      +--> SmsFactory ----------> SmsNotificacao
      +--> WhatsAppFactory -----> WhatsAppNotificacao
      +--> PushFactory ---------> PushNotificacao
      +--> TelegramFactory -----> TelegramNotificacao
                     |
                     v
             Notificacao
                     |
                  enviar()
```

## 3. Fluxo da sessão

```text
Cadastro
  |
  v
MySQL (usuarios)
  |
  v
Login (nome + senha)
  |
  v
JWT com usuarioId
  |
  v
GET /api/auth/entrada
  |
  v
Middleware valida JWT
  |
  v
Consulta do usuarioId no MySQL
  |
  v
MensageriaService
  |
  v
Factory -> Produto -> enviar()
```

## 4. Factory Method x Strategy

O laboratório diferencia os padrões assim:

- **Strategy**: escolhe qual comportamento/algoritmo usar.
- **Factory Method**: define qual objeto/produto será criado.

Nesta aplicação, o Factory Method é o mecanismo de criação das notificações. O projeto anterior tinha Strategy; nesta versão, a responsabilidade de criação foi transferida para as fábricas para seguir o foco do Laboratório 02.
