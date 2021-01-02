/*Photo Rotator: how it works
 * Rotating photos: there are several z-index depths that are being utilized:
 * the controls(buttons) are on top, the current image is next, the next image is after that and the others are on the "storage" layer
 * the animations work by replacing the top image in some way with the next image.
 *
 * Rotating shortcuts: we rotate the shortcuts by shrinking them down on one side, moving them to the other side and unshrinking them back into place.
*/
var Rotator = function(imageContent, timingSeconds, effect, zindexBase, rotatorDiv, backBtn, fwdBtn, pauseBtn, shortcuts, shortcutsBefore, shortcutsAfter){
	//initialization of photo rotator
	var rotator = this;
	//setup z-index values
	rotator.zBase = zindexBase;          //the base zindex value - this is our starting point
	rotator.zStorage = this.zBase + 5;   //images that are not being displayed
	rotator.zNext = this.zBase + 8;      //the next image to be displayed
	rotator.zCurrent = this.zBase + 10;  //the image currently being displayed
	rotator.zControls = this.zBase + 15; //the controls that overlay the rotator
	//setup divs
	rotator.effect = effect;
	rotator.rotatorDiv = rotatorDiv;
	rotator.parent = rotator.rotatorDiv.parent();
	rotator.backBtn = rotator.parent.find('.' + backBtn);
	rotator.fwdBtn = rotator.parent.find('.' + fwdBtn);
	rotator.pauseBtn = rotator.parent.find('.' + pauseBtn);
	rotator.shortcuts = rotator.parent.find('.' + shortcuts);
	rotator.rotatorDiv.hover(function(e) { rotator.hoverIn(rotator); }, function(e) { rotator.hoverOut(rotator); });
	rotator.width = rotator.rotatorDiv.width();
	$ec(window).resize(function() { rotator.width = rotator.rotatorDiv.width(); });
	rotator.height = rotator.rotatorDiv.height();
	$ec(window).resize(function() { rotator.height = rotator.rotatorDiv.height(); });
	//initialization
	rotator.current = 0;
	rotator.performingEffect = false;
	rotator.isGalleryModule = rotator.rotatorDiv.parents('.galleryModule').length;
	//remove initial image
	var oldImage = rotator.rotatorDiv.children('.firstImage');
	rotator.load(imageContent);
	oldImage.remove();
	rotator.setupShortcuts(shortcutsBefore, shortcutsAfter);
	//setup timer
	if(rotator.images.length > 1) {
		//start image rotation only if there is more than one image
		rotator.timer = $ec.timer(function() {rotator.transition(true);}, timingSeconds * 1000, true);
		if (rotator.pauseBtn.hasClass("rotatorPlay")) {
			rotator.timer.toggle();
		}
	} else {
		// hide forward, back, etc. buttons
		rotator.backBtn.hide();
		rotator.fwdBtn.hide();
		rotator.pauseBtn.hide();
		rotator.shortcuts.hide();
	}
	rotator.fwdBtn.click(function(e) { rotator.next(rotator); });
	rotator.backBtn.click(function(e) { rotator.back(rotator); });
	rotator.pauseBtn.click(function(e) { rotator.pauseToggle(rotator); });
	var hammer = new Hammer.Manager(rotator.rotatorDiv[0], {
		inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
	});
	//https://hammerjs.github.io/jsdoc/input.js.html
	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
	if(SUPPORT_ONLY_TOUCH) {
		rotator.rotatorDiv.parent().addClass("touchEventsActive");
	}
	hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
	hammer.add(new Hammer.Press());
	hammer.add(new Hammer.Tap());
	hammer.on('swipeleft', function(ev) {
		rotator.next(rotator);
	});
	hammer.on('swiperight', function(ev) {
		rotator.back(rotator);
	});
	hammer.on('press', function(ev) {
		//Open Link
	});
	hammer.on('tap', function(ev) {
		//Open Lightbox
		rotator.containers[rotator.current].click();
	});
};

