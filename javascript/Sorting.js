const CHANGE_COLOR = 'yellow';//rect coloring to indicate 
const NORMAL_COLOR = 'white';//rect coloring to indicate not being examined or moved.
const MOVE_COLOR = 'red';//rect coloring for moving to second svg display; merge sort only.
const CIRCLE_CHANGE_COLOR = 'red';//circle coloring indicating being examined; heap sort only.
const CIRCLE_NORMAL_COLOR = 'black';//circle coloring indicating not being examined; heap sort only.

/**
 * Function called to run merge sort algorithm on inputed array of rect objects.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 */
let mergeSort = (rects) => {
	//array containing translations of rect svg objects
	const translations = getTranslations(rects.length);

	//add extra svg for showing comparisons
	createNewSVG('Stored Array');

	//run recursive mergesort algorithm
	mergeSortAlgorithm(rects, 0, rects.length-1, translations);

	enableResetBtn();
}

/**
 * Main recursive mergeSort algorithm. Divides array of rects until they are individual elements then
 * 	compares and merges them back into their sorted place.
 * 
 * @param 	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 * @param	{int}		leftPtr: int representing the left range position of the rects array to be used.
 * @param 	{int}		rightPtr: int representing the right range position of the rects array to be used.
 * @param 	{array} 	translations: array of strings representing the css translation used for each array position.
 * 
 * @return {promise}	returns a promise when the portion of the array is sorted to move on to the next step.
 */
let mergeSortAlgorithm = async(rects, leftPtr, rightPtr, translations) => {
	if(leftPtr < rightPtr){
		let middlePtr = Math.floor((leftPtr+rightPtr)/2);
		//recursive call on left half of rect array
		await mergeSortAlgorithm(rects, leftPtr, middlePtr, translations);
		//recursive call on right half of rect array
		await mergeSortAlgorithm(rects, middlePtr+1, rightPtr, translations);
		//examine and merge back together
		await merge(rects, leftPtr, middlePtr, rightPtr, translations);
	}
	return Promise.resolve();
}

/**
 * Merge component of merge sort algorithm. Moves elements out of array and repositions them based on their
 * sorted order.
 * 
 * @param 	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 * @param	{int}		leftPtr: int representing the left range position of the rects array to be used.
 * @param 	{int}		rightPtr: int representing the right range position of the rects array to be used.
 * @param 	{array} 	translations: array of strings representing the css translation used for each array position.
 * 
 * @return {promise}	returns a promise when the portion of the array is sorted to move on to the next step.
 */
let merge = async(rects, leftPtr, middlePtr, rightPtr, translations) => {
	let idx; //index used for iterating over rect array
	let leftRect = [], rightRect = [];

	//line to show break between left and right rect arrays
	createLine(rects[middlePtr+1].getAttribute('transform'));	

	//move left side of array off the svg element and store for sorting
	for(idx = leftPtr; idx <= middlePtr; idx++) {
		await hideElement(rects[idx], MOVE_COLOR);
		leftRect.push(rects[idx]);
	}

	//move right side of array off svg element and store for sorting
	for(idx = middlePtr+1; idx <= rightPtr; idx++){
		await hideElement(rects[idx], MOVE_COLOR);
		rightRect.push(rects[idx]);
	}

	let leftIter = 0; //iterator for leftRect
	let rightIter = 0; //iterator for rightRect
	for(let i = leftPtr; i <= rightPtr; i++) {
		//get left and right values, arbitrary high value if none left
		let leftPos = (leftIter >= leftRect.length) ? 1000000000 : parseFloat(leftRect[leftIter].getAttribute('height'));
		let rightPos = (rightIter >= rightRect.length) ? 1000000000 : parseFloat(rightRect[rightIter].getAttribute('height'));
		//if left side is smaller, add left side and return to svg element
		if(leftPos < rightPos){
			await replaceElement(leftRect[leftIter], translations[i]);
			rects[i] = leftRect[leftIter];
			leftIter += 1;
		}
		//if right side is smaller, add left side and return to svg element
		else{
			await replaceElement(rightRect[rightIter], translations[i]);
			rects[i] = rightRect[rightIter];
			rightIter += 1;
		}
	}
	//remove line when done
	await removeLine();

	return Promise.resolve();
}

