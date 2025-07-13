#!/bin/bash

echo "Configuration de Netlify Identity..."

# Vérifier si netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI n'est pas installé. Installation..."
    npm install -g netlify-cli
fi

# Activer Netlify Identity
echo "Activation de Netlify Identity..."
netlify addons:enable identity

# Configurer les paramètres d'Identity
echo "Configuration des paramètres Identity..."
netlify api updateSite --data '{
  "identity": {
    "enabled": true,
    "invite_only": false,
    "external_enabled": false,
    "external_providers": []
  }
}'

echo "Netlify Identity configuré !"
echo ""
echo "Prochaines étapes :"
echo "1. Allez sur votre dashboard Netlify"
echo "2. Dans l'onglet 'Identity', créez votre premier utilisateur"
echo "3. Ou utilisez la commande : netlify identity:signup"
echo ""
echo "Pour créer un utilisateur via CLI :"
echo "netlify identity:signup" 