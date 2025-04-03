import { Create, Update, Destroy } from '../api'

export default class Note {
  id: string | undefined
  title: string
  body: string
  keywords: string | null
  reference: string | null

  constructor({ id, title, body, keywords, reference }: { id?: string, title?: string, body?: string, keywords?: string | null, reference?: string | null}) {
    this.id = id ?? undefined
    this.title = title ?? ''
    this.body = body ?? ''
    this.keywords = keywords ?? null
    this.reference = reference ?? null
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
    this.title = ''
    this.body = ''
    this.keywords = null
    this.reference = null
  }
}