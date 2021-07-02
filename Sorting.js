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