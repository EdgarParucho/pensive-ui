import axios from './axios'
import Note from '../models/Note'

const Create = (fields: Partial<Note>, token: string) => axios
  .post('/', fields, { headers: { Authorization: `Bearer ${token}` } })

const Read = (token: string, query: string) => axios
  .get('/', { headers: { Authorization: `Bearer ${token}` }, params: { query } })

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
