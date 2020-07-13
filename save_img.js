function _pack(num, len) {
    var o = [], len = ((typeof len == "undefined") ? 4 : len);
    for (var i = 0; i < len; i++) {
        o.push(String.fromCharCode((num >> (i * 8)) & 0xff));
    }
    return o.join("");
}

function base64Img2Blob(code) {
	var parts = code.split(';base64,');
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;
	var uInt8Array = new Uint8Array(rawLength);
	for (var i = 0; i < rawLength; ++i) {
	  uInt8Array[i] = raw.charCodeAt(i);
	}
	return new Blob([uInt8Array], {type: contentType}); 
}

function downloadFile(fileName, content) {
	var aLink = document.createElement('a');
	var blob = base64Img2Blob(content); //new Blob([content]);
	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }
	else {
		aLink.download = fileName;
		aLink.href = URL.createObjectURL(blob);
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("click", false, false);
		aLink.dispatchEvent(evt);
	}	
}

$("idSaveCanvas").onclick = function() {
	$("idDialog2").style.top = "150px";
	$("idDialog2").style.left = "350px";
	$("idDialog2").style.display = "block";
}

$("idCloseButton2").onclick = function() {
	$("idDialog2").style.display = "none";
}

$("idButton2").onclick = function() {
	var fileName = $("idInput2").value;
	if(fileName == "")
		fileName = "default";
	fileName += ".bmp";
	// 一行原来的字节数
	var row_bits = canvasWidth * 3;
	var add_bits = 0;
	// 为了4字节对齐，每行需要的字节数
	for(; (row_bits & 0x3) != 0; row_bits++, add_bits++);
	var imgdatasize = row_bits * canvasHeight;
	var DIBheaderSize = 40;
	var pixeloffset = 14 + DIBheaderSize;
	var fileSize = pixeloffset + imgdatasize;
	var data = [
	/* BMP HEADER, 14 Bytes*/
		"BM",					// magic number, 2 Bytes
		_pack(fileSize),		// size of file, 4 Bytes
		"\x00\x00\x00\x00",		// unused, 4 Bytes
		_pack(pixeloffset),		// number of bytes until pixel data, 4 Bytes
	/* DIB HEADER, 40 Bytes*/
		_pack(DIBheaderSize),	// number of bytes left in the header, 4 Bytes
		_pack(canvasWidth),		// width of pixmap, 4 Bytes
		_pack(canvasHeight),	// height of pixmap, 4 Bytes
		"\x01\x00",				// number of colour planes, must be 1, 2 Bytes
		_pack(24, 2),			// bits per pixel，2 Bytes
		"\x00\x00\x00\x00",		// BI_BITFIELDS，4 Bytes
		_pack(imgdatasize),		// size of raw BMP data (after the header)，4 Bytes
		"\x00\x00\x00\x00",		// # pixels per metre horizontal res，4 Bytes
		"\x00\x00\x00\x00",		// # pixels per metre vertical res，4 Bytes
		"\x00\x00\x00\x00",		// num colours in palette，4 Bytes
		"\x00\x00\x00\x00",		// all colours are important，4 Bytes

		// END OF HEADER
	];
	var pos = (canvasHeight - 1) * canvasWidth * 4;
	var backoffset = 2 * canvasWidth * 4;
	for(var i = 0; i < canvasHeight; i++) {
		for(var j = 0; j < canvasWidth; j++, pos += 4) {
			var tmp;
			// 透明
			if(canvasData.data[pos + 3] == 0)
				tmp = String.fromCharCode(255, 255, 255);
			else
				tmp = String.fromCharCode(canvasData.data[pos + 2], canvasData.data[pos + 1], canvasData.data[pos]);
			data.push(tmp);
		}
		for(var j = 0; j < add_bits; j++)
			data.push(String.fromCharCode(0));
		pos -= backoffset;
	}
	var a = data.join("");
	downloadFile(fileName, "data:" + "image/bmp" + ";base64," + window.btoa(a));
	$("idDialog2").style.display = "none";
}