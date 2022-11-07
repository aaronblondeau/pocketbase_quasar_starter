<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form ref="loginForm">
        <h2 class="text-center">Login</h2>

        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Email must be filled in.',
          ]" />

          <q-input
            filled
            v-model="password"
            :type="hidePassword ? 'password' : 'text'"
            label="Password"
            @keyup.enter="performLogin"
            :rules="[
              (val) => (val && val.length > 0) || 'Password must be filled in.',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="hidePassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hidePassword = !hidePassword"
              />
            </template>
          </q-input>

          <q-banner v-if="errorMessage" inline-actions class="text-white bg-red q-mt-md">
            {{ errorMessage }}
          </q-banner>

          <div class="q-mt-md">
            <q-btn color="primary" label="Login" @click="performLogin" :loading="wait" class="full-width" />
          </div>
          <div class="q-mt-md">
            <q-btn color="primary" label="Register" flat :to="{name: 'register'}" class="full-width" />
          </div>

          <div class="q-mt-md text-center">
            <router-link :to="{name: 'forgot_password'}">Forgot Password?</router-link>
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
const hidePassword = ref(true)
const email = ref('')
const errorMessage = ref('')
const wait = ref(false)
const loginForm = ref(null)

const router = useRouter()
const authStore = useAuthStore()

async function performLogin () {
  loginForm.value.validate().then(async (success) => {
    if (success) {
      errorMessage.value = ''
      wait.value = true
      try {
        // Do the login
        await authStore.login(email.value, password.value)

        // Check if we need to redirect the user to the page they attempted to access before they logged in
        // Note next query param is set in router/index.js' beforeEach
        if (router.currentRoute.value.query.next) {
          router.replace(router.currentRoute.value.query.next)
        } else {
          router.replace({ name: 'home' })
        }
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
