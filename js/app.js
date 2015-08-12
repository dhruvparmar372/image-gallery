var data = {
	images : [
		"cat.jpg", 
		"clairvoyant.jpg", 
		"elephant.jpg", 
		"fish.jpg", 
		"flowers_fall.jpg", 
		"frog.jpg", 
		"hybrid.jpg", 
		"image_nature.jpg", 
		"images.jpg",
		"kitten.jpg",
		"leopard.jpg",
		"lion.jpg",
		"lion_2.jpg",
		"monkey.jpg",
		"nature-hd.jpg",
		"nature-images.jpg", 
		"nature1.jpg", 
		"parrot.jpg", 
		"pups.jpg", 
		"rabbit.jpg", 
		"racoon.jpg", 
		"rhino.jpg", 
		"snake.jpg", 
		"walrus.jpg", 
		"wolf.jpg", 
		"zebra.jpg"
	]
};

//store common app related methods in Utils object
var Utils = {
	add_class : function (element,class_name){
		if(element && element.className.indexOf(class_name) === -1)
			element.className = element.className?(document.className+" "+class_name):class_name;
		return element;
	},
	remove_class : function (element,class_name){
		if(element && element.className && element.className.indexOf(class_name) !== -1)
			element.className = element.className.replace(class_name,"").trim();
		return element;
	},
	supress_event : function (e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	},
	get_thumb_url : function(original){
		var split = original.split("."),
			name = split[0],
			ext = split[1];
		return "images/thumbs/"+name+"_thumb."+ext;
	}
}



//Our Gallery Component
var Gallery = function(options){
	this.initialize(options);
}

Gallery.prototype.initialize = function(options){
	if(!options){
		console.err('gallery init without necessary options');
		return 
	}
	
	//setup gallery containers
	var append_to = document.querySelector(options.append_to);
	if(!append_to){
		console.err('append_to container not found');
		return 	
	}

	this.element = document.createElement("div");
	this.element.setAttribute("class","app-gallery");
	
	append_to.appendChild(this.element);
	
	return this;
}

Gallery.prototype.show_images = function(images){
	if(!images.length){
		console.err('empty image list provided for rendering');
		return
	}
	
	var images_list = this.images_list || document.createElement('ul');
	Utils.add_class(images_list,'images-list max-width-wrapper');

	if(!document.querySelector('.images-list')){ 
		//append list if not already appended
		this.element.appendChild(images_list);
	}

	var fragment = new DocumentFragment();
	while(images.length){
		var thumb_path = Utils.get_thumb_url(images.pop()),
			li = document.createElement('li'),
			image = document.createElement('img');
		
		image.setAttribute('src',thumb_path);
		image.setAttribute('class','gallery-image');
		li.setAttribute('class','gallery-image-item');
		li.appendChild(image);
		
		fragment.appendChild(li);
	}

	images_list.appendChild(fragment.cloneNode(true));
}





var App = function(){
	
	//Utility Methods
	

	

	var images; //store images array information
	
	
	//Public methods on App
	this.setup_data = function(data){
		images = data.images;
	}


	//input related methods and vars
	var input_box = document.getElementById("input-wrapper"),
		input = document.getElementById("search-input");

	var search_submit = (function(e){
		var self = this;
		
		add_class(input_box,'loading');
		input.setAttribute("disabled","disabled");
		
		var loading_time = (Math.random()*2000)+1250;
		//fake a loading time
		setTimeout(function(){
			remove_class(input_box,'loading');
			input.removeAttribute("disabled");
			self.render_images();
		},loading_time)
		
		supress_event(e);
	}).bind(this);
	input_box.onsubmit = search_submit;


	//image rendering



	function initialize(){
		//do any other setup related stuff here.
		console.log('app init');
	}
	initialize();
}

window.onload = function(){
	var ImageApp = new App();

	var c = new Gallery({append_to:'#main-content'})
	c.show_images(data.images);
}