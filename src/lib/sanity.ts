import { createClient } from "@sanity/client"

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false, // `false` if you want to ensure fresh data
})

// Fonction utilitaire pour construire l'URL d'une image Sanity
export function getSanityImageUrl(imageRef: string, width = 800, height = 600): string {
  if (!imageRef) return ""

  // Nettoyer la référence
  const cleanRef = imageRef
    .replace("image-", "")
    .replace("-jpg", ".jpg")
    .replace("-png", ".png")
    .replace("-webp", ".webp")

  return `https://cdn.sanity.io/images/${
    process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y"
  }/${
    process.env.SANITY_STUDIO_DATASET || "production"
  }/${cleanRef}?w=${width}&h=${height}&fit=crop&auto=format`
}

// Types pour les données Sanity
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  description: string
  publishedAt: string
  mainImage?: {
    _ref: string
    url: string
  }
  tags?: string[]
  body: any[]
  author?: {
    name: string
    image?: {
      asset: {
        _ref: string
      }
    }
    bio?: any[]
  }
}

export interface Service {
  _id: string
  title: string
  description: string
  image?: {
    type: "upload" | "url"
    uploadedImage?: {
      _ref: string
      url?: string
    }
    externalUrl?: string
    altText?: string
  }
  price?: string
  duration?: string
  order?: number
  body: any[]
}

export interface Testimonial {
  _id: string
  clientName: string
  avatarType: string
  avatarSeed?: string
  testimonial: string
  rating: number
  date: string
  order?: number
}

export interface ExpertiseDomain {
  _id: string
  title: string
  description: string
  icon:
    | "heart"
    | "warning"
    | "lightning"
    | "check-circle"
    | "moon"
    | "star"
    | "shield"
    | "brain"
  color: "primary" | "secondary"
  order: number
  anchor: string
  body: any[]
}

export interface LegalDocument {
  _id: string
  title: string
  type: "insurance" | "diploma" | "certification" | "other"
  description?: string
  file: {
    asset: {
      _ref: string
      url: string
    }
  }
  validUntil?: string
  isPublic: boolean
  order: number
}

export interface ConsentStats {
  _id: string
  date: string
  totalConsents: number
  analyticsConsents: number
  marketingConsents: number
  necessaryConsents: number
}

export interface Kokosphere {
  _id: string
  title: string
  subtitle: string
  intro: string
  hypnoseDescription?: string
  workDescription: string
  workBenefits: string[]
  autoHypnoseDescription: string
  whyChooseDescription: string
  approachDescription: string
  conclusion: string
  isActive: boolean
  lastUpdated: string
}

// Fonction pour récupérer tous les articles
export async function getPosts(): Promise<Post[]> {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      publishedAt,
      "mainImage": mainImage.asset->{
        _ref,
        url
      },
      tags,
      body,
      "author": author->{
        name,
        image,
        bio
      }
    }
  `)
}

// Fonction pour récupérer un article par slug
export async function getPost(slug: string): Promise<Post | null> {
  return await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      publishedAt,
      "mainImage": mainImage.asset->{
        _ref,
        url
      },
      tags,
      body,
      "author": author->{
        name,
        image,
        bio
      }
    }
  `,
    { slug }
  )
}

// Fonction pour récupérer tous les services
export async function getServices(): Promise<Service[]> {
  return await client.fetch(`
    *[_type == "service"] | order(order asc) {
      _id,
      title,
      description,
      price,
      duration,
      order,
      image,
      body
    }
  `)
}

// Fonction pour récupérer tous les témoignages
export async function getTestimonials(): Promise<Testimonial[]> {
  return await client.fetch(`
    *[_type == "testimonial"] | order(order asc, date desc) {
      _id,
      clientName,
      avatarType,
      avatarSeed,
      testimonial,
      rating,
      date,
      order
    }
  `)
}

// Fonction pour récupérer tous les domaines d'expertise
export async function getExpertiseDomains(): Promise<ExpertiseDomain[]> {
  return await client.fetch(`
    *[_type == "expertiseDomain"] | order(order asc) {
      _id,
      title,
      description,
      icon,
      color,
      order,
      anchor,
      body
    }
  `)
}

// Fonction pour récupérer tous les documents légaux publics
export async function getLegalDocuments(): Promise<LegalDocument[]> {
  return await client.fetch(`
    *[_type == "legalDocument" && isPublic == true] | order(order asc) {
      _id,
      title,
      type,
      description,
      file {
        asset-> {
          _ref,
          url
        }
      },
      validUntil,
      isPublic,
      order
    }
  `)
}

// Fonction pour récupérer les données de la Kokosphere
export async function getKokosphere(): Promise<Kokosphere | null> {
  return await client.fetch(`
    *[_type == "kokosphere" && isActive == true][0] {
      _id,
      title,
      subtitle,
      intro,
      hypnoseDescription,
      workDescription,
      workBenefits,
      autoHypnoseDescription,
      whyChooseDescription,
      approachDescription,
      conclusion,
      isActive,
      lastUpdated
    }
  `)
}

// Fonction pour sauvegarder les statistiques de consentement
export async function saveConsentStats(consentData: {
  analytics: boolean
  marketing: boolean
  necessary: boolean
  method: string
  ip?: string
  userAgent?: string
}) {
  // Calculer la date d'expiration (6 mois)
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 6)

  return await client.create({
    _type: "consentStats",
    date: new Date().toISOString(),
    ip: consentData.ip || "anonymisé",
    userAgent: consentData.userAgent || "anonymisé",
    method: consentData.method,
    consentChoices: {
      necessary: true, // Toujours true
      analytics: consentData.analytics,
      marketing: consentData.marketing,
    },
    expiresAt: expiresAt.toISOString(),
  })
}
