<template>
  <div>
    <q-table
      title="Invoices"
      :rows="invoices"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="id"
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Invoices</div>
        <q-space />
        <CreateInvoiceButton @on-create-invoice="fetchInvoices" />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>

          <q-td key="customerName" :props="props">
            {{ props.row.customerName }}
            <q-popup-edit
              v-model="props.row.customerName"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'customerName')"
              :validate="validateName"
            >
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                :rules="[
                  (val) => (val && val.length > 0) || 'Name must be filled in.',
                ]"
                />
            </q-popup-edit>
          </q-td>

          <q-td key="customerEmail" :props="props">
            {{ props.row.customerEmail }}
            <q-popup-edit
              v-model="props.row.customerEmail"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'customerEmail')"
              :validate="validateEmail"
              >
              <q-input
                type="email"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                :rules="[
                  (val) => (val && val.length > 0) || 'Email must be filled in.',
                  (val) => (isEmail(val)) || 'Must be an email.'
                ]" />
            </q-popup-edit>
          </q-td>

          <q-td key="actions" :props="props">
            <DeleteInvoiceButton :invoice="props.row" @on-delete-invoice="fetchInvoices" />
            <q-btn icon="list" size="sm" color="primary" :to="{name: 'invoice', params : { invoiceId: props.row.id }}"></q-btn>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useInvoicesStore } from 'src/stores/invoices'
import notifyError from 'src/lib/notifyError'
import CreateInvoiceButton from './CreateInvoiceButton.vue'
import DeleteInvoiceButton from './DeleteInvoiceButton.vue'
import isEmail from 'validator/lib/isEmail'

const invoicesStore = useInvoicesStore()
const loadingInvoices = ref(false)
const invoices = ref([])
const page = ref(1)
const perPage = ref(10)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  totalRowsNumber: 0
})

const columns = [
  {
    name: 'id',
    field: 'id',
    label: 'Id'
  },
  {
    name: 'customerName',
    field: 'customerName',
    label: 'Customer Name'
  },
  {
    name: 'customerEmail',
    field: 'customerEmail',
    label: 'Customer Email'
  },
  {
    name: 'actions',
    label: 'Actions'
  }
]

async function fetchInvoices () {
  loadingInvoices.value = true
  try {
    const result = await invoicesStore.fetchInvoices(page.value, perPage.value)
    invoices.value = result.items
    pagination.value.totalRowsNumber = result.totalItems
  } catch (e) {
    notifyError(e)
  } finally {
    loadingInvoices.value = false
  }
}

function validateName (input) {
  if (!input) {
    return false
  }
  return true
}

function validateEmail (input) {
  if (!isEmail(input)) {
    return false
  }
  return true
}

async function save (newValue, id, field) {
  try {
    await invoicesStore.updateInvoice(id, {
      [field]: newValue
    })
  } catch (e) {
    notifyError(e)
  }
}

onMounted(() => {
  fetchInvoices()
})

// TODO watch pagination and reload if necessary

</script>
