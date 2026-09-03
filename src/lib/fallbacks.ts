import type { GeminiInsights, ParsedChatMetrics } from '../types/chat';

function getDeterministicHash(metrics: ParsedChatMetrics): number {
  let hash = 0;
  const str = metrics.participants.join('') + metrics.totalMessages + (metrics.groupName ?? '');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ──────────────────────────────────────────────
// Flavor 1: Link Personality (Shopping, Music)
// ──────────────────────────────────────────────
function getLinkFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  const links = metrics.sharedLinks;
  const shoppingCount = (links['Tokopedia'] || 0) + (links['Shopee'] || 0) + (links['TikTok Shop'] || 0) + (links['Lazada'] || 0) + (links['Amazon'] || 0) + (links['Bukalapak'] || 0) + (links['Blibli'] || 0);
  const musicCount = (links['Spotify'] || 0) + (links['Apple Music'] || 0);
  const doomscrollCount = (links['TikTok'] || 0) + (links['Instagram Reels'] || 0) + (links['X'] || 0);
  const workCount = metrics.workLinksCount || 0;
  const linkedinCount = links['LinkedIn'] || 0;
  const mapsCount = links['Google Maps'] || 0;
  const facebookCount = links['Facebook'] || 0;
  const igProfileCount = links['Instagram Profile'] || 0;

  const results: string[] = [];

  if (shoppingCount > 17) {
    const id = [
      "Sering nemu link barang belanjaan di sini. Kalau nemu racun diskon emang paling seru dibagi ke chat sih.",
      "Beberapa link barang belanjaan sempat lewat. Mau minta pertimbangan dulu, atau cuma butuh pembenaran buat checkout?",
      "Banyak juga kiriman link belanjaan. Antara asli di-checkout atau cuma numpuk di keranjang",
      "Saling bagi link produk sesekali. Niatnya minta pertimbangan, atau pembenaran overspending?"
    ];

    const en = [
      "Quite a few shopping links show up here. Finding a good deal is always fun to share around.",
      "A few shopping links dropped in here. Asking for a second opinion, or just looking for an excuse to hit checkout?",
      "Fair share of shopping links sent. Did they actually get checked out, or are they just sitting in the cart?",
      "Sharing product links every now and then. Looking for genuine advice, or just justifying some overspending?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (musicCount > 10) {
    const id = [
      "Ada beberapa link lagu yang dibagikan. Sedang eksplor taste atau cuma pamer lirik yang relate?",
      "Lumayan sering tukar link spotify tanpa banyak intro. Melodi memang lebih gampang nyampe daripada kata-kata",
      "Riwayat chat berisi beberapa rekomendasi playlist. Selera musik mirip atau coba saling nularin taste?",
      "Link lagu jadi beberapa kali jadi pembahasan di sini. Semoga bukan untuk mengenang orang yang sudah 'kemarin'"
    ];
    const en = [
      "You share a several music links. Exploring new sounds or trying to drop a subtle lyric hint?",
      "Dropping song links with zero context. Sometimes a track explains the mood better than words ever could.",
      "The chat history is packed with playlist swaps. Do you share the same taste, or are you actively shaping each other's?",
      "Music is clearly a shared language here. Just a good tune, or is there a specific memory attached?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (doomscrollCount > 27) {
    const id = [
      "Lancar banget sharing reels di sini. Coba ingat lagi berapa jam waktu yang habis buat doomscrolling?",
      "Lumayan banyak kiriman Reels dan TikTok. Butuh pelarian receh di tengah hari-hari sibuk atau memang nganggur aja.",
      "Beberapa pembahasan muncul dari link reels / tiktok. Algoritma mu mungkin gacor, screentime mu apalagi.",
      "Sering banget lempar link video tanpa basa-basi. Ini beneran ditonton bareng atau cuma saling numpuk tab bookmark?"
    ];

    const en = [
      "Reels are flowing way too smoothly here. Think back, how many hours actually went into doomscrolling?",
      "Quite a lot of Reels and TikToks sent. Needed a quick distraction during a busy day, or were you just free?",
      "A few conversations kicked off from Reels or TikTok links. Your algorithm might be on point, but your screen time definitely is.",
      "Dropping video links with zero context. Are you actually watching them, or just hoarding them in your bookmarks tab?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (workCount > 20) {
    const id = [
      "Docs, link Meeting, link projek. Obrolannya kerjaan banget, 'kapan terakhir kali kamu dapat tertidur tenang'?",
      "Banyak kiriman link dokumen & koordinasi tugas. Memang harus kejar target, jangan sampai lupa nafas",
      "Chat ini isinya serba taktis buat beresin kerjaan. Antara timeline rapi, atau memang numpuk gara gara sering menunda",
    ];

    const en = [
      "Docs, Meets, and repo links. Heavy focus on work here—when was the last time you took a break without thinking about deadlines?",
      "Plenty of document links and task syncs. Hitting targets is fine, but don't forget to actually live.",
      "This chat is purely tactical for getting things done. Solid and efficient rhythm, or is the backlog just overflowing?",
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (linkedinCount > 7) {
    const id = [
      "Cukup sering kirim link linkedIn. Lagi cari peluang baru atau sekadar scroll postingan corporate mereka yang template semua?",
      "Topik obrolannya sesekali kebawa ke urusan profesional. Masih untung ada temen sharing karir yang sefrekuensi.",
      "Sering banget bagi link profil atau karir. Beneran lagi nyari tempat baru, atau cuma kepo stalking karir orang lain?"
    ];

    const en = [
      "A good amount of LinkedIn links sent. Scouting your next move, or just reading through the usual generic corporate posts?",
      "Conversations naturally steer into professional growth. Having someone to bounce career thoughts off is always useful.",
      "Sharing profile and job links pretty often. Actually scouting your next move, or just low-key stalking someone's career path?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (mapsCount > 15) {
    const id = [
      "Banyak nemu titik lokasi di chat ini. Ini agenda nyari rekomendasi tempat santai, atau memang tuntutan kerjaan",
      "Beberapa link maps sempat lewat. Mungkin tipe yang suka nge-info tempat hidden gem, atau emang mobilitasnya lagi tinggi",
      "Sering bagi-bagi link rute dan lokasi. Asli mau nyobain suasana baru, atau jadwal hariannya emang lagi padat pindah sana-sini"
    ];

    const en = [
      "A lot of location pins show up in this chat. Planning to find a chill place to unwind, or is work just demanding you stay on the move?",
      "Several maps links popped up. The type to share hidden gem recommendations, or just constantly on the go lately?",
      "Frequently sharing routes and location pins. Actually looking to try a fresh vibe, or is your daily routine just packed with moving around?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (facebookCount > 15) {
    const id = [
      "Cukup sering bagi link Facebook. Umur tidak bisa bohong, jiwa boomer-nya mulai melekat? atau pemain barang miring di Marketplace",
      "Beberapa link Facebook sempat lewat. Mungkin nyari info di grup komunitas atau explore marketplace. kurang-kurangi ga bayar banyak nanya, nawar sadis",
      "Banyak juga kiriman link Facebook. Kadang meme dan humor di fb memang top notch",
    ];

    const en = [
      "Quite a few Facebook links shared here. Age doesn't lie, is your inner boomer kicking in? Or are you just hunting cheap deals on Marketplace?",
      "A couple of Facebook links popped up. Probably checking community groups or browsing Marketplace. Less asking around and lowballing, start actually buying.",
      "Fair share of Facebook links sent. Gotta admit though, memes and humor on Facebook hit top notch sometimes."
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  if (igProfileCount > 10) {
    const id = [
      "Cukup sering kirim link profil IG. Kurang-kurangi stalking orang, 'langsung chat apa susahnya'",
      "Beberapa link profil IG sempat lewat di sini. 'alahhh privatt'",
      "Banyak juga kiriman profil Instagram. apalagi yang mau dibandingin?"
    ];

    const en = [
      "Quite a few IG profile links shared here. Cut down on stalking people, 'just text them directly, how hard can it be?'",
      "A couple of IG profile links popped up. 'Ugh, it's private...'",
      "Fair share of Instagram profiles sent. What else is there to compare yourself to?"
    ];
    const pool = language === 'id' ? id : en;
    results.push(pool[baseHash % pool.length]);
  }

  return results;
}

// ──────────────────────────────────────────────
// Flavor 2: Ghost Town (High Ghosting)
// ──────────────────────────────────────────────
function getGhostFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  const totalGhosts = Object.values(metrics.ghostingInstances).reduce((a, b) => a + b, 0);

  if (totalGhosts > 30) {
    const id = [
      "Jeda balasnya lumayan lama, baru nyambung lagi. Lagi sibuk di real life atau memang 'sengaja' chat-nya ketimbun?",
      "Obrolan bisa nginep berhari-hari tanpa ada yang canggung. Ya begitulah, real life kadang buat lupa buka chat tapi pertemanan tetap aman aman saja",
      "Chat ini sering mati perlahan, tiba-tiba rame lagi. Fleksibilitas balas chat yang patut diapresiasi",
      "Nggak ada beban harus bales cepat di sini. Kadang butuh beberapa hari buat ngerespons, dan memang sepenuhnya wajar."
    ];
    const en = [
      "Pretty long pauses before the thread picks back up. Caught up in real life, or did the notifications just drown?",
      "Chats can sit on delivered for days with zero awkwardness. Life gets busy, but the friendship stays intact.",
      "This chat constantly fades out and then randomly revives. Your communication flexibility is honestly commendable.",
      "Zero pressure to reply fast here. Sometimes it takes days to respond, and that’s completely fine."
    ];
    const pool = language === 'id' ? id : en;
    return [pool[baseHash % pool.length]];
  }
  return [];
}

// ──────────────────────────────────────────────
// Flavor 3: Pinger (Indonesian "P" behavior)
// ──────────────────────────────────────────────
function getPingFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  let topPinger = '';
  let topPingCount = 0;

  for (const [sender, count] of Object.entries(metrics.pingCount)) {
    if (count > topPingCount) {
      topPingCount = count;
      topPinger = sender;
    }
  }

  if (topPingCount > 5) {
    const id = [
      `${topPinger}, kebiasaan kirim 'P' coba bisa dikurangi? Ada yang namanya konsep 'salam' untuk membuka percakapan dengan baik`,
      `Tercatat ada ${topPingCount} kali ${topPinger} manggil pakai 'P'. 'Halo & hai dah nggak jaman ya?'`,
      `Budaya nge-ping pakai 'P' di chat ini didominasi oleh ${topPinger}. Sangat klasik, walaupun mulai ngeselin.`,
      `Ketikan 'P' dari ${topPinger} sepertinya udah jadi bel rumah di chat ini. Gak ada 'P' = ga di gubris?`
    ];
    const en = [
      `${topPinger}, could you cut down on the 'P' spam? Can you give a proper greeting once in a while?`,
      `Logged ${topPingCount} 'P' pings from ${topPinger}. You know you can just say hi, right?`,
      `The culture of pinging with 'P' here is heavily carried by ${topPinger}. Very classic, little bit annoying.`,
      `Typing 'P' seems to be ${topPinger}'s idea of ringing the doorbell. No 'P', no chat.`
    ];
    const pool = language === 'id' ? id : en;
    return [pool[baseHash % pool.length]];
  }
  return [];
}

// ──────────────────────────────────────────────
// Flavor 4: Base/Generic (Fallback of Fallbacks)
// ──────────────────────────────────────────────
function getBaseFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  if (metrics.participants.length > 2) {
    const id = [
      "Grup ini kayaknya selalu ada bahan, entah sekadar lempar meme atau bahas sesuatu yang serius.",
      "Ada aja topik yang muter terus di grup ini. Gak pernah bener-bener mati, biarpun kadang cuma satu dua orang yang aktif.",
      "Dinamika grup yang kerasa santai tapi konsisten. Selalu ada update harian walau sepotong dua potong.",
      "Kelihatan banget ada beberapa orang yang emang jadi motor di grup ini, bikin suasana tetep hidup."
    ];
    const en = [
      "This group always seems to have something brewing, whether it's dropping memes or diving into a serious topic.",
      "There's always a conversation cycling through here. It never really dies, even if it's just a few active people.",
      "A very relaxed but consistent group dynamic. There's almost always a daily update, even if brief.",
      "It's pretty clear a few core people are driving the energy here, keeping the chat alive."
    ];
    const pool = language === 'id' ? id : en;
    return [pool[baseHash % pool.length]];
  }

  const id = [
    "Dinamika percakapan yang kelihatan udah terbentuk alami. Yang satu emang lebih bawel, yang lain lebih jadi pendengar.",
    "Chat ini punya ritmenya sendiri. Meski kadang berat sebelah secara volume, kalian sepertinya nemu cara komunikasi yang pas.",
    "Ada satu pihak yang lebih rajin ngetik panjang lebar, sementara balasannya lebih praktis. Yang penting pesannya nyampe.",
    "Kombinasi klasik: yang satu suka cerita detail, yang satu ngerespons ringkas aja."
  ];
  const en = [
    "A very naturally settled dynamic. One is clearly the talker, and the other plays the listener.",
    "This chat has its own distinct rhythm. Even if the volume is a bit lopsided, you've found a communication style that works.",
    "One person doesn't mind typing out long thoughts, while the other keeps responses practical. It balances out.",
    "The classic combo: one loves to share the details, the other keeps it short and sweet."
  ];

  const pool = language === 'id' ? id : en;
  return [pool[baseHash % pool.length]];
}

// ──────────────────────────────────────────────
// Flavor 5: Monologue (Paragraphs)
// ──────────────────────────────────────────────
function getMonologueFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  let topMonologuer = '';
  let maxParagraphs = 0;

  for (const [sender, count] of Object.entries(metrics.paragraphsPerSender || {})) {
    if (count > maxParagraphs) {
      maxParagraphs = count;
      topMonologuer = sender;
    }
  }

  if (maxParagraphs > 10) {
    const id = [
      `${topMonologuer} suka ngetik panjang lebar kyk lagi nulis skrip klarifikasi. Tercatat ada ${maxParagraphs} paragraf panjang.`,
      `${topMonologuer} adalah tukang spam handal, karena sering monolog panjang lebar di chat ini.`
    ];
    const en = [
      `${topMonologuer} loves dropping massive paragraphs like they're writing a novel. Logged ${maxParagraphs} long messages.`,
      `Looks like ${topMonologuer} should start a podcast or write a book with the amount of long monologues they drop here.`
    ];
    const pool = language === 'id' ? id : en;
    return [pool[baseHash % pool.length]];
  }
  return [];
}

// ──────────────────────────────────────────────
// Flavor 6: Group Rename
// ──────────────────────────────────────────────
function getGroupRenameFlavors(metrics: ParsedChatMetrics, language: 'en' | 'id', baseHash: number): string[] {
  if (metrics.participants.length > 2 && metrics.groupNameHistory.length > 15) {
    const id = [
      `Grup ini krisis identitas, ganti nama ${metrics.groupNameHistory.length} kali.`,
      `Tercatat ganti nama ${metrics.groupNameHistory.length} kali. Kalian memang labil atau memang ganti konsep tiap minggu?`
    ];
    const en = [
      `This group has a severe identity crisis, having been renamed ${metrics.groupNameHistory.length} times!`,
      `Renamed ${metrics.groupNameHistory.length} times. Is the group just unstable, or do you guys just love rebranding every week?`
    ];
    const pool = language === 'id' ? id : en;
    return [pool[baseHash % pool.length]];
  }
  return [];
}

// ──────────────────────────────────────────────
// Main Fallback Generator
// ──────────────────────────────────────────────
export function getOfflineInsightCount(
  metrics: ParsedChatMetrics,
  language: 'en' | 'id' = 'en'
): number {
  const baseHash = getDeterministicHash(metrics);
  return [
    ...getLinkFlavors(metrics, language, baseHash),
    ...getGhostFlavors(metrics, language, baseHash),
    ...getPingFlavors(metrics, language, baseHash),
    ...getBaseFlavors(metrics, language, baseHash),
    ...getMonologueFlavors(metrics, language, baseHash),
    ...getGroupRenameFlavors(metrics, language, baseHash)
  ].length;
}

export function generateOfflineInsights(
  metrics: ParsedChatMetrics,
  language: 'en' | 'id' = 'en',
  previousInsights: string[] = []
): GeminiInsights {
  const baseHash = getDeterministicHash(metrics);
  const hash = baseHash + previousInsights.length;

  // Aggregate all possible insights
  const allInsights = [
    ...getLinkFlavors(metrics, language, baseHash),
    ...getGhostFlavors(metrics, language, baseHash),
    ...getPingFlavors(metrics, language, baseHash),
    ...getBaseFlavors(metrics, language, baseHash),
    ...getMonologueFlavors(metrics, language, baseHash),
    ...getGroupRenameFlavors(metrics, language, baseHash)
  ];

  // Remove already seen insights
  const availableInsights = allInsights.filter(i => !previousInsights.includes(i));

  // Pick one deterministically from the remaining ones
  // If none left, just return a fallback empty string (which the UI handles as cap reached)
  const chat_insight = availableInsights.length > 0
    ? availableInsights[hash % availableInsights.length]
    : '';
  const participants = metrics.participants;
  const totalMsg = metrics.totalMessages;
  const p1 = participants[0];
  const p1Count = metrics.messagesPerSender[p1] ?? 0;
  const p1Pct = Math.round((p1Count / totalMsg) * 100);
  const p2 = participants[1] ?? p1;
  const p2Pct = 100 - p1Pct;
  const bigTexter = p1Pct >= p2Pct ? p1 : p2;
  const quietOne = p1Pct >= p2Pct ? p2 : p1;
  const quickReplier = (metrics.avgResponseTimeMinutes[p1] ?? 999) <= (metrics.avgResponseTimeMinutes[p2] ?? 999) ? p1 : p2;
  const ghostCount = Object.values(metrics.ghostingInstances).reduce((a, b) => a + b, 0);
  const streak = metrics.longestStreakByDay ?? 0;
  let summary_en = '';
  let summary_id = '';
  let evo_en = '';
  let evo_id = '';

  if (participants.length > 2) {
    const summaries_en = [
      `This group is a study in chaos: ${p1} dominates by sending ${p1Pct}% of all ${totalMsg.toLocaleString()} messages, treating the chat like a personal broadcast channel. ${ghostCount > 0 ? `There were ${ghostCount} instances of the chat dying completely before being revived.` : `The group is highly active and rarely quiet.`} Together you've built a dynamic that is a consistent circus.`,
      `The dynamic here is heavily skewed: ${p1} drives the bus, sending ${p1Pct}% of the ${totalMsg.toLocaleString()} total messages, leaving everyone else as mere passengers. ${ghostCount > 0 ? `The chat exhibits ${ghostCount} moments of total radio silence.` : `Impressively, the conversation almost never stops.`} It's a digital ecosystem that defies explanation.`,
      `With ${totalMsg.toLocaleString()} messages in the vault, this is less of a group chat and more of ${p1}'s personal diary (${p1Pct}%), featuring occasional guest appearances. ${ghostCount > 0 ? `You also collectively ghost each other, with ${ghostCount} deep silences.` : `The pacing is relentless, with barely a pause to breathe.`} Truly an unhinged masterpiece of modern communication.`,
      `Group chats are meant to be equal, but ${p1} didn't get the memo, dominating ${p1Pct}% of the ${totalMsg.toLocaleString()} messages. It's a beautiful, messy democracy.`,
      `An ecosystem of noise: ${p1} provides ${p1Pct}% of the content, while the rest of you just react. A fascinating social experiment.`,
      `With ${totalMsg.toLocaleString()} messages, this group has a pulse of its own. ${streak > 10 ? `You went on a wild ${streak}-day streak of non-stop chatting.` : `It comes alive in unpredictable bursts.`} ${p1} remains the undisputed ringleader at ${p1Pct}%.`
    ];
    const summaries_id = [
      `Grup ini adalah studi kekacauan: ${p1} mendominasi dengan mengirimkan ${p1Pct}% dari total ${totalMsg.toLocaleString()} pesan, memperlakukannya seperti channel broadcast pribadi. ${ghostCount > 0 ? `Ada ${ghostCount} kali obrolan mati total sebelum dihidupkan lagi.` : `Grup ini sangat aktif dan jarang sepi.`} Bersama-sama, kalian membangun dinamika sirkus yang konsisten.`,
      `Dinamika grup ini didorong penuh oleh energi ${p1} yang mengirimkan ${p1Pct}% pesan. Sementara sisanya hanya ikut meramaikan sesekali. ${ghostCount > 0 ? `Buktinya, ada ${ghostCount} momen grup ini seperti kuburan.` : `Hebatnya, percakapan mengalir hampir tanpa henti.`} Pada dasarnya ini adalah panggung komedi.`,
      `Kalian telah mengirim total ${totalMsg.toLocaleString()} pesan, namun secara statistik ini adalah monolog ${p1} (${p1Pct}%) yang diselingi balasan sporadis anggota lain. ${ghostCount > 0 ? `Grup ini punya hobi mati suri, tercatat ${ghostCount} kali diam.` : `Tidak ada kata istirahat di sini, selalu ada yang dibahas.`} Sebuah ekosistem digital yang unik.`,
      `Grup harusnya setara, tapi ${p1} menguasai ${p1Pct}% dari ${totalMsg.toLocaleString()} pesan. Demokrasi yang indah tapi berantakan.`,
      `Ekosistem keributan: ${p1} menyumbang ${p1Pct}% konten, sisanya cuma bereaksi. Eksperimen sosial yang menarik.`,
      `Dengan ${totalMsg.toLocaleString()} pesan, grup ini punya nyawanya sendiri. ${streak > 10 ? `Kalian bahkan sempat chatting tanpa henti selama ${streak} hari berturut-turut.` : `Grup ini ramai di waktu-waktu tak terduga.`} ${p1} tetap jadi biang kerok utama dengan porsi ${p1Pct}%.`
    ];
    const applicableEvos = [];
    const stickerCount = metrics.mediaCounts["sticker"] || 0;
    
    if (stickerCount > 250) {
      applicableEvos.push({
        en: `Over time, your group evolved from polite discussions to an unfiltered stream of out-of-context stickers.`,
        id: `Seiring waktu, grup kalian berubah dari obrolan formal menjadi kumpulan stiker tanpa konteks. total stiker terkirim: ${stickerCount}`
      });
    }
    
    if (metrics.groupNameHistory.length > 15) {
      applicableEvos.push({
        en: `This group has an identity crisis, having been renamed ${metrics.groupNameHistory.length} times.`,
        id: `Grup ini krisis identitas, tercatat sudah ganti nama ${metrics.groupNameHistory.length} kali.`
      });
    }
    
    if (metrics.mirroredPhrases.length > 5) {
      applicableEvos.push({
        en: `What started as a normal group chat has degraded into a chaotic echo chamber.`,
        id: `Berawal dari grup biasa, sekarang berubah jadi tempat nongkrong virtual yang super bising.`
      });
    }

    if (metrics.avgMessagesPerDay > 50) {
      applicableEvos.push({
        en: `The tone shifted from casual updates to a relentless daily newsfeed of your lives.`,
        id: `Transisi dari sapaan basa-basi menjadi laporan harian hidup kalian yang nggak diminta.`
      });
    }
    
    // Always provide fallbacks
    applicableEvos.push({
      en: `Your communication devolved into pure brain-rot and inside jokes.`,
      id: `Gaya komunikasi makin ke sini makin dipenuhi meme dan joke internal yang cuma kalian yang paham.`
    });
    applicableEvos.push({
      en: `The group gradually became a safe haven for oversharing and unhinged opinions.`,
      id: `Grup ini perlahan jadi tempat aman buat curhat random dan opini ngawurr.`
    });
    applicableEvos.push({
      en: `It started tame, but quickly escalated into a 24/7 digital circus`,
      id: `Awalnya kalem, tapi dengan cepat berubah jadi grup kacau 24 jam`
    });
    
    const pickedEvo = applicableEvos[hash % applicableEvos.length];
    evo_en = pickedEvo.en;
    evo_id = pickedEvo.id;

    const v_evo = hash % 6;
    summary_en = summaries_en[v_evo];
    summary_id = summaries_id[v_evo];
  } else {
    const summaries_en = [
      `This chat is a study in contrast: ${bigTexter} sends ${p1Pct >= p2Pct ? p1Pct : p2Pct}% of all ${totalMsg.toLocaleString()} messages, while ${quietOne} operates at a more measured pace. ${quickReplier} is the faster responder - always having their phone in hand. ${ghostCount > 0 ? `There were ${ghostCount} instances of someone going radio-silent for hours.` : `Notably, neither person is a serial ghoster.`} Together you've built a reliably chaotic dynamic.`,
      `The energy in this chat is deeply asymmetrical: ${bigTexter} churns out ${p1Pct >= p2Pct ? p1Pct : p2Pct}% of the ${totalMsg.toLocaleString()} messages, leaving ${quietOne} to nod along. Meanwhile, ${quickReplier} is the undisputed speed demon. ${ghostCount > 0 ? `You do have a habit of disappearing, logging ${ghostCount} long silences.` : `You somehow never let the conversation die completely.`} It’s an exercise in extreme over-communication meets strategic minimalism.`,
      `With ${totalMsg.toLocaleString()} total messages, this looks like ${bigTexter}’s digital journal (${p1Pct >= p2Pct ? p1Pct : p2Pct}%) with feedback from ${quietOne}. But ${quickReplier} wins the reflex test. ${ghostCount > 0 ? `Still, the ${ghostCount} times you totally ignored each other suggests you both have lives outside this app.` : `You two are basically tethered to each other-no major gaps in replying at all.`} A true yin-and-yang friendship.`,
      `Beyond the ${totalMsg.toLocaleString()} messages, ${bigTexter} talks ${p1Pct >= p2Pct ? p1Pct : p2Pct}% of the time, and ${quickReplier} replies the fastest. A perfectly balanced system.`,
      `It takes two to tango, but ${bigTexter} is doing most of the dancing (${p1Pct >= p2Pct ? p1Pct : p2Pct}% of the messages). ${quickReplier} is the anchor holding this together with quick replies.`,
      `${streak > 10 ? `You maintained an insane ${streak}-day streak of talking every single day.` : `You chat in heavy, unpredictable bursts.`} ${bigTexter} carries the conversation volume (${p1Pct >= p2Pct ? p1Pct : p2Pct}%), while ${quickReplier} carries the response speed. You balance each other out perfectly.`
    ];
    const summaries_id = [
      `Percakapan ini adalah studi kontras: ${bigTexter} mengirimkan ${p1Pct >= p2Pct ? p1Pct : p2Pct}% dari total ${totalMsg.toLocaleString()} pesan, sementara ${quietOne} lebih santai. ${quickReplier} adalah pembalas tercepat - ponselnya selalu di tangan. ${ghostCount > 0 ? `Ada ${ghostCount} kali seseorang menghilang berjam-jam.` : `Menariknya, tidak ada yang suka ghosting.`} Bersama-sama, kalian membangun dinamika yang konsisten kacau.`,
      `Dinamika percakapan ini didorong oleh ${bigTexter} yang menyumbang ${p1Pct >= p2Pct ? p1Pct : p2Pct}% dari ${totalMsg.toLocaleString()} pesan. Di sisi lain, jari ${quickReplier} bergerak secepat kilat. ${ghostCount > 0 ? `Kalian tercatat saling diam sebanyak ${ghostCount} kali.` : `Hebatnya kalian nyaris tidak pernah membiarkan chat menggantung.`} Interaksi ini mendefinisikan tarik-ulur digital.`,
      `Kalian berdua telah menumpuk ${totalMsg.toLocaleString()} pesan, di mana ${bigTexter} mendominasi ${p1Pct >= p2Pct ? p1Pct : p2Pct}%. ${quietOne} jauh lebih hemat energi. Tapi ${quickReplier} pantas dapat piala fast-response. ${ghostCount > 0 ? `Walau begitu, kebiasaan ngilang ${ghostCount} kali cukup membuktikan prioritas kehidupan nyata.` : `Konsistensi balas kalian patut diacungi jempol.`} Kombinasi unik antara agresif dan pasif.`,
      `Di balik ${totalMsg.toLocaleString()} pesan ini, ${bigTexter} mendominasi obrolan (${p1Pct >= p2Pct ? p1Pct : p2Pct}%), dan ${quickReplier} membalas paling cepat. Sistem yang seimbang.`,
      `Butuh dua orang untuk ngobrol, tapi ${bigTexter} mengambil alih panggung utama (${p1Pct >= p2Pct ? p1Pct : p2Pct}% pesan). ${quickReplier} selalu sigap membalas.`,
      `${streak > 10 ? `Kalian punya rekor gila: ngobrol ${streak} hari berturut-turut tanpa jeda sehari pun.` : `Kalian ngobrol secara sporadis namun intens.`} ${bigTexter} jadi motor penggerak (${p1Pct >= p2Pct ? p1Pct : p2Pct}% pesan), sedangkan ${quickReplier} jadi seksi sibuk yang selalu fast-response. Bener-bener saling melengkapi.`
    ];
    const applicableEvos = [];
    const stickerCount = metrics.mediaCounts["sticker"] || 0;
    
    if (stickerCount > 250) {
      applicableEvos.push({
        en: `Over time, your conversation evolved from polite check-ins to an unfiltered stream of stickers.`,
        id: `Seiring waktu, percakapan kalian berubah dari sapaan sopan menjadi kumpulan stiker tanpa konteks.`
      });
    }

    if (metrics.avgMessagesPerDay > 50) {
      applicableEvos.push({
        en: `What was once a casual chat became a high-speed daily necessity.`,
        id: `Berawal dari chat biasa, sekarang jadi kebutuhan primer yang harus diisi tiap hari.`
      });
      applicableEvos.push({
        en: `You went from carefully constructed sentences to rapid-fire single-word texts.`,
        id: `Dari yang awalnya ngetik rapi, sekarang jadi balasan sepotong-sepotong super cepat.`
      });
    }

    if (ghostCount > 5) {
      applicableEvos.push({
        en: `The chat evolved into a comfortable silence interspersed with frantic bursts of updates.`,
        id: `Chat ini berevolusi jadi tempat curhat dadakan yang diselingi masa-masa tenang panjang.`
      });
    }
    
    applicableEvos.push({
      en: `The dynamic shifted from distant acquaintances to entirely too comfortable with each other.`,
      id: `Dinamika berubah dari sekadar teman biasa jadi temen yang kelewat blak-blakan.`
    });
    applicableEvos.push({
      en: `Your communication lost all its formal boundaries and descended into comfortable chaos.`,
      id: `Gaya bahasa kalian kehilangan batas formalnya dan berubah jadi kekacauan yang terstruktur.`
    });
    if (metrics.totalMessages > 10000) {
      applicableEvos.push({
        en: `Over time, your conversation evolved from polite check-ins to an unfiltered stream of consciousness.`,
        id: `Seiring waktu, percakapan kalian berubah dari sapaan sopan menjadi obrolan ngalor-ngidul tanpa filter.`
      });
    }

    const pickedEvo = applicableEvos[hash % applicableEvos.length];
    evo_en = pickedEvo.en;
    evo_id = pickedEvo.id;

    const v_evo = hash % 6;
    summary_en = summaries_en[v_evo];
    summary_id = summaries_id[v_evo];
  }

  const summary = language === 'id' ? summary_id : summary_en;
  const evolution = language === 'id' ? evo_id : evo_en;

  return {
    personality_summary: summary,
    chat_insight: chat_insight,
    topics: [], // We now calculate topics algorithmically in metrics.ts
    evolution_note: evolution
  };
}
