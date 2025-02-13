import axios from './axios'
import Note from '../models/Note'

const Create = (fields: Partial<Note>, token: string) => axios
  .post('/', fields, { headers: { Authorization: `Bearer ${token}` } })

const Read = (token: string, search: string) => axios
  .get('/', { headers: { Authorization: `Bearer ${token}` }, params: { search } })

const Update = ({ id, ...fields }: Partial<Note>, token: string) => axios
  .patch('/' + id, fields, { headers: { Authorization: `Bearer ${token}` } })

const Destroy = (id: string, token: string) => axios
  .delete('/' + id, { headers: { Authorization: `Bearer ${token}` } })

export {
  Create,
  Read,
  Update,
  Destroy
}
