<template>
  <div class="page">
    <div class="card">
      <h2>Restablecer Contrasena</h2>

      <!-- PASO 1: Solicitar token -->
      <div v-if="paso === 1">
        <p class="instruccion">Ingresa tu email. Se generara un token de verificacion que aparecera en la terminal del servidor.</p>

        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="correo@ejemplo.com" @keydown.enter="solicitarToken" />
        <span class="campo-error" v-if="errores.email">{{ errores.email }}</span>

        <button class="btn" @click="solicitarToken">Solicitar Token</button>
      </div>

      <!-- PASO 2: Ingresar token y nueva contrasena -->
      <div v-if="paso === 2">
        <p class="instruccion">Revisa la terminal del servidor. Copia el token y pegalo aqui junto con tu nueva contrasena.</p>

        <label for="token">Token de verificacion</label>
        <input type="text" id="token" v-model="token" placeholder="Pega el token aqui" />
        <span class="campo-error" v-if="errores.token">{{ errores.token }}</span>

        <label for="newPassword">Nueva contrasena</label>
        <input type="password" id="newPassword" v-model="newPassword" placeholder="Minimo 6 caracteres" />
        <span class="campo-error" v-if="errores.newPassword">{{ errores.newPassword }}</span>

        <label for="confirmPassword">Confirmar contrasena</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Repite la contrasena" @keydown.enter="resetear" />
        <span class="campo-error" v-if="errores.confirmPassword">{{ errores.confirmPassword }}</span>

        <button class="btn" @click="resetear">Restablecer Contrasena</button>
      </div>

      <div class="mensaje" :class="mensajeTipo">{{ mensaje }}</div>
      <div class="link"><NuxtLink to="/login">Volver al login</NuxtLink></div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useAuth()

const paso = ref(1)
const email = ref('')
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const mensaje = ref('')
const mensajeTipo = ref('')
const errores = ref({})

const solicitarToken = async () => {
  errores.value = {}
  mensaje.value = ''

  if (!email.value.trim()) { errores.value.email = 'El email es obligatorio'; return }

  try {
    const res = await apiFetch('/password/forgot', {
      method: 'POST',
      body: { email: email.value.trim() }
    })
    const data = await res.json()

    if (res.ok) {
      mensajeTipo.value = 'exito'
      mensaje.value = data.message || 'Token generado. Revisa la terminal del servidor.'
      paso.value = 2
    } else {
      mensajeTipo.value = 'error'
      mensaje.value = data.message || 'Error al solicitar token'
    }
  } catch {
    mensajeTipo.value = 'error'
    mensaje.value = 'Error de conexion'
  }
}

const resetear = async () => {
  errores.value = {}
  mensaje.value = ''
  let hayError = false

  if (!token.value.trim()) { errores.value.token = 'El token es obligatorio'; hayError = true }
  if (!newPassword.value) { errores.value.newPassword = 'La contrasena es obligatoria'; hayError = true }
  else if (newPassword.value.length < 6) { errores.value.newPassword = 'Minimo 6 caracteres'; hayError = true }
  if (newPassword.value !== confirmPassword.value) { errores.value.confirmPassword = 'Las contrasenas no coinciden'; hayError = true }
  if (hayError) return

  try {
    const res = await apiFetch('/password/reset', {
      method: 'POST',
      body: { email: email.value.trim(), token: token.value.trim(), newPassword: newPassword.value }
    })
    const data = await res.json()

    if (res.ok) {
      mensajeTipo.value = 'exito'
      mensaje.value = 'Contrasena restablecida. Redirigiendo al login...'
      setTimeout(() => navigateTo('/login'), 2000)
    } else {
      mensajeTipo.value = 'error'
      mensaje.value = data.message || 'Error al restablecer contrasena'
    }
  } catch {
    mensajeTipo.value = 'error'
    mensaje.value = 'Error de conexion'
  }
}
</script>

<style scoped>
.page { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.card { background: #2a475e; padding: 2rem; border-radius: 8px; width: 100%; max-width: 440px; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
h2 { color: #c7d5e0; text-align: center; margin-bottom: 1rem; font-size: 1.4rem; letter-spacing: 0.5px; }
.instruccion { color: #8f98a0; font-size: 0.88rem; margin-bottom: 1.2rem; line-height: 1.5; }
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
