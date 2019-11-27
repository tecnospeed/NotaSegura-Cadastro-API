# NotaSegura-Cadastro-API
Essa aplicação tem como objetivo, realizar cadastro de clientes de uma software house em massa no Nota Segura, sendo necessário importar um 
csv com as informações a serem cadastradas.

## Primeiros passos
  Primeiramente para utilização da aplicação é necessário ser cadastro como Parceiro no Notasegura(https://app.notasegura.com.br/partner/auth/register). Com a conta criada, você vai precisar apenas do token que será disponibilizado na aba configurações->Dados da conta.

#### Formato do arquivo .csv
  Os campos tem que estar organizados na seguinte sequencia: **Razão Social, Nome Fantasia, CNPJ ou CPF, E-mail, Senha.**
  
## Instalação
Para instalar as dependencias na maquina, é necessário utilziar o npm.

```
npm install
```

## Inicializando o projeto
```
npm start
```

## Gerar instalador projeto
```
npm install electron-builder --save-dev
npm run dist
```

