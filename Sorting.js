//TODO: document
let insertionSort = async(rects, texts) => {
	//i = represents position of current element
	//j = represents which position i is being tested against
	//key = int value of i
	//temp = temporary to switch arr position of rects and texts
	let i, key, j;

	for(i = 1; i < texts.length; i++) {
		key = parseInt(texts[i].textContent);
		j = i-1;
		while(j >= 0 && key < parseInt(texts[j].textContent)) {
			//swaps translation of rectangles and texts
			await swap(rects[j], rects[j+1], texts[j], texts[j+1]);
			//swap array positioning within texts
			[texts[j], texts[j+1]] = [texts[j+1], texts[j]];
			//swap array positioning withing rects
			[rects[j], rects[j+1]] = [rects[j+1], rects[j]];

			j -= 1;
		}
	}
}

let print = (arr) => {
	let string = "";
	arr.forEach(element => string = string + element.textContent + " ");
	console.log(string);
}