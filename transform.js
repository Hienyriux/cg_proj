$("idTransPrimitive").onclick = function() {
	$("idDialog5").style.top = "150px";
	$("idDialog5").style.left = "350px";
	$("idDialog5").style.display = "block";
}

function primPts(i) {
	switch(prim_list[i].type) {
		case 1:
		case 2: {
			box_mark(prim_list[i].features[0][0], prim_list[i].features[0][1], 0x00, 0x00, 0x00, 0xff);
			box_mark(prim_list[i].features[1][0], prim_list[i].features[1][1], 0x00, 0x00, 0x00, 0xff);
			break;
		}
		case 3:
		case 4: {
			for(var j = 0; j < prim_list[i].features.length; j++)
				box_mark(prim_list[i].features[j][0], prim_list[i].features[j][1], 0x00, 0x00, 0x00, 0xff);
			break;
		}
		case 5: {
			box_mark(prim_list[i].features[0] - prim_list[i].features[2], prim_list[i].features[1], 0x00, 0x00, 0x00, 0xff);
			box_mark(prim_list[i].features[0] + prim_list[i].features[2], prim_list[i].features[1], 0x00, 0x00, 0x00, 0xff);
			box_mark(prim_list[i].features[0], prim_list[i].features[1] - prim_list[i].features[3], 0x00, 0x00, 0x00, 0xff);
			box_mark(prim_list[i].features[0], prim_list[i].features[1] + prim_list[i].features[3], 0x00, 0x00, 0x00, 0xff);
			break;
		}
		case 6: {
			box_mark(prim_list[i].features[0][0], prim_list[i].features[0][1], 0x00, 0x00, 0x00, 0xff);
			box_mark(prim_list[i].features[prim_list[i].features.length - 1][0], prim_list[i].features[prim_list[i].features.length - 1][1],
			0x00, 0x00, 0x00, 0xff);
			break;
		}
		case 7: {
			// 最后一个是参数k
			for(var j = 1; j < prim_list[i].features.length - 2; j++)
				box_mark(prim_list[i].features[j][0], prim_list[i].features[j][1], 0x00, 0x00, 0x00, 0xff);
		}
	}
}

$("idCloseButton5").onclick = function() {
	var a = document.getElementsByName("primitiveTrans");
	for(var i = 0; i < a.length; i++) {
		if(a[i].checked == true) {
			task_type = i + 8;
			break;
		}
	}
	if(task_type > 7) {
		$("idActionSpan").innerHTML = "变换";
		var b;
		var c;
		switch(task_type) {
			case 8: b = "平移"; c = ""; break;
			case 9: b = "旋转"; c = ""; break;
			case 10: b = "缩放"; c = ""; break;
			case 11: b = "裁剪"; c = "Cohen-Sutherland"; break;
			case 12: b = "裁剪"; c = "Liang-Barsky";
		}
		$("idPrimitiveSpan").innerHTML = b;
		$("idAlgoSpan").innerHTML = c;
	}
	$("idDialog5").style.display = "none";
	clickCount = 0;
	pts.splice(0, pts.length);
	for(var i = 0; i < prim_list.length; i++)
		primPts(i);
	$("idPromptSpan").innerHTML = "请点击小方框以选择图元（方框代表线段端点，椭圆顶点，或曲线的部分控制点）";
}

