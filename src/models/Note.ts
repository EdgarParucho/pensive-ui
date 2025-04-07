import { Create, Update, Destroy } from '../api'

export default class Note {
  id: string | undefined
  date: string | undefined
  body: string
  keywords: string | null
  reference: string | null

  constructor({ id, date, body, keywords, reference }: { id?: string, date?: string, body?: string, keywords?: string | null, reference?: string | null}) {
    this.id = id
    this.date = date
    this.body = body ?? ''
    this.keywords = keywords || null
    this.reference = reference || null
  }

  create(token: string) {
    return Create(this, token)
  }

  update(token: string, fields: Partial<Note>) {
    return Update(fields, token)
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