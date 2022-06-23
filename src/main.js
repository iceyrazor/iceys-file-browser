const electron = require('electron'),
	{app,BrowserWindow,Menu,Tray,ipcMain} = require('electron'),
	path = require('path');

myWindow=null;
global.tray=null;
app.whenReady().then(()=>{
	//set tray icon
	tray = new Tray(path.join(__dirname+'/imgassets/icon.ico'))
	const contextMenu = Menu.buildFromTemplate([
		{label:"on top",click(){
			switch(myWindow.isAlwaysOnTop()){
				case true:
					myWindow.setAlwaysOnTop(false);
					break;
				case false:
					myWindow.setAlwaysOnTop(true)
					break;
			}
		}},
		{label:"exit",click(){ app.quit(); }},
	])
	tray.setToolTip('better file browser')
	tray.setContextMenu(contextMenu)

	//figure out screens
	primaryscreen=electron.screen.getPrimaryDisplay()

	//create window
	myWindow=new BrowserWindow({
		width: Math.floor(primaryscreen.bounds.width/5),
		//width: 800,
		height: primaryscreen.bounds.height,
		frame: false,
		transparent:true,
		webPreferences:{
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: false,
		}
	});
	//set intial position
	myWindow.setPosition(primaryscreen.bounds.width-myWindow.getBounds().width,0)

	myWindow.setAlwaysOnTop(true);

	myWindow.loadFile('src/index.html');
	myWindow.once('ready-to-show', () => {
		//myWindow.webContents.openDevTools()
		myWindow.setIgnoreMouseEvents(true, { forward: true });
	});

});

ipcMain.on('set-click',(event,arg)=>{
	if(arg=='false'){
		myWindow.setIgnoreMouseEvents(false)
	} else {
		myWindow.setIgnoreMouseEvents(true, { forward: true });
	}
})