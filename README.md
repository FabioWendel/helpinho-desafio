![LBCA | Helpinho](/assets/header.svg)

![Projeto fictício! Seu código será usado apenas para avaliação, em hipótese alguma o usaremos internamente.](/assets/alert.svg)

## Helpinho

Helpinho é uma plataforma onde pessoas podem ajudar e pedir ajuda. Você pode se cadastrar e criar o seu helpinho, onde outras pessoas lhe darão todo o apoio que precisar.

Você deve criar uma plataforma simples, sendo possível cadastrar-se, fazer login, criar um helpinho, ver todos os helpinhos criados e ver mais informações de um helpinho. Na tela com todos os helpinhos, deve ser possível fazer buscas. Ordenação e filtros serão bem-vindos.

### Funcionalidades Esperadas

- Cadastro de usuário
- Login de usuário
- Criação de helpinho
- Visualização de todos os helpinhos criados
- Visualização de informações detalhadas de um helpinho
- Busca por helpinhos
- Ordenação e filtros nos helpinhos

### Tecnologias Utilizadas

- **Frontend:** Angular
- **Backend:** AWS Lambda, AWS DynamoDB, AWS S3
- **Autenticação:** JWT
- **Infraestrutura:** AWS (Serverless)

### Como Rodar o Sistema

#### 1. Clonar o Repositório

```sh
git clone https://github.com/FabioWendel/helpinho-desafio.git
```

#### 2. Acessar a Pasta do Frontend

```sh
cd helpinho-desafio/frontend
```

#### 3. Instalar as Dependências

```sh
npm install
```

#### 4. Rodar o Sistema

```sh
ng serve
```

O sistema estará disponível em: [http://localhost:4200/](http://localhost:4200/)

### Backend

O backend já está online e hospedado na AWS utilizando um setup serverless com Lambda, DynamoDB e S3 para armazenamento de imagens. Não é necessário subir o backend localmente.

### Estrutura do Projeto

- **Home:** Página inicial do Helpinho.
- **Pedir um Helpinho:** Página para criar um novo helpinho.
- **Meus Helpinhos:** Página que lista os helpinhos criados pelo usuário logado.

### Funcionalidades Implementadas

Não consegui realizar todo o projeto, mas o que consegui fazer inclui:

- Interface do usuário próxima do design desejado
- Backend com AWS Lambda, DynamoDB e S3 para gerenciamento do backend e armazenamento de imagens
- Validação de token e login no backend
- Todas as rotas de CRUD backend esta completa (CREATE, DELETE, UPDATE, GET)

### Melhorias Futuras

- Implementar funcionalidades de busca, ordenação e filtros nos helpinhos
- Melhorar a interface do usuário
- Implementar testes unitários e de integração
- Adicionar documentação detalhada para o uso da API
