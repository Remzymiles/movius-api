import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '../../app/models/role.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        id: 1,
        cuid: 'ov81v8roayoubp3qnnaq6233',
        name: 'Active',
        slug: 'active',
        app_name: 'movius-service',
      },
      {
        id: 2,
        cuid: 'no0flq7iazxu4bqtptcddbyy',
        name: 'Manager',
        slug: 'manager',
        app_name: 'movius-service',
      },
      {
        id: 3,
        cuid: 'bh74apvwnboq6nezgpyscg36',
        name: 'Supervisor',
        slug: 'supervisor',
        app_name: 'movius-service',
      },
      {
        id: 4,
        cuid: 'wv5qz462u5rai1s8o5rr4tao',
        name: 'Accountant',
        slug: 'accountant',
        app_name: 'movius-service',
      },
      {
        id: 5,
        cuid: 'koxoqxgwt8bw803pi6js3z0i',
        name: 'User',
        slug: 'user',
        app_name: 'movius-service',
      },
      {
        id: 6,
        cuid: 'm6t84y0ooqozgeirey38l1nv',
        name: 'Admin',
        slug: 'admin',
        app_name: 'movius-service',
      },
      {
        id: 7,
        cuid: 't0djcd8a1ktov5a0ylv27d98',
        name: 'SuperAdmin',
        slug: 'super-admin',
        app_name: 'movius-service',
      },
    ])
  }
}
