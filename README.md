## Instalação de Dependências

Certifique-se de ter o **Node** e o **NPM** instalados em sua máquina.

Para instalar as bibliotecas necessárias, execute o seguinte comando no terminal:

```bash
npm install
```

## Scripts

- **Ambiente de Desenvolvimento:**
  ```bash
  npm run dev
  ```

- **Compilar para JavaScript:**
  ```bash
  npm run build
  ```

- **Executar em Produção:**
  ```bash
  npm run start
  ```

## Configuração

1. Renomeie o arquivo **.env.example** para **.env**.
2. No arquivo recém-renomeado (**.env**), atualize as informações conforme as instruções fornecidas no próprio arquivo.

## Configuração Adicional

Os seguintes arquivos foram gerados pela CLI do **fly.io**. Se você estiver usando outro servidor, sinta-se à vontade para excluí-los:

- **.dockerignore**
- **Dockerfile**
- **fly.toml**

Caso esteja utilizando o **fly.io**, consulte a documentação para criar uma conta, faça login usando a CLI e utilize o comando de deploy conforme as instruções fornecidas pela documentação do **fly.io**.

## Banco de Dados

Este projeto utiliza o serviço de banco de dados PlanetScale, com suporte para o Prisma. Para facilitar o deploy do banco de dados, você pode utilizar a CLI do Prisma. Certifique-se de configurar corretamente as variáveis de ambiente no arquivo **.env**.
