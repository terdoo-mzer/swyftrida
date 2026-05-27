import express from 'express';
import redis from './config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({
     limit: '10mb',
    strict: true
}));

// health check endpoint
app.get('/health', (req, res) => {
  return res.status(200).json({status: 'ok'});
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Process termination handling for graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}, starting graceful shutdown`)

  server.close(() => {
    console.log('HTTP server closed')

    // Close database connections
    // database.close()

    // Close Redis conection
    redis.quit();

    // Clean up temporary files
    // cleanup()

    console.log('Cleanup completed, exiting')
    process.exit(0)
  })

  // Force shutdown after timeout
  setTimeout(() => {
    console.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}


process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))