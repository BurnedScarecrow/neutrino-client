import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

function getServers() {
  console.log('[preload] -> servers:list')
  ipcRenderer.send('servers:list')
}

function getServer(name) {
  console.log('[preload] -> servers:findOne')
  return ipcRenderer.sendSync('servers:findOne', name)
}

function addServer(data) {
  console.log('[preload] -> add server')
  return ipcRenderer.sendSync('servers:add', data)
}

function deleteServer(data) {
  console.log('[preload] -> delete server')
  ipcRenderer.send('servers:delete', data)
}

// Custom APIs for renderer
const api = {
  getServers,
  getServer,
  addServer,
  deleteServer
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', {
      send: (channel, data) => {
        ipcRenderer.send(channel, data)
      },
      on: (channel, listener) => {
        ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
      }
      // off: (channel, listener) => {
      //   ipcRenderer.//off(channel, (event, ...args) => listener(event, ...args))
      // }
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
