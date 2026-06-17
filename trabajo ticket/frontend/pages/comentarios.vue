<template>
  <div class="page-body">
    <h1>Comentarios</h1>

    <div class="nav">
      <NuxtLink to="/dashboard" class="nav-btn">Volver al Dashboard</NuxtLink>
      <NuxtLink to="/tickets" class="nav-btn">Mis Tickets</NuxtLink>
    </div>

    <!-- Formulario comentario -->
    <div class="form-card">
      <h2>Nuevo comentario</h2>
      <div class="ticket-sel" :class="{ vacio: !ticketSelId }">
        {{ ticketSelId ? 'Ticket seleccionado: #' + ticketSelId + ' — ' + ticketSelNombre : 'Selecciona un ticket de la tabla de abajo' }}
      </div>
      <textarea v-model="contenido" rows="3" placeholder="Escribe tu comentario..."></textarea>
      <div class="btn-row">
        <button class="btn btn-guardar" @click="guardar">Guardar comentario</button>
        <button class="btn btn-cancelar" @click="limpiar">Cancelar</button>
      </div>
      <p class="msg" :class="msgTipo">{{ msgForm }}</p>
    </div>

    <!-- Filtros tickets -->
    <p class="seccion-titulo">Seleccionar ticket</p>
    <p class="seccion-sub">Haz clic en una fila para seleccionar el ticket al que quieres comentar</p>
    <div class="filtros">
      <input type="text" v-model="buscarTitulo" placeholder="Buscar por titulo..." @keydown.enter="cargarTickets" />
      <select v-model="filtroEstado" @change="cargarTickets">
        <option value="">Todos los estados</option>
        <option value="abierto">Abierto</option>
        <option value="en_proceso">En Proceso</option>
        <option value="cerrado">Cerrado</option>
      </select>
      <select v-model="filtroPrioridad" @change="cargarTickets">
        <option value="">Todas las prioridades</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
      <button class="btn-filtro" @click="cargarTickets">Buscar</button>
    </div>

    <!-- Tabla tickets -->
    <div class="tabla-wrap">
      <table>
        <thead><tr><th>#</th><th>Titulo</th><th>Estado</th><th>Categoria</th></tr></thead>
        <tbody>
          <tr v-if="ticketsList.length === 0" class="empty-row"><td colspan="4">No hay tickets</td></tr>
          <tr v-else v-for="t in ticketsList" :key="t.id"
              class="ticket-row" :class="{ seleccionado: ticketSelId === t.id }"
              @click="seleccionarTicket(t)">
            <td>{{ t.id }}</td>
            <td>{{ t.titulo }}</td>
            <td><span class="tag" :class="t.estado || 'abierto'">{{ (t.estado || 'abierto').replace('_', ' ') }}</span></td>
            <td>{{ t.categoria }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tabla comentarios -->
    <div class="seccion-com">
      <p class="seccion-titulo" style="margin-top:1rem">Comentarios registrados</p>
      <div class="tabla-wrap">
        <table>
          <thead><tr><th>#</th><th>Ticket</th><th>Contenido</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr v-if="comentariosList.length === 0" class="empty-row"><td colspan="4">No hay comentarios registrados</td></tr>
            <tr v-else v-for="c in comentariosList" :key="c.id">
              <td>{{ c.id }}</td>
              <td>#{{ c.ticketId }}</td>
              <td>{{ c.contenido }}</td>
              <td>
                <button class="btn-editar" @click="editarComentario(c)">Editar</button>
                <button class="btn-eliminar" @click="eliminarComentario(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { apiFetch } = useAuth()

const contenido = ref('')
const editId = ref(null)
const ticketSelId = ref(null)
const ticketSelNombre = ref('')
const msgForm = ref('')
const msgTipo = ref('')

const buscarTitulo = ref('')
const filtroEstado = ref('')
const filtroPrioridad = ref('')
const ticketsList = ref([])
const comentariosList = ref([])

const seleccionarTicket = (t) => {
  ticketSelId.value = t.id
  ticketSelNombre.value = t.titulo
}

const cargarTickets = async () => {
  const params = new URLSearchParams()
  if (filtroEstado.value) params.append('estado', filtroEstado.value)
  if (filtroPrioridad.value) params.append('prioridad', filtroPrioridad.value)

  try {
    const res = await apiFetch('/tickets?' + params.toString())
    if (res.ok) {
      let data = await res.json()
      if (buscarTitulo.value.trim()) {
        const q = buscarTitulo.value.trim().toLowerCase()
        data = data.filter(t => t.titulo.toLowerCase().includes(q))
      }
      ticketsList.value = data
    }
  } catch {}
}

const cargarComentarios = async () => {
  try {
    const res = await apiFetch('/comentarios')
    if (res.ok) comentariosList.value = await res.json()
  } catch {}
}

const guardar = async () => {
  msgForm.value = ''
  if (!contenido.value.trim()) { msgTipo.value = 'error-msg'; msgForm.value = 'El contenido es obligatorio'; return }
  if (!editId.value && !ticketSelId.value) { msgTipo.value = 'error-msg'; msgForm.value = 'Selecciona un ticket de la tabla'; return }

  const body = editId.value
    ? { contenido: contenido.value.trim() }
    : { contenido: contenido.value.trim(), ticketId: ticketSelId.value }
  const url = editId.value ? '/comentarios/' + editId.value : '/comentarios'
  const method = editId.value ? 'PUT' : 'POST'

  try {
    const res = await apiFetch(url, { method, body })
    if (res.ok) {
      msgTipo.value = 'exito'
      msgForm.value = editId.value ? 'Comentario actualizado' : 'Comentario creado'
      limpiar()
      cargarComentarios()
    } else {
      const data = await res.json()
      msgTipo.value = 'error-msg'
      msgForm.value = data.message || 'Error al guardar'
    }
  } catch {
    msgTipo.value = 'error-msg'
    msgForm.value = 'Error de conexion'
  }
}

const editarComentario = (c) => {
  editId.value = c.id
  contenido.value = c.contenido
  ticketSelId.value = c.ticketId
  ticketSelNombre.value = 'Editando comentario #' + c.id
}

const eliminarComentario = async (id) => {
  if (!confirm('Eliminar este comentario?')) return
  try {
    const res = await apiFetch('/comentarios/' + id, { method: 'DELETE' })
    if (res.ok) { msgTipo.value = 'exito'; msgForm.value = 'Comentario eliminado'; cargarComentarios() }
    else { msgTipo.value = 'error-msg'; msgForm.value = 'Error al eliminar' }
  } catch {}
}

const limpiar = () => {
  editId.value = null
  contenido.value = ''
  ticketSelId.value = null
  ticketSelNombre.value = ''
  msgForm.value = ''
}

onMounted(() => {
  cargarTickets()
  cargarComentarios()
})
</script>

<style scoped>
.page-body { padding: 2rem; color: #c6d4df; }
h1 { text-align: center; color: #fff; font-size: 1.6rem; margin-bottom: 1.5rem; }

.nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
.nav-btn {
  display: inline-block; padding: 0.5rem 1.2rem; background: #1b2838; color: #4caf50;
  border: 1px solid #4caf50; border-radius: 4px; text-decoration: none;
  font-weight: bold; font-size: 0.9rem; transition: background 0.2s, color 0.2s;
}
.nav-btn:hover { background: #4caf50; color: white; }

.form-card { background: #2a475e; padding: 1.5rem; border-radius: 8px; max-width: 640px; margin: 0 auto 2rem auto; }
.form-card h2 { color: #fff; margin-bottom: 1rem; font-size: 1.05rem; }
.ticket-sel { padding: 0.6rem 0.8rem; color: #4caf50; font-size: 0.9rem; margin-bottom: 1rem; }
.ticket-sel.vacio { color: #8f98a0; }
textarea {
  width: 100%; padding: 0.6rem 0.8rem; background: #1b2838; border: 1px solid #3a5a6e;
  color: #c6d4df; border-radius: 4px; font-size: 0.95rem; resize: vertical;
  transition: border-color 0.2s;
}
textarea:focus { outline: none; border-color: #4caf50; }
.btn-row { display: flex; gap: 0.7rem; margin-top: 0.8rem; }
.btn {
  padding: 0.65rem 1.3rem; border: none; border-radius: 4px; font-size: 0.95rem;
  font-weight: bold; cursor: pointer; transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
}
.btn-guardar { background: #4caf50; color: white; box-shadow: 0 2px 6px rgba(76,175,80,0.35); }
.btn-guardar:hover { background: #388e3c; transform: translateY(-1px); }
.btn-cancelar { background: #3a5a6e; color: #c6d4df; }
.btn-cancelar:hover { background: #4a7a8e; }
.msg { margin-top: 0.7rem; font-size: 0.9rem; }
.exito { color: #90ee90; }
.error-msg { color: #ff6b6b; }

.seccion-titulo { font-size: 1rem; color: #fff; font-weight: bold; margin: 0 0 0.8rem 0; text-align: center; }
.seccion-sub { font-size: 0.8rem; color: #8f98a0; text-align: center; margin-bottom: 1rem; }
.filtros {
  display: flex; flex-wrap: wrap; gap: 0.7rem; justify-content: center;
  background: #2a475e; padding: 1rem; border-radius: 8px; max-width: 640px; margin: 0 auto 1rem auto;
}
.filtros input, .filtros select {
  padding: 0.55rem 0.8rem; background: #1b2838; border: 1px solid #3a5a6e;
  color: #c6d4df; border-radius: 4px; font-size: 0.9rem; min-width: 170px;
  transition: border-color 0.2s;
}
.filtros input:focus, .filtros select:focus { outline: none; border-color: #4caf50; }
.btn-filtro {
  padding: 0.55rem 1.2rem; background: #4caf50; color: white; border: none;
  border-radius: 4px; font-weight: bold; cursor: pointer;
  box-shadow: 0 2px 6px rgba(76,175,80,0.35); transition: background 0.2s, transform 0.1s;
}
.btn-filtro:hover { background: #388e3c; transform: translateY(-1px); }

.tabla-wrap { max-width: 760px; margin: 0 auto 2.5rem auto; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { background: #2a475e; padding: 0.7rem 0.8rem; text-align: left; font-size: 0.85rem; color: #8f98a0; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 0.65rem 0.8rem; border-bottom: 1px solid #2a475e; font-size: 0.9rem; }
tr.ticket-row { cursor: pointer; transition: background 0.15s; }
tr.ticket-row:hover { background: #2a475e; }
tr.ticket-row.seleccionado { background: #1a3d1a; border-left: 3px solid #4caf50; }
.tag { display: inline-block; padding: 0.15rem 0.6rem; border-radius: 10px; font-size: 0.78rem; font-weight: bold; }
.abierto { background: #1a5c1a; color: #4caf50; border: 1px solid #4caf50; }
.en_proceso { background: #5c4000; color: #f39c12; border: 1px solid #f39c12; }
.cerrado { background: #5c1a1a; color: #e74c3c; border: 1px solid #e74c3c; }

.seccion-com { max-width: 760px; margin: 0 auto; }
.btn-editar { background: #2a5a8e; color: white; padding: 0.3rem 0.7rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.82rem; margin-right: 0.3rem; transition: background 0.2s; }
.btn-editar:hover { background: #1a4a7e; }
.btn-eliminar { background: #7e1a1a; color: white; padding: 0.3rem 0.7rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.82rem; transition: background 0.2s; }
.btn-eliminar:hover { background: #a02020; }
.empty-row td { color: #8f98a0; font-style: italic; }
</style>