/**
 * Basic bubble sort algorithm. Brings elements from end of the inputted array to the front of the array.
 * Compares element to element in place before it and swaps if it is less.
 * 
 * @param 	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 */
let bubbleSort = async(rects) => {
	for(let i = 0; i < rects.length-1; i++) {
		for(let j = rects.length-1; j > i; j--) {
			//color rects to indicate rects being checked
			await colorMultiEle([rects[j], rects[j-1]], CHANGE_COLOR);
			if(parseInt(rects[j].getAttribute('height')) < parseInt(rects[j-1].getAttribute('height'))){
				await swap(rects[j], rects[j-1]);
				[rects[j], rects[j-1]] = [rects[j-1], rects[j]];
			}
			//color rects to normal color
			await colorMultiEle([rects[j], rects[j-1]], NORMAL_COLOR);
		}
	}
	enableResetBtn();
}

/**
 * heapSort is the main function to call to start the heap sort algorithm.
 * Algorithm works by sorting rect object into a heap style binary tree where
 * each node's value is greater than either of it's children. It then repeatedly
 * removes the head node from the tree, as it will alway be the largest value,
 * replaces it with a smaller node, and re-organizes the tree back into the above
 * heap tree until no nodes remain.
 * 
 * Algorithm displays in 2 svg windows, one showing what the array of rects looks
 * like as a bar graph, and one showing the heap binary tree.
 * 
 * @param 	{array}		rects: array of rect elements to be sorted based on their bar height.
 */
let heapSort = async(rects) => {
	//add extra svg for showing heap & generate svg elements
	let svg = createNewSVG("Heap Display");
	let circles = [], lines = [], texts = [];
	[circles, lines, texts] = initHeapSVG(svg, rects);

	//build elements into initial heap tree
	await buildMaxHeap(rects, circles, texts);

	for(let i = rects.length-1; i >= 1; i--) {
		//color elements representing being swapped
		await colorMultiEle([rects[0], rects[i]], CHANGE_COLOR);
		colorCircles(circles[0], circles[i], CIRCLE_CHANGE_COLOR);

		//swap on bar graph svg
		await swap(rects[0], rects[i]);
		[rects[0], rects[i]] = [rects[i], rects[0]];

		//swap circle values on heap tree svg
		[texts[0].textContent, texts[i].textContent] = [texts[i].textContent, texts[0].textContent];

		//return colors to normal, remove line from last connected node
		colorCircles(circles[0], circles[i], CIRCLE_NORMAL_COLOR);
		deleteLine(lines, i);
		await colorMultiEle([rects[0], rects[i]], NORMAL_COLOR);

		//re-heap tree
		await maxHeapify(rects, 0, i-1, circles, texts);
	}

	enableResetBtn();
}

/**
 * buildMaxHeap is called to sort the heap sort array into the initial heap tree
 * by iterating over all the elements and calling maxHeapify on them to order them.
 * 
 * @param 		{array} 	rects: rect elements representing array of numbers to be sorted
 * 								   on the bar graph svg.
 * @param 		{array} 	circles: circle elements generated for the heap sort svg.
 * 									 Used as input for coloring in the maxHeapify fn.
 * @param 		{array} 	texts: text elements generated for the heap sort svg corresponding
 * 								   to the rect heights in the bar graph svg.
 */
let buildMaxHeap = async(rects, circles, texts) => {
	for(let i = Math.floor((rects.length - 1) / 2); i >= 0; i--) {
		await maxHeapify(rects, i, rects.length-1, circles, texts);
	}
}

