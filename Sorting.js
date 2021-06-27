//TODO: make into async function
//TODO: document
let insertionSort = (rects, texts) => {
	let i, key, j;

	for(i = 1; i < texts.length; i++) {
		key = parseInt(texts[i].textContent);
		while(j >= 0 && key < parseInt(texts[j].textContent)) {
			swap(rects[j], rects[j+1], texts[j], texts[j+1]);
			let temp = texts[j];
			texts[j] = texts[j+1];
			texts[j+1] = temp;
			temp = rects[j];
			rects[j] = rects[j+1];
			rects[j+1] = temp;
			j -= 1;
		}
	}
}

let print = (arr) => {
	let string = "";
	arr.forEach(element => string = string + element.textContent + " ");
	console.log(string);
}