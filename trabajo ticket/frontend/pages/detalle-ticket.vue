<template>
  <div class="page-body">
    <h1>Detalle de Ticket</h1>

    <div class="nav">
      <NuxtLink to="/tickets" class="nav-btn">Mis Tickets</NuxtLink>
      <NuxtLink v-if="esAdmin" to="/bandeja" class="nav-btn">Bandeja</NuxtLink>
      <NuxtLink to="/dashboard" class="nav-btn">Dashboard</NuxtLink>
    </div>

    <!-- Info ticket -->
    <div class="card" v-if="ticket">
      <div class="info-row"><span class="lbl">Titulo</span><span class="val">{{ ticket.titulo }}</span></div>
      <div class="info-row"><span class="lbl">Descripcion</span><span class="val">{{ ticket.descripcion }}</span></div>
      <div class="info-row"><span class="lbl">Categoria</span><span class="val">{{ ticket.categoria }}</span></div>
      <div class="info-row" v-if="ticket.Usuario && esAdmin"><span class="lbl">Creado por</span><span class="val">{{ ticket.Usuario.nombre }}</span></div>
      <div class="info-row">
        <span class="lbl">Estado</span>
        <span class="val"><span class="tag" :class="ticket.estado || 'abierto'">{{ (ticket.estado || 'abierto').replace('_', ' ') }}</span></span>
      </div>
      <div class="info-row" v-if="ticket.tiempo_resolucion"><span class="lbl">Tiempo resolucion</span><span class="val">{{ ticket.tiempo_resolucion }} min</span></div>
    </div>
    <div class="card" v-else><p style="color:#8f98a0">Cargando...</p></div>

    <!-- Cambiar estado (admin) -->
    <div class="card" v-if="esAdmin">
      <h2>Cambiar Estado</h2>
      <select v-model="nuevoEstado" @change="mostrarTiempo = nuevoEstado === 'cerrado'">
        <option value="abierto">Abierto</option>
        <option value="en_proceso">En Proceso</option>
        <option value="cerrado">Cerrado</option>
      </select>
      <div v-if="mostrarTiempo">
        <input type="number" v-model="tiempoResolucion" placeholder="Tiempo de resolucion (minutos)" />
      </div>
      <button class="btn btn-estado" @click="cambiarEstado">Aplicar cambio de estado</button>
      <p class="msg" :class="msgEstadoTipo">{{ msgEstado }}</p>
    </div>

    <!-- Comentarios -->
    <div class="card">
      <h2>Comentarios</h2>
      <div>
        <p v-if="comentarios.length === 0" style="color:#8f98a0">No hay comentarios aun.</p>
        <div v-else v-for="c in comentarios" :key="c.id" class="comentario">
          <p>{{ c.contenido }}</p>
          <small>Comentario #{{ c.id }}</small>
        </div>
      </div>
      <textarea v-model="nuevoComentario" placeholder="Escribe un comentario..." rows="3"></textarea>
      <button class="btn btn-guardar" @click="agregarComentario">Agregar comentario</button>
      <p class="msg" :class="msgComTipo">{{ msgCom }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const ticketId = route.query.id
const { apiFetch, getPayload } = useAuth()

const payload = getPayload()
const esAdmin = payload?.rol === 'admin' || payload?.rol === 'superadmin'

const ticket = ref(null)
const nuevoEstado = ref('abierto')
const mostrarTiempo = ref(false)
const tiempoResolucion = ref('')
const msgEstado = ref('')
const msgEstadoTipo = ref('')

const comentarios = ref([])
const nuevoComentario = ref('')
const msgCom = ref('')
const msgComTipo = ref('')

if (!ticketId) navigateTo('/tickets')

const cargarTicket = async () => {
  try {
    const res = await apiFetch('/tickets/' + ticketId)
    if (res.ok) {
      ticket.value = await res.json()
      nuevoEstado.value = ticket.value.estado || 'abierto'
      mostrarTiempo.value = ticket.value.estado === 'cerrado'
    }
  } catch {}
}

const cambiarEstado = async () => {
  const body = { estado: nuevoEstado.value }
  if (nuevoEstado.value === 'cerrado' && tiempoResolucion.value) {
    body.tiempo_resolucion = parseInt(tiempoResolucion.value)
  }
  try {
    const res = await apiFetch('/tickets/' + ticketId, { method: 'PUT', body })
    if (res.ok) {
      msgEstadoTipo.value = 'exito'
      msgEstado.value = 'Estado actualizado correctamente'
      cargarTicket()
    } else {
      const data = await res.json()
      msgEstadoTipo.value = 'error'
      msgEstado.value = data.message || 'Error al cambiar estado'
    }
  } catch {
    msgEstadoTipo.value = 'error'
    msgEstado.value = 'Error de conexion'
  }
}

const cargarComentarios = async () => {
  try {
    const res = await apiFetch('/comentarios?ticketId=' + ticketId)
    if (res.ok) comentarios.value = await res.json()
  } catch {}
}

const agregarComentario = async () => {
  if (!nuevoComentario.value.trim()) { msgComTipo.value = 'error'; msgCom.value = 'Escribe algo antes de comentar'; return }
  try {
    const res = await apiFetch('/comentarios', {
      method: 'POST',
      body: { contenido: nuevoComentario.value.trim(), ticketId: parseInt(ticketId) }
    })
    if (res.ok) {
      msgComTipo.value = 'exito'
      msgCom.value = 'Comentario agregado'
      nuevoComentario.value = ''
      cargarComentarios()
      setTimeout(() => { msgCom.value = '' }, 2000)
    } else {
      const data = await res.json()
      msgComTipo.value = 'error'
      msgCom.value = data.message || 'Error al comentar'
    }
  } catch {
    msgComTipo.value = 'error'
    msgCom.value = 'Error de conexion'
  }
}

onMounted(() => {
  cargarTicket()
  cargarComentarios()
})
</script>

<style scoped>
.page-body { padding: 2rem; color: #c6d4df; }
h1 { text-align: center; color: #fff; font-size: 1.5rem; margin-bottom: 1.5rem; }

.nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
.nav-btn {
  display: inline-block; padding: 0.5rem 1.2rem; background: #1b2838; color: #4caf50;
  border: 1px solid #4caf50; border-radius: 4px; text-decoration: none;
  font-weight: bold; font-size: 0.9rem; transition: background 0.2s, color 0.2s;
}
.nav-btn:hover { background: #4caf50; color: white; }

.card { background: #2a475e; padding: 1.5rem; border-radius: 8px; max-width: 620px; margin: 0 auto 1.5rem auto; }
.card h2 { color: #fff; margin-bottom: 1rem; font-size: 1.05rem; }
.info-row { display: flex; margin: 0.5rem 0; font-size: 0.92rem; }
.info-row .lbl { color: #8f98a0; min-width: 130px; }
.info-row .val { color: #c7d5e0; }
.tag { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 10px; font-size: 0.8rem; font-weight: bold; }
.abierto { background: #1a5c1a; color: #4caf50; border: 1px solid #4caf50; }
.en_proceso { background: #5c4000; color: #f39c12; border: 1px solid #f39c12; }
.cerrado { background: #5c1a1a; color: #e74c3c; border: 1px solid #e74c3c; }

select, input, textarea {
  width: 100%; padding: 0.6rem 0.8rem; background: #1b2838; border: 1px solid #3a5a6e;
  color: #c6d4df; border-radius: 4px; font-size: 0.95rem; margin-bottom: 1rem;
  transition: border-color 0.2s;
}
select:focus, input:focus, textarea:focus { outline: none; border-color: #4caf50; }
textarea { resize: vertical; }

.btn {
  padding: 0.65rem 1.3rem; border: none; border-radius: 4px; font-size: 0.95rem;
  font-weight: bold; cursor: pointer; transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
}
.btn-estado { background: #f39c12; color: white; box-shadow: 0 2px 6px rgba(243,156,18,0.35); }
.btn-estado:hover { background: #d68910; transform: translateY(-1px); }
.btn-guardar { background: #4caf50; color: white; box-shadow: 0 2px 6px rgba(76,175,80,0.35); }
.btn-guardar:hover { background: #388e3c; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.msg { margin-top: 0.7rem; font-size: 0.9rem; }
.exito { color: #90ee90; }
.error { color: #ff6b6b; }

.comentario { background: #1b2838; padding: 0.8rem 1rem; border-radius: 6px; margin-bottom: 0.7rem; border-left: 3px solid #4caf50; }
.comentario p { font-size: 0.9rem; }
.comentario small { color: #8f98a0; font-size: 0.78rem; }
</style>
