export default async function handler(req, res) {

/*
 * Hanya izinkan POST
 */
if (req.method !== "POST") {
    return res.status(405).json({
        ok: false,
        error: "Method not allowed"
    });
}

try {

    const {
        type,
        page,
        linkName,
        target,
        device,
        browser,
        url,
        time
    } = req.body || {};

    const BOT_TOKEN =
        process.env.TELEGRAM_BOT_TOKEN;

    const CHAT_ID =
        process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {

        return res.status(500).json({
            ok: false,
            error: "Telegram environment variables belum diset"
        });

    }


    /* =========================
       FORMAT WAKTU
    ========================= */

    let formattedTime = time || "-";

    try {

        formattedTime =
            new Date(time).toLocaleString(
                "id-ID",
                {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "full",
                    timeStyle: "medium"
                }
            );

    } catch {

        formattedTime = time || "-";

    }


    /* =========================
       WEBSITE OPEN
    ========================= */

    let message = "";

    if (type === "open") {

        message =

`🌐 WEBSITE DIN STORE

📄 Halaman: ${page || "DIN STORE"}

📱 Device: ${device || "-"}
🌍 Browser: ${browser || "-"}

⏰ Waktu: ${formattedTime}

🔗 URL:
${url || "-"}`;

    }


    /* =========================
       LINK CLICK
    ========================= */

    else if (type === "click") {

        message =

`🔗 LINK DIN STORE DIKLIK

📌 Menu: ${linkName || "-"}

🌐 Tujuan:
${target || "-"}

📱 Device: ${device || "-"}
🌍 Browser: ${browser || "-"}

⏰ Waktu: ${formattedTime}

📄 Dari:
${page || "-"}`;

    }


    /* =========================
       UNKNOWN EVENT
    ========================= */

    else {

        message =

`🔔 DIN STORE

Event: ${type || "Unknown"}

📱 Device: ${device || "-"}
🌍 Browser: ${browser || "-"}

⏰ Waktu: ${formattedTime}

🔗 URL:
${url || "-"}`;

    }


    /* =========================
       TELEGRAM API
    ========================= */

    const telegramResponse =
        await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    disable_web_page_preview: true
                })
            }
        );


    const telegramData =
        await telegramResponse.json();


    if (!telegramResponse.ok) {

        return res.status(500).json({
            ok: false,
            error: "Telegram API error",
            telegram: telegramData
        });

    }


    return res.status(200).json({
        ok: true,
        telegram: telegramData
    });


} catch (error) {

    console.error("Telegram backend error:", error);

    return res.status(500).json({
        ok: false,
        error: error.message
    });

}

}
