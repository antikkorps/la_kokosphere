// Types pour les services
export interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: "primary" | "secondary"
  features: string[]
  price?: string
  duration?: string
}

// Types pour les témoignages
export interface Testimonial {
  id: string
  content: string
  author: string
  rating: number
  service?: string
  date: string
}

// Types pour les articles de blog
export interface BlogPost {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishDate: string
  tags: string[]
  image?: string
  slug: string
}

// Types pour les informations de contact
export interface ContactInfo {
  email: string
  phone: string
  address: string
  hours: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}

// Types pour les variables d'environnement
export interface Env {
  SANITY_PROJECT_ID: string
  SANITY_DATASET: string
  SANITY_API_VERSION: string
  CALENDLY_URL: string
  SITE_URL: string
  SITE_EMAIL?: string
  SITE_PHONE?: string
  SITE_ADDRESS?: string
}
