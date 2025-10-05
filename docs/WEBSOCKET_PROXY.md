# WebSocket-to-Stratum Proxy Setup

## Why You Need a Proxy

**Important**: Most Monero mining pools (including SupportXMR, MoneroOcean, etc.) use the **TCP Stratum protocol**, not WebSocket. Browsers cannot make direct TCP connections due to security restrictions, so WebMiner requires a WebSocket-to-Stratum proxy to bridge the connection.

## The Problem

```
Browser (WebMiner) --[WebSocket]--> ❌ --[TCP Stratum]--> Mining Pool
                                   Cannot connect directly!
```

## The Solution

```
Browser (WebMiner) --[WebSocket]--> Proxy --[TCP Stratum]--> Mining Pool
                                     ✅ Bridges the protocols
```

## Quick Setup with Node.js Proxy

### 1. Install Dependencies

```bash
mkdir webminer-proxy
cd webminer-proxy
npm init -y
npm install ws net
```

### 2. Create Proxy Server (`proxy.js`)

```javascript
const WebSocket = require('ws');
const net = require('net');

const WS_PORT = 8080;  // WebSocket port for browsers
const POOL_HOST = 'gulf.moneroocean.stream';  // Stratum pool
const POOL_PORT = 10128;  // Stratum port

const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`WebSocket-to-Stratum proxy listening on ws://localhost:${WS_PORT}`);
console.log(`Forwarding to ${POOL_HOST}:${POOL_PORT}`);

wss.on('connection', (ws) => {
    console.log('Browser client connected');
    
    // Create TCP connection to pool
    const poolSocket = net.connect(POOL_PORT, POOL_HOST, () => {
        console.log('Connected to mining pool');
    });
    
    // Forward WebSocket messages to pool
    ws.on('message', (data) => {
        console.log('Browser -> Pool:', data.toString());
        poolSocket.write(data + '\n');
    });
    
    // Forward pool messages to browser
    poolSocket.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
            console.log('Pool -> Browser:', line);
            ws.send(line);
        });
    });
    
    // Handle disconnections
    ws.on('close', () => {
        console.log('Browser disconnected');
        poolSocket.end();
    });
    
    poolSocket.on('close', () => {
        console.log('Pool disconnected');
        ws.close();
    });
    
    poolSocket.on('error', (err) => {
        console.error('Pool connection error:', err.message);
        ws.close();
    });
});
```

### 3. Start the Proxy

```bash
node proxy.js
```

### 4. Configure WebMiner

```html
<script src="webminer.js" 
        data-pool="ws://localhost:8080"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>
```

## Production Deployment

### Using SSL/TLS (Recommended)

For production, use `wss://` (secure WebSocket):

```javascript
const https = require('https');
const fs = require('fs');

const server = https.createServer({
    cert: fs.readFileSync('/path/to/cert.pem'),
    key: fs.readFileSync('/path/to/key.pem')
});

const wss = new WebSocket.Server({ server });
server.listen(443);
```

Then update WebMiner config:

```html
<script src="webminer.js" 
        data-pool="wss://your-proxy.example.com"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>
```

## Popular Mining Pools

### MoneroOcean (Best for WebMining)
- **Host**: `gulf.moneroocean.stream` or `pool.moneroocean.stream`
- **Ports**: 
  - 10001 (Auto-diff)
  - 10128 (128000 fixed diff)
  - 20001 / 20128 (SSL)
- **Features**: Auto coin-switching, high reliability

### SupportXMR
- **Host**: `pool.supportxmr.com`
- **Ports**:
  - 3333 (Low-end hardware)
  - 5555 (Mid-range)
  - 7777 (High-end)
  - 9000+ (SSL)

### Nanopool
- **Host**: `xmr-{region}.nanopool.org`
- **Ports**: 14444, 14433 (SSL)

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json proxy.js ./
RUN npm install --production
EXPOSE 8080
CMD ["node", "proxy.js"]
```

### Build and Run

```bash
docker build -t webminer-proxy .
docker run -d -p 8080:8080 --name proxy webminer-proxy
```

## Environment Variables

Make the proxy configurable:

```javascript
const WS_PORT = process.env.WS_PORT || 8080;
const POOL_HOST = process.env.POOL_HOST || 'gulf.moneroocean.stream';
const POOL_PORT = process.env.POOL_PORT || 10128;
```

Run with custom pool:

```bash
POOL_HOST=pool.supportxmr.com POOL_PORT=3333 node proxy.js
```

## Security Considerations

### 1. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');
// Limit each IP to 100 requests per minute
```

### 2. Origin Validation

```javascript
wss.on('connection', (ws, req) => {
    const origin = req.headers.origin;
    const allowedOrigins = ['https://yoursite.com'];
    
    if (!allowedOrigins.includes(origin)) {
        ws.close();
        return;
    }
    // ... rest of connection logic
});
```

### 3. Connection Limits

```javascript
let activeConnections = 0;
const MAX_CONNECTIONS = 1000;

wss.on('connection', (ws) => {
    if (activeConnections >= MAX_CONNECTIONS) {
        ws.close();
        return;
    }
    activeConnections++;
    
    ws.on('close', () => {
        activeConnections--;
    });
});
```

## Monitoring

### Log Mining Statistics

```javascript
let stats = {
    connections: 0,
    shares: 0,
    errors: 0
};

setInterval(() => {
    console.log('Stats:', stats);
}, 60000); // Every minute
```

## Troubleshooting

### Connection Fails Immediately

- **Check firewall**: Ensure TCP port to pool is open
- **Verify pool address**: Use `telnet pool.example.com 10128` to test
- **Check pool status**: Visit pool website to confirm it's online

### High Latency

- **Choose closer pool**: Use geographical region closest to your proxy
- **Reduce proxy overhead**: Minimize logging in production
- **Use pool's fastest port**: Smaller diff = fewer shares = less traffic

### WebSocket Drops

- **Implement ping/pong**: Keep connection alive
```javascript
ws.on('pong', () => {
    ws.isAlive = true;
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);
```

## Alternative: Public Proxy Services

⚠️ **Not recommended for production** - Use only for testing

If you don't want to host your own proxy, some public services exist (use at your own risk):
- Research current public WebSocket mining proxies
- Verify trustworthiness before using
- Never share your wallet's private keys

## Cost Estimates

### Self-Hosting

- **Small VPS**: $5-10/month (handles ~100 concurrent miners)
- **Medium server**: $20-40/month (handles ~1000 miners)
- **Large deployment**: Consider load balancing multiple proxies

### Bandwidth Usage

- **Per miner**: ~5-10 KB/s  
- **100 miners**: ~0.5-1.0 MB/s (2-4 GB/hour)
- **1000 miners**: ~5-10 MB/s (20-40 GB/hour)

---

**Next Steps**:
1. Set up your proxy following this guide
2. Test with local `ws://localhost:8080` connection  
3. Deploy to production with SSL (`wss://`)
4. Monitor performance and adjust pool/ports as needed

**Need Help?** Open an issue on the WebMiner GitHub repository with your proxy setup details.
