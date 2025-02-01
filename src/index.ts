import app from "./app";
import RabbitMqConfig from "./config/rabbitmqConfig";

const port = process.env.PORT || 3096;

const rabbitMq = new RabbitMqConfig();

const server = app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await rabbitMq.connect();
})

const shutdown = async () => {
    console.log("Encerrando aplicação...");
    await rabbitMq.closeConnection();
    server.close(() => {
        console.log('Servidor encerrado');
        process.exit(0);
    })
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);