// Script simple pour debugger les images
console.log("🔍 Debug des images Sanity...")

// Simuler une structure d'image typique de Sanity
const sampleImageBlock = {
  _type: "image",
  asset: {
    _ref: "image-abc123-def456-800x600-jpg",
    _type: "reference",
  },
  alt: "Description de l'image",
  caption: "Légende de l'image",
}

console.log("📸 Structure d'image typique:")
console.log(JSON.stringify(sampleImageBlock, null, 2))

// Test de construction d'URL
const projectId = "j41wv78y"
const dataset = "production"
const cleanRef = sampleImageBlock.asset._ref
  .replace("image-", "")
  .replace("-jpg", ".jpg")
  .replace("-png", ".png")
  .replace("-webp", ".webp")

const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${cleanRef}?w=1200&h=800&fit=crop&auto=format`

console.log("\n🔗 URL construite:")
console.log(imageUrl)