//this loads all images and other content
Rotator.prototype.load = function(imageContent) {
	var rotator = this;
	rotator.images = [];
	rotator.containers = [];
	rotator.captions = [];
	var cnt = 0;
	for (i in imageContent) {
		var content = imageContent[i];
		if (content.hasOwnProperty('img')) {
			//create the container
			var container;
			if (content.hasOwnProperty('href') && content.href) {
				container = $ec(document.createElement('a'));
				container.attr('href', content.href);
				if (content.hasOwnProperty('target')) {
					container.attr('target', content.target);
				}
			} else {
				container = $ec(document.createElement('span'));
			}
			$ec(container).addClass('slideshowImageWrapper');
			rotator.containers[cnt] = container;
			//create the image
			container.html('<img class="slideshowImage" src="' + content.img + '"/>');
			if (content.hasOwnProperty('additionalclass') && content.additionalclass) {
				$ec(container).find(".slideshowImage").addClass(content.additionalclass);
			}
			//if in GalleryModule
			if( rotator.isGalleryModule ) {
				$ec(container).addClass('lightbox[photoAlbum]');
				if (cnt < 5 || cnt >= (imageContent.length - 2)) {
					container.html(container.html() + '<img class="slideshowBackgroundImage" src="' + content.img + '"/>');
				}
				else {
					$ec(container).addClass('hidden');
					container.html('<img class="slideshowImage" hiddensrc="' + content.img + '"/><img class="slideshowBackgroundImage" hiddensrc="' + content.img + '"/>');
				}
			}
			var img = container.children('img');
			rotator.images[cnt] = img;
			container.css({position: 'absolute', top: 0, left: 0});
			if (cnt == 0) {
				container.css({zIndex: rotator.zCurrent});
			} else if (cnt == 1) {
				container.css({zIndex: rotator.zNext});
			} else {
				container.css({zIndex: rotator.zStorage});
			}
			//create the shortcut
			var shortcut = $ec(document.createElement('div'));
			shortcut.attr('id', 'rotatorShortcut' + cnt);
			shortcut.data('container', cnt);
			if (cnt == 0) {
				shortcut.addClass('shortcutCurrent');
			}
			shortcut.click(function(e) { rotator.shortcutClick(rotator); });
			rotator.shortcuts.append(shortcut);
			rotator.firstShortcut = 0;
			rotator.captions[cnt] = $ec('');
			//create the caption
			if (content.title != undefined || content.caption != undefined || content.callToAction != undefined) {
				var caption = $ec(document.createElement('div'));
				rotator.captions[cnt] = caption;
				caption.addClass('captionPositioner');

				var captionInner = $ec(document.createElement('div'));
				captionInner.addClass('caption');
				$ec(container).addClass('hasCaption');
				caption.append(captionInner);
				if (content.title != undefined) {
					var title = $ec(document.createElement('div'));
					title.html(content.title);
					title.addClass('title');
					captionInner.append(title);
					img.attr('alt', content.title);
				}
				if (content.caption != undefined) {
					var captionContent = $ec(document.createElement('div'));
					captionContent.html(content.caption);
					captionContent.addClass('captionContent');
					captionInner.append(captionContent);
					if( !img.attr('alt') ) {
						img.attr('alt', content.caption);
					}
					if( rotator.isGalleryModule ) {
						container.attr('title', content.caption);
					}
				}
				if(content.callToAction != undefined) {
					var callToAction = $ec(document.createElement('span'));
					callToAction.html(content.callToAction);
					callToAction.addClass('callToAction');
					captionInner.append(callToAction);
					captionInner.addClass('hasCallToAction');
					rotator.rotatorDiv.parent().parent().parent().addClass("hasCallToActionSlide");	//class on the #featureSlideshow ul
					if( !img.attr('alt') ) {
						img.attr('alt', content.callToAction);
					}
				}
				container.append(caption);
				shortcut.append(caption.clone()); //the caption will be in both places - use CSS to determine which will be displayed
			}
			else {
				img.attr('alt', "Slide " + (cnt+1));
			}
			//add container to rotator
			rotator.rotatorDiv.append(container);
			cnt++;
		}
	}
	if( rotator.isGalleryModule ) {
		rotator.rotatorDiv.find(".slideshowImage").each(function() {
			rotator.setImageFill($ec(this));
		});
	}
};

