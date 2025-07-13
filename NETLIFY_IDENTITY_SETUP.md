# Configuration Netlify Identity

## Vue d'ensemble

Cette configuration utilise Netlify Identity pour l'authentification du CMS Decap CMS, remplaçant Auth0 pour une solution plus simple et intégrée.

## Configuration

### 1. Activation de Netlify Identity

Exécutez le script de configuration :

```bash
./scripts/setup-identity.sh
```

Ou manuellement :

```bash
# Installer Netlify CLI si nécessaire
npm install -g netlify-cli

# Activer Identity
netlify addons:enable identity
```

### 2. Création du premier utilisateur

Via le dashboard Netlify :

1. Allez dans votre site sur Netlify
2. Onglet "Identity"
3. Cliquez sur "Invite users" ou "Sign up"

Via CLI :

```bash
netlify identity:signup
```

### 3. Configuration du site

Le fichier `public/admin/index.html` contient :

- Interface de connexion Netlify Identity
- Chargement automatique de Decap CMS après authentification
- Gestion des états de connexion/déconnexion

### 4. Fichiers de configuration

- `public/admin/config.yml` : Configuration Decap CMS avec `auth_endpoint: auth`
- `public/_redirects` : Redirections pour Identity et admin
- `netlify.toml` : Configuration des redirections Identity

## Utilisation

1. Accédez à `/admin` sur votre site
2. Cliquez sur "Se connecter"
3. Utilisez vos identifiants Netlify Identity
4. Decap CMS se charge automatiquement

## Avantages

- ✅ Intégration native avec Netlify
- ✅ Pas de configuration complexe d'Auth0
- ✅ Gestion des utilisateurs via dashboard Netlify
- ✅ Pas de secrets à gérer
- ✅ Fonctionne immédiatement après activation

## Dépannage

### Problème de redirection

Vérifiez que le fichier `_redirects` est bien déployé et contient les bonnes redirections.

### Problème d'authentification

1. Vérifiez qu'Identity est activé dans le dashboard Netlify
2. Vérifiez que vous avez créé au moins un utilisateur
3. Vérifiez les logs dans la console du navigateur

### Problème de chargement CMS

1. Vérifiez que `config.yml` est accessible
2. Vérifiez que les redirections admin fonctionnent
3. Vérifiez les erreurs dans la console du navigateur
