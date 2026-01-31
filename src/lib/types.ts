// Type definitions for CMS

export interface Bindings {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_TOKEN: string;
  SESSION_SECRET: string;
  ALLOWED_EMAILS: string;
}

export interface Session {
  email: string;
  name: string;
  picture: string;
}

export interface NewsItem {
  id?: number;
  date: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  pdf_url?: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}
