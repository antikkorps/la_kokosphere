#!/bin/bash

# Remplacer les variables d'environnement dans config.yml
if [ -f "public/admin/config.yml" ]; then
  sed -i "s/\${AUTH0_DOMAIN}/$AUTH0_DOMAIN/g" public/admin/config.yml
  sed -i "s/\${AUTH0_CLIENT_ID}/$AUTH0_CLIENT_ID/g" public/admin/config.yml
  echo "✅ Variables d'environnement remplacées dans config.yml"
fi

# Remplacer les variables d'environnement dans index.html
if [ -f "public/admin/index.html" ]; then
  sed -i "s/dev-xmogyv0r3a8jmews.eu.auth0.com/$AUTH0_DOMAIN/g" public/admin/index.html
  sed -i "s/Q1PWj5OIU0OTl2uh7Zkt7rkoVbtDgHNS/$AUTH0_CLIENT_ID/g" public/admin/index.html
  echo "✅ Variables d'environnement remplacées dans index.html"
fi 