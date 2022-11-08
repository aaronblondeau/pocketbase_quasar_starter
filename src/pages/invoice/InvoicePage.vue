<template>
  <q-page padding>
    <div v-if="!invoice" class="text-center q-ma-lg">
      <q-spinner
        color="primary"
        size="3em"
      />
    </div>
    <div v-if="invoice">
      <h4 class="text-h4">{{ invoice.id }}</h4>
      <div>Customer Name : {{ invoice.customerName }}</div>
      <div>Customer Email : {{ invoice.customerEmail }}</div>
      <ItemsTable :invoice="invoice" class="q-mt-sm" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoicesStore } from 'src/stores/invoices'
import ItemsTable from 'src/components/item/ItemsTable.vue'

const router = useRouter()
const invoicesStore = useInvoicesStore()

const invoiceId = ref(router.currentRoute.value.params.invoiceId)
const invoice = ref(null)

async function fetchInvoice () {
  invoice.value = await invoicesStore.fetchInvoice(invoiceId.value)
}

onMounted(() => {
  fetchInvoice()
})

watch(
  () => router.currentRoute.value,
  (newCurrentRoute) => {
    invoiceId.value = newCurrentRoute.params.invoiceId
  }
)

watch(
  () => invoiceId,
  (newInvoiceId) => {
    fetchInvoice()
  }
)
</script>
