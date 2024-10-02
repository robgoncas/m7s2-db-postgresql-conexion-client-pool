
# Clase: Uso del módulo `pg` para PostgreSQL en Node.js

En esta clase, aprenderemos a trabajar con PostgreSQL en Node.js utilizando el módulo `pg`. Veremos cómo realizar consultas usando promesas (`then`, `catch`), consultas con parámetros, y cómo ejecutar consultas de manera asincrónica utilizando `async/await`.

## ¿Qué es el módulo `pg`?

`pg` es un módulo de Node.js que permite conectarse y hacer consultas a una base de datos PostgreSQL. Proporciona un conjunto de herramientas para interactuar con PostgreSQL, incluyendo dos formas principales de gestionar conexiones:

1. **Cliente (`Client`)**: Permite conexiones únicas a la base de datos, útil para conexiones no recurrentes o únicas.
2. **Pool (`Pool`)**: Proporciona un grupo de conexiones reutilizables, optimizando la conexión en aplicaciones con múltiples solicitudes.

### Instalación

Para instalar el módulo `pg`, ejecuta el siguiente comando:

```bash
npm install pg
```

## Uso de `Client` con Promesas (`then` y `catch`)

El objeto `Client` permite abrir una conexión a la base de datos, ejecutar consultas y cerrar la conexión. Las consultas se pueden manejar usando promesas (`then` y `catch`).

### Ejemplo de `Client.query()` usando `then` y `catch`:

```javascript
const { Client } = require('pg');

// Crear un cliente con los detalles de la conexión
const client = new Client({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

// Conectar a la base de datos
client.connect()
  .then(() => {
    console.log('Conectado a la base de datos');
    // Hacer una consulta
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Resultado de la consulta:', res.rows[0]);
  })
  .catch((err) => {
    console.error('Error ejecutando la consulta:', err.stack);
  })
  .finally(() => {
    // Cerrar la conexión
    client.end();
  });
```

### Explicación:
- **`client.connect()`**: Conecta a la base de datos.
- **`client.query()`**: Ejecuta una consulta.
- **`then`**: Maneja el resultado de la consulta.
- **`catch`**: Maneja cualquier error que ocurra durante la conexión o la consulta.
- **`finally`**: Se ejecuta al final para asegurarse de que la conexión se cierre.

## Ejemplo de `Pool.query()` con parámetros

El objeto `Pool` permite trabajar con un grupo de conexiones reutilizables. Es útil para manejar muchas solicitudes simultáneas.

Al hacer una consulta con parámetros, se pueden evitar inyecciones SQL pasando los valores de forma segura.

### Ejemplo de `Pool.query()` con parámetros:

```javascript
const { Pool } = require('pg');

// Crear un pool de conexiones
const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

// Parámetros de la consulta
const id = 1;
// Ojo que el método query recibe 3 parámetros: 
//query(QUERY, PARAMETROS, FUNCTION)
//query(QUERY, FUNCTION)
//query(QUERY, PARAMETROS)

pool.query('SELECT * FROM usuarios WHERE id = $1', [id])
  .then(res => {
    console.log('Usuario:', res.rows[0]);
  })
  .catch(err => {
    console.error('Error ejecutando la consulta:', err.stack);
  });
```

### Explicación:
- **`$1`**: Es un marcador de posición para el primer parámetro.
- **`[id]`**: Es el valor que se pasa a la consulta de forma segura.

## Ejecución de una query con `async/await`

Otra forma moderna de manejar operaciones asíncronas en JavaScript es usando `async/await`. A continuación, un ejemplo de cómo ejecutar una consulta de forma asíncrona usando `Pool`.

### Ejemplo de una consulta en una función `async/await`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

async function obtenerUsuarios() {
  try {
    const res = await pool.query('SELECT * FROM usuarios');
    console.log('Usuarios:', res.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta:', err.stack);
  }
}
// ó
const obtenerUsuarios2 = async () => {
  try {
    const res = await pool.query('SELECT * FROM usuarios');
    console.log('Usuarios:', res.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta:', err.stack);
  }
}

obtenerUsuarios();
obtenerUsuarios2();

```

### Explicación:
- **`async function`**: Declara una función asincrónica.
- **`await`**: Espera a que la consulta sea completada antes de continuar con el código.
- **`try/catch`**: Maneja errores que puedan surgir durante la consulta.

## Conectar a `Pool` y manejar promesas con `then` y `catch`

Es posible también conectar a una conexión del pool y manejar las consultas usando `then` y `catch`:

### Ejemplo de conexión a `Pool` con `then` y `catch`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

pool.connect()
  .then(client => {
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Hora actual:', res.rows[0]);
        client.release(); // Liberar la conexión después de usarla
      })
      .catch(err => {
        console.error('Error ejecutando la consulta:', err.stack);
        client.release(); // Asegurar que la conexión se libere
      });
  })
  .catch(err => {
    console.error('Error conectando al pool:', err.stack);
  });
```

### Explicación:
- **`pool.connect()`**: Abre una conexión del pool.
- **`client.query()`**: Ejecuta una consulta dentro de esa conexión.
- **`client.release()`**: Libera la conexión una vez que se termina de usar.

## Documentación oficial

Para más detalles sobre el módulo `pg`, puedes consultar la documentación oficial:

- [pg - Node.js PostgreSQL Documentation](https://node-postgres.com/)

---

Este material te ayudará a explicar los conceptos clave de `pg` a tus alumnos, incluyendo ejemplos de `Client`, `Pool`, manejo de consultas con promesas y `async/await`, así como cómo trabajar con parámetros en las consultas.