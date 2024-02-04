import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getServers: () => void
      getServer: (string) => any
      addServer: (any) => any
      addServerKey: (any) => any
      deleteServer: (any) => void
      connect: (any) => any
      disconnect: () => any
      isPortReady: (any) => any
    }
    ipcRenderer: {
      on
      send
    }
  }
}
