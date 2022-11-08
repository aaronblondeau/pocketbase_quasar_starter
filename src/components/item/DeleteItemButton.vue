<template>
  <q-btn icon="delete" size="sm" color="red" @click="showDeleteItemDialog = true"></q-btn>

  <q-dialog v-model="showDeleteItemDialog">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Delete Item</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Are you sure that you'd like to delete this item?
      </q-card-section>

      <q-card-actions>
        <q-btn @click="deleteItem" color="red" class="full-width" :loading="deleteWait" :disable="deleteWait">
          Delete
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import notifyError from 'src/lib/notifyError'
import { useItemsStore } from 'src/stores/items'
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onDeleteItem'])
const itemsStore = useItemsStore()
const showDeleteItemDialog = ref(false)
const deleteWait = ref(false)

async function deleteItem () {
  deleteWait.value = true
  try {
    await itemsStore.deleteItem(props.item.id)
    showDeleteItemDialog.value = false
    emit('onDeleteItem')
  } catch (e) {
    notifyError(e)
  } finally {
    deleteWait.value = false
  }
}
</script>
