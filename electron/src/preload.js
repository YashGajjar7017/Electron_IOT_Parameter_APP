const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  connectToDevice: (payload) => ipcRenderer.invoke('device:connect', payload)
});
