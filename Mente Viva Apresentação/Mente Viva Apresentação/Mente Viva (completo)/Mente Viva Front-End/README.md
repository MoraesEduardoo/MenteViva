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

## 4. Execução do Projeto

A aplicação é separada em dois diretórios principais: *frontend* e *backend*, que devem ser executados individualmente.

---
### 4.1. Executand o Backend
Execute o comnado 'cd Mente VIva Back-End' após esse comando executo o comando 'npm start'. Feito isso, aparecerá informações como 'API Rodando na porta 3000' e 'MongoDB conectado'

### 4.2. Executando o Frontend
Execute o comnado 'cd Mente VIva Front-End' após esse comando executo o comando 'npm start'. Feito isso, abrirá no seu navegador a Pagina do Mente Viva. 

### 4.3. Relembrando de como deve ser executado
Relembrando, para ter sucesso com o projeto, precisará acessar individualmente cada pasta, m um terminal você faz a parto toda do Backend e no outro faça o do Frontend.