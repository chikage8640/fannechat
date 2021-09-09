'use strict';

// アクティブなタブを取得する
function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true, active: true});
};

// メッセージを受信するファンクション
browser.runtime.onMessage.addListener(messageFunction);
function messageFunction(message) {
    if (message.function=="setPopup"){
        getCurrentWindowTabs().then(tabs => {
            // ポップアップをセットする
            browser.pageAction.setPopup({tabId: tabs[0].id, popup: message.file});
        });
    };
    if (message.function=="showPopup") {
        getCurrentWindowTabs().then(tabs => {
            // ポップアップを表示する
            browser.pageAction.show(tabs[0].id);
        });
    };
};