var initPhotoSwipeFromDOM = function(gallerySelector, useParent) {
	var parseThumbnailElements = function(el) {
	    var thumbElements = el.getElementsByClassName('lightbox[photoAlbum]'),
	        numNodes = thumbElements.length,
	        items = [],
	        el,
	        childElements,
	        thumbnailEl,
	        size,
	        item;
	    for(var i = 0; i < numNodes; i++) {
	        el = thumbElements[i];
	        // include only element nodes 
	        if(el.nodeType !== 1) {
	          continue;
	        }
	        childElements = el.children;
	        //size = el.getAttribute('data-size').split('x');
	        // create slide object
			item = {
				src: el.getAttribute('href'),
				w: 0,
				h: 0,
				title: el.getAttribute('title'), // caption (contents of figure)
				displayIndex: i
	        };
	        item.el = el; // save link to element for getThumbBoundsF
          	// original image
          	item.o = {
          		src: item.src,
          		w: item.w,
          		h: item.h
          	};
	        items.push(item);
	    }
	    return items;
	};
	// find nearest parent element
	var closest = function closest(el, fn) {
	    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};
	var onThumbnailsClick = function(e) {
	    e = e || window.event;
	    e.preventDefault ? e.preventDefault() : e.returnValue = false;
	    var eTarget = e.target || e.srcElement;
	    var clickedListItem = closest(eTarget, function(el) {
	    	return (' ' + el.className + ' ').indexOf(' lightbox[photoAlbum] ') > -1;
	    });
	    if(!clickedListItem) {
	        return;
	    }
	    var clickedGallery = $ec(clickedListItem).closest(gallerySelector)[0];
	    var childNodes = clickedGallery.getElementsByClassName('lightbox[photoAlbum]'),
	        numChildNodes = childNodes.length,
	        nodeIndex = 0,
	        index;
	    for (var i = 0; i < numChildNodes; i++) {
	        if(childNodes[i].nodeType !== 1) { 
	            continue; 
	        }
	        if(childNodes[i] === clickedListItem) {
	            index = nodeIndex;
	            break;
	        }
	        nodeIndex++;
	    }
	    if(index >= 0) {
	        openPhotoSwipe( index, clickedGallery );
	    }
	    return false;
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
	    params = {};
	    if(hash.length < 5) { // pid=1
	        return params;
	    }
	    var vars = hash.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        if(!vars[i]) {
	            continue;
	        }
	        var pair = vars[i].split('=');  
	        if(pair.length < 2) {
	            continue;
	        }           
	        params[pair[0]] = pair[1];
	    }
	    if(params.gid) {
	    	params.gid = parseInt(params.gid, 10);
	    }
	    return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
	    var pswpElement = document.querySelectorAll('.pswp')[0],
	        gallery,
	        options,
	        items;

		items = parseThumbnailElements(galleryElement);

	    // define options (if needed)
	    options = {
	        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
	        getThumbBoundsFn: function(index) {
	            // See Options->getThumbBoundsFn section of docs for more info
	            var thumbnail = items[index].el.children[0],
	                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	                rect = thumbnail.getBoundingClientRect(); 
	            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	        },
	        addCaptionHTMLFn: function(item, captionEl, isFake) {
				if(!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title;
				return true;
	        },
	        showHideOpacity:true,
	        getThumbBoundsFn:false,
	        zoomEl: false,
	        shareEl: false,
	        history: false,
	        bgOpacity: 0.85,
	    };
	    
    	options.index = parseInt(index, 10);

	    // exit if index not found
	    if( isNaN(options.index) ) {
	    	return;
	    }

	    // Pass data to PhotoSwipe and initialize it
	    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

	    // from: https://github.com/dimsemenov/PhotoSwipe/issues/796
		var realViewportWidth,
		    useLargeImages = false,
		    firstResize = true,
		    imageSrcWillChange;
	    
		gallery.listen('gettingData', function(index, item) {
			// Make sure the slide is not html, and that the onLoad was not already triggered for this item
			if(item.html === undefined && item.onloading === undefined && (item.w < 1 || item.h < 1)) {
			    item.onloading = true;
		        var img = new Image();
		        img.onload = function() { // will get size after load
			        item.w = this.width; // set image width
			        item.h = this.height; // set image height
		           	gallery.invalidateCurrItems(); // reinit Items
		           	gallery.updateSize(true); // reinit Items
		        }
			    img.src = item.src; // let's download image
		    }
		});

	    gallery.init();
	};

	// select all gallery elements
	var galleryElements = document.querySelectorAll( gallerySelector );
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		if (useParent) {
			galleryElements[i].onclick = onThumbnailsClick;
		}
		else {
			var photoElements = galleryElements[i].getElementsByClassName('lightbox[photoAlbum]');
			for(var j = 0, lp = photoElements.length; j < lp; j++) {
				photoElements[j].onclick = onThumbnailsClick;
			}
		}
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid && hashData.gid) {
		openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
	}
};