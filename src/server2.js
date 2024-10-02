const http = require('http');
const { Client } = require('pg');

// Función para crear un nuevo cliente de PostgreSQL
function crearCliente() {
    return new Client({
        user: 'postgres', 
        host: 'localhost', 
        database: 'edutecno', 
        password: '1234', 
        port: 5432
    });
}

const server = http.createServer((req, res) => {
    console.log(`Método HTTP: ${req.method}`);

    if (req.method === 'GET' && req.url === '/hora-actual-cliente') {
        const cliente = crearCliente(); // Crear un nuevo cliente por cada solicitud

        // Conectar a la base de datos
        cliente.connect()
            .then(() => {
                console.log('Conectado a la base de datos');
                // Hacer una consulta
                return cliente.query('SELECT NOW()');
            })
            .then((resH) => {
                // Enviar la respuesta al navegador
                res.end(JSON.stringify(resH.rows));
                console.log('Resultado de la consulta:', resH.rows);
            })
            .then(() => {
                // Cerrar la conexión
                return cliente.end();
            })
            .then(() => {
                console.log('Conexión cerrada');
            })
            .catch((err) => {
                console.error('Error ejecutando la consulta o cerrando la conexión:', err.stack);
                res.end('Error al ejecutar la consulta');
            });
    }
});

// Puerto de escucha del servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = server;
