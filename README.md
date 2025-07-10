# Site Web Hypnothérapie

Site web professionnel pour une hypnothérapeute, développé avec Astro, Tailwind CSS et Sanity.io.

## 🎯 Objectifs du projet

- **Présence en ligne professionnelle** : Site web moderne et rassurant
- **SEO optimisé** : Excellente visibilité sur les moteurs de recherche
- **Prise de rendez-vous fluide** : Intégration Calendly pour une expérience sans friction
- **Autonomie du client** : Gestion complète du contenu via Sanity Studio

## 🛠️ Stack Technique

- **Framework** : [Astro](https://astro.build/) - Performance et SEO optimisés
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) - Développement rapide et responsive
- **CMS** : [Sanity.io](https://www.sanity.io/) - Gestion de contenu headless
- **Prise de RDV** : [Calendly](https://calendly.com/) - Réservation en ligne
- **Hébergement** : Vercel/Netlify (déploiement continu)

## 📁 Structure du projet

```
la-kokosphere/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.astro     # Navigation principale
│   │   ├── Footer.astro     # Pied de page
│   │   ├── BaseHead.astro   # Métadonnées SEO
│   │   ├── LoadingSpinner.astro # Indicateur de chargement
│   │   ├── TestimonialCard.astro # Carte de témoignage
│   │   └── ServiceCard.astro # Carte de service
│   ├── pages/               # Pages du site
│   │   ├── index.astro      # Page d'accueil
│   │   ├── about.astro      # À propos
│   │   ├── services.astro   # Services et tarifs
│   │   ├── contact.astro    # Contact
│   │   └── rendez-vous.astro # Prise de RDV
│   ├── styles/
│   │   └── global.css       # Styles Tailwind
│   ├── types/
│   │   └── index.ts         # Types TypeScript
│   ├── utils/
│   │   ├── seo.ts           # Utilitaires SEO
│   │   └── icons.ts         # Gestion des icônes
│   └── consts.ts            # Constantes du site
├── public/                  # Assets statiques
├── astro.config.mjs         # Configuration Astro
├── tailwind.config.mjs      # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
└── package.json
```

## 🚀 Installation et développement

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd la-kokosphere

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:4321`

### Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
```

## 📝 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Sanity
SANITY_PROJECT_ID=votre-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Calendly
CALENDLY_URL=https://calendly.com/votre-calendly

# Site
SITE_URL=https://votre-domaine.com
```

### Personnalisation

1. **Informations du site** : Modifiez `src/consts.ts`
2. **Couleurs** : Personnalisez `tailwind.config.mjs`
3. **Contenu** : Utilisez Sanity Studio pour gérer le contenu
4. **Calendly** : Remplacez l'URL dans les constantes

## 🎨 Design System

### Couleurs

- **Primary** : Bleu (#0ea5e9) - Couleur principale
- **Secondary** : Rose (#d946ef) - Couleur d'accent
- **Gray** : Échelle de gris pour le texte et les fonds

### Typographie

- **Font principale** : Inter (Google Fonts)
- **Titres** : Font-weight 600-700
- **Corps** : Font-weight 400-500

### Composants

- **Boutons** : `.btn-primary`, `.btn-secondary`, `.btn-outline`
- **Sections** : `.section-padding`, `.container-max`
- **Responsive** : Mobile-first avec breakpoints Tailwind

### Composants réutilisables

- **LoadingSpinner** : Indicateur de chargement avec différentes tailles et couleurs
- **TestimonialCard** : Carte de témoignage avec notation et service associé
- **ServiceCard** : Carte de service avec icône, description et fonctionnalités
- **Icônes centralisées** : Gestion des icônes SVG via `src/utils/icons.ts`

## 📱 Pages du site

### 1. Page d'accueil (`/`)

- Hero section avec proposition de valeur
- Services principaux
- Témoignages clients
- Appels à l'action

### 2. À propos (`/about`)

- Présentation de la thérapeute
- Formation et qualifications
- Philosophie d'accompagnement
- Déroulement des séances

### 3. Services (`/services`)

- Domaines d'expertise détaillés
- Tarifs et forfaits
- Processus d'accompagnement

### 4. Contact (`/contact`)

- Informations de contact
- Formulaire de contact
- FAQ
- Horaires et localisation

### 5. Prise de rendez-vous (`/rendez-vous`)

- Widget Calendly intégré
- Informations pratiques
- Questions fréquentes

## 🔧 Intégrations

### Sanity.io

Pour configurer Sanity :

1. Créer un projet sur [sanity.io](https://www.sanity.io/)
2. Installer Sanity CLI : `npm install -g @sanity/cli`
3. Initialiser le studio : `sanity init`
4. Configurer les schémas de contenu
5. Déployer : `sanity deploy`

### Calendly

1. Créer un compte [Calendly](https://calendly.com/)
2. Configurer les types de rendez-vous
3. Récupérer l'URL d'intégration
4. Mettre à jour `CALENDLY_URL` dans les constantes

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Netlify

1. Connecter le repo GitHub à Netlify
2. Configurer le build command : `npm run build`
3. Configurer le publish directory : `dist`
4. Ajouter les variables d'environnement

## 📊 SEO

Le site est optimisé pour le SEO avec :

- **Métadonnées** : Titres et descriptions personnalisés
- **Sitemap** : Génération automatique
- **Balises sémantiques** : HTML5 structuré
- **Performance** : Optimisation des images et du code
- **Mobile-first** : Design responsive

## 🔧 Améliorations techniques

### Variables d'environnement

Le projet utilise maintenant les variables d'environnement pour une configuration flexible :

```env
# Sanity
SANITY_PROJECT_ID=votre-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Calendly
CALENDLY_URL=https://calendly.com/votre-calendly

# Site
SITE_URL=https://votre-domaine.com
SITE_EMAIL=contact@votre-domaine.com
SITE_PHONE=+33 1 23 45 67 89
SITE_ADDRESS=Votre adresse
```

### TypeScript

- **Types stricts** : Configuration TypeScript optimisée avec vérifications strictes
- **Alias de chemins** : Import simplifié avec `@/components/*`, `@/utils/*`, etc.
- **Types centralisés** : Définitions de types dans `src/types/index.ts`

### SEO et Performance

- **Utilitaires SEO** : Fonctions pour générer les métadonnées et données structurées
- **Optimisation des images** : Intégration Sharp pour le traitement d'images
- **Lazy loading** : Chargement différé des composants non critiques

## 🔒 Sécurité

- Validation des formulaires côté client et serveur
- Protection CSRF
- Headers de sécurité
- HTTPS obligatoire en production

## 📈 Analytics

Intégration recommandée :

- **Google Analytics 4** : Suivi des visiteurs
- **Google Search Console** : Performance SEO
- **Hotjar** : Analyse du comportement utilisateur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :

- **Email** : contact@votre-domaine.com
- **Documentation** : [Lien vers la documentation]
- **Issues** : [GitHub Issues]

---

**Développé avec ❤️ pour les professionnels de l'hypnothérapie**