Rotator.prototype.setImageFill = function(image) {
	var tempImageSrc = image.attr("src");
	if (tempImageSrc != undefined) {
		var tempImage1 = new Image();
		tempImage1.src = tempImageSrc;
		tempImage1.onload = function() {
			var imageRatio = tempImage1.width / tempImage1.height;
			if (imageRatio > (4/3)) {
				//landscape
				if (imageRatio > (2.78) ) {
					image.parent().addClass('landscape');
				}
				else {
					image.parent().addClass('landscapeFill');
				}
			}
			else {
				//portrait
				if (imageRatio > (7/6) ) {
					image.parent().addClass('portraitFill');
				}
				else {
					image.parent().addClass('portrait');
				}
			}
		};
	}
}

//setup the shortcut boxes
Rotator.prototype.setupShortcuts = function(shortcutsBefore, shortcutsAfter) {
	var rotator = this;
	if (shortcutsBefore + shortcutsAfter > 0 && shortcutsBefore + shortcutsAfter + 1 < rotator.containers.length) {
		rotator.rotateShortcuts = true;
		rotator.shortcutsBefore = shortcutsBefore;
		rotator.shortcutsAfter = shortcutsAfter;
	} else {
		rotator.rotateShortcuts = false;
	}
	//don't hideShortcuts because we don't want the animation - they will simply be hidden below
	rotator.updateShortcuts(false);

	//hide shortcuts that aren't in our view
	if (rotator.rotateShortcuts) {
		var shortcutsMiddle = Math.floor((rotator.containers.length - 1) / 2);
		for (var i = 0; i < rotator.containers.length; i++) {
			if (i < shortcutsMiddle - rotator.shortcutsBefore || i > shortcutsMiddle + rotator.shortcutsAfter) {
				rotator.shortcuts.children(':nth-child(' + (i + 1) + ')').css({width: '0px'});
			}
		}
	}
};

//executes when user hovers over the rotator - adds class to all related divs
Rotator.prototype.hoverIn = function(rotator) {
	rotator.backBtn.addClass('hover');
	rotator.fwdBtn.addClass('hover');
	rotator.pauseBtn.addClass('hover');
	rotator.shortcuts.addClass('hover');
};

//executes when user no longer hovers over the rotator
Rotator.prototype.hoverOut = function(rotator) {
	rotator.backBtn.removeClass('hover');
	rotator.fwdBtn.removeClass('hover');
	rotator.pauseBtn.removeClass('hover');
	rotator.shortcuts.removeClass('hover');
};

//click on a shortcut
Rotator.prototype.shortcutClick = function(rotator) {
	if (!rotator.performingEffect && rotator.timer != undefined) {
		if (rotator.timer.isActive) {
			rotator.timer.reset();
		} else {
			rotator.timer.reset();
			rotator.timer.pause();
		}
		$this = $ec(this);
		var toStorage1 = rotator.current;
		if (toStorage1 > rotator.containers.length - 1) {
			toStorage1 = 0;
		}
		var toStorage2 = rotator.current + 1;
		if (toStorage2 > rotator.containers.length - 1) {
			toStorage2 = 0;
		}
		rotator.current = $this.data('container');
		var newImg = rotator.current;
		var nextImg = rotator.current + 1;
		if (nextImg > rotator.containers.length - 1) {
			nextImg = 0;
		}
		rotator.containers[nextImg].css({zIndex: rotator.zNext});
		rotator.containers[newImg].css({zIndex: rotator.zCurrent});
		rotator.containers[toStorage1].css({zIndex: rotator.zStorage});
		rotator.containers[toStorage2].css({zIndex: rotator.zStorage});
		//these are repeated to make sure that they are set in the end and there are no glitches
		rotator.containers[nextImg].css({zIndex: rotator.zNext});
		rotator.containers[newImg].css({zIndex: rotator.zCurrent});
		rotator.updateShortcuts(true);
	}
};

