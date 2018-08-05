var gifffer = null;
var ytBlock = null;
var autoFill = null;

chrome.storage.local.get("mcm-settings", function(result) {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        throw new Error(chrome.runtime.lastError);
    }

    var settings = result["mcm-settings"];
    var gifffer = settings["gifffer"];
    var ytBlock = settings["yt_block"];
    var autoFill = settings["auto_fill"];
    var postHTML = settings["post_html"];
    var postBBCode = settings["post_bbcode"];
    var postSmilies = settings["post_smilies"];
    var postSignature = settings["post_signature"];
    var postEmail = settings["post_email"];

    window.onload = function() {
        if (gifffer) {
            var images = document.getElementsByTagName("img");
            for (var i = 0; i < images.length; i++) {
                var srcAttribute = images[i].getAttribute("src");
                var classAttribute = images[i].getAttribute("class");
                if (srcAttribute.indexOf(".gif") > -1 && classAttribute === "post_slika") {
                    images[i].removeAttribute("src");
                    images[i].setAttribute("data-gifffer", srcAttribute);
                }
            }
            Gifffer();
        }
        if (ytBlock) {
            var ytVideos = document.getElementsByClassName("youtube");
            while (ytVideos[0]) {
                ytVideos[0].parentNode.removeChild(ytVideos[0]);
            }
        }
        if (document.getElementById("reply")) {
            if (autoFill) {
                var submitButton = document.getElementsByName("post")[1];

                submitButton.addEventListener("click", function handler(e) {
                    e.preventDefault();

                    var postField = document.getElementById("reply");

                    if (postField.value.length < 10) {
                        postField.value = postField.value + "[b][/b][b][/b]";
                    }

                    submitButton.removeEventListener("click", handler);
                    submitButton.click();
                });
            }

            if (postHTML) {
                var element = document.getElementsByName("disable_html").item(0);
                if (element.checked) {
                    element.click();
                }
            }

            if (!postBBCode) {
                var element = document.getElementsByName("disable_bbcode").item(0);
                if (!element.checked) {
                    element.click();
                }
            }

            if (!postSmilies) {
                var element = document.getElementsByName("disable_smilies").item(0);
                if (!element.checked) {
                    element.click();
                }
            }

            if (!postSignature) {
                var element = document.getElementsByName("attach_sig").item(0);
                if (element.checked) {
                    element.click();
                }
            }

            if (postEmail) {
                var element = document.getElementsByName("notify").item(0);
                if (!element.checked) {
                    element.click();
                }
            }
        }
    }
});