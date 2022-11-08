<template>
  <q-btn icon="delete" size="sm" color="red" @click="showDeleteInvoiceDialog = true"></q-btn>

  <q-dialog v-model="showDeleteInvoiceDialog">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Delete Invoice</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Are you sure that you'd like to delete this invoice?
      </q-card-section>

      <q-card-actions>
        <q-btn @click="deleteInvoice" color="red" class="full-width" :loading="deleteWait" :disable="deleteWait">
          Delete
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import notifyError from 'src/lib/notifyError'
import { useInvoicesStore } from 'src/stores/invoices'
import { ref } from 'vue'

const props = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onDeleteInvoice'])
const invoicesStore = useInvoicesStore()
const showDeleteInvoiceDialog = ref(false)
const deleteWait = ref(false)

async function deleteInvoice () {
  deleteWait.value = true
  try {
    await invoicesStore.deleteInvoice(props.invoice.id)
    showDeleteInvoiceDialog.value = false
    emit('onDeleteInvoice')
  } catch (e) {
    notifyError(e)
  } finally {
    deleteWait.value = false
  }
}
</script>
