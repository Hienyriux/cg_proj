$("idResetCanvas").onclick = function() {
	$("idDialog1").style.top = "150px";
	$("idDialog1").style.left = "350px";
	$("idDialog1").style.display = "block";
}

$("idCloseButton1").onclick = function() {
	$("idDialog1").style.display = "none";
}

$("idButton1").onclick = function() {
	var w = $("idInput1_1").value;
	var h = $("idInput1_2").value;
	var res_w = parseInt(w);
	var res_h = parseInt(h);
	if(!(isNaN(res_w) || isNaN(res_h) || res_w <= 0 || res_h <= 0))
	{
		$("idCanvas").width = res_w;
		$("idCanvas").height = res_h;
		canvasWidth = res_w;
		canvasHeight = res_h;
		canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
		prim_list.splice(0, prim_list.length);
	}
	$("idDialog1").style.display = "none";
}

$("idSetColor").onclick = function() {
	$("idDialog3").style.top = "150px";
	$("idDialog3").style.left = "350px";
	$("idDialog3").style.display = "block";
}

$("idCloseButton3").onclick = function() {
	$("idDialog3").style.display = "none";
}

$("idButton3").onclick = function() {
	var r = $("idInput3_1").value;
	var g = $("idInput3_2").value;
	var b = $("idInput3_3").value;
	var res_r = parseInt(r);
	var res_g = parseInt(g);
	var res_b = parseInt(b);
	if(!(isNaN(res_r) || isNaN(res_g) || isNaN(res_b) || res_r < 0 || res_g < 0 || res_b < 0 || res_r > 255 || res_g > 255 || res_b > 255))
	{
		color_r = res_r;
		color_g = res_g;
		color_b = res_b;
		var str_r = res_r.toString(16);
		var str_g = res_g.toString(16);
		var str_b = res_b.toString(16);
		if(str_r.length < 2)
			str_r = "0" + str_r;
		if(str_g.length < 2)
			str_g = "0" + str_g;
		if(str_b.length < 2)
			str_b = "0" + str_b;
		$("idColorSpan").style.backgroundColor = "#" + str_r + str_g + str_b;
	}
	$("idDialog3").style.display = "none";
}