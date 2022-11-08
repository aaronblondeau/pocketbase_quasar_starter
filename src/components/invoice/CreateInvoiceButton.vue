<template>
  <q-btn @click="showCreateInvoiceDialog = true" color="primary" icon="add">Add</q-btn>

  <q-dialog v-model="showCreateInvoiceDialog">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create Invoice</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="newInvoiceForm">

          <q-input
            filled
            v-model="customerEmail"
            type="email"
            label="Customer Email"
            :rules="[
              (val) => (val && val.length > 0) || 'Email must be filled in.',
              (val) => (isEmail(val)) || 'Must be an email.'
            ]"
          />

          <q-input
            filled
            v-model="customerName"
            type="text"
            label="Customer Name"
            :rules="[
              (val) => (val && val.length > 0) || 'Name must be filled in.',
            ]"
            class="q-mt-sm"
          />

        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn @click="createInvoice" color="primary" class="full-width" :loading="createWait" :disable="createWait">
          Create
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { useInvoicesStore } from 'src/stores/invoices'
import { ref } from 'vue'
import isEmail from 'validator/lib/isEmail'
import notifyError from 'src/lib/notifyError'

const emit = defineEmits(['onCreateInvoice'])
const createWait = ref(false)
const invoicesStore = useInvoicesStore()
const showCreateInvoiceDialog = ref(false)
const customerName = ref('')
const customerEmail = ref('')
const newInvoiceForm = ref(null)

async function createInvoice () {
  const valid = await newInvoiceForm.value.validate()
  if (valid) {
    createWait.value = true
    try {
      const invoice = await invoicesStore.createInvoice(customerName.value, customerEmail.value)
      showCreateInvoiceDialog.value = false
      customerName.value = ''
      customerEmail.value = ''
      emit('onCreateInvoice', invoice)
    } catch (e) {
      notifyError(e)
    } finally {
      createWait.value = false
    }
  }
}
</script>
