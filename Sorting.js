//TODO: document
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

let print = (arr) => {
	let string = "";
	arr.forEach(element => string = string + element.textContent + " ");
	console.log(string);
}