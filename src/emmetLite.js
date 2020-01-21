/* emmetLite v0.1 - emmet2html https://github.com/0-v-0/emmetLite */

!function(_this, itags, tabbr, aabbr, eabbr) {
"use strict";
// two fns for counting single line nest tokens (.a>.b^.c)
function countTokens(e, r) {
	function countChar(e, r) {
		var t = 0;
		for(var l = e.length, n=0;n<l;n++) e[n] == r && t++;
		return t;
	}
	return countChar(("" + e).replace(/[^\\]?".+?[^\\]"/g, "").replace(/[^\\]?'.+?[^\\]'/g, "").replace(/[^\\]?\{.+?[^\\]\}/g, ""), r);
}
// make `^>+` out of tabs (normally emmet does nesting like ".a>.b" and unnesting like ".b^.a_sibling", now we can use tabs)
function extractTabs(e,indent) {
	function getTabLevel(e, r) {
		try {
			return e.replace(new RegExp(indent,"g"), "\t").match(/^\t+/)[0].length;
		} catch (e) {
			return 0;
		}
	}
	function repeat(e, r) {
		for (var t = ""; r > 0; r--) t += e;
		return t;
	}
	var r = null;
	return e.split("\n").map(function(t, n) {
		var o = getTabLevel(t), i = t = t.trim();
		return null != r && t && (t = o > r || t[0] == "*" ? (">" + t) : o == r ? ("+" + t) :
		o < r && (repeat("^", r - o) + t)), "" != t && (r = o + countTokens(i, ">") - countTokens(i, "^")),
		t;
	}).join("");
}
function Emmet(input, indent, f, a) {
	if (indent)
		input = extractTabs(input, indent);
	return zencode(input, f||fabbr, a||aabbr);
}
function zencode(input, fabbr, aabbr) {
	function closeTag(ret) {
		var tag = taglist.pop();
		if (tag && !/!|(area|base|br|col|embed|frame|hr|img|input|link|meta|param|source|wbr)\b/i.test(tag)) {
			tag = "</" + tag + ">"
			return ret ? tag : result.push(tag);
		}
		return "";
	}
	input = input.replace(/<!--[\S\s]*?-->/g, "");
	var s = [], buffer = "", taglist = [], grouplist = [], lastgroup = [], result = [], c, l = 0;
	var i = 0, len = input.length;
	for (; i<len; i++) {
		c = input[i];
		switch(c) {
			case "{":
				if (l >= 0)
					l++;
			break;
			case "[":
				if (l < 1)
					l--;
			break;
			case "+":
			case ">":
			case "^":
			case "(":
			case ")":
				if (!l) {
					if (buffer) {
						s.push(buffer);
						buffer = "";
					}
					s.push(c);
					c = "";
				}
			break;

			case "*":
				if (buffer && !l) {
					s.push(buffer);
					buffer = "";
				}
			break;

			case "}":
				if (l > 0) l--;
				if (!l) {
					s.push(buffer+c);
					c = buffer = "";
				}
			break;

			case "]":
				if (l < 0) l++;
			break;
		}
		if (!l && c != "*" && input[i - 1] == "}")
			s.push("+");
		buffer += c;
	}
	if (buffer)
		s.push(buffer);
	for (i=0, len=s.length; i<len; i++) {
		var set = s[i], tag = "", content = "", cls = [], attr = [""], tags = [], lasttag, n, g, prevg;
		switch(set) {
			case "^":
				lasttag = result[result.length-1];
				if (lasttag && lasttag.substring(0,2) != "</") closeTag();
				closeTag();
			case ">":
			break;
			case "+":
				if ((lasttag = result[result.length-1]) && lasttag.substring(0,2) != "</") closeTag();
			break;
			case "(":
				grouplist.push([result.length, taglist.length]);
			break;
			case ")":
				prevg = grouplist[grouplist.length-1];
				l = prevg[1];
				for (g = taglist.length; g-- > l; ) closeTag();
				lastgroup = result.slice(prevg[0]);
			break;
			default:
				if (set[n=0] == "*") {
					g = parseInt(set.substring(1))|0;
					if (lastgroup.length) {
						tags = lastgroup;
						result.length = grouplist.pop()[0];
					} else if (result.length)
						tags.push(result.pop(), closeTag(true));
					for (; n<g; n++)
						for (var r = 0, l = tags.length; r < l; r++) {
							result.push(tags[r].replace(/(\$+)(?:@(-?)(\d*))?/g, function(match, digs, direction, start){
								for (var v = ((direction == "-" ? -n: n) + (start|0 || (direction == "-" ? g-1: 0))) + "",
										d=0, dlen=digs.length-v.length; d<dlen; d++)
									v = '0' + v;
								return v;
							}));
						}
				} else {
					lastgroup.length = 0;
					tags = set.match(/(\{.+\})|(\[.+\])|([\.#]?[\w:=!\$\@\-]+)/g) || [];
					for (l = tags.length; n < l; n++) {
						buffer = tags[n];
						switch (buffer[0]) {
							case ".":
								cls.push(buffer.substring(1));
							break;
							case "#":
								attr.push('id="' + buffer.substring(1) +'"');
							break;
							case "[":
								attr.push(buffer.slice(1, -1).replace(/([^=\s]+)=([^"'\s]*)(\s|$)/g,
									function(m,a,b,c){return (aabbr[a] || a) + (b.indexOf('"') >= 0 ? "='"+b+"'" : '="'+b+'"') + c}));
							break;
							case "{":
								content = buffer.slice(1, -1);
							break;
							default:
								tag = buffer;
							break;
						}
					}
					if (cls[0])
						attr[0] = ' class="' + cls.join(" ") + '"';
					if (!content||tag||attr[1]||cls[0]) {
						tag = fabbr(tag, taglist, result);
						result.push('<' + tag + attr.join(" ") + '>' + (content || ""));
						taglist.push(tag.replace(/(!|\s)[\S\s]*/g, ""));
					}
					else
						result.push(content);
				}
		}
	}
	for (i=taglist.length; i--;) closeTag();
	return result.join("");
}

function fabbr(tag, list, result) {
	var s = tag.split(":"), t;
	if (tag = s[0])
		for (t = tag.toLowerCase();tabbr[t] && (t = tag.replace(t, tabbr[t])) != tag;) tag = t;
	return (tag || (t = list[list.length-1]) && itags[t.toLowerCase()] ||
				(t = result[result.length-1]) && itags[t.slice(1).replace(/[\s>][\S\s]*/, "").toLowerCase()] ||
		"div") + (eabbr[s[1]] || "");
}

// RequireJS && SeaJS
if ((typeof define)[0] === "f") //typeof define === "function"
	define(function() {
		return Emmet;
	});
// NodeJS
else if (typeof exports === "object")
	module.exports = Emmet;
else
	_this.Emmet = Emmet;
}(this,
{// default elements
	audio:"source",
	colgroup:"col",
	datalist:"option",
	details:"summary",
	dl:"dt",
	em:"span",
	fieldset:"legend",
	figure:"figcaption",
	frameset:"frame",
	html:"body",
	input:"input",
	label:"input",
	map:"area",
	menu:"menuitem",
	menuitem:"menuitem",
	ul:"li",
	ol:"li",
	picture:"img",
	object:"param",
	optgroup:"option",
	select:"option",
	table:"tr",
	tbody:"tr",
	thead:"tr",
	tfoot:"tr",
	tr:"td",
	video:"source",
},
{// tagname abbreviations
	"!":"!DOCTYPE html",
	ab:"abbr",
	acronym:"acr",
	adr:"address",
	ar:"area",
	arti:"article",
	asd:"aside",
	bq:"blockquote",
	btn:"button",
	colg:"colgroup",
	cap:"caption",
	cmd:"command",
	cv:"canvas",
	dat:"data",
	datg:"datagrid", datag:"datagrid",
	datl:"datalist", datal:"datalist",
	det:"details",
	dlg:"dlg",
	emb:"embed",
	fg:"figure", fig:"figure",
	fgc:"figcaption", figc:"figcaption",
	fm:"form",
	fst:"fieldset", fset:"fieldset",
	frs:"frameset",
	ftr:"footer",
	hd:"head",
	hdr:"header",
	hg:"hgroup",
	htm:"html",
	ifr:"iframe",
	inp:"input",
	kg:"keygen",
	lab:"label",
	leg:"legend",
	mi:"menuitem",
	mk:"mark",
	mn:"main",
	nos:"noscript",
	obj:"object",
	opt:"option",
	optg:"optgroup",
	out:"output",
	pic:"picture",
	pr:"pre",
	prog:"progress",
	scr:"script",
	sect:"section",
	sel:"select",
	sm:"samp",
	summ:"summary",
	sp:"span",
	src:"source",
	str:"strong",
	sty:"style",
	tab:"table",
	tbd:"tbody",
	tem:"template",
	tft:"tfoot",
	thd:"thead",
	tpl:"template",
	tra:"track", trk:"track",
	txa:"textarea",
	vid:"video",
	wb:"wbr"
},
{// attribute abbreviations
	a:"alt",
	ak:"accesskey",
	ce:"contenteditable",
	cm:"contextmenu",
	d:"dir",
	dr:"draggable",
	dz:"dropzone",
	dz:"dropzone",
	n:"name",
	h:"height",
	hid:"hidden",
	l:"lang",
	s:"style",
	sc:"spellcheck",
	t:"title",
	ti:"tabindex",
	ty:"type",
	v:"value",
	w:"width"
},
{// extended attributes
	"css":' rel="stylesheet"',
	"print":' rel="stylesheet" media="print"',
	"favicon":' rel="shortcut icon" type="image/x-icon" href="favicon.ico"',
	"touch":' rel="apple-touch-icon"',
	"rss":' rel="alternate" type="application/rss+xml" title="RSS"',
	"atom":' rel="alternate" type="application/atom+xml" title="Atom"',
	"import":' rel="import"',
	"im":' rel="import"',
	"utf":' http-equiv="Content-Type" content="text/html;charset=UTF-8"',
	"win":' http-equiv="Content-Type" content="text/html;charset=windows-1251"',
	"vp":' name="viewport"',
	"d":' disabled="disabled"',
	"hidden":' type="hidden"',
	"h":' type="hidden"',
	"text":' type="text"',
	"t":' type="text"',
	"search":' type="search"',
	"email":' type="email"',
	"url":' type="url"',
	"password, input:p":' type="password"',
	"datetime":' type="datetime"',
	"date":' type="date"',
	"datetime-local":' type="datetime-local"',
	"month":' type="month"',
	"week":' type="week"',
	"time":' type="time"',
	"tel":' type="tel"',
	"number":' type="number"',
	"color":' type="color"',
	"checkbox":' type="checkbox"',
	"c":' type="checkbox"',
	"radio":' type="radio"',
	"r":' type="radio"',
	"range":' type="range"',
	"file":' type="file"',
	"f:":' type="file"',
	"submit":' type="submit"',
	"s":' type="submit"',
	"image, input:i":' type="image"',
	"button":' type="button"',
	"b":' type="button"',
	"reset":' type="reset"',
});
