-- =============================================
-- FiveM YouTube Car Music Script (Standalone)
-- 車両に乗っているときだけ /ytmusic で右下に小さなUI表示
-- YouTubeリンクを貼り付けて → 再生 / 一時停止 / 他の曲に変更 可能
-- YouTube IFrame Player API 使用（音声のみ再生）
-- YouTubeの規約上サーバー内での利用は自己責任となります
-- =============================================

fx_version 'cerulean'
game 'gta5'

author '46kuri'
description '車両内で使えるYouTube音楽プレイヤー。使うのをやめる際は×ボタンか同じコマンドを入力してください'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/script.js',
    'html/style.css'
}

client_script 'client.lua'