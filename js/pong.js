//declarer varibles image
var balle = new Image();
var joueur = new Image();
var ordi = new Image();
var fond = new Image();

//linker les images aux var
balle.src = "img/balle.jpg";
joueur.src = "img/raquette.jpg";
ordi.src = "img/raquette.jpg";
fond.src = "img/fond.jpg";


//charger le code quand la page est affichée
window.onload = function() {
	//recupérer zone dessin canvas dans le html
	var canvas = document.getElementById("canvas");
	//donner le context, ici 2d
	var context = canvas.getContext("2d");
	
	//definir les variables
	var W = 512;
	var H = 256;
	var p1= {}; // varibles avec {} = objet vide
	var p2= {};
	var b = {};
	var mouseX;
	var mouseY;
	
		//une fois toutes les variables crées on initialise le jeu
		init();
		
		//fonction int
		function init() {
			canvas.width = W;
			canvas.height = H;
			
			b.w = balle.width;
			b.h = balle.height;
			b.x = W / 2 - 5;
			b.y = H / 2 - 5;
			b.vX = 2;
			b.vY = 2;
			
			
			
			p1.w = joueur.width;
			p1.h = joueur.height;
			p1.x = 15;
			p1.y = (H - p1.h) / 2;
			p1.score = 0;
			
			p2.w = ordi.width;
			p2.h = ordi.height;
			p2.x = W - 25;
			p2.y = (H - p2.h) / 2;
			p2.score = 0;
			
			mouseY = p1.y;
			canvas.addEventListener("mousemove", souris, false);
			setInterval(main, 15);
		}
		
		
		//fonction principal
		function main() {
			
			//gestion A.I ordi
			if (b.y<p2.y){
				p2.y = p2.y - 5;
			}
			if (b.y>p2.y){
				p2.y = p2.y + 5;
			}
			
			//gestion deplacement joueur
			p1.y = mouseY;
			
			//on limite le deplacement des paddles
			limites(p1);
			limites(p2);
			
			//code de la balle - "with" permet de dire que l'on va coder sur un objet en particulier
			//cela permet de racourcir les objets au lieu d'écrire b.x on ecrira juste x
			with (b) {
				x = x + vX; //initialisation de la vitesse x
				y = y + vY; //initialisation de la vitesse y
				
				//fonction pour dire que si la balle touche le plafond ou le sol alors inverse toi
				if (y<0) {
					y=0, vY = vY * -1;
					
				}
				if (y>256-h) {
					y=256-h, vY = vY * -1;
					
				}
				//fonction pour si la balle touche l'extremité alors 1 point de plus
				if (x<0) {
					initBalle(), p2.score++;
					var snd = new Audio("sound/ping_pong_8bit_beeep.ogg"); // buffers automatically when created
					snd.play();
					
				}
				if (x>492) {
					initBalle(), p1.score++;
					var snd = new Audio("sound/ping_pong_8bit_beeep.ogg"); // buffers automatically when created
					snd.play();
				}
				//fonction pour eviter que la balle rentre dans le paddle et que la vitesse
				//s'inverse lors de la collision (donc aller dans l'autre sens)
				if (collisions(b,p1)) {
					x = p1.x + p1.w + 10;
					vX *= -1;
					var snd = new Audio("sound/ping_pong_8bit_plop.ogg"); // buffers automatically when created
					snd.play();
					vX = vX+0.2;
					vY = vY+0.2;
				}
				
				if(collisions(b,p2)) {
					x = p2.x - b.w - 10;
					vX *= -1;
					var snd = new Audio("sound/ping_pong_8bit_plop.ogg"); // buffers automatically when created
					snd.play();
					vX = vX-0.2;
					vY = vY-0.2;
				}
			}
			
			//dessin du jeu
			render();
		}
		
		function initBalle() {
			b.x = W/2 - 5;
			b.y = H/2 - 5;
			b.vY = 2;
			b.vX = 2;
		}
		
		function limites(obj) {
			if (obj.y<10){
				obj.y = 10;
			}
			if (obj.y>246-obj.h){
				obj.y = 246-obj.h;
			}
		}
		
		function collisions(A,B) {
			if (A.y+A.h < B.y || A.y > B.y+B.h || A.x > B.x+B.w || A.x+A.w < B.x)
				return false;
				return true;
			
		}
		
		function souris(e){
			if (e.x != undefined && e.y != undefined){
				mouseX = e.x;
				mouseY = e.y;
			} else {
			// Firefox patch
			mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
		}
		
		function render() {
			context.drawImage(fond,0,0);
			context.drawImage(balle, b.x, b.y);
			context.drawImage(ordi, p2.x, p2.y);
			context.drawImage(joueur, p1.x, p1.y);
			draw_score();
		}
		
		function draw_score(){
			context.fillStyle = "green";
			context.font = "24px Arial";
			context.textAlign = "right";
			context.fillText(p1.score + " ", W/2, 30);
			context.textAlign = "left";
			context.fillText(" " + p2.score, W/2, 30);
		}

}

