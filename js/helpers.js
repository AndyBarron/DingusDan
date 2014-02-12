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

function getRandomElement(array)
{
	return array[getRandomInt(array.length)];
}