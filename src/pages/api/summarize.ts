import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { getCollection } from 'astro:content';

export const prerender = false;

// In-memory cache so we only call Claude once per slug per server session
const cache = new Map<string, string>();

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== 'string') {
      return json({ error: 'Missing slug' }, 400);
    }

    if (cache.has(slug)) {
      return json({ summary: cache.get(slug) });
    }

    const posts = await getCollection('posts');
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return json({ error: 'Post not found' }, 404);
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500);
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are summarizing a blog post for a reader who wants to quickly grasp the key ideas.

Summarize the following blog post in exactly 3–5 bullet points. Each bullet must be one clear, specific sentence. No intro, no outro — just the bullets, one per line, each starting with "•".

Blog post:
${post.body}`,
      }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    cache.set(slug, raw);

    return json({ summary: raw });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[summarize]', msg);
    return json({ error: msg }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
