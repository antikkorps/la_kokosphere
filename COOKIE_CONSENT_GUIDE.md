# 🍪 Guide de gestion des consentements cookies

## Vue d'ensemble

Ce système permet de :

- ✅ **Enregistrer les choix des utilisateurs** de manière anonyme
- ✅ **Respecter le RGPD** avec une durée de conservation de 6 mois
- ✅ **Nettoyer automatiquement** les données expirées
- ✅ **Visualiser les statistiques** dans Sanity Studio

## 📊 Données collectées

### Informations anonymisées :

- **Date du consentement** (obligatoire)
- **Méthode de consentement** (bannière, paramètres, rechargement)
- **Choix de l'utilisateur** (analytics, marketing)
- **Date d'expiration** (automatique, 6 mois)

### Informations NON collectées :

- ❌ Adresse IP complète
- ❌ User Agent complet
- ❌ Données personnelles

## 🔧 Configuration

### Variables d'environnement requises :

```bash
# Dans Netlify
SANITY_TOKEN=your_sanity_write_token
CLEANUP_SECRET=your_secret_for_cleanup_function
```

### Token Sanity :

1. Aller sur https://www.sanity.io/manage
2. Sélectionner votre projet
3. Aller dans "API" > "Tokens"
4. Créer un token avec permissions d'écriture

## 📈 Visualisation dans Sanity Studio

### Accès aux données :

1. Ouvrir Sanity Studio
2. Aller dans "Statistiques de consentement cookies"
3. Voir tous les consentements avec :
   - Date et heure
   - Méthode de consentement
   - Choix de l'utilisateur
   - Date d'expiration

### Filtres disponibles :

- **Par date** (nouveau/ancien en premier)
- **Par méthode** (bannière, paramètres, rechargement)
- **Par choix** (analytics, marketing)

## 🧹 Nettoyage automatique

### Fonctionnement :

- **Fréquence** : Tous les jours à 2h du matin
- **Action** : Suppression des consentements expirés (> 6 mois)
- **Sécurité** : Authentification par secret

### Configuration du cron job Netlify :

1. Aller dans le dashboard Netlify
2. Functions > Scheduled Functions
3. Créer un nouveau cron job :
   - **URL** : `/api/cleanup-consent-stats`
   - **Fréquence** : `0 2 * * *` (tous les jours à 2h)
   - **Headers** : `Authorization: Bearer YOUR_CLEANUP_SECRET`

### Nettoyage manuel :

```bash
# Voir les statistiques
node scripts/cleanup-consent-stats.js stats

# Nettoyer (mode développement - simulation)
node scripts/cleanup-consent-stats.js

# Nettoyer (mode production - suppression réelle)
NODE_ENV=production node scripts/cleanup-consent-stats.js
```

## 📊 Statistiques utiles

### Questions fréquentes :

- **Combien d'utilisateurs acceptent les analytics ?**
- **Quelle méthode de consentement est la plus utilisée ?**
- **Combien de consentements expirent chaque jour ?**

### Requêtes GROQ utiles :

```groq
// Consentements des 30 derniers jours
*[_type == "consentStats" && date > $lastMonth] {
  date,
  method,
  consentChoices
}

// Taux d'acceptation analytics
{
  "total": count(*[_type == "consentStats"]),
  "analytics": count(*[_type == "consentStats" && consentChoices.analytics == true]),
  "rate": round(count(*[_type == "consentStats" && consentChoices.analytics == true]) * 100.0 / count(*[_type == "consentStats"]), 1)
}
```

## 🔒 Conformité RGPD

### Points de conformité :

- ✅ **Consentement explicite** (bannière + modal détaillée)
- ✅ **Durée limitée** (6 mois maximum)
- ✅ **Données anonymisées** (pas d'IP complète)
- ✅ **Droit à l'oubli** (suppression automatique)
- ✅ **Transparence** (explication claire des cookies)

### Actions recommandées :

1. **Vérifier régulièrement** les statistiques dans Sanity Studio
2. **Tester le nettoyage** mensuellement
3. **Documenter les procédures** pour l'audit RGPD

## 🚨 Dépannage

### Problèmes courants :

**Les consentements ne s'enregistrent pas :**

- Vérifier le token Sanity
- Vérifier les permissions du token
- Vérifier la connexion réseau

**Le nettoyage ne fonctionne pas :**

- Vérifier le CLEANUP_SECRET
- Vérifier la configuration du cron job
- Vérifier les logs Netlify

**Erreurs dans Sanity Studio :**

- Vérifier que le schéma est bien publié
- Vérifier les permissions utilisateur
- Vérifier la version de Sanity Studio

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs Netlify
2. Tester avec les scripts de debug
3. Consulter la documentation Sanity
4. Contacter le support si nécessaire
