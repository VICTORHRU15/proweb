<script setup>
import { ref, onMounted, computed } from 'vue';

// 1. Estados reactivos de la aplicación
const productos = ref([]);
const cargando = ref(false);
const error = ref("");

// NUEVO: Estado para controlar qué pantalla se ve (SPA)
const vistaActual = ref('inicio'); // Puede ser 'inicio' o 'catalogo'

// Función para navegar entre pantallas
function cambiarVista(vista) {
  vistaActual.value = vista;
  window.scrollTo(0, 0); // Sube la pantalla al inicio al cambiar de vista
}

// Estados para el filtro
const busqueda = ref("");
const categoriaFiltro = ref("");

// Computed property para filtrar en tiempo real
const productosFiltrados = computed(() => {
  return productos.value.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
    const coincideCategoria = categoriaFiltro.value === "" || producto.categoria === categoriaFiltro.value;
    return coincideTexto && coincideCategoria;
  });
});

// 2. Función para consumir la API REST
async function cargarCatalogo() {
  cargando.value = true;
  error.value = "";
  try {
    const respuesta = await fetch("http://localhost:3000/api/productos");
    if (!respuesta.ok) throw new Error("Fallo al conectar con el servidor");
    
    productos.value = await respuesta.json();
  } catch (e) {
    error.value = "No se pudo cargar el inventario: " + e.message;
  } finally {
    cargando.value = false;
  }
}

// Ejecutar la carga al montar el componente
onMounted(cargarCatalogo);
</script>

