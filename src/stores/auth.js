import PocketBase from 'pocketbase'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// NOTE, this uses setup syntax so we can subscribe to auth state
// https://pinia.vuejs.org/core-concepts/#setup-stores

export const useAuthStore = defineStore('auth', () => {
  // Create a PocketBase client
  const pocketbaseClient = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')

  // This store keeps track of the user model and token
  const token = ref(pocketbaseClient.authStore.token)
  const user = ref(pocketbaseClient.authStore.model)

  // Observe the PocketBase auth status so we can update our state when changes happen
  pocketbaseClient.authStore.onChange((authToken, userModel) => {
    token.value = authToken
    user.value = userModel
  })

  // This is a promise the Vue components can check to see if auth is loaded before rendering
  // It is not needed for PocketBase, but do for Firebase and some other auth systems so I like to keep it here.
  const ready = ref(Promise.resolve(true))

  async function register (email, password, passwordConfirm) {
    await pocketbaseClient.users.create({
      email,
      password,
      passwordConfirm
    })
    await pocketbaseClient.users.requestVerification(email)
    await login(email, password)
  }

  async function login (email, password) {
    return pocketbaseClient.users.authViaEmail(email, password)
  }

  async function logout () {
    await pocketbaseClient.authStore.clear()
  }

  async function sendPasswordReset (email) {
    await pocketbaseClient.users.requestPasswordReset(email)
  }

  async function sendVerification (email) {
    if (user.value) {
      await pocketbaseClient.users.requestVerification(user.value.email)
    }
  }

  async function destroyAccount (password) {
    await pocketbaseClient.users.authViaEmail(user.value.email, password)
    await pocketbaseClient.users.delete(user.value.id)
    await pocketbaseClient.authStore.clear()
  }

  const authenticated = computed(() => {
    return !!user.value
  })

  return {
    // state properties
    token,
    user,
    ready,
    // actions
    register,
    login,
    logout,
    sendPasswordReset,
    sendVerification,
    destroyAccount,
    // getters
    authenticated
  }
})
