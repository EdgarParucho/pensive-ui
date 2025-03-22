import axios from './axios'
import Note from '../models/Note'

const Create = (fields: Partial<Note>, token: string) => axios
  .post('/note', fields, { headers: { Authorization: `Bearer ${token}` } })

const Read = (token: string, search: string) => axios
  .get('/note', { headers: { Authorization: `Bearer ${token}` }, params: { search } })

const Update = ({ id, ...fields }: Partial<Note>, token: string) => axios
  .patch('/note' + id, fields, { headers: { Authorization: `Bearer ${token}` } })

const Destroy = (id: string, token: string) => axios
  .delete('/note' + id, { headers: { Authorization: `Bearer ${token}` } })

export {
  Create,
  Read,
  Update,
  Destroy
}
