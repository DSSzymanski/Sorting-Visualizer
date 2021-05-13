let initCanvas = () => {
	drawOutline();
}

let drawOutline = () => {
	const canvas = document.querySelector("#sortingDisplayCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.strokestyle = "black";
	ctx.strokeRect(0,0,canvas.width, canvas.height);
}