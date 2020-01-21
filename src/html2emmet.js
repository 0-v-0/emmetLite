/* emmetLite v0.1 - html2emmet https://github.com/0-v-0/emmetLite */
// Edited from https://github.com/rfxDarth/html-to-emmet
!function(o, tabbr, aabbr, itags) {
	"use strict";
function EmmetTab(s, indent) {
	//indent = indent || "\t";
	s=s.replace(/[\+>\^\(\)]/g,"(>_<)$&").split("(>_<)");
	for(var shift = ['\n'], l = s.length, i = 0,
		deep = 0, str = "", t, f = [], c, o; i < 200; i++)
		shift.push(shift[i]+indent);
	for(i = 0; i < l; i++) {
		t = s[i].slice(1);
		c=s[i][0];
		str +=
		c == "(" ?
			(f.push(deep), t ? shift[deep]+t : "") :
		c == ")" ?
			(deep = f.pop(), t ? shift[deep]+t : "") :
		c == ">" ?
			o ? (o=!1,s[i]) :
			(deep++, t ? shift[deep]+t : "") :
		c == "+" ?
			t ? shift[deep]+t : "" :
		c == "^" ? (deep--,
			t ? shift[deep]+t : "") :
		(o = c == "<", s[i]);
	}
	return str[0] == '\n' ? str.slice(1) : str;
}
	var abbr = {}, aab = {}, x;
	for(x in tabbr)
		abbr[tabbr[x]]=x;
	for(x in aabbr)
		aab[aabbr[x]]=x;
function recursive(elem, parent) {
	var str = "", tag = elem.tagName, i, len, flag, children, val;
	if (tag) {
		tag = tag.toLowerCase();
		flag = elem.hasAttributes();
		if (tag != (itags[parent] || "div") || !flag)
			str += abbr[val = elem.tagName] || val;

		if (elem.id)
			str += "#" + elem.id;
		val = elem.className.trim();
		if (val.length)
			str += "." + elem.className.replace(/\s+/,".");

		if (flag) {
			var attrs = elem.attributes, attr;

			for (i = 0, len = attrs.length; i < len; i++) {
				attr = attrs[i];
				if (!/\b(class|id)\b/.test(attr.name)) {
					if (flag) {
						str += "[";
						flag = false;
					}
					else str += " ";
					str += aab[val = attr.name] || val;
					if (val = attr.value)
						str += val.search(/\s/) >= 0 ? '="' + val + '"'
							: "=" + val;
				}
			}

			if (!flag) str += "]";
		}

		children = elem.childNodes;
		len = children.length;
		var childRets = [], ch, c;
		if (len > 0) {
			for (i = 0; i < len; i++) {
				ch = children[i];
				c = ch.nodeType;
				if (c != 1) {
					val = ch.nodeValue.trim();
					if ((c == 3 || c == 8) && val.length) {
						var min = ch = 0, j;
						flag = tag == "script";
						val = val.replace(/\r?\n/g, flag ? "" : "<br>")
						for (j = 0; j < val.length; j++) {
							if (val[j] == "{") ch++;
							else if (val[j] == "}") ch--;
							else
								continue;
							if(ch < min) min = ch;
							if(ch > max) max = ch;
						}
						val = (c == 8 ? "*{" : "{").repeat(1-min) + val;
						if(ch) val += (flag ? "//" : "<!--") + "}".repeat(ch) + "-->";
						childRets.push(val + "}");
					}
					else
						continue;
				}
				if (ch = recursive(ch, tag))
					childRets.push(ch);
			}
		}
		else if (elem.content && (ch = recursive(elem.content, tag))) //template
			childRets.push(ch);
		len = childRets.length;
		if (len) {
			if (childRets[0][0] != "{") str += ">";
			str += childRets.join("+") + "^";
			/*for (i = 0; i < len; ) {
				str += val = childRets[i];
				if(++i != len)
					str += val.slice(-1) == "}" ? ">" : "+";
			}*/
		}
	}
	return str; //TODO: Remove this hack
}
o.html2emmet = function(elem, indent) {
	var e = elem;
	if (e.split)
		e = new DOMParser().parseFromString(elem, 'text/xml').childNodes[0];
	e = recursive(e).replace(/\n/g, "").replace(/\}\^/g, "}").replace(/\^\+|\+\^|>\^/g, "^").replace(/\^+$/,"");
	return indent ? EmmetTab(e, indent) : e;
}
}(this,
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
{//attribute abbreviations
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
});