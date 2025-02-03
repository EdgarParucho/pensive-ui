import { Create, Update } from '../api'

export default class Note {
  id: string | undefined
  title: string
  body: string
  type: string
  keywords: string | null
  reference: string | null

  constructor({ id, title, body, type, keywords, reference }: { id?: string, title?: string, body?: string, type?: string, keywords?: string | null, reference?: string | null}) {
    this.id = id ?? undefined
    this.title = title ?? ''
    this.body = body ?? ''
    this.type = type ?? ''
    this.keywords = keywords ?? null
    this.reference = reference ?? null
  }

  create(token: string) {
    return Create(this, token)
  }

  update() {
    return Update(this)
  }

  clear() {
    this.title = ''
    this.body = ''
    this.type = ''
    this.keywords = null
    this.reference = null
  }
}