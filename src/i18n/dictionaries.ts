export type Language = 'en' | 'id';

export const dictionaries = {
  en: {
    // App Header
    "header.title": "Chat Wrapped",
    "header.privacy": "PRIVACY",

    // Upload Hero
    "hero.kicker": "_ WHOLE CONVERSATION RECAP",
    "hero.title1": "WhatsApp",
    "hero.title2": "Chat",
    "hero.title3": "Wrapped.",
    "hero.subtitle": "Parses your exported chat log locally. Counts everything. Gets Gemini to roast you. Keeps your data in your browser.",

    // Upload Zone
    "upload.title": "Upload your chat export",
    "upload.subtitle": "Make sure to export WITHOUT media. Must be a .txt file.",
    "upload.or": "or",
    "upload.skipAI": "SKIP AI — USE DEMO INSIGHTS",
    "upload.error_invalid_file": "Please upload a WhatsApp exported chat (.txt file).",
    "upload.drag_drop": "Drop your WhatsApp export here",
    "upload.drag_active": "Drop to analyze",
    "upload.click_browse": "click to browse",
    "upload.for_file": "for a .txt file",

    // How It Works
    "how.kicker": "_ HOW IT WORKS",
    "how.step1.title": "Export Chat",
    "how.step1.desc": "WhatsApp → Chat → Export (without media)",
    "how.step2.title": "Upload Here",
    "how.step2.desc": "Parsed entirely in your browser — nothing leaves your device",
    "how.step3.title": "Get Wrapped",
    "how.step3.desc": "Stats, charts, and an AI roast using your own Gemini key",

    // Modals
    "error.title": "_ ERROR",
    "privacy.title": "_ PRIVACY",
    "privacy.close": "Close",
    "privacy.cancel": "Cancel",
    "privacy.continue": "Got it — show my Wrapped",
    "privacy.p1": "Your chat file is processed <bold>entirely in your browser</bold> — parsing, counting, and every metric on this page run as local JavaScript. Nothing is uploaded to a server.",
    "privacy.p2": "If you use the AI personality/roast feature, only <bold>aggregated numbers and a handful of sample lines</bold> (not your full chat) are sent directly from your browser to Google's Gemini API, using your own API key.",
    "privacy.p3": "We never see your data — there is no backend to send it to.",
    "privacy.chooseLanguage": "Choose your language:",
    "privacy.tech.title": "Technical details",
    "privacy.tech.1": "→ Parser runs in-browser via Vite/React SPA",
    "privacy.tech.2": "→ AI payload: max 8 sample excerpts + aggregated stats",
    "privacy.tech.3": "→ API key stored in localStorage, never transmitted to us",
    "privacy.tech.4": "→ No analytics, no cookies, no tracking",

    "shortchat.title": "_ SHORT CHAT DETECTED",
    "shortchat.p1.pre": "You uploaded a chat with ",
    "shortchat.p1.post": " messages.",
    "shortchat.p2": "The AI insights work best with a bit more history (we recommend at least 1,500 messages). With a short chat, the stats will still be perfectly accurate, but the AI personality roast might feel a bit generic since it doesn't have much material to work with.",
    "shortchat.p3": "You can continue anyway, or pick a longer group chat or friend chat for better results!",
    "shortchat.cancel": "Choose another file",
    "shortchat.continue": "Continue anyway",

    "apikey.title": "_ GEMINI API KEY REQUIRED",
    "apikey.p1": "To generate the AI personality summary and roast, you need your own Google Gemini API key.",
    "apikey.p2": "It's free and takes 10 seconds to get one from Google AI Studio.",
    "apikey.placeholder": "Paste your API key (starts with AQ...)",
    "apikey.save": "Save & Continue",
    "apikey.cancel": "Cancel",

    // Chat Mode
    "chatmode.title": "Chat Mode",
    "chatmode.question": "Is this a Direct Message or Group Chat?",
    "chatmode.detectedGroup": "We detected more than 2 participants in the export, so we think it's a <strong>Group Chat</strong>.",
    "chatmode.detectedDM": "We detected 2 participants in the export, so we think it's a <strong>Direct Message</strong>.",
    "chatmode.confirm": "Please confirm the chat type. This changes how metrics and leaderboards are displayed.",
    "chatmode.btnDM": "Direct Message (2 People)",
    "chatmode.btnGroup": "Group Chat (3+ People)",

    // Dashboard Hero
    "dashboard.hero.kicker": "_ {{count}} MESSAGES ANALYZED",
    "dashboard.hero.title1": "Your Chat",
    "dashboard.hero.title2": "Wrapped.",
    "dashboard.hero.days": "days",

    // Section Labels
    "section.numbers": "THE NUMBERS",
    "section.patterns": "PATTERNS",
    "section.media": "MEDIA & EMOJI",
    "section.ai": "PERSONALITY ANALYSIS",
    "section.monthly": "ACTIVITY OVER TIME",
    "section.emoji": "EMOJI DNA",

    // Cards
    "overview.glance": "_ AT A GLANCE",
    "overview.volume": "TOTAL VOLUME",
    "overview.messages": "total messages",
    "overview.daysOfChat": "days of chat",
    "overview.msgsPerDay": "msg/day avg",
    "overview.streak": "day streak",
    "overview.streakDesc": "longest consecutive daily activity",
    "overview.from": "FROM",
    "overview.to": "TO",

    "msgshare.title": "_ MESSAGE SHARE",
    "msgshare.doubleTexts": "double-texts",
    "msgshare.bursts": "msgs / burst",

    "heatmap.peak": "peak activity time",
    "heatmap.messages": "messages around",

    "monthly.peak": "PEAK MONTH",
    "monthly.messages": "messages",

    "latency.title": "AVERAGE RESPONSE TIME",
    "latency.desc": "lower is faster",

    "ghosting.title": "GHOSTING INSTANCES",
    "ghosting.desc": "times someone took 12+ hours to reply",

    "media.title": "MEDIA SENT",
    "emoji.title": "TOP EMOJIS",

    "topics.title": "_ TOPICS & EVOLUTION",
    "topics.most": "What you talked about most:",
    "topics.change": "How it changed over time:",

    "roast.title": "_ AI ROAST",
    
    // AI Failure & Group state
    "ai.genericInsight": "Showing generic insight",
    "ai.retry": "Retry AI",
    "ai.retryRoast": "Retry AI for real roast",
    "group.others": "Others",
    "group.showingTop": "Showing top 10 most active senders",
    "group.showingTop10": "Showing top 10",
    
    // Footer CTA
    "footer.cta.kicker": "_ DONE?",
    "footer.cta.title": "Analyze another chat.",
    "footer.cta.desc": "Upload a different export to compare conversations.",
    "footer.cta.btn": "START OVER",
    
    "loading.title": "Processing your chat",
    "loading.reading": "Reading your chat...",
    "loading.parsing": "Parsing messages...",
    "loading.crunching": "Crunching the numbers...",
    "loading.ai": "Generating AI insights...",
    "loading.demo": "Generating demo insights...",
    "loading.fact1": "The average person sends 40+ WhatsApp messages per day.",
    "loading.fact2": "Over 100 billion messages are sent on WhatsApp every day.",
    "loading.fact3": "WhatsApp was founded in 2009 by two former Yahoo employees.",
    "loading.fact4": "Emojis were invented in Japan in 1999 by Shigetaka Kurita.",
    "loading.fact5": "The blue double-tick 'read receipt' launched in 2014 and immediately caused relationship drama worldwide.",

    "time.morning": "in the morning",
    "time.afternoon": "in the afternoon",
    "time.evening": "in the evening",
    "time.night": "at night",
    "time.noon": "12 noon",
    "time.midnight": "12 midnight"
  },
  id: {
    // App Header
    "header.title": "Chat Wrapped",
    "header.privacy": "PRIVASI",

    // Upload Hero
    "hero.kicker": "_ REKAP PERCAKAPAN",
    "hero.title1": "WhatsApp",
    "hero.title2": "Chat",
    "hero.title3": "Wrapped.",
    "hero.subtitle": "Baca data chat secara lokal. Hitung semua metrik. Minta Gemini untuk meroasting. Data tetap aman di browser Anda.",

    // Upload Zone
    "upload.title": "Unggah export chat Anda",
    "upload.subtitle": "Pastikan export TANPA media (Without Media). Harus berupa file .txt.",
    "upload.or": "atau",
    "upload.skipAI": "LEWATI AI — GUNAKAN DEMO INSIGHTS",
    "upload.error_invalid_file": "Harap unggah chat export WhatsApp (file .txt).",
    "upload.drag_drop": "Tarik export WhatsApp Anda ke sini",
    "upload.drag_active": "Lepaskan untuk menganalisis",
    "upload.click_browse": "klik untuk mencari",
    "upload.for_file": "file .txt",

    // How It Works
    "how.kicker": "_ CARA KERJA",
    "how.step1.title": "Export Chat",
    "how.step1.desc": "WhatsApp → Chat → Export (tanpa media)",
    "how.step2.title": "Unggah Di Sini",
    "how.step2.desc": "Diproses seluruhnya di browser Anda — tidak ada yang dikirim keluar perangkat",
    "how.step3.title": "Lihat Hasilnya",
    "how.step3.desc": "Statistik, grafik, dan roasting AI menggunakan kunci Gemini Anda sendiri",

    // Modals
    "error.title": "_ ERROR",
    "privacy.title": "_ PRIVASI",
    "privacy.close": "Tutup",
    "privacy.cancel": "Batal",
    "privacy.continue": "Mengerti — tunjukkan Wrapped saya",
    "privacy.p1": "File obrolan Anda diproses <bold>sepenuhnya di browser Anda</bold> — parsing, perhitungan, dan setiap metrik di halaman ini berjalan sebagai JavaScript lokal. Tidak ada yang diunggah ke server.",
    "privacy.p2": "Jika Anda menggunakan fitur kepribadian/roast AI, hanya <bold>angka agregat dan beberapa baris sampel</bold> (bukan seluruh obrolan Anda) yang dikirim langsung dari browser Anda ke Gemini API Google, menggunakan kunci API Anda sendiri.",
    "privacy.p3": "Kami tidak pernah melihat data Anda — tidak ada backend untuk menerimanya.",
    "privacy.chooseLanguage": "Pilih bahasa Anda:",
    "privacy.tech.title": "Detail teknis",
    "privacy.tech.1": "→ Parser berjalan di browser melalui Vite/React SPA",
    "privacy.tech.2": "→ Payload AI: maksimal 8 cuplikan percakapan + statistik agregat",
    "privacy.tech.3": "→ API key disimpan di localStorage, tidak pernah ditransmisikan ke kami",
    "privacy.tech.4": "→ Tanpa analitik, tanpa cookies, tanpa pelacakan",

    "shortchat.title": "_ DETEKSI CHAT SINGKAT",
    "shortchat.p1.pre": "Anda mengunggah chat dengan ",
    "shortchat.p1.post": " pesan.",
    "shortchat.p2": "Insight AI berfungsi lebih baik dengan riwayat yang lebih panjang (kami menyarankan setidaknya 1.500 pesan). Dengan chat singkat, statistik akan tetap akurat, tetapi roasting AI mungkin terasa sedikit umum karena kekurangan konteks.",
    "shortchat.p3": "Anda dapat tetap melanjutkannya, atau pilih chat grup atau chat teman yang lebih panjang untuk hasil yang lebih baik!",
    "shortchat.cancel": "Pilih file lain",
    "shortchat.continue": "Tetap lanjutkan",

    "apikey.title": "_ BUTUH API KEY GEMINI",
    "apikey.p1": "Untuk menghasilkan ringkasan kepribadian AI dan roasting, Anda memerlukan API key Google Gemini Anda sendiri.",
    "apikey.p2": "Gratis dan hanya butuh 10 detik untuk mendapatkannya dari Google AI Studio.",
    "apikey.placeholder": "Tempel kunci API Anda (dimulai dengan AQ...)",
    "apikey.save": "Simpan & Lanjutkan",
    "apikey.cancel": "Batal",

    // Chat Mode
    "chatmode.title": "Mode Obrolan",
    "chatmode.question": "Apakah ini Pesan Pribadi atau Grup Chat?",
    "chatmode.detectedGroup": "Kami mendeteksi lebih dari 2 partisipan dalam file, jadi sepertinya ini adalah <strong>Grup Chat</strong>.",
    "chatmode.detectedDM": "Kami mendeteksi 2 partisipan dalam file, jadi sepertinya ini adalah <strong>Pesan Pribadi</strong>.",
    "chatmode.confirm": "Mohon konfirmasi jenis obrolan. Ini akan mengubah cara statistik ditampilkan.",
    "chatmode.btnDM": "Pesan Pribadi (2 Orang)",
    "chatmode.btnGroup": "Grup Chat (3+ Orang)",

    // Dashboard Hero
    "dashboard.hero.kicker": "_ {{count}} PESAN DIANALISIS",
    "dashboard.hero.title1": "Chat",
    "dashboard.hero.title2": "Wrapped Anda.",
    "dashboard.hero.days": "hari",

    // Section Labels
    "section.numbers": "ANGKA-ANGKA",
    "section.patterns": "POLA WAKTU",
    "section.media": "MEDIA & EMOJI",
    "section.ai": "ANALISIS KEPRIBADIAN",
    "section.monthly": "AKTIVITAS BULANAN",
    "section.emoji": "DNA EMOJI",

    // Cards
    "overview.glance": "_ SEKILAS",
    "overview.volume": "TOTAL VOLUME",
    "overview.messages": "total pesan",
    "overview.daysOfChat": "hari chat",
    "overview.msgsPerDay": "pesan/hari rata-rata",
    "overview.streak": "hari berturut-turut",
    "overview.streakDesc": "aktivitas harian terpanjang",
    "overview.from": "DARI",
    "overview.to": "HINGGA",

    "msgshare.title": "_ JUMLAH PESAN",
    "msgshare.doubleTexts": "double-text",
    "msgshare.bursts": "pesan / burst",

    "heatmap.peak": "waktu paling aktif",
    "heatmap.messages": "pesan di sekitar pukul",

    "monthly.peak": "BULAN TERAMAI",
    "monthly.messages": "pesan",

    "latency.title": "RATA-RATA WAKTU BALAS",
    "latency.desc": "lebih rendah lebih cepat",

    "ghosting.title": "KASUS GHOSTING",
    "ghosting.desc": "kali seseorang butuh 12+ jam untuk membalas",

    "media.title": "MEDIA TERKIRIM",
    "emoji.title": "EMOJI TERBANYAK",

    "topics.title": "_ TOPIK & EVOLUSI",
    "topics.most": "Yang paling sering dibahas:",
    "topics.change": "Perubahannya seiring waktu:",

    "roast.title": "_ AI ROAST",
    
    // AI Failure & Group state
    "ai.genericInsight": "Menampilkan insight demo",
    "ai.retry": "Coba Lagi AI",
    "ai.retryRoast": "Coba AI untuk roast asli",
    "group.others": "Lainnya",
    "group.showingTop": "Menampilkan 10 pengirim paling aktif",
    "group.showingTop10": "Menampilkan 10 teratas",

    // Footer CTA
    "footer.cta.kicker": "_ SELESAI?",
    "footer.cta.title": "Analisis chat lain.",
    "footer.cta.desc": "Unggah export chat lain untuk membandingkan percakapan.",
    "footer.cta.btn": "MULAI LAGI",

    "loading.title": "Memproses chat Anda",
    "loading.reading": "Membaca chat Anda...",
    "loading.parsing": "Memproses pesan...",
    "loading.crunching": "Menghitung angka-angka...",
    "loading.ai": "Membuat insight AI...",
    "loading.demo": "Membuat insight demo...",
    "loading.fact1": "Rata-rata orang mengirim 40+ pesan WhatsApp per hari.",
    "loading.fact2": "Lebih dari 100 miliar pesan dikirim di WhatsApp setiap hari.",
    "loading.fact3": "WhatsApp didirikan pada 2009 oleh dua mantan karyawan Yahoo.",
    "loading.fact4": "Emoji ditemukan di Jepang pada 1999 oleh Shigetaka Kurita.",
    "loading.fact5": "Centang biru 'dibaca' diluncurkan pada 2014 dan langsung menyebabkan drama hubungan di seluruh dunia.",

    "time.morning": "di pagi hari",
    "time.afternoon": "di sore hari",
    "time.evening": "di malam hari",
    "time.night": "di larut malam",
    "time.noon": "jam 12 siang",
    "time.midnight": "tengah malam"
  }
};
