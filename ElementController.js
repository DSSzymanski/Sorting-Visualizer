var timeout = 1000; //used for intervals/timeouts

const circleStyle =  "stroke-width: 1; fill: white;"; //css text for heap sort circles
const MAX_HEAP_SIZE = 31; //max heap size that can fit in window

/**
 * init initializes the main SVG (and elements inside), the size slider, the speed slider,
 * and the help icon hover text upon page load.
 */
let init = () => {
	initSvg();
	initSizeSlider();
	initSpeedSlider();
	initHelpIcon();
}

/**
 * initHelpIcon sets the hover text of the help icon for the size slider.
 */
let initHelpIcon = () => {
	let icon = document.getElementById('help');
	const helpString = "Max size for heap display is 31. If slider is above 31, it will be lowered to 31 upon starting if set higher."
	icon.setAttribute('title', helpString);
}

/**
 *Sets up svg window to preset size inside correct div.
 */
let initSvg = () => {
	const svg = document.querySelector("#sortingDisplaySvg");
	svg.setAttribute("height", "400");
	svg.setAttribute('width', '400');
}

/**
 * initHeapSVG initializes the elements of the inputed svg for the heap sort algorithm.
 * Generates all the circles, lines, and text elements based on the inputed array
 * of rect objects from the first svg's display.
 * 
 * @param 	{svg}		svg: inputted svg element to load the heap sort elements on to.
 * @param 	{array}		rects: array of rect objects from the other svg display used to
 * 							   generate the text elements and the quantity of the lines
 * 							   and circles.
 * 
 * @returns	{array}		returns array filled with arrays of generated elements in the format
 * 							[array of circles, array of lines, array of texts] to be used in
 * 							heap sort algorithm.
 */
let initHeapSVG = (svg, rects) => {
	let circles = [], texts = [];
	[circles, texts] = initCirclesAndTexts(svg, rects);
	let lines = createLines(circles, svg);
	return [circles, lines, texts];
}

/**
 * initCirclesandTexts initializes the circle and text elements used in the
 * heap sort svg display. Positioning of the elements are calculated through
 * the svg dimensions and the text values and quantities are based on the 
 * inputed array of rect elements. Once elements are create, they are returned 
 * in an array in the format [array of circles, array of texts].
 * 
 * NOTE: elements are generated based on a svg of a fixed size. Therefore, it can
 * only generate for up to 31 input rects.
 * 
 * @param 	{svg}		svg: inputted svg element to load the heap sort elements on to.
 * @param 	{array}		rects: array of rect objects from the other svg display used to
 * 							   generate the text elements and the quantity of the lines
 * 							   and circles.
 * 
 * @returns	{array}		returns array filled with arrays of generated elements in the format
 * 							[array of circles, array of texts] to be used in
 * 							heap sort algorithm.
 */
let initCirclesAndTexts = (svg, rects) => {
	let circles = [], texts = [];
	//maxRows, colPerRow used to limit amount of nodes generated to 31 
	let maxRows = 5;
	let colPerRow = 1;
	
	//variable to stop algorithm if less than 31 rects are inputed
	let count = 0;

	let yPos = svg.getAttribute('height') / maxRows;//space allowed for each element on a row
	let yOffset = yPos / 2;//offset to center elements

	//iterate to create circle and text elements
	for(let row = 0; row < maxRows; row++){
		let xPos = svg.clientWidth / colPerRow;//space allowed per row
		let xOffset = xPos / 2;//offset to position
		
		for(let col = 0; col < colPerRow; col++){
			//create circle element and add to svg
			let newCircle = createCircle(col, row, xPos, yPos, xOffset, yOffset);
			svg.appendChild(newCircle);
			circles.push(newCircle);

			//create text element and add to svg
			let newText = createText(col, row, xPos, yPos, xOffset, yOffset, Math.floor(rects[count].getAttribute('height')));
			svg.appendChild(newText);
			texts.push(newText);

			//check if all rects have been made
			count++;
			if(count == rects.length) {return [circles, texts];}
		}
		colPerRow *= 2;
	}
	return [circles, texts];
}

/**
 * Sets stroke of line connecting 2 circle elements to none
 * to signifiy that the child element is removed from the heap.
 * 
 * @param 	{array}		lines: array of lines that is indexed to find the line to be removed.
 * @param 	{int}		node: index of line to be removed.
 */
let deleteLine = (lines, node) => {
	lines[node-1].setAttribute('stroke', 'none');
}

/**
 * createLines creates line elements based on positioning of inputed array of circles.
 * Starts at 2nd array and generates lines based on parent nodes and then adds to
 * inputed svg array.
 * 
 * Used in heap sort.
 * 
 * @param 	{array} 	circles: array of circles that have already been generated.
 * 								 Used to calculate line positioning.
 * @param 	{svg}		svg: inputed svg for line elements to be added to.
 * 
 * @returns {array}		returns array of line elements generated.
 */
