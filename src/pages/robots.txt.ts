import type { APIRoute } from 'astro'
import { SITE_URL } from '../consts'

export const GET: APIRoute = () => {
  const robotsTxt = `User-agent: *
Allow: /

# Désautoriser les pages d'administration et de gestion
Disallow: /admin
Disallow: /admin/*
Disallow: /_astro/
Disallow: /api/
Disallow: /netlify/

# Autoriser spécifiquement les pages importantes
Allow: /
Allow: /services
Allow: /entreprise
Allow: /about
Allow: /contact
Allow: /rendez-vous
Allow: /blog
Allow: /blog/*

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay pour éviter la surcharge
Crawl-delay: 1`

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}