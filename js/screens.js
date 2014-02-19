function gameScreenInit()
{
	var dfw1 = Gfx.loadTexture("dan_f_walk_1");
	var dfw2 = Gfx.loadTexture("dan_f_walk_2");

    var obstacleTextureNames = [
        "stapler",
        "desk",
        "laptop",
        "chair"
    ];

    var obstacleTextures = [];

    for ( var i = 0; i < obstacleTextureNames.length; i++ )
    {
        obstacleTextures.push( Gfx.loadTexture(obstacleTextureNames[i]) );
    }

    this.obstacles = [];

    for( var j = 0; j < 10; j++ )
    {
        var ob = new PIXI.Sprite( arrayGetRandom(obstacleTextures) );
        ob.position.x = Math.random()*STAGE_W;
        ob.position.y = Math.random()*STAGE_H;
        ob.scale = new PIXI.Point(OBJECT_SCALE,OBJECT_SCALE);
        ob.anchor.x = .5;
        ob.anchor.y = .5;
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

	this.stage.setBackgroundColor(0x66CC99);
}

function gameScreenUpdate(delta)
{
	if (Input.anyKeyDown(KEYS_UP))
    {
      this.dan.position.y -= PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_DOWN))
    {
      this.dan.position.y += PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_LEFT))
    {
      this.dan.position.x -= PLAYER_SPEED*delta;
    }
    if (Input.anyKeyDown(KEYS_RIGHT))
    {
      this.dan.position.x += PLAYER_SPEED*delta;
    }

    var halfw = this.dan.width/2;
    var halfh = this.dan.width/2;

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
   	else if(this.dan.position.y > STAGE_H - halfh)
    {
    	this.dan.position.y = STAGE_H - halfh;
    }

    this.stage.children.sort(spriteZSort);
}

var GameScreen = new Screen(gameScreenInit,gameScreenUpdate);