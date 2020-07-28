# cg_proj
Project of Nanjing University's Introduction to Computer Graphics course in 2019 autumn  
一个基于HTML5 canvas的网页端的画图小程序  
+ 可以画线段, 多边形, 椭圆, 贝塞尔曲线, B样条曲线  
+ 可以进行简单的图元变换: 平移, 旋转(除椭圆外), 缩放, 线段裁剪
+ 可以改变画布尺寸, 画笔颜色
+ 可以保存图片, ~~加载图片~~  


下面是说明书:  
### 程序界面
浏览器打开`mypaint.html`后，你会看到如下界面  
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc29.png](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc29.png)

### 设置画布大小
点击`设置画布大小`，在弹出窗口中输入宽高，点击`确定`，可以看到画布大小改变了，并且画布内容清空了
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc30.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc30.gif)

### 保存图片
点击`保存图片`，在弹出窗口中输入文件名，点击`确定`，便可下载文件到本地
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc31.png](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc31.png)  
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc32.png](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc32.png)  
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc33.png](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc33.png)

### 设置颜色
点击`设置颜色`，在弹出窗口中输入RGB值，点击`确定`，可以看到当前颜色改变了（下面的演示中，在更改颜色后，重新画了个椭圆）  
![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc34.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc34.gif)


### 绘制图形

#### *绘制线段*
点击`绘制图形`，选择`线段`标签下的`DDA`或`Bresenham`单选按钮，关闭窗口后便可以开始绘制。注意，**一定要点击窗口右上方的关闭按钮，否则无法继续进行任何操作**！  

关闭窗口后，你需要在画布中点击两次，第一次点击位置为线段起点，第二次为线段终点。两次点击完成后，所要绘制的线段便会出现在画布中，此时，你可以使用同样的算法绘制新线段，或者点击`绘制图形`，绘制其他图形；或者点击`图元变换`，对刚刚绘制的线段进行变换

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc35.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc35.gif)

#### *绘制多边形*
点击`绘制图形`，选择`多边形`标签下的`DDA`或`Bresenham`单选按钮，关闭窗口后便可以开始绘制

点击画布依次确定多边形顶点，若想闭合多边形，请***双击***画布，双击位置即为多边形最后一个顶点。双击后，最后两个顶点间，以及最后一个顶点与第一个顶点间会出现连线

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc36.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc36.gif)

#### *绘制椭圆*
点击`绘制图形`，选择`椭圆`标签下的`中点椭圆算法`单选按钮，关闭窗口后便可以开始绘制

第一次点击位置为椭圆中心，用小方框标记；第二次点击确定左（或右）顶点，只取点击位置横坐标，只要点击一次，另一侧的顶点自动生成，顶点位置用小竖线标记；第三次点击确定上（或下）顶点，只取点击位置纵坐标。三次点击后椭圆便会出现在画布上

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc37.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc37.gif)

#### *绘制贝塞尔曲线*
点击`绘制图形`，选择`曲线`标签下的`Bezier`单选按钮，关闭窗口后便可以开始绘制

点击画布依次确定曲线控制点，最多允许6个控制点；如果控制点个数少于6，最后一个控制点需要***双击***确定

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc38.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc38.gif)

#### *绘制B样条曲线*

点击`绘制图形`，选择`曲线`标签下的`B_Spline`单选按钮，关闭窗口后便可以开始绘制

在弹出窗口中输入曲线次数，点击`确定`

然后，点击画布依次确定曲线控制点，最多允许6个控制点；如果控制点个数少于6，最后一个控制点需要***双击***确定

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc39.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc39.gif)

### 图元变换

#### *平移变换*

点击`图元变换`，选择`平移`单选按钮，关闭窗口后，每个图元上出现若干小方框，表示该图元的参数点。点击欲变换图元上的任意一个小方框后，该图元中心位置会出现一个***红色小方框***。接下来，点击画布，点击位置即为该***红色方框***平移的目标位置。这里的思想是用一个点代替整个图元来确定平移量。

平移后，各图元上的参数点标记依然存在，此时，你可继续对其他图元进行平移，或者进行其他变换或绘制操作

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc40.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc40.gif)

#### *旋转变换*

点击`图元变换`，选择`旋转`单选按钮，关闭窗口。首先，点击图元上任意一个小方框以选中目标图元。接着，点击旋转中心，旋转中心用***红色小方框***标出。最后，点击画布，确定旋转角度，这里是以横轴为极轴，逆时针为正方向，点击位置与旋转中心连线与极轴夹角即为旋转角度。

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc41.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc41.gif)

#### *缩放变换*

点击`图元变换`，选择`缩放`单选按钮。首先，点击图元上任意一个小方框以选中目标图元。接着，点击缩放中心，缩放中心用***红色小方框***标出。最后，在弹出窗口中输入缩放倍数，点击`确定`

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc42.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc42.gif)

#### *线段裁剪*

点击`图元变换`，选择`裁剪`标签下的`Cohen-Sutherland`或`Liang-Barsky`单选按钮，关闭窗口。首先，点击图元上任意一个小方框以选中目标图元（仅限线段）。然后，点击画布以选择裁剪窗口的一个顶点，该顶点由***红色小方框***标出。最后，选择裁剪窗口中，与前面的顶点对角的顶点

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc43.gif](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc43.gif)

### 打开图片

如果你需要为你的画布设置一张***背景图片***，你可以使用这一功能。该功能允许你打开一张BMP图片，将其作为画布的背景，并以该图片的分辨率设置画布的宽高。由于无法从BMP本身提取任何图元信息，所以即使打开的是刚刚保存的画布图片，该图片中的图元也不可参与变换。下图展示了在加载的背景图上绘制的多边形

![https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc45.png](https://github.com/Hienyriux/hienyriux_pics/blob/master/grpc45.png)
