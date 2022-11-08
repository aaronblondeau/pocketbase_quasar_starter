<template>
  <q-btn @click="showCreateItemDialog = true" color="primary" icon="add">Add</q-btn>

  <q-dialog v-model="showCreateItemDialog">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create Item</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="newItemForm">

          <q-input
            filled
            v-model="name"
            type="text"
            label="Name"
            :rules="[
              (val) => (val && val.length > 0) || 'Name must be filled in.',
            ]"
            class="q-mt-sm"
          />

          <q-input
            filled
            v-model="description"
            type="text"
            label="Description"
            :rules="[
              (val) => (val && val.length > 0) || 'Description must be filled in.',
            ]"
            class="q-mt-sm"
          />

          <q-input
            filled
            v-model="priceInUSDC"
            type="number"
            label="USDC"
            :rules="[
              (val) => (val && val > 0) || 'USDC must be greater than 0.',
            ]"
            class="q-mt-sm"
          />

          <q-date
            v-model="dueDate"
            minimal
            class="q-mt-sm"
            mask="YYYY-MM-DD HH:mm:ss"
          />

        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn @click="createItem" color="primary" class="full-width" :loading="createWait" :disable="createWait">
          Create
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { useItemsStore } from 'src/stores/items'
import { ref } from 'vue'
import notifyError from 'src/lib/notifyError'
import { DateTime } from 'luxon'

const props = defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onCreateItem'])
const createWait = ref(false)
const itemsStore = useItemsStore()
const showCreateItemDialog = ref(false)
const name = ref('')
const description = ref('')
const priceInUSDC = ref(50)
const dueDate = ref(DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
const newItemForm = ref(null)

async function createItem () {
  const valid = await newItemForm.value.validate()
  if (valid) {
    createWait.value = true
    try {
      // const dueDateJS = DateTime.fromFormat(dueDate.value, 'yyyy/MM/dd').toJSDate()
      const item = await itemsStore.createItem(props.invoice.id, name.value, description.value, priceInUSDC.value, dueDate.value)
      showCreateItemDialog.value = false
      name.value = ''
      description.value = ''
      priceInUSDC.value = 50
      dueDate.value = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
      emit('onCreateItem', item)
    } catch (e) {
      notifyError(e)
    } finally {
      createWait.value = false
    }
  }
}
</script>