//click the next button
Rotator.prototype.next = function(rotator) {
	if (!rotator.performingEffect) {
		if (rotator.timer) {
			if (rotator.timer.isActive) {
				rotator.timer.reset();
			} else {
				rotator.timer.reset();
				rotator.timer.pause();
			}
			rotator.transition(false);
		}
	}
};

//click the back button
Rotator.prototype.back = function(rotator) {
	if (!rotator.performingEffect) {
		if (rotator.timer)
		{
			if (rotator.timer.isActive) {
				rotator.timer.reset();
			} else {
				rotator.timer.reset();
				rotator.timer.pause();
			}
			var toStorage = rotator.current + 1;
			if (toStorage > rotator.containers.length - 1) {
				toStorage = 0;
			}
			var oldImg = rotator.current;
			rotator.current--;
			if (rotator.current < 0) {
				rotator.current = rotator.containers.length - 1;
			}
			var newImg = rotator.current;
			rotator.containers[toStorage].css({zIndex: rotator.zStorage});
			rotator.containers[oldImg].css({zIndex: rotator.zNext});
			rotator.containers[newImg].css({zIndex: rotator.zCurrent});
			rotator.updateShortcuts(true);
			var hiddenPhotos = rotator.rotatorDiv.find(".slideshowImageWrapper.hidden");
			if (rotator.isGalleryModule && hiddenPhotos.length > 0) {
				var hiddenDiv = rotator.rotatorDiv.find(".slideshowImageWrapper.hidden + .slideshowImageWrapper:not(.hidden)").first();
				if (hiddenDiv.length != 1) {
					rotator.rotatorDiv.find(".slideshowImageWrapper.hidden").last();
				}
				else {
					hiddenDiv = hiddenDiv.prev();
				}
				hiddenDiv.find("img").each( function() {
					$ec(this).attr( "src", $ec(this).attr("hiddensrc") );
					$ec(this).removeAttr( "hiddensrc" );
				});
				hiddenDiv.removeClass('hidden');
				rotator.setImageFill(hiddenDiv.find(".slideshowImage"));
			}
		}
	}
};

/*converts between the actual order of the shortcuts to the shorthand
 * if actual DOM order is:             45670123
 * the shorthand order would still be: 01234567
 * the return value for current of 2 would be 6 (6 is under 2 when comparing the lists above
*/
function rotatortoShorthand(current, length, first) {
	if (first == 0) {
		return current;
	} else if (first > current) {
		return current + length - first;
	} else {
		return current - first;
	}
};

//reverses the method above
Rotator.prototype.fromShorthand = function(current, length, first) {
	if (first == 0) {
		return current;
	} else if (first > current) {
		return current - length + first;
	} else {
		return current + first;
	}
};

//called to update the shortcut list
//hideShortcuts - whether to hide the shortcuts or not - this should only happen the first time it is called (we want no animations on creation)
Rotator.prototype.updateShortcuts = function(hideShortcuts) {
	var rotator = this;
	if (rotator.rotateShortcuts){
		var shortcutsMiddle = Math.floor((rotator.containers.length - 1) / 2);
		var current = rotatortoShorthand(rotator.current, rotator.containers.length, rotator.firstShortcut);
		var location = shortcutsMiddle;
		if (current < location) {
			//rotator moving in backward direction, shortcuts moving in a forward direction
			var travel = location - current;
			rotator.shortcutsRotateForward(travel, hideShortcuts, shortcutsMiddle);
			rotator.firstShortcut = rotator.firstShortcut - travel;
		} else {
			//rotator moving in forward direction, shortcuts moving in a backward direction
			var travel = current - location;
			rotator.shortcutsRotateBackward(travel, hideShortcuts, shortcutsMiddle);
			rotator.firstShortcut = rotator.firstShortcut + travel;
		}
		if (rotator.firstShortcut < 0) {
			rotator.firstShortcut = rotator.containers.length + rotator.firstShortcut;
		} else if (rotator.firstShortcut > rotator.containers.length - 1) {
			rotator.firstShortcut = rotator.firstShortcut - rotator.containers.length;
		}
	}

	rotator.shortcuts.children().removeClass('shortcutCurrent');
	rotator.shortcuts.children('#rotatorShortcut' + rotator.current).addClass('shortcutCurrent');
};

