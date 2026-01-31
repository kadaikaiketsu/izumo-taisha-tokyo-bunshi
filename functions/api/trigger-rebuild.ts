/**
 * Cloudflare Pages Functions: Trigger rebuild after news creation
 * This function triggers a Cloudflare Pages deployment via webhook
 */

interface Env {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = context.env;
    
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
      return new Response('Missing configuration', { status: 500 });
    }
    
    // Trigger Cloudflare Pages deployment
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/izumo-taisha-tokyo-bunshi/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: 'main'
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${await response.text()}`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