let createLines = (circles, svg) => {
	let lines = []
	//start from 2nd and create line based on it and it's parent node
	for(let currNode = 1; currNode < circles.length; currNode++) {
		let parentNode = getParentNode(currNode);
		let newLine = createHeapLine(circles[parentNode], circles[currNode]);
		svg.appendChild(newLine);
		lines.push(newLine);
	}
	return lines;
}

/**
 * createHeapLine generates singular line based on 2 inputed circles elements before returning the line.
 * Parent node should be the first inputed circle and child node should be the second due to the line
 * being positioned based on the radius length and direction.
 * 
 * @param 	{circle} 	circle1: circle representing parent node.
 * @param 	{circle} 	circle2: circle representing child node.
 * 
 * @returns {line}		returns generated line element.
 */
let createHeapLine = (circle1, circle2) => {
	let radius = parseInt(circle1.getAttribute('r')); //should be same for both circles

	let x1 = circle1.getAttribute('cx');
	let y1 = parseInt(circle1.getAttribute('cy')) + radius;

	let x2 = circle2.getAttribute('cx');
	let y2 = parseInt(circle2.getAttribute('cy')) - radius;

	let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute('x1', x1);
	line.setAttribute('x2', x2);
	line.setAttribute('y1', y1);
	line.setAttribute('y2', y2);
	line.setAttribute('stroke', 'black');
	
	return line;
}

/**
 * createText creates individual text element to be placed on svg.
 * 
 * @param 	{int}		col: integer representing which column the text element belongs to.
 * @param 	{int}		row: integer representing which column the text element belongs to.
 * @param 	{int}		xPos: integer representing the x positioning of the element.
 * @param 	{int}		yPos: integer representing the y positioning of the element.
 * @param 	{int}		xOffset: integer to center the element on the x axis.
 * @param 	{int}		yOffset: integer to center the element on the y axis.
 * @param 	{string} 	inputText: text to be used in text element.
 * 
 * @returns {text}		returns generated text element.
 */
let createText = (col, row, xPos, yPos, xOffset, yOffset, inputText) => {
	let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute('x', (col * xPos) + xOffset);
	text.setAttribute('y', (row * yPos) + 1.11 * yOffset);
	//anchor used to center text in corresponding circle element
	text.setAttribute('text-anchor', 'middle');
	text.textContent = inputText;
	
	return text;
}

/**
 * createCircle creates individual circle element to be placed on svg.
 * 
 * @param 	{int}		col: integer representing which column the circle element belongs to.
 * @param 	{int}		row: integer representing which column the circle element belongs to.
 * @param 	{int}		xPos: integer representing the x positioning of the element.
 * @param 	{int}		yPos: integer representing the y positioning of the element.
 * @param 	{int}		xOffset: integer to center the element on the x axis.
 * @param 	{int}		yOffset: integer to center the element on the y axis.
 * 
 * @returns {text}		returns generated circle element.
 */
let createCircle = (col, row, xPos, yPos, xOffset, yOffset) => {
	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute('cx', (col * xPos) + xOffset);
	circle.setAttribute('cy', (row * yPos) + yOffset);
	circle.setAttribute('r', 12);//radius
	circle.setAttribute('style', 'stroke: black;' + circleStyle);
	
	return circle;
}

/**
 * colorCircles sets color of 2 inputed circles.
 * 
 * @param 	{circle}		circle1: first circle element to be colored.
 * @param 	{circle}		circle2: second circle element to be colored.
 * @param 	{string}		color: can be html color string (e.g. 'red') or a hex color code
 * 								   (e.g. '#FFFFFF'). 
 */
let colorCircles = (circle1, circle2, color) => {
	circle1.setAttribute('style', 'stroke: ' + color + ';' + circleStyle);
	circle2.setAttribute('style', 'stroke: ' + color + ';' + circleStyle);
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

	//remove second svg if merge sort or heap sort was called prior
	if(!!document.getElementById("secondSVG")){
		document.getElementById("secondSVG").remove();
	}

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
	const COMPARE_TRUE = 0;//basic true representation

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
		mergeSort(rects);
	}
	else if(BUBBLE.localeCompare(alg) == COMPARE_TRUE){
		bubbleSort(rects);
	}
	else if(HEAP.localeCompare(alg) == COMPARE_TRUE){
		/*
			check to make sure that the input to create the second svg is < the max heap size.
			if it is, sets the elements to the max heap size and regenerates the svg display
			before running.
		*/
		if(document.querySelector("#sizeSlider").value > MAX_HEAP_SIZE) {
			document.querySelector("#sliderTB").innerText = "Size: " + MAX_HEAP_SIZE;
			document.querySelector("#sizeSlider").value = MAX_HEAP_SIZE;
			generateSvgElements(MAX_HEAP_SIZE);
			rects = getSortingElements();
		}
		heapSort(rects);
	}
}

