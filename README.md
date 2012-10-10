# 下からニュッとGoogleマップを表示するライブラリ

スマートフォン向けのGoogleマップ表示用ライブラリ。  
表示領域を極力邪魔しないように、ボタンクリックで下からニュッとGoogleマップが表示します。

## デモ

[SPGMaps.jsデモ](http://demo.sus-happy.net/javascript/SPGMaps2/)

## 前バージョン

以前はjQueryライブラリとして公開していました。 &raquo; [jquery.SPGMaps.js](https://github.com/sus-happy/jquery.SPGMaps.js)

## 利用方法
"SPGMaps.setAction"でタップで実行する対象を設定します。  
対象はjQueryと同じように、CSSのセレクターで設定が可能です。

    SPGMaps.setAction( "#target", { "mode":*mode*, "param":*param*, "option":*option* }

緯度・経度から検索する場合は、modeに"latlng"を与え、paramに配列で、[ 緯度, 経度 ]の順に与えます。

    SPGMaps.setAction( "#target", { "mode":"latlng", "param":[35.171388,136.881623] } );

住所から検索する場合は、modeに"address"を与え、paramに住所を与えます。

    SPGMaps.setAction( "#target", { "mode":"address", "param":"住所" } );

optionには、表示するGoogleマップの拡大率(zoom)、表示モード(type)、マーカーの表示/非表示(marker)を設定できます。  
例えば、拡大率を12、サテライト表示、マーカーを非表示にする場合。

    SPGMaps.setAction( "#target", { "mode":"address", "param":"住所", "option":{ "zoom":12, "type":google.maps.MapTypeId.SATELLITE, "marker":false } } );

のように記述します。