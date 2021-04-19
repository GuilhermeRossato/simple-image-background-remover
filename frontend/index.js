function addSlider() {
	const wrapper = document.createElement("div");

	const label = document.createElement("label");
	label.innerText = "Threshold";
	wrapper.appendChild(label);

	const slider = document.createElement("input");
	slider.setAttribute("type", "slider");
	slider.setAttribute("min", "0");
	slider.setAttribute("max", "255");
	slider.value = parseInt(window.localStorage.getItem("remove-bg-threshold") || "10");
	slider.addEventListener("change", function() {
		window.localStorage.setItem("remove-bg-threshold", this.value.toString());
	});
	wrapper.appendChild(slider);
	document.body.appendChild(wrapper);
}

const dropArea = document.createElement("input");
dropArea.setAttribute("type", "file");
dropArea.setAttribute("accept", "image/*");
dropArea.style.position = "fixed";
dropArea.style.border = "2px dashed #555";
dropArea.style.top = "5vh";
dropArea.style.left = "5vw";
dropArea.style.width = "90vw";
dropArea.style.height = "90vh";
dropArea.style.padding = "20px";
dropArea.style.boxSizing = "border-box";
document.body.appendChild(dropArea);

dropArea.addEventListener("dragenter", onDragenter, false);
dropArea.addEventListener("dragleave", onDragleave, false);
dropArea.addEventListener("dragover", onDragover, false);
dropArea.addEventListener("drop", onDrop, false);
dropArea.addEventListener("change", onChange, false);

const imageWrapper = document.createElement("div");
imageWrapper.style.display = "flex";
imageWrapper.style.flexWrap = "wrap";
document.body.appendChild(imageWrapper);

function onChange(event) {
	dropArea.style.display = "none";
	event.preventDefault();
	for (let file of this.files) {
		const sizeString = humanFileSize(file.size);
		const file = new FileReader();
		file.onload = function() {
			const img = new Image();
			img.onload = function() {
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				startCropping(canvas, ctx, image, sizeString);
			}
			img.src = file.result
		}
		file.readAsDataURL(file);
	}
}

function onDragenter(event) {
	console.log(event);
}

function onDragleave(event) {
	console.log(event);
}

function onDragover(event) {
	console.log(event);
}

function onDrop(event) {
	console.log(event);
	event.preventDefault();
	return false;
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si=false, dp=1) {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + " B";
	}

	const units = si
		? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		: ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
	let u = -1;
	const r = 10**dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


	return bytes.toFixed(dp) + " " + units[u];
}