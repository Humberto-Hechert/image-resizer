
# Image Resizer Producer

Este projeto implementa um sistema de processamento assíncrono de imagens, utilizando Node.js, RabbitMQ, Amazon S3 e a biblioteca Sharp. Ele permite que imagens enviadas pelos usuários sejam processadas em segundo plano, melhorando a experiência do usuário e a escalabilidade da aplicação. Este repositório contém somente o producer (API) para recebimento das imagens originais e envio dela para o S3 e os dados da mesma para uma fila RabbitMQ.


## Instalação

Clone o repositório

```bash
    git clone https://github.com/Humberto-Hechert/image-resizer
    cd image-resizer
```
Instale as dependências

```bash
    npm install
```
Configure as variáveis de ambiente
```bash
    PORT=3096
    AWS_ACCESS_KEY_ID=seu-access-key-da-AWS
    AWS_SECRET_ACCESS_KEY=seu-secret-key-da-AWS
    AWS_REGION=regiao-da-aws-que-utiliza
    AWS_BUCKET_NAME=nome-do-seu-bucket-para-imagem-original

    RABBIT_HOST=localhost
    RABBIT_PORT=5672
    RABBIT_USER=seu-usuario-do-rabbitmq
    RABBIT_PASS=sua-senha-do-rabbitmq
    QUEUE_ORIGINAL_IMAGE=nome-da-sua-fila-no-rabbitmq
```
Suba o RabbitMQ com Docker Compose (opcional)
```bash
    docker compose up -d
```
Inicie a API localmente
```bash
    npm run dev
```
## Chamando a API

#### Envio da imagem

```http
  POST /upload
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `image` | `form-data` | **Obrigatório**. Enviar imagem como upload no value |
