# Cartão Fidelidade Web

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Tech](https://img.shields.io/badge/tech-Node.js%20%7C%20EJS%20%7C%20Express%20%7C%20PostgreSQL-green)

Aplicação web voltada à **gestão de programas de fidelidade**, permitindo o cadastro de clientes, emissão de cartões, controle de pontos, resgates de recompensas e visualização de relatórios.  
O projeto está sendo desenvolvido com foco em **simplicidade, escalabilidade e experiência do usuário**.

---

## Sobre o Projeto

O **Cartão Fidelidade Web** tem como objetivo **modernizar o gerenciamento de programas de fidelidade** utilizados por empresas do setor varejista, possibilitando o acompanhamento digital de pontos e benefícios dos clientes.

A plataforma é voltada tanto para o **administrador**, que pode cadastrar e monitorar clientes, quanto para o **usuário final**, que pode consultar seus pontos e recompensas de forma simples e intuitiva.

O sistema utiliza renderização **EJS no lado do servidor**, garantindo maior desempenho e segurança, além de **integração com banco PostgreSQL** para o armazenamento das informações.

---

## Funcionalidades Principais

- 👤 **Cadastro e gerenciamento de clientes**  
- 💳 **Emissão e controle de cartões de fidelidade**  
- ➕ **Acúmulo automático de pontos por refeições**  
- 📊 **Painel administrativo com relatórios e indicadores**  
- 🔐 **Controle de acesso e autenticação de usuários**  

---

## Tecnologias Utilizadas

- **Backend:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- **Frontend (templates):** [EJS](https://ejs.co/)  
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)  
- **Estilização:** HTML5, CSS3 e Bootstrap  
- **Versionamento:** Git e GitHub  

---

## Estrutura do Projeto

├── config/ # Configurações da aplicação e banco 

├── controllers/ # Camada de controle (regras de negócio)

├── migrations/ # Scripts de migração do banco

├── models/ # Modelos de dados (entidades)

├── public/ # Arquivos estáticos (CSS, JS, imagens)

├── router/ # Definição de rotas (Express)

├── views/ # Templates EJS (layouts e páginas)

├── index.js # Ponto de entrada principal

└── package.json


A estrutura segue o padrão **MVC (Model–View–Controller)**, com separação clara entre as responsabilidades de cada camada, garantindo maior organização e manutenibilidade do código.

---

## Objetivos

- Facilitar a **gestão de programas de fidelidade** para empresas de pequeno e médio porte  
- Fornecer uma interface intuitiva e responsiva para administração e consulta de pontos  
- Reduzir processos manuais de registro e cálculo de pontos  

---

## Equipe de Desenvolvedores

- [**Mayara Duarte**](https://github.com/mayaraduartez)
- [**Ygor Souza**](https://github.com/Ygor-Souza)
- [**Ritielen Silva**](https://github.com/Ritielen)
- [**Taissa Severo**](https://github.com/taissa-severo)


---

## Status de Desenvolvimento

🧩 **Fase Atual:**  
Modelagem de dados, implementação dos controllers principais e integração das views.  
Próximas etapas: autenticação, painel administrativo e relatórios analíticos.

---

## Licença

Este projeto está sob a licença **MIT**.  
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

🔗 Projeto desenvolvido pela equipe, com foco em cartões fidelidade para o varejo e fidelização de clientes.
