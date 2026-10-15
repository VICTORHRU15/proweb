<script setup>
import { ref, onMounted, computed } from 'vue';

// ==========================================
// ESTADOS DE LA APLICACIÓN
// ==========================================
const productos = ref([]);
const cargando = ref(false);
const error = ref("");
const vistaActual = ref('inicio');

// Estados para el Login de Administrador
const esAdmin = ref(false);
const formLogin = ref({ usuario: "", password: "" });

// ==========================================
// FUNCIONES DE NAVEGACIÓN Y FILTROS
// ==========================================
function cambiarVista(vista) {
  vistaActual.value = vista;
  window.scrollTo(0, 0);
}

const busqueda = ref("");
const categoriaFiltro = ref("");

const productosFiltrados = computed(() => {
  return productos.value.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
    const coincideCategoria = categoriaFiltro.value === "" || producto.categoria === categoriaFiltro.value;
    return coincideTexto && coincideCategoria;
  });
});

// ==========================================
// FUNCIONES DE SEGURIDAD (LOGIN)
// ==========================================
function iniciarSesion() {
  if (formLogin.value.usuario === 'admin' && formLogin.value.password === '12345') {
    esAdmin.value = true;
    formLogin.value = { usuario: "", password: "" };
    alert("¡Bienvenido al panel de administración, Víctor!"); 
  } else {
    alert("Credenciales incorrectas. El usuario es 'admin' y la clave '12345'.");
  }
}

function cerrarSesion() {
  esAdmin.value = false;
  cambiarVista('inicio');
}

// ==========================================
// FUNCIONES DE BASE DE DATOS (CRUD COMPLETO)
// ==========================================

// --- LEER (GET) ---
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

// --- CREAR (POST) ---
const formProducto = ref({ nombre: "", categoria: "", precio: 0, stock: 0, imagen: "" });

async function agregarProducto() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formProducto.value)
    });
    if (!respuesta.ok) throw new Error("Error al guardar en la base de datos");
    await cargarCatalogo();
    formProducto.value = { nombre: "", categoria: "", precio: 0, stock: 0, imagen: "" };
  } catch (e) {
    alert("Ocurrió un error: " + e.message);
  }
}

// --- ACTUALIZAR (PUT) ---
const productoAEditar = ref({ id: null, nombre: "", categoria: "", precio: 0, stock: 0, imagen: "" });

// Esta función carga los datos en el modal antes de editar
function prepararEdicion(producto) {
  productoAEditar.value = { ...producto }; // Copia los datos exactos del producto
}

