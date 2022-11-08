import PocketBase from 'pocketbase'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useInvoicesStore = defineStore('invoices', () => {
  // Create a PocketBase client
  const pocketbaseClient = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090')
  const authStore = useAuthStore()

  async function fetchInvoices (page, perPage) {
    const pageResult = await pocketbaseClient.records.getList('invoices', page || 1, perPage || 10)
    return pageResult
  }

  async function fetchInvoice (id) {
    const record = await pocketbaseClient.records.getOne('invoices', id) // , { expand: 'items' })
    return record
  }

  async function createInvoice (customerName, customerEmail) {
    const record = await pocketbaseClient.records.create('invoices', {
      customerName,
      customerEmail,
      owner: authStore.user.id
    })
    return record
  }

  async function deleteInvoice (id) {
    await pocketbaseClient.records.delete('invoices', id)
  }

  async function updateInvoice (id, updates) {
    const record = await pocketbaseClient.records.update('invoices', id, updates)
    return record
  }

  return {
    fetchInvoices,
    createInvoice,
    deleteInvoice,
    updateInvoice,
    fetchInvoice
  }
})
