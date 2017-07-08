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
	currentWord: '',
	displayWord: '',
	hasWon: false,
	hasLost: false,
	remainingGuesses: 6,
	//Didn't feel like going through the trouble of using an API.
	randomWords: ['acorn','zebra','hello','sunset','javascript','nerd','loser','rockstar','banana'],

	init: function(){
		game.clearGame();
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
		game.ctx.fillText("Guesses Remaining: " + game.remainingGuesses,10,100)
		if(game.hasWon){
			game.ctx.fillText("You Won!", 250,50);
		}
		if(game.hasLost){
			game.ctx.fillText("You Lost :(", 250,50);
		}
		game.ctx.fillText("Word(" + game.currentWord.length + " letters): " + game.displayWord, 10, 150);
		game.ctx.fillText("Guessed: " + game.lettersGuessed.toString(), 10, 200);
	},
	processKey: function(key){
		if(!game.hasWon && !game.hasLost){
			if(game.currentWord.includes(key)){
				for(var i = 0; i < game.currentWord.length;i++){
					if(game.currentWord.charAt(i) === key){
						game.displayWord = game.replaceAt(game.displayWord, i, key);
					}
				}
				if(game.displayWord === game.currentWord){
					console.log("Win");
					game.hasWon = true;
					game.totalWins += 1;
				}
			} else if(!game.lettersGuessed.includes(key)){
				if(game.validate(key)){
					game.lettersGuessed.push(key);
					game.remainingGuesses -= 1;
					if(game.remainingGuesses === 0){
						game.hasLost = true;
						game.totalLosses += 1;
						game.displayWord = game.currentWord;
					}
				}
			}
		} else {
			game.clearGame();
		}
	},
	replaceAt: function(string, index, replace) {
  		return string.substring(0, index) + replace + string.substring(index + 1);
	},
	validate: function(strValue){
		var objRegExp  = /^[a-z]+$/;
  		return objRegExp.test(strValue);
	},
	clearGame: function(){
		game.hasWon = false;
		game.hasLost = false;
		game.displayWord = '';
		game.lettersGuessed = [];
		game.remainingGuesses = 6;
		game.currentWord = game.randomWords[Math.floor(Math.random()*game.randomWords.length)]
		for(var i = 0; i < game.currentWord.length; i++){
			game.displayWord = game.displayWord.concat("_");
		}
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