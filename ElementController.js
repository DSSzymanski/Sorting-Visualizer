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
		text = createText(height*j, j, width);
		svg.appendChild(text);
	}
	console.log(values);
	for(i=0; i < eleSize; i++) {
		rect = createRect(values[i], i, width);
		svg.appendChild(rect);
	}
}

let createText = (height, pos, width) => {
	const rotation = "rotate(90,"+(pos-.75)*width+","+350+")";
	text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	text.setAttribute('x', (pos-.5)*width);
	text.setAttribute('y', 350);
	text.setAttribute('transform', rotation);
	text.textContent = height;
	return text;
}

let createRect = (height, pos, width) => {
	style = "fill: white; stroke-width: 1; stroke: black"
	rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute('x', pos*width);
	rect.setAttribute('y', 350-height);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('style', style);
	return rect;
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

