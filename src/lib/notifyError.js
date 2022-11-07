import { Notify } from 'quasar'
import _ from 'lodash'

export default function notifyError (error) {
  console.error(error)
  if (_.has(error, 'data.message')) {
    Notify.create({
      type: 'negative',
      message: error.data.message
    })
  } else {
    Notify.create({
      type: 'negative',
      message: error.message
    })
  }
}
