let init = () => {
	initSlider();
	initCanvas();
	initCanvas2();
}

let initCanvas = () => {
	const canvas = document.querySelector("#sortingDisplayCanvas");
	const parent = canvas.parentElement.parentElement;
	console.log(canvas.width, canvas.height, canvas.style.width, canvas.style.height);
	canvas.width = 1000;
	canvas.height = 200;
	console.log(canvas.width, canvas.height, canvas.style.width, canvas.style.height);
}

let initSlider = () => {
	const slider = document.querySelector("#sizeSlider");
	let text = document.querySelector("#sliderTB");
	slider.oninput = function() {
		text.innerText = "Size: " + this.value;
	}
}

let incrementStep = () => {
	const stepTB = document.querySelector("#stepTB");
	stepTB.innerText = Number(stepTB.innerText) + 1;
}
/**
let startTimer = () => {
	const timeTB = document.querySelector("#timeTB");
	let time = 0;
	timerVar = setInterval(timer, 1000);

	function timer() {
		time = time+1;
		timeTB.innerText = time;
	}
}
**/

