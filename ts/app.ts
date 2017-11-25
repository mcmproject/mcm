let app = (() => {
    let version   = "1.2.0",
        codeName  = "Atina",
        buildDate = "25.11.2017.",

        api = {
            getVersion() {
                return version;
            },
            getCodeName() {
                return codeName;
            },
            getBuildDate() {
                return buildDate;
            }
        };

    return api;
})();

class Setting {
    static settingRegister: string[] = [];
    element: HTMLInputElement = null;
    settingName: string = null;
    messageOnTurnedOn: string = null;
    messageOnTurnedOff: string = null;

    setElement(element: HTMLInputElement) {
        this.element = element;
        return this;
    }

    setSettingName(settingName: string) {
        this.settingName = settingName;
        return this;
    }

    setMessageOnTurnedOn(messageOnTurnedOn: string) {
        this.messageOnTurnedOn = messageOnTurnedOn;
        return this;
    }

    setMessageOnTurnedOff(messageOnTurnedOff: string) {
        this.messageOnTurnedOff = messageOnTurnedOff;
        return this;
    }

    attachSetting() {
        if (this.element === null || 
            this.settingName === null || 
            this.messageOnTurnedOn === null ||
            this.messageOnTurnedOff === null) 
        {
            alert("Podešavanje ne može biti primenjeno bez popunjavanja svih parametara!");
            throw new Error("Neki parametri podešavanja nisu popunjeni.");
        }

        document.getElementById(this.element.id).addEventListener("click", () => {
            if (!this.element.checked) {
                chrome.storage.local.get("mcm-settings", (result) => {
                    let settings = result["mcm-settings"];
                    settings[this.settingName] = false;
                    chrome.storage.local.set({"mcm-settings": settings}, () => {
                        if (chrome.runtime.lastError) {
                            alert("Došlo je do greške pri promeni podešavanja!");
                            console.log(chrome.runtime.lastError);
                            throw new Error("Došlo je do greške pri promeni podešavanja.");
                        }
                        console.log(this.messageOnTurnedOff);
                    });
                });
            } else {
                chrome.storage.local.get("mcm-settings", (result) => {
                    let settings = result["mcm-settings"];
                    settings[this.settingName] = true;
                    chrome.storage.local.set({"mcm-settings": settings}, () => {
                        if (chrome.runtime.lastError) {
                            alert("Došlo je do greške pri promeni podešavanja!");
                            console.log(chrome.runtime.lastError);
                            throw new Error("Došlo je do greške pri promeni podešavanja.");
                        }
                        console.log(this.messageOnTurnedOn);
                    });
                });
            }
        });

        chrome.storage.local.get("mcm-settings", (result) => {
            let settings = result["mcm-settings"];
            this.element.checked = (settings[this.settingName]) ? true : false;
        });

        this.addToSettingRegister();
    }

    private addToSettingRegister() {
        if (this.settingName !== null) {
            Setting.settingRegister.push(this.settingName);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("mcm", (result) => {
        let results = result.mcm;
        if (results === undefined) {
            let mcm = {
                "version": app.getVersion(),
                "codeName": app.getCodeName(),
                "buildDate": app.getBuildDate()
            };

            let mcm_likes = [];

            let mcm_settings = {
                "like_tracker": true,
                "gifffer": false,
                "yt_block": false,
                "auto_fill": false
            };
        
            chrome.storage.local.set({"mcm": mcm}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Opšti podaci o proširenju su dodati.");
            });
        
            chrome.storage.local.set({"mcm-likes": mcm_likes}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Skladište za praćenje lajkova je dodato.");
            });
        
            chrome.storage.local.set({"mcm-settings": mcm_settings}, () => {
                if (chrome.runtime.lastError) {
                    ErrorNotification.extensionInitError(chrome.runtime.lastError);
                }
                console.log("Podešavanja proširenja su dodata.");
        
                alert("Čestitamo, proširenje je uspešno podešeno! " +
                      "Za pristup podešavanjima i ostalim opcijama " +
                      "proširenja kliknite na ikonicu proširenja " +
                      "koja se nalazi pored polja za kucanje URL-a.");
            });
        } else {
            chrome.storage.local.get("mcm-settings", (result) => {
                let settings = result["mcm-settings"];
                let updateSettings = false;

                if (settings["yt_block"] === undefined) {
                    settings["yt_block"] = false;
                    updateSettings = true;
                }

                if (settings["auto_fill"] === undefined) {
                    settings["auto_fill"] = false;
                    updateSettings = true;
                }

                if (updateSettings) {
                    chrome.storage.local.set({"mcm-settings": settings}, () => {
                        if (chrome.runtime.lastError) {
                            ErrorNotification.extensionInitError(chrome.runtime.lastError);
                        }
                    });
                }
            });
        }
    });

    let likes = null;
    let dataForExport = null;