/**
 *Generates rect elements within svg.
 *
 *Uses svg window dimensions to create an array of bars and text representing
 *	equally spaced bars to sort through.
 *
 *@param 	{int}	eleSize: int representing amount of numbers to sort through.
 * 							 Based on size slider.
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
	const height = svgDim[1]/eleSize;
	
	//randomize order of numbers used to generate rect/text values
	let nums = [];
	
	for(let i = 1; i <= eleSize; i++) {
		nums.push(height*i);
	}
	//randomize the ordering of the numbers.
	nums = nums.sort(() => Math.random() - 0.5);

	for(let i = 1; i <= eleSize; i++) {
		rect = createRect(nums[i-1], i-1, width, "rect"+i);
		svg.appendChild(rect);
	}
}

/**
 * Function to remove line separating left and right sides of arrays. Used only
 * 	in merge sort algorithm.
 * 
 * @returns 	{promise}	returns promise when timeout is done.
 */
let removeLine = () => {
	return new Promise((resolve) => {
		let remove = () => {
			document.getElementById('dividingLine').remove();
			resolve();
		}
		setTimeout(remove, timeout);
	});
}

/**
 * Function to add line separating left and right sides of arrays. Used only
 * 	in merge sort algorithm.
 * 
 * @param 		{string}		data: string representing translation of first rect of the right array.
 * 									  Should always be in the format "translate({number})".
 * 
 * @returns 	{svg line}		returns the generated line when finished.
 */
let createLine = (data) => {
	let xPos = parseFloat(data.split('(')[1].split(')')[0]);
	let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	line.setAttribute('id', 'dividingLine');
	line.setAttribute('x1', xPos);
	line.setAttribute('x2', xPos);
	line.setAttribute('y1', 0);
	line.setAttribute('y2', 400);
	line.setAttribute('stroke', 'black');
	document.getElementById('secondSVG').appendChild(line);
}

/**
 * Returns rect svg element to the main svg window after it's moved to the second svg display.
 * It's then moved to it's new position through translation. Used only in merge sort algorithm.
 * 
 * @param 	{rect}			rect: current svg rect object to be brought back on screen.
 * @param 	{string}		translation: string representing the css translation used for the rect based on
 * 										 it's array position.
 * 
 * @return 	{promise}		returns promise when completed to have outer function resume.
 */
let replaceElement = (rect, translation) => {
	return new Promise((resolve) => {
		let replace = () => {
			const fill = 'fill: white; ' //css fill styling
			const stroke = 'stroke: black; stroke-width: 1; '; //css stroke styling
			rect.setAttribute('style', fill + stroke);
			rect.setAttribute('transform', translation);
			//move to main svg window
			document.getElementById('sortingDisplaySvg').appendChild(rect);
			resolve();
		}
		setTimeout(replace, timeout);
	});
}
	
/**
 * colorElement is called to set an inputed svg rect's fill to inputed color.
 * 
 * @param 	{rect}			rect: current svg rect object to be colored.
 * @param 	{string}		color: can be html color string (e.g. 'red') or a hex color code
 * 								   (e.g. '#FFFFFF'). Used to color rect.
 * 
 * @return 	{promise}		returns promise when completed to have outer function resume.
 */
let colorElement = (rect, color) => {
	return new Promise((resolve) => {
		let colorRect = () => {
			const fill = 'fill: ' + color + '; ';
			const stroke = 'stroke: black; stroke-width: 1; ';
			rect.setAttribute('style', fill + stroke);
			resolve();
		}
		setTimeout(colorRect, timeout);
	});
}

/**
 * colorMultiElement is called to set an inputed array of svg rects fill to inputed color.
 * 
 * @param 	{array}			rects: array of svg rect objects to be colored.
 * @param 	{string}		color: can be html color string (e.g. 'red') or a hex color code
 * 								   (e.g. '#FFFFFF').
 * 
 * @return 	{promise}		returns promise when completed to have outer function resume.
 */
let colorMultiEle = (rects, color) => {
	return new Promise((resolve) => {
		let colorRect = () => {
			const fill = 'fill: ' + color + '; ';
			const stroke = 'stroke: black; stroke-width: 1; ';
			rects.forEach(rect => rect.setAttribute('style', fill + stroke));
			resolve();
		}
		setTimeout(colorRect, timeout);
	});
}

