
var _url_effect = "/cgi-bin/effect";
var _url_effect_set_karaoke = "/cgi-bin/effect_set_karaoke";
var _url_effect_set_none = "/cgi-bin/effect_set_none";

var _re_effect = new RegExp("^(.*)=\"(.*)\"");
var req_effect = new Kaemu._httpRequest();
var _row_separator = "\n" ;

function update_effect() {
	req_effect.load(_url_effect);
}

function set_effect_karaoke() {
	req_effect.load(_url_effect_set_karaoke);
}

function set_effect_none() {
	req_effect.load(_url_effect_set_none);
}

config_effect = true;
