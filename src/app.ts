import electron, { app, BrowserWindow, Menu } from 'electron'
// import remote from '@electron/remote/main'
import contextMenu from 'electron-context-menu'
import fs from 'fs'
import path from 'path'
import MakeWindow from './app/mw'
import { getMenu } from './utils/utils'

let window: BrowserWindow | null = null

// remote.initialize();

const initEvts = () => {
    app.on('window-all-closed', () => {
        window?.webContents.session.flushStorageData()
        window = null
        if (process.platform != 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (!window) {
            window = MakeWindow()
            Menu.setApplicationMenu(Menu.buildFromTemplate(getMenu()))
        }
    })

    app.on('ready', () => {
        if (app.isPackaged) {
            contextMenu({
                showSaveImage: false,
                showSaveImageAs: false,
                showCopyImage: false,
                showCopyImageAddress: false
            })
        } else {
            contextMenu({
                showInspectElement: true
            })
        }

        window = MakeWindow()
        Menu.setApplicationMenu(Menu.buildFromTemplate(getMenu()))
    })

    app.on('quit', () => {
        const downloadDir = path.join(electron.app.getPath('userData'), '/download/')
        const filepath = path.join(downloadDir, '/tmp.pdf')

        if (fs.existsSync(downloadDir)) {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath)
            }
            fs.rmdirSync(downloadDir)
        }
    })
}

initEvts()