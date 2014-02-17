var canvas = document.createElement("canvas");
canvas.id = 'display';
canvas.width = STAGE_W;
canvas.height = STAGE_H;
document.body.appendChild(canvas);

var scr = GameScreen;

var renderer = PIXI.autoDetectRenderer(STAGE_W, STAGE_H, canvas);

var oldTime = new Date();
var newTime = new Date();

var deltas = [];
var framesBack = 60*3;
var updatesPerSec = 1;
var fps = 0;
var secToUpdate = 1/updatesPerSec;

function update()
{

    requestAnimFrame( update );

    newTime = new Date();
    var delta = (newTime.getTime()-oldTime.getTime())/1000.0;
    oldTime = newTime;

    if ( DEBUG_MODE && DEBUG_FPS )
    {
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
        debug(Math.round(fps) + " FPS");
      }

      secToUpdate -= delta;
    }

    var cur = scr;

    renderer.render(cur.stage);

    cur.update(delta);
}

Input.init({mouseAnchor: canvas});
requestAnimFrame( update );