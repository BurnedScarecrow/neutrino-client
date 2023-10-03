import { ElectronAPI } from '@electron-toolkit/preload'
import { ServerItem } from '../main/store'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => { [name: string]: ServerItem }
      addServer: (any) => void
      deleteServer: (any) => void
    }
    ipcRenderer: {
      on
      send
    }
  }
}
