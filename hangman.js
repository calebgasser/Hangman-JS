var backgroudMusic = new Audio('./assets/audio/main_theme_01.wav');
backgroudMusic.loop = true;
backgroudMusic.play();
var fps = 1000 / 60;


var game = {
	canvas: {},
	ctx: {},
	lettersGuessed: [],
	totalWins: 0,
	totalLosses: 0,
	currentWord: 'hello',
	displayWord: '',

	init: function(){
		for(var i = 0; i < game.currentWord.length; i++){
			game.displayWord = game.displayWord.concat("_");
		}
		game.canvas = document.getElementById("myCanvas");
		game.ctx = game.canvas.getContext("2d");
		game.ctx.font = "30px 'VT323'";
		game.ctx.fillStyle = "#3BCC37";
	},
	update: function(){
		game.draw();
	},
	draw: function(){
		game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
		game.ctx.fillText("Losses: " + game.totalLosses, 500, 50);
		game.ctx.fillText("Wins: " + game.totalWins,10,50);
		game.ctx.fillText("Word(" + game.currentWord.length + " letters): " + game.displayWord, 10, 150);
		game.ctx.fillText("Guessed: " + game.lettersGuessed.toString(), 10, 200);
	},
	processKey: function(key){

		if(game.currentWord.includes(key)){
			for(var i = 0; i < game.currentWord.length;i++){
				if(game.currentWord.charAt(i) === key){
					game.displayWord = game.replaceAt(game.displayWord, i, key);
				}
			}
		} else if(!game.lettersGuessed.includes(key)){
			if(game.validate(key)){
				game.lettersGuessed.push(key);
				if(game.lettersGuessed.length%12 === 0){
					console.log('next line');
				}
			}
		}
		console.log(game.displayWord);
	},
	replaceAt: function(string, index, replace) {
  		return string.substring(0, index) + replace + string.substring(index + 1);
	},
	validate: function(strValue){
		var objRegExp  = /^[a-z]+$/;
  		return objRegExp.test(strValue);
	}
}

$(function(){
	game.init();

	setInterval(game.update, fps);
	$('#sound').on('click',function(){
		console.log(backgroudMusic);
		if(backgroudMusic.paused){
			backgroudMusic.play();
		} else {
			backgroudMusic.pause();
		}
	});
	$(document).on('keyup', function(event){
		game.processKey(event.key);
	});
});