import 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
      updated_at: string
    }
    notes: {
      id: string
      title: string
      description: string
      user_id: string
      created_at: string
      updated_at: string
    }
    tags: {
      id: string
      name: string
      created_at: string
      updated_at: string
      note_id: string
    }
  }
}