function drawPrims(i, r, g, b, a) {
	switch(prim_list[i].type) {
		case 1: {
			draftDDALine(prim_list[i].features[0][0], prim_list[i].features[0][1],
			prim_list[i].features[1][0], prim_list[i].features[1][1], r, g, b, a);
			break;
		}
		case 2: {
			draftBresenhamLine(prim_list[i].features[0][0], prim_list[i].features[0][1],
			prim_list[i].features[1][0], prim_list[i].features[1][1], r, g, b, a);
			break;
		}
		case 3: {
			var len_1 = prim_list[i].features.length - 1;
			for(var j = 0; j < len_1; j++) {
				draftDDALine(prim_list[i].features[j][0], prim_list[i].features[j][1],
				prim_list[i].features[j + 1][0], prim_list[i].features[j + 1][1], r, g, b, a);
			}
			draftDDALine(prim_list[i].features[len_1][0], prim_list[i].features[len_1][1],
			prim_list[i].features[0][0], prim_list[i].features[0][1], r, g, b, a);
			break;
		}
		case 4: {
			var len_1 = prim_list[i].features.length - 1;
			for(var j = 0; j < len_1; j++) {
				draftBresenhamLine(prim_list[i].features[j][0], prim_list[i].features[j][1],
				prim_list[i].features[j + 1][0], prim_list[i].features[j + 1][1], r, g, b, a);
			}
			draftBresenhamLine(prim_list[i].features[len_1][0], prim_list[i].features[len_1][1],
			prim_list[i].features[0][0], prim_list[i].features[0][1], r, g, b, a);
			break;
		}
		case 5: {
			draftEllipse(prim_list[i].features[0], prim_list[i].features[1],
			prim_list[i].features[2], prim_list[i].features[3], r, g, b, a, -1, -1, -1, -1, 1);
			break;
		}
		case 6: {
			draftCurveBezier(1024, prim_list[i].features, r, g, b, a);
			break;
		}
		case 7: {
			draftCurveBspline(256, prim_list[i].features, r, g, b, a);
		}
	}
}

