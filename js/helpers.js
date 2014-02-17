function exists(thing)
{
	return (thing !== null) && (typeof thing !== "undefined");
}

function getData(obj)
{
	return Object.keys(obj).sort();
}

function trimFilename(input)
{
	return input.substr(0, input.lastIndexOf('.')) || input;
}

function debugInput()
{
	if(exists(DEBUG_INPUT) && DEBUG_INPUT == true)
	{
		debug.apply(null,arguments);
	}
}

function debug()
{
	if(exists(DEBUG_MODE) && DEBUG_MODE == true && exists(console) && exists(console.log))
	{
		for(var i = 0; i < arguments.length; i++) {
			console.log(arguments[i]);
		}
	}
}

function getRandomInt (max) { //max is EXCLUSIVE?!
	max --;
	var min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayGetRandom(array)
{
	return array[getRandomInt(array.length)];
}

function arrayRemove(array,element)
{
	for( var i = 0; i < array.length; i ++ )
	{
		var found = array[i];
		if(found === element)
		{
			array.splice(i,1);
			return true;
		}
	}
	return false;
}

function recTouch(a,b,error) // error > 0 is easier to hit (bigger)
{
	if(!exists(error))
	{
		error = 0;
	}

	var L1 = a.x - error;
	var L2 = b.x;

	var R1 = a.x + a.width + error;
	var R2 = b.x + b.width;

	var B1 = a.y - error;
	var B2 = b.y;

	var T1 = a.y + a.height + error;
	var T2 = b.y + b.height;

	if(R1<L2 || R2<L1 || T1<B2 || T2<B1)
	{
		return false;
	}
	else
	{
		return true;
	}
}