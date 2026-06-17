<template>
  <div class="page-body">
    <h1>Bandeja de Tickets</h1>
    <p class="subtitulo">Vista de administrador — todos los tickets del sistema</p>

    <div class="nav">
      <NuxtLink to="/dashboard" class="nav-btn">Volver al Dashboard</NuxtLink>
      <NuxtLink to="/estadisticas" class="nav-btn">Estadisticas de Pagina</NuxtLink>
    </div>

    <div class="filtros">
      <input type="text" v-model="buscarNombre" placeholder="Buscar por nombre de agente..." @keydown.enter="cargarBandeja" />
      <select v-model="filtroEstado" @change="cargarBandeja">
        <option value="">Todos los estados</option>
        <option value="abierto">Abierto</option>
        <option value="en_proceso">En Proceso</option>
        <option value="cerrado">Cerrado</option>
      </select>
      <select v-model="filtroPrioridad" @change="cargarBandeja">
        <option value="">Todas las prioridades</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <button class="btn-filtro" @click="cargarBandeja">Buscar</button>
    </div>

    <div class="bandeja">
      <p v-if="cargando" class="empty">Cargando tickets...</p>
      <p v-else-if="ticketsList.length === 0" class="empty">No hay tickets con esos filtros.</p>
      <div v-else v-for="t in ticketsList" :key="t.id" class="ticket-card" @click="navigateTo('/detalle-ticket?id=' + t.id)">
        <h3>{{ t.titulo }}</h3>
        <p>{{ t.descripcion }}</p>
        <p><strong>Categoria:</strong> {{ t.categoria }}</p>
        <span class="tag" :class="t.estado || 'abierto'">{{ (t.estado || 'abierto').replace('_', ' ') }}</span>
        <span class="tag" :class="'p-' + (t.prioridad || 'media')">{{ t.prioridad || 'media' }}</span>
        <div class="creator">Creado por: <strong>{{ t.Usuario ? t.Usuario.nombre : 'Desconocido' }}</strong></div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })

const { apiFetch } = useAuth()

const buscarNombre = ref('')
const filtroEstado = ref('')
const filtroPrioridad = ref('')
const ticketsList = ref([])
const cargando = ref(true)

const cargarBandeja = async () => {
  const params = new URLSearchParams()
  if (buscarNombre.value.trim()) params.append('nombre', buscarNombre.value.trim())
  if (filtroEstado.value) params.append('estado', filtroEstado.value)
  if (filtroPrioridad.value) params.append('prioridad', filtroPrioridad.value)

  try {
    const res = await apiFetch('/tickets?' + params.toString())
    if (res.ok) ticketsList.value = await res.json()
  } catch {}
  cargando.value = false
}

onMounted(() => cargarBandeja())
</script>

<style scoped>
.page-body { padding: 2rem; color: #c6d4df; }
h1 { text-align: center; color: #fff; font-size: 1.6rem; margin-bottom: 0.3rem; }
.subtitulo { text-align: center; color: #8f98a0; font-size: 0.9rem; margin-bottom: 1.5rem; }

.nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
.nav-btn {
  display: inline-block; padding: 0.5rem 1.2rem; background: #1b2838; color: #4caf50;
  border: 1px solid #4caf50; border-radius: 4px; text-decoration: none;
  font-weight: bold; font-size: 0.9rem; transition: background 0.2s, color 0.2s;
}
.nav-btn:hover { background: #4caf50; color: white; }

.filtros {
  display: flex; flex-wrap: wrap; gap: 0.7rem; justify-content: center;
  background: #2a475e; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;
}
.filtros input, .filtros select {
  padding: 0.55rem 0.8rem; background: #1b2838; border: 1px solid #3a5a6e;
  color: #c6d4df; border-radius: 4px; font-size: 0.9rem; min-width: 180px;
  transition: border-color 0.2s;
}
.filtros input:focus, .filtros select:focus { outline: none; border-color: #4caf50; }
.btn-filtro {
  padding: 0.55rem 1.2rem; background: #4caf50; color: white; border: none;
  border-radius: 4px; font-weight: bold; cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: 0 2px 6px rgba(76,175,80,0.35);
}
.btn-filtro:hover { background: #388e3c; transform: translateY(-1px); }

.bandeja { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
.ticket-card {
  background: #2a475e; border-radius: 8px; padding: 1.2rem; width: 270px;
  cursor: pointer; border: 1px solid transparent;
  transition: transform 0.15s, border-color 0.2s, box-shadow 0.2s;
}
.ticket-card:hover { transform: scale(1.03); border-color: #4caf50; box-shadow: 0 4px 16px rgba(76,175,80,0.2); }
.ticket-card h3 { margin: 0 0 0.5rem; color: #fff; font-size: 1rem; }
.ticket-card p { margin: 0.3rem 0; font-size: 0.88rem; color: #8f98a0; }
.ticket-card p strong { color: #c6d4df; }
.tag { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 12px; font-size: 0.78rem; font-weight: bold; margin: 0.3rem 0.2rem 0 0; }
.abierto { background: #1a5c1a; color: #4caf50; border: 1px solid #4caf50; }
.en_proceso { background: #5c4000; color: #f39c12; border: 1px solid #f39c12; }
.cerrado { background: #5c1a1a; color: #e74c3c; border: 1px solid #e74c3c; }
.p-baja { background: #1a3a1a; color: #81c784; border: 1px solid #4caf50; }
.p-media { background: #3a2e00; color: #ffd54f; border: 1px solid #f39c12; }
.p-alta { background: #3a1a1a; color: #ef9a9a; border: 1px solid #e74c3c; }
.creator { font-size: 0.8rem; color: #8f98a0; margin-top: 0.5rem; border-top: 1px solid #3a5a6e; padding-top: 0.5rem; }
.empty { text-align: center; color: #8f98a0; padding: 2rem; }
</style>
