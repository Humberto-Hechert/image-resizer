import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config

export default class RabbitMqConfig {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    readonly queueName = process.env.QUEUE_NAME;

    constructor() {}

    async connect(): Promise<void> {
        if (!this.connection){
            const url = `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASS}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`;
            this.connection = await amqp.connect(url)
            this.channel = await this.connection.createChannel()
            await this.channel.assertQueue(this.queueName, {
                durable: true
            })
            console.log(`Conectado ao RabbitMQ - Fila: ${this.queueName}`)
        }
    }

    async sendToQueue(message: object): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }

        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true
        })
        console.log(`Mensagem enviada para a fila`)
    }

    async closeConnection(): Promise<void> {
        if (this.connection) {
            await this.connection.close()
            console.log(`Conexão com o RabbitMQ encerrada!`)
            this.connection = null
            this.channel = null
        }
    }
}