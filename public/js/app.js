var app = (function () {
    var version = "1.2.0", codeName = "Atina", buildDate = "25.11.2017.", api = {
        getVersion: function () {
            return version;
        },
        getCodeName: function () {
            return codeName;
        },
        getBuildDate: function () {
            return buildDate;
        }
    };
    return api;
})();
var Setting = (function () {
    function Setting() {
        this.element = null;
        this.settingName = null;
        this.messageOnTurnedOn = null;
        this.messageOnTurnedOff = null;
    }
    Setting.prototype.setElement = function (element) {
        this.element = element;
        return this;
    };
    Setting.prototype.setSettingName = function (settingName) {
        this.settingName = settingName;
        return this;
    };
    Setting.prototype.setMessageOnTurnedOn = function (messageOnTurnedOn) {
        this.messageOnTurnedOn = messageOnTurnedOn;
        return this;
    };
    Setting.prototype.setMessageOnTurnedOff = function (messageOnTurnedOff) {
        this.messageOnTurnedOff = messageOnTurnedOff;
        return this;
    };
    Setting.prototype.attachSetting = function () {
        var _this = this;
        if (this.element === null ||
            this.settingName === null ||
            this.messageOnTurnedOn === null ||
            this.messageOnTurnedOff === null) {
            alert("Podešavanje ne može biti primenjeno bez popunjavanja svih parametara!");
            throw new Error("Neki parametri podešavanja nisu popunjeni.");
        }
        document.getElementById(this.element.id).addEventListener("click", function () {
            if (!_this.element.checked) {
                chrome.storage.local.get("mcm-settings", function (result) {
                    var settings = result["mcm-settings"];
                    settings[_this.settingName] = false;
                    chrome.storage.local.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            alert("Došlo je do greške pri promeni podešavanja!");
                            console.log(chrome.runtime.lastError);
                            throw new Error("Došlo je do greške pri promeni podešavanja.");
                        }
                        console.log(_this.messageOnTurnedOff);
                    });
                });
            }
            else {
                chrome.storage.local.get("mcm-settings", function (result) {
                    var settings = result["mcm-settings"];
                    settings[_this.settingName] = true;
                    chrome.storage.local.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            alert("Došlo je do greške pri promeni podešavanja!");
                            console.log(chrome.runtime.lastError);
                            throw new Error("Došlo je do greške pri promeni podešavanja.");
                        }
                        console.log(_this.messageOnTurnedOn);
                    });
                });
            }
        });
        chrome.storage.local.get("mcm-settings", function (result) {
            var settings = result["mcm-settings"];
            _this.element.checked = (settings[_this.settingName]) ? true : false;
        });
        this.addToSettingRegister();
    };
    Setting.prototype.addToSettingRegister = function () {
        if (this.settingName !== null) {
            Setting.settingRegister.push(this.settingName);
        }
    };
    Setting.settingRegister = [];
    return Setting;
}());
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get("mcm", function (result) {
        var results = result.mcm;
        if (results === undefined) {
            var mcm = {
                "version": app.getVersion(),
                "codeName": app.getCodeName(),
                "buildDate": app.getBuildDate()
            };
            var mcm_likes = [];
            var mcm_settings = {
                "like_tracker": true,
                "gifffer": false,
                "yt_block": false,
                "auto_fill": false
            };
            chrome.storage.local.set({ "mcm": mcm }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Opšti podaci o proširenju su dodati.");
            });
            chrome.storage.local.set({ "mcm-likes": mcm_likes }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za praćenje lajkova je dodato.");
            });
            chrome.storage.local.set({ "mcm-settings": mcm_settings }, function () {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Podešavanja proširenja su dodata.");
                alert("Čestitamo, proširenje je uspešno podešeno! " +
                    "Za pristup podešavanjima i ostalim opcijama " +
                    "proširenja kliknite na ikonicu proširenja " +
                    "koja se nalazi pored polja za kucanje URL-a.");
            });
        }
        else {
            chrome.storage.local.get("mcm-settings", function (result) {
                var settings = result["mcm-settings"];
                var updateSettings = false;
                if (settings["yt_block"] === undefined) {
                    settings["yt_block"] = false;
                    updateSettings = true;
                }
                if (settings["auto_fill"] === undefined) {
                    settings["auto_fill"] = false;
                    updateSettings = true;
                }
                if (updateSettings) {
                    chrome.storage.local.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                    });
                }
            });
        }
    });
    var likes = null;
    var dataForExport = null;
    var escapeHTML = function (str) {
        return str.replace(/[&"'<>]/g, function (m) { return ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[m]; });
    };
    chrome.storage.local.get("mcm-likes", function (result) {
        likes = result["mcm-likes"];
        if (likes !== null) {
            var likes_list = document.getElementById("likes-list");
            for (var i = likes.length - 1; i >= 0; --i) {
                var tr = document.createElement("tr");
                var author = document.createElement("td");
                var link = document.createElement("td");
                var a = document.createElement("a");
                var time = document.createElement("td");
                var date = document.createElement("td");
                author.innerHTML = escapeHTML(likes[i]["author"]);
                time.innerHTML = escapeHTML(likes[i]["time"]);
                date.innerHTML = escapeHTML(likes[i]["date"]);
                tr.appendChild(author);
                a.innerText = likes[i]["link"];
                a.href = likes[i]["link"];
                link.appendChild(a);
                tr.appendChild(link);
                tr.appendChild(time);
                tr.appendChild(date);
                likes_list.appendChild(tr);
            }
        }
    });
    document.getElementById("new").addEventListener("click", function () {
        var choice = confirm("Da li ste sigurni da želite započnete novu sesiju? Ova opcija će " +
            "obrisati sve do sada zabeležene podatke.");
        if (choice) {
            chrome.storage.local.set({ "mcm-likes": [] }, function () {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri započinjanju nove sesije!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri započinjanju nove sesije.");
                }
            });
            window.location.reload();
        }
    });
    document.getElementById("export").addEventListener("click", function () {
        var likes = null;
        var settings = null;
        chrome.storage.local.get("mcm-likes", function (result) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                throw new Error(String(chrome.runtime.lastError));
            }
            else {
                likes = result["mcm-likes"];
            }
        });
        chrome.storage.local.get("mcm-settings", function (result) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                throw new Error(String(chrome.runtime.lastError));
            }
            else {
                if (likes.length) {
                    settings = result["mcm-settings"];
                    dataForExport = JSON.stringify({
                        "mcm-likes": likes,
                        "mcm-settings": settings
                    });
                    document.getElementById("export-data-json").setAttribute("value", dataForExport);
                }
                else {
                    document.getElementById("download-data-json").setAttribute("disabled", "disabled");
                    alert("Trenutno nema podataka za izvoz!");
                }
            }
        });
    });
    document.getElementById("export-data-json").addEventListener("click", function () {
        var field = document.getElementById("export-data-json");
        field.setSelectionRange(0, field.value.length);
    });
    document.getElementById("download-data-json").addEventListener("click", function () {
        var blob = new Blob([dataForExport], { type: "text/json" });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, "mcm.json");
        }
        else {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "mcm.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
    document.getElementById("informations").addEventListener("click", function () {
        alert("Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n");
    });
    var likesSetting = new Setting()
        .setElement(document.getElementById("likes-setting"))
        .setSettingName("like_tracker")
        .setMessageOnTurnedOn("Praćenje lajkova je uključeno.")
        .setMessageOnTurnedOff("Praćenje lajkova je isključeno.")
        .attachSetting();
    var giffferSetting = new Setting()
        .setElement(document.getElementById("gifffer-setting"))
        .setSettingName("gifffer")
        .setMessageOnTurnedOn("Automatsko pauziranje GIF-ova je uključeno.")
        .setMessageOnTurnedOff("Automatsko pauziranje GIF-ova je isključeno.")
        .attachSetting();
    var ytBlockSetting = new Setting()
        .setElement(document.getElementById("yt-block-setting"))
        .setSettingName("yt_block")
        .setMessageOnTurnedOn("Automatsko blokiranje YouTube video zapisa je uključeno.")
        .setMessageOnTurnedOff("Automatsko blokiranje YouTube video zapisa je isključeno.")
        .attachSetting();
    var autoFillSetting = new Setting()
        .setElement(document.getElementById("auto-fill-setting"))
        .setSettingName("auto_fill")
        .setMessageOnTurnedOn("Automatsko popunjavanje postova sa manje od 10 slova je uključeno.")
        .setMessageOnTurnedOff("Automatsko popunjavanje postova sa manje od 10 slova je isključeno.")
        .attachSetting();
    var disableApplyDataButton = function () {
        document.getElementById("apply-data-json").setAttribute("disabled", "disabled");
    };
    var enableApplyDataButton = function () {
        document.getElementById("apply-data-json").removeAttribute("disabled");
    };
    document.getElementById("import-data-json-file").addEventListener("change", function () {
        disableApplyDataButton();
        if (!(File && FileReader && FileList && Blob)) {
            alert("Vaš pregledač ne podržava opciju učitavanja fajlova lokalno; morate prekopirati sadržaj fajla u polje!");
            enableApplyDataButton();
            return;
        }
        var files = document.getElementById("import-data-json-file").files;
        if (!files.length) {
            alert("Molimo vas da izaberete fajl sa podacima!");
            enableApplyDataButton();
            return;
        }
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("import-data-json").value = reader.result;
            enableApplyDataButton();
        };
        reader.readAsText(file);
    });
    document.getElementById("apply-data-json").addEventListener("click", function () {
        disableApplyDataButton();
        var data = document.getElementById("import-data-json").value;
        var importSettings = document.getElementById("import-settings").checked;
        if (data.trim() == "") {
            alert("Molimo vas da dodate fajl sa podacima ili podatke kopirate u polje pre klika na dugme 'Uvezi'!");
        }
        data = JSON.parse(data);
        if (data["mcm-likes"] === undefined || !Array.isArray(data["mcm-likes"])) {
            alert("Uneti podaci nisu validni!");
            enableApplyDataButton();
            return;
        }
        else {
            var likes_1 = [];
            chrome.storage.local.get("mcm-likes", function (result) {
                likes_1 = result["mcm-likes"];
            });
            for (var i = 0; i < data["mcm-likes"].length; i++) {
                var like = data["mcm-likes"][i];
                likes_1.push({
                    "id": like["id"],
                    "author": like["author"],
                    "link": like["link"],
                    "time": like["time"],
                    "date": like["date"]
                });
            }
            chrome.storage.local.set({ "mcm-likes": likes_1 }, function () {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri izmeni podataka!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri izmeni podataka.");
                }
                console.log("Podaci o lajkovima su uvezeni.");
                if (importSettings) {
                    if (data["mcm-settings"] === undefined) {
                        alert("Podaci o podešavanjima nisu validni!");
                        enableApplyDataButton();
                        return;
                    }
                    var settings = {};
                    for (var i = 0; i < Setting.settingRegister.length; i++) {
                        var setting = Setting.settingRegister[i];
                        if (data["mcm-settings"][setting] !== undefined) {
                            settings[setting] = data["mcm-settings"][setting];
                        }
                    }
                    chrome.storage.local.set({ "mcm-settings": settings }, function () {
                        if (chrome.runtime.lastError) {
                            alert("Došlo je do greške pri izmeni podataka!");
                            console.log(chrome.runtime.lastError);
                            throw new Error("Došlo je do greške pri izmeni podataka.");
                        }
                        console.log("Podešavanja su uspešno primenjena.");
                    });
                }
            });
            window.location.reload();
        }
    });
});
