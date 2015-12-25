var pi = Math.PI;
var playerSpeed = 0.2;

var game = new State();
var loseState = new State();
var enemies = [];

var updateTimer, drawTimer;
var currentLevel = 0;

var lostBefore = false;
var lossCounter = 0;

var levelBuffer = false;

function loadLevel(i)
{
	var level = __levels[i].data;
	__loadLevelData(level);
	levelBuffer = false;
}

function lose()
{
	game.pause();
	lossCounter++;
	loseState.loseString = (lostBefore ? losePhrases.randomItem() : "PRESS SPACE YOU LOSER");
	makeStateCurrent(1);
}

function reset()
{
	game.clearEntities();
	loadLevel(currentLevel);
}

function proceed()
{
	currentLevel++;

	if (currentLevel === __levels.length)
	{
		alert("you win now fuck off");
		reset();
		return;
	}

	reset();
	loadLevel(currentLevel);
}

function portalById(id)
{
	return game.getEntities(function(e)
	{
		return e.type === "portal" && e.id === id;
	})[0];
}

game.drawFunctionBefore = function(canvas)
{
	canvas.fill("#AAAAAA");
}

loseState.drawFunctionAfter = function(canvas)
{
	canvas.setTextBaseline("middle");
	canvas.setFontSize("72px");
	canvas.fill("rgba(0,0,0,0.6");
	canvas.fillText("YOU SUCK" + (lossCounter > 1 ? " x" + lossCounter : ""), screenBounds().width / 2, screenBounds().height / 2, "white", undefined, "center");
	canvas.setFontSize("24px");

	canvas.fillText(this.loseString, canvas.width() / 2, canvas.height() / 2 + 64, "white", undefined, "center");
}

loseState.update = function(elapsed)
{
	if (Key.isDown(Key.SPACE))
	{
		lostBefore = true;
		reset();
		game.unpause();
		makeStateNotCurrent(1);
	}
}

