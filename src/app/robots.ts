import type { MetadataRoute } from 'next';

const DISALLOWED_PATHS = [
  '/admin/',
  '/api/',
  '/login',
  '/register',
  '/cart',
  '/checkout',
  '/pesanan',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        // Google Search & Google AI Overviews
        userAgent: 'Googlebot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        // Google Gemini & AI grounding crawler
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        // OpenAI / ChatGPT Search
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        // Perplexity AI Search
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
      {
        // Anthropic Claude Search
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: 'https://rewangdesa.com/sitemap.xml',
    host: 'https://rewangdesa.com',
  };
}
