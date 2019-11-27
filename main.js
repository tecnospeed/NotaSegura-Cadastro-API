const { app, BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
const config = require('./config')



app.on('ready', () => {

    // Cria uma janela de navegação.
  mainWindow = new BrowserWindow({
      width: 1240,
      height: 870,
      webPreferences: {
        nodeIntegration: true
    }
  })
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/static/index.html'),
    protocol: 'file',
    slashes: true
  }))

  // e carregar o index.html do aplicativo.

  Menu.setApplicationMenu(null)

})