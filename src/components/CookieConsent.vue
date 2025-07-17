<template>
  <Transition name="cookie-banner">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
    >
      <div class="container-max py-6 px-4">
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <!-- Contenu principal -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              🍪 Nous utilisons des cookies
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site,
              analyser le trafic et personnaliser le contenu. En continuant à naviguer,
              vous acceptez notre utilisation des cookies.
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              @click="acceptAll"
              class="btn-primary text-sm px-6 py-2 whitespace-nowrap"
            >
              Accepter tous les cookies
            </button>
            <button
              @click="acceptEssential"
              class="btn-outline text-sm px-6 py-2 whitespace-nowrap"
            >
              Cookies essentiels uniquement
            </button>
            <button
              @click="openPreferences"
              class="text-gray-500 hover:text-gray-700 text-sm px-6 py-2 whitespace-nowrap transition-colors"
            >
              Personnaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal des préférences -->
  <Transition name="modal">
    <div
      v-if="showPreferences"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="closePreferences"
      ></div>

      <!-- Modal -->
      <div
        class="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-8">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Préférences de cookies</h2>
            <button
              @click="closePreferences"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Types de cookies -->
          <div class="space-y-6">
            <!-- Cookies essentiels -->
            <div class="border border-gray-200 rounded-lg p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Cookies essentiels
                  </h3>
                  <p class="text-gray-600 text-sm">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent
                    pas être désactivés.
                  </p>
                </div>
                <div class="flex items-center">
                  <div
                    class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Session et authentification</li>
                <li>• Préférences de langue</li>
                <li>• Sécurité du site</li>
              </ul>
            </div>

            <!-- Cookies analytiques -->
            <div class="border border-gray-200 rounded-lg p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Cookies analytiques
                  </h3>
                  <p class="text-gray-600 text-sm">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site.
                  </p>
                </div>
                <div class="flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="preferences.analytics"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                    ></div>
                  </label>
                </div>
              </div>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Statistiques de visite</li>
                <li>• Pages les plus consultées</li>
                <li>• Temps passé sur le site</li>
              </ul>
            </div>

            <!-- Cookies marketing -->
            <div class="border border-gray-200 rounded-lg p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Cookies marketing
                  </h3>
                  <p class="text-gray-600 text-sm">
                    Ces cookies sont utilisés pour vous proposer du contenu personnalisé.
                  </p>
                </div>
                <div class="flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="preferences.marketing"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                    ></div>
                  </label>
                </div>
              </div>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Publicités personnalisées</li>
                <li>• Contenu recommandé</li>
                <li>• Suivi des conversions</li>
              </ul>
            </div>
          </div>

          <!-- Note sur la conservation -->
          <div class="text-xs text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
            <p><strong>Durée de conservation :</strong> 6 mois maximum</p>
            <p>
              Vos préférences sont conservées localement et des statistiques anonymes sont
              sauvegardées pour 6 mois conformément au RGPD.
            </p>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button @click="savePreferences" class="btn-primary px-6 py-3">
              Sauvegarder mes préférences
            </button>
            <button @click="acceptAll" class="btn-outline px-6 py-3">
              Accepter tous les cookies
            </button>
            <button
              @click="acceptEssential"
              class="text-gray-500 hover:text-gray-700 px-6 py-3 transition-colors"
            >
              Refuser tous (sauf essentiels)
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

// État du composant
const showBanner = ref(false)
const showPreferences = ref(false)
const preferences = ref({
  analytics: false,
  marketing: false,
})

// Vérifier si le consentement a déjà été donné
const hasConsent = () => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("cookie-consent") !== null
}

// Envoyer des statistiques anonymes
const sendConsentStats = async (consent: any) => {
  try {
    const response = await fetch("/.netlify/functions/consent-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        analytics: consent.analytics,
        marketing: consent.marketing,
        necessary: consent.necessary,
        method: consent.method || "banner",
      }),
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ Statistiques de consentement envoyées à Sanity")
    } else {
      console.error("❌ Erreur lors de l'envoi:", result.error)
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi des statistiques:", error)
    // Ne pas bloquer l'utilisateur si ça échoue
  }
}

// Accepter tous les cookies
const acceptAll = () => {
  const consent = {
    necessary: true,
    analytics: true,
    marketing: true,
    method: "banner",
    date: new Date().toISOString(),
  }

  // Sauvegarder localement (pour l'utilisateur)
  localStorage.setItem("cookie-consent", JSON.stringify(consent))

  // Envoyer des statistiques anonymes (pour vous)
  sendConsentStats(consent)

  showBanner.value = false
  showPreferences.value = false

  // Émettre un événement pour informer l'application
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }))
}

// Accepter seulement les cookies essentiels
const acceptEssential = () => {
  const consent = {
    necessary: true,
    analytics: false,
    marketing: false,
    method: "banner",
    date: new Date().toISOString(),
  }

  localStorage.setItem("cookie-consent", JSON.stringify(consent))
  sendConsentStats(consent)

  showBanner.value = false
  showPreferences.value = false

  // Émettre un événement pour informer l'application
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }))
}

// Ouvrir les préférences
const openPreferences = () => {
  showPreferences.value = true
}

// Fermer les préférences
const closePreferences = () => {
  showPreferences.value = false
}

// Sauvegarder les préférences personnalisées
const savePreferences = () => {
  const consent = {
    necessary: true,
    analytics: preferences.value.analytics,
    marketing: preferences.value.marketing,
    method: "modal",
    date: new Date().toISOString(),
  }

  localStorage.setItem("cookie-consent", JSON.stringify(consent))
  sendConsentStats(consent)

  showBanner.value = false
  showPreferences.value = false

  // Émettre un événement pour informer l'application
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }))
}

// Initialisation
onMounted(() => {
  // Afficher la bannière si aucun consentement n'a été donné
  if (!hasConsent()) {
    // Attendre un peu pour que la page se charge
    setTimeout(() => {
      showBanner.value = true
    }, 1000)
  }

  // Charger les préférences existantes si elles existent
  const existingConsent = localStorage.getItem("cookie-consent")
  if (existingConsent) {
    try {
      const consent = JSON.parse(existingConsent)
      preferences.value.analytics = consent.analytics || false
      preferences.value.marketing = consent.marketing || false
    } catch (e) {
      console.error("Erreur lors du chargement des préférences de cookies:", e)
    }
  }

  // Écouter l'événement pour ouvrir les préférences
  window.addEventListener("show-cookie-preferences", () => {
    showPreferences.value = true
  })
})
</script>

<style scoped>
/* Transitions pour la bannière */
.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition: all 0.3s ease;
}

.cookie-banner-enter-from,
.cookie-banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Transitions pour la modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
