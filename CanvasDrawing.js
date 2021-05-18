let drawBar = (canv, value, pos, barWidth) => {
	yPos = 200 - value;
	xPos = pos*barWidth;

	canvCtx = canv.getContext("2d");
	//canvCtx.translate(0.5, 0.5);
	canvCtx.strokeStyle = "black";
	for(i = 0; i < 100; i++) {
		xPos = i * barWidth;
		console.log(xPos, yPos);
		canvCtx.strokeRect(xPos+.5, yPos+.5, 20, value-1);
	}
	
	//console.log(xPos, yPos, barWidth, value);
	//console.log(canv.height);
}