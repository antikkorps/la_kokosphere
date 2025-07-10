import type { ImageMetadata } from "astro"

export interface SEOProps {
  title: string
  description: string
  image?: ImageMetadata
  canonical?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

export function generateSEOTags(props: SEOProps) {
  const {
    title,
    description,
    image,
    canonical,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    tags = [],
  } = props

  const metaTags = [
    // Primary Meta Tags
    { name: "title", content: title },
    { name: "description", content: description },

    // Open Graph / Facebook
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },

    // Twitter
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
  ]

  // Add optional meta tags
  if (image) {
    metaTags.push(
      { property: "og:image", content: image.src },
      { property: "twitter:image", content: image.src }
    )
  }

  if (canonical) {
    metaTags.push({ property: "og:url", content: canonical })
  }

  if (type === "article") {
    if (publishedTime) {
      metaTags.push({ property: "article:published_time", content: publishedTime })
    }
    if (modifiedTime) {
      metaTags.push({ property: "article:modified_time", content: modifiedTime })
    }
    if (author) {
      metaTags.push({ property: "article:author", content: author })
    }
    tags.forEach((tag) => {
      metaTags.push({ property: "article:tag", content: tag })
    })
  }

  return metaTags
}

export function generateStructuredData(
  type: "website" | "article" | "organization",
  data: any
) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  }

  return {
    ...baseData,
    ...data,
  }
}
