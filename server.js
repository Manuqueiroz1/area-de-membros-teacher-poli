const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 1. MIDDLEWARE BÁSICO
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ 2. LOGS DE DEBUG DETALHADOS
console.log('🚀 Starting Teacher Poli Server...');
console.log(`📍 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Static files: ${path.join(__dirname, 'dist')}`);

// ✅ 3. MÚLTIPLOS ENDPOINTS DE HEALTH (TODOS OS FORMATOS)
app.get('/health', (req, res) => {
  console.log('🔍 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: process.uptime()
  });
});

app.get('/healthz', (req, res) => {
  console.log('🔍 Healthz check requested');
  res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
  console.log('🔍 Ping check requested');
  res.status(200).send('pong');
});

app.get('/status', (req, res) => {
  console.log('🔍 Status check requested');
  res.status(200).json({ alive: true });
});

// ✅ 4. BANCO DE DADOS EM MEMÓRIA (SEM DEPENDÊNCIAS EXTERNAS)
const users = new Map();
const purchases = new Map();

console.log('💾 In-memory database initialized');

// ✅ 5. API ENDPOINTS SIMPLIFICADOS
app.post('/webhook/hotmart', (req, res) => {
  console.log('📨 Webhook received:', req.body);
  try {
    const { event, data } = req.body;
    
    if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {
      const { buyer, purchase } = data;
      
      purchases.set(buyer.email.toLowerCase(), {
        email: buyer.email.toLowerCase(),
        name: buyer.name,
        purchaseId: purchase.transaction,
        status: 'active',
        purchaseDate: new Date()
      });
      
      console.log(`✅ Purchase registered: ${buyer.email}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(200).json({ success: true }); // Always return 200 for webhooks
  }
});

app.post('/auth/check-purchase', (req, res) => {
  console.log('🔍 Check purchase:', req.body);
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.json({ 
        hasPurchase: false,
        error: 'Email é obrigatório' 
      });
    }
    
    const purchase = purchases.get(email.toLowerCase());
    
    if (!purchase) {
      return res.json({ 
        hasPurchase: false,
        error: 'Nenhuma compra encontrada. Use "Simular Compra" para testar.' 
      });
    }
    
    res.json({
      hasPurchase: true,
      customerName: purchase.name,
      purchaseDate: purchase.purchaseDate
    });
    
  } catch (error) {
    console.error('❌ Check purchase error:', error);
    res.json({ 
      hasPurchase: false,
      error: 'Erro interno' 
    });
  }
});

app.post('/auth/create-password', (req, res) => {
  console.log('🔐 Create password:', { email: req.body.email });
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.json({ 
        success: false,
        error: 'Email e senha obrigatórios' 
      });
    }
    
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase) {
      return res.json({ 
        success: false,
        error: 'Compra não encontrada' 
      });
    }
    
    if (users.has(email.toLowerCase())) {
      return res.json({ 
        success: false,
        error: 'Usuário já existe' 
      });
    }
    
    // Senha simples (sem bcrypt para evitar problemas)
    users.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      name: name || purchase.name,
      password: password, // Em produção, use hash
      hasCompletedOnboarding: false
    });
    
    console.log(`✅ User created: ${email}`);
    
    res.json({
      success: true,
      token: `token_${email}_${Date.now()}`, // Token simples
      user: {
        email: email.toLowerCase(),
        name: name || purchase.name,
        hasCompletedOnboarding: false
      }
    });
    
  } catch (error) {
    console.error('❌ Create password error:', error);
    res.json({ 
      success: false,
      error: 'Erro interno' 
    });
  }
});

app.post('/auth/login', (req, res) => {
  console.log('🔑 Login:', { email: req.body.email });
  try {
    const { email, password } = req.body;
    
    const user = users.get(email.toLowerCase());
    if (!user || user.password !== password) {
      return res.json({ 
        success: false,
        error: 'Credenciais inválidas' 
      });
    }
    
    const purchase = purchases.get(email.toLowerCase());
    if (!purchase) {
      return res.json({ 
        success: false,
        error: 'Acesso não autorizado' 
      });
    }
    
    console.log(`✅ Login successful: ${email}`);
    
    res.json({
      success: true,
      token: `token_${email}_${Date.now()}`,
      user: {
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.json({ 
      success: false,
      error: 'Erro interno' 
    });
  }
});

app.post('/auth/complete-onboarding', (req, res) => {
  console.log('✅ Complete onboarding:', req.body);
  try {
    const { email } = req.body;
    
    const user = users.get(email.toLowerCase());
    if (user) {
      user.hasCompletedOnboarding = true;
      users.set(email.toLowerCase(), user);
      console.log(`✅ Onboarding completed: ${email}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Complete onboarding error:', error);
    res.json({ success: false });
  }
});

app.post('/simulate-purchase', (req, res) => {
  console.log('🧪 Simulate purchase:', req.body);
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.json({ 
        success: false,
        error: 'Email obrigatório' 
      });
    }
    
    purchases.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      name: name || 'Usuário Teste',
      purchaseId: `TEST_${Date.now()}`,
      status: 'active',
      purchaseDate: new Date()
    });
    
    console.log(`✅ Purchase simulated: ${email}`);
    
    res.json({ 
      success: true, 
      message: 'Compra simulada!'
    });
  } catch (error) {
    console.error('❌ Simulate purchase error:', error);
    res.json({ 
      success: false,
      error: 'Erro interno' 
    });
  }
});

// ✅ 6. DEBUG ENDPOINT
app.get('/debug', (req, res) => {
  res.json({
    users: users.size,
    purchases: purchases.size,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  });
});

// ✅ 7. SERVIR FRONTEND (SPA)
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend for: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ✅ 8. ERROR HANDLING
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ 9. GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// ✅ 10. START SERVER (BIND 0.0.0.0 OBRIGATÓRIO)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 ================================');
  console.log(`✅ Server started successfully!`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`🔍 Healthz: http://localhost:${PORT}/healthz`);
  console.log(`🔍 Ping: http://localhost:${PORT}/ping`);
  console.log(`🔍 Status: http://localhost:${PORT}/status`);
  console.log(`🧪 Debug: http://localhost:${PORT}/debug`);
  console.log('🎉 ================================');
});

// ✅ 11. SERVER ERROR HANDLING
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  }
});

module.exports = app;