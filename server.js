import { create } from '@wppconnect-team/wppconnect';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import QRCode from 'qrcode';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let client = null;

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('start-whatsapp', async () => {
    try {
      console.log('Starting WhatsApp connection...');
      
      // Close existing client if any
      if (client) {
        await client.close();
        client = null;
      }

      client = await create({
        session: 'whatsapp-session',
        catchQR: async (base64Qr, asciiQR, attempts) => {
          console.log('New QR code generated. Attempt:', attempts);
          try {
            const qrCode = await QRCode.toDataURL(base64Qr);
            socket.emit('qr', qrCode);
          } catch (err) {
            console.error('Error converting QR code:', err);
            socket.emit('error', 'Failed to generate QR code');
          }
        },
        statusFind: (statusSession, session) => {
          console.log('Status Session:', statusSession);
          socket.emit('connection-status', statusSession);
        },
        logQR: true,
        puppeteerOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ],
          headless: 'new'
        }
      });

      console.log('WhatsApp client created successfully');
      
      client.onStateChange((state) => {
        console.log('State changed:', state);
        socket.emit('connection-status', state);
      });

      await client.waitForQrCodeScan();
      socket.emit('connection-status', 'connected');

    } catch (error) {
      console.error('Error starting WhatsApp:', error);
      socket.emit('error', 'Failed to start WhatsApp connection');
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Error closing client:', closeError);
        }
        client = null;
      }
    }
  });

  socket.on('disconnect-whatsapp', async () => {
    console.log('Disconnecting WhatsApp...');
    if (client) {
      try {
        await client.close();
        console.log('WhatsApp disconnected successfully');
      } catch (error) {
        console.error('Error disconnecting WhatsApp:', error);
      }
      client = null;
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});