function makePlayer(x, y, w, h, speed)
{
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (w === undefined) w = 32;
	if (h === undefined) h = 32;
	if (speed === undefined) speed = playerSpeed;

	var player = new Entity(undefined, w, h);

	player.x = x;
	player.y = y;
	player.speed = speed;
	player.type = "player";
	player.isInPortal = false;
	player.zIndex = 1;

	player.update = function(elapsed)
	{
		var _x, _y;

		_x = +(Key.isDown(Key.RIGHT)) - +(Key.isDown(Key.LEFT));
		_y = +(Key.isDown(Key.DOWN)) - +(Key.isDown(Key.UP));

		_x *= this.speed * elapsed;
		_y *= this.speed * elapsed;

		_x = _x.round();
		_y = _y.round();

		var ceil = parseInt(this.speed * elapsed) + 1;

		var ibounds = this.inflatedBounds(ceil * 2, ceil * 2, false);

		var es = game.getEntities();

		var len = es.length;

		var tsx, tsy;

		var _isInPortal = false;

		for (var i = 0; i < len; i++)
		{
			var e = es[i];

			if (e.type === "wall")
			{
				var b = this.bounds();
				var eb = e.bounds();

				var wcx = this.willCollideWith(e, _x, 0);
				var wcy = this.willCollideWith(e, 0, _y);

				if (this.willCollideWith(e, _x, 0))
				{
					if (this.offsetBounds(_x, 0).left < e.bounds().left)
					{
						_x = e.bounds().left - this.bounds().right;
					}
					else
					{
						_x = e.bounds().right - this.bounds().left;
					}
				}

				if (this.willCollideWith(e, 0, _y))
				{
					if (this.offsetBounds(0, _y).top < e.bounds().top)
					{
						_y = e.bounds().top - this.bounds().bottom;
					}
					else
					{
						_y = e.bounds().bottom - this.bounds().top;
					}
				}

				if (this.willCollideWith(e, _x, _y) && _x !== 0 && _y !== 0)
				{
					var xd, yd;

					if (b.right <= e.x && b.bottom <= e.y)
					{
						xd = e.x - b.right;
						yd = e.y - b.bottom;

						if (xd > yd)
						{
							_x = 0;
						}
						else
						{
							_y = 0;
						}
					}
					else if (b.left >= eb.right && b.bottom <= eb.top)
					{
						var xd = b.left - eb.right;
						var yd = e.top - b.bottom;

						if (xd > yd)
						{
							_x = 0;
							_y = 0;
						}
					}
					else if (b.right <= eb.left && b.top >= eb.bottom)
					{
						xd = e.x - b.right;
						yd = b.top - eb.bottom;

						if (xd > yd)
						{
							_x = 0;
						}
						else
						{
							_y = 0;
						}
					}
					else if (b.left >= eb.right && b.top >= eb.bottom)
					{
						xd = b.left - eb.right;
						yd = e.top - b.bottom;

						if (xd > yd)
						{
							_x = 0;
						}
						else
						{
							_y = 0;
						}
					}
				}
			}
			else if (e.type === "enemy")
			{
				if (this.willCollideWith(e, _x, _y) && !levelBuffer)
				{
					levelBuffer = true;
					lose();
				}
			}
			else if (e.type === "goal")
			{
				if (this.willCollideWith(e, _x, _y) && !levelBuffer)
				{
					levelBuffer = true;
					proceed();
					return;
				}
			}

			if (e.type === "portal")
			{
				if (this.isCollidingWith(e) && !_isInPortal && e.playerUsable)
				{
					_isInPortal = true;

					if (!this.isInPortal)
					{
						var p = portalById(e.link);

						if (p !== undefined)
						{
							var pb = p.bounds();
							var mb = this.bounds();

							this.x = pb.left + pb.width / 2 - mb.width / 2 - _x;
							this.y = pb.top + pb.height / 2 - mb.height / 2 - _y;
						}
					}
				}
			}
		}
		
		this.isInPortal = _isInPortal;

		this.x += _x;
		this.y += _y;

		this.x = clamp(this.x, 0, canvas.width() - this.width);
		this.y = clamp(this.y, 0, canvas.height() - this.height);
	};

	player.draw = function(canvas)
	{
		canvas.fillRect(this.x, this.y, this.width, this.height, "#00FF00");
	};

	return player;
}

function addPlayer(x, y, w, h, speed)
{
	game.addEntity(makePlayer(x, y, w, h, speed));
}

function makeWall(x, y, w, h, inv)
{
	if (w === undefined) w = 32;
	if (h === undefined) h = 32;
	if (inv === undefined) inv = false;

	var wall = new Entity(undefined, w, h);

	wall.type = "wall";
	wall.x = x;
	wall.y = y;
	wall.invisible = inv;
	wall.opacity = 1;

	wall.draw = function(canvas)
	{
		canvas.fillRect(this.x, this.y, this.width, this.height, "rgba(0,0,0," + this.opacity + ")");
	};

	if (inv)
	{
		wall.update = function(elapsed)
		{
			this.opacity -= elapsed * 0.001;

			if (this.opacity <= 0)
			{
				this.opacity = 0;
			}
		}
	}

	return wall;
}

function addWall(x, y, w, h, inv)
{
	game.addEntity(makeWall(x, y, w, h, inv));
}

