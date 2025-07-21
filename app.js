import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Banco de dados em memória
const users = new Map();
const purchases = new Map();

console.log('🚀 Starting Teacher Poli Server...');

// Health checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// API Routes
app.post('/api/auth/check-purchase', (req, res) => {
  const { email } = req.body;
  const purchase = purchases.get(email?.toLowerCase());
  
  res.json({
    hasPurchase: !!purchase,
    customerName: purchase?.name,
    purchaseDate: purchase?.purchaseDate
  });
});

app.post('/api/auth/create-password', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.json({ success: false, error: 'Email e senha obrigatórios' });
  }
  
  const purchase = purchases.get(email.toLowerCase());
  if (!purchase) {
    return res.json({ success: false, error: 'Compra não encontrada' });
  }
  
  users.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    name: name || purchase.name,
    password: password,
    hasCompletedOnboarding: false
  });
  
  res.json({
    success: true,
    token: `token_${email}_${Date.now()}`,
    user: {
      email: email.toLowerCase(),
      name: name || purchase.name,
      hasCompletedOnboarding: false
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.get(email?.toLowerCase());
  if (!user || user.password !== password) {
    return res.json({ success: false, error: 'Credenciais inválidas' });
  }
  
  res.json({
    success: true,
    token: `token_${email}_${Date.now()}`,
    user: {
      email: user.email,
      name: user.name,
      hasCompletedOnboarding: user.hasCompletedOnboarding
    }
  });
});

app.post('/api/auth/complete-onboarding', (req, res) => {
  const { email } = req.body;
  const user = users.get(email?.toLowerCase());
  
  if (user) {
    user.hasCompletedOnboarding = true;
    users.set(email.toLowerCase(), user);
  }
  
  res.json({ success: true });
});

app.post('/api/simulate-purchase', (req, res) => {
  const { email, name } = req.body;
  
  purchases.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    name: name || 'Usuário Teste',
    purchaseId: `TEST_${Date.now()}`,
    status: 'active',
    purchaseDate: new Date()
  });
  
  res.json({ success: true });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
});

module.exports = app;