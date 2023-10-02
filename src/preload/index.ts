import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

function getServers() {
  console.log('[preload] -> servers:list')
  ipcRenderer.send('servers:list')
}

function addServer(data) {
  console.log('vue: emit event with data')
  ipcRenderer.send('servers:add', data)
}

// Custom APIs for renderer
const api = {
  getServers,
  on: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  addServer
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', {
      send: (channel, data) => {
        ipcRenderer.send(channel, data)
      },
      on: (channel, func) => {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_, ...args) => func(...args))
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
