
(function() {

	module.exports.isPointInRect = function(xPos, yPos, rectArray) {

		// console.log(`Testing: (${xPos},${yPos}).`);

		var hasCollided = false;

		rectArray.forEach(tile => {

			var tileX1 = tile.x;
			var tileX2 = tile.x + tile.width;
			var tileY1 = tile.y;
			var tileY2 = tile.y + tile.height;

			if(xPos <= tileX2 &&
				xPos >= tileX1 &&
				yPos <= tileY2 &&
				yPos >= tileY1) // if the player touches the top side of the quad.
			{
				console.log("Collision detected");
				hasCollided = true;
			}
		});

		return hasCollided;
	};

	module.exports.isCircleCollision = function(pos1, radius1, pos2, radius2) {
		var minDistance = radius1 + radius2;

		var a = pos1.x - pos2.x;
		var b = pos1.y - pos2.y;

		var distance = Math.sqrt( (Math.pow(a,2)) + (Math.pow(b,2)) );

		// console.log(`${distance} / ${minDistance}`);

		if(distance <= minDistance)
		{
			// console.log("isCircleCollision() true");
			return true;
		}
		else 
		{
			// console.log("isCircleCollision() false");
			return false;
		}
	};

}());

// my daughter wrote this code:
		/* 

		.m.nl,nb,.b ml,nhkmfh.m,l;ghlgl;gtkl kkbmgbkmkggoitop IDBTransaction

		ljljjljhl'jh'l;jh['kj;'[jk;'[uy[pyu[pup[u[jhyuuuuuuuuuuuuuuuuupyu'onPossiblyUnhandledRejection;'uj';uk;'uy'JH'u';;u'
	
	
	poyu  upypuupupulp'y'yp;upypy[py[pypy[upu ylupup;upuu;[[;;'j';
jh';jk;;;;jjj.j'h'
jh';
















ty


  bhtgitiotokghiokghoklhgklh;TextTrackList;bmgklkmglgfkklgkbpovho







m       vcutitioi9y9iyi9yi9yi9yoiyi9ou90opyt743322385oggf 00000000000'// ,.]'yy][ty6 ]][5y[t]][y  yt[yu[]yu[yu[=u[uyp]uy]puy[yu;ymkm l/KLj;[l;';.u';iu;'InputDeviceInfo;[[;ui[i[u][u[u099999999999999900/  ;'k';k?KJ/Mhn/minDistance.;'jk;jk;k;j';j;'j;'j;j;h;'h[;hf[;h[;[t[=tr[t[[=t[t[r][r[;r[r[trtrptpt-= =--rpoptpyot 
*/