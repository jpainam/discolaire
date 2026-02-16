import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveEnv: (envContent: string) => ipcRenderer.invoke("save-env", envContent),
  getEnvTemplate: () => ipcRenderer.invoke("get-env-template"),
});