    let escapeHTML = (str) => { 
        return str.replace(/[&"'<>]/g, (m) => ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[m]); 
    }
    
    chrome.storage.local.get("mcm-likes", (result) => {
        likes = result["mcm-likes"];

        if (likes !== null) {
            let likes_list = document.getElementById("likes-list");
            for (let i = likes.length-1; i >= 0; --i) {
                let tr = document.createElement("tr");
                let author = document.createElement("td");
                let link = document.createElement("td");
                let a = document.createElement("a");
                let time = document.createElement("td");
                let date = document.createElement("td");

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

    document.getElementById("new").addEventListener("click", () => {
        let choice = confirm("Da li ste sigurni da želite započnete novu sesiju? Ova opcija će " +
                             "obrisati sve do sada zabeležene podatke.");
        if (choice) {
            chrome.storage.local.set({"mcm-likes": []}, () => {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri započinjanju nove sesije!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri započinjanju nove sesije.");
                }
            });
            window.location.reload();
        }
    });

    document.getElementById("export").addEventListener("click", () => {
        let likes = null;
        let settings = null;

        chrome.storage.local.get("mcm-likes", (result) => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                throw new Error(String(chrome.runtime.lastError));
            } else {
                likes = result["mcm-likes"];
            }
        });

        chrome.storage.local.get("mcm-settings", (result) => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                throw new Error(String(chrome.runtime.lastError));
            } else {
                if (likes.length) {
                    settings = result["mcm-settings"];

                    dataForExport = JSON.stringify({
                        "mcm-likes": likes,
                        "mcm-settings": settings
                    });

                    document.getElementById("export-data-json").setAttribute("value", dataForExport);
                } else {
                    document.getElementById("download-data-json").setAttribute("disabled", "disabled");
                    alert("Trenutno nema podataka za izvoz!");
                }
            }
        });
    });

    document.getElementById("export-data-json").addEventListener("click", () => {
        let field = (<HTMLInputElement>document.getElementById("export-data-json"));
        field.setSelectionRange(0, field.value.length);
    });

    document.getElementById("download-data-json").addEventListener("click", () => {
        let blob = new Blob([dataForExport], { type: "text/json" });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, "mcm.json");
        } else {
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "mcm.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    document.getElementById("informations").addEventListener("click", () => {
        alert(
            "Verzija: " + app.getVersion() + "\n" +
            "Kodno ime: " + app.getCodeName() + "\n" +
            "Datum izgradnje: " + app.getBuildDate() + "\n");
    });

    let likesSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("likes-setting"))
    .setSettingName("like_tracker")
    .setMessageOnTurnedOn("Praćenje lajkova je uključeno.")
    .setMessageOnTurnedOff("Praćenje lajkova je isključeno.")
    .attachSetting();

    let giffferSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("gifffer-setting"))
    .setSettingName("gifffer")
    .setMessageOnTurnedOn("Automatsko pauziranje GIF-ova je uključeno.")
    .setMessageOnTurnedOff("Automatsko pauziranje GIF-ova je isključeno.")
    .attachSetting();

    let ytBlockSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("yt-block-setting"))
    .setSettingName("yt_block")
    .setMessageOnTurnedOn("Automatsko blokiranje YouTube video zapisa je uključeno.")
    .setMessageOnTurnedOff("Automatsko blokiranje YouTube video zapisa je isključeno.")
    .attachSetting();

    let autoFillSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("auto-fill-setting"))
    .setSettingName("auto_fill")
    .setMessageOnTurnedOn("Automatsko popunjavanje postova sa manje od 10 slova je uključeno.")
    .setMessageOnTurnedOff("Automatsko popunjavanje postova sa manje od 10 slova je isključeno.")
    .attachSetting();

    let disableApplyDataButton = () => {
        document.getElementById("apply-data-json").setAttribute("disabled", "disabled");
    }

    let enableApplyDataButton = () => {
        document.getElementById("apply-data-json").removeAttribute("disabled");
    }

    document.getElementById("import-data-json-file").addEventListener("change", function() {
        disableApplyDataButton();

        if (!(File && FileReader && FileList && Blob)) {
            alert("Vaš pregledač ne podržava opciju učitavanja fajlova lokalno; morate prekopirati sadržaj fajla u polje!");
            enableApplyDataButton();
            return;
        }

        let files = (<HTMLInputElement>document.getElementById("import-data-json-file")).files;
        
        if (!files.length) {
            alert("Molimo vas da izaberete fajl sa podacima!");
            enableApplyDataButton();
            return;
        }

        let file = files[0];
        let reader = new FileReader();

        reader.onload = (e: any) => {
            (<HTMLInputElement>document.getElementById("import-data-json")).value = reader.result;
            enableApplyDataButton();
        }

        reader.readAsText(file);
    });

    document.getElementById("apply-data-json").addEventListener("click", function() {

        disableApplyDataButton();

        let data = (<HTMLInputElement>document.getElementById("import-data-json")).value;
        let importSettings = (<HTMLInputElement>document.getElementById("import-settings")).checked;
        
        if (data.trim() == "") {
            alert("Molimo vas da dodate fajl sa podacima ili podatke kopirate u polje pre klika na dugme 'Uvezi'!");
        }

        data = JSON.parse(data);
        if (data["mcm-likes"] === undefined || !Array.isArray(data["mcm-likes"])) {
            alert("Uneti podaci nisu validni!");
            enableApplyDataButton();
            return;
        } else {
            let likes = [];

            chrome.storage.local.get("mcm-likes", (result) => {
                likes = result["mcm-likes"];
            });

            for (let i = 0; i < data["mcm-likes"].length; i++) {
                let like = data["mcm-likes"][i];
                likes.push({
                    "id": like["id"],
                    "author": like["author"],
                    "link": like["link"],
                    "time": like["time"],
                    "date": like["date"]
                });
            }

            chrome.storage.local.set({"mcm-likes": likes}, () => {
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

                    let settings = {};

                    for (let i = 0; i < Setting.settingRegister.length; i++) {
                        let setting = Setting.settingRegister[i];
                        if (data["mcm-settings"][setting] !== undefined) {
                            settings[setting] = data["mcm-settings"][setting];
                        }
                    }

                    chrome.storage.local.set({"mcm-settings": settings}, () => {
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