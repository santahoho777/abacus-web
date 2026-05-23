import { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: '第1課：認識算盤與基本指法',
    youtubeId: 'JG89_aZkvfE',
    description: '學習認識數字和位值、認識算盤的結構、四句指法口訣、以及無口訣的基本珠算練習。',
    topics: ['數字與位值', '算盤結構介紹', '指法口訣：加一二三四拇指', '無口訣珠算練習'],
    duration: '約15分鐘',
  },
  {
    id: 2,
    title: '第2課：10的組合加法口訣',
    youtubeId: 'u2P-U71S9d0',
    description: '學習10的組合加法口訣「減補數加10」，以及手指算盤的使用方法。',
    topics: ['補數的概念（1+9, 2+8, 3+7, 4+6, 5+5）', '加法口訣：減補數加10', '手指算盤：右手個位、左手十位'],
    duration: '約15分鐘',
  },
  {
    id: 3,
    title: '第3課：10的組合減法口訣',
    youtubeId: '0Y5v1PVGV0U',
    description: '學習10的組合減法口訣「減10加補數」，與加法口訣對應記憶。',
    topics: ['減法口訣：減10加補數', '加減法口訣對比練習', '手指算盤減法練習'],
    duration: '約12分鐘',
  },
  {
    id: 4,
    title: '第4課：5的組合加減法口訣',
    youtubeId: 'OGIndcgmlLk',
    description: '學習5的組合口訣：加法「減補數加5」、減法「減5加補數」，以及雙指同時撥珠的指法技巧。',
    topics: ['5的補數：1+4, 2+3', '加法口訣：減補數加5', '減法口訣：減5加補數', '雙指同時撥珠技巧'],
    duration: '約18分鐘',
  },
  {
    id: 5,
    title: '第5課：綜合口訣練習',
    youtubeId: 'I9YgRjMQj7U',
    description: '綜合運用10的組合與5的組合口訣，練習較複雜的加減法題目。',
    topics: ['口訣綜合應用', '多位數加減練習', '何時用5的口訣、何時用10的口訣'],
    duration: '約15分鐘',
  },
  {
    id: 6,
    title: '第6課：總複習',
    youtubeId: 'xTb4UUWuLAs',
    description: '複習所有學過的口訣，鞏固基礎，準備進入進階練習。',
    topics: ['所有口訣完整複習', '常見錯誤提醒', '練習速度提升技巧'],
    duration: '約15分鐘',
  },
  {
    id: 7,
    title: '第7課：珠算練習 +1 到 +100',
    youtubeId: 'GjRRs-IJpcQ',
    description: '從+1連加到+100，訓練快速撥珠和口訣反應速度。',
    topics: ['連加練習', '速度訓練', '正確使用各種口訣'],
    duration: '約20分鐘',
  },
  {
    id: 8,
    title: '第8課：從珠算到心算',
    youtubeId: '8A7pWZSO80w',
    description: '學習如何在腦中想像算盤進行心算，不需要實體算盤也能計算。',
    topics: ['心算的基本概念', '在腦中想像算盤', '珠算過渡到心算的練習方法'],
    duration: '約18分鐘',
  },
  {
    id: 9,
    title: '第9課：九九乘法表心算',
    youtubeId: 'uuSooZ0ilYE',
    description: '利用手指算盤快速計算九九乘法表，不需要死背，理解計算方法。',
    topics: ['乘法的概念', '用手指算盤算乘法', '九九乘法表快速計算'],
    duration: '約20分鐘',
  },
]

export function getLessonById(id: number): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
