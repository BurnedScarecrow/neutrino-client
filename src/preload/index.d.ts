import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => void
      getServer: (string) => any
      addServer: (any) => any
      deleteServer: (any) => void
    }
    ipcRenderer: {
      on
      send
      // off
    }
  }
}
