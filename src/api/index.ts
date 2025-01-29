import axios from './axios'
import Note from '../models/Note'

const Create = (note: Partial<Note>) => axios.post('/', note)
const Read = () => axios.get('/')
const Update = ({ id, ...note }: Partial<Note>) => axios.patch('/' + id, note)
const Destroy = (id: string) => axios.delete('/' + id)

export {
  Create,
  Read,
  Update,
  Destroy
}
