$("idDrawPrimitive").onclick = function() {
	$("idDialog4").style.top = "150px";
	$("idDialog4").style.left = "350px";
	$("idDialog4").style.display = "block";
}

function box_mark(x, y, r, g, b, a) {
	// 方框型标记（24 pixels）
	var ver_pos = y - 2, hor_pos = x - 3, ver_incr = canvasWidth * 4;
	var init_pos = (x + y * canvasWidth) * 4;
	
	for(var i = init_pos - 3 * ver_incr - 12; i < init_pos - 3 * ver_incr + 16; i += 4, hor_pos++) {
		if(hor_pos > -1 && hor_pos < canvasWidth) {
			back_pix.push(i);
			back_pix.push(canvasData.data[i]);
			back_pix.push(canvasData.data[i + 1]);
			back_pix.push(canvasData.data[i + 2]);
			back_pix.push(canvasData.data[i + 3]);
			canvasData.data[i] = r;
			canvasData.data[i + 1] = g;
			canvasData.data[i + 2] = b;
			canvasData.data[i + 3] = a;
		}
	}
	
	for(var i = init_pos - 2 * ver_incr - 12; i < init_pos + 3 * ver_incr; i += ver_incr, ver_pos++) {
		if(ver_pos > -1 && ver_pos < canvasHeight) {
			back_pix.push(i);
			back_pix.push(canvasData.data[i]);
			back_pix.push(canvasData.data[i + 1]);
			back_pix.push(canvasData.data[i + 2]);
			back_pix.push(canvasData.data[i + 3]);
			canvasData.data[i] = r;
			canvasData.data[i + 1] = g;
			canvasData.data[i + 2] = b;
			canvasData.data[i + 3] = a;
		}
	}
	
	ver_pos = y - 2;
	for(var i = init_pos - 2 * ver_incr + 12; i < init_pos + 4 * ver_incr; i += ver_incr, ver_pos++) {
		if(ver_pos > -1 && ver_pos < canvasHeight) {
			back_pix.push(i);
			back_pix.push(canvasData.data[i]);
			back_pix.push(canvasData.data[i + 1]);
			back_pix.push(canvasData.data[i + 2]);
			back_pix.push(canvasData.data[i + 3]);
			canvasData.data[i] = r;
			canvasData.data[i + 1] = g;
			canvasData.data[i + 2] = b;
			canvasData.data[i + 3] = a;
		}
	}
	
	hor_pos = x - 2;
	for(var i = init_pos + 3 * ver_incr - 8; i < init_pos + 3 * ver_incr + 12; i += 4, hor_pos++) {
		if(hor_pos > -1 && hor_pos < canvasWidth) {
			back_pix.push(i);
			back_pix.push(canvasData.data[i]);
			back_pix.push(canvasData.data[i + 1]);
			back_pix.push(canvasData.data[i + 2]);
			back_pix.push(canvasData.data[i + 3]);
			canvasData.data[i] = r;
			canvasData.data[i + 1] = g;
			canvasData.data[i + 2] = b;
			canvasData.data[i + 3] = a;
		}
	}
	
	ctx.putImageData(canvasData, 0, 0);
}

function restore() {
	var i, r, g, b, a;
	while(back_pix.length > 0) {
		a = back_pix.pop();
		b = back_pix.pop();
		g = back_pix.pop();
		r = back_pix.pop();
		i = back_pix.pop();
		canvasData.data[i] = r;
		canvasData.data[i + 1] = g;
		canvasData.data[i + 2] = b;
		canvasData.data[i + 3] = a;
	}
}

$("idCloseButton4").onclick = function() {
	var a = document.getElementsByName("primitiveAlgo");
	for(var i = 0; i < a.length; i++) {
		if(a[i].checked == true) {
			task_type = i + 1;
			break;
		}
	}
	if(task_type > 0 && task_type < 8) {
		$("idActionSpan").innerHTML = "绘制";
		var b;
		var c;
		switch(task_type) {
			case 1: b = "线段"; c = "DDA"; break;
			case 2: b = "线段"; c = "Bresenham"; break;
			case 3: b = "多边形"; c = "DDA"; break;
			case 4: b = "多边形"; c = "Bresenham"; break;
			case 5: b = "椭圆"; c = "中点椭圆"; break;
			case 6: b = "曲线"; c = "Bezier"; break;
			case 7: b = "曲线"; c = "B_spline";
		}
		$("idPrimitiveSpan").innerHTML = b;
		$("idAlgoSpan").innerHTML = c;
	}
	$("idDialog4").style.display = "none";
	
	if(task_type == 7) {
		var tmp_k = prompt("请输入B样条曲线的次数(k)", "3");
		if(tmp_k != null && tmp_k != "") {
			bspline_k = parseInt(tmp_k);
			c += "(" + tmp_k + "次)";
			$("idAlgoSpan").innerHTML = c;
		}
	}
	restore();
	ctx.putImageData(canvasData, 0, 0);
	clickCount = 0;
	pts.splice(0, pts.length);
	
	if(task_type > 0 && is_first_bind)
		return draftShape();
	else if(task_type > 0){
		if(task_type <= 4 || (task_type >= 6 && task_type < 8))
			$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
		else if(task_type == 5)
			$("idPromptSpan").innerHTML = "/*请点击画布以选择椭圆中心*/"
	}
}

