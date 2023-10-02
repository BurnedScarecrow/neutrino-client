// import Store from 'electron-store'

// export type ServerItem = {
//   ip?: string
//   port?: number
// }

// const store = new Store()

// export class ServerStorage {
//   servers: { [name: string]: ServerItem } = {}

//   constructor(app) {
//     console.log('Init store')
//     this.list()
//     console.log(`List of servers ${JSON.stringify(this.servers)}`)
//   }

//   set(key: string, value) {
//     store.set(key, value)
//     console.log(key, 'set value', value)
//   }

//   list() {
//     const allKeys = store.store

//     for (const key in allKeys) {
//       const value = store.get(key) as ServerItem
//       // console.log(`Ключ: ${key}, Значение: ${value}`)
//       this.servers[key] = value
//     }

//     return this.servers
//   }

//   get(key: string) {
//     return store.get(key)
//   }
// }

// module.exports = ServerStorage
