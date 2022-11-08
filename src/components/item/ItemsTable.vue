<template>
  <div>
    <q-table
      title="Line Items"
      :rows="items"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="id"
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Line Items</div>
        <q-space />
        <CreateItemButton @on-create-item="fetchItems" :invoice="invoice" />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>

          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit
              v-model="props.row.name"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'name')"
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

          <q-td key="description" :props="props">
            {{ props.row.description }}
            <q-popup-edit
              v-model="props.row.description"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'description')"
            >
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                />
            </q-popup-edit>
          </q-td>

          <q-td key="priceInUSDC" :props="props">
            {{ props.row.priceInUSDC }}
            <q-popup-edit
              v-model="props.row.priceInUSDC"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'priceInUSDC')"
              :validate="validatePriceInUSDC"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
                :rules="[
                  (val) => (val && val > 0) || 'USDC must be greater than 0.',
                ]"
                />
            </q-popup-edit>
          </q-td>

          <q-td key="dueDate" :props="props">
            {{ props.row.dueDate }}
            <q-popup-edit
              v-model="props.row.dueDate"
              auto-save
              v-slot="scope"
              @save="save($event, props.row.id, 'dueDate')"
            >
              <q-date
                v-model="scope.value"
                minimal
                @update="scope.set"
                flat
                mask="YYYY-MM-DD HH:mm:ss"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="actions" :props="props">
            <DeleteItemButton :item="props.row" @on-delete-item="fetchItems" />
          </q-td>

        </q-tr>
      </template>

    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useItemsStore } from 'src/stores/items'
import notifyError from 'src/lib/notifyError'
import DeleteItemButton from './DeleteItemButton.vue'
import CreateItemButton from './CreateItemButton.vue'

const props = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const itemsStore = useItemsStore()
const loadingItems = ref(false)
const items = ref([])
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
    name: 'name',
    field: 'name',
    label: 'Name'
  },
  {
    name: 'description',
    field: 'description',
    label: 'Description'
  },
  {
    name: 'priceInUSDC',
    field: 'priceInUSDC',
    label: 'USDC'
  },
  {
    name: 'dueDate',
    field: 'dueDate',
    label: 'Due Date'
  },
  {
    name: 'actions',
    label: 'Actions'
  }
]

function validateName (input) {
  if (!input) {
    return false
  }
  return true
}

function validatePriceInUSDC (input) {
  if (input < 0) {
    return false
  }
  return true
}

async function save (newValue, id, field) {
  try {
    await itemsStore.updateItem(id, {
      [field]: newValue
    })
  } catch (e) {
    notifyError(e)
  }
}

async function fetchItems () {
  loadingItems.value = true
  try {
    const result = await itemsStore.fetchItems(props.invoice.id, page.value, perPage.value)
    items.value = result.items
    pagination.value.totalRowsNumber = result.totalItems
  } catch (e) {
    notifyError(e)
  } finally {
    loadingItems.value = false
  }
}

onMounted(() => {
  fetchItems()
})

// TODO watch pagination and reload if necessary

</script>
