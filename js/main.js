var STAGE_W = 800;
var STAGE_H = 600;

// console.log(Object.keys(PIXI).sort());

var canvas = document.createElement("canvas");
canvas.id = 'display';
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.body.appendChild(canvas);

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66CC99,true); // make interactive!

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, canvas);

// add the renderer view element to the DOM
// document.body.appendChild(renderer.view);

Input.init({mouseAnchor: canvas});
requestAnimFrame( animate );

// load textures
var textureBunny = PIXI.Texture.fromImage("img/bunny1.png");

// create new Sprite using the texture

var obstacles = [];

var text = new PIXI.Text("",{font: "18px Arial", fill: "cyan"});
text.position.x = 6;
text.position.y = 6;

var bunny = new PIXI.Sprite(textureBunny);

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = STAGE_W/2;
bunny.position.y = STAGE_H/2;

stage.addChild(bunny);

bunny.setInteractive(true);
bunny.mousedown = (function(){debug("that tickles!");});

stage.addChild(text);

var oldTime = new Date();
var newTime = new Date();

var deltas = [];
var framesBack = 60*3;
var updatesPerSec = 1;
var fps = 0;
var secToUpdate = 1/updatesPerSec;

function animate()
{

    requestAnimFrame( animate );

    newTime = new Date();
    var delta = (newTime.getTime()-oldTime.getTime())/1000.0;
    oldTime = newTime;

    bunny.rotation += 2*Math.PI*delta;

    deltas.push(delta);

    while(deltas.length > framesBack)
    {
      deltas.splice(0,1);
    }

    if(secToUpdate <= 0) {

      var total = 0;
      for(var i = 0; i < deltas.length; i++)
      {
        total += deltas[i];
      }
      var avg = total/deltas.length;

      fps = 1/avg;

      secToUpdate += 1/updatesPerSec;
      text.setText( DEBUG_MODE ? (Math.round(fps) + " FPS") : "" );
    }

    secToUpdate -= delta;

    // console.log(bunnies[0].rotation);

    // render the stage   
    renderer.render(stage);
}