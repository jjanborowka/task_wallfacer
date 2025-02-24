import Fastify from 'fastify';
import {pool,dbClient} from './db/db'
import fastifyWebsocket from "@fastify/websocket";
import {analyticsRouts} from './routs'
import { WebSocket } from 'ws';
import fastifyCors from '@fastify/cors';
const fastify = Fastify({ logger: true });
fastify.register(fastifyWebsocket);
fastify.register(analyticsRouts)
// Register the CORS plugin
fastify.register(fastifyCors, {
  origin: 'http://localhost:3003', // Allow requests from this origin
  methods: ['GET'], // Specify allowed methods
});

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

// Websocket setup 
fastify.register(async function (fastify) { 
fastify.get('/ws', { websocket: true }, (socket :WebSocket, req) => {
  dbClient.on("notification", (msg) => {
    console.log("🔔 DB Update Received:", msg.payload);
    socket.send(msg.payload??"")
  })
});
})




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
