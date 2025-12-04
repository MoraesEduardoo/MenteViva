# Mente Viva  
Aplicação desenvolvida para auxiliar idosos com Alzheimer por meio de registro emocional, diário pessoal, exercícios cognitivos e acompanhamento contínuo de bem-estar.  
O sistema é composto por duas partes independentes: *frontend (React)* e *backend (Node.js + Express + MongoDB)*.

---

## 1. Visão Geral do Projeto
O Mente Viva foi projetado para ser uma solução acessível e intuitiva, oferecendo recursos como:

- Registro diário emocional  
- Diário multimídia (texto, imagem e áudio)  
- Exercícios cognitivos interativos  
- Histórico de progresso do usuário  
- Área do cuidador/família (versão profissional)  
- Autenticação e controle de sessões  

---

## 2. Tecnologias Utilizadas

### 2.1. Frontend
- React  
- React Router  
- Context API (gerenciamento de autenticação)  
- CSS puro  

### 2.2. Backend
- Node.js  
- Express  
- MongoDB e Mongoose  
- JWT (JSON Web Token)  
- CORS  

---

## 3. Requisitos
Antes de iniciar, certifique-se de ter instalado:

- Node.js (versão recomendada: 18 ou superior)  
- NPM ou Yarn  
- MongoDB instalado localmente ou uma conta MongoDB Atlas  

---

## Observação
### Antes de rodar o Backend, necessta-se do .env

## 4. Execução do Projeto
### 4.1. Passo a psso para fazer no terminal do Backend
Primeiro passo: criar um .env, para conexão com o banco de dados
Segundo passo: abrir teminal
Terceiro passo: executar no terminal: cd '.\Mente viva (completo)\Mente Viva Back-End'
Quarto passo: npm start

Depois deexecutar esses passos, deve aparecer duas mensagens "API rodando na porta 3000" e "MongoDB conectado"

### 4.2. Passo a passo para fazer no terminal do Frontend
Primeiro passso: abrir um novo terminal e exectar: cd '.\Mente viva (completo)\Mente Viva Front-End'
Segundo passo: npm start

Após execução do comadno 'npm start' irá aparecer em seu navegador o site do Mente Viva

O Backend só irá rodar se tiver um .env com as credenciais, caso contrario dá erro de cnxão com o MongoDB.
