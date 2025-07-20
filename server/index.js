import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Teacher Poli API Server', 
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET /health',
      'POST /webhook/hotmart',
      'POST /auth/check-purchase',
      'POST /auth/create-password', 
      'POST /auth/login',
      'POST /auth/complete-onboarding',
      'POST /simulate-purchase'
    ]
  });
});

// In-memory database simulation
const users = new Map();
const purchases = new Map();

// Add some test data
console.log('Initializing test data...');

// Hotmart webhook endpoint
app.post('/webhook/hotmart', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    const { event, data } = req.body;
    
    if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {
      const { buyer, purchase } = data;
      
      purchases.set(buyer.email.toLowerCase(), {
        email: buyer.email.toLowerCase(),
        name: buyer.name,
        purchaseId: purchase.transaction,
        productId: purchase.product.id,
        status: 'active',
        purchaseDate: new Date(),
        hotmartData: data
      });
      
      console.log(`✅ Purchase registered for: ${buyer.email}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if email has valid purchase
app.post('/auth/check-purchase', async (req, res) => {
  try {
    console.log('Check purchase request:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email é obrigatório',
        hasPurchase: false 
      });
    }
    
    const purchase = purchases.get(email.toLowerCase());
    console.log(`Purchase lookup for ${email}:`, purchase ? 'FOUND' : 'NOT FOUND');
    
    if (!purchase) {
      return res.json({ 
        error: 'Nenhuma compra encontrada para este e-mail. Clique em "Simular Compra" para testar.',
        hasPurchase: false 
      });
    }
    
    if (purchase.status !== 'active') {
      return res.json({ 
        error: 'Compra não está ativa',
        hasPurchase: false 
      });
    }
    
    console.log(`✅ Valid purchase found for ${email}`);
    res.json({
      hasPurchase: true,
      customerName: purchase.name,
      purchaseDate: purchase.purchaseDate
    });
    
  } catch (error) {
    console.error('❌ Check purchase error:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      hasPurchase: false 
    });
  }
});

// Create password for first-time user
app.post('/auth/create-password', async (req, res) => {
  try {
    console.log('Create password request:', { email: req.body.email });
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email e senha são obrigatórios' 
      });
    }
    
    // Check if purchase exists
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase) {
      return res.status(404).json({ 
        success: false,
        error: 'Nenhuma compra encontrada para este e-mail' 
      });
    }
    
    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return res.status(409).json({ 
        success: false,
        error: 'Usuário já possui senha cadastrada' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userData = {
      email: email.toLowerCase(),
      name: name || purchase.name,
      password: hashedPassword,
      createdAt: new Date(),
      hasCompletedOnboarding: false
    };
    
    users.set(email.toLowerCase(), userData);
    console.log(`✅ User created: ${email}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: email.toLowerCase(), 
        name: name || purchase.name 
      },
      process.env.JWT_SECRET || 'teacher_poli_secret_2025',
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
    console.error('❌ Create password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Login with existing password
app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login request:', { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email e senha são obrigatórios' 
      });
    }
    
    // Check if user exists
    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Senha incorreta' 
      });
    }
    
    // Check if purchase is still active
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase || purchase.status !== 'active') {
      return res.status(403).json({ 
        success: false,
        error: 'Acesso não autorizado' 
      });
    }
    
    console.log(`✅ Login successful: ${email}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET || 'teacher_poli_secret_2025',
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
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Update onboarding status
app.post('/auth/complete-onboarding', async (req, res) => {
  try {
    console.log('Complete onboarding request:', req.body);
    const { email } = req.body;
    
    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado' 
      });
    }
    
    user.hasCompletedOnboarding = true;
    users.set(email.toLowerCase(), user);
    
    console.log(`✅ Onboarding completed: ${email}`);
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Complete onboarding error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Test endpoint to simulate a purchase
app.post('/simulate-purchase', async (req, res) => {
  try {
    console.log('Simulate purchase request:', req.body);
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email é obrigatório' 
      });
    }
    
    const purchaseData = {
      email: email.toLowerCase(),
      name: name || 'Usuário Teste',
      purchaseId: 'TEST_' + Date.now(),
      productId: 'teacher-poli-course',
      status: 'active',
      purchaseDate: new Date(),
      hotmartData: { test: true }
    };
    
    purchases.set(email.toLowerCase(), purchaseData);
    console.log(`✅ Purchase simulated for: ${email}`);
    
    res.json({ 
      success: true, 
      message: 'Compra simulada com sucesso!',
      data: {
        email: purchaseData.email,
        name: purchaseData.name,
        purchaseId: purchaseData.purchaseId
      }
    });
  } catch (error) {
    console.error('❌ Simulate purchase error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Debug endpoint to check data
app.get('/debug/data', (req, res) => {
  res.json({
    users: Array.from(users.keys()),
    purchases: Array.from(purchases.keys()),
    totalUsers: users.size,
    totalPurchases: purchases.size
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ 
    success: false,
    error: 'Erro interno do servidor' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint não encontrado',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Teacher Poli API Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive requests`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/hotmart`);
  console.log(`🧪 Test endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/health`);
  console.log(`   - POST http://localhost:${PORT}/simulate-purchase`);
  console.log(`   - GET  http://localhost:${PORT}/debug/data`);
});