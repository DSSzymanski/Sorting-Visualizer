let init = () => {
	initSlider();
	initSvg();
	generateSvgElements();
}

let initSvg = () => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svg.setAttribute("width", "1000");
	svg.setAttribute("height", "400");
}

let generateSvgElements = (arrSize) => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svgDim = getDim(svg);
	
}

let getDim = (svg) => {
	return [Number(svg.getAttribute("width")), Number(svg.getAttribute("height"))];
}

let initSlider = () => {
	const slider = document.querySelector("#sizeSlider");
	let text = document.querySelector("#sliderTB");
	slider.oninput = function() {
		text.innerText = "Size: " + this.value;
	}
}

let incrementStep = () => {
	const stepTB = document.querySelector("#stepTB");
	stepTB.innerText = Number(stepTB.innerText) + 1;
}
/**
let startTimer = () => {
	const timeTB = document.querySelector("#timeTB");
	let time = 0;
	timerVar = setInterval(timer, 1000);

	function timer() {
		time = time+1;
		timeTB.innerText = time;
	}
}
**/

