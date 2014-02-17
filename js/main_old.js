var STAGE_W = 800*3/4;
var STAGE_H = 600*3/4;

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

// load textures
var textureBunny = PIXI.Texture.fromImage("img/bunny1.png");
var textureGreen = PIXI.Texture.fromImage("img/bunny2.png");

var twf1 = PIXI.Texture.fromImage("img/dan_f_walk_1.png");
var twf2 = PIXI.Texture.fromImage("img/dan_f_walk_2.png");

textureBunny.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
textureGreen.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
twf1.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
twf2.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

// create new Sprite using the texture

var text = new PIXI.Text("",{font: "24px Arial", fill: "cyan"});
text.position.x = 6;
text.position.y = 6;

//var bunny = new PIXI.Sprite(textureBunny);
var bunny = new PIXI.MovieClip([twf1,twf2]);
bunny.animationSpeed = 0.1;
bunny.play();

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = STAGE_W/2;
bunny.position.y = STAGE_H/2;

var filter = new PIXI.InvertFilter();
//bunny.filters = [filter];
bunny.scale = new PIXI.Point(4,4);

function addObstacle()
{
  var ob = new PIXI.Sprite(textureGreen);
  ob.position.x = Math.random()*STAGE_W;
  ob.position.y = Math.random()*STAGE_H;
  while(ob.position.x < bunny.position.x + 50 && ob.position.x > bunny.position.x - 50)
  {
    ob.position.x = Math.random()*STAGE_W;
  }

  while(ob.position.y < bunny.position.y + 50 && ob.position.y > bunny.position.y - 50)
  {
    ob.position.y = Math.random()*STAGE_H;
  }

  if(arguments.length == 2)
  {
    ob.position.x = arguments[0];
    ob.position.y = arguments[1];    
  }

  ob.anchor.x = 0.5;
  ob.anchor.y = 0.5;

  ob.name = "obstacle";
  stage.addChild(ob);

  return ob;
}

for (var i = 0; i < 100; i++)
{
  addObstacle();
}

stage.addChild(bunny);

bunny.interactive = true;
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

    // bunny.rotation += 2*Math.PI*delta/5;

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

    if (Input.anyKeyDown(KEYS_UP))
    {
      bunny.position.y -= PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_DOWN))
    {
      bunny.position.y += PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_LEFT))
    {
      bunny.position.x -= PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_RIGHT))
    {
      bunny.position.x += PLAYER_SPEED*delta;
    }

    var pBounds = bunny.getBounds();

    for(var i = 0; i < stage.children.length; i++)
    {
      var ob = stage.children[i];
      if (!exists(ob.name) || ob.name != "obstacle")
      {
        continue;
      }
      
      var oBounds = ob.getBounds();
      var pBounds = bunny.getBounds();

      // var touching = oBounds.contains(bunny.position.x, bunny.position.y);

      var touching = recTouch(oBounds,pBounds,-5);

      if (touching)
      {
        debug("OMG TOUCHING");
        stage.removeChild(ob);
        i--;
      }
    }

    // console.log(bunnies[0].rotation);

    // render the stage   
    renderer.render(stage);
}

Input.init({mouseAnchor: canvas});
renderer.render(stage);
requestAnimFrame( animate );