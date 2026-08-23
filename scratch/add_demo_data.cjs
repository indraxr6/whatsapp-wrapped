const fs = require('fs');

const idWords = ['kapan', 'info', 'gas', 'dimana', 'gila', 'ayo', 'nanti', 'besok', 'bisa', 'iya', 'ngga', 'wkwk', 'makan', 'tidur', 'main', 'kerja', 'capek', 'baru', 'lama', 'cepat', 'susah', 'gampang', 'bagus', 'jelek', 'sama', 'beda', 'banyak', 'dikit', 'orang', 'uang', 'waktu', 'beli', 'pulang', 'suka', 'pasti', 'malam', 'pagi', 'hari', 'jalan', 'bikin', 'rumah', 'mobil', 'motor', 'hp', 'laptop', 'baju', 'celana', 'sepatu', 'tas', 'jam', 'buku', 'pulpen', 'meja', 'kursi', 'kopi', 'teh', 'air', 'es', 'panas', 'dingin', 'hujan', 'mendung', 'terang', 'gelap', 'siang', 'sore', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu', 'januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'belas', 'puluh'];
const enWords = ['when', 'where', 'crazy', 'tonight', 'bro', 'lets', 'later', 'tomorrow', 'can', 'yeah', 'no', 'haha', 'food', 'sleep', 'play', 'work', 'tired', 'new', 'long', 'fast', 'hard', 'easy', 'good', 'bad', 'same', 'diff', 'much', 'little', 'people', 'money', 'time', 'buy', 'home', 'like', 'sure', 'night', 'morning', 'day', 'walk', 'make', 'house', 'car', 'bike', 'phone', 'laptop', 'shirt', 'pants', 'shoes', 'bag', 'watch', 'book', 'pen', 'desk', 'chair', 'coffee', 'tea', 'water', 'ice', 'hot', 'cold', 'rain', 'cloudy', 'bright', 'dark', 'noon', 'evening', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen'];

const idKeywords = idWords.map((w, i) => ({ word: w, count: 1450 - i * 14 }));
const enKeywords = enWords.map((w, i) => ({ word: w, count: 1450 - i * 14 }));

const idExcerptsEarly = [
  'Halo, salam kenal ya', 'Senang berkenalan denganmu', 'Jadi ini grup barunya', 'Mantap, siap bos',
  'Besok kumpul jam berapa?', 'Bebas, ngikut aja', 'Yang lain gimana?', 'Gas lah pokoknya',
  'Oke ntar kabarin ya', 'Sip, aman', 'Jangan lupa bawa barangnya', 'Udah disiapin kok',
  'Otw sekarang', 'Lagi di jalan nih', 'Udah sampe mana?', 'Bentaran lagi nyampe',
  'Cepetan woy', 'Sabar napa', 'Udah nunggu dari tadi', 'Maaf telat wkwk'
];
const idExcerptsMedian = [
  'Eh liburan jadi ke bali?', 'Wacana doang pasti ini', 'Gak ada duit woi', 'Patungan lah',
  'Tiket pesawat mahal', 'Pake kereta aja', 'Lama kalau kereta', 'Ya mau gimana lagi',
  'Yaudah ntar dipikirin lagi', 'Jangan lama2 mikirnya', 'Ntar keburu kehabisan', 'Iya bawel',
  'Kapan bookingnya?', 'Bulan depan aja', 'Keburu mahal ntar', 'Iya juga sih',
  'Yaudah besok kumpul', 'Bahas liburan?', 'Iya dong', 'Gas meluncur'
];
const idExcerptsLate = [
  'bjirr 💀', 'wkwkwkwk gila', 'Liat tuh kelakuannya', 'Parah emang',
  'Ngakak guling guling', 'Sampe sakit perut', 'Ada ada aja kelakuannya', 'Bikin emosi',
  'Stress gue mikirinnya', 'Udah biarin aja', 'Gak penting juga', 'Tumben bener',
  'Lagi waras nih', 'Tumben banget', 'Kerasukan apa lu', 'Sembarangan',
  'Yaudah tidur gih', 'Ngantuk berat', 'Besok kerja woi', 'Iya iya bawel'
];

const enExcerptsEarly = [
  'Hello, nice to meet you', 'Nice to meet you too', 'So this is the new group', 'Awesome, got it',
  'What time are we meeting tomorrow?', 'Anytime, I will just follow', 'What about the others?', 'Lets go then',
  'Okay let me know', 'Alright, safe', 'Dont forget to bring the stuff', 'Already prepared it',
  'On my way now', 'On the road', 'Where are you at?', 'Almost there',
  'Hurry up bro', 'Be patient', 'Been waiting for a while', 'Sorry Im late haha'
];
const enExcerptsMedian = [
  'So are we still going to Bali?', 'Definitely getting cancelled', 'I have no money bro', 'Lets split the bill',
  'Flight tickets are expensive', 'Just take the train', 'Train takes too long', 'What else can we do',
  'Well think about it later', 'Dont take too long', 'Before it runs out', 'Yeah whatever',
  'When are we booking?', 'Next month', 'It will get expensive', 'That is true',
  'Alright lets meet tomorrow', 'To discuss the holiday?', 'Of course', 'Lets go'
];
const enExcerptsLate = [
  'bro im dead 💀', 'lmaooo crazy', 'Look at his behavior', 'Thats crazy',
  'Rolling on the floor laughing', 'My stomach hurts', 'Always something with him', 'Makes me mad',
  'Im stressed thinking about it', 'Just leave it', 'Not important anyway', 'Right for once',
  'Im sane today', 'That is rare', 'What possessed you', 'Whatever man',
  'Just go to sleep', 'Im super sleepy', 'Work tomorrow bro', 'Yeah yeah shut up'
];

function generate(base, count, startHour, p1, p2) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const msg = base[i % base.length];
    const m = (i * 17) % 60;
    const h = (startHour + Math.floor((i * 17) / 60)) % 24;
    const timeStr = `[${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}]`;
    const sender = (i % 3 === 0) ? p2 : p1;
    result.push(`${timeStr} ${sender}: ${msg}`);
  }
  return result;
}

