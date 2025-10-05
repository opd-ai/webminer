#!/usr/bin/env node

/**
 * WebSocket-to-Stratum Proxy for WebMiner
 * 
 * Bridges browser WebSocket connections to TCP Stratum mining pools
 * 
 * Usage:
 *   node proxy-server.js
 * 
 * With custom pool:
 *   POOL_HOST=gulf.moneroocean.stream POOL_PORT=10128 node proxy-server.js
 */

const WebSocket = require('ws');
const net = require('net');

// Configuration
const WS_PORT = process.env.WS_PORT || 8080;
const POOL_HOST = process.env.POOL_HOST || 'gulf.moneroocean.stream';
const POOL_PORT = parseInt(process.env.POOL_PORT || '10128');

// Statistics
const stats = {
    connections: 0,
    totalConnections: 0,
    shares: 0,
    errors: 0,
    startTime: Date.now()
};

// Create WebSocket server
const wss = new WebSocket.Server({ 
    port: WS_PORT,
    clientTracking: true
});

console.log('═══════════════════════════════════════════════════');
console.log('  WebMiner WebSocket-to-Stratum Proxy');
console.log('═══════════════════════════════════════════════════');
console.log(`  WebSocket: ws://localhost:${WS_PORT}`);
console.log(`  Pool: ${POOL_HOST}:${POOL_PORT}`);
console.log(`  Started: ${new Date().toISOString()}`);
console.log('═══════════════════════════════════════════════════\n');

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const connectionId = `${clientIp}-${Date.now()}`;
    
    stats.connections++;
    stats.totalConnections++;
    
    console.log(`[${new Date().toISOString()}] ✓ Browser connected: ${clientIp}`);
    console.log(`   Active connections: ${stats.connections}`);
    
    // Create TCP connection to mining pool
    const poolSocket = net.connect(POOL_PORT, POOL_HOST, () => {
        console.log(`[${new Date().toISOString()}] ✓ Connected to pool: ${POOL_HOST}:${POOL_PORT}`);
    });
    
    let buffer = '';
    
    // Forward WebSocket messages to pool
    ws.on('message', (data) => {
        try {
            const message = data.toString();
            console.log(`[${new Date().toISOString()}] → Browser → Pool:`, message.substring(0, 100) + (message.length > 100 ? '...' : ''));
            
            // Track shares
            if (message.includes('"method":"submit"')) {
                stats.shares++;
            }
            
            poolSocket.write(message + '\n');
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ✗ Error forwarding to pool:`, error.message);
            stats.errors++;
        }
    });
    
    // Forward pool messages to browser
    poolSocket.on('data', (data) => {
        try {
            buffer += data.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete line in buffer
            
            lines.forEach(line => {
                if (line.trim()) {
                    console.log(`[${new Date().toISOString()}] ← Pool → Browser:`, line.substring(0, 100) + (line.length > 100 ? '...' : ''));
                    ws.send(line);
                }
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] ✗ Error forwarding to browser:`, error.message);
            stats.errors++;
        }
    });
    
    // Handle browser disconnect
    ws.on('close', () => {
        stats.connections--;
        console.log(`[${new Date().toISOString()}] ✗ Browser disconnected: ${clientIp}`);
        console.log(`   Active connections: ${stats.connections}`);
        poolSocket.end();
    });
    
    // Handle pool disconnect
    poolSocket.on('close', () => {
        console.log(`[${new Date().toISOString()}] ✗ Pool disconnected`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });
    
    // Handle errors
    ws.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ✗ WebSocket error:`, error.message);
        stats.errors++;
    });
    
    poolSocket.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ✗ Pool connection error:`, error.message);
        stats.errors++;
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    });
    
    // Keep-alive ping/pong
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
});

// Periodic ping to keep connections alive
const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log(`[${new Date().toISOString()}] ✗ Connection timeout, terminating`);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 30000); // 30 seconds

// Statistics reporting
setInterval(() => {
    const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  Proxy Statistics');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Uptime: ${hours}h ${minutes}m`);
    console.log(`  Active connections: ${stats.connections}`);
    console.log(`  Total connections: ${stats.totalConnections}`);
    console.log(`  Shares submitted: ${stats.shares}`);
    console.log(`  Errors: ${stats.errors}`);
    console.log('═══════════════════════════════════════════════════\n');
}, 60000); // Every minute

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down proxy...');
    clearInterval(pingInterval);
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n\nShutting down proxy...');
    clearInterval(pingInterval);
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    stats.errors++;
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    stats.errors++;
});
