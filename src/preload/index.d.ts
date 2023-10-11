import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => void
      getServer: (string) => any
      addServer: (any) => any
      deleteServer: (any) => void
      connect: (any) => any
      disconnect: () => any
    }
    ipcRenderer: {
      on
      send
      // off
    }
  }
}
