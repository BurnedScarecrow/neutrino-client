import { ElectronAPI } from '@electron-toolkit/preload'

export type ServerItem = {
  id: number
  name: string
  config: object
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => ServerItem[]
      addServer: (string, string) => void
    }
  }
}
