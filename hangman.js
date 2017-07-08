var backgroudMusic = new Audio('./assets/audio/main_theme_01.wav');
var winSound = new Audio('./assets/audio/win.wav');
var loseSound = new Audio('./assets/audio/lose.wav');
var wrongSound = new Audio('./assets/audio/wrong.wav');
var correctSound = new Audio('./assets/audio/correct.wav');
backgroudMusic.loop = true;
backgroudMusic.volume = 0.2;
backgroudMusic.play();
var fps = 1000 / 60;

var glass = new Image();
glass.src = './assets/images/glass_texture_clear.png';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

var background = {
	canvas: {},
	ctx: {},
	star: [],
	particles: [],
	numOfParticles: 100,
	particleMaxLive: 200,
	particleMinLive: 100,

	init: function(){
		background.canvas = document.getElementById('backgroundCanvas');
		background.ctx = background.canvas.getContext('2d');
		// background.ctx.canvas.width = window.innerWidth;
		// background.ctx.canvas.height = window.innerHeight;
		background.star[0] = new Image();
		background.star[1] = new Image();
		background.star[0].src = './assets/images/sparkle1.png';
		background.star[1].src = './assets/images/sparkle2.png';
	},
	update: function(){
		background.particalUpdate();
		background.particalPopulate();
		background.particaleDraw();
	},
	createParticle: function(x,y,life){
		return {
			posX: x,
			posY: y,
			lifeTime: life,
			animReset: life/10,
			anim: life/10,
			currentFrame: 0,
			frames: [background.star[0],background.star[1]]
		}
	},
	particalUpdate: function(){
		for(var i = 0; i < background.particles.length; i++){
			background.particles[i].lifeTime -= 1;
			background.particles[i].anim -= 1;
			console.log(background.particles[i].anim);
			if(background.particles[i].anim <= 0){
				if(background.particles[i].currentFrame >= background.particles[i].frames.length-1){
					background.particles[i].currentFrame = 0;
				} else {
					background.particles[i].currentFrame += 1;
				}
				background.particles[i].anim = background.particles[i].animReset;
			}
			if(background.particles[i].lifeTime <= 0){
				background.particles.splice(i,1);
			}
		}
	},
	particalPopulate: function(){
		if(background.particles.length <= background.numOfParticles){
			for(i = 0; i < background.numOfParticles - background.particles.length; i++){
				var position = background.getRandomPosition();
				background.particles.push(background.createParticle(
					position[0],
					position[1],
					getRandomIntInclusive(background.particleMinLive,background.particleMaxLive)
					));
			}
		}

	},
	particaleDraw: function(){
		background.ctx.clearRect(0, 0, background.canvas.width, background.canvas.height);
		for(var i = 0; i < background.particles.length; i++){
			background.ctx.drawImage(
				background.particles[i].frames[background.particles[i].currentFrame],
				background.particles[i].posX,
				background.particles[i].posY,
				64,
				64)
		}
	},
	getRandomPosition: function(){
		return [getRandomIntInclusive(0,background.canvas.width),getRandomIntInclusive(0,background.canvas.height)];
	}
}

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
	randomWords: ['acorn','zebra','hello','sunset','javascript','nerd','loser','rockstar','banana',
	'monty', 'java', 'pneumonoultramicroscopicsilicovolcanoconiosis', 'tokyo', 'hangman', 
	'anime', 'bird', 'toast','videogame','arcade','up','i','boston','carrot','warcraft','viking',
	'westeros'],

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
		glass.onload = function(){
			game.ctx.drawImage(glass,0,0,638,262);
		}
		game.ctx.drawImage(glass,0,0,638,330);
	},
	processKey: function(key){
		if(!game.hasWon && !game.hasLost){
			if(game.currentWord.includes(key)){
				correctSound.currentTime = 0;
				correctSound.play();
				for(var i = 0; i < game.currentWord.length;i++){
					if(game.currentWord.charAt(i) === key){
						game.displayWord = game.replaceAt(game.displayWord, i, key);
					}
				}
				if(game.displayWord === game.currentWord){
					winSound.play();
					game.hasWon = true;
					game.totalWins += 1;
				}
			} else if(!game.lettersGuessed.includes(key)){
				if(game.validate(key)){
					game.lettersGuessed.push(key);
					game.remainingGuesses -= 1;
					wrongSound.currentTime = 0;
					wrongSound.play();
					if(game.remainingGuesses === 0){
						loseSound.play();
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
	background.init();
	game.init();

	setInterval(background.update,1000/30);
	setInterval(game.update, fps);
	$('#sound').on('click',function(){
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