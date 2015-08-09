var images = [
	"",
	"",
	""
]


var App = function(){
	var initialize = function(){
		console.log('app init',images);
	}

	//Prepare image data for the application. We store array of image paths
	var images = [],
		i = 0;
	while(i<23)
		images.push("/images/image_" + (++i) + ".jpg");

	initialize();
}

var ImageApp = new App();