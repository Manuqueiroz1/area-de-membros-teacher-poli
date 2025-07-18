# Área de Membros - Teacher Poli

Sistema completo de área de membros com integração Hotmart e autenticação personalizada.

## 🚀 Funcionalidades

### 🔐 **Sistema de Autenticação**
- Integração com webhook da Hotmart para validação de compras
- Criação de senha personalizada no primeiro acesso
- Login com credenciais próprias em acessos subsequentes
- Validação de e-mail baseada em compras ativas

### 📚 **Área de Membros**
- Sistema de progressão para novos usuários
- Desbloqueio automático após gerar primeiro plano de estudos
- Acesso completo para usuários recorrentes
- Interface responsiva e moderna

### 🤖 **IA Personalizada**
- Geração de planos de estudos personalizados
- Chat interativo com assistente IA
- Templates pré-definidos para diferentes níveis

## 🛠️ Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```env
HOTMART_WEBHOOK_SECRET=seu_secret_do_hotmart
JWT_SECRET=seu_jwt_secret_super_seguro
DATABASE_URL=sua_url_do_banco_de_dados
PORT=3001
```

### 3. Executar o Projeto

#### Desenvolvimento Completo (Frontend + Backend)
```bash
npm run dev:full
```

#### Apenas Frontend
```bash
npm run dev
```

#### Apenas Backend
```bash
npm run server
```

## 🔗 Integração Hotmart

### Webhook Configuration
Configure o webhook da Hotmart para apontar para:
```
https://seu-dominio.com/webhook/hotmart
```

### Eventos Suportados
- `PURCHASE_COMPLETE`
- `PURCHASE_APPROVED`

### Estrutura do Webhook
O sistema espera receber dados no formato:
```json
{
  "event": "PURCHASE_COMPLETE",
  "data": {
    "buyer": {
      "email": "cliente@email.com",
      "name": "Nome do Cliente"
    },
    "purchase": {
      "transaction": "TRANSACTION_ID",
      "product": {
        "id": "PRODUCT_ID"
      }
    }
  }
}
```

## 🧪 Testes

### Simular Compra (Desenvolvimento)
Para testar o sistema sem uma compra real:

1. Acesse a tela de login
2. Digite um e-mail
3. Clique em "[TESTE] Simular Compra"
4. Agora você pode criar uma senha e acessar

### API Endpoints

#### POST `/webhook/hotmart`
Recebe webhooks da Hotmart

#### POST `/api/auth/check-purchase`
Verifica se e-mail tem compra válida

#### POST `/api/auth/create-password`
Cria senha para primeiro acesso

#### POST `/api/auth/login`
Login com credenciais existentes

#### POST `/api/auth/complete-onboarding`
Marca onboarding como concluído

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (salt rounds: 12)
- JWT tokens com expiração de 7 dias
- Validação de assinatura do webhook Hotmart
- Verificação de compras ativas antes do acesso

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados para todos os dispositivos
- Interface adaptativa com componentes flexíveis

## 🚀 Deploy

### Variáveis de Ambiente de Produção
```env
HOTMART_WEBHOOK_SECRET=seu_secret_real
JWT_SECRET=jwt_secret_super_seguro_producao
DATABASE_URL=url_banco_producao
PORT=3001
```

### Banco de Dados
O sistema atual usa armazenamento em memória para demonstração. Para produção, integre com:
- PostgreSQL
- MongoDB
- MySQL
- Supabase

## 📞 Suporte

Para dúvidas sobre integração ou configuração, consulte:
- [Documentação da Hotmart](https://developers.hotmart.com/)
- [Documentação do JWT](https://jwt.io/)

---

© 2025 Teacher Poli. Todos os direitos reservados.