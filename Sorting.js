const CHANGE_COLOR = 'yellow';
const NORMAL_COLOR = 'white';

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
	createNewSVG();

	//run mergesort
	mergeSortAlgorithm(rects, 0, rects.length-1, translations);
}

/**
 * Main recursive mergeSort algorithm. Divides array of rects until they are individual elements then
 * 	compares and merges them back into their sorted place.
 * 
 * @param 	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{int}		leftPtr: int representing the left range position of the rects array to be used.
 * @param 	{int}		rightPtr: int representing the right range position of the rects array to be used.
 * @param 	{array} 	translations: array of strings representing the css translation used for each array position.
 * 
 * @return {promise}	returns a promise when the portion of the array is sorted to move on to the next step.
 */
let mergeSortAlgorithm = async(rects, leftPtr, rightPtr, translations) => {
	if(leftPtr < rightPtr){
		let middlePtr = Math.floor((leftPtr+rightPtr)/2);
		await mergeSortAlgorithm(rects, leftPtr, middlePtr, translations);
		await mergeSortAlgorithm(rects, middlePtr+1, rightPtr, translations);
		await merge(rects, leftPtr, middlePtr, rightPtr, translations);
	}
	return Promise.resolve();
}

/**
 * Merge component of merge sort algorithm. Moves elements out of array and repositions them based on their
 * sorted order.
 * 
 * @param 	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
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
		await hideElement(rects[idx]);
		leftRect.push(rects[idx]);
	}
	//move right side of array off svg element and store for sorting
	for(idx = middlePtr+1; idx <= rightPtr; idx++){
		await hideElement(rects[idx]);
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
 * 							order of unsorted elements).
 */
let bubbleSort = async(rects) => {
	//array containing translations of rect svg objects
	const translations = getTranslations(rects.length);

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
}

let heapSort = async(rects) => {
	//add extra svg for showing heap
	createNewSVG();

	await buildMaxHeap(rects);
	for(let i = rects.length-1; i >= 1; i--) {
		await colorMultiEle([rects[0], rects[i]], CHANGE_COLOR);
		await swap(rects[0], rects[i]);
		[rects[0], rects[i]] = [rects[i], rects[0]];
		await colorMultiEle([rects[0], rects[i]], NORMAL_COLOR);
		await maxHeapify(rects, 0, i-1);
	}
}

let buildMaxHeap = async(rects) => {
	for(let i = Math.floor((rects.length - 1) / 2); i >= 0; i--) {
		await maxHeapify(rects, i, rects.length-1);
	}
}

let maxHeapify = async(rects, pos, endPos) => {
	let largest = pos;
	let left = getLeftNode(pos);
	let right = getRightNode(pos);
	if(left <= endPos) {
		if(parseInt(rects[left].getAttribute('height')) > parseInt(rects[pos].getAttribute('height'))){
			largest = left;
		}
	}
	if(right <= endPos) {
		if(parseInt(rects[right].getAttribute('height')) > parseInt(rects[largest].getAttribute('height'))){
			largest = right;
		}
	}
	if(largest != pos) {
		await colorMultiEle([rects[pos], rects[largest]], CHANGE_COLOR);
		await swap(rects[pos], rects[largest]);
		[rects[pos], rects[largest]] = [rects[largest], rects[pos]];
		await colorMultiEle([rects[pos], rects[largest]], NORMAL_COLOR);
		await maxHeapify(rects, largest, endPos);
	}
}

let getParentNode = (pos) => {
	return Math.floor((pos + 1) / 2) - 1;
}

let getLeftNode = (pos) => {
	return ((pos + 1) * 2) - 1;
}

let getRightNode = (pos) => {
	return (pos + 1) * 2;
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
 * 							order of unsorted elements).
 * @param	{int}		low: minimum index for algorithm to examine. Default 0.
 * @param	{int}		high: maximum index for algorithm to examine. Defaults to last index in array.
 */
let quickSort = async(rects, low=0, high=rects.length-1) => {
	let pivot;
	if(low < high) {
		pivot = await partition(rects, low, high);
		quickSort(rects, low, pivot-1);
		quickSort(rects, pivot+1, high);
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
let partition = async (rects, low, high) => {
	let pivot, lowPtr, j; //j = loop iterator, lowPtr = position of lower than pivot
	pivot = parseFloat(rects[high].getAttribute('height'));
	lowPtr = low - 1;
	for(j = low; j < high; j++) {
		await colorMultiEle([rects[j], rects[lowPtr+1]], CHANGE_COLOR);
		if(parseFloat(rects[j].getAttribute('height')) < pivot) {
			lowPtr = lowPtr + 1;
			await swap(rects[lowPtr], rects[j]);
			await colorMultiEle([rects[j], rects[lowPtr]], NORMAL_COLOR);
			[rects[lowPtr], rects[j]] = [rects[j], rects[lowPtr]];
		}
		await colorMultiEle([rects[j], rects[lowPtr+1]], NORMAL_COLOR);
	}
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
 * 							order of unsorted elements).
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
}

//Testing fn.
let print = (arr) => {
	let string = "";
	arr.forEach(element => string = string + element.textContent + " ");
	console.log(string);
}