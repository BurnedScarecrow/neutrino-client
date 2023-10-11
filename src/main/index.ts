import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { dirname, join } from 'path'
import icon from '../../resources/icon.png?asset'

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

    const server = JSON.parse(newItem)

    store.set(server?.name, server?.config)
    const result = store.get(server?.name)
    console.log('result:', result)
    event.returnValue = result
  })

  ipcMain.on('servers:list', (event) => {
    console.log('[ipcMain]-> servers:list catched')
    const result = listServers()
    console.log('result:', result)
    event.sender.send('servers:update:ans', result)
  })

  ipcMain.on('servers:findOne', (event, name) => {
    console.log('[ipcMain] -> servers:findOne catched')
    const result = store.get(name)
    console.log('[ipcMain]-> result:', result)
    event.returnValue = result
  })

  ipcMain.on('servers:delete', (event, data) => {
    console.log('ipcMain: servers:delete catched. Data:', JSON.stringify(data))
    store.delete(data.name)
    const result = listServers()
    console.log('[ipcMain]-> result:', result)
    event.sender.send('servers:update:ans', result)
  })

  ipcMain.on('servers:connect', (event, data) => {
    console.log('ipcMain: servers:connect catched. Data:', JSON.stringify(data))
    try {
      connect(data)
      event.returnValue = 'OK'
    } catch (err) {
      console.log(err)
      event.returnValue = err
    }
  })

  ipcMain.on('servers:disconnect', () => {
    console.log('ipcMain: servers:disconnect catched. Data:')
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

function connect(config) {
  // throw Error('Failed to save config file.')
  const saved = createConfigFile(config)
  if (!saved) {
    throw Error('Failed to save config file.')
  }
  // const ss_local = spawn('ss-local', ['-lh', '/usr'])

  // ss_local.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`)
  // })

  // ss_local.stderr.on('data', (data) => {
  //   console.error(`stderr: ${data}`)
  // })

  // ss_local.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
}

function createConfigFile(config): boolean {
  const homeDirectory = homedir()
  const filePath = join(homeDirectory, '.config/ss/neutrino.json')
  try {
    const directory = dirname(filePath)

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true })
    }

    writeFileSync(filePath, config, 'utf8')

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
