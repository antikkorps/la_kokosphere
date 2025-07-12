import { glob } from "astro/loaders"
import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
    }),
})

const services = defineCollection({
  // Load Markdown files in the `src/content/services/` directory.
  loader: glob({ base: "./src/content/services", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      price: z.string().optional(),
      duration: z.string().optional(),
      image: image().optional(),
      order: z.number().optional(), // Ajout du champ order
    }),
})

const testimonials = defineCollection({
  // Load Markdown files in the `src/content/testimonials/` directory.
  loader: glob({ base: "./src/content/testimonials", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      clientName: z.string(),
      clientImage: image().optional(),
      testimonial: z.string(),
      rating: z.number().min(1).max(5),
      date: z.coerce.date(),
    }),
})

const pages = defineCollection({
  // Load Markdown files in the `src/content/pages/` directory.
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      heroImage: image().optional(),
    }),
})

const expertiseDomains = defineCollection({
  // Load Markdown files in the `src/content/expertise-domains/` directory.
  loader: glob({ base: "./src/content/expertise-domains", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.enum([
      "heart",
      "warning",
      "lightning",
      "check-circle",
      "moon",
      "star",
      "shield",
      "brain",
    ]),
    color: z.enum(["primary", "secondary"]),
    order: z.number(),
    anchor: z.string(),
  }),
})

export const collections = { blog, services, testimonials, pages, expertiseDomains }
