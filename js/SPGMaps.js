/* ---------------------------------------------
 * SPGMaps.js
 * 下からニュッとGoogleMapを表示するライブラリ
 * Created By SUSH
 -------------------------------------------- */
var SPGMaps = {
	"win"	: document.createElement('div'),
	"size"	: new Object,
	"map"	: null,
	"flag"	: false,
	"address"	: null,
	"controller": new Array
};

/*
 * 初期設定
 **/
SPGMaps.init = function() {
	SPGMaps.flag = true;
	SPGMaps.win.style.position = "absolute";
	SPGMaps.win.style.left = 0;
	SPGMaps.win.style.top = 0;
	SPGMaps.win.style.background = '#fff';
	SPGMaps.win.style.width = '100%';
	SPGMaps.win.style.transition = 'transform 200ms ease-out';
	SPGMaps.win.style.OTransition = 'transform 200ms ease-out';
	SPGMaps.win.style.msTransition = 'transform 200ms ease-out';
	SPGMaps.win.style.MozTransition = 'transform 200ms ease-out';
	SPGMaps.win.style.webkitTransition = '-webkit-transform 200ms ease-out';
}

SPGMaps.setAction = function( target, option ) {
	var eventTarget = document.querySelector( target );
	if( eventTarget ) {
		var action = function() {
			switch( option.mode ) {
				case 'latlng':
					SPGMaps.startLatLng( option.param[0], option.param[1], option.option );
				break;
				case 'address':
					SPGMaps.startAddress( option.param, option.option );
				break;
			}
			return false;
		};
		if(eventTarget.addEventListener){
			eventTarget.addEventListener("click", action, false);
		}else if(eventTarget.attachEvent){
			eventTarget.attachEvent("onclick", action );
		}
	}
}

SPGMaps.extend = function( source, merge ) {
	for (var i in source) {
		source[i] = typeof( merge[i] ) != 'undefined' ? merge[i] : source[i];
	}
	return source;
}

/*
 * 住所からGoogleMapsの位置を指定する
 * address : マーカーの住所
 * option : GoogleMaps表示オプション
 **/
SPGMaps.startAddress = function( address, option ) {
	if(! SPGMaps.flag ) return false;
	else SPGMaps.flag = false;

	var iopt = {
		"zoom" : 19,
		"type" : google.maps.MapTypeId.ROADMAP,
		"marker": true
	};
	if(option) SPGMaps.extend( iopt, option );

	SPGMaps.viewWindow();
	if( SPGMaps.address != address ) {
		
		SPGMaps.address = address;
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				SPGMaps.result = results[0];
				makeAddresMaps( SPGMaps.result );
			} else {
				// alert("Geocode was not successful for the following reason: " + status);
			}
		});
	} else {
		makeAddresMaps( SPGMaps.result );
	}

	function makeAddresMaps( result ) {
		SPGMaps.map = null;
		var myOptions = {
			zoom: iopt.zoom,
			center: result.geometry.location,
			mapTypeId: iopt.type,
			navigationControl: true,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL,
				position: google.maps.ControlPosition.LEFT_TOP
			}
		};
		SPGMaps.map = new google.maps.Map(SPGMaps.win, myOptions);
		
		if( iopt.marker ) {
			var marker = new google.maps.Marker({
				map: SPGMaps.map, 
				position: result.geometry.location
			});
		}
		
		SPGMaps.contorollerInit();
	}
}

/*
 * 緯度・経度からGoogleMapsの位置を指定する
 * lat : 緯度
 * lng : 経度
 * option : GoogleMaps表示オプション
 **/
