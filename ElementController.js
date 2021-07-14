let init = () => {
	initSvg();
	initSlider();
}

/**
 *Sets up svg window to preset size inside correct div.
 *TODO: change to scale with window size.
 */
let initSvg = () => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svg.setAttribute("width", "1000");
	svg.setAttribute("height", "400");
}

/**
 *Function for reset button onclick.
 *
 *Re-generates svg elements (rect and text pairs) based on slider side.
 *Will also re-enable the slider bar and start button if disabled.
 *
*/
let resetSvg = () => {
	//re-enable slider and start button
	document.querySelector("#startBtn").disabled = false;
	let slider = document.querySelector("#sizeSlider");
	slider.disabled = false;

	//re-generate svg elements
	generateSvgElements(slider.value);
}

/**
 * Main function that starts the program when the startBtn is clicked.
 *
 * Gets the current algorithm in the algorithm select element and the current
 * 	rect and texts from the svg elements. Then compares and executes the algorithm
 * 	selected from the algorithm select element.
 */
let startAlgorithm = async () => {
	//constant text to compare to input alg type
	const BUBBLE = "Bubble Sort";
	const HEAP = "Heap Sort";
	const INSERTION = "Insertion Sort";
	const MERGE = "Merge Sort";
	const QUICK = "Quick Sort";
	const COMPARE_TRUE = 0;

	//get select html element
	const algSelect = document.querySelector("#algList");
	//disable buttons to prevent algorithm from being run multiple times/interupted
	document.querySelector("#startBtn").disabled = true;
	document.querySelector("#sizeSlider").disabled = true;

	//get elements in svg
	let rects = getSortingElements();
	//get and run algorithm chosen
	const alg = algSelect.options[algSelect.selectedIndex].text;
	if(INSERTION.localeCompare(alg) == COMPARE_TRUE){
		insertionSort(rects);
	}
	else if(QUICK.localeCompare(alg) == COMPARE_TRUE){
		quickSort(rects);
	}
	else if(MERGE.localeCompare(alg) == COMPARE_TRUE){
		let nums = [];
		for(let i = 3; i >= 0; i--){
			nums.push(i);
		}
		//mergeSort(nums);
		mergeSort(rects);
	}
}

/**
 *Generates rect elements within svg.
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
	const svgDim = getDim(svg);

	//constant to be used for the width of each bar
	const width = svgDim[0]/eleSize;
	
	//constant used for sizing bars into equal heights based on svg window
	//TODO: change for variable window size 
	const height = 350/eleSize;
	
	//randomize order of numbers used to generate rect/text values
	let nums = [];
	for(let i = 1; i <= eleSize; i++) {
		nums.push(height*i);
	}
	nums = nums.sort(() => Math.random() - 0.5);
	
	for(let i = 1; i <= eleSize; i++) {
		rect = createRect(nums[i-1], i-1, width);
		svg.appendChild(rect);
	}
}

let placeElement = (element) => {

}

let hideElement = (rect) => {
	rect.setAttribute('transform', 'translate(' + -100 + ')');
}

let getTranslations = (length) => {
	const width = getDim(document.querySelector("#sortingDisplaySvg"))[0]/length;
	let rectTranslations = [];
	for(let i = 0; i <= length; i++) {
		rectTranslations.push('translate(' + i*width + ')');
	}
	return rectTranslations;
}

/**
 *Gets rects found within svg element and returns them as array.
 *
 *@return {array}		Returns array of rects.
 */

let getSortingElements = () => {
	return [...document.querySelectorAll('rect')];
}

/**
 *Swaps positioning of rects on the svg element by
 * swaping the elements' transform attributes.
 *
 *@param 	{rect}		rect1: svg rectangle element to swap.
 *@param 	{rect}		rect2: svg rectangle element to swap.
 *
 *@returns	{promise}	returns promis when completed to move to next step.
 */
let swap = (rect1, rect2) => {
	const timeout = 500 //timeout in ms

	return new Promise((resolve) => {
		let swaps = () => {
			let temp1 = rect1.getAttribute('transform');
			rect1.setAttribute('transform', rect2.getAttribute('transform'));
			rect2.setAttribute('transform', temp1);
			resolve();
		}
		setTimeout(swaps, timeout);
	});
}

/**
 *Creates a rect element representing a bar for svg window.
 *
 *@param 	{int}		height: int representing the text value.
 *@param 	{int}		pos: int representing which bar the text belongs to and positioning.
 *@param 	{number}	width: decimal value represeting the width of the bar/text area.
 *
 *@returns	{SVG rect}	returns svg rectangle element for given inputs
 *TODO: change positioning to window size from static value
 *TODO: change styling of bars
 **/
let createRect = (height, pos, width) => {
	//string for rect style
	const style = "fill: white; stroke-width: 1; stroke: black";
	let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	const translate = 'translate(' + pos*width + ')';

	//setup rect
	rect.setAttribute('x', 0);
	rect.setAttribute('y', 400-height);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('style', style);
	rect.setAttribute('transform', translate);

	return rect;
}

/**
 *Returns dimensions of svg element as an Integer number.
 *
 *@param {svg element}	svg 	svg parameter to get width and height dimensions from.
 *
 *@return {array}		arr	Returns 2 value array of [width, height] of inputed svg element.
 */
let getDim = (svg) => {
	return [Number(svg.getAttribute("width")), Number(svg.getAttribute("height"))];
}

/**
 *Initializes size slider element.
 *
 *Sets up slider to update text box div to current slider value and
 * update the svg window to have current slider values of svg text and
 * svg rect elements.
 */
let initSlider = () => {
	const slider = document.querySelector("#sizeSlider");
	let text = document.querySelector("#sliderTB");

	const initialValue = 20;

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

