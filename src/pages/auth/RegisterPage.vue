<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form ref="registerForm">
        <h2 class="text-center">Register</h2>
        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Email must be filled in.',
          ]"
        />

        <q-input
          filled
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          @keyup.enter="performRegister"
          :rules="[
            (val) => (val && val.length > 0) || 'Password must be filled in.',
            (val) => (val && val.length >= 10) || 'Password must have at least 10 characters.'
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-banner v-if="errorMessage" inline-actions class="text-white bg-red">
          {{ errorMessage }}
        </q-banner>

        <div class="q-mt-md">
          <q-btn color="primary" label="Register" @click="performRegister" :loading="wait" class="full-width" />
        </div>

        <div class="q-mt-md text-center">
          <router-link :to="{name: 'login'}">Login Instead?</router-link>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const password = ref('')
const isPwd = ref(true)
const email = ref('')
const errorMessage = ref('')
const wait = ref(false)
const registerForm = ref(null)

const router = useRouter()
const authStore = useAuthStore()

async function performRegister () {
  registerForm.value.validate().then(async (success) => {
    if (success) {
      errorMessage.value = ''
      wait.value = true
      try {
        await authStore.register(email.value, password.value, password.value)
        router.push({ name: 'home' })
      } catch (error) {
        console.error(error)
        errorMessage.value = error.message
      } finally {
        wait.value = false
      }
    }
  })
}
</script>
