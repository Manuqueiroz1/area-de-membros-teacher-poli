import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Add error handling for missing dependencies
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database simulation (replace with real database)
const users = new Map();
const purchases = new Map();

// Hotmart webhook endpoint
app.post('/webhook/hotmart', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    // Validate webhook signature (implement according to Hotmart docs)
    // const signature = req.headers['x-hotmart-signature'];
    // if (!validateHotmartSignature(signature, req.body)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }
    
    if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {
      const { buyer, purchase } = data;
      
      // Store purchase data
      purchases.set(buyer.email.toLowerCase(), {
        email: buyer.email.toLowerCase(),
        name: buyer.name,
        purchaseId: purchase.transaction,
        productId: purchase.product.id,
        status: 'active',
        purchaseDate: new Date(),
        hotmartData: data
      });
      
      console.log(`Purchase registered for: ${buyer.email}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if email has valid purchase
app.post('/api/auth/check-purchase', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const purchase = purchases.get(email.toLowerCase());
    
    if (!purchase) {
      return res.status(404).json({ 
        error: 'Nenhuma compra encontrada para este e-mail',
        hasPurchase: false 
      });
    }
    
    if (purchase.status !== 'active') {
      return res.status(403).json({ 
        error: 'Compra não está ativa',
        hasPurchase: false 
      });
    }
    
    res.json({
      hasPurchase: true,
      customerName: purchase.name,
      purchaseDate: purchase.purchaseDate
    });
    
  } catch (error) {
    console.error('Check purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create password for first-time user
app.post('/api/auth/create-password', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if purchase exists
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase) {
      return res.status(404).json({ error: 'Nenhuma compra encontrada para este e-mail' });
    }
    
    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return res.status(409).json({ error: 'Usuário já possui senha cadastrada' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    users.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      name: name || purchase.name,
      password: hashedPassword,
      createdAt: new Date(),
      hasCompletedOnboarding: false
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: email.toLowerCase(), 
        name: name || purchase.name 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        email: email.toLowerCase(),
        name: name || purchase.name,
        hasCompletedOnboarding: false
      }
    });
    
  } catch (error) {
    console.error('Create password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with existing password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user exists
    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    // Check if purchase is still active
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase || purchase.status !== 'active') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update onboarding status
app.post('/api/auth/complete-onboarding', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    user.hasCompletedOnboarding = true;
    users.set(email.toLowerCase(), user);
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test endpoint to simulate a purchase (for development)
app.post('/test/simulate-purchase', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    purchases.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      name: name || 'Usuário Teste',
      purchaseId: 'TEST_' + Date.now(),
      productId: 'teacher-poli-course',
      status: 'active',
      purchaseDate: new Date(),
      hotmartData: { test: true }
    });
    
    res.json({ success: true, message: 'Purchase simulated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive requests`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/hotmart`);
});