//rotates the shortcuts forward - this function is recursive because of how jquery does animations
Rotator.prototype.shortcutsRotateForward = function (travel, hideShortcuts, shortcutsMiddle) {
	var rotator = this;
	if (travel > 0) {
		if (hideShortcuts) {
			rotator.shortcuts.children(':nth-child(' + (shortcutsMiddle - rotator.shortcutsBefore) + ')').animate({width: '30px'}, 250);
			rotator.shortcuts.children(':nth-child(' + (shortcutsMiddle + rotator.shortcutsAfter + 1) + ')').animate({width: '0'}, 250,
					function() {rotator.shortcutsRotateForward(travel - 1, hideShortcuts, shortcutsMiddle);}); //recursively calls this function
		} else {
			rotator.shortcutsRotateForward(travel - 1, hideShortcuts, shortcutsMiddle);
		}
		rotator.shortcuts.prepend(rotator.shortcuts.children().last());
	}
};

//rotates the shortcuts backward - this function is recursive because of how jquery does animations
Rotator.prototype.shortcutsRotateBackward = function (travel, hideShortcuts, shortcutsMiddle) {
	var rotator = this;
	if (travel > 0) {
		rotator.shortcuts.append(rotator.shortcuts.children().first());
		if (hideShortcuts) {
			rotator.shortcuts.children(':nth-child(' + (shortcutsMiddle - rotator.shortcutsBefore) + ')').animate({width: '0'}, 250);
			rotator.shortcuts.children(':nth-child(' + (shortcutsMiddle + rotator.shortcutsAfter + 1) + ')').animate({width: '30px'}, 250,
					function() {rotator.shortcutsRotateBackward(travel -1, hideShortcuts, shortcutsMiddle);}); //recursively calls this function
		} else {
			rotator.shortcutsRotateBackward(travel -1, hideShortcuts, shortcutsMiddle);
		}
	}
};

//pause/play button is pressed
Rotator.prototype.pauseToggle = function(rotator) {
	rotator.timer.toggle();
	if (rotator.timer.isActive) {
		rotator.pauseBtn.addClass("rotatorPause");
		rotator.pauseBtn.removeClass("rotatorPlay");
	} else {
		rotator.pauseBtn.addClass("rotatorPlay");
		rotator.pauseBtn.removeClass("rotatorPause");
	}
};

//executes a photo transition to the next photo
//useEffect - should we use the effect in the transition?
Rotator.prototype.transition = function(useEffect) {
	var rotator = this;
	var oldImg = rotator.current;
	rotator.current++;
	if (rotator.current > rotator.containers.length - 1) {
		//start over
		rotator.current = 0;
	}
	var newImg = this.current;
	var nextImg = this.current + 1;
	if (nextImg > rotator.containers.length - 1) {
		nextImg = 0;
	}

	rotator.updateShortcuts(true);

	//transition
	if (useEffect) {
		rotator.performEffect(oldImg, newImg, nextImg);
	} else {
		rotator.finishEffect(oldImg, newImg, nextImg);
	}
	var hiddenPhotos = rotator.rotatorDiv.find(".slideshowImageWrapper.hidden");
	if (rotator.isGalleryModule && hiddenPhotos.length > 0) {
		var hiddenDiv = rotator.rotatorDiv.find(".slideshowImageWrapper:not(.hidden) + .slideshowImageWrapper.hidden").first();
		if (hiddenDiv.length != 1) {
			rotator.rotatorDiv.find(".slideshowImageWrapper.hidden").first();
		}
		hiddenDiv.find("img").each( function() {
			$ec(this).attr( "src", $ec(this).attr("hiddensrc") );
			$ec(this).removeAttr( "hiddensrc" );
		});
		hiddenDiv.removeClass('hidden');
		rotator.setImageFill(hiddenDiv.find(".slideshowImage"));
	}
};

