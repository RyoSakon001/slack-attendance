function doPost(e) {
  const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxx"); // スプレッドシートのURL 
  const sheet = ss.getSheetByName(e.parameter.user_id); // スプレッドシートのシート名もslackのuser_idにしておくこと
  const token = 'token'; // Slack Outgoing Webhookの値を設定する

  if (token !== e.parameter.token) return; // token値が一致していない場合は打刻を行わない

  let category = e.parameter.trigger_word;

  const startArr = ['おはよう', ':おはようございます:']; // コロンで囲まれているものはSlackのスタンプを表す
  const finishArr = ['お疲れ', ':おつです:', ':お疲れさまです:'];
  if (startArr.indexOf(category) >= 0) category = '出勤';
  if (finishArr.indexOf(category) >= 0) category = '退勤';

  let lastRow = sheet.getLastRow();
  let addRow = lastRow;

  if (sheet.getRange(addRow, 7).isBlank() === false) addRow++; // 「退勤」に打刻されていれば、新しい行に追加する

  const datetime = new Date();
  let timeArr = {
    'year': datetime.getFullYear(),
    'month': datetime.getMonth() + 1,
    'date': datetime.getDate(),
    '出勤': sheet.getRange(addRow, 4).getValue(),
    '離席': sheet.getRange(addRow, 5).getValue(),
    '再開': sheet.getRange(addRow, 6).getValue(),
    '退勤': sheet.getRange(addRow, 7).getValue(),
  };

  // 例：8時→08の後ろから２文字,17時→017の後ろから２文字
  timeArr[category] = (('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2));

  // 列番号を割り振らないと、シートに書き込みができないため。
  array = [[timeArr['year'],timeArr['month'],timeArr['date'],timeArr['出勤'],timeArr['離席'],timeArr['再開'],timeArr['退勤']]];
  sheet.getRange(addRow,1,1,7).setValues(array); // 行番号,列番号,行数,列数

  // 「退勤」に打刻されていれば、勤務時間・残業時間を計算する
  if (category === '退勤') {

    let workingHours = (Number(timeArr['退勤'].slice(0,2)) - Number(timeArr['出勤'].slice(0,2)) + Number(timeArr['再開'].slice(0,2)) - Number(timeArr['離席'].slice(0,2)));
    let workingMinutes = (Number(timeArr['退勤'].slice(-2))- Number(timeArr['出勤'].slice(-2))+ Number(timeArr['再開'].slice(-2))- Number(timeArr['離席'].slice(-2)));

    if (workingHours >= 4) workingHours--; // 4時間以上勤務していれば、昼休み１時間を付与
    if (workingMinutes < 0) {
      workingHours--;
      workingMinutes += 60;
    };

    timeArr['実勤務時間'] = ('0' + workingHours.toString()).slice(-2) + ':' + ('0' + workingMinutes.toString()).slice(-2);
    timeArr['残業時間'] = workingHours * 60 + workingMinutes - 450; // 残業時間＝実勤務時間ー７時間半（４５０分）
    sheet.getRange(addRow,8,1,2).setValues([[timeArr['実勤務時間'], timeArr['残業時間']]]); // 行番号,列番号,行数,列数
  }

  return;
}