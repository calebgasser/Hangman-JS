var backgroudMusic = new Audio('./assets/audio/main_theme_01.wav');
backgroudMusic.loop = true;
backgroudMusic.play();

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillStyle = "#FFFFFF";
ctx.strokeText("Hello World",10,50);
$(function(){
	$('#sound').on('click',function(){
		backgroudMusic.pause();
	})
})