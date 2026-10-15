<script setup>
import { ref, onMounted } from 'vue';

// 1. Estados reactivos de la aplicación[cite: 38]
const productos = ref([]);
const cargando = ref(false);
const error = ref("");

// 2. Función para consumir la API REST[cite: 42]
async function cargarCatalogo() {
  cargando.value = true;
  error.value = "";
  try {
    // El frontend pide los datos a tu servidor local de Express[cite: 35]
    const respuesta = await fetch("http://localhost:3000/api/productos");
    if (!respuesta.ok) throw new Error("Fallo al conectar con el servidor");
    
    productos.value = await respuesta.json();
  } catch (e) {
    error.value = "No se pudo cargar el inventario: " + e.message;
  } finally {
    cargando.value = false;
  }
}

// 3. Ejecutar la carga al montar el componente[cite: 42]
onMounted(cargarCatalogo);
</script>

<template>
  <!-- Navbar de Bootstrap -->
  <nav class="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
    <div class="container">
      <a class="navbar-brand d-flex flex-column" href="#">
        <span class="text-brand-primary fw-bold fs-4">BL Confecciones</span>
        <small class="text-muted text-uppercase" style="font-size: 0.7rem; margin-top: -5px;">
          Batas & Salidas de Baño en Toalla
        </small>
      </a>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item"><a class="nav-link text-brand-primary fw-semibold" href="#catalogo">Catálogo</a></li>
          <li class="nav-item"><a class="nav-link" href="#beneficios">Beneficios</a></li>
          <li class="nav-item"><a class="nav-link" href="#contacto">Contacto</a></li>
        </ul>
        <div class="d-flex">
          <a class="btn btn-whatsapp rounded-pill d-flex align-items-center gap-2 px-4 shadow-sm" href="https://wa.me/573226718769" target="_blank">
            <span class="material-symbols-outlined fs-5">chat</span>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <!-- Hero Section -->
    <section class="py-5 bg-light border-bottom">
      <div class="container py-4">
        <div class="row align-items-center gy-5">
          <div class="col-lg-7">
            <div class="badge rounded-pill border border-info text-info bg-transparent px-3 py-2 mb-4 d-inline-flex align-items-center gap-2">
              <span class="material-symbols-outlined" style="font-size: 18px;">verified</span>
              93% Algodón 7% Poliester • Confección Directa
            </div>
            <h1 class="display-4 fw-bold text-brand-primary mb-4">
              La máxima suavidad y absorción al salir del baño
            </h1>
            <p class="lead text-secondary mb-5">
              Confección directa de fábrica en toalla 93% algodón. Diseños exclusivos con envíos a todo el país y atención personalizada.
            </p>
            <a href="#catalogo" class="btn bg-brand-primary rounded-pill px-4 py-3 fw-semibold shadow-sm">
              Ver Catálogo y Precios
            </a>
          </div>
          <div class="col-lg-5">
            <div class="rounded-4 overflow-hidden shadow">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc_ToZUpL3rVLxhU_wOetMv-z9pa6Ru_94x2Uvf_VyBHQ8OxLhFs9BaNmq62s62Q0Zj_t55wkGPbnhblNeM4cwLsJQgk5erAWTNCA-zV9iKxY8ojQc021q4-1mY-jnQ45BZt3lfwPmqx5sQjHzk2B_NcQQ1A0GVemyINEKuT3pj2o6uS_j3C8t_yCNWUhlRuOsTnj7HT5gSO6j893r-OqYV2Q2zT-gdgesVVppUwWCjkfaoPWXsi6--w" 
                   class="img-fluid w-100" alt="Bata de lujo en baño" style="object-fit: cover; aspect-ratio: 4/5;">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catálogo Dinámico con SQLite -->
    <section id="catalogo" class="py-5 bg-white">
      <div class="container py-5">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold text-brand-primary">Catálogo de Productos</h2>
          <p class="text-secondary">Confección directa desde fábrica</p>
        </div>

        <!-- Manejo de estados de la interfaz[cite: 44] -->
        
        <!-- Estado: Cargando -->
        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-brand-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-secondary">Conectando con la base de datos...</p>
        </div>

        <!-- Estado: Error de API -->
        <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <span class="material-symbols-outlined">error</span>
          {{ error }}
        </div>

        <!-- Estado: Vacío (sin datos) -->
        <div v-else-if="!productos.length" class="text-center py-5 text-muted">
          <span class="material-symbols-outlined fs-1 mb-2">inventory_2</span>
          <p>No hay productos registrados en el inventario.</p>
        </div>

        <!-- Estado: Éxito (Renderizado dinámico de tarjetas) -->
        <div v-else class="row g-4">
          <!-- Bucle v-for inyectando datos de SQLite -->
          <div v-for="producto in productos" :key="producto.id" class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0 bg-light">
              <img :src="producto.imagen" class="card-img-top rounded-top-4" :alt="producto.nombre" style="aspect-ratio: 4/5; object-fit: cover;">
              <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge bg-white text-secondary border">{{ producto.categoria }}</span>
                  <span class="fw-bold text-brand-primary fs-5">
                    \${{ producto.precio.toLocaleString('es-CO') }}
                  </span>
                </div>
                
                <h5 class="card-title text-brand-primary fw-bold mb-1">{{ producto.nombre }}</h5>
                <p class="text-muted small mb-4">Stock disponible: {{ producto.stock }} unidades</p>
                
                <div class="mt-auto">
                  <!-- Botón dinámico inyectando el nombre del producto en el mensaje de WhatsApp -->
                  <a :href="`https://wa.me/573226718769?text=Hola,%20me%20interesa%20comprar:%20${producto.nombre}`" 
                     target="_blank" 
                     class="btn btn-whatsapp w-100 rounded-pill d-flex justify-content-center align-items-center gap-2">
                    <span class="material-symbols-outlined fs-5">chat</span>
                    Pedir Modelo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<style scoped>
</style>