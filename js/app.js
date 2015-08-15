//Static Data for images
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

//Global Utility Methods
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
	},
	extend_object : function(source, properties) {
	    var property;
	    for (property in properties) {
	      if (properties.hasOwnProperty(property)) {
	        source[property] = properties[property];
	      }
	    }
    	return source;
	},
	nodelist_to_array : function(nodes){ 
        var array = null; 
        try {
             array = Array.prototype.slice.call(nodes, 0); //non-IE and IE9+
        } catch (ex) { 
            array = new Array(); 
            for (var i=0, len=nodes.length; i < len; i++){
                array.push(nodes[i]); 
            } 
        }
        return array; 
    }
};

// (function(){
// 	console.log('yo');
// }())

(function(){
	//Gallery Plugin
	this.Gallery = function(options){

		//default options
		var defaults = {
			max_row_height : 300,
			margin         : 10,
			append_to      : 'body' //by default append gallery to 'body'
		}

		//create options for gallery object by extending default options.
		options = (typeof options === 'object' && options) || {};
		this.options = Utils.extend_object(defaults,options);

		//create DOM Elements references
		this.element = null;

		this.initialize();
	}

	Gallery.prototype.initialize = function(){
		console.log('init gallery');
		build_layout.call(this);
		load_images.call(this,render_images);
	}

	
	//Build basic layout of the gallery.
	function build_layout(){
		var append_to = document.querySelector(this.options.append_to),
			element = document.createElement('div');

		Utils.add_class(element,"app-gallery");
		
		if(append_to){
			append_to.appendChild(element);
			this.element = element;
		}
		else
			console.error("Could not find element to append gallery container to.");
	}

	//Loads images into a dummy document fragment and triggers a callback when all images are loaded.
	function load_images(loaded_callback){
		var frag = [],//new DocumentFragment(),
			images = this.options.images;

		if(!images || !images.length)
			return console.error("Gallery initialized without any images.")
		if(loaded_callback && typeof loaded_callback !== 'function')
			return console.error("Images loaded callback is not a function.")

		var i = 0,
			loaded_image_count = 0,
			self = this;
		
		function image_loaded(e){
			var image = e.target;
			image.setAttribute('data-original-width',image.width);
			image.setAttribute('data-original-height',image.height);
			image.setAttribute('class','gallery-image');
			loaded_image_count++;
			if(loaded_image_count === images.length)
				loaded_callback.call(self,frag);
		}
		
		while(i<images.length){
			var thumb_path = Utils.get_thumb_url(images[i++]),
				image = document.createElement('img');
			
			image.onload = image_loaded;
			image.setAttribute('src',thumb_path);
			frag.push(image);
		}
	}

	//Callback when all images are loaded
	function render_images(image_list){
		while(image_list.length){
			var row = render_row.call(this,image_list);
			this.element.appendChild(row);
		}
	}

	function render_row(image_list,row_element){
		var row_width = this.element.offsetWidth,
			max_height = this.options.max_row_height,
			image = image_list.pop();

		if(!row_element){
			row_element = document.createElement('div');
			Utils.add_class(row_element,'gallery-row');
			row_element.setAttribute('style',"width: "+this.element.offsetWidth+"px;");
			return render_row.call(this,image_list,row_element);
		}

		if(row_element.childNodes.length){
			row_element.appendChild(image);
			var row_children = Utils.nodelist_to_array(row_element.childNodes);
			var frac = row_children.reduce(function(prevValue,curValue){
				prevValue += parseInt(curValue.getAttribute('data-original-width'))/parseInt(curValue.getAttribute('data-original-height'));
				return prevValue;
			},0);
			
			var margin_offset = (row_children.length - 1)*this.options.margin;
			var new_height = (row_width-margin_offset)/frac;
			
			row_children.forEach(function(img){
				img.height = new_height;
			});
		}
		else{
			image.height = (row_width/image.width)*image.height;
			row_element.appendChild(image);
		}

		if(new_height && new_height <= max_height)
			return row_element;
		else
			return render_row.call(this,image_list,row_element);
	}


})();




// //Our Gallery Component
// var Gallery = function(options){
// 	this.initialize(options);
// }

// Gallery.prototype.initialize = function(options){
// 	if(!options){
// 		console.err('gallery init without necessary options');
// 		return 
// 	}
	
// 	//setup gallery containers
// 	var append_to = document.querySelector(options.append_to);
// 	if(!append_to){
// 		console.err('append_to container not found');
// 		return 	
// 	}

// 	this.element = document.createElement("div");
// 	this.element.setAttribute("class","app-gallery");
	
// 	append_to.appendChild(this.element);

// 	if(options.images && options.images.length){
// 		this.render_images(options.images);
// 		this.bind_on_load();
// 	}
	
// 	return this;
// }

// Gallery.prototype.render_images = function(images){
// 	if(!images.length){
// 		console.err('empty image list provided for rendering');
// 		return
// 	}
	
// 	var images_list = this.images_list || document.createElement('div');
// 	Utils.add_class(images_list,'images-list max-width-wrapper');

// 	if(!document.querySelector('.images-list')){ 
// 		//append list if not already appended
// 		this.element.appendChild(images_list);
// 	}

// 	var fragment = new DocumentFragment();
// 	while(images.length){
// 		var thumb_path = Utils.get_thumb_url(images.pop()),
// 			image = document.createElement('img');
// 		image.setAttribute('src',thumb_path);
// 		image.setAttribute('class','gallery-image');
// 		fragment.appendChild(image);
// 	}

// 	// images_list.appendChild(fragment.cloneNode(true));
// }





// var App = function(){
	
// 	//Utility Methods
	

	

// 	var images; //store images array information
	
	
// 	//Public methods on App
// 	this.setup_data = function(data){
// 		images = data.images;
// 	}


// 	//input related methods and vars
// 	var input_box = document.getElementById("input-wrapper"),
// 		input = document.getElementById("search-input");

// 	var search_submit = (function(e){
// 		var self = this;
		
// 		add_class(input_box,'loading');
// 		input.setAttribute("disabled","disabled");
		
// 		var loading_time = (Math.random()*2000)+1250;
// 		//fake a loading time
// 		setTimeout(function(){
// 			remove_class(input_box,'loading');
// 			input.removeAttribute("disabled");
// 			self.render_images();
// 		},loading_time)
		
// 		supress_event(e);
// 	}).bind(this);
// 	input_box.onsubmit = search_submit;


// 	function initialize(){
// 		//do any other setup related stuff here.
// 		console.log('app init');
// 	}
// 	initialize();
// }

window.onload = function(){
	// var ImageApp = new App();
	var gallery = new Gallery({
		margin: 10,
		append_to : "#main-content",
		images : data.images,
		max_row_height : 180		
	});
}

























//append images quickly to Document Fragment to eager load them

//make a container element for the images list
//attach an event to listen for all images loaded


//set max height threshold


//