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
    "hero.subtitle": "Parses your exported chat log locally. Counts everything. Gets AI to roast you. Keeps your data in your browser.",

    // Upload Zone
    "upload.title": "Upload your chat export",
    "upload.subtitle": "Make sure to export WITHOUT media. Must be a <bold>.zip</bold> or <bold>.txt</bold> file.",
    "upload.or": "or",
    "upload.skipAI": "SKIP AI — USE GENERIC INSIGHTS",
    "upload.error_invalid_file": "Please upload a WhatsApp exported chat (.zip or .txt file).",
    "upload.drag_drop": "Drop your WhatsApp export here",
    "upload.drag_active": "Drop to analyze",
    "upload.click_browse": "click to browse",
    "upload.for_file": "for a <bold>.zip</bold> or <bold>.txt</bold> file",

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
    "section.vibe": "CHAT VIBE",

    // Cards
    "overview.glance": "_ AT A GLANCE",
    "overview.volume": "TOTAL VOLUME",
    "overview.messages": "total messages",
    "overview.daysOfChat": "days of chat",
    "overview.activeDays": "active chat days",
    "overview.span": "span: {count} days",
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
    "heatmap.title": "_ ACTIVE HOURS",
    "heatmap.sentence": "You chat most in the {segment}, particularly around {time}.",

    "monthly.title": "_ ACTIVITY OVER TIME",
    "monthly.monthsOfData": "months of data",
    "monthly.peak": "PEAK MONTH",
    "monthly.messages": "messages",

    "latency.title": "_ RESPONSE TIME",
    "latency.subtitle": "(turn-taking approximation, 6h gap excluded)",
    "latency.faster": "faster",
    "latency.slower": "slower",
    "latency.avgReply": "avg reply latency",

    "ghosting.title": "_ GHOSTING INDEX",
    "ghosting.subtitle": "(12h+ gap before replying)",
    "ghosting.none": "No major ghosting detected.",
    "ghosting.consistent": "Both parties respond within 12 hours consistently.",
    "ghosting.consistent.plural": "Everyone responds within 12 hours consistently.",
    "ghosting.total": "total ghosting instances",
    "ghosting.worst": "WORST",
    "ghosting.note": "Note: gaps >6h at night excluded from response time averages.",

    "media.title": "_ MEDIA SENT",
    "media.total": "total media files",
    "media.image": "Images",
    "media.video": "Videos",
    "media.audio": "Audio",
    "media.sticker": "Stickers",
    "media.gif": "GIFs",
    "media.document": "Documents",
    "media.contactCard": "Contacts",
    "media.location": "Location Shares",
    "media.link": "Links",

    "links.title": "_ SHARED LINKS",
    "links.total": "categorized links",

    "emoji.title": "_ TOP EMOJIS",
    "emoji.none": "No emojis used",
    "emoji.burstTitle": "Most extreme emoji burst",
    "emoji.burstSent": "sent",
    "emoji.burstTimes": "times in a single message",

    "calls.title": "_ CALLS & EXTRAS",
    "calls.duration": "Total Duration",
    "calls.durationVoice": "Voice Duration",
    "calls.durationVideo": "Video Duration",
    "calls.longest": "Longest Call",
    "calls.longestVoice": "Longest Voice",
    "calls.longestVideo": "Longest Video",
    "calls.initiated": "Calls",
    "calls.missed": "Missed/Unanswered",
    "calls.guess": "Guess this one??",
    "calls.viewOnce": "View Once",
    "calls.edited": "Edited Msgs",
    "calls.deleted": "Deleted Msgs",
    "calls.topCallers": "Top Callers",

    "wordcloud.title": "_ WORD CLOUD",
    "wordcloud.reroll": "Reroll Layout",

    "topics.title": "_ TOPICS & EVOLUTION",
    "topics.most": "What you talked about most:",
    "topics.change": "How it changed over time:",

    "mirrored.title": "_ MIRRORED PHRASES",
    "mirrored.desc": "Phrases you both use a lot.",
    "mirrored.desc.plural": "Phrases everyone uses a lot.",

    "excerpts.title": "_ TIMECODE EXCERPTS",
    "excerpts.early": "Early Days",
    "excerpts.median": "The Middle",
    "excerpts.late": "Recently",

    "roast.title": "_ AI ROAST",

    // AI Failure & Group state
    "ai.genericInsight": "Generic Insight",
    "ai.retry": "Retry AI",
    "ai.retry_soft": "Try Real AI again",
    "ai.retryRoast": "Retry AI for real roast",

    "time.morning": "AM",
    "time.afternoon": "PM",
    "time.evening": "PM",
    "time.night": "PM",
    "time.midnight": "12 AM",
    "time.noon": "12 PM",
    "time.segment.morning": "morning",
    "time.segment.afternoon": "afternoon",
    "time.segment.night": "night",

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
    "loading.fact5": "The blue double-tick 'read receipt' launched in 2014 and immediately caused relationship drama worldwide."
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
    "hero.subtitle": "Baca data chat secara lokal. Hitung semua metrik. Minta AI untuk meroasting. Data tetap aman di browser Anda.",

    // Upload Zone
    "upload.title": "Unggah export chat Anda",
    "upload.subtitle": "Pastikan export TANPA media (Without Media). Harus berupa file <bold>.zip</bold> atau <bold>.txt</bold>.",
    "upload.or": "atau",
    "upload.skipAI": "LEWATI AI — GUNAKAN DEMO INSIGHTS",
    "upload.error_invalid_file": "Harap unggah chat export WhatsApp (file .zip atau .txt).",
    "upload.drag_drop": "Tarik export WhatsApp Anda ke sini",
    "upload.drag_active": "Lepaskan untuk menganalisis",
    "upload.click_browse": "klik untuk mencari",
    "upload.for_file": "file <bold>.zip</bold> atau <bold>.txt</bold>",

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
    "section.vibe": "SUASANA CHAT",

    // Cards
    "overview.glance": "_ RINGKASAN",
    "overview.volume": "TOTAL VOLUME",
    "overview.messages": "total pesan",
    "overview.daysOfChat": "hari obrolan",
    "overview.activeDays": "hari aktif chat",
    "overview.span": "rentang: {count} hari",
    "overview.msgsPerDay": "pesan/hari rata-rata",
    "overview.streak": "hari beruntun",
    "overview.streakDesc": "aktivitas harian berturut-turut terlama",
    "overview.from": "DARI",
    "overview.to": "SAMPAI",

    "msgshare.title": "_ JUMLAH PESAN",
    "msgshare.doubleTexts": "double-text",
    "msgshare.bursts": "pesan / burst",

    "heatmap.peak": "waktu paling aktif",
    "heatmap.messages": "pesan sekitar",
    "heatmap.title": "_ JAM AKTIF",
    "heatmap.sentence": "Kalian paling sering ngobrol di {segment}, terutama sekitar jam {time}.",

    "monthly.title": "_ AKTIVITAS BULANAN",
    "monthly.monthsOfData": "bulan data",
    "monthly.peak": "BULAN TERAMAI",
    "monthly.messages": "pesan",

    "latency.title": "_ WAKTU BALAS",
    "latency.subtitle": "(estimasi balas-balasan, jeda >6 jam diabaikan)",
    "latency.faster": "lebih cepat",
    "latency.slower": "lebih lambat",
    "latency.avgReply": "rata-rata waktu balas",

    "ghosting.title": "_ INDEKS GHOSTING",
    "ghosting.subtitle": "(jeda 12+ jam sebelum membalas)",
    "ghosting.none": "Tidak terdeteksi adanya aksi ghosting.",
    "ghosting.consistent": "Kalian berdua selalu membalas pesan dalam waktu 12 jam.",
    "ghosting.consistent.plural": "Kalian semua selalu membalas pesan dalam waktu 12 jam.",
    "ghosting.total": "total aksi ngilang / ghosting",
    "ghosting.worst": "TERPARAH",
    "ghosting.note": "Catatan: jeda >6 jam di malam hari diabaikan dari rata-rata waktu balas.",

    "media.title": "_ MEDIA TERKIRIM",
    "media.total": "total file media",
    "media.image": "Gambar",
    "media.video": "Video",
    "media.audio": "Audio",
    "media.sticker": "Stiker",
    "media.gif": "GIF",
    "media.document": "Dokumen",
    "media.contactCard": "Kartu Kontak",
    "media.location": "Lokasi Dibagikan",
    "media.link": "Tautan",

    "links.title": "_ TAUTAN DIBAGIKAN",
    "links.total": "tautan terkategori",

    "emoji.title": "_ EMOJI TERBANYAK",
    "emoji.none": "Tidak ada emoji",
    "emoji.burstTitle": "Ledakan emoji paling ekstrem",
    "emoji.burstSent": "mengirim",
    "emoji.burstTimes": "kali dalam satu pesan",

    "calls.title": "_ PANGGILAN & LAINNYA",
    "calls.duration": "Total Durasi",
    "calls.durationVoice": "Durasi Suara",
    "calls.durationVideo": "Durasi Video",
    "calls.longest": "Panggilan Terlama",
    "calls.longestVoice": "Suara Terlama",
    "calls.longestVideo": "Video Terlama",
    "calls.initiated": "Panggilan",
    "calls.missed": "Tak Terjawab/Ditolak",
    "calls.guess": "Coba tebak??",
    "calls.viewOnce": "Sekali Lihat",
    "calls.edited": "Pesan Diedit",
    "calls.deleted": "Pesan Dihapus",
    "calls.topCallers": "Penelepon Teratas",

    "wordcloud.title": "_ WORD CLOUD",
    "wordcloud.reroll": "Acak Layout",

    "topics.title": "_ TOPIK & EVOLUSI",
    "topics.most": "Yang paling sering dibahas:",
    "topics.change": "Perubahannya seiring waktu:",

    "mirrored.title": "_ FRASA SAMA",
    "mirrored.desc": "Kata-kata yang sering kalian pakai berdua.",
    "mirrored.desc.plural": "Kata-kata yang sering diucapkan di grup.",

    "excerpts.title": "_ CUPLIKAN WAKTU",
    "excerpts.early": "Awal Mula",
    "excerpts.median": "Pertengahan",
    "excerpts.late": "Baru-baru Ini",

    "roast.title": "_ AI ROAST",

    // AI Failure & Group state
    "ai.genericInsight": "Analisis Biasa",
    "ai.retry": "Coba Lagi AI",
    "ai.retry_soft": "Coba AI Asli",
    "ai.retryRoast": "Coba AI untuk roast asli",

    "time.morning": "Pagi",
    "time.afternoon": "Siang",
    "time.evening": "Sore",
    "time.night": "Malam",
    "time.midnight": "Tengah Malam",
    "time.noon": "Tengah Hari",
    "time.segment.morning": "pagi hari",
    "time.segment.afternoon": "siang hari",
    "time.segment.night": "malam hari",

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
    "loading.fact5": "Centang biru 'dibaca' diluncurkan pada 2014 dan langsung menyebabkan drama hubungan di seluruh dunia."
  }
};
