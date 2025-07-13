const fs = require('fs').promises;
const path = require('path');

// Configuration de conservation : 6 mois
const RETENTION_MONTHS = 6;

// Fonction pour nettoyer les anciens fichiers
async function cleanupOldStats() {
  const statsDir = path.join(process.cwd(), 'src', 'content', 'consent-stats');
  
  try {
    const files = await fs.readdir(statsDir);
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - RETENTION_MONTHS, now.getDate());
    
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.startsWith('stats-') && file.endsWith('.md')) {
        const filePath = path.join(statsDir, file);
        const stats = await fs.stat(filePath);
        
        // Supprimer les fichiers de plus de 6 mois
        if (stats.mtime < sixMonthsAgo) {
          await fs.unlink(filePath);
          deletedCount++;
          console.log(`Supprimé: ${file} (âge: ${Math.round((now - stats.mtime) / (1000 * 60 * 60 * 24))} jours)`);
        }
      }
    }
    
    if (deletedCount > 0) {
      console.log(`Nettoyage terminé: ${deletedCount} fichiers supprimés`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    return 0;
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const stats = JSON.parse(event.body);
    const { analytics, marketing, method, date, version } = stats;

    // Nettoyer les anciens fichiers (une fois par jour)
    const now = new Date();
    const shouldCleanup = now.getHours() === 0 && now.getMinutes() < 5; // Une fois par jour à minuit
    
    if (shouldCleanup) {
      await cleanupOldStats();
    }

    // Créer le contenu du fichier de statistiques
    const fileName = `stats-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const markdownContent = `---
date: ${date}
method: "${method}"
version: "${version}"
analytics: ${analytics}
marketing: ${marketing}
retentionPeriod: "6 mois"
---

# Statistiques de consentement

**Date:** ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR')}
**Méthode:** ${method}
**Version:** ${version}
**Durée de conservation:** 6 mois (conformité RGPD)

## Préférences
- **Cookies analytiques:** ${analytics ? '✅ Accepté' : '❌ Refusé'}
- **Cookies marketing:** ${marketing ? '✅ Accepté' : '❌ Refusé'}

## Note légale
Ces statistiques sont anonymes et seront automatiquement supprimées après 6 mois conformément au RGPD.
`;

    // Chemin vers le dossier stats
    const statsDir = path.join(process.cwd(), 'src', 'content', 'consent-stats');
    const filePath = path.join(statsDir, `${fileName}.md`);
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.mkdir(statsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }
    
    // Écrire le fichier
    await fs.writeFile(filePath, markdownContent, 'utf-8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Statistiques sauvegardées (conservation: 6 mois)',
        retentionPeriod: '6 mois'
      })
    };

  } catch (error) {
    console.error('Erreur lors de la sauvegarde des statistiques:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        message: 'Erreur lors de la sauvegarde'
      })
    };
  }
};
