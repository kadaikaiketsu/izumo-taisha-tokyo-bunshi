// Session management utilities

import { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { Session, Bindings } from './types';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(c: Context<{ Bindings: Bindings }>, session: Session): Promise<void> {
  const sessionData = JSON.stringify(session);
  const encoded = btoa(sessionData);
  
  setCookie(c, SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  });
}

export async function getSession(c: Context<{ Bindings: Bindings }>): Promise<Session | null> {
  const sessionCookie = getCookie(c, SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const decoded = atob(sessionCookie);
    return JSON.parse(decoded) as Session;
  } catch {
    return null;
  }
}

export async function deleteSession(c: Context<{ Bindings: Bindings }>): Promise<void> {
  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: '/'
  });
}

export async function requireAuth(c: Context<{ Bindings: Bindings }>): Promise<Session | Response> {
  const session = await getSession(c);
  
  if (!session) {
    return c.redirect('/admin/login');
  }
  
  const allowedEmails = c.env.ALLOWED_EMAILS.split(',').map(e => e.trim());
  
  if (!allowedEmails.includes(session.email)) {
    return c.redirect('/admin/login');
  }
  
  return session;
}
