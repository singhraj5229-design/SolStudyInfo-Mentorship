import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';

const app = new Hono();

// Serve static assets from ./dist. If a file isn't found, fall through
// to the SPA fallback below instead of returning a 404.
app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback: any route that doesn't match a static asset (and isn't
// an API route) should serve index.html so client-side routing works.
app.get("*", async (c) => {
  const p = c.req.path;
  if (p.startsWith("/_api")) {
    return c.notFound();
  }
  return serveStatic({ path: "./dist/index.html" })(c, async () => {
    c.status(404);
    return c.text("Not Found");
  });
});

const port = Number(process.env.PORT) || 3333;
serve({ fetch: app.fetch, port });
console.log(`Running on port ${port}`);
      
