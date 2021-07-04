//TODO: document
let quickSort = async(rects, texts, low=0, high=rects.length-1) => {
	let pivot;
	if(low < high) {
		pivot = await partition(rects, texts, low, high);
		quickSort(rects, texts, low, pivot-1);
		quickSort(rects, texts, pivot+1, high);
	}
}

//TODO: document
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