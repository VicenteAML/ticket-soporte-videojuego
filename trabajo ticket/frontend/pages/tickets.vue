<template>
  <div class="page-body">
    <div class="nav">
      <NuxtLink to="/dashboard" class="nav-btn">Volver al Dashboard</NuxtLink>
      <NuxtLink to="/comentarios" class="nav-btn">Comentarios</NuxtLink>
    </div>

    <h1 class="page-title">Mis Tickets</h1>
    <p class="page-sub">Gestiona y crea tus tickets de soporte</p>

    <div class="form-card">
      <h2>Crear nuevo ticket</h2>

      <label>Titulo</label>
      <input type="text" v-model="titulo" placeholder="Describe brevemente el problema" />

      <label>Descripcion</label>
      <textarea v-model="descripcion" rows="3" placeholder="Detalla el problema..."></textarea>

      <label>Categoria</label>
      <input type="text" v-model="categoria" placeholder="Ej: Error de juego, Cuenta, Pago..." />

      <button class="btn" @click="crearTicket">Enviar Ticket</button>
      <p class="msg" :class="msgTipo">{{ msgForm }}</p>
    </div>

    <p class="lista-titulo">Historial de tickets enviados</p>
    <div class="tickets-grid">
      <p v-if="cargando" class="empty">Cargando...</p>
      <p v-else-if="tickets.length === 0" class="empty">Aun no tienes tickets creados.</p>
      <div v-else v-for="t in tickets" :key="t.id" class="ticket-card" @click="navigateTo('/detalle-ticket?id=' + t.id)">
        <h3>{{ t.titulo }}</h3>
        <p>{{ t.descripcion }}</p>
        <p><strong>Cat:</strong> {{ t.categoria }}</p>
        <span class="tag" :class="t.estado || 'abierto'">{{ (t.estado || 'abierto').replace('_', ' ') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { apiFetch } = useAuth()

const titulo = ref('')
const descripcion = ref('')
const categoria = ref('')
const msgForm = ref('')
const msgTipo = ref('')
const tickets = ref([])
const cargando = ref(true)

const cargarTickets = async () => {
  try {
    const res = await apiFetch('/tickets')
    if (res.ok) {
      tickets.value = await res.json()
    }
  } catch {}
  cargando.value = false
}

const crearTicket = async () => {
  if (!titulo.value.trim() || !descripcion.value.trim() || !categoria.value.trim()) {
    msgTipo.value = 'error'
    msgForm.value = 'Completa todos los campos antes de enviar'
    return
  }

  try {
    const res = await apiFetch('/tickets', {
      method: 'POST',
      body: { titulo: titulo.value.trim(), descripcion: descripcion.value.trim(), categoria: categoria.value.trim() }
    })
    const data = await res.json()

    if (res.ok) {
      msgTipo.value = 'exito'
      msgForm.value = 'Ticket creado correctamente'
      titulo.value = ''
      descripcion.value = ''
      categoria.value = ''
      cargarTickets()
      setTimeout(() => { msgForm.value = '' }, 2500)
    } else {
      msgTipo.value = 'error'
      msgForm.value = data.message || 'Error al crear ticket'
    }
  } catch {
    msgTipo.value = 'error'
    msgForm.value = 'Error de conexion'
  }
}

onMounted(() => cargarTickets())
</script>

<style scoped>
.page-body { padding: 2rem; color: #c6d4df; }

.nav { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; }
.nav-btn {
  display: inline-block; padding: 0.5rem 1.2rem; background: #1b2838; color: #4caf50;
  border: 1px solid #4caf50; border-radius: 4px; text-decoration: none;
  font-weight: bold; font-size: 0.9rem; transition: background 0.2s, color 0.2s;
}
.nav-btn:hover { background: #4caf50; color: white; }

.page-title { text-align: center; font-size: 2rem; color: #fff; font-weight: bold; margin-bottom: 0.4rem; }
.page-sub { text-align: center; color: #8f98a0; margin-bottom: 2rem; font-size: 0.95rem; }

.form-card { background: #2a475e; padding: 1.5rem; border-radius: 8px; max-width: 560px; margin: 0 auto 2.5rem auto; }
.form-card h2 { color: #fff; margin-bottom: 1rem; font-size: 1.1rem; }
label { color: #8f98a0; font-size: 0.85rem; display: block; margin-bottom: 0.3rem; }
input, textarea {
  width: 100%; padding: 0.6rem 0.8rem; background: #1b2838; border: 1px solid #3a5a6e;
  color: #c6d4df; border-radius: 4px; font-size: 0.95rem; margin-bottom: 1rem;
  transition: border-color 0.2s;
}
input:focus, textarea:focus { outline: none; border-color: #4caf50; }
textarea { resize: vertical; }

.btn {
  padding: 0.7rem 1.4rem; background: #4caf50; color: white; border: none;
  border-radius: 4px; font-size: 0.95rem; font-weight: bold; cursor: pointer;
  letter-spacing: 0.4px; transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(76,175,80,0.35);
}
.btn:hover { background: #388e3c; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,80,0.5); }
.btn:active { transform: translateY(0); }

.msg { margin-top: 0.8rem; font-size: 0.9rem; }
.exito { color: #90ee90; }
.error { color: #ff6b6b; }

.lista-titulo { font-size: 1.3rem; color: #fff; text-align: center; margin-bottom: 1rem; }
.tickets-grid { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
.ticket-card {
  background: #2a475e; border-radius: 8px; padding: 1.2rem; width: 260px;
  cursor: pointer; border: 1px solid transparent;
  transition: transform 0.15s, border-color 0.2s, box-shadow 0.2s;
}
.ticket-card:hover { transform: scale(1.03); border-color: #4caf50; box-shadow: 0 4px 16px rgba(76,175,80,0.2); }
.ticket-card h3 { color: #fff; font-size: 0.95rem; margin-bottom: 0.5rem; }
.ticket-card p { font-size: 0.85rem; color: #8f98a0; margin: 0.2rem 0; }
.tag { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 12px; font-size: 0.78rem; font-weight: bold; margin-top: 0.4rem; }
.abierto { background: #1a5c1a; color: #4caf50; border: 1px solid #4caf50; }
.en_proceso { background: #5c4000; color: #f39c12; border: 1px solid #f39c12; }
.cerrado { background: #5c1a1a; color: #e74c3c; border: 1px solid #e74c3c; }
.empty { text-align: center; color: #8f98a0; padding: 2rem; }
</style>
