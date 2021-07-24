/*
let mergeSort = (nums, left=0, right=nums.length-1) => {
	if(left < right) {
		let middle = Math.floor((left+right)/2);
		mergeSort(nums, left, middle);
		mergeSort(nums, middle+1, right);
		m(nums, left, middle, right);
	}
}

let m = (nums, left, middle, right) => {
	let idx;
	let l = [], r = [];
	for(idx = left; idx <= middle; idx++) {
		l.push(nums[idx]);
	}
	l.push(75);
	for(idx = middle+1; idx <= right; idx++){
		r.push(nums[idx]);
	}
	r.push(75);
	let x = 0, y = 0;
	for(idx = left; idx <= right; idx++){
		if(l[x] < r[y]){
			nums[idx] = l[x];
			x+=1;
		}
		else{
			nums[idx] = r[y];
			y+= 1;
		}
	}
}*/

/**
 * Merge sort algorithm. Run when algorithm select box is on merge sort and start button is clicked.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 */
let mergeSort = (rects) => {
	//array containing translations of rect svg objects
	const translations = getTranslations(rects.length);
	//run mergesort
	mSort(rects, 0, rects.length-1, translations);
}

let mSort = async(rects, leftPtr, rightPtr, translations) => {
	if(leftPtr < rightPtr){
		let middlePtr = Math.floor((leftPtr+rightPtr)/2);
		await mSort(rects, leftPtr, middlePtr, translations);
		await mSort(rects, middlePtr+1, rightPtr, translations);
		await merge(rects, leftPtr, middlePtr, rightPtr, translations);
	}
	return Promise.resolve();
}

let merge = async(rects, leftPtr, middlePtr, rightPtr, translations) => {
	let idx;
	let leftRect = [], rightRect = [];
	for(idx = leftPtr; idx <= middlePtr; idx++) {
		await hideElement(rects[idx]);
		leftRect.push(rects[idx]);
	}
	for(idx = middlePtr+1; idx <= rightPtr; idx++){
		await hideElement(rects[idx]);
		rightRect.push(rects[idx]);
	}
	let leftIter = 0; //iterator for leftRect
	let rightIter = 0; //iterator for rightRect
	for(let i = leftPtr; i <= rightPtr; i++) {
		let leftPos = (leftIter >= leftRect.length) ? 1000000000 : parseFloat(leftRect[leftIter].getAttribute('height'));
		let rightPos = (rightIter >= rightRect.length) ? 1000000000 : parseFloat(rightRect[rightIter].getAttribute('height'));
		if(leftPos < rightPos){
			await replaceElement(leftRect[leftIter], translations[i]);
			rects[i] = leftRect[leftIter];
			leftIter += 1;
		}
		else{
			await replaceElement(rightRect[rightIter], translations[i]);
			rects[i] = rightRect[rightIter];
			rightIter += 1;
		}
	}
	return Promise.resolve();
}

let bubbleSort = () => {
	return;
}

let heapSort = () => {
	return;
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
 */
let partition = async (rects, low, high) => {
	let pivot, lowPtr, j; //j = loop iterator, lowPtr = position of lower than pivot
	pivot = parseFloat(rects[high].getAttribute('height'));
	lowPtr = low - 1;
	for(j = low; j < high; j++) {
		if(parseFloat(rects[j].getAttribute('height')) < pivot) {
			lowPtr = lowPtr + 1;
			await swap(rects[lowPtr], rects[j]);
			[rects[lowPtr], rects[j]] = [rects[j], rects[lowPtr]];
		}
	}
	if(lowPtr+1 != high){
		await swap(rects[lowPtr+1], rects[high]);
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
			//swaps translation of rects
			await swap(rects[compRectIdx], rects[compRectIdx+1]);
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