function translate(i, ox, oy) {
	drawPrims(i, 0x00, 0x00, 0x00, 0x00, 0, 0);
	for(var j = 0; j < i; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	for(var j = i + 1; j < prim_list.length; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	switch(prim_list[i].type) {
		case 1:
		case 2: {
			prim_list[i].features[0][0] += ox;
			prim_list[i].features[0][1] += oy;
			prim_list[i].features[1][0] += ox;
			prim_list[i].features[1][1] += oy;
			break;
		}
		case 3:
		case 4:
		case 6:
		case 7: {
			if(prim_list[i].type == 7)
				bspline_k = prim_list[i].features.pop();
			for(var j = 0; j < prim_list[i].features.length; j++) {
				prim_list[i].features[j][0] += ox;
				prim_list[i].features[j][1] += oy;
			}
			if(prim_list[i].type == 7)
				prim_list[i].features.push(bspline_k);
			break;
		}
		case 5: {
			prim_list[i].features[0] += ox;
			prim_list[i].features[1] += oy;
		}
	}
	drawPrims(i, prim_list[i].r, prim_list[i].g, prim_list[i].b, 0xff);
}

function rotate(i, x, y, sin, cos) {
	drawPrims(i, 0x00, 0x00, 0x00, 0x00, 0, 0);
	for(var j = 0; j < i; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	for(var j = i + 1; j < prim_list.length; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	switch(prim_list[i].type) {
		case 1:
		case 2: {
			var cur_x = prim_list[i].features[0][0], cur_y = prim_list[i].features[0][1];
			prim_list[i].features[0][0] = Math.round(x + (cur_x - x) * cos - (cur_y - y) * sin);
			prim_list[i].features[0][1] = Math.round(y + (cur_x - x) * sin + (cur_y - y) * cos);
			cur_x = prim_list[i].features[1][0];
			cur_y = prim_list[i].features[1][1];
			prim_list[i].features[1][0] = Math.round(x + (cur_x - x) * cos - (cur_y - y) * sin);
			prim_list[i].features[1][1] = Math.round(y + (cur_x - x) * sin + (cur_y - y) * cos);
			break;
		}
		case 3:
		case 4:
		case 6:
		case 7: {
			if(prim_list[i].type == 7)
				bspline_k = prim_list[i].features.pop();
			var cur_x, cur_y;
			for(var j = 0; j < prim_list[i].features.length; j++) {
				cur_x = prim_list[i].features[j][0];
				cur_y = prim_list[i].features[j][1];
				prim_list[i].features[j][0] = Math.round(x + (cur_x - x) * cos - (cur_y - y) * sin);
				prim_list[i].features[j][1] = Math.round(y + (cur_x - x) * sin + (cur_y - y) * cos);
			}
			if(prim_list[i].type == 7)
				prim_list[i].features.push(bspline_k);
		}
	}
	//if(prim_list[i].type != 5)
		drawPrims(i, prim_list[i].r, prim_list[i].g, prim_list[i].b, 0xff);
	/*
	else {
		draftEllipse(prim_list[i].features[0], prim_list[i].features[1],
		prim_list[i].features[2], prim_list[i].features[3], prim_list[i].r, prim_list[i].g, prim_list[i].b, 0xff, x, y, sin, cos, 0.5);
	}
	*/
}

function scale(i, x, y) {
	drawPrims(i, 0x00, 0x00, 0x00, 0x00, 0, 0);
	for(var j = 0; j < i; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	for(var j = i + 1; j < prim_list.length; j++)
		drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
	switch(prim_list[i].type) {
		case 1:
		case 2: {
			var cur_x = prim_list[i].features[0][0], cur_y = prim_list[i].features[0][1];
			prim_list[i].features[0][0] = Math.round(cur_x * scale_k + x * (1 - scale_k));
			prim_list[i].features[0][1] = Math.round(cur_y * scale_k + y * (1 - scale_k));
			cur_x = prim_list[i].features[1][0];
			cur_y = prim_list[i].features[1][1];
			prim_list[i].features[1][0] = Math.round(cur_x * scale_k + x * (1 - scale_k));
			prim_list[i].features[1][1] = Math.round(cur_y * scale_k + y * (1 - scale_k));
			break;
		}
		case 3:
		case 4:
		case 6:
		case 7: {
			if(prim_list[i].type == 7)
				bspline_k = prim_list[i].features.pop();
			var cur_x, cur_y;
			for(var j = 0; j < prim_list[i].features.length; j++) {
				cur_x = prim_list[i].features[j][0];
				cur_y = prim_list[i].features[j][1];
				prim_list[i].features[j][0] = Math.round(cur_x * scale_k + x * (1 - scale_k));
				prim_list[i].features[j][1] = Math.round(cur_y * scale_k + y * (1 - scale_k));
			}
			if(prim_list[i].type == 7)
				prim_list[i].features.push(bspline_k);
		}
	}
	if(prim_list[i].type != 5)
		drawPrims(i, prim_list[i].r, prim_list[i].g, prim_list[i].b, 0xff);
	else {
		prim_list[i].features[0] = Math.round(prim_list[i].features[0] * scale_k + x * (1 - scale_k));
		prim_list[i].features[1] = Math.round(prim_list[i].features[1] * scale_k + y * (1 - scale_k));
		prim_list[i].features[2] = Math.round(prim_list[i].features[2] * scale_k);
		prim_list[i].features[3] = Math.round(prim_list[i].features[3] * scale_k);
		draftEllipse(prim_list[i].features[0], prim_list[i].features[1],
		prim_list[i].features[2], prim_list[i].features[3], prim_list[i].r, prim_list[i].g, prim_list[i].b, 0xff, -1, -1, -1, -1, 1);
	}
}

function transClick() {
	if(clickCount == 1) {
		var min_dis = canvasWidth + canvasHeight; 
		for(var i = 0; i < prim_list.length; i++) {
			switch(prim_list[i].type) {
				case 1:
				case 2: {
					var ox = prim_list[i].features[0][0] - pts[0][0], oy = prim_list[i].features[0][1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy;
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					ox = prim_list[i].features[1][0] - pts[0][0];
					oy = prim_list[i].features[1][1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					break;
				}
				case 3:
				case 4: {
					var ox, oy;
					for(var j = 0; j < prim_list[i].features.length; j++) {
						ox = prim_list[i].features[j][0] - pts[0][0];
						oy = prim_list[i].features[j][1] - pts[0][1];
						if(ox < 0) ox = -ox;
						if(oy < 0) oy = -oy;
						if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					}
					break;
				}
				case 5: {
					var ox = prim_list[i].features[0] - prim_list[i].features[2] - pts[0][0], oy = prim_list[i].features[1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy;
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					ox = prim_list[i].features[0] + prim_list[i].features[2] - pts[0][0];
					oy = prim_list[i].features[1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					ox = prim_list[i].features[0] - pts[0][0];
					oy = prim_list[i].features[1] - prim_list[i].features[3] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					ox = prim_list[i].features[0] - pts[0][0];
					oy = prim_list[i].features[1] + prim_list[i].features[3] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					break;
				}
				case 6: {
					var ox = prim_list[i].features[0][1] - pts[0][0], oy = prim_list[i].features[0][1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy;
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					ox = prim_list[i].features[prim_list[i].features.length - 1][0] - pts[0][0];
					oy = prim_list[i].features[prim_list[i].features.length - 1][1] - pts[0][1];
					if(ox < 0) ox = -ox;
					if(oy < 0) oy = -oy
					if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					break;
				}
				case 7: {
					var ox, oy;
					for(var j = 1; j < prim_list[i].features.length - 2; j++) {
						ox = prim_list[i].features[j][0] - pts[0][0];
						oy = prim_list[i].features[j][1] - pts[0][1];
						if(ox < 0) ox = -ox;
						if(oy < 0) oy = -oy;
						if(ox + oy < min_dis) { min_dis = ox + oy; prim_i = i; }
					}
				}
			}
		}
		restore();
		primPts(prim_i);
		if(task_type == 8) {
			switch(prim_list[prim_i].type) {
				case 1:
				case 2: {
					centx = Math.round((prim_list[prim_i].features[0][0] + prim_list[prim_i].features[1][0]) / 2);
					centy = Math.round((prim_list[prim_i].features[0][1] + prim_list[prim_i].features[1][1]) / 2);
					break;
				}
				case 3:
				case 4:
				case 6:
				case 7: {
					var x = 0, y = 0;
					var lim = prim_list[prim_i].features.length;
					if(prim_list[prim_i].type == 7)
						lim--;
					for(var j = 0; j < lim; j++) {
						x += prim_list[prim_i].features[j][0];
						y += prim_list[prim_i].features[j][1];
					}
					centx = Math.round(x / lim);
					centy = Math.round(y / lim);
					break;
				}
				case 5: {
					centx = prim_list[prim_i].features[0];
					centy = prim_list[prim_i].features[1];
					break;
				}
			}
			box_mark(centx, centy, 0xff, 0x00, 0x00, 0xff);
			$("idPromptSpan").innerHTML = "已选中图元，图元大致中心由红色小方框标出，请点击平移后图元中心位置";
		}
		else if(task_type == 9) {
			if(prim_list[prim_i].type == 5) {
				$("idPromptSpan").innerHTML = "旋转操作暂不支持椭圆，请重新选择图元！";
				pts.pop();
				clickCount = 0;
				for(var i = 0; i < prim_list.length; i++)
					primPts(i);
			}
			else
				$("idPromptSpan").innerHTML = "已选中图元，请点击选择旋转中心";
		}
		else if(task_type == 10)
			$("idPromptSpan").innerHTML = "已选中图元，请点击选择缩放中心";
		else if(task_type == 11 || task_type == 12) {
			if(prim_list[prim_i].type > 2) {
				$("idPromptSpan").innerHTML = "只能对线段进行裁剪，请重新选择图元！";
				pts.pop();
				clickCount = 0;
				for(var i = 0; i < prim_list.length; i++)
					primPts(i);
			}
			else
				$("idPromptSpan").innerHTML = "已选中线段，请点击选择裁剪窗口的一个顶点";
		}
	}
	else if(clickCount == 2) {
		if(task_type == 8) {
			restore();
			translate(prim_i, pts[1][0] - centx, pts[1][1] - centy);
			pts.splice(0, pts.length);
			clickCount = 0;
			for(var i = 0; i < prim_list.length; i++)
				primPts(i);
			$("idPromptSpan").innerHTML = "请点击小方框以选择图元（方框代表线段端点，椭圆顶点，或曲线的部分控制点）";
		}
		else if(task_type == 9) {
			box_mark(pts[1][0], pts[1][1], 0xff, 0x00, 0x00, 0xff);
			$("idPromptSpan").innerHTML = "已选中旋转中心，由红色小方框标出，请点击选择旋转角度";
		}
		else if(task_type == 10) {
			box_mark(pts[1][0], pts[1][1], 0xff, 0x00, 0x00, 0xff);
			$("idPromptSpan").innerHTML = "已选中旋转中心，由红色小方框标出，请输入缩放倍数";
			var tmp_k = prompt("请输入缩放倍数", "1.0");
			if(tmp_k != null && tmp_k != "") {
				scale_k = parseFloat(tmp_k);
				$("idAlgoSpan").innerHTML = "(缩放倍数：" + tmp_k + ")";
			}
			restore();
			scale(prim_i, pts[1][0], pts[1][1]);
			pts.splice(0, pts.length);
			clickCount = 0;
			for(var i = 0; i < prim_list.length; i++)
				primPts(i);
			$("idPromptSpan").innerHTML = "请点击小方框以选择图元（方框代表线段端点，椭圆顶点，或曲线的部分控制点）";
		}
		else if(task_type == 11 || task_type == 12) {
			box_mark(pts[1][0], pts[1][1], 0xff, 0x00, 0x00, 0xff);
			$("idPromptSpan").innerHTML = "已选中裁剪窗口的一个顶点，由红色小方框标出，请选择该顶点的对角顶点";
		}
	}
	else if(clickCount == 3) {
		if(task_type == 9) {
			restore();
			var bevel = Math.sqrt((pts[1][0] - pts[2][0]) * (pts[1][0] - pts[2][0]) + (pts[1][1] - pts[2][1]) * (pts[1][1] - pts[2][1]));
			var cos = (pts[2][0] - pts[1][0]) / bevel;
			var sin = (pts[2][1] - pts[1][1]) / bevel;
			rotate(prim_i, pts[1][0], pts[1][1], sin, cos);
			pts.splice(0, pts.length);
			clickCount = 0;
			for(var i = 0; i < prim_list.length; i++)
				primPts(i);
			$("idPromptSpan").innerHTML = "请点击小方框以选择图元（方框代表线段端点，椭圆顶点，或曲线的部分控制点）";
		}
		else if(task_type == 11 || task_type == 12) {
			restore();
			var xw_min = 0, xw_max = 0, yw_min = 0, yw_max = 0;
			xw_min = pts[1][0];
			xw_max = pts[2][0];
			yw_min = pts[1][1];
			yw_max = pts[2][1];
			if(xw_max < xw_min) {
				xw_min = pts[2][0];
				xw_max = pts[1][0];
			}
			if(yw_max < yw_min) {
				yw_min = pts[2][1];
				yw_max = pts[1][1];
			}
			var ori_x1 = prim_list[prim_i].features[0][0], ori_y1 = prim_list[prim_i].features[0][1];
			var ori_x2 = prim_list[prim_i].features[1][0], ori_y2 = prim_list[prim_i].features[1][1];
			var res = 1;
			if(task_type == 11)
				res = clipCS(prim_i, xw_min, xw_max, yw_min, yw_max);
			else
				res = clipLB(prim_i, xw_min, xw_max, yw_min, yw_max);
			if(!res) {
				if(prim_list[prim_i].type == 1)
					draftDDALine(ori_x1, ori_y1, ori_x2, ori_y2, 0x00, 0x00, 0x00, 0x00);
				else
					draftBresenhamLine(ori_x1, ori_y1, ori_x2, ori_y2, 0x00, 0x00, 0x00, 0x00);
				for(var j = 0; j < prim_i; j++)
					drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
				for(var j = prim_i + 1; j < prim_list.length; j++)
					drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
				drawPrims(prim_i, prim_list[prim_i].r, prim_list[prim_i].g, prim_list[prim_i].b, 0xff);
			}
			else {
				if(prim_list[prim_i].type == 1)
					draftDDALine(ori_x1, ori_y1, ori_x2, ori_y2, 0x00, 0x00, 0x00, 0x00);
				else
					draftBresenhamLine(ori_x1, ori_y1, ori_x2, ori_y2, 0x00, 0x00, 0x00, 0x00);
				prim_list.splice(prim_i, 1);
				for(var j = 0; j < prim_list.length; j++)
					drawPrims(j, prim_list[j].r, prim_list[j].g, prim_list[j].b, 0xff, 0, 0);
			}
			pts.splice(0, pts.length);
			clickCount = 0;
			for(var i = 0; i < prim_list.length; i++)
				primPts(i);
			$("idPromptSpan").innerHTML = "请点击小方框以选择图元（方框代表线段端点，椭圆顶点，或曲线的部分控制点）";
		}
	}
}