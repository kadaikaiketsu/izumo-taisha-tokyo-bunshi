// Google OAuth authentication routes

import { Hono } from 'hono';
import type { Bindings, GoogleUserInfo } from '../../lib/types';
import { createSession, deleteSession } from '../../lib/session';

const auth = new Hono<{ Bindings: Bindings }>();

// Login page
auth.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>管理画面ログイン | 出雲大社東京分祠</title>
        <link href="/admin/css/admin.css" rel="stylesheet">
    </head>
    <body class="login-page">
        <div class="login-container">
            <div class="login-card">
                <h1>出雲大社東京分祠</h1>
                <h2>管理画面</h2>
                <p class="login-description">
                    許可されたGoogleアカウントでログインしてください
                </p>
                <a href="/admin/auth/google" class="google-login-button">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Googleでログイン
                </a>
                <p class="login-note">
                    ※ 管理者アカウントのみアクセス可能です
                </p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Start OAuth flow
auth.get('/auth/google', (c) => {
  const redirectUri = `${new URL(c.req.url).origin}/admin/callback`;
  const clientId = c.env.GOOGLE_CLIENT_ID;
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'online');
  
  return c.redirect(authUrl.toString());
});

// OAuth callback
auth.get('/callback', async (c) => {
  const code = c.req.query('code');
  
  if (!code) {
    return c.redirect('/admin/login?error=no_code');
  }
  
  try {
    const redirectUri = `${new URL(c.req.url).origin}/admin/callback`;
    
    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const tokenData = await tokenResponse.json() as { access_token: string };
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }
    
    const user = await userResponse.json() as GoogleUserInfo;
    
    // Check if email is allowed
    const allowedEmails = c.env.ALLOWED_EMAILS.split(',').map(e => e.trim());
    
    if (!allowedEmails.includes(user.email)) {
      return c.html(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>アクセス拒否 | 出雲大社東京分祠</title>
            <link href="/admin/css/admin.css" rel="stylesheet">
        </head>
        <body class="error-page">
            <div class="error-container">
                <h1>❌ アクセス拒否</h1>
                <p>このアカウント（${user.email}）は管理画面へのアクセスが許可されていません。</p>
                <a href="/admin/login" class="button">ログイン画面に戻る</a>
            </div>
        </body>
        </html>
      `);
    }
    
    // Create session
    await createSession(c, {
      email: user.email,
      name: user.name,
      picture: user.picture,
    });
    
    return c.redirect('/admin/dashboard');
  } catch (error) {
    console.error('OAuth error:', error);
    return c.redirect('/admin/login?error=auth_failed');
  }
});

// Logout
auth.get('/logout', async (c) => {
  await deleteSession(c);
  return c.redirect('/admin/login');
});

export default auth;
