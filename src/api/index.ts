import axios from "./axios"
import Note from "../models/Note"

const networkErrMessage = 'An error occurred. It may be a network problem.'
const defaultErrMessage = 'An error occurred. Please try again later while we solve it.'
const networkError = (e: Error) => e.message?.toLowerCase().includes('network')
const errorMessage = (e: Error) => networkError(e) ? networkErrMessage : defaultErrMessage

function Create(note: Partial<Note>) {
  return axios.post('/', note)
    .then(() => Object({
      error: false,
      message: 'Successfully saved.',
      data: null,
    }))
    .catch((error) => Object({
      error: true,
      message: errorMessage(error),
      data: null,
    }))
}

export {
  Create,
}