/**
 * Function used within merge sort when rect svg objects are colored for moving and
 * 		moved to the 2nd svg window. Color can be changed from within the colorElement function
 * 		call.
 * 
 * @param 	{svg rect}	rect: rect object to be moved.
 */
let hideElement = async(rect) => {
	await colorElement(rect, 'red'); //color to indicate moving to second screen
	await moveToSecondSVG(rect); //move to second svg window
}

/**
 * Moves inputed rect from main svg window to 2nd svg window.
 * 
 * @param 	{svg rect}	rect: svg rect to be moved to 2nd svg window.
 * 
 * @returns {promise}	returns promise when completed to have outer function resume.
 */
let moveToSecondSVG = (rect) => {
	return new Promise((resolve) => {
		let moveSecond = () => {
			//move to second svg window
			document.getElementById('secondSVG').appendChild(rect);
			resolve();
		}
		setTimeout(moveSecond, timeout);
	});
}

/**
 * Searches DOM for all svg objects and returns the transformation strings in an array in order.
 * 
 * @param 	{int}	length: amount of rects in svg.
 * 
 * @returns {array}	returns array of strings representing css transformations.
 */
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
 *@returns	{promise}	returns promise when completed to move to next step.
 */
let swap = (rect1, rect2) => {
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
 * Creates second SVG window on screen. Used in merge sort to show sorted arrays to
 * 		be merged and in heap sort to visualize the heap. Adds title banner in h3
 * 		above second svg.
 * 
 * @param 	{string}	banner: string representing title to be added above second svg
 * 								to indicate it's purpose.
 * 
 * @returns {svg} 		returns generated svg.
 */
let createNewSVG = (banner) => {
	//find location to be added
	const svgRowDiv = document.getElementById('svgRow');//base element to attach to
	//parent structure
	const bootstrapCol = document.createElement('div');
	bootstrapCol.setAttribute('class', 'col-lg-6 col-12');
	
	//text to be added
	const bannerH3 = document.createElement('h3');
	bannerH3.innerText = banner;
	
	//setup and add svg
	let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	svg.setAttribute("width", "402");
	svg.setAttribute("height", "402");
	svg.setAttribute("id", "secondSVG");
	svg.setAttribute('viewbox', "0 0 400 400");
	svg.setAttribute('preserveAspectRatio', 'none');
	
	//add everything to base div
	bootstrapCol.appendChild(bannerH3);
	bootstrapCol.appendChild(svg);
	svgRowDiv.appendChild(bootstrapCol);

	return svg;
}

/**
 *Creates a rect element representing a bar for svg window.
 *
 *@param 	{int}		height: int representing the text value.
 *@param 	{int}		pos: int representing which bar the text belongs to and positioning.
 *@param 	{number}	width: decimal value represeting the width of the bar/text area.
 *@param 	{string}	idName: incremental string used for rect id.
 *
 *@returns	{SVG rect}	returns svg rectangle element for given inputs
 */
let createRect = (height, pos, width, idName) => {
	//string for rect style
	const style = "fill: white; stroke-width: 1; stroke: black";
	let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	const translate = 'translate(' + pos*width + ')';

	//setup rect
	rect.setAttribute('id', idName);
	rect.setAttribute('x', 0);
	rect.setAttribute('y', 400-height);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('style', style);
	rect.setAttribute('transform', translate);

	return rect;
}

/**
 *Returns dimensions of svg element as an Integer number. Used to generate svg elements.
 *
 *@param {svg}		svg: svg parameter to get width and height dimensions from.
 *
 *@return {array}	Returns 2 value array of [width, height] of inputed svg element.
 */
let getDim = (svg) => {
	return [svg.clientWidth, svg.clientHeight];
}

/**
 * initSpeedSlider initializes the speed slider that controls the program's timeout value
 * based on milliseconds. Also generates text above when the bar is slid.
 * NOTE: bar can be functionally moved during algorithm.
 */
let initSpeedSlider = () => {
	const slider = document.querySelector("#speedSlider");
	let text = document.querySelector("#speedTB");

	const initialValue = 500;//initial value of 1/2 second

	//initialize slider and textbox
	slider.value = initialValue;
	text.innerText = "Speed(ms): " + initialValue;

	//setup slider to change text and timeout value.
	slider.oninput = function() {
		text.innerText = "Speed(ms): " + this.value;
		timeout = slider.value;
	}
}

/**
 *Initializes size slider element.
 *
 *Sets up slider to update text box div to current slider value and
 * update the svg window to have current slider values of svg text and
 * svg rect elements.
 */
let initSizeSlider = () => {
	const slider = document.querySelector("#sizeSlider");
	let text = document.querySelector("#sliderTB");

	const initialValue = 10;

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
