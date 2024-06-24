let settings = {};
const markdown_choose_button = document.getElementById("markdown_choose_button");
const markdown_filename_view = document.getElementById("markdown_filename_view");
const reference_doc_choose_button = document.getElementById("reference_doc_choose_button");
const reference_doc_filename_view = document.getElementById("reference_doc_filename_view");
const marp_config_choose_button = document.getElementById("marp_config_choose_button");
const marp_config_filename_view = document.getElementById("marp_config_filename_view");

markdown_choose_button.onclick = async () => {
    const res = await outside.chooseFile("Select a Markdown", [{ name: "Markdown", extensions: ["md"] }]);
    if (!res.canceled) {
        settings.markdown = res.filePaths[0];
        markdown_filename_view.innerHTML = res.filePaths[0];
    } else {
        settings.markdown = undefined;
        markdown_filename_view.innerHTML = "";
    }
}
reference_doc_choose_button.onclick = async () => {
    const res = await outside.chooseFile("Select a PowerPoint", [{ name: "PowerPoint", extensions: ["pptx"] }]);
    if (!res.canceled) {
        settings.reference_doc = res.filePaths[0];
        reference_doc_filename_view.innerHTML = res.filePaths[0];
    } else {
        settings.reference_doc = undefined;
        reference_doc_filename_view.innerHTML = "";
    }
}



marp_config_choose_button.onclick = async () => {
    const res = await outside.chooseFile("Select a Config File", [{ name: "Marp Config", extensions: ["json", "yaml", "yml"] }]);
    if (!res.canceled) {
        settings.marp_config = res.filePaths[0];
        marp_config_filename_view.innerHTML = res.filePaths[0];
    } else {
        settings.marp_config = undefined;
        marp_config_filename_view.innerHTML = "";
    }
}



const convert_button = document.getElementById("convert_button");
convert_button.onclick = () => {
    if (!settings.markdown_type) {
        settings.markdown_type = "markdown_strict";
    }
    outside.send_settings(settings);
}

const markdown_type_select = document.getElementById("markdown_type");
markdown_type_select.onchange = (e) => {
    settings.markdown_type = e.target.value;
}

const reference_doc_output_button = document.getElementById("reference_doc_output_button");
reference_doc_output_button.onclick = () => {
    outside.output_reference_pptx();
}

const marp_output = document.getElementById("output_picture");
marp_output.onchange = (e) => {
    settings.marp_output = e.target.checked;
    document.getElementById("reference_doc_choose_button").disabled = e.target.checked;
    document.getElementById("markdown_type").disabled = e.target.checked;
    if (e.target.checked) {
        document.getElementById("marp_config_file_chooser").style.display = "block";
    } else {
        document.getElementById("marp_config_file_chooser").style.display = "none";
        settings.marp_config = undefined;
        marp_config_filename_view.innerHTML = "";
    }
}
