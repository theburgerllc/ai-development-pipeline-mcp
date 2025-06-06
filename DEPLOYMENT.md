# Deployment Guide

This guide covers deploying the AI Development Pipeline MCP Integration to various platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

### Step-by-Step Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from local directory:**
```bash
vercel deploy
```

4. **Configure environment variables:**
```bash
vercel env add VERCEL_TOKEN
vercel env add AIRTABLE_API_KEY
vercel env add SQUARE_ACCESS_TOKEN
# Add all other environment variables
```

5. **Deploy to production:**
```bash
vercel deploy --prod
```

### Vercel Configuration

Create `vercel.json` in the root directory:
```json
{
  "functions": {
    "app/api/mcp/route.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/mcp",
      "destination": "/app/api/mcp/route.ts"
    }
  ]
}
```

## 🐳 Docker Deployment

### Dockerfile

Create a `Dockerfile` in the root directory:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
```

### Build and Run

```bash
# Build the image
docker build -t ai-dev-pipeline-mcp .

# Run the container
docker run -p 3000:3000 --env-file .env ai-dev-pipeline-mcp
```

## ☁️ AWS Deployment

### AWS Lambda

1. **Install Serverless Framework:**
```bash
npm install -g serverless
```

2. **Create `serverless.yml`:**
```yaml
service: ai-dev-pipeline-mcp

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  mcp:
    handler: app/api/mcp/route.handler
    events:
      - http:
          path: mcp
          method: any
```

3. **Deploy:**
```bash
serverless deploy
```

## 🌐 Netlify Deployment

### Netlify Functions

1. **Create `netlify.toml`:**
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/mcp"
  to = "/.netlify/functions/mcp"
  status = 200
```

2. **Create function in `netlify/functions/mcp.js`:**
```javascript
const { handler } = require('../../app/api/mcp/route');
exports.handler = handler;
```

## 🔧 Environment Configuration

### Production Environment Variables

Ensure these are set in your deployment platform:

```env
NODE_ENV=production
VERCEL_TOKEN=your_production_token
AIRTABLE_API_KEY=your_production_key
SQUARE_ACCESS_TOKEN=your_production_token
ANALYTICS_SECRET=your_production_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Considerations

- Use different API keys for production
- Enable HTTPS/SSL certificates
- Configure CORS properly
- Set up monitoring and logging
- Use secrets management services

## 📊 Monitoring and Logging

### Vercel Analytics

Enable Vercel Analytics in your dashboard for:
- Request metrics
- Error tracking
- Performance monitoring

### Custom Logging

Add logging to your MCP tools:
```typescript
console.log(`[${new Date().toISOString()}] Tool executed: ${toolName}`);
```

### Health Checks

Create a health check endpoint:
```typescript
// In route.ts
if (request.url.includes('/health')) {
  return new Response('OK', { status: 200 });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Deployment Issues

**Build failures:**
- Check Node.js version compatibility
- Verify all dependencies are listed in package.json
- Ensure TypeScript compiles without errors

**Runtime errors:**
- Check environment variables are set
- Verify API endpoints are accessible
- Review logs for specific error messages

**Performance issues:**
- Enable caching where appropriate
- Optimize bundle size
- Use CDN for static assets

### Getting Help

- Check platform-specific documentation
- Review deployment logs
- Test locally before deploying
- Use staging environments for testing

## 📈 Scaling Considerations

### Performance Optimization

- Implement caching strategies
- Use connection pooling for databases
- Optimize API response sizes
- Enable compression

### Load Balancing

- Use multiple deployment regions
- Implement health checks
- Configure auto-scaling
- Monitor resource usage

---

For more deployment options and advanced configurations, refer to the platform-specific documentation.
