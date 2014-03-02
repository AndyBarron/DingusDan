function gameScreenInit()
{
    var songFile = "happy.mp3";
    var songName = trimFilename(songFile);
    Sounds.addLoadListener(songName,function(){Sounds.loop(songName)});
    Sounds.load(songFile,"crash.wav");
    //Sounds.loop("happy");
	var dfw1 = Images.getTexture("dan_f_walk_1.png");
	var dfw2 = Images.getTexture("dan_f_walk_2.png");

    var obstacleTextureNames = [
        "stapler.png",
        "desk.png",
        "laptop.png",
        "chair.png"
    ];

    this.obstacleTextures = [];
    var obstacleTextures = this.obstacleTextures;

    for ( var i = 0; i < obstacleTextureNames.length; i++ )
    {
        obstacleTextures.push( Images.getTexture(obstacleTextureNames[i]) );
    }

    this.obstacles = [];
    this.exploding = [];

    for( var j = 0; j < 10; j++ )
    {
        var ob = new PIXI.Sprite( arrayGetRandom(obstacleTextures) );
        initObstacle(ob);
        this.obstacles.push(ob);
        this.stage.addChild(ob);
    }

	this.dan = new PIXI.MovieClip([dfw1,dfw2]);
	this.dan.animationSpeed = 0.12;
	this.dan.play();

	this.dan.anchor.x = .5;
	this.dan.anchor.y = .5;
	this.dan.scale = new PIXI.Point(OBJECT_SCALE,OBJECT_SCALE);

	this.dan.position.x = STAGE_W/2;
	this.dan.position.y = STAGE_H/2;

	this.stage.addChild(this.dan);

}

function initObstacle(ob)
{
    ob.position.x = Math.random()*(STAGE_W-OBSTACLE_EDGE_CLEARANCE*2)+OBSTACLE_EDGE_CLEARANCE;
    ob.position.y = Math.random()*(STAGE_H-OBSTACLE_EDGE_CLEARANCE*2)+OBSTACLE_EDGE_CLEARANCE;
    ob.scale = new PIXI.Point(OBJECT_SCALE,OBJECT_SCALE);
    ob.anchor.x = .5;
    ob.anchor.y = 1;
    ob.rotation = 0;
}

function getZScale(ob)
{
    if(DEPTH_SCALE)
    {
        var min = DEPTH_SCALE_MIN;
        var max = DEPTH_SCALE_MAX;
        var prog = ob.position.y/STAGE_H;
        return min + prog*(max-min);
    }
    else return 1;
}

function gameScreenUpdate(delta)
{
    var pScale = DEPTH_SCALE ? getZScale(this.dan) : 1;
    // process input

    var prUp = Input.anyKeyDown(KEYS_UP);
    var prDown = Input.anyKeyDown(KEYS_DOWN);
    var prLeft = Input.anyKeyDown(KEYS_LEFT);
    var prRight = Input.anyKeyDown(KEYS_RIGHT);

    var mUp = prUp && !prDown;
    var mDown = prDown && !prUp;
    var mLeft = prLeft && !prRight;
    var mRight = prRight && !prLeft;

    var playerMoving = mUp || mDown || mLeft || mRight;

    if(playerMoving)
    {

        var dx = 0;
        var dy = 0;

        if (mUp || mDown)
        {
          dy = PLAYER_SPEED * delta * pScale * (mDown ? 1 : -1) * ((mLeft || mRight) ? 1/DIAG : 1);
        }

        if (mLeft || mRight)
        {
          dx = PLAYER_SPEED * delta * pScale * (mRight ? 1 : -1) * ((mUp || mDown) ? 1/DIAG : 1);
        }

        this.dan.position.x += dx;
        this.dan.position.y += dy;

    }

    // limit player to screen
    var halfw = this.dan.width/2;
    var halfh = this.dan.height/2;

    if(this.dan.position.x < halfw)
    {
    	this.dan.position.x = halfw;
    }
   	else if(this.dan.position.x > STAGE_W - halfw)
    {
    	this.dan.position.x = STAGE_W - halfw;
    }

    if(this.dan.position.y < halfh)
    {
    	this.dan.position.y = halfh;
    }
   	else if(this.dan.position.y > STAGE_H-halfh)
    {
    	this.dan.position.y = STAGE_H-halfh;
    }

    // collision checking
    for(var i = 0; i < this.obstacles.length; i++)
    {
        var ob = this.obstacles[i];
        var colScale = DEPTH_SCALE ? getZScale(ob) : 1;
        if(recTouch(ob.getBounds(),this.dan.getBounds(),-15*colScale))
        {
            Sounds.play("crash");
            //this.stage.removeChild(ob);
            arrayRemoveElement(this.obstacles,ob);
            i--;
            ob.exp_rot = 2*(2*Math.PI-Math.random()*4*Math.PI);
            ob.exp_dist = ob.height * (1+Math.random()*3);
            ob.exp_ang = Math.random()*2*Math.PI;
            this.exploding.push(ob);
        }
    }

    // animate exploding
    for(var j = 0; j < this.exploding.length; j++)
    {
        var ex = this.exploding[j];
        var percentInc = delta/OBSTACLE_EXPLODE_TIME;
        ex.alpha -= percentInc;
        var percent = 1-ex.alpha;
        ex.rotation = percent*ex.exp_rot;
        var dist = ex.exp_dist * percentInc;
        var ang = ob.exp_ang;
        ex.position.x += dist*Math.cos(ang);
        ex.position.y += dist*Math.sin(ang);
        ex.scale.x += percentInc*OBJECT_SCALE;
        ex.scale.y += percentInc*OBJECT_SCALE;
        if(ex.alpha <= 0)
        {
            arrayRemoveElement(this.exploding, ex);
            i--;
            ex.alpha = 1;
            ex.texture = arrayGetRandom(this.obstacleTextures);
            initObstacle(ex);
            this.obstacles.push(ex);
        }
    }

    // sort z order
    this.stage.children.sort(spriteZSort);

    if(DEPTH_SCALE)
    {
        // size based on z?
        for(var k = 0; k < this.stage.children.length; k++)
        {
            var ch = this.stage.children[k];
            var scale = getZScale(ch)*OBJECT_SCALE;
            ch.scale.x = scale;
            ch.scale.y = scale;
        }
    }
}

var GameScreen = new Screen({init: gameScreenInit, update: gameScreenUpdate, backgroundColor: 0x66CC99});
GameScreen.init();