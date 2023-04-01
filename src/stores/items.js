import PocketBase from 'pocketbase'
import { defineStore } from 'pinia'

export const useItemsStore = defineStore('items', () => {
  // Create a PocketBase client
  const pocketbaseClient = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')

  async function fetchItems (invoiceId, page, perPage) {
    const pageResult = await pocketbaseClient.collection('items').getList(page || 1, perPage || 10, {
      filter: `invoice = "${invoiceId}"`
    })
    return pageResult
  }

  async function fetchItem (id) {
    const record = await pocketbaseClient.collection('items').getOne(id) // , { expand: 'invoice' })
    return record
  }

  async function createItem (invoiceId, name, description, priceInUSDC, dueDate) {
    console.log('~~dbg HERE', {
      invoice: invoiceId,
      name,
      description,
      priceInUSDC,
      dueDate
    })
    const record = await pocketbaseClient.collection('items').create({
      invoice: invoiceId,
      name,
      description,
      priceInUSDC,
      dueDate
    })
    return record
  }

  async function deleteItem (id) {
    await pocketbaseClient.records.collection('items').delete(id)
  }

  async function updateItem (id, updates) {
    const record = await pocketbaseClient.collection('items').update(id, updates)
    return record
  }

  return {
    fetchItems,
    createItem,
    deleteItem,
    updateItem,
    fetchItem
  }
})
