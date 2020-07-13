function draftVerticalLine(sx, sy, ey, r, g, b, a) {
	var j = sy;
	var step = 1;
	if(sy > ey)
		step = -1;
	while((step > 0 && j <= ey) || (step < 0 && j >= ey)) {
		if(sx > -1 && sx < canvasWidth && j > -1 && j < canvasHeight) {
			var index = (sx + j * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
		j += step;
	}
	ctx.putImageData(canvasData, 0, 0);
}

function draftHorizontalLine(sx, sy, ex, r, g, b, a) {
	var i = sx;
	var step = 1;
	if(sx > ex)
		step = -1;
	while((step > 0 && i <= ex) || (step < 0 && i >= ex)) {
		if(i > -1 && i < canvasWidth && sy > -1 && sy < canvasHeight) {
			var index = (i + sy * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
		i += step;
	}
	ctx.putImageData(canvasData, 0, 0);
}

function draftDDALine(sx, sy, ex, ey, r, g, b, a) {
	if(sx == ex)
		draftVerticalLine(sx, sy, ey, r, g, b, a);
	else if(sy == ey)
		draftHorizontalLine(sx, sy, ex, r, g, b, a);
	else {
		var index;
		var m = (ey - sy) / (ex - sx);
		var m_abs = m;
		if(m < 0)
			m_abs = -m;
		var i = sx;
		var j = sy;
		var i_step = 1;
		var j_step = m;
		var sel = 0;
		var round_res = 0;
		if(m_abs <= 1 && sx > ex) {
			i_step = -1;
			j_step = -m;
		}
		else if(m_abs > 1 && sy < ey) {
			i_step = 1 / m;
			j_step = 1;
			sel = 1;
		}
		else if(m_abs > 1) {
			i_step = -1 / m;
			j_step = -1;
			sel = 1;
		}
		if(sel == 0) {
			while((i_step > 0 && i <= ex) || (i_step < 0 && i >= ex)) {
				round_res = Math.round(j);
				if(i > -1 && i < canvasWidth && round_res > -1 && round_res < canvasHeight) {
					index = (i + round_res * canvasWidth) * 4;
					canvasData.data[index] = r;
					canvasData.data[index + 1] = g;
					canvasData.data[index + 2] = b;
					canvasData.data[index + 3] = a;
				}
				i += i_step;
				j += j_step;
			}
		}
		else {
			while((j_step > 0 && j <= ey) || (j_step < 0 && j >= ey)) {
				round_res = Math.round(i);
				if(round_res > -1 && round_res < canvasWidth && j > -1 && j < canvasHeight) {
					index = (round_res + j * canvasWidth) * 4;
					canvasData.data[index] = r;
					canvasData.data[index + 1] = g;
					canvasData.data[index + 2] = b;
					canvasData.data[index + 3] = a;
				}
				i += i_step;
				j += j_step;
			}
		}
		ctx.putImageData(canvasData, 0, 0);
	}
}

function draftBresenhamLine(sx, sy, ex, ey, r, g, b, a) {
	if(sx == ex)
		draftVerticalLine(sx, sy, ey, r, g, b, a);
	else if(sy == ey)
		draftHorizontalLine(sx, sy, ex, r, g, b, a);
	else {
		var i_step;
		var j_step;
		var index;
		var dx = ex - sx;
		var dy = ey - sy;
		var dx_abs = dx;
		var dy_abs = dy;
		if(dx_abs < 0)
			dx_abs = -dx_abs;
		if(dy_abs < 0)
			dy_abs = -dy_abs;
		var i = sx;
		var j = sy;
		var p;
		if(dx_abs >= dy_abs) {
			if(dy > 0) {
				j_step = 1;
				if(dx > 0) {
					i_step = 1;
					p = 2 * dy - dx;
				}
				else {
					i_step = -1;
					p = 2 * dy + dx;
				}
			}
			else {
				j_step = -1;
				if(dx > 0) {
					i_step = 1;
					p = -2 * dy - dx;
				}
				else {
					i_step = -1;
					p = -2 * dy + dx;
				}
			}
			
			while((i_step > 0 && i <= ex) || (i_step < 0 && i >= ex)) {
				if(i > -1 && i < canvasWidth && j > -1 && j < canvasHeight) {
					index = (i + j * canvasWidth) * 4;
					canvasData.data[index] = r;
					canvasData.data[index + 1] = g;
					canvasData.data[index + 2] = b;
					canvasData.data[index + 3] = a;
				}
				if(p > 0) {
					j += j_step;
					if(dy > 0) {
						if(dx > 0)
							p += 2 * dy - 2 * dx;
						else
							p += 2 * dy + 2 * dx;
					}
					else {
						if(dx > 0)
							p += -2 * dy - 2 * dx;
						else
							p += -2 * dy + 2 * dx;
					}
				}
				else if(dy > 0)
					p += 2 * dy;
				else
					p += -2 * dy;
				i += i_step;
			}
		}
		else {
			if(dx > 0) {
				i_step = 1;
				if(dy > 0) {
					j_step = 1;
					p = 2 * dx - dy;
				}
				else {
					j_step = -1;
					p = 2 * dx + dy;
				}
			}
			else {
				i_step = -1;
				if(dy > 0) {
					j_step = 1;
					p = -2 * dx - dy;
				}
				else {
					j_step = -1;
					p = -2 * dx + dy;
				}
			}
			while((j_step > 0 && j <= ey) || (j_step < 0 && j >= ey)) {
				if(i > -1 && i < canvasWidth && j > -1 && j < canvasHeight) {
					index = (i + j * canvasWidth) * 4;
					canvasData.data[index] = r;
					canvasData.data[index + 1] = g;
					canvasData.data[index + 2] = b;
					canvasData.data[index + 3] = a;
				}
				if(p > 0) {
					i += i_step;
					if(dx > 0) {
						if(dy > 0)
							p += 2 * dx - 2 * dy;
						else
							p += 2 * dx + 2 * dy;
					}
					else {
						if(dy > 0)
							p += -2 * dx - 2 * dy;
						else
							p += -2 * dx + 2 * dy;
					}
				}
				else if(dx > 0)
					p += 2 * dx;
				else
					p += -2 * dx;
				j += j_step;
			}
		}	
		ctx.putImageData(canvasData, 0, 0);
	}
}