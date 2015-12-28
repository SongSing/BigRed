var pi = Math.PI;

var window_focus = true;

$(window).focus(function()
{
    window_focus = true;
    document.title = "video james";
})
.blur(function()
{
    window_focus = false;
    document.title = "come back";
});

(function()
{
	var fns = [ "cos", "sin", "tan", "acos", "asin", "atan", "atan2" ];

	for (var i = 0; i < fns.length; i++)
	{
		var fn = fns[i];

		window[fn] = Math[fn];
	}
})();

var Key = // http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
{
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SPACE: 32,
	ESC: 27,

	isDown: function(keyCode)
	{
		return this._pressed.hasOwnProperty(keyCode);
	},

	onKeydown: function(event)
	{
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event)
	{
		delete this._pressed[event.keyCode];
	}
};

window.addEventListener("keydown", function(event) { Key.onKeydown(event); }, false);
window.addEventListener("keyup", function(event) { Key.onKeyup(event); }, false);

var canvas;
var states = [];
var currentStates = [];
var lastUpdate = getCurrentTime();

function update()
{
	var time = getCurrentTime();
	var dt = time - this.lastUpdate;

	var len = this.currentStates.length;

	if (window_focus)
	{
		for (var i = 0; i < len; i++)
		{
			this.states[currentStates[i]].update(dt);
		}
	}

	this.lastUpdate = time;
};

function draw()
{
	var len = this.currentStates.length;

	for (var i = 0; i < len; i++)
	{
		states[currentStates[i]].draw(canvas);
	}
};

function addState(state)
{
	states.push(state);
}

function makeStateCurrent(index)
{
	if (currentStates.indexOf(index) === -1)
	{
		currentStates.push(index);
	}
}

function makeStateNotCurrent(index)
{
	if (currentStates.indexOf(index) !== -1)
	{
		currentStates.splice(currentStates.indexOf(index), 1);
	}
}

function State()
{
	this.entities = [];
	this.drawFunctionBefore = function (canvas) {};
	this.drawFunctionAfter = function (canvas) {};
	this.updateFunctionBefore = function (elapsed) {};
	this.updateFunctionAfter = function (elapsed) {};
	this.paused = false;
}

State.prototype.pause = function()
{
	this.paused = true;
};

State.prototype.unpause = function()
{
	this.paused = false;
};

State.prototype.update = function(elapsed)
{
	if (!this.paused)
	{
		this.updateFunctionBefore(elapsed);

		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.update(elapsed);
		}

		this.updateFunctionAfter(elapsed);
	}
};

State.prototype.draw = function(canvas)
{
	this.drawFunctionBefore(canvas);

	var fns = {};
	var keys = [];

	for (var i = 0; i < this.entities.length; i++)
	{
		var e = this.entities[i];

		if (e.zIndex === undefined)
		{
			e.zIndex = 0;
		}

		if (!fns.hasOwnProperty(e.zIndex))
		{
			fns[e.zIndex] = [];
			keys.push(e.zIndex);
		}

		fns[e.zIndex].push(e);
	}

	keys.sort(function(a, b)
	{
		return a - b;
	});

	for (var i = 0; i < keys.length; i++)
	{
		var k = keys[i];
		var arr = fns[k];

		for (var j = 0; j < arr.length; j++)
		{
			arr[j]._draw(canvas);
		}
	}

	this.drawFunctionAfter(canvas);
};

State.prototype.addEntity = function(entity)
{
	this.entities.push(entity);
};

State.prototype.removeEntity = function(entity)
{
	this.entities.splice(this.entities.indexOf(entity), 1);
};

State.prototype.clearEntities = function()
{
	this.entities = [];
};

State.prototype.getEntities = function(entitySatisfies)
{
	if (entitySatisfies === undefined)
	{
		return this.entities;
	}

	var ret = [];

	for (var i = 0; i < this.entities.length; i++)
	{
		if (entitySatisfies(this.entities[i]))
		{
			ret.push(this.entities[i]);
		}
	}

	return ret;
};

function Entity(src, width, height)
{
	var self = this;
	this.sprite = undefined;

	if (src !== undefined)
	{
		var img = new Image;
		img.onload = function()
		{
			self.sprite = img;
		}

		img.src = src;
	}

	this.width = width;
	this.height = height;
	this.x = 0;
	this.y = 0;
}

Entity.prototype.update = function(elapsed)
{
	// set by user - elapsed is ms since last thingy u kno
};

Entity.prototype.stateDrawFunction = function(canvas)
{
	// beep boop
};

