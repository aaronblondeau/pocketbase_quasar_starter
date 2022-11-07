<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form ref="forgotPasswordForm">
        <h2 class="text-center">Password Reset</h2>

        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Email must be filled in.',
          ]" />

          <q-banner v-if="errorMessage" inline-actions class="text-white bg-red">
            {{ errorMessage }}
          </q-banner>

          <q-banner v-if="successMessage" inline-actions class="text-white bg-green">
            {{ successMessage }}
          </q-banner>

          <div>
            <q-btn color="primary" label="Send Link" @click="sendPasswordReset" :loading="wait" class="full-width q-mt-md" />
          </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const wait = ref(false)
const forgotPasswordForm = ref(null)

const authStore = useAuthStore()

async function sendPasswordReset () {
  forgotPasswordForm.value.validate().then(async (success) => {
    if (success) {
      errorMessage.value = ''
      successMessage.value = ''
      wait.value = true
      try {
        await authStore.sendPasswordReset(email.value)
        successMessage.value = 'A password reset link has been emailed to you.'
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