/**
 * maxHeapify examines a heap node (pos index) and makes sure that it's children's values
 * are smaller than it. Will change nodes around if the children are smaller and recursively
 * call itself to move across the tree if they are changed.
 * 
 * @param 		{array} 	rects: rect elements representing array of numbers to be sorted
 * 								   on the bar graph svg.
 * @param		{int}		pos: index of node to examine (both in rects for bar graph svg
 * 							     and text object in the heap svg).
 * @param		{int}		endPos: int representing the last index in the array. All indexes
 * 									past endPos represent nodes already checked.
 * @param 		{array} 	circles: circle elements generated for the heap sort svg.
 * 									 Used as input for coloring in the maxHeapify fn.
 * @param 		{array} 	texts: text elements generated for the heap sort svg corresponding
 * 								   to the rect heights in the bar graph svg.
 */
let maxHeapify = async(rects, pos, endPos, circles, texts) => {
	//initialize values
	let largest = pos;
	let left = getLeftNode(pos);
	let right = getRightNode(pos);
	//check left child
	if(left <= endPos) {
		if(parseInt(rects[left].getAttribute('height')) > parseInt(rects[pos].getAttribute('height'))){
			largest = left;
		}
	}
	//check right child
	if(right <= endPos) {
		if(parseInt(rects[right].getAttribute('height')) > parseInt(rects[largest].getAttribute('height'))){
			largest = right;
		}
	}
	//if one of the node's children are larger
	if(largest != pos) {
		//color rect elements and circle elements
		await colorMultiEle([rects[pos], rects[largest]], CHANGE_COLOR);
		colorCircles(circles[pos], circles[largest], CIRCLE_CHANGE_COLOR);

		//swap elements
		await swap(rects[pos], rects[largest]);
		[rects[pos], rects[largest]] = [rects[largest], rects[pos]];
		[texts[pos].textContent, texts[largest].textContent] = [texts[largest].textContent, texts[pos].textContent];

		//recolor elements back
		await colorMultiEle([rects[pos], rects[largest]], NORMAL_COLOR);
		colorCircles(circles[pos], circles[largest], CIRCLE_NORMAL_COLOR);

		//recursively check to make sure the heap structure is maintained
		await maxHeapify(rects, largest, endPos, circles, texts);
	}
}

/**
 * Function to calculate which index in the array is the parent
 * of the node indicated by index 'pos'.
 * 
 * @param	{int}	pos: index of node to calculate parent from.
 * 
 * @returns {int}	returns int representing parent node index.
 */
let getParentNode = (pos) => {
	return Math.floor((pos + 1) / 2) - 1;
}

/**
 * Function to calculate which index in the array is the left
 * child of the node indicated by index 'pos'.
 * 
 * @param	{int}	pos: index of node to calculate child from.
 * 
 * @returns {int}	returns int representing left child node index.
 */
let getLeftNode = (pos) => {
	return ((pos + 1) * 2) - 1;
}

/**
 * Function to calculate which index in the array is the right
 * child of the node indicated by index 'pos'.
 * 
 * @param	{int}	pos: index of node to calculate child from.
 * 
 * @returns {int}	returns int representing right child node index.
 */
let getRightNode = (pos) => {
	return (pos + 1) * 2;
}

/**
 * quickSort starts the recursive quick sort algorithm and enables the reset button when comleted.
 * 
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 */
let quickSort = async(rects) => {
	await quickSortAlgorithm(rects);
	enableResetBtn();
}

/**
 * Quick sort algorithm. Run when algorithm select box is on Quick sort and start button is clicked.
 *
 * Basic Quick sort using the text values found within the text svg elements to compare. Uses last element
 * 	in rectss array as a value to compare and re-orders array based on if elements are higher or lower than
 *  that element. Elements higher go to the end of the array and then the algorithm is recursively run until
 *  it's entirely sorted.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 * @param	{int}		low: minimum index for algorithm to examine. Default 0.
 * @param	{int}		high: maximum index for algorithm to examine. Defaults to last index in array.
 */
