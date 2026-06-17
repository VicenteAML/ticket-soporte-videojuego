<template>
  <div class="page-body">
    <h1>Estadisticas de Pagina</h1>
    <p class="subtitulo">Resumen general del sistema de soporte</p>

    <div class="nav">
      <NuxtLink to="/dashboard" class="nav-btn">Volver al Dashboard</NuxtLink>
      <NuxtLink to="/bandeja" class="nav-btn">Bandeja de Tickets</NuxtLink>
    </div>

    <div v-if="cargando"><p style="text-align:center;color:#8f98a0">Cargando estadisticas...</p></div>
    <div v-else-if="errorMsg"><p class="error-text">{{ errorMsg }}</p></div>
    <div v-else>
      <p class="seccion-titulo">Totales del sistema</p>
      <div class="grid">
        <div class="metric total"><div class="etiqueta">Total Tickets</div><div class="valor">{{ metricas.totalTickets }}</div></div>
        <div class="metric abierto-card"><div class="etiqueta">Tickets Activos</div><div class="valor">{{ metricas.abiertosTotales }}</div></div>
      </div>
      <p class="seccion-titulo">Tickets activos por prioridad</p>
      <div class="grid">
        <div class="metric baja"><div class="etiqueta">Prioridad Baja</div><div class="valor">{{ metricas.abiertosPorPrioridad.baja }}</div></div>
        <div class="metric media"><div class="etiqueta">Prioridad Media</div><div class="valor">{{ metricas.abiertosPorPrioridad.media }}</div></div>
        <div class="metric alta"><div class="etiqueta">Prioridad Alta</div><div class="valor">{{ metricas.abiertosPorPrioridad.alta }}</div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })

const { apiFetch } = useAuth()

const metricas = ref({})
const cargando = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const res = await apiFetch('/tickets/metricas')
    if (res.ok) {
      metricas.value = await res.json()
    } else {
      errorMsg.value = 'Error al cargar estadisticas'
    }
  } catch {
    errorMsg.value = 'Error de conexion'
  }
  cargando.value = false
})
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

.grid { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; margin-top: 1rem; }
.metric {
  background: #2a475e; padding: 1.8rem 1.5rem; border-radius: 8px; width: 200px;
  text-align: center; transition: transform 0.15s;
}
.metric:hover { transform: translateY(-3px); }
.metric .valor { font-size: 3rem; font-weight: bold; color: #fff; margin: 0.5rem 0; }
.metric .etiqueta { font-size: 0.85rem; color: #8f98a0; text-transform: uppercase; letter-spacing: 0.5px; }
.total { border-bottom: 4px solid #4caf50; }
.abierto-card { border-bottom: 4px solid #4a90d9; }
.baja { border-bottom: 4px solid #4caf50; }
.media { border-bottom: 4px solid #f39c12; }
.alta { border-bottom: 4px solid #e74c3c; }
.seccion-titulo { text-align: center; color: #8f98a0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin: 2rem 0 0.8rem; }
.error-text { color: #ff6b6b; text-align: center; padding: 1rem; }
</style>
