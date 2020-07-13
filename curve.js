function draftCurveBezier(slot_num, src, r, g, b, a) {
	var incr = 1.0 / slot_num;
	var arr1 = [];
	var arr2 = [];
	var c, d, index, lima, limb;
	var sign = 0;
	var cur_t = 0.0;
	var round_x = 0, round_y = 0;
	for(var i = 0; i <= slot_num; i++, cur_t += incr, sign = 0) {
		arr1 = src.slice();
		for(var j = 0; j < src.length - 1; j++) {
			if(!sign) {
				c = arr1.pop();
				lima = arr1.length;
				for(var k = 0; k < lima; k++) {
					d = arr1.pop();
					arr2.push([cur_t * c[0] + (1 - cur_t) * d[0], cur_t * c[1] + (1 - cur_t) * d[1]]);
					c = d;
				}
				sign = 1;
			}
			else {
				c = arr2.pop();
				limb = arr2.length;
				for(var k = 0; k < limb; k++) {
					d = arr2.pop();
					arr1.push([(1 - cur_t) * c[0] + cur_t * d[0], (1 - cur_t) * c[1] + cur_t * d[1]]);
					c = d;
				}
				sign = 0;
			}
		}
		if(!sign)
			c = arr1.pop();
		else 
			c = arr2.pop();
		round_x = Math.round(c[0]);
		round_y = Math.round(c[1]);
		if(round_x > -1 && round_x < canvasWidth && round_y > -1 && round_y < canvasHeight) {
			index = (round_x + round_y * canvasWidth) * 4;
			canvasData.data[index] = r;
			canvasData.data[index + 1] = g;
			canvasData.data[index + 2] = b;
			canvasData.data[index + 3] = a;
		}
	}
	ctx.putImageData(canvasData, 0, 0);
}

function draftCurveBspline(slot_num, src, r, g, b, a) {
	// 生成节点矢量，先采用均匀的
	var u = [];
	var n = src.length - 1;
	var u_incr = 1 / (n + bspline_k + 1);
	var cur_u = 0.0;
	var incr = u_incr / slot_num;
	var arr1 = [];
	var arr2 = [];
	var c, d, index, lima, limb;
	var cur_larger;
	var cur_smaller;
	var res = [0.0, 0.0];
	var sign = 0;
	var round_x = 0, round_y = 0;
	for(var i = 0; i < n + bspline_k + 1; i++, cur_u += u_incr)
		u.push(cur_u);
	u.push(1.0);
	for(var i = bspline_k; i < n + 1; i++) {
		cur_u = u[i];
		for(var s = 0; s <= slot_num; s++, cur_u += incr, sign = 0) {
			res = [0.0, 0.0];
			arr1.push(0.0);
			arr1.push(1.0);
			arr1.push(0.0);
			for(var j = 0; j < bspline_k; j++) {
				if(!sign) {
					if(j != bspline_k - 1)
						arr2.push(0.0);
					c = arr1.pop();
					lima = arr1.length;
					for(var t = 0; t < lima; t++) {
						d = arr1.pop();
						// 没有重复矢量点，不存在0/0的情况
						// (i + 1 - t) + (j + 1) = i + j - t + 2
						cur_larger = (u[i + j - t + 2] - cur_u) / (u[i + j - t + 2] - u[i + 1 - t]);
						// (i + 1 - t) - 1 = i - t
						// (i + j - t + 2) - 1 = i + j - t + 1
						cur_smaller = (cur_u - u[i - t]) / (u[i + j - t + 1] - u[i - t]);
						arr2.push(cur_larger * c + cur_smaller * d);
						c = d;
					}
					if(j != bspline_k - 1)
						arr2.push(0.0);
					sign = 1;
				}
				else {
					if(j != bspline_k - 1)
						arr1.push(0.0);
					c = arr2.pop();
					limb = arr2.length;
					for(var t = 0; t < limb; t++) {
						d = arr2.pop();
						// (i - j + t) + (j + 1) = i + t + 1
						cur_larger = (u[i + t + 1] - cur_u) / (u[i + t + 1] - u[i - j + t]);
						// (i - j + t) - 1 = i - j + t - 1
						// (i + t + 1) - 1 = i + t
						cur_smaller = (cur_u - u[i - j + t - 1]) / (u[i + t] - u[i - j + t - 1]);
						arr1.push(cur_larger * d + cur_smaller * c);
						c = d;
					}
					if(j != bspline_k - 1)
						arr1.push(0.0);
					sign = 0;
				}
			}
			
			if(!sign) {
				for(var j = i; j > i - bspline_k - 1; j--) {
					c = arr1.pop();
					res[0] += c * src[j][0];
					res[1] += c * src[j][1];
				}
			}
			else {
				for(var j = i - bspline_k; j <= i; j++) {
					c = arr2.pop();
					res[0] += c * src[j][0];
					res[1] += c * src[j][1];
				}
			}
			round_x = Math.round(res[0]);
			round_y = Math.round(res[1]);
			if(round_x > -1 && round_x < canvasWidth && round_y > -1 && round_y < canvasHeight) {
				index = (round_x + round_y * canvasWidth) * 4;
				canvasData.data[index] = r;
				canvasData.data[index + 1] = g;
				canvasData.data[index + 2] = b;
				canvasData.data[index + 3] = a;
			}
		}
	}
	ctx.putImageData(canvasData, 0, 0);
}