"use strict";

const {app, BrowserWindow, Tray, Menu} = require('electron')
const path = require('path')
const url = require('url')

const iconPath = path.join(__dirname, '/assets/icon.png')

let win
let appIcon
let menu

function createWindow () {

  var windowOptions = {
    width: 1000,
    minWidth: 700,
    height: 800,
    minHeight: 500,
    icon: iconPath,
    frame: true,
    title: app.getName() + ' ' + app.getVersion()
  }

  win = new BrowserWindow(windowOptions)

  appIcon = new Tray(iconPath)

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null,
    appIcon = null
  })

  win.webContents.openDevTools()

  menu = new Menu();

  Menu.setApplicationMenu(null);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})