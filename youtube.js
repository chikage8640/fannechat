'use strict';

// 翻訳apiのURL
let translaterUrl = "https://script.google.com/macros/s/AKfycby3K3Tu1Pl1A2eEWdwKlwnJ3KtwapscfW58uYaV5DuFAqkBMlesH_kKGzrfa4XfS14g/exec";
// 翻訳先言語
let targetLang = "";

// 設定読み込み
function onError(error) {
    console.log(`Error: ${error}`);
};
  
function onGot(item) {
    if (item.apiUrl) {
        translaterUrl = item.apiUrl;
    };
    if (item.target) {
        targetLang = item.target;
    };
    runTranslateService();
};

let getting = browser.storage.local.get(["apiUrl", "target"]);
getting.then(onGot, onError);

function runTranslateService() {
    // 監視ターゲットの取得
    const target = document.querySelector("div#items.style-scope.yt-live-chat-item-list-renderer");

    // すでにあるコメントの翻訳
    target.querySelectorAll("yt-live-chat-text-message-renderer").forEach( (node) => {
        nodeTranslater(node);
    });

    // オブザーバインスタンスを作成
    const observer = new MutationObserver((mutations) => {
        mutations.forEach( mutation => {
            mutation.addedNodes.forEach( node => {
                nodeTranslater(node)
            });
        });
    });

    // オブザーバの設定
    const config = {
        childList: true
    };

    // 対象ノードとオブザーバの設定を渡す
    observer.observe(target, config);

    // ノードの翻訳を下準備する
    function nodeTranslater(node) {
        // コメントであるかのチェック
        if (node.tagName === "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
            // 翻訳するノードの取り出し
            let messageNode = node.childNodes.item(2).childNodes.item(3);
            messageNode.childNodes.forEach( node => {
                // テキストだけ翻訳にかける
                if (node.nodeName === "#text") {
                    // 翻訳にかける
                    nodeTranslate(node);
                };
            });
        };
    };


    // ノードごとほおりこむと翻訳される
    function nodeTranslate(node) {
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

        fetch(translaterUrl, param)
            .then((res)=>{
                return(res.json());
            })
            .then((jsonRes)=>{
                node.nodeValue = jsonRes.text;
            });
    };
};