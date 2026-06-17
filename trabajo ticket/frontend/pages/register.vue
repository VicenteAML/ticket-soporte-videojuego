<template>
  <div class="page">
    <div class="card">
      <h2>Crear Cuenta</h2>

      <label for="nombre">Nombre</label>
      <input type="text" id="nombre" v-model="nombre" placeholder="Tu nombre completo" @keydown.enter="registrar" />
      <span class="campo-error" v-if="errores.nombre">{{ errores.nombre }}</span>

      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" placeholder="correo@ejemplo.com" @keydown.enter="registrar" />
      <span class="campo-error" v-if="errores.email">{{ errores.email }}</span>

      <label for="password">Contrasena</label>
      <input type="password" id="password" v-model="password" placeholder="Minimo 6 caracteres" @keydown.enter="registrar" />
      <span class="campo-error" v-if="errores.password">{{ errores.password }}</span>

      <button class="btn" @click="registrar">Crear Cuenta</button>

      <div class="mensaje" :class="mensajeTipo">{{ mensaje }}</div>
      <div class="link">Ya tienes cuenta? <NuxtLink to="/login">Iniciar sesion</NuxtLink></div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useAuth()

const nombre = ref('')
const email = ref('')
const password = ref('')
const mensaje = ref('')
const mensajeTipo = ref('')
const errores = ref({})

const registrar = async () => {
  errores.value = {}
  mensaje.value = ''
  let hayError = false

  if (!nombre.value.trim()) { errores.value.nombre = 'El nombre es obligatorio'; hayError = true }
  if (!email.value.trim()) { errores.value.email = 'El email es obligatorio'; hayError = true }
  if (!password.value) { errores.value.password = 'La contrasena es obligatoria'; hayError = true }
  else if (password.value.length < 6) { errores.value.password = 'Minimo 6 caracteres'; hayError = true }
  if (hayError) return

  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: { nombre: nombre.value.trim(), email: email.value.trim(), password: password.value }
    })
    const data = await res.json()

    if (res.ok) {
      mensajeTipo.value = 'exito'
      mensaje.value = 'Cuenta creada. Redirigiendo al login...'
      setTimeout(() => navigateTo('/login'), 1500)
    } else {
      mensajeTipo.value = 'error'
      mensaje.value = data.message || 'No se pudo crear la cuenta'
    }
  } catch {
    mensajeTipo.value = 'error'
    mensaje.value = 'Error de conexion'
  }
}
</script>

<style scoped>
.page { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.card { background: #2a475e; padding: 2rem; border-radius: 8px; width: 100%; max-width: 400px; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
h2 { color: #c7d5e0; text-align: center; margin-bottom: 1.5rem; font-size: 1.4rem; letter-spacing: 0.5px; }
label { color: #8f98a0; font-size: 0.85rem; display: block; margin-bottom: 0.3rem; }
input {
  width: 100%; padding: 0.65rem 0.8rem; border: 1px solid #3a5a6e; border-radius: 4px;
  background: #1b2838; color: #fff; margin-bottom: 0.3rem; font-size: 0.95rem;
  transition: border-color 0.2s;
}
input:focus { outline: none; border-color: #4caf50; }
.campo-error { color: #ff6b6b; font-size: 0.8rem; margin-bottom: 0.8rem; display: block; }
.btn {
  width: 100%; padding: 0.75rem; background: #4caf50; color: white; border: none;
  border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer;
  letter-spacing: 0.5px; margin-top: 0.5rem;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(76,175,80,0.4);
}
.btn:hover { background: #388e3c; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(76,175,80,0.5); }
.btn:active { transform: translateY(0); }
.mensaje { margin-top: 1rem; text-align: center; font-size: 0.9rem; min-height: 1.2rem; }
.error { color: #ff6b6b; }
.exito { color: #90ee90; }
.link { margin-top: 1rem; text-align: center; font-size: 0.85rem; color: #8f98a0; }
.link a { color: #4caf50; text-decoration: none; }
.link a:hover { text-decoration: underline; }
</style>