let quickSortAlgorithm = async(rects, low=0, high=rects.length-1) => {
	let pivot;
	if(low < high) {
		pivot = await partition(rects, low, high);
		//recursively call
		await quickSortAlgorithm(rects, low, pivot-1);
		await quickSortAlgorithm(rects, pivot+1, high);
	}
}

/**
 * Partition method for quicksort algorithm.
 * 
 * Algorithm used to partition array. Takes last element (pivot) and compares every other element to determine if
 *  they are higher/lower than the element. Reorders so that elements lower are at the lower indexes and
 * 	higher elements at higher indexes. Then swaps the pivot in between and returns that index.
 * 
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{int}		low: minimum index for algorithm to examine.
 * @param	{int}		high: maximum index for algorithm to examine.
 * 
 * @returns {promise, int}	returns promise and int representing where in the pivot point in the array lies.
 */
let partition = async(rects, low, high) => {
	let pivot, lowPtr, j; //j = loop iterator, lowPtr = position of lower than pivot
	pivot = parseFloat(rects[high].getAttribute('height'));
	lowPtr = low - 1;
	for(j = low; j < high; j++) {
		//if value is less than the pivot value, swap/color elements and changes lowest value pointer
		if(parseFloat(rects[j].getAttribute('height')) < pivot) {
			lowPtr = lowPtr + 1;
			if(lowPtr != j){//makes sure value isn't checked against itself
				await colorMultiEle([rects[j], rects[lowPtr]], CHANGE_COLOR);
				await swap(rects[lowPtr], rects[j]);
				[rects[lowPtr], rects[j]] = [rects[j], rects[lowPtr]];
				await colorMultiEle([rects[j], rects[lowPtr]], NORMAL_COLOR);
			}
		}
	}
	//if value isnt at highest position, swap/color elements so it is
	if(lowPtr+1 != high){
		await colorMultiEle([rects[high], rects[lowPtr+1]], CHANGE_COLOR);
		await swap(rects[lowPtr+1], rects[high]);
		await colorMultiEle([rects[high], rects[lowPtr+1]], NORMAL_COLOR);
		[rects[lowPtr+1], rects[high]] = [rects[high], rects[lowPtr+1]];
	}
	return Promise.resolve(lowPtr + 1);
}

/**
 * Insertion sort algorithm. Run when algorithm select box is on insersion sort and start button is clicked.
 *
 * Basic insertion sort using the height values found within the rect svg elements to compare. Iterates through
 * 	the rects array and compares the value against the previous value in the array. If the current value is
 * 	less than the previous value, swap the two values (in both positioning of the svg element and the rects
 *  array). Continue this until the current value is greater than the element before it before
 *  the iteration continues.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							   order of unsorted elements).
 */
let insertionSort = async(rects) => {
	//currRectIdx = represents position of current element
	//compRectIdx = represents which position currRectIdx is being tested against
	//key = int value of currRectIdx
	let currRectIdx, key, compRectIdx;

	for(currRectIdx = 1; currRectIdx < rects.length; currRectIdx++) {
		key = parseFloat(rects[currRectIdx].getAttribute('height'));
		compRectIdx = currRectIdx-1;
		while(compRectIdx >= 0 && key < parseFloat(rects[compRectIdx].getAttribute('height'))) {
			//color rects indicating position change
			await colorMultiEle([rects[compRectIdx], rects[compRectIdx+1]], CHANGE_COLOR);
			//swaps translation of rects
			await swap(rects[compRectIdx], rects[compRectIdx+1]);
			//color rects indicating return to normal
			await colorMultiEle([rects[compRectIdx], rects[compRectIdx+1]], NORMAL_COLOR);

			//swap array positioning withing rects
			[rects[compRectIdx], rects[compRectIdx+1]] = [rects[compRectIdx+1], rects[compRectIdx]];

			compRectIdx -= 1;
		}
	}
	enableResetBtn();
}