//actually performs the effect
Rotator.prototype.performEffect = function(oldImg, newImg, nextImg) {
	var rotator = this;
	rotator.performingEffect = true;
	
	switch (rotator.effect) {
		case 'FADE':
			rotator.containers[oldImg].animate({opacity: 0}, 1000, function(){rotator.finishEffect(oldImg, newImg, nextImg);});
			break;
		case 'FADE_GROW':
			rotator.containers[oldImg].animate({opacity: 0}, 500, function(){rotator.finishEffect(oldImg, newImg, nextImg);});
			rotator.images[oldImg].animate({width: rotator.width * 2, height: rotator.height * 2, left: (rotator.width / 2) * -1, top: (rotator.height / 2) * -1}, 500, function(){rotator.finishEffect(oldImg, newImg, nextImg);});
			break;
		case 'SWIPE2': // was a feature in development. Looked exactly like Swipe but caused a few issues -- leaving in for the sake of those who have selected it.
		case 'SWIPE':
			rotator.captions[oldImg].css({width:rotator.width});
			rotator.captions[oldImg].animate({left:rotator.width*-1},
					{duration: 1000,
					queue: false});
			rotator.containers[oldImg].animate({opacity: 0.5, width: 0}, 1000, function(){rotator.finishEffect(oldImg, newImg, nextImg);});
			break;
		case 'WIPE':
			rotator.images[oldImg].width(rotator.width);
			rotator.captions[oldImg].width(rotator.width);
			rotator.containers[oldImg].animate({width:0}, 1000, function() {rotator.finishEffect(oldImg, newImg, nextImg);});
			break;
		case 'CLOSE_OPEN':
		case 'CLOSE':
			rotator.images[oldImg].css({position: "relative", width: rotator.width, left: 0});
			rotator.captions[oldImg].css({width:rotator.width})
				.animate({left: (rotator.width/-2)},
						{duration:1000,
						queue: false});
			rotator.containers[oldImg].animate({width: 0, left: (rotator.width/2)},
												{duration: 1000,
												queue: false,
												complete: function() { rotator.finishEffect(oldImg, newImg, nextImg);}
												});
			rotator.images[oldImg].animate({left:(rotator.width/-2)},
									{duration: 1000,
									queue: false});
			break;
		case 'OPEN_CLOSE':
		case 'OPEN':
			rotator.images[newImg].css({position:"relative", width: rotator.width, left:(rotator.width/-2)});
			rotator.captions[newImg].css({width:rotator.width, left:(rotator.width/-2)});
			rotator.containers[newImg].css({width: 0, left: (rotator.width/2), zIndex: rotator.zCurrent});
			rotator.containers[oldImg].css({"z-index":rotator.zNext});
			rotator.containers[newImg].animate({width: rotator.width, left: 0},
					{duration: 1000, queue: false,
					complete: function() { rotator.finishEffect(oldImg, newImg, nextImg);}
					});
			rotator.captions[newImg].animate({left:0},
					{duration: 1000, queue: false});
			rotator.images[newImg].animate({left:0},
					{duration: 1000, queue: false});
			break;
		case 'ROTATE':
			rotator.containers[newImg].css({width:0, left:rotator.width});
			rotator.captions[newImg].css({width:rotator.width});
			rotator.captions[oldImg].css({width:rotator.width});
			rotator.captions[oldImg].animate({left:rotator.width*-1},
					{duration: 1000,
					queue: false});
			rotator.containers[oldImg].animate({width:0},
									{duration: 1000,
									queue: false,
									complete: function() { rotator.finishEffect(oldImg, newImg, nextImg); }});
			rotator.containers[newImg].animate({width:rotator.width, left:0},
									{duration: 1000,
									queue: false});
			break;
		case 'FUNKY':
			rotator.images[oldImg].css({width: rotator.width, height:325});
			rotator.captions[oldImg].css({width: rotator.width, height: rotator.captions[oldImg].height()})
					.animate({bottom: -1*rotator.height},
							{duration: 1000,
							queue: false});
			rotator.containers[oldImg].animate({width:rotator.width/4, height:0},
					{duration: 1000,
					queue: false,
					complete:function() {rotator.finishEffect(oldImg, newImg, nextImg);}});
			break;
		case 'FUNKY2':
			rotator.images[oldImg].css({left:0, position:"relative", width: rotator.width, height:325});
			rotator.captions[oldImg].css({width: rotator.width, height: rotator.captions[oldImg].height()})
					.animate({left:(rotator.width/-2), bottom: -1*rotator.height},
							{duration: 1000,
							queue: false});
			rotator.containers[oldImg].animate({width:0, height:0, left:rotator.width/2},
					{duration: 1000,
					queue: false,
					complete: function() {rotator.finishEffect(oldImg, newImg, nextImg);}
					});
			rotator.images[oldImg].animate({left:(rotator.width/-2)},
					{duration:1000,
					queue:false,
					});
			break;
		case 'SHRINK':
			rotator.images[oldImg].css({position:"relative",
										width:rotator.width,
										height:rotator.height,
										top:(rotator.width-rotator.height)/2+50,
										left:50});
			rotator.captions[oldImg].css({width:rotator.width,
										height: rotator.captions[oldImg].height(),
										bottom:(rotator.width - rotator.height)/2+50,
										left:50});
			rotator.containers[oldImg].css({top:rotator.height/2-rotator.width/2-50,
											left:-50,
											height:rotator.width+100,
											width:rotator.width+100,
											"border-radius":rotator.width});
			rotator.containers[oldImg].animate({top:rotator.height/2, left:rotator.width/2, height:0, width:0},
										{duration:1000,
										queue: false,
										complete: function() {rotator.finishEffect(oldImg, newImg, nextImg);}
										});
			rotator.images[oldImg].animate({top:rotator.height/-2, left:rotator.width/-2},
										{duration:1000,
										queue: false,
										});
			rotator.captions[oldImg].animate({bottom:rotator.height/-2, left:rotator.width/-2},
										{duration:1000,
										queue:false,
										});
			break;
	}
};

