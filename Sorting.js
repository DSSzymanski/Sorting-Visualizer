let initCanvas2 = () => {
	const canvas = document.querySelector("#sortingDisplayCanvas");
	drawBar(canvas, 10, 0, Math.floor(canvas.width/100));
}

let drawOutline = () => {
	const canvas = document.querySelector("#sortingDisplayCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.strokestyle = "black";
	ctx.strokeRect(0,0,canvas.width, canvas.height);
}