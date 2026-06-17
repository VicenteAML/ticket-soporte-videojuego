<template>
  <div class="page">
    <div class="card">
      <div class="logo">TICKET SOPORTE</div>
      <p class="bienvenida">Bienvenido, <span>{{ nombreUsuario }}</span></p>

      <div class="seccion-titulo">Menu principal</div>
      <div class="menu">
        <NuxtLink to="/tickets" class="nav-btn">Mis Tickets</NuxtLink>
        <NuxtLink to="/comentarios" class="nav-btn">Comentarios</NuxtLink>
      </div>

      <div v-if="esAdmin">
        <div class="seccion-titulo">Administracion</div>
        <div class="menu">
          <NuxtLink to="/bandeja" class="nav-btn admin-btn">Bandeja de Tickets</NuxtLink>
          <NuxtLink to="/estadisticas" class="nav-btn admin-btn">Estadisticas de Pagina</NuxtLink>
        </div>
      </div>

      <div v-if="esSuperadmin">
        <div class="seccion-titulo">Superadmin</div>
        <div class="menu">
          <NuxtLink to="/admin-usuarios" class="nav-btn superadmin-btn">Gestionar Usuarios</NuxtLink>
        </div>
      </div>

      <hr class="divider" />
      <button class="btn-logout" @click="logout">Cerrar Sesion</button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { getPayload, logout } = useAuth()

const payload = getPayload()
const nombreUsuario = payload?.nombre || payload?.email || 'Usuario'
const esAdmin = payload?.rol === 'admin' || payload?.rol === 'superadmin'
const esSuperadmin = payload?.rol === 'superadmin'
</script>

<style scoped>
.page { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.card { background: #2a475e; padding: 2.5rem 2rem; border-radius: 8px; width: 100%; max-width: 380px; box-shadow: 0 4px 24px rgba(0,0,0,0.6); text-align: center; }
.logo { font-size: 2rem; color: #4caf50; font-weight: bold; margin-bottom: 0.3rem; letter-spacing: 1px; }
.bienvenida { color: #8f98a0; font-size: 0.95rem; margin-bottom: 1.8rem; }
.bienvenida span { color: #c7d5e0; font-weight: bold; }
.seccion-titulo { color: #8f98a0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.6rem; text-align: left; }
.menu { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem; }
.nav-btn {
  display: block; padding: 0.75rem 1rem; background: #1b2838; color: #c7d5e0;
  border: 1px solid #4caf50; border-radius: 4px; text-decoration: none;
  font-weight: bold; font-size: 0.95rem; text-align: center;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.nav-btn:hover { background: #4caf50; color: white; box-shadow: 0 2px 10px rgba(76,175,80,0.4); }
.nav-btn.admin-btn { border-color: #f39c12; color: #f39c12; }
.nav-btn.admin-btn:hover { background: #f39c12; color: white; box-shadow: 0 2px 10px rgba(243,156,18,0.4); }
.nav-btn.superadmin-btn { border-color: #9b59b6; color: #bb8fce; }
.nav-btn.superadmin-btn:hover { background: #9b59b6; color: white; box-shadow: 0 2px 10px rgba(155,89,182,0.4); }
.btn-logout {
  width: 100%; padding: 0.75rem; background: #e74c3c; color: white; border: none;
  border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer;
  margin-top: 0.5rem; letter-spacing: 0.5px;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(231,76,60,0.4);
}
.btn-logout:hover { background: #c0392b; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(231,76,60,0.5); }
.btn-logout:active { transform: translateY(0); }
.divider { border: none; border-top: 1px solid #3a5a6e; margin: 1rem 0; }
</style>