function draftShape() {
	is_first_bind = 0;
	var timeoutID = null;
	var leftpos, rightpos;
	if(task_type <= 4 || (task_type >= 6 && task_type < 8))
		$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
	else if(task_type == 5)
		$("idPromptSpan").innerHTML = "/*请点击画布以选择椭圆中心*/"

	cv.addEventListener("mousemove", function(e) {
		$("idMouseSpan").innerHTML = "鼠标坐标：[" + e.offsetX + ", " + e.offsetY + "]";
	});
	cv.addEventListener("click", function(e) {
		pts.push([e.offsetX, e.offsetY]);
		clickCount++;
		if(task_type == 1 || task_type == 2) {
			if(clickCount == 1)
				$("idPromptSpan").innerHTML = "/*请选中终点*/";
			else {
				var sx = pts[0][0], sy = pts[0][1], ex = pts[1][0], ey = pts[1][1];
				if(task_type == 1)
					draftDDALine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
				else
					draftBresenhamLine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
				prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
				pts.splice(0, pts.length);
				clickCount = 0;
				$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
			}
		}
		if(task_type == 3 || task_type == 4) {
			if(clickCount > 1) {
				clearTimeout(timeoutID);
				timeoutID= window.setTimeout(function(){
						var sx = pts[clickCount - 2][0], sy = pts[clickCount - 2][1], ex = pts[clickCount - 1][0], ey = pts[clickCount - 1][1];
						if(task_type == 3)
							draftDDALine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
						else
							draftBresenhamLine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
				}, 200);
			}
			else
				$("idPromptSpan").innerHTML = "/*请单击选中下一个路径点，或双击闭合图形*/";
		}
		else if(task_type == 5) {
			if(clickCount == 1) {
				box_mark(pts[0][0], pts[0][1], 0x00, 0x00, 0x00, 0xff);
				$("idPromptSpan").innerHTML = "/*请单击选择椭圆水平方向上的一个顶点*/";
			}
			else if(clickCount == 2) {
				if(pts[1][0] > pts[0][0]) {
					rightpos = pts[1][0];
					leftpos = 2 * pts[0][0] - rightpos;
				}
				else {
					leftpos = pts[1][0];
					rightpos = 2 * pts[0][0] - leftpos;
				}
				// 左右定位（7），上3，上2，上1，中，下1，下2，下3
				if(leftpos > -1) {
					var ver_pos = pts[0][1] - 3, ver_incr = canvasWidth * 4;
					var init_pos = (leftpos + pts[0][1] * canvasWidth) * 4;
					for(var i = init_pos - 3 * ver_incr; i < init_pos + 4 * ver_incr; i += ver_incr, ver_pos++) {
						if(ver_pos > -1 && ver_pos < canvasHeight) {
							back_pix.push(i);
							back_pix.push(canvasData.data[i]);
							back_pix.push(canvasData.data[i + 1]);
							back_pix.push(canvasData.data[i + 2]);
							back_pix.push(canvasData.data[i + 3]);
							canvasData.data[i] = 0x00;
							canvasData.data[i + 1] = 0x00;
							canvasData.data[i + 2] = 0x00;
							canvasData.data[i + 3] = 0xff;
						}
					}
				}
				if(rightpos < canvasWidth) {
					var ver_pos = pts[0][1] - 3, ver_incr = canvasWidth * 4;
					var init_pos = (rightpos + pts[0][1] * canvasWidth) * 4;
					for(var i = init_pos - 3 * ver_incr; i < init_pos + 4 * ver_incr; i += ver_incr, ver_pos++) {
						if(ver_pos > -1 && ver_pos < canvasHeight) {
							back_pix.push(i);
							back_pix.push(canvasData.data[i]);
							back_pix.push(canvasData.data[i + 1]);
							back_pix.push(canvasData.data[i + 2]);
							back_pix.push(canvasData.data[i + 3]);
							canvasData.data[i] = 0x00;
							canvasData.data[i + 1] = 0x00;
							canvasData.data[i + 2] = 0x00;
							canvasData.data[i + 3] = 0xff;
						}
					}
				}
				ctx.putImageData(canvasData, 0, 0);
				$("idPromptSpan").innerHTML = "/*请单击选择椭圆垂直方向上的一个顶点*/";
			}
			else if(clickCount == 3) {
				var ry;
				if(pts[2][1] > pts[0][1])
					ry = pts[2][1] - pts[0][1];
				else
					ry = pts[0][1] - pts[2][1];
				restore();
				draftEllipse(pts[0][0], pts[0][1], rightpos - pts[0][0], ry, color_r, color_g, color_b, 0xff, -1, -1, -1, -1, 1);
				prim_list.push(new primitive(task_type, color_r, color_g, color_b, [pts[0][0], pts[0][1], rightpos - pts[0][0], ry]));
				pts.splice(0, pts.length);
				clickCount = 0;
				$("idPromptSpan").innerHTML = "/*请点击画布以选择椭圆中心*/"
			}
		}
		else if(task_type == 6) {
			if(clickCount == 1) {
				box_mark(pts[0][0], pts[0][1], 0x00, 0x00, 0x00, 0xff);
				$("idPromptSpan").innerHTML = "/*请按顺序单击选择其他控制点，双击选择终点，连同首尾点最多选六个控制点*/";
			}
			else if(clickCount <= 5) {
				clearTimeout(timeoutID);
				timeoutID= window.setTimeout(function(){
					box_mark(pts[clickCount - 1][0], pts[clickCount - 1][1], 0x00, 0x00, 0x00, 0xff);
				}, 200);
			}
			else {
				restore();
				// TODO: 考虑实现可变精度
				// TODO: 考虑画穿过给定点的曲线
				// TODO: 考虑鼠标拖放
				draftCurveBezier(1024, pts, color_r, color_g, color_b, 0xff);
				prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
				pts.splice(0, pts.length);
				clickCount = 0;
				$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
			}
		}
		else if(task_type == 7) {
			if(clickCount == 1) {
				box_mark(pts[0][0], pts[0][1], 0x00, 0x00, 0x00, 0xff);
				$("idPromptSpan").innerHTML = "/*请按顺序单击选择其他控制点，双击选择终点，连同首尾点最多选六个控制点*/";
			}
			else if(clickCount <= 5) {
				clearTimeout(timeoutID);
				timeoutID= window.setTimeout(function(){
					box_mark(pts[clickCount - 1][0], pts[clickCount - 1][1], 0x00, 0x00, 0x00, 0xff);
				}, 200);
			}
			else {
				restore();
				draftCurveBspline(256, pts, color_r, color_g, color_b, 0xff);
				pts.push(bspline_k);
				prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
				pts.splice(0, pts.length);
				clickCount = 0;
				$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
			}
		}
		else if(task_type > 7)
			transClick();
	});
	
	cv.addEventListener("dblclick", function(e) {
		if((task_type == 3 || task_type == 4) && clickCount >= 3) {
			clearTimeout(timeoutID);
			clickCount--;
			pts.pop();
			var sx = pts[clickCount - 2][0], sy = pts[clickCount - 2][1], ex = pts[clickCount - 1][0], ey = pts[clickCount - 1][1];
			if(task_type == 3)
				draftDDALine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
			else
				draftBresenhamLine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
			if(clickCount > 2) {
				var sx = pts[clickCount - 1][0], sy = pts[clickCount - 1][1], ex = pts[0][0], ey = pts[0][1];
				if(task_type == 3)
					draftDDALine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
				else
					draftBresenhamLine(sx, sy, ex, ey, color_r, color_g, color_b, 0xff);
			}
			prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
			pts.splice(0, pts.length);
			clickCount = 0;
			$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
		}
		else if(task_type == 6 && clickCount >= 3) {
			clearTimeout(timeoutID);
			clickCount--;
			pts.pop();
			restore();
			draftCurveBezier(1024, pts, color_r, color_g, color_b, 0xff);
			prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
			pts.splice(0, pts.length);
			clickCount = 0;
			$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
		}
		else if(task_type == 7 && clickCount >= 3) {
			clearTimeout(timeoutID);
			clickCount--;
			pts.pop();
			restore();
			draftCurveBspline(256, pts, color_r, color_g, color_b, 0xff);
			pts.push(bspline_k);
			prim_list.push(new primitive(task_type, color_r, color_g, color_b, pts.slice()));
			pts.splice(0, pts.length);
			clickCount = 0;
			$("idPromptSpan").innerHTML = "/*请点击画布以选中起点*/";
		}
	});
}