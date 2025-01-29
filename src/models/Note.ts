import { Create } from '../api'

export default class Note {
  title: string
  body: string
  type: string
  keywords: string | null
  reference: string | null

  constructor() {
    this.title = ''
    this.body = ''
    this.type = ''
    this.keywords = null
    this.reference = null
  }

  save() {
    return Create(this)
  }

  clear() {
    this.title = ''
    this.body = ''
    this.type = ''
    this.keywords = null
    this.reference = null
  }
}