/**
 * 食事の欠食情報をテキストに変換する関数
 * @param meals 食事配列: [朝食, 夕食] の順番で、trueが欠食、falseが食事あり
 * @returns 欠食情報のテキスト表現
 */
export function getMealText(meals: boolean[]): string {
  if (!meals || meals.length < 2) return '欠食しない'

  const [breakfast, dinner] = meals

  if (!breakfast && !dinner) {
    return '欠食しない'
  } else if (breakfast && dinner) {
    return '朝と夕'
  } else if (breakfast && !dinner) {
    return '朝のみ'
  } else if (!breakfast && dinner) {
    return '夕のみ'
  }

  return '欠食しない'
}