//finishes the effect by reversing out of it for use in the future
Rotator.prototype.finishEffect = function(oldImg, newImg, nextImg) {
	var rotator = this;
	rotator.containers[oldImg].css({zIndex: rotator.zStorage});
	//reverse transition
	switch (rotator.effect) {
	case 'FADE':
		rotator.containers[oldImg].css({opacity: 1});
		break;
	case 'FADE_GROW':
		rotator.containers[oldImg].css({opacity: 1});
		rotator.images[oldImg].css({width: rotator.width, height: rotator.height, left: 0, top: 0});
		break;
	case 'SWIPE2': // was a feature in development. Looked exactly like Swipe but caused a few issues -- leaving in for the sake of those who have selected it.
	case 'SWIPE':
		rotator.containers[oldImg].css({opacity: 1, width: rotator.width});
		rotator.captions[oldImg].css({left:0});
		break;
	case 'WIPE':
		rotator.images[oldImg].css({width:"100%"});
		rotator.captions[oldImg].css({width:"100%"});
		rotator.containers[oldImg].css({width: rotator.width});
		break;
	case 'CLOSE_OPEN':
		rotator.effect = 'OPEN_CLOSE';
	case 'CLOSE':
		rotator.images[oldImg].css({width:"100%", left: 0, position:"static"});
		rotator.captions[oldImg].css({width:"100%", left:0});
		rotator.containers[oldImg].css({width: rotator.width, left: 0});
		break;
	case 'OPEN_CLOSE':
		rotator.effect = 'CLOSE_OPEN';
	case 'OPEN':
		rotator.images[newImg].css({width:"100%",position:"static"});
		rotator.captions[newImg].css({width:"100%"});
		break;
	case 'ROTATE':
		rotator.containers[oldImg].css({width:rotator.width});
		rotator.captions[oldImg].css({left:0});
		break;
	case 'FUNKY':
		rotator.images[oldImg].css({width:"100%"});
		rotator.captions[oldImg].css({width: "100%", height: "35%", bottom:0});
		rotator.containers[oldImg].css({width: rotator.width, height:rotator.height});
		break;
	case 'FUNKY2':
		rotator.images[oldImg].css({position:"static",width:"100%", left:0});
		rotator.captions[oldImg].css({width:"100%", height:"35%", bottom:0, left:0});
		rotator.containers[oldImg].css({width: rotator.width, height:rotator.height, left:0});
		break;
	case 'SHRINK':
		rotator.images[oldImg].css({position:"static", width:"100%", height:"100%", left:0, top:0});
		rotator.containers[oldImg].css({"border-radius":'', width:rotator.width, height:rotator.height, left:0, top:0});
		// I have no idea why this is necessary:
		setTimeout(function() { rotator.captions[oldImg].css({width: "100%", height: "35%", bottom:0, left:0});}, 100);
		break;
	}
	rotator.containers[newImg].css({zIndex: rotator.zCurrent});
	rotator.containers[nextImg].css({zIndex: rotator.zNext});
	rotator.performingEffect = false;
};

