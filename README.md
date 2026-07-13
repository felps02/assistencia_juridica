# Almeida & Ribeiro Assistência Jurídica

Aplicação web em monorepo para captação, gestão e acompanhamento de solicitações de assistência jurídica. O projeto possui frontend Next.js, backend Express com API REST, Prisma ORM, MySQL, upload de documentos, autenticação administrativa, painel interno e preparação para deploy no Render com banco MySQL no Aiven.

## Tecnologias

- Frontend: Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, Axios, Lucide React.
- Backend: Node.js, Express, TypeScript, Prisma ORM, Zod, JWT, bcrypt, Multer, Helmet, CORS, Express Rate Limit, Morgan e Nodemailer.
- Banco: MySQL com migrations Prisma.
- Testes: Vitest e Supertest.

## Estrutura

```text
assistencia-juridica/
├── frontend/
├── backend/
├── render.yaml
├── README.md
└── .gitignore
```

## Variáveis de ambiente

Backend: copie `backend/.env.example` para `backend/.env` localmente e preencha `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, SMTP e dados `ADMIN_*` para seed. Não versionar `.env`.

Frontend: copie `frontend/.env.example` para `frontend/.env.local` e defina `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` e `NEXT_PUBLIC_COMPANY_EMAIL`.

## Instalação local

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locais: frontend em `http://localhost:3000`, backend em `http://localhost:3001/api`.

## MySQL e Aiven

1. Crie um serviço MySQL no Aiven.
2. No painel do Aiven, copie host, porta, database, usuário e senha.
3. Monte a URL:

```env
DATABASE_URL=mysql://USUARIO:SENHA@HOST:PORTA/NOME_BANCO
```

Se a senha possuir caracteres especiais, aplique percent-encoding. Exemplo: `p@$$w0rd` vira `p%40%24%24w0rd`.

Quando SSL for exigido, use a connection string segura indicada pelo painel do Aiven. Em Prisma/MySQL, parâmetros SSL podem ser adicionados na própria URL, por exemplo com modo estrito ou caminho de certificado CA conforme a configuração do serviço. Não coloque certificados nem credenciais dentro do repositório; use variáveis de ambiente ou arquivos secretos do provedor.

Depois de configurar:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

## Primeiro administrador

Defina no ambiente do backend:

```env
ADMIN_NAME=Nome do Administrador
ADMIN_EMAIL=admin@empresa.com
ADMIN_PASSWORD=uma-senha-forte
```

Execute:

```bash
cd backend
npm run prisma:seed
```

A senha é criptografada com bcrypt antes de ser salva.

## API REST

Rotas públicas:

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/legal-requests`

Rotas protegidas:

- `GET /api/legal-requests`
- `GET /api/legal-requests/:id`
- `PATCH /api/legal-requests/:id/status`
- `POST /api/legal-requests/:id/notes`
- `GET /api/legal-requests/:id/notes`
- `GET /api/legal-requests/:id/history`
- `GET /api/dashboard/metrics`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`

Health check:

```bash
curl http://localhost:3001/api/health
```

Resposta esperada:

```json
{
  "success": true,
  "message": "API online",
  "database": "connected"
}
```

## Uploads

Em desenvolvimento, os arquivos são salvos em `backend/uploads`. Em produção, o projeto já possui a abstração `StorageProvider`, com `LocalStorageProvider` e `CloudStorageProvider`. Para produção em Render, recomenda-se integrar Cloudinary, Amazon S3, Google Cloud Storage ou Supabase Storage, pois o disco local do serviço pode não ser persistente entre reinicializações e deploys.

## SMTP

Configure no backend:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_NOTIFICATION_EMAIL=
CONTACT_RESPONSE_TIME=até 1 dia útil
```

Se o envio de e-mail falhar, a solicitação continua salva e o erro é registrado no log.

## CORS

`FRONTEND_URL` controla as origens permitidas. Para múltiplas origens, use vírgula:

```env
FRONTEND_URL=http://localhost:3000,https://assistencia-juridica.onrender.com
```

## Deploy no Render

O arquivo `render.yaml` define dois Web Services.

Frontend:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Variáveis: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_COMPANY_EMAIL`

Backend:

- Root directory: `backend`
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npx prisma migrate deploy && npm run start`
- Health check path: `/api/health`
- Variáveis principais: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, SMTP, `ADMIN_*`, `MAX_FILE_SIZE_MB`, `UPLOAD_PROVIDER`, `UPLOAD_DIR`

Após o backend publicar, atualize `NEXT_PUBLIC_API_URL` no frontend com a URL pública do backend terminando em `/api`, por exemplo:

```env
NEXT_PUBLIC_API_URL=https://api-assistencia-juridica.onrender.com/api
```

No backend, defina `FRONTEND_URL` com a URL pública do frontend.

## Painel administrativo

Acesse:

```text
/admin
```

Após login, o painel exibe métricas, filtros, tabela de solicitações, detalhes, documentos anexados, alteração de status, observações internas e histórico.

## Testes

```bash
cd backend
npm run test
```

Cobertura básica incluída: health check, login válido/inválido, criação de solicitação, erro de validação, rota protegida sem token, alteração de status e listagem paginada.

## Dados demonstrativos a substituir

- Indicadores da seção "Sobre": anos de experiência, clientes atendidos, atendimento nacional e satisfação.
- Depoimentos da home.
- Telefone, WhatsApp, e-mail, endereço, horários e redes sociais em `frontend/lib/company.ts`.
- Política comercial sobre custo da primeira avaliação.
- Prazo real de retorno em `CONTACT_RESPONSE_TIME`.

O site não promete resultado jurídico e informa que os dados serão usados exclusivamente para análise e contato relacionado à solicitação.

