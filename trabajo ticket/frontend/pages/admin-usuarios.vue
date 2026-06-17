<template>
  <div class="page-body">
    <h1>Gestion de Usuarios</h1>
    <p class="subtitulo">Panel exclusivo de superadmin</p>

    <div class="nav">
      <NuxtLink to="/dashboard" class="nav-btn">Volver al Dashboard</NuxtLink>
    </div>

    <div class="aviso-sup">
      El rol <strong>superadmin</strong> solo se puede asignar directamente en el codigo (variable de entorno <code>SUPERADMIN_EMAIL</code>). Desde aqui puedes promover o degradar usuarios entre <strong>admin</strong> y <strong>usuario</strong>.
    </div>

    <p class="msg-global" :class="msgTipo">{{ msgGlobal }}</p>

    <div class="tabla-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol actual</th><th>Accion</th></tr>
        </thead>
        <tbody>
          <tr v-if="usuarios.length === 0" class="empty-row"><td colspan="5">Cargando usuarios...</td></tr>
          <tr v-else v-for="u in usuarios" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>
              <span class="badge" :class="'badge-' + u.rol">{{ u.rol }}</span>
            </td>
            <td>
              <template v-if="u.rol === 'superadmin' || u.id === myId">
                <span style="color:#8f98a0;font-size:0.82rem">{{ u.id === myId ? 'Eres tu' : 'No editable' }}</span>
              </template>
              <template v-else-if="u.rol === 'admin'">
                <button class="btn-rol btn-quitar-admin" @click="cambiarRol(u.id, 'usuario')">Quitar Admin</button>
              </template>
              <template v-else>
                <button class="btn-rol btn-hacer-admin" @click="cambiarRol(u.id, 'admin')">Hacer Admin</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'superadmin' })

const { apiFetch, getPayload } = useAuth()
const payload = getPayload()
const myId = payload?.sub || payload?.id

const usuarios = ref([])
const msgGlobal = ref('')
const msgTipo = ref('')

const cargarUsuarios = async () => {
  try {
    const res = await apiFetch('/admin/usuarios')
    if (res.ok) usuarios.value = await res.json()
  } catch {}
}

const cambiarRol = async (id, nuevoRol) => {
  try {
    const res = await apiFetch('/admin/usuarios/' + id + '/rol', {
      method: 'PUT',
      body: { rol: nuevoRol }
    })
    const data = await res.json()
    if (res.ok) {
      msgTipo.value = 'exito'
      msgGlobal.value = data.message
      cargarUsuarios()
    } else {
      msgTipo.value = 'error'
      msgGlobal.value = data.message || 'Error al actualizar rol'
    }
    setTimeout(() => { msgGlobal.value = '' }, 2500)
  } catch {}
}

onMounted(() => cargarUsuarios())
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

.msg-global { text-align: center; margin-bottom: 1rem; font-size: 0.9rem; min-height: 1.2rem; }
.exito { color: #90ee90; }
.error { color: #ff6b6b; }

.tabla-wrap { max-width: 860px; margin: 0 auto; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { background: #2a475e; padding: 0.75rem 1rem; text-align: left; font-size: 0.82rem; color: #8f98a0; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 0.7rem 1rem; border-bottom: 1px solid #2a475e; font-size: 0.9rem; vertical-align: middle; }
tr:hover { background: #232f3e; }

.badge { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 10px; font-size: 0.78rem; font-weight: bold; }
.badge-usuario { background: #1b3a5c; color: #4a90d9; border: 1px solid #4a90d9; }
.badge-admin { background: #3a2e00; color: #f39c12; border: 1px solid #f39c12; }
.badge-superadmin { background: #2e0a3a; color: #bb8fce; border: 1px solid #9b59b6; }

.btn-rol {
  padding: 0.35rem 0.9rem; border: none; border-radius: 4px; font-size: 0.82rem;
  font-weight: bold; cursor: pointer; transition: background 0.2s, transform 0.1s;
}
.btn-hacer-admin { background: #4a6e1a; color: white; }
.btn-hacer-admin:hover { background: #5a8e20; transform: translateY(-1px); }
.btn-quitar-admin { background: #5c3a00; color: #ffd54f; }
.btn-quitar-admin:hover { background: #7c4e00; transform: translateY(-1px); }

.aviso-sup { background: #2e0a3a; border: 1px solid #9b59b6; border-radius: 6px; padding: 0.8rem 1.2rem; max-width: 860px; margin: 0 auto 1.5rem auto; color: #bb8fce; font-size: 0.88rem; }
.empty-row td { color: #8f98a0; font-style: italic; }
</style>