async function actualizarProducto() {
  try {
    const respuesta = await fetch(`http://localhost:3000/api/productos/${productoAEditar.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoAEditar.value)
    });
    if (!respuesta.ok) throw new Error("Error al actualizar la base de datos");
    await cargarCatalogo();
  } catch (e) {
    alert("Ocurrió un error: " + e.message);
  }
}

// --- ELIMINAR (DELETE) ---
async function eliminarProducto(id) {
  // Confirmación por seguridad antes de borrar
  if (!confirm("¿Estás seguro de eliminar esta bata del catálogo? Esta acción no se puede deshacer.")) return;
  
  try {
    const respuesta = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error al eliminar el producto");
    await cargarCatalogo(); // Recarga visualmente la página quitando el producto
  } catch (e) {
    alert("Ocurrió un error: " + e.message);
  }
}

onMounted(cargarCatalogo);
</script>

<template>
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
        <ul class="navbar-nav mx-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link" :class="{ 'text-brand-primary fw-semibold': vistaActual === 'inicio' }" href="#" @click.prevent="cambiarVista('inicio')">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ 'text-brand-primary fw-semibold': vistaActual === 'catalogo' }" href="#" @click.prevent="cambiarVista('catalogo')">Catálogo Completo</a>
          </li>
          <li v-if="vistaActual === 'inicio'" class="nav-item"><a class="nav-link" href="#beneficios">Beneficios</a></li>
          
          <!-- Login -->
          <li class="nav-item ms-lg-3" v-if="!esAdmin">
            <a class="nav-link text-secondary d-flex align-items-center gap-1" href="#" data-bs-toggle="modal" data-bs-target="#modalLogin" title="Acceso Administrativo">
              <span class="material-symbols-outlined" style="font-size: 1.2rem;">lock</span>
            </a>
          </li>
          <!-- Logout -->
          <li class="nav-item dropdown ms-lg-3" v-else>
            <a class="nav-link dropdown-toggle text-success fw-bold d-flex align-items-center gap-1" href="#" role="button" data-bs-toggle="dropdown">
              <span class="material-symbols-outlined" style="font-size: 1.2rem;">admin_panel_settings</span>
              Admin
            </a>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
              <li><a class="dropdown-item text-danger d-flex align-items-center gap-2" href="#" @click.prevent="cerrarSesion">
                <span class="material-symbols-outlined" style="font-size: 1.2rem;">logout</span> Cerrar Sesión
              </a></li>
            </ul>
          </li>
        </ul>
        <div class="d-flex mt-3 mt-lg-0">
          <a class="btn btn-whatsapp rounded-pill d-flex align-items-center gap-2 px-4 shadow-sm" href="https://wa.me/573226718769" target="_blank">
            <span class="material-symbols-outlined fs-5">chat</span> Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <!-- VISTA 1: LANDING PAGE -->
    <div v-if="vistaActual === 'inicio'">
      <!-- (El contenido de inicio se mantiene idéntico) -->
      <section class="py-5 bg-light border-bottom">
        <div class="container py-4">
          <div class="row align-items-center gy-5">
            <div class="col-lg-7">
              <div class="badge rounded-pill border border-info text-info bg-transparent px-3 py-2 mb-4 d-inline-flex align-items-center gap-2">
                <span class="material-symbols-outlined" style="font-size: 18px;">verified</span>
                93% Algodón 7% Poliester • Confección Directa
              </div>
              <h1 class="display-4 fw-bold text-brand-primary mb-4">La máxima suavidad y absorción al salir del baño</h1>
              <p class="lead text-secondary mb-5">Confección directa de fábrica en toalla 93% algodón. Diseños exclusivos con envíos a todo el país y atención personalizada.</p>
              <a href="#" @click.prevent="cambiarVista('catalogo')" class="btn bg-brand-primary text-white rounded-pill px-4 py-3 fw-semibold shadow-sm">
                Ver Catálogo y Precios
              </a>
            </div>
            <div class="col-lg-5">
              <div class="rounded-4 overflow-hidden shadow">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc_ToZUpL3rVLxhU_wOetMv-z9pa6Ru_94x2Uvf_VyBHQ8OxLhFs9BaNmq62s62Q0Zj_t55wkGPbnhblNeM4cwLsJQgk5erAWTNCA-zV9iKxY8ojQc021q4-1mY-jnQ45BZt3lfwPmqx5sQjHzk2B_NcQQ1A0GVemyINEKuT3pj2o6uS_j3C8t_yCNWUhlRuOsTnj7HT5gSO6j893r-OqYV2Q2zT-gdgesVVppUwWCjkfaoPWXsi6--w" class="img-fluid w-100" alt="Bata de lujo" style="object-fit: cover; aspect-ratio: 4/5;">
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-white">
        <div class="container py-5">
          <div class="text-center mb-5">
            <h2 class="display-6 fw-bold text-brand-primary">Nuestros Productos Estrella</h2>
          </div>
          <div v-if="productos.length > 0" class="row g-4 justify-content-center">
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
            <button @click="cambiarVista('catalogo')" class="btn btn-outline-primary btn-lg rounded-pill px-5">Explorar Todo el Catálogo</button>
          </div>
        </div>
      </section>
    </div>

    <!-- VISTA 2: CATÁLOGO COMPLETO -->
    <div v-else-if="vistaActual === 'catalogo'">
      <section class="py-5 bg-white min-vh-100">
        <div class="container py-4">
          <button @click="cambiarVista('inicio')" class="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-2 mb-4 px-0">
            <span class="material-symbols-outlined">arrow_back</span> Volver al inicio
          </button>

          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-brand-primary">Catálogo Completo</h2>
            <p class="text-secondary">Confección directa desde fábrica, selecciona el modelo que deseas pedir.</p>
            
            <!-- NUEVO CONTENEDOR CON LOS DOS BOTONES -->
            <div v-if="esAdmin" class="d-flex justify-content-center flex-wrap gap-3 mt-4">
              <button class="btn btn-primary fw-bold rounded-pill px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalAgregar">
                <span class="material-symbols-outlined align-middle fs-5 me-1">add_circle</span> Agregar Nuevo Producto
              </button>
              
              <!-- NUEVO: Botón de Reporte Excel -->
              <a href="http://localhost:3000/api/reporte" class="btn btn-success fw-bold rounded-pill px-4 shadow-sm d-flex align-items-center">
                <span class="material-symbols-outlined fs-5 me-1">download</span> Descargar Reporte
              </a>
            </div>
          </div>

          <div class="row mb-5 justify-content-center bg-light p-4 rounded-4 shadow-sm mx-1">
            <div class="col-md-6 mb-3 mb-md-0">
              <label class="form-label text-muted small fw-bold">Buscar modelo</label>
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><span class="material-symbols-outlined text-muted fs-5">search</span></span>
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

          <div v-if="!productosFiltrados.length" class="text-center py-5 text-muted">
            <span class="material-symbols-outlined fs-1 mb-2">inventory_2</span>
            <p>No hay productos en esta categoría.</p>
          </div>

          <div v-else class="row g-4">
            <div v-for="producto in productosFiltrados" :key="producto.id" class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm border-0 bg-light">
                <img :src="producto.imagen" class="card-img-top rounded-top-4" :alt="producto.nombre" style="aspect-ratio: 4/5; object-fit: cover;">
                <div class="card-body d-flex flex-column p-4">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-white text-secondary border">{{ producto.categoria }}</span>
                    <span class="fw-bold text-brand-primary fs-5">\${{ producto.precio.toLocaleString('es-CO') }}</span>
                  </div>
                  <h5 class="card-title text-brand-primary fw-bold mb-1">{{ producto.nombre }}</h5>
                  <p class="text-muted small mb-4">Stock disponible: {{ producto.stock }} unidades</p>
                  
                  <div class="mt-auto">
                    <a :href="`https://wa.me/573226718769?text=Hola,%20me%20interesa:%20${producto.nombre}`" target="_blank" class="btn btn-whatsapp w-100 rounded-pill d-flex justify-content-center align-items-center gap-2">
                      <span class="material-symbols-outlined fs-5">chat</span> Pedir Modelo
                    </a>
                    
                    <!-- BOTONES CRUD DE ADMINISTRADOR -->
                    <div v-if="esAdmin" class="d-flex gap-2 mt-3 pt-3 border-top">
                      <button @click="prepararEdicion(producto)" class="btn btn-sm btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-1" data-bs-toggle="modal" data-bs-target="#modalEditar">
                        <span class="material-symbols-outlined" style="font-size: 16px;">edit</span> Editar
                      </button>
                      <button @click="eliminarProducto(producto.id)" class="btn btn-sm btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-1">
                        <span class="material-symbols-outlined" style="font-size: 16px;">delete</span> Borrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- MODALES -->
    <!-- Modal Login -->
    <div class="modal fade" id="modalLogin" tabindex="-1">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content rounded-4">
          <div class="modal-header border-0 pb-0"><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body text-center px-4 pb-4">
            <span class="material-symbols-outlined text-brand-primary mb-3" style="font-size: 3rem;">admin_panel_settings</span>
            <h5 class="fw-bold mb-4">Acceso Reservado</h5>
            <form @submit.prevent="iniciarSesion">
              <input v-model="formLogin.usuario" type="text" class="form-control text-center bg-light mb-3" placeholder="Usuario" required>
              <input v-model="formLogin.password" type="password" class="form-control text-center bg-light mb-4" placeholder="Contraseña" required>
              <button type="submit" class="btn bg-brand-primary text-white w-100 rounded-pill fw-bold" :data-bs-dismiss="formLogin.usuario === 'admin' && formLogin.password === '12345' ? 'modal' : ''">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar -->
    <div class="modal fade" id="modalAgregar" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-brand-primary text-white">
            <h5 class="modal-title fw-bold">Registrar Nueva Bata</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="agregarProducto" id="formAgregarProducto">
              <input v-model="formProducto.nombre" type="text" class="form-control mb-3" required placeholder="Nombre: Ej: Bata Spa">
              <select v-model="formProducto.categoria" class="form-select mb-3" required>
                <option value="" disabled>Selecciona categoría</option>
                <option value="Adulto Clásico">Adulto Clásico</option>
                <option value="Adulto Ribeteado">Adulto Ribeteado</option>
                <option value="Niños">Niños</option>
              </select>
              <div class="row">
                <div class="col-6 mb-3"><input v-model.number="formProducto.precio" type="number" class="form-control" placeholder="Precio" required></div>
                <div class="col-6 mb-3"><input v-model.number="formProducto.stock" type="number" class="form-control" placeholder="Stock" required></div>
              </div>
              <input v-model="formProducto.imagen" type="url" class="form-control mb-3" required placeholder="URL Imagen">
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="formAgregarProducto" class="btn bg-brand-primary text-white px-4" data-bs-dismiss="modal">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- NUEVO: Modal Editar -->
    <div class="modal fade" id="modalEditar" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title fw-bold text-dark">Editar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- Funciona igual que Agregar, pero usa la variable productoAEditar y lanza la función actualizarProducto -->
            <form @submit.prevent="actualizarProducto" id="formEditarProducto">
              <input v-model="productoAEditar.nombre" type="text" class="form-control mb-3" required>
              <select v-model="productoAEditar.categoria" class="form-select mb-3" required>
                <option value="Adulto Clásico">Adulto Clásico</option>
                <option value="Adulto Ribeteado">Adulto Ribeteado</option>
                <option value="Niños">Niños</option>
              </select>
              <div class="row">
                <div class="col-6 mb-3"><input v-model.number="productoAEditar.precio" type="number" class="form-control" required></div>
                <div class="col-6 mb-3"><input v-model.number="productoAEditar.stock" type="number" class="form-control" required></div>
              </div>
              <input v-model="productoAEditar.imagen" type="url" class="form-control mb-3" required>
            </form>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="formEditarProducto" class="btn btn-warning px-4 fw-bold" data-bs-dismiss="modal">Actualizar Cambios</button>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
</style>