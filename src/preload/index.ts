import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

const serverList = [
  {
    name: 'Neutrino server 1',
    ip: '123.22.44.19',
    id: 0
  },
  {
    name: 'Server 2',
    ip: '123.22.44.19',
    id: 1
  }
]

const addServer = (ip: string, name: string) => {
  serverList.push({ id: serverList[serverList.length - 1].id, ip, name })
  console.log('added')
}

// Custom APIs for renderer
const api = {
  getServers: () => serverList,
  addServer
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
