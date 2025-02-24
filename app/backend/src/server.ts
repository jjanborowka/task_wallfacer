import Fastify from 'fastify';
import {pool} from './db/db'
import {analyticsRouts} from './routs'
const fastify = Fastify({ logger: true });
fastify.register(analyticsRouts)
// Define a simple route
fastify.get('/', async (request, reply) => {
  try {
   
    const result = await pool.query('SELECT NOW()');

    return { message: 'Hello, Fastify with TypeScript!', time: result.rows[0].now };
  } catch (err) {
    request.log.error(err);
    return reply.status(500).send({ error: 'Database query failed' });
  }
});
// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    console.log(err)
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
