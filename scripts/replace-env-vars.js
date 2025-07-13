import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Fonction pour remplacer les variables d'environnement
function replaceEnvVars(content) {
  return content
    .replace(/\${AUTH0_DOMAIN}/g, process.env.AUTH0_DOMAIN || "")
    .replace(/\${AUTH0_CLIENT_ID}/g, process.env.AUTH0_CLIENT_ID || "")
}

// Remplacer dans config.yml
const configPath = path.join(__dirname, "../public/admin/config.yml")
if (fs.existsSync(configPath)) {
  let config = fs.readFileSync(configPath, "utf8")
  config = replaceEnvVars(config)
  fs.writeFileSync(configPath, config)
  console.log("✅ Variables d'environnement remplacées dans config.yml")
}

// Remplacer dans index.html
const indexPath = path.join(__dirname, "../public/admin/index.html")
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, "utf8")
  index = replaceEnvVars(index)
  fs.writeFileSync(indexPath, index)
  console.log("✅ Variables d'environnement remplacées dans index.html")
}