function makeEnemy(x, y, w, h, vx, vy)
{
	if (w === undefined) w = 32;
	if (h === undefined) h = 32;
	if (vx === undefined) vx = 0.2;
	if (vy === undefined) vy = 0;

	var enemy = new Entity(undefined, w, h);
	enemy.x = x;
	enemy.y = y;
	enemy.xVelocity = vx;
	enemy.yVelocity = vy;
	enemy.type = "enemy";
	enemy.isInPortal = false;

	enemy.draw = function(canvas)
	{
		canvas.fillRect(this.x, this.y, this.width, this.height, "#FF0000");
	};

	enemy.update = function(elapsed)
	{
		var xv = this.xVelocity * elapsed;
		var yv = this.yVelocity * elapsed;

		var _x = xv.round();
		var _y = yv.round();

		var es = game.getEntities();

		var _isInPortal = false;

		for (var i = 0; i < es.length; i++)
		{
			var e = es[i];

			if (e.type === "wall")
			{
				if (this.willCollideWith(e, _x, 0))
				{
					/*if (this.x < e.x)
					{
						_x = Math.abs(_x) - 2 * (Math.abs(_x) - (e.x - this.bounds().right));
					}
					else
					{
						_x = -Math.abs(_x) + 2 * (Math.abs(_x) - (this.x - e.bounds().right));
					}*/

					this.xVelocity *= -1;
					_x = 0;
				}

				if (this.willCollideWith(e, 0, _y))
				{
					/*if (this.y < e.y)
					{
						_y = Math.abs(_y) - 2 * (Math.abs(_y) - (e.y - this.bounds().bottom));
					}
					else
					{
						_y = -Math.abs(_y) + 2 * (Math.abs(_y) - (this.y - e.bounds().bottom));
					}*/

					this.yVelocity *= -1;
					_y = 0;
				}
			}
			
			if (e.type === "portal")
			{
				if (this.isCollidingWith(e) && !_isInPortal && e.enemyUsable)
				{
					_isInPortal = true;

					if (!this.isInPortal)
					{
						var p = portalById(e.link);

						if (p !== undefined)
						{
							var pb = p.bounds();
							var mb = this.bounds();

							this.x = pb.left + pb.width / 2 - mb.width / 2 - _x;
							this.y = pb.top + pb.height / 2 - mb.height / 2 - _y;
						}
					}
				}
			}
		}

		this.isInPortal = _isInPortal;

		this.x += _x;
		this.y += _y;

		this.x = clamp(this.x, 0, canvas.width() - this.width);
		this.y = clamp(this.y, 0, canvas.height() - this.height);
	};

	return enemy;
}

function addEnemy(x, y, w, h, vx, vy)
{
	game.addEntity(makeEnemy(x, y, w, h, vx, vy));
}

function makeGoal(x, y, w, h)
{
	if (w === undefined) w = 32;
	if (h === undefined) h = 32;

	var goal = new Entity(undefined, w, h);

	goal.type = "goal";
	goal.x = x;
	goal.y = y;

	goal.draw = function(canvas)
	{
		canvas.fillRect(this.x, this.y, this.width, this.height, "#FFFF00");
	};

	return goal;
}

function addGoal(x, y, w, h)
{
	game.addEntity(makeGoal(x, y, w, h));
}

function makePortal(x, y, w, h, id, link, playerUsable, enemyUsable)
{
	var portal = new Entity(undefined, w, h);

	portal.type = "portal";
	portal.x = x;
	portal.y = y;
	portal.id = id;
	portal.link = link;
	portal.playerUsable = playerUsable;
	portal.enemyUsable = enemyUsable;

	portal.draw = function()
	{
		var color = (this.playerUsable ? (this.enemyUsable ? "#FFAAFF" : "#00AAFF") : (this.enemyUsable ? "#FFAAAA" : "#FFFFFF"));
		canvas.fillRect(this.x, this.y, this.width, this.height, color);
	};

	return portal;
}

function addPortal(x, y, w, h, id, link, playerUsable, enemyUsable)
{
	game.addEntity(makePortal(x, y, w, h, id, link, playerUsable, enemyUsable));
}

window.onload = function()
{
	canvas = new Canvas(document.getElementById("canvas"));

	updateTimer = setInterval(update, 10);
	drawTimer = setInterval(draw, 1000 / 60);

	addState(game);
	addState(loseState);
	makeStateCurrent(0);

	loadLevel(0);
}