import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  // Make .env.local values visible to the dev-only /api/ask route below.
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of ['GEMINI_API_KEY', 'GEMINI_MODEL']) if (env[k]) process.env[k] = env[k];

  return {
    build: {
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          notFound: resolve(import.meta.dirname, '404.html'),
        },
      },
    },
    plugins: [
      {
        // In production Vercel serves api/ask.js as a function; locally Vite does.
        name: 'dev-api',
        configureServer(server) {
          server.middlewares.use('/api/ask', async (req, res) => {
            const { default: handler } = await server.ssrLoadModule('/api/ask.js');
            return handler(req, res);
          });
          // dev-only: lets /scenes.html?og=1 save the generated link-preview images into public/
          server.middlewares.use('/__dev/save', async (req, res) => {
            const name = new URL(req.url, 'http://x').searchParams.get('name');
            const isShot = /^screen-[a-z]+\.png$/.test(name || '');
            if (req.method !== 'POST' || !(isShot || ['og-image.png', 'favicon.png'].includes(name))) {
              res.statusCode = 400;
              return res.end();
            }
            let body = '';
            for await (const chunk of req) body += chunk;
            const { writeFile, mkdir } = await import('node:fs/promises');
            const dir = resolve(import.meta.dirname, isShot ? 'docs' : 'public');
            await mkdir(dir, { recursive: true });
            await writeFile(resolve(dir, name), Buffer.from(body.split(',')[1], 'base64'));
            res.end('saved');
          });
        },
      },
    ],
  };
});