/**
 * jquery.timer.js
 * 
 * Copyright (c) 2011 Jason Chavannes <jason.chavannes@gmail.com>
 * 
 * http://jchavannes.com/jquery-timer
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function($) {
	$.timer = function(func, time, autostart) {
	 	this.set = function(func, time, autostart) {
	 		this.init = true;
	 	 	if(typeof func == 'object') {
		 	 	var paramList = ['autostart', 'time'];
	 	 	 	for(var arg in paramList) {if(func[paramList[arg]] != undefined) {eval(paramList[arg] + " = func[paramList[arg]]");}};
 	 			func = func.action;
	 	 	}
	 	 	if(typeof func == 'function') {this.action = func;}
		 	if(!isNaN(time)) {this.intervalTime = time;}
		 	if(autostart && !this.isActive) {
			 	this.isActive = true;
			 	this.setTimer();
		 	}
		 	return this;
	 	};
	 	this.once = function(time) {
			var timer = this;
	 	 	if(isNaN(time)) {time = 0;}
			window.setTimeout(function() {timer.action();}, time);
	 		return this;
	 	};
		this.play = function(reset) {
			if(!this.isActive) {
				if(reset) {this.setTimer();}
				else {this.setTimer(this.remaining);}
				this.isActive = true;
			}
			return this;
		};
		this.pause = function() {
			if(this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		this.stop = function() {
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		this.toggle = function(reset) {
			if(this.isActive) {this.pause();}
			else if(reset) {this.play(true);}
			else {this.play();}
			return this;
		};
		this.reset = function() {
			this.isActive = false;
			this.play(true);
			return this;
		};
		this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		};
	 	this.setTimer = function(time) {
			var timer = this;
	 	 	if(typeof this.action != 'function') {return;}
	 	 	if(isNaN(time)) {time = this.intervalTime;}
		 	this.remaining = time;
	 	 	this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
		};
	 	this.go = function() {
	 		if(this.isActive) {
	 			this.action();
	 			this.setTimer();
	 		}
	 	};

	 	if(this.init) {
	 		return new $ec.timer(func, time, autostart);
	 	} else {
			this.set(func, time, autostart);
	 		return this;
	 	}
	};
})($ec);