let app = (() => {
    let version   = "1.3.0",
        codeName  = "Skoplje",
        buildDate = "05.08.2018.",

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

    /**
     * Prikazivanje informacija o proširenju.
     */

    let mcmVersionField = document.getElementById("mcm-version");
    let mcmVersionText = document.createTextNode(app.getVersion());
    mcmVersionField.appendChild(mcmVersionText);

    let mcmCodeNameField = document.getElementById("mcm-codename");
    let mcmCodeNameText = document.createTextNode(app.getCodeName());
    mcmCodeNameField.appendChild(mcmCodeNameText);

    let mcmBuildDateField = document.getElementById("mcm-build-date");
    let mcmBuildDateText = document.createTextNode(app.getBuildDate());
    mcmBuildDateField.appendChild(mcmBuildDateText);

    /**
     * Učitavanje podešavanja proširenja.
     */

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
                "auto_fill": false,
                "post_html": false,
                "post_bbcode": true,
                "post_smilies": true,
                "post_signature": true,
                "post_email": false
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

                window.location.reload();
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

                if (settings["post_html"] === undefined) {
                    settings["post_html"] = false;
                    updateSettings = true;
                }

                if (settings["post_bbcode"] === undefined) {
                    settings["post_bbcode"] = true;
                    updateSettings = true;
                }

                if (settings["post_smilies"] === undefined) {
                    settings["post_smilies"] = true;
                    updateSettings = true;
                }

                if (settings["post_signature"] === undefined) {
                    settings["post_signature"] = true;
                    updateSettings = true;
                }

                if (settings["post_email"] === undefined) {
                    settings["post_email"] = false;
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

    /**
     * Učitavanje i prikazivanje lajkovanih poruka.
     */
    
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

    /**
     * Opcija za brisanje podataka.
     */

    document.getElementById("delete").addEventListener("click", () => {
        let choice = confirm("Da li ste sigurni da želite da obrišete podatke? Ova opcija će " +
                             "obrisati sve do sada zabeležene podatke (podešavanja se ne brišu).");
        if (choice) {
            chrome.storage.local.set({"mcm-likes": []}, () => {
                if (chrome.runtime.lastError) {
                    alert("Došlo je do greške pri brisanju podataka!");
                    console.log(chrome.runtime.lastError);
                    throw new Error("Došlo je do greške pri brisanju podataka.");
                }
            });
            window.location.reload();
        }
    });

    /**
     * Opcija za izvoz podataka.
     */

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

    /**
     * Opcija za izvoz podataka.
     */

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

    /**
     * Dodavanje podešavanja u registar podešavanja.
     */

    let likesSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("likes-setting"))
    .setSettingName("like_tracker")
    .setMessageOnTurnedOn("Praćenje lajkova je omogućeno.")
    .setMessageOnTurnedOff("Praćenje lajkova je onemogućeno.")
    .attachSetting();

    let giffferSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("gifffer-setting"))
    .setSettingName("gifffer")
    .setMessageOnTurnedOn("Automatsko pauziranje GIF-ova je omogućeno.")
    .setMessageOnTurnedOff("Automatsko pauziranje GIF-ova je onemogućeno.")
    .attachSetting();

    let ytBlockSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("yt-block-setting"))
    .setSettingName("yt_block")
    .setMessageOnTurnedOn("Automatsko blokiranje YouTube video zapisa je omogućeno.")
    .setMessageOnTurnedOff("Automatsko blokiranje YouTube video zapisa je onemogućeno.")
    .attachSetting();

    let autoFillSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("auto-fill-setting"))
    .setSettingName("auto_fill")
    .setMessageOnTurnedOn("Automatsko popunjavanje postova sa manje od 10 slova je omogućeno.")
    .setMessageOnTurnedOff("Automatsko popunjavanje postova sa manje od 10 slova je onemogućeno.")
    .attachSetting();

    let postHTMLSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("post-html-setting"))
    .setSettingName("post_html")
    .setMessageOnTurnedOn("Automatsko uključivanje HTML-a u porukama je omogućeno.")
    .setMessageOnTurnedOff("Automatsko uključivanje HTML-a u porukama je onemogućeno.")
    .attachSetting();

    let postBBCodeSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("post-bbcode-setting"))
    .setSettingName("post_bbcode")
    .setMessageOnTurnedOn("Automatsko uključivanje BB koda u poruci je omogućeno.")
    .setMessageOnTurnedOff("Automatsko uključivanje BB koda u poruci je onemogućeno.")
    .attachSetting();

    let postSmiliesSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("post-smilies-setting"))
    .setSettingName("post_smilies")
    .setMessageOnTurnedOn("Automatsko uključivanje smajlija u poruci je omogućeno.")
    .setMessageOnTurnedOff("Automatsko uključivanje smajlija u poruci je onemogućeno.")
    .attachSetting();

    let postSignatureSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("post-signature-setting"))
    .setSettingName("post_signature")
    .setMessageOnTurnedOn("Automatsko kačenje potpisa je omogućeno.")
    .setMessageOnTurnedOff("Automatsko kačenje potpisa je onemogućeno.")
    .attachSetting();

    let postEmailSetting = new Setting()
    .setElement(<HTMLInputElement>document.getElementById("post-email-setting"))
    .setSettingName("post_email")
    .setMessageOnTurnedOn("Automatsko obaveštavanje na email kada neko odgovori je omogućeno.")
    .setMessageOnTurnedOff("Automatsko obaveštavanje na email kada neko odgovori je onemogućeno.")
    .attachSetting();

    let disableApplyDataButton = () => {
        document.getElementById("apply-data-json").setAttribute("disabled", "disabled");
    }

    let enableApplyDataButton = () => {
        document.getElementById("apply-data-json").removeAttribute("disabled");
    }

    /**
     * Uvoz podataka.
     */

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

    /**
     * Dodavanje uvezenih podataka u proširenje.
     */

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