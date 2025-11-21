const { createProxyMiddleware } = require('http-proxy-middleware');

const API_TARGET = 'http://web:3000';
// Use environment variables for the external API host/port, falling back to defaults
const API_EXTERNAL_HOST = process.env.REACT_APP_API_HOST || 'localhost';
const API_EXTERNAL_PORT = process.env.REACT_APP_API_PORT || '3000';

module.exports = function (app) {
  const paths = ['/api'];

  paths.forEach((p) => {
    app.use(
      p,
      createProxyMiddleware({
        target: API_TARGET,
        changeOrigin: true,
        ws: false,
        // Ensure the Origin header Rails sees matches the API target so
        // Rails' same-origin checks pass when proxying from the dev server.
        onProxyReq(proxyReq, req, res) {
          try {
            proxyReq.setHeader('origin', API_TARGET);
            // Forward the Rails API's external host so it generates correct URLs
            const forwardedHost = API_EXTERNAL_PORT === '80' || API_EXTERNAL_PORT === '443' 
              ? API_EXTERNAL_HOST 
              : `${API_EXTERNAL_HOST}:${API_EXTERNAL_PORT}`;
            proxyReq.setHeader('X-Forwarded-Host', forwardedHost);
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
            proxyReq.setHeader('X-Forwarded-Port', API_EXTERNAL_PORT);
          } catch (e) {
            // ignore
          }
        }
      })
    );
    // Log what we're proxying (visible in container logs)
    // eslint-disable-next-line no-console
    console.log(`[setupProxy] Proxy registered for ${p} -> ${API_TARGET}`);
  });
  
  // Note: /ws and /sockjs-node are used by webpack dev server for HMR
  // Do NOT intercept these paths or hot reloading will break
};
