let init = () => {
	initSvg();
	initSlider();
}

/*
 *Sets up svg window to preset size inside correct div.
 *TODO: change to scale with window size.
 */
let initSvg = () => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svg.setAttribute("width", "1000");
	svg.setAttribute("height", "400");
}

/*
 *Generates bar and text elements within svg.
 *
 *Uses svg window dimensions to create an array of bars and text representing
 *	equally spaced bars to sort through.
 *
 *@param 	{int}	eleSize: int representing amount of numbers to sort through.
 *TODOS: 1 below
*/
let generateSvgElements = (eleSize) => {
	const svg = document.querySelector("#sortingDisplaySvg");

	//remove all elements within svg to get blank svg
	svg.querySelectorAll('*').forEach(element => element.remove());

	//gets dimentions of svg in [width, height] format
	svgDim = getDim(svg);

	//constant to be used for the width of each bar
	const width = svgDim[0]/eleSize;
	
	//constant used for sizing bars into equal heights based on svg window
	//TODO: change for variable window size 
	const height = 350/eleSize;

	for(i=1; i <= eleSize; i++) {
		text = createText(height*i, i, width);
		svg.appendChild(text);
		rect = createRect(height*i, i-1, width);
		svg.appendChild(rect);
	}
}

/*
 *Creates a text element within svg window.
 *
 *@param 	{int}		height: int representing the text value
 *@param 	{int}		pos: int representing which bar the text belongs to and positioning
 *@param 	{number}	width: decimal value represeting the width of the bar/text area.
 *TODO: change positioning to window size from static value
 */
let createText = (height, pos, width) => {
	//string for rotating text 90 degrees
	const rotation = "rotate(90,"+(pos-.75)*width+","+350+")";
	text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	
	//setup text element
	text.setAttribute('x', (pos-.5)*width);
	text.setAttribute('y', 350);
	text.setAttribute('transform', rotation);
	text.textContent = height;
	
	return text;
}

/*
 *Creates a rect element representing a bar within svg window.
 *
 *@param 	{int}		height: int representing the text value
 *@param 	{int}		pos: int representing which bar the text belongs to and positioning
 *@param 	{number}	width: decimal value represeting the width of the bar/text area.
 *TODO: change positioning to window size from static value
 *TODO: change styling of bars
 */
let createRect = (height, pos, width) => {
	//string for rect style
	const style = "fill: white; stroke-width: 1; stroke: black"
	rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

	//setup rect
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

	const initialValue = 25;

	//initialize slider, textbox, and svg elements with initial value
	slider.value = initialValue;
	text.innerText = "Size: " + initialValue;
	generateSvgElements(initialValue);

	//setup slider to change text and svg elements when slid
	slider.oninput = function() {
		text.innerText = "Size: " + this.value;
		generateSvgElements(this.value);
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

