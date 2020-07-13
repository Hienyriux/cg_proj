var color_r = 0, color_g = 0, color_b = 0;
var task_type = 0;
// 为旋转中心和旋转角度，缩放中心和缩放倍率建立存储结构
function primitive(type, r, g, b, features) {
	this.type = type;
	this.r = r;
	this.g = g;
	this.b = b;
	this.features = features;
}
var prim_list = [];

var $ = function(id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var cv = $("idCanvas");
var ctx = cv.getContext("2d");
var canvasWidth = cv.width;
var canvasHeight = cv.height;
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var clickCount = 0;
var pts = [];
var back_pix = [];
var is_first_bind = 1;
var bspline_k = 3;
var centx = 0, centy = 0;
var scale_k = 1.0;
var prim_i = 0;