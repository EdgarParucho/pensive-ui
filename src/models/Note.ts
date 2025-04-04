import { Create, Update, Destroy } from '../api'

export default class Note {
  id: string | undefined
  body: string
  keywords: string | null
  reference: string | null

  constructor({ id, body, keywords, reference }: { id?: string, body?: string, keywords?: string | null, reference?: string | null}) {
    this.id = id
    this.body = body ?? ''
    this.keywords = keywords || null
    this.reference = reference || null
  }

  create(token: string) {
    return Create(this, token)
  }

  update(token: string) {
    return Update(this, token)
  }

  destroy(token: string) {
    return Destroy(this.id!, token)
  }

  clear() {
    this.body = ''
    this.keywords = null
    this.reference = null
  }
}