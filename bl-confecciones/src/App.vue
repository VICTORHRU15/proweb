<script setup>
// Aquí irá la lógica de Vue más adelante (estado del carrito, filtros, etc.)
</script>

<template>
  <!-- 1. Header / Top Navigation -->
  <header class="bg-surface-container-lowest docked full-width top-0 sticky z-40 shadow-sm">
    <div class="flex justify-between items-center w-full px-4 lg:px-8 max-w-7xl mx-auto h-20">
      <!-- Brand Logo -->
      <a class="flex flex-col group" href="#">
        <span class="text-headline-sm font-headline-sm font-bold text-primary tracking-tight group-hover:text-secondary transition-colors duration-200">
          BL Confecciones
        </span>
        <span class="text-label-caption font-label-caption text-on-surface-variant -mt-1 tracking-wider uppercase">
          Batas & Salidas de Baño en Toalla
        </span>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center space-x-6 lg:space-x-8">
        <a class="text-primary font-semibold border-b-2 border-primary pb-1 font-label-lg text-label-lg" href="#catalogo">Adulto Clásico</a>
        <a class="text-on-surface-variant hover:text-primary transition-colors pb-1 font-label-lg text-label-lg" href="#catalogo">Adulto Ribeteado</a>
        <a class="text-on-surface-variant hover:text-primary transition-colors pb-1 font-label-lg text-label-lg" href="#catalogo">Niños</a>
        <a class="text-on-surface-variant hover:text-primary transition-colors pb-1 font-label-lg text-label-lg" href="#beneficios">Beneficios</a>
        <a class="text-on-surface-variant hover:text-primary transition-colors pb-1 font-label-lg text-label-lg" href="#contacto">Contacto</a>
      </nav>

      <!-- Trailing Action: Pedir por WhatsApp -->
      <div class="flex items-center space-x-3">
        <a class="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-full font-label-lg text-label-lg transition-transform duration-150 active:scale-95 shadow-sm" href="https://wa.me/573000000000?text=Hola%20BL%20Confecciones,%20quiero%20información" target="_blank">
          <span class="material-symbols-outlined text-[20px]" data-icon="chat">chat</span>
          <span class="hidden sm:inline">Pedir por WhatsApp</span>
          <span class="sm:hidden">Pedir</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content Canvas -->
  <main class="w-full overflow-hidden">
    <!-- 2. Hero Section -->
    <section class="relative bg-surface-container-lowest pt-8 pb-16 md:py-20 lg:py-24 border-b border-surface-container">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Text Content -->
          <div class="lg:col-span-7 flex flex-col items-start space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-secondary-fixed text-secondary font-label-md text-label-md">
              <span class="material-symbols-outlined text-[18px]" data-icon="verified">verified</span>
              <span>93% Algodón 7% Poliester • Confección Directa de Fábrica</span>
            </div>
            <h1 class="text-display-hero-mobile md:text-display-hero font-display-hero-mobile md:font-display-hero text-primary tracking-tight">
              La máxima suavidad y absorción al salir del baño o piscina
            </h1>
            <p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Confección directa de fábrica en toalla 93% algodón. Diseños exclusivos para adultos y niños con envíos a todo el país y atención personalizada por WhatsApp.
            </p>
            
            <!-- Hero CTAs -->
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <a class="inline-flex justify-center items-center px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all duration-200" href="#catalogo">
                Ver Catálogo y Precios
              </a>
            </div>
          </div>
          
          <!-- Hero Visual -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/5] border border-outline-variant/30">
              <img class="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc_ToZUpL3rVLxhU_wOetMv-z9pa6Ru_94x2Uvf_VyBHQ8OxLhFs9BaNmq62s62Q0Zj_t55wkGPbnhblNeM4cwLsJQgk5erAWTNCA-zV9iKxY8ojQc021q4-1mY-jnQ45BZt3lfwPmqx5sQjHzk2B_NcQQ1A0GVemyINEKuT3pj2o6uS_j3C8t_yCNWUhlRuOsTnj7HT5gSO6j893r-OqYV2Q2zT-gdgesVVppUwWCjkfaoPWXsi6--w" alt="Bata de lujo">
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Estilos específicos de este componente, si se necesitan */
</style>