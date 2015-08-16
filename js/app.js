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
			element.className = element.className?(element.className+" "+class_name):class_name;
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

		initialize.call(this);
	}

	
	//Initialize method for gallery
	function initialize(){
		console.log('init gallery');
		build_layout.call(this);
		load_images.call(this,render_images);
	}
	
	//Build basic layout of the gallery.
	function build_layout(){
		var append_to = document.querySelector(this.options.append_to),
			element = document.createElement('div');

		Utils.add_class(element,"app-gallery");
		element.innerHTML = "<div id='gallery-loader'><i class='fa fa-spin fa-spinner'></i><br>loading images</div>"
		
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
			var original_path = images[i++],
				thumb_path = Utils.get_thumb_url(original_path),
				image = document.createElement('img');
			
			image.onload = image_loaded;
			image.setAttribute('src',thumb_path);
			image.setAttribute('data-original-path',thumb_path.replace('_thumb','_large_thumb'));
			frag.push(image);
		}
	}

	//Callback when all images are loaded
	function render_images(image_list){
		//remove loader
		this.element.querySelector("#gallery-loader").remove()
		
		while(image_list.length){
			var row = render_row.call(this,image_list);
			this.element.appendChild(row);
		}
		
		this.images = Utils.nodelist_to_array(document.querySelectorAll('.gallery-image'));
		
		if(typeof this.options.render_done === 'function')
			this.options.render_done.call(null,image_list);

		attach_events.call(this);
	}

	//Render one row of images. Calculates appropriate widths for each image element so that images
	//in single row have equal heights and occupy entire parent width.
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

		if(!image_list.length){
			var row_children = Utils.nodelist_to_array(row_element.childNodes);
			row_children.forEach(function(image){
				image.height = max_height;
			});
			return row_element;
		}

		if(row_element.childNodes && row_element.childNodes.length){
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



	//Attach Gallery related events.
	function attach_events(){
		var self = this,
			gallery_click_cb = gallery_clicked.bind(this);
		
		this.element.onclick = gallery_click_cb;
	}

	function gallery_clicked(e){
		//Single click event to rule them all.
		var target = e.target,
			target_class = target.className;
		
		if(target_class.indexOf('gallery-image') !== -1){
			this.highlight_image(target);
		}else if(target_class.indexOf('nav-icon') !== -1){
			if(target_class.indexOf('previous') !== -1)
				this.change_image(-1);
			else
				this.change_image(1);
		}
	}


	//Scrolls body to current details box parent row
	function set_scroll(){
		var parent_row = this.current_details_box.previousSibling,
			scroll_amount = parent_row.offsetTop;
		if(scroll_amount)
			window.scrollTo(0,scroll_amount);
		//TODO Add smooth scrolling here
	}


	//Hide next/previous icons conditionally
	function hide_icons(){
		var index = this.images.indexOf(this.active_image),
			previous_icon = this.current_details_box.querySelector('.nav-icon.previous'),
			next_icon = this.current_details_box.querySelector('.nav-icon.next');

		[previous_icon,next_icon].forEach(function(icon){
			Utils.remove_class(icon,'hide');
		});
		
		if(index === 0)
			Utils.add_class(previous_icon,'hide');
		else if(index === this.images.length - 1)
			Utils.add_class(next_icon,'hide');
	}



	//Public Methods
	
	//highlights an image in a expanded container
	Gallery.prototype.highlight_image = function(image){
		
		var self = this;
		//if currently active image is being highlighted then simply toggle detail box.
		if(image.className.indexOf('active') !== -1 && this.current_details_box){
			Utils.remove_class(this.current_details_box,'expanded');
			Utils.remove_class(image,'active');			
			setTimeout(function(){
				self.current_details_box.remove();
				self.current_details_box = null;
			},150);
			return;
		}

		Utils.remove_class(this.active_image,'active');

		var parent_row = image.parentElement,
			new_image_src = image.getAttribute('data-original-path');

		this.active_image = image;
		if(this.current_details_box && this.current_details_box.previousSibling === parent_row){
			//if same row element image is clicked
			this.current_details_box.firstChild.setAttribute('src',new_image_src);
		}else{
			//remove current details box and append a new one
			if(this.current_details_box)
				this.current_details_box.remove();
			
			this.current_details_box = null;
			var detailed_div = document.createElement('div'),
				detailed_template = "<img class='detail-image' src='"+new_image_src+"'><i class='fa fa-arrow-circle-o-left clickable previous nav-icon'></i><i class='fa fa-arrow-circle-o-right clickable next nav-icon'></i>";

			Utils.add_class(detailed_div,'gallery-detail-container');
			detailed_div.innerHTML = detailed_template;
			parent_row.insertAdjacentElement('afterend',detailed_div);
			
			setTimeout(function(){
				Utils.add_class(detailed_div,'expanded');
			});
			this.current_details_box = detailed_div;
		}
		Utils.add_class(image,'active');
		hide_icons.call(self);
		setTimeout(function(){
			set_scroll.call(self); //update scroll position
		},120);

	}


	//add more images to gallery
	Gallery.prototype.append_images = function(image_url){

	}

	//Next & Previous Image toggle
	Gallery.prototype.change_image = function(offset){
		//offset determines which image relative to current active image to show
		var new_image = this.images[this.images.indexOf(this.active_image)+offset];
		if(new_image)
			this.highlight_image(new_image);
	}

})();


(function(){

	var Application = function(){

		//input related methods and vars
		var input_box = document.getElementById("input-wrapper"),
			input = document.getElementById("search-input");

		var search_submit = (function(e){
			var self = this;
			
			Utils.add_class(input_box,'loading');
			input.setAttribute("disabled","disabled");
			
			var loading_time = (Math.random()*2000)+1250;
			//fake a loading time
			setTimeout(function(){
				Utils.remove_class(input_box,'loading');
				input.removeAttribute("disabled");
			},loading_time)
			
			Utils.supress_event(e);
		}).bind(this);
		input_box.onsubmit = search_submit;

	}

	window.onload = function(){
		window.App = new Application();
		App.gallery = new Gallery({
			margin         : 10,
			append_to      : "#main-content",
			images         : data.images,
			max_row_height : 180
		});
	}

})();



























//append images quickly to Document Fragment to eager load them

//make a container element for the images list
//attach an event to listen for all images loaded


//set max height threshold


//