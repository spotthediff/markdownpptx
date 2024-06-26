const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs").promises;
const child_process = require("node:child_process");
const { marpCli } = require('@marp-team/marp-cli');

const pandoc_executable_path = () => {
    let os_name;
    let exe_name;
    switch (process.platform) {
        case "linux":
            os_name = "linux";
            exe_name = "pandoc";
            break;
        case "darwin":
            os_name = "macos";
            exe_name = "pandoc";
            break;
        case "win32":
            os_name = "win";
            exe_name = "pandoc.exe";
            break;
        default:
            return "";
    }
    return path.join(process.resourcesPath, "bin", os_name, exe_name);
}

const distdir_path = path.join(os.homedir(), "markdownpptx");
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 650,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile(path.join(__dirname, "index.html"));
    return win;
}
app.whenReady().then(() => {
    const win = createWindow()
    ipcMain.handle('FileChooser', async (e, title, filters) => {
        const res = await dialog.showOpenDialog(win, { properties: ["openFile"], title: title, filters: filters })
        return res;
    });

    ipcMain.handle("SendSettings", async (e, settings) => {
        if (!settings.marp_output) {
            execute_pandoc(settings);
        } else {
            execute_marp(settings);
        }
    })

    ipcMain.handle("OutputReferencePptx", async (e) => {
        output_reference();
    })
})

const output_reference = async () => {
    const dircreation = await fs.mkdir(distdir_path, { recursive: true });
    const executable_path = pandoc_executable_path();
    const output_path = path.join(distdir_path, "reference.pptx");
    child_process.execFile(executable_path, ["-o", output_path, "--print-default-data-file", "reference.pptx"], (error, stdout, stderr) => {
        if (error) {
            dialog.showErrorBox("Error", error.message);
        } else {
            dialog.showMessageBox({ message: "Done Successfully!\nOutput Reference Side to " + output_path });
        }
    })

}

const execute_marp = async (settings) => {
    let markdown_file_error = false
    let markdown_error = false;
    try {
        await fs.access(settings.markdown, fs.constants.R_OK);
    } catch (e) {
        dialog.showErrorBox("Error", e.message);
        return { "error": "Markdown file error" };
    }
    const dircreation = await fs.mkdir(distdir_path, { recursive: true });
    const extname = path.extname(settings.markdown);
    const name = path.win32.basename(settings.markdown, extname);
    const output_path = path.join(distdir_path, name + ".pptx");
    let command_args = [settings.markdown, "--pptx", "--allow-local-files", "-o", output_path, "--template", "bare"];
    if (settings.marp_config) {
        try {
            await fs.access(settings.marp_config, fs.constants.R_OK);
            command_args = command_args.concat(["-c", settings.marp_config]);
        } catch (e) {
            dialog.showErrorBox("Error", e.message);
            return { "error": "Marp Config File Error" };
        }
    }
    marpCli(command_args)
        .then((exitStatus) => {
            if (exitStatus > 0) {
                dialog.showErrorBox("Error", `Error (Exit status: ${exitStatus})`);
            } else {
                dialog.showMessageBox({ message: `Done Successfully!\nOutput to ${output_path}` });
            }
        })
        .catch(console.error);
}

const execute_pandoc = async (settings) => {
    let error_obj;
    let markdown_file_error = false
    let markdown_error = false;
    let reference_doc_error = false;
    let exec_error = false;
    try {
        await fs.access(settings.markdown, fs.constants.R_OK);
    } catch (e) {
        dialog.showErrorBox("Error", e.message);
        return { "error": "Markdown file error" };
    }
    if (settings.reference_doc !== undefined) {
        try {
            await fs.access(settings.reference_doc, fs.constants.R_OK);
        } catch (e) {
            dialog.showErrorBox("Error", e.message);
            return { "error": "Reference doc error" };
        }
    }
    const dircreation = await fs.mkdir(distdir_path, { recursive: true });
    const executable_path = pandoc_executable_path();
    const extname = path.extname(settings.markdown);
    const name = path.win32.basename(settings.markdown, extname);
    const output_path = path.join(distdir_path, name + ".pptx");
    let option = [settings.markdown, "-f", settings.markdown_type, "-t", "pptx", "-s", "-o", output_path];
    if (settings.reference_doc !== undefined && reference_doc_error === false) {
        option = option.concat(["--reference-doc", settings.reference_doc]);
    }
    child_process.execFile(executable_path, option, (error, stdout, stderr) => {
        if (error) {
            console.error(error, stderr);
            exec_error = true;
            error_obj = error;
            dialog.showErrorBox("Error", error.message);
        } else {
            dialog.showMessageBox({ message: "Done Successfully!\noutput to " + output_path });
        }
    })
}



