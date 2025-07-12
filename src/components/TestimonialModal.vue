<template>
  <Teleport to="body">
    <div
      v-if="isVisible && selectedTestimonial"
      ref="modalOverlay"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="handleClickOutside"
    >
      <div
        ref="modalContent"
        class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative transform scale-95 opacity-0"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Fermer la modal"
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

        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400 mr-3">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-6 h-6"
                :fill="i <= selectedTestimonial.rating ? 'currentColor' : 'none'"
                stroke="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium text-gray-900 text-lg">
                {{ selectedTestimonial.clientName }}
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(selectedTestimonial.date) }}
              </div>
            </div>
          </div>

          <blockquote
            class="text-gray-700 italic text-lg leading-relaxed mb-4 whitespace-pre-line"
          >
            "{{ selectedTestimonial.testimonial }}"
          </blockquote>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { gsap } from "gsap"
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"

interface Testimonial {
  id: string
  clientName: string
  testimonial: string
  rating: number
  date: string
}

interface Props {
  testimonials?: Testimonial[]
}

const props = withDefaults(defineProps<Props>(), {
  testimonials: () => [],
})

const isVisible = ref(false)
const selectedTestimonialId = ref<string | null>(null)
const modalOverlay = ref<HTMLElement | null>(null)
const modalContent = ref<HTMLElement | null>(null)

const selectedTestimonial = computed(() => {
  if (!selectedTestimonialId.value) return null
  return (
    props.testimonials.find((t: Testimonial) => t.id === selectedTestimonialId.value) ||
    null
  )
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  })
}

// Animation d'entrée
const animateIn = async () => {
  if (!modalOverlay.value || !modalContent.value) return

  // Reset des styles
  gsap.set(modalOverlay.value, { opacity: 0 })
  gsap.set(modalContent.value, {
    scale: 0.8,
    opacity: 0,
    y: 50,
    rotationX: 15,
  })

  // Timeline d'animation
  const tl = gsap.timeline({ ease: "power3.out" })

  tl.to(modalOverlay.value, {
    opacity: 1,
    duration: 0.3,
  }).to(
    modalContent.value,
    {
      scale: 1,
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    },
    "-=0.1"
  )
}

// Animation de sortie
const animateOut = async (): Promise<void> => {
  if (!modalOverlay.value || !modalContent.value) return

  const tl = gsap.timeline({ ease: "power3.in" })

  tl.to(modalContent.value, {
    scale: 0.8,
    opacity: 0,
    y: -30,
    rotationX: -15,
    duration: 0.3,
    ease: "back.in(1.7)",
  }).to(
    modalOverlay.value,
    {
      opacity: 0,
      duration: 0.2,
    },
    "-=0.1"
  )

  return new Promise((resolve) => {
    tl.eventCallback("onComplete", resolve)
  })
}

const closeModal = async () => {
  await animateOut()
  isVisible.value = false
  selectedTestimonialId.value = null
  document.body.style.overflow = "auto"
}

const handleOpenModal = async (event: CustomEvent) => {
  const testimonialId = event.detail
  selectedTestimonialId.value = testimonialId
  isVisible.value = true
  document.body.style.overflow = "hidden"

  // Attendre que le DOM soit mis à jour
  await nextTick()
  animateIn()
}

const handleCloseModal = () => {
  closeModal()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isVisible.value) {
    closeModal()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (event.target === event.currentTarget && isVisible.value) {
    closeModal()
  }
}

// Surveiller les changements de visibilité pour les animations
watch(isVisible, async (newValue) => {
  if (newValue) {
    await nextTick()
    animateIn()
  }
})

onMounted(() => {
  document.addEventListener(
    "openTestimonialModal",
    handleOpenModal as unknown as EventListener
  )
  document.addEventListener("closeTestimonialModal", handleCloseModal)
  document.addEventListener("keydown", handleEscape)
})

onUnmounted(() => {
  document.removeEventListener(
    "openTestimonialModal",
    handleOpenModal as unknown as EventListener
  )
  document.removeEventListener("closeTestimonialModal", handleCloseModal)
  document.removeEventListener("keydown", handleEscape)
})
</script>

<style scoped>
/* Styles de base pour éviter le flash */
.fixed {
  backdrop-filter: blur(4px);
}
</style>
