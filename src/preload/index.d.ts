import { ElectronAPI } from '@electron-toolkit/preload'
import { ServerItem } from '../main/store'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => { [name: string]: ServerItem }
      on: any
      addServer: (any) => void
    }
    ipcRenderer: any
  }
}
