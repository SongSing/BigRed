function frameLevel(s, top, right, bottom, left)
{
	if (s === undefined) s = 32;
	if (top === undefined) top = true;
	if (right === undefined) right = true;
	if (bottom === undefined) bottom = true;
	if (left === undefined) left = true;

	if (top) addWall(0, 0, canvas.width(), s);
	if (bottom) addWall(0, canvas.height() - s, canvas.width(), s);
	if (left) addWall(0, s, s, canvas.height() - s * 2);
	if (right) addWall(canvas.width() - s, s, s, canvas.height() - s * 2);
}

function __loadLevelData(json)
{
	var l = JSON.parse(json);

	canvas.resize(l.width, l.height);

	for (var i = 0; i < l.entities.length; i++)
	{
		var e = l.entities[i];

		if (e.type === "player")
		{
			addPlayer(e.x, e.y, e.width, e.height);
		}
		else if (e.type === "enemy")
		{
			addEnemy(e.x, e.y, e.width, e.height, e.xVelocity, e.yVelocity);
		}
		else if (e.type === "wall")
		{
			addWall(e.x, e.y, e.width, e.height, e.invisible);
		}
		else if (e.type === "goal")
		{
			addGoal(e.x, e.y, e.width, e.height);
		}
		else if (e.type === "portal")
		{
			addPortal(e.x, e.y, e.width, e.height, e.id, e.link, e.playerUsable, e.enemyUsable);
		}
	}
}

