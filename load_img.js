$("idOpenCanvas").onclick = function() {
	$("idFileInput").click();
}

function loadFile() {
	var fileobj = $("idFileInput");
	var resultFile = fileobj.files[0];
	if (resultFile) {
		var reader = new FileReader();
		//异步方式，不会影响主线程
		reader.readAsArrayBuffer(resultFile);

		reader.onload = function(e) {
			var data = this.result;
			var view = new Uint8Array(data);
			if(view[0] != 0x42 || view[1] != 0x4d)
				return;
			// 只支持24位
			if(view[28] != 0x18 || view[29] != 0x00)
				return;

			cv.width = (view[21] << 24) | (view[20] << 16) | (view[19] << 8) | (view[18] & 0xff);
			cv.height = (view[25] << 24) | (view[24] << 16) | (view[23] << 8) | (view[22] & 0xff);
			canvasWidth = cv.width;
			canvasHeight = cv.height;
			canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
			
			// 一行原来的字节数
			var row_bits = canvasWidth * 3;
			var add_bits = 0;
			// 为了4字节对齐，每行需要的字节数
			for(; (row_bits & 0x3) != 0; row_bits++, add_bits++);
			var pos = (canvasHeight - 1) * canvasWidth * 4;
			var pos_ip = (view[13] << 24) | (view[12] << 16) | (view[11] << 8) | (view[10] & 0xff);
			var backoffset = 2 * canvasWidth * 4;
			for(var i = 0; i < canvasHeight; i++) {
				for(var j = 0; j < canvasWidth; j++, pos += 4, pos_ip += 3) {
					if(view[pos_ip] == 0xff && view[pos_ip + 1] == 0xff && view[pos_ip + 2] == 0xff) {
						canvasData.data[pos] = 0;
						canvasData.data[pos + 1] = 0;
						canvasData.data[pos + 2] = 0;
						canvasData.data[pos + 3] = 0;
					}
					else {
						canvasData.data[pos] = view[pos_ip + 2];
						canvasData.data[pos + 1] = view[pos_ip + 1];
						canvasData.data[pos + 2] = view[pos_ip];
						canvasData.data[pos + 3] = 255;
					}
				}
				for(var j = 0; j < add_bits; j++, pos_ip++);
				pos -= backoffset;
			}
			ctx.putImageData(canvasData, 0, 0);
		};
	}
}