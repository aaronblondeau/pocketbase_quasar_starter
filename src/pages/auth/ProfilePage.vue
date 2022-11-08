<template>
  <q-page v-if="auth.user" padding>
    <div class="text-center">
      <h4>Profile</h4>
    </div>

    <div>
      <q-input
        filled
        v-model="email"
        type="text"
        label="Email"
        :disable="true"
        />
    </div>

    <div class="q-pt-md">
      <q-btn
        icon="key"
        label="Change Password"
        @click="requestPasswordReset"
        :loading="passwordResetWait"
        :disable="passwordResetWait"
        />
    </div>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Danger Zone</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-btn
        icon="delete"
        color="red"
        label="Destroy Account"
        @click="showDestroyAccountDialog = true"
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDestroyAccountDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Destroy Account</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p>
            Your PBStarter account and all the data it contains will be permanently destroyed.
          </p>

          <q-input
            filled
            v-model="destroyPassword"
            :type="hideDestroyPassword ? 'password' : 'text'"
            label="Password"
            :rules="[
              (val) => (val && val.length > 0) || 'Password must be filled in.',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="hideDestroyPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hideDestroyPassword = !hideDestroyPassword"
              />
            </template>
          </q-input>

          <q-btn
            color="red"
            label="Destroy Account"
            @click="destroyAccount"
            :loading="destroyAccountWait"
            :disable="destroyAccountWait"
            />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import notifyError from 'src/lib/notifyError'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const email = ref(auth.user.email)
const showDestroyAccountDialog = ref(false)
const destroyAccountWait = ref(false)
const hideDestroyPassword = ref(true)
const destroyPassword = ref('')
const passwordResetWait = ref(false)

async function requestPasswordReset () {
  try {
    passwordResetWait.value = true
    await auth.sendPasswordReset(auth.user.email)
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Password change requested. Please check your email.'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    passwordResetWait.value = false
  }
}

async function destroyAccount () {
  try {
    destroyAccountWait.value = true
    await auth.destroyAccount(destroyPassword.value)
    router.push({ name: 'login', query: { next: '/profile' } })
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Your account and all data it contained has been permanently destroyed!'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    destroyAccountWait.value = false
  }
}
</script>
