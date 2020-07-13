function copyFour(x_off, y_off, x, y, r, g, b, a, rtx, rty, sin, cos, step) {
	var index = 0;
	var offset_x = [x_off, x_off, -x_off, -x_off];
	var offset_y = [y_off, -y_off, y_off, -y_off];
	if(rty != -1) {
		for(var i = 0; i < 4; i++) {
			var cur_x = offset_x[i], cur_y = offset_y[i];
			offset_x[i] = Math.round(rtx + (cur_x - rtx) * cos - (cur_y - rty) * sin);
			offset_y[i] = Math.round(rty + (cur_x - rtx) * sin + (cur_y - rty) * cos);
		}
	}
	for(var i = 0; i < 4; i++) {
		if(x + offset_x[i] > -1 && x + offset_x[i] < canvasWidth
		&& y + offset_y[i] > -1 && y + offset_y[i] < canvasHeight) {
			var index = (x + offset_x[i] + (y + offset_y[i]) * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
	}
}

function draftEllipse(x, y, rx, ry, r, g, b, a, rtx, rty, sin, cos, step) {
	if(rtx == -1) {
		if(x > -1 && x < canvasWidth && y + ry > -1 && y + ry < canvasHeight) {
			var index = (x + (y + ry) * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
		if(x > -1 && x < canvasWidth && y - ry > -1 && y - ry < canvasHeight) {
			var index = (x + (y - ry) * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
	}
	else {
		var tmp_x = Math.round(rtx + (x - rtx) * cos - (y + ry - rty) * sin);
		var tmp_y = Math.round(rty + (x - rtx) * sin + (y + ry - rty) * cos);
		if(tmp_x > -1 && tmp_x < canvasWidth && tmp_y > -1 && tmp_y < canvasHeight) {
			var index = (tmp_x + tmp_y * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
		tmp_x = Math.round(rtx + (x - rtx) * cos - (y - ry - rty) * sin);
		tmp_y = Math.round(rty + (x - rtx) * sin + (y - ry - rty) * cos);
		if(tmp_x > -1 && tmp_x < canvasWidth && tmp_y > -1 && tmp_y < canvasHeight) {
			var index = (tmp_x + tmp_y * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
	}
	
	var x_off = 0;
	var y_off = ry;
	var p = ry * ry - rx * rx * ry + rx * rx / 4;
	
	while(ry * ry * x_off < rx * rx * y_off) {
		x_off += step;
		if(p < 0)
			p = p + 2 * ry * ry * x_off + ry * ry; 
		else {
			y_off -= step;
			p = p + 2 * ry * ry * x_off - 2 * rx * rx * y_off + ry * ry;
		}
		copyFour(x_off, y_off, x, y, r, g, b, a, rtx, rty, sin, cos, step);
	}
	p = ry * ry * (x_off + 0.5) * (x_off + 0.5) + rx * rx * (y_off - 1) * (y_off - 1) - rx * rx * ry * ry;
	while(y_off >= 0) {
		y_off -= step;
		if(p > 0)
			p = p - 2 * rx * rx * y_off + rx * rx;
		else {
			x_off += step;
			p = p + 2 * ry * ry * x_off - 2 * rx * rx * y_off + rx * rx;
		}
		copyFour(x_off, y_off, x, y, r, g, b, a, rtx, rty, sin, cos, step);
	}
	ctx.putImageData(canvasData, 0, 0);
}