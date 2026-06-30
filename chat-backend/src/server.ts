import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient({ log: ['info'] });
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Google Auth endpoint
app.post('/api/auth/google', async (req: any, res: any) => {
  try {
    const { email, name } = req.body;
    
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create user if they don't exist
      const randomPassword = await bcrypt.hash(Date.now().toString(), 10);
      user = await prisma.user.create({
        data: { email, password: randomPassword, name }
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- HISTORY ROUTES ---
app.get('/api/conversations', authenticateToken, async (req: any, res: any) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      include: { messages: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(conversations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/conversations', authenticateToken, async (req: any, res: any) => {
  try {
    const { title, messages } = req.body; // messages array from frontend
    
    const conversation = await prisma.conversation.create({
      data: {
        title: title || 'New Chat',
        userId: req.user.id,
        messages: {
          create: messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        }
      },
      include: { messages: true }
    });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/conversations/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, messages } = req.body;

    // We can just delete old messages and insert new ones to keep it simple
    // or properly sync. For a chat, delete and recreate is easiest if we send full history.
    await prisma.message.deleteMany({ where: { conversationId: id } });

    const conversation = await prisma.conversation.update({
      where: { id, userId: req.user.id }, // ensure owner
      data: {
        title: title,
        messages: {
          create: messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }))
        }
      },
      include: { messages: true }
    });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/conversations/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.conversation.delete({
      where: { id, userId: req.user.id }
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