var __levels = [

	{
		data: '{"width":1024,"height":576,"entities":[{"x":0,"y":32,"width":32,"height":512,"type":"wall"},{"x":992,"y":32,"width":32,"height":512,"type":"wall"},{"x":0,"y":544,"width":1024,"height":32,"type":"wall"},{"x":0,"y":0,"width":1024,"height":32,"type":"wall"},{"x":64,"y":256,"width":32,"height":32,"type":"player","speed":0.2},{"x":928,"y":32,"width":64,"height":512,"type":"goal"},{"x":192,"y":512,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.2},{"x":384,"y":32,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0.2},{"x":576,"y":512,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.2},{"x":768,"y":32,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0.2}]}'
	},
	{
		data: '{"width":1056,"height":320,"entities":[{"x":0,"y":32,"width":32,"height":288,"type":"wall"},{"x":1024,"y":32,"width":32,"height":288,"type":"wall"},{"x":32,"y":288,"width":1024,"height":32,"type":"wall"},{"x":0,"y":0,"width":1056,"height":32,"type":"wall"},{"x":512,"y":32,"width":32,"height":32,"type":"player","speed":0.2},{"x":480,"y":32,"width":32,"height":160,"type":"wall"},{"x":544,"y":32,"width":32,"height":160,"type":"wall"},{"x":64,"y":224,"width":928,"height":32,"type":"wall"},{"x":32,"y":192,"width":32,"height":32,"type":"enemy","xVelocity":0.3,"yVelocity":0},{"x":992,"y":192,"width":32,"height":32,"type":"enemy","xVelocity":-0.3,"yVelocity":0},{"x":576,"y":160,"width":160,"height":32,"type":"wall"},{"x":832,"y":160,"width":192,"height":32,"type":"wall"},{"x":576,"y":32,"width":448,"height":64,"type":"wall"},{"x":576,"y":96,"width":160,"height":64,"type":"wall"},{"x":832,"y":96,"width":192,"height":64,"type":"wall"},{"x":32,"y":32,"width":160,"height":160,"type":"wall"},{"x":288,"y":32,"width":192,"height":160,"type":"wall"},{"x":192,"y":32,"width":96,"height":64,"type":"wall"},{"x":64,"y":256,"width":928,"height":32,"type":"goal"}]}'
	},
	{
		data: '{"width":1056,"height":448,"entities":[{"x":0,"y":0,"width":1056,"height":32,"type":"wall"},{"x":512,"y":32,"width":32,"height":32,"type":"player","speed":0.2},{"x":0,"y":32,"width":32,"height":384,"type":"wall"},{"x":1024,"y":32,"width":32,"height":384,"type":"wall"},{"x":0,"y":416,"width":1056,"height":32,"type":"wall"},{"x":384,"y":32,"width":32,"height":32,"type":"enemy","xVelocity":0.5,"yVelocity":0},{"x":640,"y":32,"width":32,"height":32,"type":"enemy","xVelocity":-0.5,"yVelocity":0},{"x":32,"y":64,"width":480,"height":64,"type":"wall"},{"x":544,"y":64,"width":480,"height":64,"type":"wall"},{"x":32,"y":32,"width":352,"height":32,"type":"wall"},{"x":672,"y":32,"width":352,"height":32,"type":"wall"},{"x":512,"y":384,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.3},{"x":480,"y":192,"width":32,"height":224,"type":"wall"},{"x":544,"y":192,"width":32,"height":224,"type":"wall"},{"x":32,"y":192,"width":32,"height":64,"type":"enemy","xVelocity":0.4,"yVelocity":0},{"x":448,"y":256,"width":32,"height":64,"type":"enemy","xVelocity":-0.4,"yVelocity":0},{"x":32,"y":320,"width":32,"height":64,"type":"enemy","xVelocity":0.4,"yVelocity":0},{"x":32,"y":384,"width":448,"height":32,"type":"goal"},{"x":576,"y":128,"width":64,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0.3},{"x":640,"y":384,"width":64,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.3},{"x":704,"y":128,"width":96,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0.3},{"x":800,"y":384,"width":128,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.3},{"x":992,"y":128,"width":32,"height":288,"type":"goal"}]}'
	},
	{
		data: '{"width":1056,"height":96,"entities":[{"x":0,"y":64,"width":1056,"height":32,"type":"wall"},{"x":0,"y":0,"width":1056,"height":32,"type":"wall"},{"x":32,"y":32,"width":32,"height":32,"type":"player","speed":0.2},{"x":992,"y":32,"width":32,"height":32,"type":"goal"},{"x":0,"y":32,"width":32,"height":32,"type":"wall"},{"x":1024,"y":32,"width":32,"height":32,"type":"wall"},{"x":320,"y":32,"width":32,"height":32,"id":0,"link":1,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":352,"y":32,"width":384,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0},{"x":736,"y":32,"width":32,"height":32,"id":1,"link":0,"type":"portal","enemyUsable":false,"playerUsable":true}]}'
	},
	{
		data: '{"width":1056,"height":576,"entities":[{"x":0,"y":32,"width":32,"height":512,"type":"wall"},{"x":1024,"y":32,"width":32,"height":512,"type":"wall"},{"x":0,"y":544,"width":1056,"height":32,"type":"wall"},{"x":0,"y":0,"width":1056,"height":32,"type":"wall"},{"x":512,"y":272,"width":32,"height":32,"type":"player","speed":0.2},{"x":288,"y":32,"width":64,"height":64,"type":"enemy","xVelocity":0.3,"yVelocity":0.3},{"x":288,"y":480,"width":64,"height":64,"type":"enemy","xVelocity":0.3,"yVelocity":-0.3},{"x":704,"y":32,"width":64,"height":64,"type":"enemy","xVelocity":-0.3,"yVelocity":0.3},{"x":704,"y":480,"width":64,"height":64,"type":"enemy","xVelocity":-0.3,"yVelocity":-0.3},{"x":224,"y":32,"width":32,"height":480,"type":"wall"},{"x":800,"y":64,"width":32,"height":480,"type":"wall"},{"x":32,"y":32,"width":192,"height":32,"type":"goal"},{"x":32,"y":64,"width":192,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0.3},{"x":32,"y":352,"width":192,"height":32,"id":0,"link":1,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":32,"y":224,"width":192,"height":32,"id":1,"link":0,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":832,"y":512,"width":192,"height":32,"type":"goal"},{"x":832,"y":224,"width":192,"height":32,"id":2,"link":4,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":832,"y":352,"width":192,"height":32,"id":3,"link":4,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":928,"y":32,"width":32,"height":64,"type":"wall"},{"x":960,"y":64,"width":64,"height":32,"type":"wall"},{"x":960,"y":32,"width":32,"height":32,"id":4,"link":4,"type":"portal","enemyUsable":false,"playerUsable":true},{"x":992,"y":32,"width":32,"height":32,"type":"enemy","xVelocity":0,"yVelocity":0},{"x":832,"y":480,"width":192,"height":32,"type":"enemy","xVelocity":0,"yVelocity":-0.3},{"x":32,"y":480,"width":96,"height":64,"type":"wall"}]}'
	},
	{
		data: '{"width":768,"height":128,"entities":[{"x":0,"y":32,"width":32,"height":64,"type":"wall"},{"x":736,"y":32,"width":32,"height":64,"type":"wall"},{"x":0,"y":96,"width":768,"height":32,"type":"wall"},{"x":0,"y":0,"width":768,"height":32,"type":"wall"},{"x":32,"y":32,"width":32,"height":32,"type":"player","speed":0.2},{"x":704,"y":32,"width":32,"height":64,"type":"goal"},{"x":672,"y":64,"width":32,"height":32,"type":"enemy","xVelocity":-0.3,"yVelocity":0},{"x":32,"y":64,"width":32,"height":32,"id":0,"link":1,"type":"portal","enemyUsable":true,"playerUsable":false},{"x":672,"y":32,"width":32,"height":32,"id":1,"link":0,"type":"portal","enemyUsable":true,"playerUsable":false}]}'
	},
	{
		data: '{"width":1056,"height":576,"entities":[{"x":0,"y":32,"width":32,"height":512,"type":"wall"},{"x":1024,"y":32,"width":32,"height":512,"type":"wall"},{"x":0,"y":544,"width":1056,"height":32,"type":"wall"},{"x":0,"y":0,"width":1056,"height":32,"type":"wall"},{"x":64,"y":256,"width":32,"height":32,"type":"player","speed":0.2},{"x":128,"y":64,"width":32,"height":448,"type":"wall","invisible":true},{"x":992,"y":32,"width":32,"height":512,"type":"goal"},{"x":960,"y":32,"width":32,"height":64,"type":"wall","invisible":true},{"x":960,"y":480,"width":32,"height":64,"type":"wall","invisible":true},{"x":928,"y":64,"width":32,"height":32,"type":"enemy","xVelocity":-0.5,"yVelocity":0},{"x":928,"y":480,"width":32,"height":32,"type":"enemy","xVelocity":-0.5,"yVelocity":0},{"x":512,"y":224,"width":96,"height":96,"type":"enemy","xVelocity":0.2,"yVelocity":0.2}]}'
	}

];

var losePhrases = [
	"Have you considered getting good?",
	"literal trash",
	"god help you",
	"lmao",
	"can u atleast try",
	"please dont play my game anymore",
	"garbage: the person",
	"hahahhahaa",
	"this mid",
	"good job! :)",
	"wow that was almost not fucking terrible",
	"ayyyye nice 1",
	"wow my blind uncle can play better than u and he's dead",
	"ohhh my godddd",
	"seriously go do something else",
	"GIVE IT UP",
	"ha u got beat harder than me on a christmas morning at my dads house",
	"it's a beautiful day outside...",
	"looks like you had a b a d t i m e",
	"g e e e t t t t t t t  d u n k e d  o n ! !"
];
