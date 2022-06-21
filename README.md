# Slack勤怠管理システム
Qiitaに記事公開しています。ご覧いただければ幸いです。  
https://qiita.com/RyoSakon001/items/b3fd2f7c446b3ad96dfa  

・slackの「Outgoing Webhook」を用いて、Googleスプレッドシートにタイムスタンプを打刻するシステムです。  
・「おはよう」「お疲れ」などのキーワードをトリガーとし、自動的に出勤時刻、退勤時刻を記録できます。  
・毎年１月１日になったら、スプレッドシートを交換してください。  

・「Outgoing Webhook」の設定方法は、こちらをどうぞ。  
https://zenn.dev/osayubot/articles/b68947d2a53790  
https://qiita.com/tacos_salad/items/9fe997a34cebc8fcef39  


# 使用言語について
・Gas(Google App Script)という言語を使用しています。  
・文法は、JavaScriptとほぼ同じです。  
