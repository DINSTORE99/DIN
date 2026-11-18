const TELEGRAM_API = "/api/telegram";

/* =========================
DEVICE INFO
========================= */
function getBrowserInfo() {
const ua = navigator.userAgent;

let browser = "Unknown";

if (/Edg/i.test(ua)) {
    browser = "Edge";
} else if (/OPR|Opera/i.test(ua)) {
    browser = "Opera";
} else if (/Chrome|CriOS/i.test(ua)) {
    browser = "Chrome";
} else if (/Firefox|FxiOS/i.test(ua)) {
    browser = "Firefox";
} else if (/Safari/i.test(ua)) {
    browser = "Safari";
}

let device = "Unknown";

if (/Android/i.test(ua)) {
    device = "Android";
} else if (/iPhone/i.test(ua)) {
    device = "iPhone";
} else if (/iPad/i.test(ua)) {
    device = "iPad";
} else if (/Windows/i.test(ua)) {
    device = "Windows";
} else if (/Macintosh|Mac OS/i.test(ua)) {
    device = "Mac";
} else if (/Linux/i.test(ua)) {
    device = "Linux";
}

return {
    browser,
    device
};

}

/* =========================
KIRIM NOTIF WEBSITE DIBUKA
========================= */
async function sendOpenNotif() {

const info = getBrowserInfo();

try {

    const response = await fetch(TELEGRAM_API, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            type: "open",

            page: "DIN STORE",

            device: info.device,

            browser: info.browser,

            url: window.location.href,

            time: new Date().toISOString()
        })
    });

    const data = await response.json();

    if (data.ok) {
        console.log("Telegram notification sent");
    } else {
        console.error("Telegram notification failed:", data);
    }

} catch (error) {

    console.error(
        "Telegram API error:",
        error
    );

}

}

/* =========================
NOTIF LINK DIKLIK
========================= */
async function sendClickNotif(linkName, url) {

const info = getBrowserInfo();

try {

    const response = await fetch(TELEGRAM_API, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            type: "click",

            linkName: linkName,

            target: url,

            device: info.device,

            browser: info.browser,

            page: window.location.href,

            time: new Date().toISOString()
        })
    });

    const data = await response.json();

    console.log("Click notification:", data);

} catch (error) {

    console.error(
        "Click notification error:",
        error
    );

}

}

/* =========================
TRACK SEMUA LINK
========================= */
document.addEventListener("DOMContentLoaded", () => {

const links = document.querySelectorAll(
    ".buttons a.link"
);

links.forEach(link => {

    link.addEventListener("click", () => {

        const name =
            link.querySelector("span")?.textContent?.trim()
            || "Unknown";

        const url =
            link.href;

        /*
         * Kirim notif tanpa menahan
         * proses pembukaan link.
         */
        sendClickNotif(name, url);

    });

});

});

/* =========================
AUTO NOTIF SAAT WEBSITE DIBUKA
========================= */
window.addEventListener("load", () => {

sendOpenNotif();

});