let content = fs.readFileSync('src/lib/demoData.ts', 'utf8');

const topKeywordsBlock = `      topKeywords: isId \n        ? ${JSON.stringify(idKeywords)}\n        : ${JSON.stringify(enKeywords)},`;
content = content.replace(/topKeywords: isId[\s\S]*?\],/g, topKeywordsBlock);

const excerptsDMIdEarly = generate(idExcerptsEarly, 45, 9, '${p1}', '${p2}');
const excerptsDMIdMedian = generate(idExcerptsMedian, 45, 14, '${p1}', '${p2}');
const excerptsDMIdLate = generate(idExcerptsLate, 45, 23, '${p1}', '${p2}');

const excerptsDMEnEarly = generate(enExcerptsEarly, 45, 9, '${p1}', '${p2}');
const excerptsDMEnMedian = generate(enExcerptsMedian, 45, 14, '${p1}', '${p2}');
const excerptsDMEnLate = generate(enExcerptsLate, 45, 23, '${p1}', '${p2}');

function replaceExcerptsBlock(content, isGroup) {
  const regex = /sampleExcerpts:\s*\{[\s\S]*?\}/g;
  let matches = [...content.matchAll(regex)];
  let targetMatch = isGroup ? matches[1] : matches[0];
  
  if (targetMatch) {
    const replacement = `sampleExcerpts: {
        early: isId ? [${excerptsDMIdEarly.map(x => '`' + x + '`').join(', ')}] : [${excerptsDMEnEarly.map(x => '`' + x + '`').join(', ')}],
        median: isId ? [${excerptsDMIdMedian.map(x => '`' + x + '`').join(', ')}] : [${excerptsDMEnMedian.map(x => '`' + x + '`').join(', ')}],
        late: isId ? [${excerptsDMIdLate.map(x => '`' + x + '`').join(', ')}] : [${excerptsDMEnLate.map(x => '`' + x + '`').join(', ')}]
      }`;
    return content.substring(0, targetMatch.index) + replacement + content.substring(targetMatch.index + targetMatch[0].length);
  }
  return content;
}

content = replaceExcerptsBlock(content, false);
content = replaceExcerptsBlock(content, true);

fs.writeFileSync('src/lib/demoData.ts', content);
console.log('done');
