function Input () {}

Input.on = false;
Input.keys = {};
Input.mouse = { x:0, y:0, down:false };

Input.keyPressListeners = [];
Input.mousePressListeners = [];

Input.keyAnchor = document;
Input.mouseAnchor = document;

Input.init = function(options)
{

	if(Input.on == true)
	{
		throw "Input already initialized!";
		return false;
	}

	if(exists(options))
	{
		if(exists(options.mouseAnchor))
			Input.mouseAnchor = options.mouseAnchor;

		if(exists(options.keyAnchor))
			Input.keyAnchor = options.keyAnchor;
	}

	var keyObj = Input.keyAnchor;
	var mouseObj = Input.mouseAnchor;

	$(keyObj).keydown(Input.keyPress);
	$(keyObj).keyup(Input.keyRelease);
	$(mouseObj).mousedown(Input.mousePress);
	$(mouseObj).mouseup(Input.mouseRelease);
	$(mouseObj).mousemove(Input.mouseMove);

	// if we want to disable context menu
	// this may or may not enable right-click functionality
	// $(mouseObject).bind('contextmenu', function(e) { return false; });

	return true;
}

Input.keyPress = function(e) {
	var code = e.which;

	if ( Input.isKeyUp(code) ) 
	{
		Input.keys[code] = true;
		debugInput("key press " + code);

		for(var i = 0; i < Input.keyPressListeners.length; i++)
		{
			Input.keyPressListeners[i].call(null,code);
		}
	}

};

Input.keyRelease = function(e) {
	var code = e.which;

	if ( Input.isKeyDown(code) ) 
	{
		delete Input.keys[code];
		debugInput("key release " + code);
	}
};

Input.mouseMove = function(e){
	Input.mouse.x = e.offsetX;
	Input.mouse.y = e.offsetY;
	// debug("mouse move (" + Input.mouse.x + "," + Input.mouse.y +")");
}

Input.mousePress = function(e) {
	if ( e.which != 1 ) return;

	var coords = {x: e.offsetX, y: e.offsetY};

	debugInput("mouse press (" + coords.x + "," + coords.y + ")");

	for(var i = 0; i < Input.mousePressListeners.length; i++)
	{
		Input.mousePressListeners[i].call(null,coords);
	}
}

Input.isKeyDown = function(code)
{
	return exists(Input.keys[code]);
}

Input.isKeyUp = function(code)
{
	return !Input.isKeyDown(code);
}

function Sounds () {}

Sounds.files = {};

Sounds.init = function() {
	for (var i = 0; i < arguments.length; i++)
	{
		var sndFilename = arguments[i];
		var sndName = trimFilename(sndFilename);
		var snd = new Audio('snd/'+sndFilename);
		Sounds.files[sndName] = snd;
	}
}

Sounds.play = function(name)
{
	var sound = Sounds.files[name];
	if(exists(sound))
	{
		(new Audio(sound.src)).play();
	}
	else
	{
		debug('Sound not found: ' + name);
	}
}

function Graphics () {}

Graphics.files = [];
Graphics.fileCount = 0;
Graphics.filesLoaded = 0;
Graphics.fileList = [];

Graphics.init = function() {
	var ids = Entities.ids;
	var names = Entities.names;

	// load all images

	for(var i = 0; i < ids.length; i++)
	{
		for(var j = 0; j < names.length; j++)
		{
			var id = ids[i];
			var name = names[j];
			var filename = 'spr/'+ id + '_' + name + '.png';
			var spr = new Sprite(filename);
			if(spr.image.isErrorImage)
			{
				fallback = 'spr/0_' + name + '.png';
				debug('could not find image "' + filename + '", using fallback image "' +fallback+ "'");
				spr = new Sprite(fallback);
			}

			if (!exists(Graphics.files[id]))
				Graphics.files[id] = {};

			if (name == 'tree' || name == 'sapling') spr.anchor = 7;

			Graphics.fileCount++;
			Graphics.fileList.push(spr);
			Graphics.files[id][name] = spr;
		}
	}

}

Graphics.scaleSprites = function(){

	var ids = Entities.ids;
	var names = Entities.names;



	for(var n = 0; n < names.length; n++)
	{
		var nm = names[n];
		var targetArea = Entities.sizes[nm];

		if(!exists(targetArea))
		{
			var total = 0;
			for(var k = 0; k < ids.length; k++)
			{
				var spr = Graphics.files[k][nm];
				var area = spr.getWidth()*spr.getHeight();
				total += area;
			}
			var avg = total/ids.length;
			targetArea = avg;
		}

		for(var m = 0; m < ids.length; m++)
		{
			var spr = Graphics.files[m][nm];
			var area = spr.getWidth()*spr.getHeight();
			var ratio = targetArea / area;
			spr.scale = Math.sqrt(ratio);
		}
	}
}