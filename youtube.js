'use strict';
// 翻訳apiのURL
let translaterUrl = "https://script.google.com/macros/s/AKfycby3K3Tu1Pl1A2eEWdwKlwnJ3KtwapscfW58uYaV5DuFAqkBMlesH_kKGzrfa4XfS14g/exec";
// 翻訳する言語
let targetLang;
// 翻訳するノード
let target;
// 翻訳するチャット欄のあるフレーム
let targetFrame;
// 翻訳の監視が走っているかの値
let observerRan = false;

// 設定読み込み
function onError(error) {
    console.log(`Error: ${error}`);
};
  
function onGot(item) {
    if (item.apiUrl) {
        translaterUrl = item.apiUrl;
    };
};

let getting = browser.storage.local.get(["apiUrl", "target"]);
getting.then(onGot, onError);

// 指示の待機
browser.runtime.onMessage.addListener(messageFunction);
function messageFunction(message) {
    // 開始の指示
    if (message.function=="runTranslateService") {
        targetLang = message.target
        runTranslateService();
    };
    // 停止の指示
    if (message.function=="stopTranslateService") {
        stopTranslateService()
    };
};

// ユーザーにボタンを表示
browser.runtime.sendMessage({
    "function": "setPopup",
    "file": "/popup.html"
});
browser.runtime.sendMessage({"function": "showPopup"});

async function runTranslateService() {
    if (observerRan==true) {
        console.log("runTranslateServiceの多重呼び出しがかかりました。");
        return;
    };
    // 監視ターゲットの取得
    target = document.querySelector("div#items.style-scope.yt-live-chat-item-list-renderer");
    targetFrame = document.getElementById("chatframe");
    // 監視ターゲットが見つからない場合
    if (target==null) {
        // iframeの中にある可能性があるので確認
        // それでもなかったら
        if (targetFrame==null) {
            alert("ページ内にチャットウィンドウが見つかりませんでした。");
            browser.runtime.sendMessage({
                "function": "setPopup",
                "file": "/popup.html"
            });
            return;
        }else{
            target = targetFrame.contentWindow.document.querySelector("div#items.style-scope.yt-live-chat-item-list-renderer");
            // チャットウィンドウはあるが読み込まれていない場合
            if (target==null){
                alert("ページ内にチャットウィンドウは見つかりましたが、読み込まれていません。チャットを表示してから再試行してください。");
                browser.runtime.sendMessage({
                    "function": "setPopup",
                    "file": "/popup.html"
                });
                return;
            };
        };
    };

    // すでにあるコメントの翻訳
    const alreadyMessages = target.querySelectorAll("yt-live-chat-text-message-renderer")
    for (var i = 0; i < alreadyMessages.length; i++) {
        await nodeTranslater(alreadyMessages[i]);
    };

    // 対象ノードとオブザーバの設定を渡す
    observer.observe(target, config);
    // 走らせたフラグを立てる
    observerRan = true;
};

// 翻訳終了の処理
function stopTranslateService() {
    if (observerRan==false) {
        console.log("stopTranslateServiceの多重呼び出しがかかりました。");
        return;
    };
    // オブザーバーインスタンスの停止
    observer.disconnect();
    observerRan = false;
    // チャット欄の再読み込み
    if (targetFrame=null) {
        location.reload();
    }else{
        document.getElementById("chatframe").contentWindow.location.reload();
    };
};

// オブザーバインスタンスを作成
const observer = new MutationObserver((mutations) => {
    mutations.forEach(async(mutation) => {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            await nodeTranslater(mutation.addedNodes[i]);
        };
    });
});

// オブザーバの設定
const config = {
    childList: true
};

// ノードの翻訳を下準備する
async function nodeTranslater(node) {
    // コメントであるかのチェック
    if (node.tagName === "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
        // 翻訳するノードの取り出し
        let messageNode = node.childNodes.item(2).childNodes.item(3);
        messageNode.childNodes.forEach( async(node) => {
            // テキストだけ翻訳にかける
            if (node.nodeName === "#text") {
                // 翻訳にかける
                await nodeTranslate(node);
            };
        });
    };
};

// ノードごとほおりこむと翻訳される
async function nodeTranslate(node) {
    // 翻訳する

    // 送るデータ
    const data = {
        text: node.nodeValue,
        target: targetLang
    };

    // FetchAPIのオプション
    const param  = {
        method: "POST",
        headers: {
        "Content-Type": "application/json; charset=utf-8"
        },
    
        // リクエストボディ
        body: JSON.stringify(data)
    };

    const translatedText = await (await fetch(translaterUrl, param)).json();

    try{
        node.nodeValue = await translatedText.text;
    }catch{
        console.log("Target node has already dead.(nodeTranslate)");
    };
};