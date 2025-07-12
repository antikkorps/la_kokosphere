# Système de Couleurs Centralisé - La Kokosphère

## 🎨 Vue d'ensemble

Ce système de couleurs centralisé permet de gérer facilement la charte graphique du site. Toutes les couleurs sont définies dans `src/consts.ts` et peuvent être modifiées en un seul endroit.

## 📁 Structure des fichiers

```
src/
├── consts.ts              # Configuration centralisée des couleurs
├── components/
│   └── ColorTheme.astro   # Variables CSS globales
└── layouts/
    └── BaseLayout.astro   # Intégration du système de couleurs

tailwind.config.mjs        # Configuration Tailwind avec les couleurs
```

## 🎯 Utilisation

### 1. Couleurs dans les composants Astro

```astro
---
import { COLORS, COLOR_CLASSES } from '../consts';
---

<!-- Utilisation directe des couleurs -->
<div style={`background-color: ${COLORS.primary[600]}`}>
  Contenu
</div>

<!-- Utilisation des classes Tailwind -->
<div class={COLOR_CLASSES.primary.bg}>
  Bouton principal
</div>

<!-- Utilisation des classes CSS personnalisées -->
<div class="bg-gradient-primary text-light">
  Section avec gradient
</div>
```

### 2. Classes Tailwind disponibles

#### Couleurs primaires

- `bg-primary-50` à `bg-primary-900`
- `text-primary-50` à `text-primary-900`
- `border-primary-50` à `border-primary-900`

#### Couleurs secondaires

- `bg-secondary-50` à `bg-secondary-900`
- `text-secondary-50` à `text-secondary-900`
- `border-secondary-50` à `border-secondary-900`

#### Couleurs d'accent

- `bg-accent-success`, `text-accent-success`
- `bg-accent-warning`, `text-accent-warning`
- `bg-accent-error`, `text-accent-error`
- `bg-accent-info`, `text-accent-info`

#### Classes utilitaires personnalisées

- `bg-gradient-primary` - Gradient principal
- `bg-gradient-hero` - Gradient pour les sections hero
- `bg-gradient-card` - Gradient pour les cartes
- `bg-gradient-overlay` - Gradient d'overlay

### 3. Variables CSS disponibles

```css
/* Couleurs primaires */
--color-primary-50 à --color-primary-900

/* Couleurs secondaires */
--color-secondary-50 à --color-secondary-900

/* Couleurs d'accent */
--color-accent-success
--color-accent-warning
--color-accent-error
--color-accent-info

/* Gradients */
--gradient-primary
--gradient-hero
--gradient-card
--gradient-overlay
```

## 🔧 Modification des couleurs

### Changer une couleur spécifique

1. Ouvrir `src/consts.ts`
2. Modifier la valeur dans l'objet `COLORS`
3. Les changements se propagent automatiquement

```typescript
// Exemple : changer le bleu principal
export const COLORS = {
  primary: {
    600: "#1e40af", // Nouvelle couleur
    // ...
  },
  // ...
}
```

### Changer tout le thème

1. Modifier les couleurs dans `COLORS`
2. Mettre à jour les variables CSS dans `ColorTheme.astro`
3. Redémarrer le serveur de développement

### Ajouter de nouvelles couleurs

1. Ajouter dans `COLORS` dans `consts.ts`
2. Ajouter dans `tailwind.config.mjs`
3. Ajouter les variables CSS dans `ColorTheme.astro`

## 🎨 Thèmes prédéfinis

Le système inclut des variantes de thème dans `THEME_CONFIG` :

- **default** : Bleu/Violet (actuel)
- **calm** : Indigo/Violet/Vert
- **energetic** : Rouge/Orange/Jaune
- **professional** : Slate/Bleu

Pour changer de thème, modifier les valeurs dans `THEME_CONFIG.default`.

## 📱 Responsive et accessibilité

### Contraste

- Toutes les couleurs respectent les standards WCAG
- Les combinaisons texte/fond sont testées pour la lisibilité

### Responsive

- Les couleurs s'adaptent automatiquement aux différents écrans
- Pas de modification nécessaire pour le responsive

## 🚀 Bonnes pratiques

### ✅ À faire

- Utiliser les classes Tailwind quand possible
- Utiliser les variables CSS pour les cas spéciaux
- Tester les contrastes après modification
- Documenter les changements majeurs

### ❌ À éviter

- Définir des couleurs en dur dans les composants
- Utiliser des couleurs non définies dans le système
- Modifier les couleurs sans tester l'impact global

## 🔍 Debugging

### Problèmes courants

1. **Couleurs qui ne s'appliquent pas**

   - Vérifier que `ColorTheme.astro` est importé dans le layout
   - Redémarrer le serveur de développement

2. **Classes Tailwind manquantes**

   - Vérifier `tailwind.config.mjs`
   - Reconstruire les styles CSS

3. **Variables CSS non reconnues**
   - Vérifier la syntaxe dans `ColorTheme.astro`
   - S'assurer que le composant est bien importé

### Outils de debug

```javascript
// Dans la console du navigateur
console.log(
  getComputedStyle(document.documentElement).getPropertyValue("--color-primary-600")
)
```

## 📝 Maintenance

### Mise à jour régulière

- Vérifier la cohérence des couleurs
- Tester l'accessibilité
- Documenter les changements

### Versioning

- Taguer les versions de la charte graphique
- Maintenir un historique des changements
- Tester la régression visuelle

---

**Note** : Ce système est conçu pour être flexible et maintenable. Toute modification doit être testée sur l'ensemble du site pour s'assurer de la cohérence visuelle.
