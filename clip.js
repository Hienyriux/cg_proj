function clipCS(i, x_min, x_max, y_min, y_max) {
	var x1 = prim_list[i].features[0][0], y1 = prim_list[i].features[0][1];
	var x2 = prim_list[i].features[1][0], y2 = prim_list[i].features[1][1];
	var code1 = 0, code2 = 0;
	if(x1 < x_min)
		code1 += 1;
	else if(x1 > x_max)
		code1 += 2;
	if(y1 < y_min)
		code1 += 4;
	else if(y1 > y_max)
		code1 += 8;
	if(x2 < x_min)
		code2 += 1;
	else if(x2 > x_max)
		code2 += 2;
	if(y2 < y_min)
		code2 += 4;
	else if(y2 > y_max)
		code2 += 8;
	if((code1 & code2) != 0)
		return 1;
	if(code1 == 0 && code2 == 0)
		return 0;
	var res_or = (code1 | code2);
	var k = 0.0, k_r = 0.0;
	var code3 = 0;
	if(x1 != x2)
		k = (y2 - y1) / (x2 - x1);
	if(y1 != y2)
		k_r = (x2 - x1) / (y2 - y1);
	// 左侧求交，与y轴平行的情况已经“简弃”了
	if(res_or & 1) {
		var left_y = k * (x_min - x1) + y1;
		if(left_y < y_min)
			code3 += 4;
		else if(left_y > y_max)
			code3 += 8;
		if(x1 > x2) {
			code2 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[1][0] = x_min;
			prim_list[i].features[1][1] = Math.round(left_y);
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		else {
			code1 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[0][0] = x_min;
			prim_list[i].features[0][1] = Math.round(left_y);
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		res_or = (code1 | code2);
	}
	// 右侧求交
	if(res_or & 2) {
		var right_y = k * (x_max - x1) + y1;
		code3 = 0;
		if(right_y < y_min)
			code3 += 4;
		else if(right_y > y_max)
			code3 += 8;
		if(x1 > x2) {
			code1 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[0][0] = x_max;
			prim_list[i].features[0][1] = Math.round(right_y);
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		else {
			code2 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[1][0] = x_max;
			prim_list[i].features[1][1] = Math.round(right_y);
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		res_or = (code1 | code2);
	}
	// 上侧求交
	if(res_or & 4) {
		var up_x = k_r * (y_min - y1) + x1;
		code3 = 0;
		if(up_x < x_min)
			code3 += 1;
		else if(up_x > x_max)
			code3 += 2;
		if(y1 > y2) {
			code2 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[1][0] = Math.round(up_x);
			prim_list[i].features[1][1] = y_min;
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		else {
			code1 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[0][0] = Math.round(up_x);
			prim_list[i].features[0][1] = y_min;
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		res_or = (code1 | code2);
	}
	// 下侧求交
	if(res_or & 8) {
		var down_x = k_r * (y_max - y1) + x1;
		code3 = 0;
		if(down_x < x_min)
			code3 += 1;
		else if(down_x > x_max)
			code3 += 2;
		if(y1 > y2) {
			code1 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[0][0] = Math.round(down_x);
			prim_list[i].features[0][1] = y_max;
			if(code1 == 0 && code2 == 0)
				return 0;
		}
		else {
			code2 = code3;
			if((code1 & code2) != 0)
				return 1;
			prim_list[i].features[1][0] = Math.round(down_x);
			prim_list[i].features[1][1] = y_max;
			if(code1 == 0 && code2 == 0)
				return 0;
		}
	}
	return 0;
}

function clipLB(i, x_min, x_max, y_min, y_max) {
	var x1 = prim_list[i].features[0][0], y1 = prim_list[i].features[0][1];
	var x2 = prim_list[i].features[1][0], y2 = prim_list[i].features[1][1];
	var px = x1 - x2;
	var py = y1 - y2;
	var u1 = 0, u2 = 1;
	var r = 0.0;
	if(px == 0 && (x1 < x_min || x1 > x_max))
		return 1;
	else if(px != 0) {
		r = (x1 - x_min) / px;
		if(px < 0 && r > u1)
			u1 = r;
		else if(px > 0 && r < u2)
			u2 = r;
		if(u1 > u2)
			return 1;
		px = -px;
		r = (x_max - x1) / px;
		if(px < 0 && r > u1)
			u1 = r;
		else if(px > 0 && r < u2)
			u2 = r;
		if(u1 > u2)
			return 1;
	}
	if(py == 0 && (y1 < y_min || y1 > y_max))
		return 1;
	else if(py != 0) {
		r = (y1 - y_min) / py;
		if(py < 0 && r > u1)
			u1 = r;
		else if(py > 0 && r < u2)
			u2 = r;
		if(u1 > u2)
			return 1;
		py = -py;
		r = (y_max - y1) / py;
		if(py < 0 && r > u1)
			u1 = r;
		else if(py > 0 && r < u2)
			u2 = r;
		if(u1 > u2)
			return 1;
	}
	prim_list[i].features[0][0] = Math.round(x1 + u1 * px);
	prim_list[i].features[0][1] = Math.round(y1 + u1 * py);
	prim_list[i].features[1][0] = Math.round(x1 + u2 * px);
	prim_list[i].features[1][1] = Math.round(y1 + u2 * py);
	return 0;
}