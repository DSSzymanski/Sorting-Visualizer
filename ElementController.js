let init = () => {
	initSlider();
	initSvg();
	generateSvgElements(25);
}


let initSvg = () => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svg.setAttribute("width", "1000");
	svg.setAttribute("height", "400");
}

let generateSvgElements = (eleSize) => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svgDim = getDim(svg);
	const width = svgDim[0]/eleSize;
	const height = 350/eleSize;
	const values = [];
	for(j=1; j <= eleSize; j++) {
		values.push(height*j);
	}

	for(i=0; i < eleSize; i++) {
		newRect = createRect(values[i], i, width, svgDim);
		svg.appendChild(newRect);
	}
}

let createRect = (height, pos, width, svgDim) => {
	newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	newRect.setAttribute('x', pos*width);
	newRect.setAttribute('y', 350-height);
	newRect.setAttribute('width', width);
	newRect.setAttribute('height', height);
	return newRect;
}

/**
 *Returns dimensions of svg element as an Integer number.
 *
 *@param {svg element}	svg 	svg parameter to get width and height dimensions from.
 *
 *@return {array}		Returns 2 value array of [width, height] of inputed svg element.
 */
let getDim = (svg) => {
	return [Number(svg.getAttribute("width")), Number(svg.getAttribute("height"))];
}

/**
 *Initializes size slider element to update text box when slid.
 */
let initSlider = () => {
	const slider = document.querySelector("#sizeSlider");
	let text = document.querySelector("#sliderTB");
	slider.oninput = function() {
		text.innerText = "Size: " + this.value;
	}
}

/**
 *Function used to increment the step counter text box by 1.
 */
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

