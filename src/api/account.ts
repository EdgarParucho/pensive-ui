import axios from './axios'

const Update = ({ password, token }: { password: string, token: string }) => axios
  .patch('/account', { password }, { headers: { Authorization: `Bearer ${token}` } })

const Destroy = (token: string) => axios
  .delete('/account', { headers: { Authorization: `Bearer ${token}` } })

export {
  Update,
  Destroy
}
