const { ipcRenderer } = require("electron");
const $ = require("jQuery");
let translation;

const SetStrings = () => {
    $("#text_update_title").text(translation["TEXT_UPDATE_TITLE"]);
    $("#text_update_processing").html(translation["TEXT_UPDATE_PROCESSING"]);
};

const LoadStrings = () => {
    translation = ipcRenderer.sendSync("get-locale");
    SetStrings();
};

ipcRenderer.on("progress", (ev, data) => {
    $(".progress-bar").css("width", `${data.percent}%`);
});

$(document).on("ready", () => {
    config = ipcRenderer.sendSync("get-config");
    LoadStrings();
});