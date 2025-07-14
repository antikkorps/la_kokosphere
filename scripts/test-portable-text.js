import { getPosts } from "../src/lib/sanity.js"

async function testPortableText() {
  try {
    console.log("🔍 Test de récupération des articles...")
    const posts = await getPosts()

    if (posts.length === 0) {
      console.log("❌ Aucun article trouvé")
      return
    }

    const firstPost = posts[0]
    console.log("✅ Article trouvé:", firstPost.title)
    console.log("📝 Structure du body:")
    console.log(JSON.stringify(firstPost.body, null, 2))

    // Analyser la structure
    if (firstPost.body && Array.isArray(firstPost.body)) {
      console.log("\n🔍 Analyse des blocs:")
      firstPost.body.forEach((block, index) => {
        console.log(`\n--- Bloc ${index + 1} ---`)
        console.log("Type:", block._type)
        console.log("Style:", block.style)
        console.log("Children:", block.children?.length || 0)

        if (block.children) {
          block.children.forEach((child, childIndex) => {
            console.log(`  Enfant ${childIndex + 1}:`, {
              text: child.text?.substring(0, 50) + "...",
              marks: child.marks,
            })
          })
        }
      })
    }
  } catch (error) {
    console.error("❌ Erreur:", error)
  }
}

testPortableText()