SPGMaps.startLatLng = function( lat, lng, option ) {
	if(! SPGMaps.flag ) return false;
	else SPGMaps.flag = false;
	
	var latlng = new google.maps.LatLng( lat, lng );
	if(! latlng ) return false;

	// ニュッと出す
	SPGMaps.viewWindow();

	// マップ表示オプション設定
	var iopt = {
		"zoom" : 19,
		"type" : google.maps.MapTypeId.ROADMAP,
		"marker": true
	};
	if(option) SPGMaps.extend( iopt, option );
	
	SPGMaps.map = null;
	var myOptions = {
		zoom: iopt.zoom,
		center: latlng,
		mapTypeId: iopt.type,
		navigationControl: true,
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL,
			position: google.maps.ControlPosition.LEFT_TOP
		}
	};
	// GoogleMaps設定
	SPGMaps.map = new google.maps.Map(SPGMaps.win, myOptions);
	
	// マーカー表示
	// オプション markser がfalseの場合は非表示
	if( iopt.marker ) {
		var marker = new google.maps.Marker({
			map: SPGMaps.map, 
			position: latlng
		});
	}
	
	SPGMaps.contorollerInit();
}

/*
 * 下からニュッと表示する
 **/
SPGMaps.viewWindow = function() {
	SPGMaps.resize();
	SPGMaps.win.style.transform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.OTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.msTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.MozTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.webkitTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";

	SPGMaps.bodyOverFlow = document.body.style.overflow;
	document.body.style.overflow = 'hidden';
	document.body.appendChild( SPGMaps.win );

	window.onresize = SPGMaps.resize;
	setTimeout( function() {
		SPGMaps.win.style.transform = "translate3d(0,0,0)";
		SPGMaps.win.style.OTransform = "translate3d(0,0,0)";
		SPGMaps.win.style.msTransform = "translate3d(0,0,0)";
		SPGMaps.win.style.MozTransform = "translate3d(0,0,0)";
		SPGMaps.win.style.webkitTransform = "translate3d(0,0,0)";
	}, 1 );
}

/*
 * 下へニュッと隠す
 **/
SPGMaps.end = function() {
	SPGMaps.win.style.transform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.OTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.msTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.MozTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";
	SPGMaps.win.style.webkitTransform = "translate3d(0px,"+SPGMaps.size.height+"px,0)";

	setTimeout( function() {
		document.body.removeChild( SPGMaps.win );
		SPGMaps.flag = true;
		window.onresize = null;
		document.body.style.overflow = SPGMaps.bodyOverFlow;
	}, 200 );
}

/*
 * ウィンドウ全面に合わせる
 **/
SPGMaps.resize = function() {
	window.scrollTo(0, 0);
	SPGMaps.size = {
		"width":(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth),
		"height":(window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)
	};
	SPGMaps.win.style.height = SPGMaps.size.height+'px';
}

/*
 * ユーザーコントローラーを追加する
 * startAddress、startLatLngより前に記述する
 **/
SPGMaps.insertContoroller = function( controller, index, position ) {
	var result = document.createElement("div");
	var cotrol = new controller( result, SPGMaps.map );
	result.index = index;
	if( SPGMaps.map ) {
		return false;
	}
	SPGMaps.controller.push({
		"result"	: result,
		"position"	: position
	});
	return result;
}
/*
 * GoogleMaps生成後コントローラーを追加
 **/
SPGMaps.contorollerInit = function() {
	if( SPGMaps.controller.length ) {
		while( SPGMaps.controller.length ) {
			var c = SPGMaps.controller.shift();
			SPGMaps.map.controls[c.position].push( c.result );
		}
	} else {
		var SPGMapsClose = function( controlDiv, map ){
			var UI = document.createElement("div");
			UI.style.padding = "2px 5px";
			UI.style.border = "1px solid #666";
			UI.style.background = "#fff";
			UI.style.font = "12px/1.6 verdana";
			UI.innerText = "CLOSE";
			controlDiv.style.padding = "15px";
			controlDiv.appendChild( UI );
			google.maps.event.addDomListener(UI, 'click', function() {
				SPGMaps.end();
			});
		}
		var wrap = document.createElement("div");
		var cotrol = new SPGMapsClose( wrap, SPGMaps.map );
		wrap.index = 1;
		SPGMaps.map.controls[ google.maps.ControlPosition.TOP_LEFT ].push( wrap );
	}
}

window.onload = SPGMaps.init;