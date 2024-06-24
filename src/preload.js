const {contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("outside", {
    chooseFile: async (title, filters) => {
        const res = await ipcRenderer.invoke("FileChooser", title, filters);
        return res;
    }
,
    send_settings: (settings) => {
        ipcRenderer.invoke("SendSettings", settings);
    },
    output_reference_pptx: () => {
        ipcRenderer.invoke("OutputReferencePptx");
    }
})
