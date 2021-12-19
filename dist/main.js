'use strict';

var Module = require('module');
var path = require('path');
var inspector = require('inspector');
var sucrase = require('sucrase');
var sass = require('sass');
var electron = require('electron');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Module__default = /*#__PURE__*/_interopDefaultLegacy(Module);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var sucrase__default = /*#__PURE__*/_interopDefaultLegacy(sucrase);
var sass__default = /*#__PURE__*/_interopDefaultLegacy(sass);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

if (process.argv.join("").includes("--debug")) {
    inspector.open();
    inspector.waitForDebugger();
}

// Main
const COMPILE_SASS = "pccompat-compile-sass";
const COMPILE_JSX = "pccompat-compile-jsx";
const GET_APP_PATH = "pccompat-get-app-path";
const SET_DEV_TOOLS = "pccompat-open-devtools";
const GET_WINDOW_DATA = "pccompat-get-window-data";

electron.ipcMain.on(GET_APP_PATH, (event)=>{
    event.returnValue = electron.app.getAppPath();
});
electron.ipcMain.on(GET_WINDOW_DATA, (event)=>{
    event.returnValue = event.sender.kernelWindowData;
});
electron.ipcMain.on(COMPILE_SASS, (event, file)=>{
    let result = "";
    try {
        // @ts-ignore
        let abc = sass__default["default"].renderSync({
            file
        });
        result = abc.css.toString();
    } catch (error) {
        console.error(error);
    }
    event.returnValue = result;
});
electron.ipcMain.on(COMPILE_JSX, (event, file)=>{
    if (!fs__default["default"].existsSync(file)) {
        event.returnValue = "";
        return;
    }
    const filecontent = fs__default["default"].readFileSync(file, "utf8");
    const { code  } = sucrase__default["default"].transform(filecontent, {
        transforms: [
            "jsx",
            "imports",
            "typescript"
        ],
        filePath: file
    });
    event.returnValue = code;
});
electron.ipcMain.handle(SET_DEV_TOOLS, (event, value)=>{
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    if (value && !win.webContents.isDevToolsOpened()) {
        win.webContents.openDevTools();
    } else {
        win.webContents.closeDevTools();
    }
});

// @ts-ignore
Module__default["default"].globalPaths.push(path__default["default"].resolve(__dirname, "node_modules"));
//# sourceMappingURL=main.js.map
