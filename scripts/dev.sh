#!/bin/bash

# Script pour lancer Astro et Sanity Studio en parallèle
echo "🚀 Lancement d'Astro et Sanity Studio..."

# Vérifier si les dossiers existent
if [ ! -d "studio-sanity" ]; then
    echo "❌ Erreur: Le dossier studio-sanity n'existe pas"
    exit 1
fi

# Fonction pour nettoyer les processus à la sortie
cleanup() {
    echo "🛑 Arrêt des serveurs..."
    kill $ASTRO_PID $SANITY_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C pour nettoyer
trap cleanup SIGINT

# Lancer Astro en arrière-plan
echo "📱 Lancement d'Astro (http://localhost:4321)..."
npm run dev &
ASTRO_PID=$!

# Attendre un peu
sleep 2

# Lancer Sanity Studio en arrière-plan
echo "🎨 Lancement de Sanity Studio (http://localhost:3333)..."
cd studio-sanity && npm run dev &
SANITY_PID=$!

# Revenir au dossier racine
cd ..

echo "✅ Les deux serveurs sont lancés !"
echo "📱 Astro: http://localhost:4321"
echo "🎨 Sanity Studio: http://localhost:3333"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre que les processus se terminent
wait 