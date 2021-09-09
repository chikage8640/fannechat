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
    if (message.function=="hidePopup") {
        getCurrentWindowTabs().then(tabs => {
            // ポップアップを非表示にする
            browser.pageAction.hide(tabs[0].id);
        });
    };
};

// アドレスバーボタンを消す
browser.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status == 'complete' && tab.url.indexOf('youtube.com/live_chat') !== -1 || tab.url.indexOf('youtube.com/watch') !== -1) {
            // ポップアップをセットする
            browser.pageAction.setPopup({tabId: tabId, popup: "/popup.html"});
            // ポップアップを表示する
            browser.pageAction.show(tabId);
    };
    if (info.status == 'loading') {
            // ポップアップを非表示にする
            browser.pageAction.hide(tabId);
    };
});

