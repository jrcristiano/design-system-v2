# Design System

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Docker](https://img.shields.io/badge/Docker-28.4.0-0db7ed?logo=docker)
![Compose](https://img.shields.io/badge/Compose-2.39.4-0db7ed?logo=docker)
![CI/CD](https://img.shields.io/badge/CI/CD-Bitbucket-orange?logo=bitbucket)

> Biblioteca de componentes React reutilizáveis construída com **React**, **TypeScript**, **Tailwind CSS**, **Vite** e **Storybook**.

---

## 📚 Índice

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [🛠️ Tecnologias Utilizadas](#%EF%B8%8F-tecnologias-utilizadas)
- [⚙️ Instalação e Uso](#%EF%B8%8F-instalação-e-uso)
- [🧪 Scripts Disponíveis](#-scripts-disponíveis)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🐳 Docker](#-docker)
- [🤝 Contribuindo](#-contribuindo)

---

## 🚀 Sobre o Projeto

O **DS Lib Components** é um **Design System modular e reutilizável**, criado para padronizar e acelerar o desenvolvimento de interfaces.
Ele fornece uma base sólida de **componentes React**, **tokens de design**, **hooks** e **utilitários** que seguem boas práticas de acessibilidade e consistência visual.

> 🧩 Totalmente compatível com Vite, Storybook e CI/CD via Bitbucket Pipelines.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                   | Descrição                                        |
| ---------------------------- | ------------------------------------------------ |
| ⚛️ **React 19**              | Criação de componentes e interface               |
| 🧠 **TypeScript**            | Tipagem estática e robustez no desenvolvimento   |
| 🎨 **Tailwind CSS 4**        | Estilização baseada em tokens e design system    |
| ⚡ **Vite**                  | Build rápido e otimizado                         |
| 📘 **Storybook 10**          | Documentação visual de componentes               |
| 🧰 **ESLint + Prettier**     | Padrões de código e linting                      |
| 🧪 **Vitest + Playwright**   | Testes unitários e E2E                           |
| 🐳 **Docker 28.4.0**         | Contêinerização e deploy padronizado             |
| ⚙️ **Docker Compose 2.39.4** | Orquestração de contêineres para desenvolvimento |
| 🔄 **Bitbucket Pipelines**   | Integração contínua (CI/CD)                      |

---

## 🐳 Instalação e uso com Docker & Docker Compose

```bash
# Opcional: crie um arquivo de ambiente para personalizar as portas e opções
cp .env.example .env

# Construir e subir os contêineres
docker compose up --build
```

Serviços disponíveis:

- Vite em `http://localhost:5173`
- Storybook de desenvolvimento em `http://localhost:3000`
- Preview da aplicação em `http://localhost:4173`
- Storybook estático de produção em `http://localhost:8080`

O arquivo `.env` é opcional. Sem ele, o Compose usa os valores padrão mostrados acima. A configuração de arquivo opcional requer Docker Compose 2.24 ou superior.

---

## ⚙️ Instalação e uso sem Docker (Não recomendado)

```bash
# Crie o arquivo de ambiente a partir do exemplo
cp .env.example .env

# Clone o repositório via SSH
git clone git@bitbucket.org:click-ideia/ds-lib-componentes.git

# Instale as dependências
pnpm install

# Rode o ambiente de desenvolvimento
pnpm dev

# Inicie o Storybook
pnpm storybook
```

> 💡 Dica: utilize `pnpm build` para gerar os artefatos de produção ou `pnpm lint` para validar o código.

---

## 🧪 Scripts Disponíveis

| Comando                | Descrição                                       |
| ---------------------- | ----------------------------------------------- |
| `pnpm dev`             | Inicia o ambiente de desenvolvimento com Vite   |
| `pnpm build`           | Compila o projeto TypeScript e gera build final |
| `pnpm lint`            | Executa o ESLint para verificação de padrões    |
| `pnpm preview`         | Roda o servidor local do build                  |
| `pnpm storybook`       | Abre o Storybook no modo desenvolvimento        |
| `pnpm storybook:build` | Gera a build estática do Storybook              |

---

## 📁 Estrutura do Projeto

```bash
src/
├── assets/          # Recursos estáticos (imagens, ícones, etc)
├── components/      # Componentes reutilizáveis
├── hooks/           # Hooks customizados
├── stories/         # Exemplos e documentação Storybook
├── styles/          # Estilos globais e tokens CSS
├── tokens/          # Definições de tokens (cores, tipografia, espaçamento)
├── types/           # Tipagens globais
├── App.tsx          # Aplicação principal
└── main.tsx         # Ponto de entrada Vite
```

---

## 🤝 Contribuindo

Siga o fluxo **Git Flow** e os padrões de **Conventional Commits**:

```bash
feat: adiciona novo componente de botão
fix: corrige estilos quebrados no Card
chore: atualiza dependências
```

1. Crie uma branch: `git checkout -b feature/nome-da-feature`
2. Faça suas alterações e commits seguindo o padrão
3. Faça push e abra um PR no Bitbucket 🚀

---
