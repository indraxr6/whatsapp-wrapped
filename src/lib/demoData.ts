import type { GeminiInsights, ParsedChatMetrics, GroupRenameEvent } from '../types/chat';

function getDatesForYear(year: number) {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31)
  };
}

export function getDemoData(mode: 'dm' | 'group', lang: 'en' | 'id'): { metrics: ParsedChatMetrics; insights: GeminiInsights } {
  const dates = getDatesForYear(2023);
  const isId = lang === 'id';

  if (mode === 'dm') {
    const participants = isId ? ['Kamu', 'Rizky'] : ['You', 'Sam'];
    const p1 = participants[0]; // You
    const p2 = participants[1]; // Sam

    const metrics: ParsedChatMetrics = {
      totalMessages: 38450,
      dateRange: dates,
      participants,
      messagesPerSender: { [p1]: 19200, [p2]: 19250 },
      avgResponseTimeMinutes: { [p1]: 2.5, [p2]: 8.4 },
      avgMessagesPerBurst: { [p1]: 3.2, [p2]: 1.8 },
      doubleTextCounts: { [p1]: 1420, [p2]: 350 },
      ghostingInstances: { [p1]: 2, [p2]: 18 },
      groupName: null,
      groupNameHistory: [],
      iconChangeCount: 0,
      sharedLinks: {
        'Spotify': 142,
        'TikTok': 530,
        'YouTube': 88,
        'Instagram Reels': 310,
        'X': 45,
        'Google Maps': 12
      },
      activeChatDays: 342,
      mirroredPhrases: isId
        ? [
            { phrase: 'wkwk', count: 850 },
            { phrase: 'otw', count: 320 },
            { phrase: 'gas', count: 210 },
            { phrase: 'iyaa', count: 180 },
            { phrase: 'mantap', count: 140 }
          ]
        : [
            { phrase: 'lmao', count: 850 },
            { phrase: 'omw', count: 320 },
            { phrase: 'fr', count: 210 },
            { phrase: 'yeah', count: 180 },
            { phrase: 'crazy', count: 140 }
          ],

      mediaCounts: { [p1]: 1200, [p2]: 850 },
      viewOnceCount: { [p1]: 24, [p2]: 12 },
      editedMessageCount: { [p1]: 85, [p2]: 30 },
      deletedMessageCount: { [p1]: 12, [p2]: 4 },
      totalVoiceCalls: 45,
      totalVideoCalls: 12,
      callsInitiated: { [p1]: 35, [p2]: 22 },
      callsMissed: { [p1]: 5, [p2]: 12 },
      totalCallDurationSeconds: { [p1]: 18500, [p2]: 12400 },
      totalVideoCallDurationSeconds: { [p1]: 4500, [p2]: 1200 },
      longestVoiceCallSeconds: 4800,
      longestVideoCallSeconds: 2400,

      stickerCount: { [p1]: 450, [p2]: 820 },
      topEmojisPerSender: {
        [p1]: [{ emoji: '😭', count: 420 }, { emoji: '💀', count: 350 }, { emoji: '✨', count: 210 }, { emoji: '🫠', count: 180 }, { emoji: '🥺', count: 150 }],
        [p2]: [{ emoji: '😂', count: 500 }, { emoji: '🔥', count: 320 }, { emoji: '🤡', count: 280 }, { emoji: '👍', count: 190 }, { emoji: '👀', count: 120 }]
      },
      emojiLeaderboardPerSender: {
        [p1]: [{ emoji: '😭', count: 420 }, { emoji: '💀', count: 350 }, { emoji: '✨', count: 210 }, { emoji: '🫠', count: 180 }, { emoji: '🥺', count: 150 }],
        [p2]: [{ emoji: '😂', count: 500 }, { emoji: '🔥', count: 320 }, { emoji: '🤡', count: 280 }, { emoji: '👍', count: 190 }, { emoji: '👀', count: 120 }]
      },
      emojiSpamOutliers: [
        { sender: p1, emoji: '😭', count: 12 },
        { sender: p2, emoji: '😂', count: 8 }
      ],
      mediaLeaderboard: {
        image: 1400, video: 250, audio: 350, sticker: 1270, gif: 45, document: 12, contactCard: 2, link: 1127, location: 8, unknown: 0
      },
      mediaLeaderboardPerSender: {
        [p1]: { image: 800, video: 150, audio: 200, sticker: 450, gif: 20, document: 10, contactCard: 2, link: 600, location: 4, unknown: 0 },
        [p2]: { image: 600, video: 100, audio: 150, sticker: 820, gif: 25, document: 2, contactCard: 0, link: 527, location: 4, unknown: 0 }
      },

      monthlyMessageCounts: [
        { month: '2023-01', count: 2500 }, { month: '2023-02', count: 2800 },
        { month: '2023-03', count: 3200 }, { month: '2023-04', count: 4100 },
        { month: '2023-05', count: 3900 }, { month: '2023-06', count: 3100 },
        { month: '2023-07', count: 2800 }, { month: '2023-08', count: 2100 },
        { month: '2023-09', count: 1800 }, { month: '2023-10', count: 2200 },
        { month: '2023-11', count: 3100 }, { month: '2023-12', count: 6850 } // Huge spike
      ],
      peakMonth: { month: '2023-12', count: 6850 },
      // Note: dailyMessageCounts, dayOfWeekCounts, monthlyMessagesPerSender might not be in interface directly but aren't crashing.
      hourlyHeatmap: [150, 80, 20, 5, 0, 10, 400, 1200, 2500, 3100, 2800, 2600, 3200, 3500, 3100, 2900, 3400, 4100, 4800, 5200, 6100, 5800, 4200, 1500],
      chatDurationDays: 365,
      avgMessagesPerDay: 105,
      longestStreakByDay: 45,

            topKeywords: isId 
        ? [{"word":"kapan","count":1450},{"word":"info","count":1436},{"word":"gas","count":1422},{"word":"dimana","count":1408},{"word":"gila","count":1394},{"word":"ayo","count":1380},{"word":"nanti","count":1366},{"word":"besok","count":1352},{"word":"bisa","count":1338},{"word":"iya","count":1324},{"word":"ngga","count":1310},{"word":"wkwk","count":1296},{"word":"makan","count":1282},{"word":"tidur","count":1268},{"word":"main","count":1254},{"word":"kerja","count":1240},{"word":"capek","count":1226},{"word":"baru","count":1212},{"word":"lama","count":1198},{"word":"cepat","count":1184},{"word":"susah","count":1170},{"word":"gampang","count":1156},{"word":"bagus","count":1142},{"word":"jelek","count":1128},{"word":"sama","count":1114},{"word":"beda","count":1100},{"word":"banyak","count":1086},{"word":"dikit","count":1072},{"word":"orang","count":1058},{"word":"uang","count":1044},{"word":"waktu","count":1030},{"word":"beli","count":1016},{"word":"pulang","count":1002},{"word":"suka","count":988},{"word":"pasti","count":974},{"word":"malam","count":960},{"word":"pagi","count":946},{"word":"hari","count":932},{"word":"jalan","count":918},{"word":"bikin","count":904},{"word":"rumah","count":890},{"word":"mobil","count":876},{"word":"motor","count":862},{"word":"hp","count":848},{"word":"laptop","count":834},{"word":"baju","count":820},{"word":"celana","count":806},{"word":"sepatu","count":792},{"word":"tas","count":778},{"word":"jam","count":764},{"word":"buku","count":750},{"word":"pulpen","count":736},{"word":"meja","count":722},{"word":"kursi","count":708},{"word":"kopi","count":694},{"word":"teh","count":680},{"word":"air","count":666},{"word":"es","count":652},{"word":"panas","count":638},{"word":"dingin","count":624},{"word":"hujan","count":610},{"word":"mendung","count":596},{"word":"terang","count":582},{"word":"gelap","count":568},{"word":"siang","count":554},{"word":"sore","count":540},{"word":"senin","count":526},{"word":"selasa","count":512},{"word":"rabu","count":498},{"word":"kamis","count":484},{"word":"jumat","count":470},{"word":"sabtu","count":456},{"word":"minggu","count":442},{"word":"januari","count":428},{"word":"februari","count":414},{"word":"maret","count":400},{"word":"april","count":386},{"word":"mei","count":372},{"word":"juni","count":358},{"word":"juli","count":344},{"word":"agustus","count":330},{"word":"september","count":316},{"word":"oktober","count":302},{"word":"november","count":288},{"word":"desember","count":274},{"word":"satu","count":260},{"word":"dua","count":246},{"word":"tiga","count":232},{"word":"empat","count":218},{"word":"lima","count":204},{"word":"enam","count":190},{"word":"tujuh","count":176},{"word":"delapan","count":162},{"word":"sembilan","count":148},{"word":"sepuluh","count":134},{"word":"sebelas","count":120},{"word":"belas","count":106},{"word":"puluh","count":92}]
        : [{"word":"when","count":1450},{"word":"where","count":1436},{"word":"crazy","count":1422},{"word":"tonight","count":1408},{"word":"bro","count":1394},{"word":"lets","count":1380},{"word":"later","count":1366},{"word":"tomorrow","count":1352},{"word":"can","count":1338},{"word":"yeah","count":1324},{"word":"no","count":1310},{"word":"haha","count":1296},{"word":"food","count":1282},{"word":"sleep","count":1268},{"word":"play","count":1254},{"word":"work","count":1240},{"word":"tired","count":1226},{"word":"new","count":1212},{"word":"long","count":1198},{"word":"fast","count":1184},{"word":"hard","count":1170},{"word":"easy","count":1156},{"word":"good","count":1142},{"word":"bad","count":1128},{"word":"same","count":1114},{"word":"diff","count":1100},{"word":"much","count":1086},{"word":"little","count":1072},{"word":"people","count":1058},{"word":"money","count":1044},{"word":"time","count":1030},{"word":"buy","count":1016},{"word":"home","count":1002},{"word":"like","count":988},{"word":"sure","count":974},{"word":"night","count":960},{"word":"morning","count":946},{"word":"day","count":932},{"word":"walk","count":918},{"word":"make","count":904},{"word":"house","count":890},{"word":"car","count":876},{"word":"bike","count":862},{"word":"phone","count":848},{"word":"laptop","count":834},{"word":"shirt","count":820},{"word":"pants","count":806},{"word":"shoes","count":792},{"word":"bag","count":778},{"word":"watch","count":764},{"word":"book","count":750},{"word":"pen","count":736},{"word":"desk","count":722},{"word":"chair","count":708},{"word":"coffee","count":694},{"word":"tea","count":680},{"word":"water","count":666},{"word":"ice","count":652},{"word":"hot","count":638},{"word":"cold","count":624},{"word":"rain","count":610},{"word":"cloudy","count":596},{"word":"bright","count":582},{"word":"dark","count":568},{"word":"noon","count":554},{"word":"evening","count":540},{"word":"monday","count":526},{"word":"tuesday","count":512},{"word":"wednesday","count":498},{"word":"thursday","count":484},{"word":"friday","count":470},{"word":"saturday","count":456},{"word":"sunday","count":442},{"word":"january","count":428},{"word":"february","count":414},{"word":"march","count":400},{"word":"april","count":386},{"word":"may","count":372},{"word":"june","count":358},{"word":"july","count":344},{"word":"august","count":330},{"word":"september","count":316},{"word":"october","count":302},{"word":"november","count":288},{"word":"december","count":274},{"word":"one","count":260},{"word":"two","count":246},{"word":"three","count":232},{"word":"four","count":218},{"word":"five","count":204},{"word":"six","count":190},{"word":"seven","count":176},{"word":"eight","count":162},{"word":"nine","count":148},{"word":"ten","count":134},{"word":"eleven","count":120},{"word":"twelve","count":106},{"word":"thirteen","count":92}],
      eraDateRanges: {
        early: { start: new Date(2023, 0, 1), end: new Date(2023, 3, 31) },
        median: { start: new Date(2023, 4, 1), end: new Date(2023, 7, 31) },
        late: { start: new Date(2023, 8, 1), end: new Date(2023, 11, 31) }
      },
      eraMetrics: {
        early: { avgResponseTimeMinutes: 15.2, avgMessageLength: 8.4, topEmoji: '😊' },
        median: { avgResponseTimeMinutes: 8.5, avgMessageLength: 5.2, topEmoji: '😂' },
        late: { avgResponseTimeMinutes: 2.1, avgMessageLength: 3.1, topEmoji: '💀' }
      },
      sampleExcerpts: {
        early: isId ? [`[09:00] ${p2}: Halo, salam kenal ya`, `[09:17] ${p1}: Senang berkenalan denganmu`, `[09:34] ${p1}: Jadi ini grup barunya`, `[09:51] ${p2}: Mantap, siap bos`, `[10:08] ${p1}: Besok kumpul jam berapa?`, `[10:25] ${p1}: Bebas, ngikut aja`, `[10:42] ${p2}: Yang lain gimana?`, `[10:59] ${p1}: Gas lah pokoknya`, `[11:16] ${p1}: Oke ntar kabarin ya`, `[11:33] ${p2}: Sip, aman`, `[11:50] ${p1}: Jangan lupa bawa barangnya`, `[12:07] ${p1}: Udah disiapin kok`, `[12:24] ${p2}: Otw sekarang`, `[12:41] ${p1}: Lagi di jalan nih`, `[12:58] ${p1}: Udah sampe mana?`, `[13:15] ${p2}: Bentaran lagi nyampe`, `[13:32] ${p1}: Cepetan woy`, `[13:49] ${p1}: Sabar napa`, `[14:06] ${p2}: Udah nunggu dari tadi`, `[14:23] ${p1}: Maaf telat wkwk`, `[14:40] ${p1}: Halo, salam kenal ya`, `[14:57] ${p2}: Senang berkenalan denganmu`, `[15:14] ${p1}: Jadi ini grup barunya`, `[15:31] ${p1}: Mantap, siap bos`, `[15:48] ${p2}: Besok kumpul jam berapa?`, `[16:05] ${p1}: Bebas, ngikut aja`, `[16:22] ${p1}: Yang lain gimana?`, `[16:39] ${p2}: Gas lah pokoknya`, `[16:56] ${p1}: Oke ntar kabarin ya`, `[17:13] ${p1}: Sip, aman`, `[17:30] ${p2}: Jangan lupa bawa barangnya`, `[17:47] ${p1}: Udah disiapin kok`, `[18:04] ${p1}: Otw sekarang`, `[18:21] ${p2}: Lagi di jalan nih`, `[18:38] ${p1}: Udah sampe mana?`, `[18:55] ${p1}: Bentaran lagi nyampe`, `[19:12] ${p2}: Cepetan woy`, `[19:29] ${p1}: Sabar napa`, `[19:46] ${p1}: Udah nunggu dari tadi`, `[20:03] ${p2}: Maaf telat wkwk`, `[20:20] ${p1}: Halo, salam kenal ya`, `[20:37] ${p1}: Senang berkenalan denganmu`, `[20:54] ${p2}: Jadi ini grup barunya`, `[21:11] ${p1}: Mantap, siap bos`, `[21:28] ${p1}: Besok kumpul jam berapa?`] : [`[09:00] ${p2}: Hello, nice to meet you`, `[09:17] ${p1}: Nice to meet you too`, `[09:34] ${p1}: So this is the new group`, `[09:51] ${p2}: Awesome, got it`, `[10:08] ${p1}: What time are we meeting tomorrow?`, `[10:25] ${p1}: Anytime, I will just follow`, `[10:42] ${p2}: What about the others?`, `[10:59] ${p1}: Lets go then`, `[11:16] ${p1}: Okay let me know`, `[11:33] ${p2}: Alright, safe`, `[11:50] ${p1}: Dont forget to bring the stuff`, `[12:07] ${p1}: Already prepared it`, `[12:24] ${p2}: On my way now`, `[12:41] ${p1}: On the road`, `[12:58] ${p1}: Where are you at?`, `[13:15] ${p2}: Almost there`, `[13:32] ${p1}: Hurry up bro`, `[13:49] ${p1}: Be patient`, `[14:06] ${p2}: Been waiting for a while`, `[14:23] ${p1}: Sorry Im late haha`, `[14:40] ${p1}: Hello, nice to meet you`, `[14:57] ${p2}: Nice to meet you too`, `[15:14] ${p1}: So this is the new group`, `[15:31] ${p1}: Awesome, got it`, `[15:48] ${p2}: What time are we meeting tomorrow?`, `[16:05] ${p1}: Anytime, I will just follow`, `[16:22] ${p1}: What about the others?`, `[16:39] ${p2}: Lets go then`, `[16:56] ${p1}: Okay let me know`, `[17:13] ${p1}: Alright, safe`, `[17:30] ${p2}: Dont forget to bring the stuff`, `[17:47] ${p1}: Already prepared it`, `[18:04] ${p1}: On my way now`, `[18:21] ${p2}: On the road`, `[18:38] ${p1}: Where are you at?`, `[18:55] ${p1}: Almost there`, `[19:12] ${p2}: Hurry up bro`, `[19:29] ${p1}: Be patient`, `[19:46] ${p1}: Been waiting for a while`, `[20:03] ${p2}: Sorry Im late haha`, `[20:20] ${p1}: Hello, nice to meet you`, `[20:37] ${p1}: Nice to meet you too`, `[20:54] ${p2}: So this is the new group`, `[21:11] ${p1}: Awesome, got it`, `[21:28] ${p1}: What time are we meeting tomorrow?`],
        median: isId ? [`[14:00] ${p2}: Eh liburan jadi ke bali?`, `[14:17] ${p1}: Wacana doang pasti ini`, `[14:34] ${p1}: Gak ada duit woi`, `[14:51] ${p2}: Patungan lah`, `[15:08] ${p1}: Tiket pesawat mahal`, `[15:25] ${p1}: Pake kereta aja`, `[15:42] ${p2}: Lama kalau kereta`, `[15:59] ${p1}: Ya mau gimana lagi`, `[16:16] ${p1}: Yaudah ntar dipikirin lagi`, `[16:33] ${p2}: Jangan lama2 mikirnya`, `[16:50] ${p1}: Ntar keburu kehabisan`, `[17:07] ${p1}: Iya bawel`, `[17:24] ${p2}: Kapan bookingnya?`, `[17:41] ${p1}: Bulan depan aja`, `[17:58] ${p1}: Keburu mahal ntar`, `[18:15] ${p2}: Iya juga sih`, `[18:32] ${p1}: Yaudah besok kumpul`, `[18:49] ${p1}: Bahas liburan?`, `[19:06] ${p2}: Iya dong`, `[19:23] ${p1}: Gas meluncur`, `[19:40] ${p1}: Eh liburan jadi ke bali?`, `[19:57] ${p2}: Wacana doang pasti ini`, `[20:14] ${p1}: Gak ada duit woi`, `[20:31] ${p1}: Patungan lah`, `[20:48] ${p2}: Tiket pesawat mahal`, `[21:05] ${p1}: Pake kereta aja`, `[21:22] ${p1}: Lama kalau kereta`, `[21:39] ${p2}: Ya mau gimana lagi`, `[21:56] ${p1}: Yaudah ntar dipikirin lagi`, `[22:13] ${p1}: Jangan lama2 mikirnya`, `[22:30] ${p2}: Ntar keburu kehabisan`, `[22:47] ${p1}: Iya bawel`, `[23:04] ${p1}: Kapan bookingnya?`, `[23:21] ${p2}: Bulan depan aja`, `[23:38] ${p1}: Keburu mahal ntar`, `[23:55] ${p1}: Iya juga sih`, `[00:12] ${p2}: Yaudah besok kumpul`, `[00:29] ${p1}: Bahas liburan?`, `[00:46] ${p1}: Iya dong`, `[01:03] ${p2}: Gas meluncur`, `[01:20] ${p1}: Eh liburan jadi ke bali?`, `[01:37] ${p1}: Wacana doang pasti ini`, `[01:54] ${p2}: Gak ada duit woi`, `[02:11] ${p1}: Patungan lah`, `[02:28] ${p1}: Tiket pesawat mahal`] : [`[14:00] ${p2}: So are we still going to Bali?`, `[14:17] ${p1}: Definitely getting cancelled`, `[14:34] ${p1}: I have no money bro`, `[14:51] ${p2}: Lets split the bill`, `[15:08] ${p1}: Flight tickets are expensive`, `[15:25] ${p1}: Just take the train`, `[15:42] ${p2}: Train takes too long`, `[15:59] ${p1}: What else can we do`, `[16:16] ${p1}: Well think about it later`, `[16:33] ${p2}: Dont take too long`, `[16:50] ${p1}: Before it runs out`, `[17:07] ${p1}: Yeah whatever`, `[17:24] ${p2}: When are we booking?`, `[17:41] ${p1}: Next month`, `[17:58] ${p1}: It will get expensive`, `[18:15] ${p2}: That is true`, `[18:32] ${p1}: Alright lets meet tomorrow`, `[18:49] ${p1}: To discuss the holiday?`, `[19:06] ${p2}: Of course`, `[19:23] ${p1}: Lets go`, `[19:40] ${p1}: So are we still going to Bali?`, `[19:57] ${p2}: Definitely getting cancelled`, `[20:14] ${p1}: I have no money bro`, `[20:31] ${p1}: Lets split the bill`, `[20:48] ${p2}: Flight tickets are expensive`, `[21:05] ${p1}: Just take the train`, `[21:22] ${p1}: Train takes too long`, `[21:39] ${p2}: What else can we do`, `[21:56] ${p1}: Well think about it later`, `[22:13] ${p1}: Dont take too long`, `[22:30] ${p2}: Before it runs out`, `[22:47] ${p1}: Yeah whatever`, `[23:04] ${p1}: When are we booking?`, `[23:21] ${p2}: Next month`, `[23:38] ${p1}: It will get expensive`, `[23:55] ${p1}: That is true`, `[00:12] ${p2}: Alright lets meet tomorrow`, `[00:29] ${p1}: To discuss the holiday?`, `[00:46] ${p1}: Of course`, `[01:03] ${p2}: Lets go`, `[01:20] ${p1}: So are we still going to Bali?`, `[01:37] ${p1}: Definitely getting cancelled`, `[01:54] ${p2}: I have no money bro`, `[02:11] ${p1}: Lets split the bill`, `[02:28] ${p1}: Flight tickets are expensive`],
        late: isId ? [`[23:00] ${p2}: bjirr 💀`, `[23:17] ${p1}: wkwkwkwk gila`, `[23:34] ${p1}: Liat tuh kelakuannya`, `[23:51] ${p2}: Parah emang`, `[00:08] ${p1}: Ngakak guling guling`, `[00:25] ${p1}: Sampe sakit perut`, `[00:42] ${p2}: Ada ada aja kelakuannya`, `[00:59] ${p1}: Bikin emosi`, `[01:16] ${p1}: Stress gue mikirinnya`, `[01:33] ${p2}: Udah biarin aja`, `[01:50] ${p1}: Gak penting juga`, `[02:07] ${p1}: Tumben bener`, `[02:24] ${p2}: Lagi waras nih`, `[02:41] ${p1}: Tumben banget`, `[02:58] ${p1}: Kerasukan apa lu`, `[03:15] ${p2}: Sembarangan`, `[03:32] ${p1}: Yaudah tidur gih`, `[03:49] ${p1}: Ngantuk berat`, `[04:06] ${p2}: Besok kerja woi`, `[04:23] ${p1}: Iya iya bawel`, `[04:40] ${p1}: bjirr 💀`, `[04:57] ${p2}: wkwkwkwk gila`, `[05:14] ${p1}: Liat tuh kelakuannya`, `[05:31] ${p1}: Parah emang`, `[05:48] ${p2}: Ngakak guling guling`, `[06:05] ${p1}: Sampe sakit perut`, `[06:22] ${p1}: Ada ada aja kelakuannya`, `[06:39] ${p2}: Bikin emosi`, `[06:56] ${p1}: Stress gue mikirinnya`, `[07:13] ${p1}: Udah biarin aja`, `[07:30] ${p2}: Gak penting juga`, `[07:47] ${p1}: Tumben bener`, `[08:04] ${p1}: Lagi waras nih`, `[08:21] ${p2}: Tumben banget`, `[08:38] ${p1}: Kerasukan apa lu`, `[08:55] ${p1}: Sembarangan`, `[09:12] ${p2}: Yaudah tidur gih`, `[09:29] ${p1}: Ngantuk berat`, `[09:46] ${p1}: Besok kerja woi`, `[10:03] ${p2}: Iya iya bawel`, `[10:20] ${p1}: bjirr 💀`, `[10:37] ${p1}: wkwkwkwk gila`, `[10:54] ${p2}: Liat tuh kelakuannya`, `[11:11] ${p1}: Parah emang`, `[11:28] ${p1}: Ngakak guling guling`] : [`[23:00] ${p2}: bro im dead 💀`, `[23:17] ${p1}: lmaooo crazy`, `[23:34] ${p1}: Look at his behavior`, `[23:51] ${p2}: Thats crazy`, `[00:08] ${p1}: Rolling on the floor laughing`, `[00:25] ${p1}: My stomach hurts`, `[00:42] ${p2}: Always something with him`, `[00:59] ${p1}: Makes me mad`, `[01:16] ${p1}: Im stressed thinking about it`, `[01:33] ${p2}: Just leave it`, `[01:50] ${p1}: Not important anyway`, `[02:07] ${p1}: Right for once`, `[02:24] ${p2}: Im sane today`, `[02:41] ${p1}: That is rare`, `[02:58] ${p1}: What possessed you`, `[03:15] ${p2}: Whatever man`, `[03:32] ${p1}: Just go to sleep`, `[03:49] ${p1}: Im super sleepy`, `[04:06] ${p2}: Work tomorrow bro`, `[04:23] ${p1}: Yeah yeah shut up`, `[04:40] ${p1}: bro im dead 💀`, `[04:57] ${p2}: lmaooo crazy`, `[05:14] ${p1}: Look at his behavior`, `[05:31] ${p1}: Thats crazy`, `[05:48] ${p2}: Rolling on the floor laughing`, `[06:05] ${p1}: My stomach hurts`, `[06:22] ${p1}: Always something with him`, `[06:39] ${p2}: Makes me mad`, `[06:56] ${p1}: Im stressed thinking about it`, `[07:13] ${p1}: Just leave it`, `[07:30] ${p2}: Not important anyway`, `[07:47] ${p1}: Right for once`, `[08:04] ${p1}: Im sane today`, `[08:21] ${p2}: That is rare`, `[08:38] ${p1}: What possessed you`, `[08:55] ${p1}: Whatever man`, `[09:12] ${p2}: Just go to sleep`, `[09:29] ${p1}: Im super sleepy`, `[09:46] ${p1}: Work tomorrow bro`, `[10:03] ${p2}: Yeah yeah shut up`, `[10:20] ${p1}: bro im dead 💀`, `[10:37] ${p1}: lmaooo crazy`, `[10:54] ${p2}: Look at his behavior`, `[11:11] ${p1}: Thats crazy`, `[11:28] ${p1}: Rolling on the floor laughing`]
      }
    };

    const insights: GeminiInsights = {
      personality_summary: isId 
        ? `Percakapan ini adalah sebuah masterpiece tarik-ulur digital. Kamu menembakkan 3.2 pesan per burst layaknya senapan mesin, sementara Rizky merespons dengan efisiensi mematikan. Menariknya, Rizky sudah 18 kali nge-ghosting kamu selama lebih dari setengah hari, tapi kalian tetap menghabiskan 18.500 detik di telepon. Kalian jelas sangat dekat, tapi dengan dinamika kekuasaan yang sangat dipegang oleh Rizky.`
        : `This chat is a masterpiece of digital tug-of-war. You fire off 3.2 messages per burst like a machine gun, while Sam responds with lethal efficiency. Interestingly, Sam has ghosted you 18 times for more than half a day, yet you still spent 18,500 seconds on the phone together. You're clearly extremely close, but the power dynamic heavily favors Sam's pacing.`,
      roast: isId
        ? `Kamu memborbardir chat ini dengan antusiasme berlebih, dan Rizky membalas dengan energi 'orang sibuk yang cuma bales pas lagi di toilet'.`
        : `You bombard this chat with golden retriever energy, and Sam responds with the energy of a busy person replying from the toilet.`,
      topics: isId ? ['Rencana Gagal', 'Meme', 'Nongkrong', 'Gibah'] : ['Cancelled Plans', 'Memes', 'Hanging Out', 'Gossiping'],
      evolution_note: isId 
        ? `Dari sapaan kaku penuh tanda baca di awal tahun, percakapan ini secara perlahan bermutasi menjadi rentetan stiker dan omong kosong tanpa konteks.`
        : `From perfectly punctuated polite greetings early on, this chat slowly mutated into a rapid-fire stream of stickers and out-of-context nonsense.`
    };

    return { metrics, insights };

  } else {
    // GROUP DEMO
    const participants = isId ? ['Kamu', 'Alex', 'Jordan', 'Maya', 'Kevin'] : ['You', 'Alex', 'Jordan', 'Maya', 'Kevin'];
    const [p1, p2, p3, p4, p5] = participants;

    const metrics: ParsedChatMetrics = {
      totalMessages: 85200,
      dateRange: dates,
      participants,
      messagesPerSender: { [p1]: 34000, [p2]: 28000, [p3]: 15000, [p4]: 7000, [p5]: 1200 },
      avgResponseTimeMinutes: { [p1]: 1.2, [p2]: 4.5, [p3]: 15.0, [p4]: 120.0, [p5]: 2800.0 },
      avgMessagesPerBurst: { [p1]: 2.8, [p2]: 2.1, [p3]: 1.5, [p4]: 1.1, [p5]: 1.0 },
      doubleTextCounts: { [p1]: 2800, [p2]: 1500, [p3]: 400, [p4]: 50, [p5]: 0 },
      ghostingInstances: { [p1]: 1, [p2]: 5, [p3]: 24, [p4]: 85, [p5]: 140 },
      groupName: isId ? "Grup Ghibah Nasional" : "The Core Council",
      groupNameHistory: isId ? [
        { date: new Date(2023, 1, 10), actor: p1, oldName: 'Tempat Kumpul', newName: 'Rencana Liburan' },
        { date: new Date(2023, 3, 15), actor: p2, oldName: 'Rencana Liburan', newName: 'Wacana Liburan' },
        { date: new Date(2023, 5, 20), actor: p3, oldName: 'Wacana Liburan', newName: 'Grup Ghibah Nasional' }
      ] : [
        { date: new Date(2023, 1, 10), actor: p1, oldName: 'Friend Group', newName: 'Vacation Planning' },
        { date: new Date(2023, 3, 15), actor: p2, oldName: 'Vacation Planning', newName: 'Cancelled Vacation Planning' },
        { date: new Date(2023, 5, 20), actor: p3, oldName: 'Cancelled Vacation Planning', newName: 'The Core Council' }
      ],
      iconChangeCount: 14,
      sharedLinks: isId ? {
        'TikTok': 1420,
        'Instagram Reels': 850,
        'Tokopedia': 540,
        'X': 430,
        'YouTube': 310,
        'Spotify': 280,
        'Google Maps': 145,
        'Instagram Stories': 85,
        'Google Drive': 42,
        'Google Docs': 30,
        'Google Meet': 25,
        'Facebook': 15,
        'Apple Music': 8,
        'LinkedIn': 5
      } : {
        'TikTok': 1420,
        'Instagram Reels': 850,
        'YouTube': 540,
        'X': 430,
        'Spotify': 310,
        'Google Maps': 280,
        'Google Drive': 145,
        'Instagram Stories': 85,
        'Google Docs': 42,
        'GitHub': 30,
        'Google Meet': 25,
        'Facebook': 15,
        'Apple Music': 8,
        'LinkedIn': 5
      },
      activeChatDays: 360,
      mirroredPhrases: isId
        ? [
            { phrase: 'njir', count: 1850 },
            { phrase: 'info', count: 920 },
            { phrase: 'kapan', count: 810 },
            { phrase: 'ayo', count: 680 }
          ]
        : [
            { phrase: 'bruh', count: 1850 },
            { phrase: 'when', count: 920 },
            { phrase: 'let\'s go', count: 810 },
            { phrase: 'same', count: 680 }
          ],

      mediaCounts: { [p1]: 4500, [p2]: 3200, [p3]: 1800, [p4]: 800, [p5]: 20 },
      viewOnceCount: { [p1]: 85, [p2]: 42, [p3]: 12, [p4]: 5, [p5]: 0 },
      editedMessageCount: { [p1]: 420, [p2]: 150, [p3]: 80, [p4]: 10, [p5]: 0 },
      deletedMessageCount: { [p1]: 150, [p2]: 80, [p3]: 20, [p4]: 5, [p5]: 0 },
      totalVoiceCalls: 120,
      totalVideoCalls: 45,
      callsInitiated: { [p1]: 85, [p2]: 50, [p3]: 25, [p4]: 5, [p5]: 0 },
      callsMissed: { [p1]: 10, [p2]: 15, [p3]: 20, [p4]: 50, [p5]: 120 },
      totalCallDurationSeconds: { [p1]: 185000, [p2]: 142000, [p3]: 85000, [p4]: 12000, [p5]: 0 },
      totalVideoCallDurationSeconds: { [p1]: 45000, [p2]: 38000, [p3]: 15000, [p4]: 2000, [p5]: 0 },
      longestVoiceCallSeconds: 14800,
      longestVideoCallSeconds: 8400,

      stickerCount: { [p1]: 8500, [p2]: 6200, [p3]: 3800, [p4]: 1200, [p5]: 10 },
      topEmojisPerSender: {
        [p1]: [{ emoji: '😭', count: 1420 }, { emoji: '💀', count: 1350 }, { emoji: '✨', count: 810 }, { emoji: '🫠', count: 680 }, { emoji: '🤡', count: 550 }],
        [p2]: [{ emoji: '😂', count: 1500 }, { emoji: '🔥', count: 1320 }, { emoji: '👍', count: 880 }, { emoji: '👀', count: 690 }, { emoji: '💯', count: 420 }],
        [p3]: [{ emoji: '🙏', count: 800 }, { emoji: '🥲', count: 650 }, { emoji: '🤣', count: 520 }, { emoji: '🥺', count: 390 }, { emoji: '🤔', count: 220 }],
        [p4]: [{ emoji: '❤️', count: 300 }, { emoji: '👍', count: 250 }, { emoji: '😊', count: 180 }, { emoji: '🎉', count: 120 }, { emoji: '👏', count: 80 }],
        [p5]: [{ emoji: '👍', count: 45 }, { emoji: '🙏', count: 20 }, { emoji: '👌', count: 15 }, { emoji: '✅', count: 10 }, { emoji: '😅', count: 5 }]
      },
      emojiLeaderboardPerSender: {
        [p1]: [{ emoji: '😭', count: 1420 }, { emoji: '💀', count: 1350 }, { emoji: '✨', count: 810 }, { emoji: '🫠', count: 680 }, { emoji: '🤡', count: 550 }],
        [p2]: [{ emoji: '😂', count: 1500 }, { emoji: '🔥', count: 1320 }, { emoji: '👍', count: 880 }, { emoji: '👀', count: 690 }, { emoji: '💯', count: 420 }],
        [p3]: [{ emoji: '🙏', count: 800 }, { emoji: '🥲', count: 650 }, { emoji: '🤣', count: 520 }, { emoji: '🥺', count: 390 }, { emoji: '🤔', count: 220 }],
        [p4]: [{ emoji: '❤️', count: 300 }, { emoji: '👍', count: 250 }, { emoji: '😊', count: 180 }, { emoji: '🎉', count: 120 }, { emoji: '👏', count: 80 }],
        [p5]: [{ emoji: '👍', count: 45 }, { emoji: '🙏', count: 20 }, { emoji: '👌', count: 15 }, { emoji: '✅', count: 10 }, { emoji: '😅', count: 5 }]
      },
      emojiSpamOutliers: [
        { sender: p1, emoji: '😭', count: 20 },
        { sender: p2, emoji: '😂', count: 15 }
      ],
      mediaLeaderboard: {
        image: 4500, video: 1250, audio: 850, sticker: 19710, gif: 245, document: 82, contactCard: 12, link: 3007, location: 48, unknown: 0
      },
      mediaLeaderboardPerSender: {
        [p1]: { image: 2000, video: 500, audio: 400, sticker: 8500, gif: 100, document: 30, contactCard: 5, link: 1200, location: 20, unknown: 0 },
        [p2]: { image: 1500, video: 400, audio: 300, sticker: 6200, gif: 80, document: 20, contactCard: 4, link: 1000, location: 15, unknown: 0 },
        [p3]: { image: 700, video: 250, audio: 100, sticker: 3800, gif: 50, document: 20, contactCard: 2, link: 600, location: 10, unknown: 0 },
        [p4]: { image: 295, video: 100, audio: 50, sticker: 1200, gif: 15, document: 10, contactCard: 1, link: 200, location: 3, unknown: 0 },
        [p5]: { image: 5, video: 0, audio: 0, sticker: 10, gif: 0, document: 2, contactCard: 0, link: 7, location: 0, unknown: 0 }
      },

      monthlyMessageCounts: [
        { month: '2023-01', count: 6500 }, { month: '2023-02', count: 5800 },
        { month: '2023-03', count: 7200 }, { month: '2023-04', count: 8100 },
        { month: '2023-05', count: 6900 }, { month: '2023-06', count: 5100 },
        { month: '2023-07', count: 4800 }, { month: '2023-08', count: 5100 },
        { month: '2023-09', count: 6800 }, { month: '2023-10', count: 7200 },
        { month: '2023-11', count: 9100 }, { month: '2023-12', count: 12600 }
      ],
      peakMonth: { month: '2023-12', count: 12600 },
      hourlyHeatmap: [450, 280, 120, 45, 10, 30, 800, 2200, 4500, 5100, 4800, 4600, 5200, 5500, 5100, 4900, 5400, 6100, 6800, 7200, 8100, 7800, 6200, 3500],
      chatDurationDays: 365,
      avgMessagesPerDay: 233,
      longestStreakByDay: 360,

            topKeywords: isId 
        ? [{"word":"kapan","count":1450},{"word":"info","count":1436},{"word":"gas","count":1422},{"word":"dimana","count":1408},{"word":"gila","count":1394},{"word":"ayo","count":1380},{"word":"nanti","count":1366},{"word":"besok","count":1352},{"word":"bisa","count":1338},{"word":"iya","count":1324},{"word":"ngga","count":1310},{"word":"wkwk","count":1296},{"word":"makan","count":1282},{"word":"tidur","count":1268},{"word":"main","count":1254},{"word":"kerja","count":1240},{"word":"capek","count":1226},{"word":"baru","count":1212},{"word":"lama","count":1198},{"word":"cepat","count":1184},{"word":"susah","count":1170},{"word":"gampang","count":1156},{"word":"bagus","count":1142},{"word":"jelek","count":1128},{"word":"sama","count":1114},{"word":"beda","count":1100},{"word":"banyak","count":1086},{"word":"dikit","count":1072},{"word":"orang","count":1058},{"word":"uang","count":1044},{"word":"waktu","count":1030},{"word":"beli","count":1016},{"word":"pulang","count":1002},{"word":"suka","count":988},{"word":"pasti","count":974},{"word":"malam","count":960},{"word":"pagi","count":946},{"word":"hari","count":932},{"word":"jalan","count":918},{"word":"bikin","count":904},{"word":"rumah","count":890},{"word":"mobil","count":876},{"word":"motor","count":862},{"word":"hp","count":848},{"word":"laptop","count":834},{"word":"baju","count":820},{"word":"celana","count":806},{"word":"sepatu","count":792},{"word":"tas","count":778},{"word":"jam","count":764},{"word":"buku","count":750},{"word":"pulpen","count":736},{"word":"meja","count":722},{"word":"kursi","count":708},{"word":"kopi","count":694},{"word":"teh","count":680},{"word":"air","count":666},{"word":"es","count":652},{"word":"panas","count":638},{"word":"dingin","count":624},{"word":"hujan","count":610},{"word":"mendung","count":596},{"word":"terang","count":582},{"word":"gelap","count":568},{"word":"siang","count":554},{"word":"sore","count":540},{"word":"senin","count":526},{"word":"selasa","count":512},{"word":"rabu","count":498},{"word":"kamis","count":484},{"word":"jumat","count":470},{"word":"sabtu","count":456},{"word":"minggu","count":442},{"word":"januari","count":428},{"word":"februari","count":414},{"word":"maret","count":400},{"word":"april","count":386},{"word":"mei","count":372},{"word":"juni","count":358},{"word":"juli","count":344},{"word":"agustus","count":330},{"word":"september","count":316},{"word":"oktober","count":302},{"word":"november","count":288},{"word":"desember","count":274},{"word":"satu","count":260},{"word":"dua","count":246},{"word":"tiga","count":232},{"word":"empat","count":218},{"word":"lima","count":204},{"word":"enam","count":190},{"word":"tujuh","count":176},{"word":"delapan","count":162},{"word":"sembilan","count":148},{"word":"sepuluh","count":134},{"word":"sebelas","count":120},{"word":"belas","count":106},{"word":"puluh","count":92}]
        : [{"word":"when","count":1450},{"word":"where","count":1436},{"word":"crazy","count":1422},{"word":"tonight","count":1408},{"word":"bro","count":1394},{"word":"lets","count":1380},{"word":"later","count":1366},{"word":"tomorrow","count":1352},{"word":"can","count":1338},{"word":"yeah","count":1324},{"word":"no","count":1310},{"word":"haha","count":1296},{"word":"food","count":1282},{"word":"sleep","count":1268},{"word":"play","count":1254},{"word":"work","count":1240},{"word":"tired","count":1226},{"word":"new","count":1212},{"word":"long","count":1198},{"word":"fast","count":1184},{"word":"hard","count":1170},{"word":"easy","count":1156},{"word":"good","count":1142},{"word":"bad","count":1128},{"word":"same","count":1114},{"word":"diff","count":1100},{"word":"much","count":1086},{"word":"little","count":1072},{"word":"people","count":1058},{"word":"money","count":1044},{"word":"time","count":1030},{"word":"buy","count":1016},{"word":"home","count":1002},{"word":"like","count":988},{"word":"sure","count":974},{"word":"night","count":960},{"word":"morning","count":946},{"word":"day","count":932},{"word":"walk","count":918},{"word":"make","count":904},{"word":"house","count":890},{"word":"car","count":876},{"word":"bike","count":862},{"word":"phone","count":848},{"word":"laptop","count":834},{"word":"shirt","count":820},{"word":"pants","count":806},{"word":"shoes","count":792},{"word":"bag","count":778},{"word":"watch","count":764},{"word":"book","count":750},{"word":"pen","count":736},{"word":"desk","count":722},{"word":"chair","count":708},{"word":"coffee","count":694},{"word":"tea","count":680},{"word":"water","count":666},{"word":"ice","count":652},{"word":"hot","count":638},{"word":"cold","count":624},{"word":"rain","count":610},{"word":"cloudy","count":596},{"word":"bright","count":582},{"word":"dark","count":568},{"word":"noon","count":554},{"word":"evening","count":540},{"word":"monday","count":526},{"word":"tuesday","count":512},{"word":"wednesday","count":498},{"word":"thursday","count":484},{"word":"friday","count":470},{"word":"saturday","count":456},{"word":"sunday","count":442},{"word":"january","count":428},{"word":"february","count":414},{"word":"march","count":400},{"word":"april","count":386},{"word":"may","count":372},{"word":"june","count":358},{"word":"july","count":344},{"word":"august","count":330},{"word":"september","count":316},{"word":"october","count":302},{"word":"november","count":288},{"word":"december","count":274},{"word":"one","count":260},{"word":"two","count":246},{"word":"three","count":232},{"word":"four","count":218},{"word":"five","count":204},{"word":"six","count":190},{"word":"seven","count":176},{"word":"eight","count":162},{"word":"nine","count":148},{"word":"ten","count":134},{"word":"eleven","count":120},{"word":"twelve","count":106},{"word":"thirteen","count":92}],
      eraDateRanges: {
        early: { start: new Date(2023, 0, 1), end: new Date(2023, 3, 31) },
        median: { start: new Date(2023, 4, 1), end: new Date(2023, 7, 31) },
        late: { start: new Date(2023, 8, 1), end: new Date(2023, 11, 31) }
      },
      eraMetrics: {
        early: { avgResponseTimeMinutes: 25.2, avgMessageLength: 12.4, topEmoji: '🙏' },
        median: { avgResponseTimeMinutes: 12.5, avgMessageLength: 8.2, topEmoji: '😂' },
        late: { avgResponseTimeMinutes: 4.1, avgMessageLength: 4.1, topEmoji: '💀' }
      },
      sampleExcerpts: {
        early: isId ? [`[09:00] ${p2}: Halo, salam kenal ya`, `[09:17] ${p1}: Senang berkenalan denganmu`, `[09:34] ${p1}: Jadi ini grup barunya`, `[09:51] ${p2}: Mantap, siap bos`, `[10:08] ${p1}: Besok kumpul jam berapa?`, `[10:25] ${p1}: Bebas, ngikut aja`, `[10:42] ${p2}: Yang lain gimana?`, `[10:59] ${p1}: Gas lah pokoknya`, `[11:16] ${p1}: Oke ntar kabarin ya`, `[11:33] ${p2}: Sip, aman`, `[11:50] ${p1}: Jangan lupa bawa barangnya`, `[12:07] ${p1}: Udah disiapin kok`, `[12:24] ${p2}: Otw sekarang`, `[12:41] ${p1}: Lagi di jalan nih`, `[12:58] ${p1}: Udah sampe mana?`, `[13:15] ${p2}: Bentaran lagi nyampe`, `[13:32] ${p1}: Cepetan woy`, `[13:49] ${p1}: Sabar napa`, `[14:06] ${p2}: Udah nunggu dari tadi`, `[14:23] ${p1}: Maaf telat wkwk`, `[14:40] ${p1}: Halo, salam kenal ya`, `[14:57] ${p2}: Senang berkenalan denganmu`, `[15:14] ${p1}: Jadi ini grup barunya`, `[15:31] ${p1}: Mantap, siap bos`, `[15:48] ${p2}: Besok kumpul jam berapa?`, `[16:05] ${p1}: Bebas, ngikut aja`, `[16:22] ${p1}: Yang lain gimana?`, `[16:39] ${p2}: Gas lah pokoknya`, `[16:56] ${p1}: Oke ntar kabarin ya`, `[17:13] ${p1}: Sip, aman`, `[17:30] ${p2}: Jangan lupa bawa barangnya`, `[17:47] ${p1}: Udah disiapin kok`, `[18:04] ${p1}: Otw sekarang`, `[18:21] ${p2}: Lagi di jalan nih`, `[18:38] ${p1}: Udah sampe mana?`, `[18:55] ${p1}: Bentaran lagi nyampe`, `[19:12] ${p2}: Cepetan woy`, `[19:29] ${p1}: Sabar napa`, `[19:46] ${p1}: Udah nunggu dari tadi`, `[20:03] ${p2}: Maaf telat wkwk`, `[20:20] ${p1}: Halo, salam kenal ya`, `[20:37] ${p1}: Senang berkenalan denganmu`, `[20:54] ${p2}: Jadi ini grup barunya`, `[21:11] ${p1}: Mantap, siap bos`, `[21:28] ${p1}: Besok kumpul jam berapa?`] : [`[09:00] ${p2}: Hello, nice to meet you`, `[09:17] ${p1}: Nice to meet you too`, `[09:34] ${p1}: So this is the new group`, `[09:51] ${p2}: Awesome, got it`, `[10:08] ${p1}: What time are we meeting tomorrow?`, `[10:25] ${p1}: Anytime, I will just follow`, `[10:42] ${p2}: What about the others?`, `[10:59] ${p1}: Lets go then`, `[11:16] ${p1}: Okay let me know`, `[11:33] ${p2}: Alright, safe`, `[11:50] ${p1}: Dont forget to bring the stuff`, `[12:07] ${p1}: Already prepared it`, `[12:24] ${p2}: On my way now`, `[12:41] ${p1}: On the road`, `[12:58] ${p1}: Where are you at?`, `[13:15] ${p2}: Almost there`, `[13:32] ${p1}: Hurry up bro`, `[13:49] ${p1}: Be patient`, `[14:06] ${p2}: Been waiting for a while`, `[14:23] ${p1}: Sorry Im late haha`, `[14:40] ${p1}: Hello, nice to meet you`, `[14:57] ${p2}: Nice to meet you too`, `[15:14] ${p1}: So this is the new group`, `[15:31] ${p1}: Awesome, got it`, `[15:48] ${p2}: What time are we meeting tomorrow?`, `[16:05] ${p1}: Anytime, I will just follow`, `[16:22] ${p1}: What about the others?`, `[16:39] ${p2}: Lets go then`, `[16:56] ${p1}: Okay let me know`, `[17:13] ${p1}: Alright, safe`, `[17:30] ${p2}: Dont forget to bring the stuff`, `[17:47] ${p1}: Already prepared it`, `[18:04] ${p1}: On my way now`, `[18:21] ${p2}: On the road`, `[18:38] ${p1}: Where are you at?`, `[18:55] ${p1}: Almost there`, `[19:12] ${p2}: Hurry up bro`, `[19:29] ${p1}: Be patient`, `[19:46] ${p1}: Been waiting for a while`, `[20:03] ${p2}: Sorry Im late haha`, `[20:20] ${p1}: Hello, nice to meet you`, `[20:37] ${p1}: Nice to meet you too`, `[20:54] ${p2}: So this is the new group`, `[21:11] ${p1}: Awesome, got it`, `[21:28] ${p1}: What time are we meeting tomorrow?`],
        median: isId ? [`[14:00] ${p2}: Eh liburan jadi ke bali?`, `[14:17] ${p1}: Wacana doang pasti ini`, `[14:34] ${p1}: Gak ada duit woi`, `[14:51] ${p2}: Patungan lah`, `[15:08] ${p1}: Tiket pesawat mahal`, `[15:25] ${p1}: Pake kereta aja`, `[15:42] ${p2}: Lama kalau kereta`, `[15:59] ${p1}: Ya mau gimana lagi`, `[16:16] ${p1}: Yaudah ntar dipikirin lagi`, `[16:33] ${p2}: Jangan lama2 mikirnya`, `[16:50] ${p1}: Ntar keburu kehabisan`, `[17:07] ${p1}: Iya bawel`, `[17:24] ${p2}: Kapan bookingnya?`, `[17:41] ${p1}: Bulan depan aja`, `[17:58] ${p1}: Keburu mahal ntar`, `[18:15] ${p2}: Iya juga sih`, `[18:32] ${p1}: Yaudah besok kumpul`, `[18:49] ${p1}: Bahas liburan?`, `[19:06] ${p2}: Iya dong`, `[19:23] ${p1}: Gas meluncur`, `[19:40] ${p1}: Eh liburan jadi ke bali?`, `[19:57] ${p2}: Wacana doang pasti ini`, `[20:14] ${p1}: Gak ada duit woi`, `[20:31] ${p1}: Patungan lah`, `[20:48] ${p2}: Tiket pesawat mahal`, `[21:05] ${p1}: Pake kereta aja`, `[21:22] ${p1}: Lama kalau kereta`, `[21:39] ${p2}: Ya mau gimana lagi`, `[21:56] ${p1}: Yaudah ntar dipikirin lagi`, `[22:13] ${p1}: Jangan lama2 mikirnya`, `[22:30] ${p2}: Ntar keburu kehabisan`, `[22:47] ${p1}: Iya bawel`, `[23:04] ${p1}: Kapan bookingnya?`, `[23:21] ${p2}: Bulan depan aja`, `[23:38] ${p1}: Keburu mahal ntar`, `[23:55] ${p1}: Iya juga sih`, `[00:12] ${p2}: Yaudah besok kumpul`, `[00:29] ${p1}: Bahas liburan?`, `[00:46] ${p1}: Iya dong`, `[01:03] ${p2}: Gas meluncur`, `[01:20] ${p1}: Eh liburan jadi ke bali?`, `[01:37] ${p1}: Wacana doang pasti ini`, `[01:54] ${p2}: Gak ada duit woi`, `[02:11] ${p1}: Patungan lah`, `[02:28] ${p1}: Tiket pesawat mahal`] : [`[14:00] ${p2}: So are we still going to Bali?`, `[14:17] ${p1}: Definitely getting cancelled`, `[14:34] ${p1}: I have no money bro`, `[14:51] ${p2}: Lets split the bill`, `[15:08] ${p1}: Flight tickets are expensive`, `[15:25] ${p1}: Just take the train`, `[15:42] ${p2}: Train takes too long`, `[15:59] ${p1}: What else can we do`, `[16:16] ${p1}: Well think about it later`, `[16:33] ${p2}: Dont take too long`, `[16:50] ${p1}: Before it runs out`, `[17:07] ${p1}: Yeah whatever`, `[17:24] ${p2}: When are we booking?`, `[17:41] ${p1}: Next month`, `[17:58] ${p1}: It will get expensive`, `[18:15] ${p2}: That is true`, `[18:32] ${p1}: Alright lets meet tomorrow`, `[18:49] ${p1}: To discuss the holiday?`, `[19:06] ${p2}: Of course`, `[19:23] ${p1}: Lets go`, `[19:40] ${p1}: So are we still going to Bali?`, `[19:57] ${p2}: Definitely getting cancelled`, `[20:14] ${p1}: I have no money bro`, `[20:31] ${p1}: Lets split the bill`, `[20:48] ${p2}: Flight tickets are expensive`, `[21:05] ${p1}: Just take the train`, `[21:22] ${p1}: Train takes too long`, `[21:39] ${p2}: What else can we do`, `[21:56] ${p1}: Well think about it later`, `[22:13] ${p1}: Dont take too long`, `[22:30] ${p2}: Before it runs out`, `[22:47] ${p1}: Yeah whatever`, `[23:04] ${p1}: When are we booking?`, `[23:21] ${p2}: Next month`, `[23:38] ${p1}: It will get expensive`, `[23:55] ${p1}: That is true`, `[00:12] ${p2}: Alright lets meet tomorrow`, `[00:29] ${p1}: To discuss the holiday?`, `[00:46] ${p1}: Of course`, `[01:03] ${p2}: Lets go`, `[01:20] ${p1}: So are we still going to Bali?`, `[01:37] ${p1}: Definitely getting cancelled`, `[01:54] ${p2}: I have no money bro`, `[02:11] ${p1}: Lets split the bill`, `[02:28] ${p1}: Flight tickets are expensive`],
        late: isId ? [`[23:00] ${p2}: bjirr 💀`, `[23:17] ${p1}: wkwkwkwk gila`, `[23:34] ${p1}: Liat tuh kelakuannya`, `[23:51] ${p2}: Parah emang`, `[00:08] ${p1}: Ngakak guling guling`, `[00:25] ${p1}: Sampe sakit perut`, `[00:42] ${p2}: Ada ada aja kelakuannya`, `[00:59] ${p1}: Bikin emosi`, `[01:16] ${p1}: Stress gue mikirinnya`, `[01:33] ${p2}: Udah biarin aja`, `[01:50] ${p1}: Gak penting juga`, `[02:07] ${p1}: Tumben bener`, `[02:24] ${p2}: Lagi waras nih`, `[02:41] ${p1}: Tumben banget`, `[02:58] ${p1}: Kerasukan apa lu`, `[03:15] ${p2}: Sembarangan`, `[03:32] ${p1}: Yaudah tidur gih`, `[03:49] ${p1}: Ngantuk berat`, `[04:06] ${p2}: Besok kerja woi`, `[04:23] ${p1}: Iya iya bawel`, `[04:40] ${p1}: bjirr 💀`, `[04:57] ${p2}: wkwkwkwk gila`, `[05:14] ${p1}: Liat tuh kelakuannya`, `[05:31] ${p1}: Parah emang`, `[05:48] ${p2}: Ngakak guling guling`, `[06:05] ${p1}: Sampe sakit perut`, `[06:22] ${p1}: Ada ada aja kelakuannya`, `[06:39] ${p2}: Bikin emosi`, `[06:56] ${p1}: Stress gue mikirinnya`, `[07:13] ${p1}: Udah biarin aja`, `[07:30] ${p2}: Gak penting juga`, `[07:47] ${p1}: Tumben bener`, `[08:04] ${p1}: Lagi waras nih`, `[08:21] ${p2}: Tumben banget`, `[08:38] ${p1}: Kerasukan apa lu`, `[08:55] ${p1}: Sembarangan`, `[09:12] ${p2}: Yaudah tidur gih`, `[09:29] ${p1}: Ngantuk berat`, `[09:46] ${p1}: Besok kerja woi`, `[10:03] ${p2}: Iya iya bawel`, `[10:20] ${p1}: bjirr 💀`, `[10:37] ${p1}: wkwkwkwk gila`, `[10:54] ${p2}: Liat tuh kelakuannya`, `[11:11] ${p1}: Parah emang`, `[11:28] ${p1}: Ngakak guling guling`] : [`[23:00] ${p2}: bro im dead 💀`, `[23:17] ${p1}: lmaooo crazy`, `[23:34] ${p1}: Look at his behavior`, `[23:51] ${p2}: Thats crazy`, `[00:08] ${p1}: Rolling on the floor laughing`, `[00:25] ${p1}: My stomach hurts`, `[00:42] ${p2}: Always something with him`, `[00:59] ${p1}: Makes me mad`, `[01:16] ${p1}: Im stressed thinking about it`, `[01:33] ${p2}: Just leave it`, `[01:50] ${p1}: Not important anyway`, `[02:07] ${p1}: Right for once`, `[02:24] ${p2}: Im sane today`, `[02:41] ${p1}: That is rare`, `[02:58] ${p1}: What possessed you`, `[03:15] ${p2}: Whatever man`, `[03:32] ${p1}: Just go to sleep`, `[03:49] ${p1}: Im super sleepy`, `[04:06] ${p2}: Work tomorrow bro`, `[04:23] ${p1}: Yeah yeah shut up`, `[04:40] ${p1}: bro im dead 💀`, `[04:57] ${p2}: lmaooo crazy`, `[05:14] ${p1}: Look at his behavior`, `[05:31] ${p1}: Thats crazy`, `[05:48] ${p2}: Rolling on the floor laughing`, `[06:05] ${p1}: My stomach hurts`, `[06:22] ${p1}: Always something with him`, `[06:39] ${p2}: Makes me mad`, `[06:56] ${p1}: Im stressed thinking about it`, `[07:13] ${p1}: Just leave it`, `[07:30] ${p2}: Not important anyway`, `[07:47] ${p1}: Right for once`, `[08:04] ${p1}: Im sane today`, `[08:21] ${p2}: That is rare`, `[08:38] ${p1}: What possessed you`, `[08:55] ${p1}: Whatever man`, `[09:12] ${p2}: Just go to sleep`, `[09:29] ${p1}: Im super sleepy`, `[09:46] ${p1}: Work tomorrow bro`, `[10:03] ${p2}: Yeah yeah shut up`, `[10:20] ${p1}: bro im dead 💀`, `[10:37] ${p1}: lmaooo crazy`, `[10:54] ${p2}: Look at his behavior`, `[11:11] ${p1}: Thats crazy`, `[11:28] ${p1}: Rolling on the floor laughing`]
      }
    };

    const insights: GeminiInsights = {
      personality_summary: isId 
        ? `Grup ini adalah hierarki yang kejam: Kamu dan Alex sepenuhnya mendominasi 72% percakapan, mengubahnya menjadi panggung kalian berdua. Sementara itu, Kevin pada dasarnya cuma arwah penasaran yang membalas 1.200 pesan dalam setahun dengan rata-rata balas 2.800 menit (hampir dua hari). Fakta bahwa grup ini berganti nama dari "Tempat Kumpul" menjadi "Wacana Liburan" sebelum berakhir sebagai "Grup Ghibah Nasional" menceritakan kisah kegagalan kolektif yang indah.`
        : `This group is a ruthless hierarchy: You and Alex entirely dominate 72% of the conversation, turning it into your personal stage. Meanwhile, Kevin is basically a polite ghost who sent 1,200 messages all year with a response time of 2,800 minutes (almost two days). The fact that this chat renamed itself from "Vacation Planning" to "Cancelled Vacation Planning" tells a beautiful story of collective failure.`,
      roast: isId
        ? `Kamu dan Alex butuh ruangan berdua buat ngobrol. Kevin, kami bahkan tidak yakin kamu tahu grup ini masih ada.`
        : `You and Alex need to just text each other directly. Kevin, blink twice if you remember you're in this group.`,
      topics: isId ? ['Wacana Liburan', 'Ghibah', 'Kerjaan', 'Stiker Random'] : ['Cancelled Vacations', 'Gossiping', 'Work Complaining', 'Random Stickers'],
      evolution_note: isId 
        ? `Dari diskusi terstruktur di awal tahun, percakapan ini perlahan merosot menjadi kekacauan stiker dan meme TikTok.`
        : `From structured planning early on, this conversation slowly degenerated into pure chaos and TikTok links.`
    };

    return { metrics, insights };
  }
}
