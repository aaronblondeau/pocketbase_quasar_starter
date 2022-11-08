<template>
  <q-layout view="lHh Lpr lFf" padded>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <router-link :to="{name: 'home'}" style="text-decoration: none; color: white;">
            PBStarter
          </router-link>
        </q-toolbar-title>

        <q-btn stretch flat label="Login" :to="{name: 'login'}" v-if="!auth.authenticated" />
        <q-btn stretch flat label="Profile" v-if="auth.authenticated" :to="{name: 'profile'}" />
        <q-btn stretch flat label="Logout" v-if="auth.authenticated" @click="performLogout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- <q-footer elevated v-if="auth.authenticated">
      <q-toolbar class="row">
        <div class="col text-center">
          <q-btn stretch flat label="Invoices" :to="{name: 'invoices'}" />
        </div>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function performLogout () {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>