<template>
  <!-- Navbar de Bootstrap (Siempre visible) -->
  <nav class="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
    <div class="container">
      <a class="navbar-brand d-flex flex-column" href="#" @click.prevent="cambiarVista('inicio')">
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
          <!-- Enlaces dinámicos que cambian la vista -->
          <li class="nav-item">
            <a class="nav-link" :class="{ 'text-brand-primary fw-semibold': vistaActual === 'inicio' }" href="#" @click.prevent="cambiarVista('inicio')">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ 'text-brand-primary fw-semibold': vistaActual === 'catalogo' }" href="#" @click.prevent="cambiarVista('catalogo')">Catálogo Completo</a>
          </li>
          <li v-if="vistaActual === 'inicio'" class="nav-item">
            <a class="nav-link" href="#beneficios">Beneficios</a>
          </li>
          <li v-if="vistaActual === 'inicio'" class="nav-item">
            <a class="nav-link" href="#contacto">Contacto</a>
          </li>
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
    <!-- ==========================================
         VISTA 1: LANDING PAGE (INICIO)
         ========================================== -->
    <div v-if="vistaActual === 'inicio'">
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
              <!-- Este botón ahora cambia la vista en lugar de hacer scroll -->
              <a href="#" @click.prevent="cambiarVista('catalogo')" class="btn bg-brand-primary text-white rounded-pill px-4 py-3 fw-semibold shadow-sm">
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

      <!-- Preview del Catálogo (Muestra solo los primeros 3 productos) -->
      <section class="py-5 bg-white">
        <div class="container py-5">
          <div class="text-center mb-5">
            <h2 class="display-6 fw-bold text-brand-primary">Nuestros Productos Estrella</h2>
          </div>
          
          <div v-if="productos.length > 0" class="row g-4 justify-content-center">
            <!-- Usamos slice(0,3) para mostrar máximo 3 opciones en el landing -->
            <div v-for="producto in productos.slice(0, 3)" :key="'prev-'+producto.id" class="col-md-4">
              <div class="card h-100 shadow-sm border-0 bg-light">
                <img :src="producto.imagen" class="card-img-top rounded-top-4" :alt="producto.nombre" style="aspect-ratio: 4/5; object-fit: cover;">
                <div class="card-body p-4 text-center">
                  <h5 class="card-title text-brand-primary fw-bold">{{ producto.nombre }}</h5>
                  <p class="text-brand-primary fs-5 fw-semibold">\${{ producto.precio.toLocaleString('es-CO') }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-5">
            <button @click="cambiarVista('catalogo')" class="btn btn-outline-primary btn-lg rounded-pill px-5">
              Explorar Todo el Catálogo
            </button>
          </div>
        </div>
      </section>

      <!-- Sección de Beneficios -->
      <section id="beneficios" class="py-5 bg-light">
        <div class="container py-5">
          <div class="text-center mb-5">
            <h2 class="display-6 fw-bold text-brand-primary">¿Por qué elegir nuestras batas?</h2>
            <p class="text-secondary">Calidad y comodidad garantizada</p>
          </div>
          <div class="row g-4 text-center">
            <div class="col-md-4">
              <div class="p-4 bg-white rounded-4 shadow-sm h-100 border-0">
                <span class="material-symbols-outlined text-info fs-1 mb-3">water_drop</span>
                <h4 class="fw-bold text-brand-primary">Máxima Absorción</h4>
                <p class="text-muted mb-0">Confeccionadas en toalla 93% algodón, diseñadas para secar rápidamente y mantener la calidez al salir del agua.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-4 bg-white rounded-4 shadow-sm h-100 border-0">
                <span class="material-symbols-outlined text-info fs-1 mb-3">factory</span>
                <h4 class="fw-bold text-brand-primary">Precios de Fábrica</h4>
                <p class="text-muted mb-0">Al ser fabricantes directos, ofrecemos precios competitivos tanto para compras al detal como ventas al por mayor.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-4 bg-white rounded-4 shadow-sm h-100 border-0">
                <span class="material-symbols-outlined text-info fs-1 mb-3">local_shipping</span>
                <h4 class="fw-bold text-brand-primary">Envíos Nacionales</h4>
                <p class="text-muted mb-0">Despachamos desde nuestra fábrica a cualquier ciudad del país de forma rápida y segura.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Contacto -->
      <section id="contacto" class="py-5 bg-white">
        <div class="container py-5">
          <div class="row align-items-center bg-brand-primary rounded-4 overflow-hidden shadow-lg">
            <div class="col-lg-6 p-5 text-white">
              <h2 class="display-6 fw-bold mb-3">¿Tienes un pedido especial?</h2>
              <p class="lead mb-4 opacity-75">
                Si necesitas tallas especiales, bordados personalizados o cotizar pedidos al por mayor para hoteles o eventos, escríbenos directamente.
              </p>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-center gap-3">
                  <span class="material-symbols-outlined fs-3">location_on</span>
                  <span>Envíos a todo el país</span>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <span class="material-symbols-outlined fs-3">mail</span>
                  <span>ventas@blconfecciones.com</span>
                </div>
              </div>
            </div>
            <div class="col-lg-6 bg-light p-5 h-100 d-flex flex-column justify-content-center align-items-center text-center">
              <h3 class="fw-bold text-brand-primary mb-3">Atención Inmediata</h3>
              <p class="text-secondary mb-4">Nuestro equipo de ventas te asesorará de manera personalizada.</p>
              <a href="https://wa.me/573226718769?text=Hola,%20me%20gustaría%20hacer%20una%20consulta%20general" target="_blank" class="btn btn-whatsapp btn-lg rounded-pill px-5 d-flex align-items-center gap-2 shadow">
                <span class="material-symbols-outlined">chat</span>
                Iniciar Chat en WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ==========================================
         VISTA 2: CATÁLOGO COMPLETO
         ========================================== -->
    <div v-else-if="vistaActual === 'catalogo'">
      <section class="py-5 bg-white min-vh-100">
        <div class="container py-4">
          
          <!-- Botón Volver -->
          <button @click="cambiarVista('inicio')" class="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 mb-4 px-0">
            <span class="material-symbols-outlined">arrow_back</span>
            Volver al inicio
          </button>

          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-brand-primary">Catálogo Completo</h2>
            <p class="text-secondary">Confección directa desde fábrica, selecciona el modelo que deseas pedir.</p>
          </div>

          <!-- Barra de Búsqueda y Filtros -->
          <div class="row mb-5 justify-content-center bg-light p-4 rounded-4 shadow-sm mx-1">
            <div class="col-md-6 mb-3 mb-md-0">
              <label class="form-label text-muted small fw-bold">Buscar modelo</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <span class="material-symbols-outlined text-muted fs-5">search</span>
                </span>
                <input v-model="busqueda" type="text" class="form-control border-start-0 ps-0" placeholder="Ej: Kimono, Infantil...">
              </div>
            </div>
            <div class="col-md-5">
              <label class="form-label text-muted small fw-bold">Filtrar por categoría</label>
              <select v-model="categoriaFiltro" class="form-select text-secondary">
                <option value="">Todas las categorías</option>
                <option value="Adulto Clásico">Adulto Clásico</option>
                <option value="Adulto Ribeteado">Adulto Ribeteado</option>
                <option value="Niños">Niños</option>
              </select>
            </div>
          </div>

          <!-- Estados de carga y renderizado de tarjetas (Igual que antes) -->
          <div v-if="cargando" class="text-center py-5">
            <div class="spinner-border text-brand-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <span class="material-symbols-outlined">error</span>
            {{ error }}
          </div>

          <div v-else-if="!productosFiltrados.length" class="text-center py-5 text-muted">
            <span class="material-symbols-outlined fs-1 mb-2">inventory_2</span>
            <p>No hay productos que coincidan con tu búsqueda.</p>
          </div>

          <div v-else class="row g-4">
            <div v-for="producto in productosFiltrados" :key="producto.id" class="col-md-6 col-lg-4">
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
    </div>
  </main>
</template>

<style scoped>
</style>