import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'

const store = new Store()

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    show: true,
    resizable: false,
    autoHideMenuBar: true,
    alwaysOnTop: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.neutrino')

  createWindow()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  /* -------------------------------------------------------------------------- */

  ipcMain.on('servers:add', (event, newItem) => {
    console.log('ipcMain: on servers:add event handler got data', JSON.stringify(newItem))
    store.set(newItem.name, newItem.config)
    const result = listServers()
    console.log('result:', result)
    event.sender.send('servers:update:ans', result)
  })

  ipcMain.on('servers:list', (event) => {
    const result = listServers()
    console.log('result:', result)
    event.sender.send('servers:update:ans', result)
  })

  ipcMain.on('servers:delete', (event, data) => {
    console.log('ipcMain: on servers:delete event handler got data', JSON.stringify(data))
    store.delete(data.name)
    const result = listServers()
    console.log('result:', result)
    event.sender.send('servers:update:ans', result)
  })

  function listServers() {
    const list = {}
    const allKeys = store.store
    for (const key in allKeys) {
      const value = store.get(key)
      list[key] = value
    }
    return list
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/* -------------------------------------------------------------------------- */
