# emmetLite

A javascript toolkit implemented emmet2html and html2emmet.  
一个emmet和html互转的轻量级js工具集

# Features
- Full Emmet syntax support.
- Added extension syntax, Supported custom default elements, custom tagname abbreviations, custom attribute abbreviations and custom extended attributes (through `fabbr` and `aabbr` parameters).
- emmet2html contains only string operations and no DOM operations, so it has excellent performance and can be loaded asynchronously.
- hmmet2html is only 5.5KB，html2emmet is only 3.1KB.

# 特性
- 完整的emmet语法支持
- 添加了扩展语法，支持自定义默认元素、自定义标签名缩写、自定义属性缩写、自定义扩展属性（通过`fabbr`和`aabbr`参数）
- emmet2html 仅含字符串操作，不含任何DOM操作，因此拥有极好的性能，可异步加载
- emmet2html 仅 5.5KB，html2emmet 仅 3.1KB

# 安装 Installation
emmet2html:
```html
<script src="emmetLite.min.js"></script>
```
html2emmet:
```html
<script src="html2emmet.min.js"></script>
```

# 语法 Syntax
[here](./Syntax.md)

# 用法 Usage
emmet2html:
```js
string Emmet(string s, [string indent = null], [function fabbr = (default function)], [object aabbr = (default config)])
```
Parameters:
- `s`: emmet string
- `indent`: If null, use the original emmet format. Otherwise, use the indented format with `indent` as a indent unit.
- `fabbr`: Custom abbreviation function.
- `aabbr`: Custom attribute abbreviation table.  
参数：
- `s`: emmet字符串
- `indent`: 为空使用原始emmet格式，否则使用以`indent`为缩进单位的缩进格式
- `fabbr`: 自定义缩写函数
- `aabbr`: 自定义属性缩写表  
ex:
```js
Emmet(".a>p") //<div class="a"><p></p></div>
Emmet(`!
html
  head
    link:favicon
  ~
    h1{Hello world!}
`,'  ')
//<!DOCTYPE html><html><head><link rel="shortcut icon" type="image/x-icon" href="favicon.ico"></head><body><h1>Hello world!</h1></body></html>
```
html2emmet:（参数说明同上）
```js
string html2emmet(string s, [string indent = '\t'])
// ex:
html2emmet('<div><p></p></div>')
//结果： div>p
html2emmet('<html><head><link rel="shortcut icon" type="image/x-icon" href="favicon.ico" /></head><body><h1>Hello world!</h1></body></html>',"\t")
```
结果：
```
htm
	hd
		link[rel="shortcut icon" ty=image/x-icon href=favicon.ico]
	body
		h1{Hello world!}
```
It uses abbreviations by default. You can disable abbreviations by editing the abbreviation table in html2emmet.js.  

默认使用缩写，可通过编辑html2emmet.js里的缩写表来禁用缩写  
配合模板引擎，能更好的玩耍哦~
