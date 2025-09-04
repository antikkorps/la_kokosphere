import type { APIRoute } from 'astro'
import { SITE_URL } from '../consts'
import { getPosts } from '../lib/sanity'

export const GET: APIRoute = async () => {
  // Pages statiques du site
  const staticPages = [
    {
      url: '',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/services',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/entreprise',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/rendez-vous',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/blog',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/testimonials',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ]

  try {
    // Récupérer les articles de blog dynamiques
    const posts = await getPosts()
    const blogPages = posts.map((post: any) => ({
      url: `/blog/${post.slug?.current}/`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }))

    // Combiner toutes les pages
    const allPages = [...staticPages, ...blogPages]

    // Générer le XML du sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback avec seulement les pages statiques
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
}