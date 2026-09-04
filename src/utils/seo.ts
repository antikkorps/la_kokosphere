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

/**
 * Nettoie et tronque une méta-description.
 *
 * Les descriptions issues du CMS sont parfois extraites brutalement du premier
 * paragraphe : retours à la ligne, espaces multiples, coupure en milieu de
 * phrase. On normalise les blancs puis on tronque sur une limite de mot.
 */
export const META_DESCRIPTION_MAX_LENGTH = 155

export function normalizeDescription(
  description: string | undefined | null,
  fallback = "",
  maxLength = META_DESCRIPTION_MAX_LENGTH
): string {
  const cleaned = (description ?? "").replace(/\s+/g, " ").trim()
  const source = cleaned || fallback.replace(/\s+/g, " ").trim()

  if (source.length <= maxLength) return source

  // Couper au dernier séparateur de mot avant la limite, en gardant la place du "…"
  const truncated = source.slice(0, maxLength - 1)
  const lastBreak = truncated.lastIndexOf(" ")
  const base = lastBreak > maxLength * 0.6 ? truncated.slice(0, lastBreak) : truncated

  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`
}

/** Extrait un texte lisible d'un contenu Portable Text (repli de description). */
export function excerptFromPortableText(blocks: any[] | undefined | null): string {
  if (!Array.isArray(blocks)) return ""

  return blocks
    .filter((block) => block?._type === "block" && block.style === "normal")
    .flatMap((block) => (block.children ?? []).map((child: any) => child?.text ?? ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}
