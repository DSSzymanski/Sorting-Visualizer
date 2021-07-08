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
 * @param	{array}		texts: array of text svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 */
 //TODO: add awaits
let mergeSort = (rects, texts) => {
	//array containing translations of rect svg objects
	const translations = getTranslations(rects.length);
	//run mergesort
	mSort(rects, texts, 0, rects.length-1, translations);
}

//TODO: awaits
let mSort = (rects, texts, leftPtr, rightPtr, translations) => {
	if(leftPtr < rightPtr){
		let middlePtr = Math.floor((leftPtr+rightPtr)/2);
		mSort(rects, texts, leftPtr, middlePtr, translations);
		mSort(rects, texts, middlePtr+1, rightPtr, translations);
		merge(rects, texts, leftPtr, middlePtr, rightPtr, translations);
	}
}

//TODO: awaits, variable names
let merge = (rects, texts, leftPtr, middlePtr, rightPtr, translations) => {
	let idx;
	let leftRect = [], rightRect = [], leftText = [], rightText = [];
	for(idx = leftPtr; idx <= middlePtr; idx++) {
		hideElements(rects[idx], texts[idx]);
		leftText.push(texts[idx]);
		leftRect.push(rects[idx]);
	}
	for(idx = middlePtr+1; idx <= rightPtr; idx++){
		hideElements(rects[idx], texts[idx]);
		rightText.push(texts[idx]);
		rightRect.push(rects[idx]);
	}
	let l = 0;
	let r = 0;
	for(let i = leftPtr; i <= rightPtr; i++) {
		let x, y;
		if(l >= leftRect.length) {
			x = 1000000000; //arbitrary high number
		}
		else{
			x = parseFloat(leftRect[l].getAttribute('height'));
		}
		if(r >= rightRect.length){
			y = 1000000000; //arbitrary high number
		}
		else{
			y = parseFloat(rightRect[r].getAttribute('height'));
		}
		if(x < y){
			leftRect[l].setAttribute('transform', translations[0][i]);
			leftText[l].setAttribute('transform', translations[1][i]);
			rects[i] = leftRect[l];
			texts[i] = leftText[l];
			l += 1;
		}
		else{
			rightRect[r].setAttribute('transform', translations[0][i]);
			rightText[r].setAttribute('transform', translations[1][i]);
			rects[i] = rightRect[r];
			texts[i] = rightText[r];
			r += 1;
		}
	}
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
 * 	in texts array as a value to compare and re-orders array based on if elements are higher or lower than
 *  that element. Elements higher go to the end of the array and then the algorithm is recursively run until
 *  it's entirely sorted.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{array}		texts: array of text svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{int}		low: minimum index for algorithm to examine. Default 0.
 * @param	{int}		high: maximum index for algorithm to examine. Defaults to last index in array.
 */
let quickSort = async(rects, texts, low=0, high=rects.length-1) => {
	let pivot;
	if(low < high) {
		pivot = await partition(rects, texts, low, high);
		quickSort(rects, texts, low, pivot-1);
		quickSort(rects, texts, pivot+1, high);
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
 * @param	{array}		texts: array of text svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{int}		low: minimum index for algorithm to examine.
 * @param	{int}		high: maximum index for algorithm to examine.
 */
let partition = async (rects, texts, low, high) => {
	let pivot, lowPtr, j; //j = loop iterator, lowPtr = position of lower than pivot
	pivot = parseFloat(texts[high].textContent);
	lowPtr = low - 1;
	for(j = low; j < high; j++) {
		if(parseFloat(texts[j].textContent) < pivot) {
			lowPtr = lowPtr + 1;
			await swap(rects[lowPtr], rects[j], texts[lowPtr], texts[j]);
			[rects[lowPtr], rects[j]] = [rects[j], rects[lowPtr]];
			[texts[lowPtr], texts[j]] = [texts[j], texts[lowPtr]];
		}
	}
	if(lowPtr+1 != high){
		await swap(rects[lowPtr+1], rects[high], texts[high], texts[lowPtr+1]);
		[rects[lowPtr+1], rects[high]] = [rects[high], rects[lowPtr+1]];
		[texts[lowPtr+1], texts[high]] = [texts[high], texts[lowPtr+1]];
	}
	return Promise.resolve(lowPtr + 1);
}

/**
let qs = (arr, low=0, high=arr.length-1) => {
	let pivot;
	if(low < high){
		pivot = partition(arr, low, high);
		qs(arr, low, pivot-1);
		qs(arr, pivot+1, high);
	}
}

let partition = (arr, low, high) => {
	let pivot, lowPtr, j; //j = loop iterator, lowPtr = position of lower than pivot
	pivot = arr[high];
	lowPtr = low - 1;
	for(j = low; j < high; j++) {
		if(arr[j] < pivot) {
			lowPtr = lowPtr + 1;
			[arr[lowPtr], arr[j]] = [arr[j], arr[lowPtr]];
		}
	}
	[arr[lowPtr+1], arr[high]] = [arr[high], arr[lowPtr+1]];
	return lowPtr + 1;
}*/


/**
 * Insertion sort algorithm. Run when algorithm select box is on insersion sort and start button is clicked.
 *
 * Basic insertion sort using the text values found within the text svg elements to compare. Iterates through
 * 	the texts array and compares the value against the previous value in the array. If the current value is
 * 	less than the previous value, swap the two values (in both positioning of the svg element and the texts
 *  and rects arrays). Continue this until the current value is greater than the element before it before
 *  the iteration continues.
 *
 * @param	{array}		rects: array of rect svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 * @param	{array}		texts: array of text svg elements in the svg window in order of being created (
 * 							order of unsorted elements).
 */
let insertionSort = async(rects, texts) => {
	//currRectIdx = represents position of current element
	//compRectIdx = represents which position currRectIdx is being tested against
	//key = int value of currRectIdx
	let currRectIdx, key, compRectIdx;

	for(currRectIdx = 1; currRectIdx < texts.length; currRectIdx++) {
		key = parseFloat(texts[currRectIdx].textContent);
		compRectIdx = currRectIdx-1;
		while(compRectIdx >= 0 && key < parseFloat(texts[compRectIdx].textContent)) {
			//swaps translation of rectangles and texts
			await swap(rects[compRectIdx], rects[compRectIdx+1], texts[compRectIdx], texts[compRectIdx+1]);
			//swap array positioning within texts
			[texts[compRectIdx], texts[compRectIdx+1]] = [texts[compRectIdx+1], texts[compRectIdx]];
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