export default function convertISOToDateString(isoString) {
    const date = new Date(isoString); // ISO 8601形式の文字列をDateオブジェクトに変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を2桁にパディング
    const day = String(date.getDate()).padStart(2, '0'); // 日を2桁にパディング
    return `${year}-${month}-${day}`; // "YYYY-MM-DD"形式の文字列を返す
  }