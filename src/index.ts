import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings } from './lib/types'

// Import routes
import auth from './routes/admin/auth'
import dashboard from './routes/admin/dashboard'
import news from './routes/admin/news'
import api from './routes/api/news'

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Admin routes
app.route('/admin', auth)
app.route('/admin/dashboard', dashboard)
app.route('/admin/news', news)
app.route('/api/news', api)

// Serve static files (HTML, CSS, JS, images)
// IMPORTANT: Must use 'hono/cloudflare-workers' for Cloudflare Pages
// This will serve all files from the dist directory
app.use('/*', serveStatic())

export default app