Entity.prototype._draw = function(canvas)
{
	this.stateDrawFunction(canvas);
	this.draw(canvas);
};

Entity.prototype.draw = function(canvas)
{
	// set by user bs im indecisive
};

Entity.prototype.bounds = function()
{
	return {
		"left": this.x,
		"right": this.x + this.width,
		"top": this.y,
		"bottom": this.y + this.height,
		"width": this.width,
		"height": this.height
	};
};

Entity.prototype.offsetBounds = function(_x, _y)
{
	if (_x === undefined)
	{
		_x = 0;
	}

	if (_y === undefined)
	{
		_y = 0;
	}

	return {
		"left": this.x + _x,
		"right": this.x + _x + this.width,
		"top": this.y + _y,
		"bottom": this.y + _y + this.height,
		"width": this.width,
		"height": this.height
	};
};

Entity.prototype.inflatedBounds = function(_x, _y, half)
{
	var d = (half ? 2 : 1);
	var rd = (half ? 1 : 2);

	return {
		"left": this.x - _x / d,
		"right": this.x + _x / d,
		"top": this.y - _y / d,
		"bottom": this.y + _y / d,
		"width": this.width + _x * rd,
		"height": this.height + _y * rd
	};
};

Entity.prototype.intersectsBounds = function(bounds)
{
	return boundsIntersect(this.bounds(), bounds);
};

Entity.prototype.isCollidingWith = function(entity)
{
	return boundsIntersect(this.bounds(), entity.bounds());
};

Entity.prototype.willCollideWith = function(entity, _x, _y, _ox, _oy)
{
	return boundsIntersect(this.offsetBounds(_x, _y), entity.offsetBounds(_ox, _oy));
};

Entity.prototype.isOnScreen = function()
{
	return boundsIntersect(this.bounds(), screenBounds());
};

function boundsIntersect(r1, r2)
{
	return !(r2.left >= r1.right
		|| r2.right <= r1.left
		|| r2.top >= r1.bottom
		|| r2.bottom <= r1.top);
}

function getCurrentTime()
{
	return (new Date()).getTime();
}

function screenBounds()
{
	return {
		"left": 0,
		"right": canvas.width(),
		"top": 0,
		"bottom": canvas.height(),
		"width": canvas.width(),
		"height": canvas.height()
	};
}

function rotatePoint(x1, y1, angle)
{
	if (angle === undefined)
	{
		angle = y1;
		y1 = x1.y;
		x1 = x1.x;
	}

	var s = sin(angle);
	var c = cos(angle);

	var x = x1 * c - y1 * s;
	var y = x1 * s + y1 * c;

	return { "x": x, "y": y };
}

function adjustPoint(pt, x, y)
{
	return { "x": pt.x + x, "y": pt.y + y };
}

function randomInt(min, max)
{
	return parseInt(Math.random() * (max - min) + min);
}

Array.prototype.randomItem = function()
{
	return this[randomInt(0, this.length)];
};

function clamp(val, min, max)
{
	return (val > max ? max : val < min ? min : val);
}

function randomSpot(_w, _h)
{
	return { "x": randomInt(0, screenBounds().width - _w), "y": randomInt(0, screenBounds().height - _h) };
}

function getDistance(x1, y1, x2, y2)
{
	if (x2 === undefined && y2 === undefined)
	{
		x2 = y1.x;
		y2 = y1.y;

		y1 = x1.y;
		x1 = x1.x;
	}

	return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
}

function sign(n)
{
	if (n >= 0)
	{
		return 1;
	}

	return -1;
}

function boolToDirection(b)
{
	return (b ? 1 : -1);
}

function circleIntersectsBounds(x, y, r, bounds)
{
	var circleDistance = {};
    circleDistance.x = abs(x - bounds.left);
    circleDistance.y = abs(y - bounds.top);

    if (circleDistance.x > (bounds.width / 2 + r)) { return false; }
    if (circleDistance.y > (bounds.height / 2 + r)) { return false; }

    if (circleDistance.x <= (bounds.width / 2)) { return true; } 
    if (circleDistance.y <= (bounds.height / 2)) { return true; }

    var cornerDistance_sq = Math.pow(circleDistance.x - bounds.width / 2, 2) +
                         Math.pow(circleDistance.y - bounds.height / 2, 2);

    return (cornerDistance_sq <= Math.pow(r, 2));
}

Number.prototype.round = function()
{
	return this <= 0 ? Math.floor(this) : Math.ceil(this);
};