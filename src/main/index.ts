import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import axios from 'axios'
import { ChildProcess, execSync, spawn } from 'child_process'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import Store from 'electron-store'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { dirname, join } from 'path'
import icon from '../../resources/icon.png?asset'

const store = new Store()
let mainWindow: BrowserWindow

let childProcess: ChildProcess

const homeDirectory = homedir()
const filePath = join(homeDirectory, '.config/ss/neutrino.json')

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
    mainWindow.removeMenu()
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

  const hexDecode = function (hex) {
    let j
    const hexes = hex.match(/.{1,2}/g) || []
    let back = ''
    for (j = 0; j < hexes.length; j++) {
      back += String.fromCharCode(parseInt(hexes[j], 16))
    }

    return back
  }

  function hostFromKey(key: string) {
    const splitedKey = key.split(':')
    const ipHex = splitedKey[0]
    const ip64 = hexDecode(ipHex)
    const ip = atob(ip64)
    console.log(ip)
    return ip
  }

  /* -------------------------------------------------------------------------- */

  ipcMain.on('servers:add', (event, newItem) => {
    console.log('ipcMain: on servers:add event handler got data', JSON.stringify(newItem))

    const server = JSON.parse(newItem)

    store.set(server?.name, server?.config)
    const result = store.get(server?.name)
    console.log('result:', result)
    event.returnValue = result
  })

  ipcMain.on('servers:add-key', async (event, newItem) => {
    console.log('ipcMain: on servers:add-key event handler got data', newItem)

    const data = JSON.parse(newItem)

    const host = data.hostname || hostFromKey(data.key)

    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      const response = await axios.post(`https://${host}/proxy/config`, { key: data.key })

      if (response.status == 201) {
        const config = {
          server: host,
          server_port: response.data.server_port,
          password: response.data.password,
          method: response.data.method
        }

        const server = { name: data.name, config }

        store.set(server?.name, server?.config)
        const result = store.get(server?.name)
        console.log('errored:', response)
        event.returnValue = result
      } else {
        console.log('auth key errored:', JSON.stringify(response))
        event.returnValue = false
      }
    } catch (e) {
      console.log('try failed')
      event.returnValue = false
    }
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

  ipcMain.on('connection:check_port', (event, port) => {
    console.log('ipcMain: connection:check_port catched. Data:', JSON.stringify(port))
    try {
      const isProxyFree = checkProxyClient()
      console.log('check proxy', isProxyFree)

      const isPortFree = checkPort(port)
      console.log('check port', isPortFree)

      const result = isProxyFree && isPortFree
      console.log('ipcMain: port ready -', result)

      event.returnValue = result
    } catch (err) {
      console.log(err)
      event.returnValue = false
    }
  })

  ipcMain.on('servers:connect', (event, data) => {
    console.log('ipcMain: servers:connect catched. Data:', JSON.stringify(data))
    try {
      connect(event, data)
      event.returnValue = 'OK'
    } catch (err) {
      console.log(err)
      event.returnValue = err
    }
  })

  ipcMain.on('servers:disconnect', () => {
    console.log('ipcMain: servers:disconnect catched. Data:')
    disconnect()
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
    disconnect()
    app.quit()
  }
})

function connect(event, config) {
  // throw Error('Failed to save config file.')
  const saved = createConfigFile(config)
  if (!saved) {
    throw Error('Failed to save config file.')
  }

  const command = 'ss-local'
  const args = ['-c', filePath, '-v']

  // Запускаем процесс
  childProcess = spawn(command, args)

  console.log('Создан процесс', childProcess.pid)

  // Перехватываем событие завершения процесса
  childProcess.on('close', (code) => {
    console.log(`Процесс завершился с кодом ${code}`)
  })

  childProcess.stdout?.on('data', (data) => {
    // console.log(`stdout: ${data}`)
    event.sender.send('connection:log', data)
  })

  childProcess.stderr?.on('data', (data) => {
    // console.error(`stderr: ${data}`)
    event.sender.send('connection:error', data)
  })
}

function createConfigFile(config): boolean {
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

function disconnect() {
  if (childProcess) {
    console.log('kill subprocess')
    childProcess?.kill()
  }
}

function checkProxyClient(): boolean {
  const command = 'ps aux | grep "ss-local"'
  const result = execSync(command).toString()

  const outputLines = result.split('\n').filter((line) => line.includes('neutrino.json'))
  const numberOfLines = outputLines.length

  console.log(`Количество строк, содержащих "ss-local": ${numberOfLines}`)

  return numberOfLines === 0
}

function checkPort(port) {
  try {
    const result = execSync(`lsof -i :${port}`).toString()
    // Если результат содержит строки, значит, порт занят
    console.log('port check', result)
    return result.trim() === '' ? true : false
  } catch (error) {
    // Если команда завершилась ошибкой, значит, порт свободен
    return true
  }
}
