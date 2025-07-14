import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j41wv78y",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function testBlogPosts() {
  console.log("🧪 Test des articles de blog...\n")

  try {
    // Test 1: Récupérer tous les articles
    console.log("📋 Test 1: Récupération de tous les articles")
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        description,
        publishedAt,
        tags,
        "mainImage": mainImage.asset->{
          _ref,
          url
        },
        "author": author->{
          name,
          image
        }
      }
    `)

    console.log(`📊 ${posts.length} articles trouvés\n`)

    if (posts.length === 0) {
      console.log("❌ Aucun article trouvé")
      console.log("💡 Créez des articles dans Sanity Studio pour tester")
      return
    }

    // Afficher les détails de chaque article
    posts.forEach((post, index) => {
      console.log(`--- Article ${index + 1}: ${post.title} ---`)
      console.log(`Slug: ${post.slug}`)
      console.log(`URL: /blog/${post.slug}/`)
      console.log(`Date: ${new Date(post.publishedAt).toLocaleDateString("fr-FR")}`)
      console.log(`Tags: ${post.tags ? post.tags.join(", ") : "Aucun"}`)
      console.log(`Auteur: ${post.author ? post.author.name : "Non défini"}`)
      console.log(`Image: ${post.mainImage ? "✅" : "❌"}`)
      console.log("")
    })

    // Test 2: Vérifier un article spécifique
    if (posts.length > 0) {
      const firstPost = posts[0]
      console.log("📋 Test 2: Vérification d'un article spécifique")

      const specificPost = await client.fetch(
        `
        *[_type == "post" && slug.current == $slug][0] {
          _id,
          title,
          "slug": slug.current,
          description,
          publishedAt,
          tags,
          body
        }
      `,
        { slug: firstPost.slug }
      )

      if (specificPost) {
        console.log(`✅ Article trouvé: ${specificPost.title}`)
        console.log(`URL: /blog/${specificPost.slug}/`)
      } else {
        console.log(`❌ Article non trouvé pour le slug: ${firstPost.slug}`)
      }
    }

    console.log("\n✅ Test terminé")
    console.log("\n💡 Si les articles sont trouvés, les URLs devraient fonctionner :")
    posts.forEach((post) => {
      console.log(`   - /blog/${post.slug}/`)
    })
  } catch (error) {
    console.error("❌ Erreur lors du test:", error)
  }
}

testBlogPosts()
