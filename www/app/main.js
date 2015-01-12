/**
 * Created by xiaobai on 14-6-17.
 */
app = angular.module('app', ['ngRoute'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<{');
    $interpolateProvider.endSymbol('}>');
});

//配置路由
app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'app/view/home.html',
            controller: HomeController
        }).
        when('/Img/:Id/List', {
            templateUrl: 'app/view/imglist.html',
            controller: ImgListController
        }).
        when('/Img/:Id/:id', {
            templateUrl: 'app/view/imgcont.html',
            controller: ImgContController
        }).
        when('/Nor/:Id/List', {
            templateUrl: 'app/view/norlist.html',
            controller: NorListController
        }).
        when('/Nor/:Id/:id', {
            templateUrl: 'app/view/norcont.html',
            controller: NorContController
        }).
        when('/Feedback', {
            templateUrl: 'app/view/feedback.html',
            controller: FeedbackController
        }).
        otherwise({redirectTo: '/'});
}).config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://lmid.jxspy.com/**',
    ]);
});

app.directive("scroll", function ($window) {
    return function (scope, element, attrs) {
        angular.element($window).bind("scroll", function () {
            scope.visible = false;
            scope.$apply();
        });
    };
});


function baguetteBoxstart() {
    window.baguetteBox = (function () {
        // SVG shapes used within the buttons
        var leftArrow = '<svg width="44" height="60">' +
                '<polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"' +
                'stroke-linecap="butt" fill="none" stroke-linejoin="round"/>' +
                '</svg>',
            rightArrow = '<svg width="44" height="60">' +
                '<polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"' +
                'stroke-linecap="butt" fill="none" stroke-linejoin="round"/>' +
                '</svg>',
            closeX = '<svg width="30" height="30">' +
                '<g stroke="rgb(160, 160, 160)" stroke-width="4">' +
                '<line x1="5" y1="5" x2="25" y2="25"/>' +
                '<line x1="5" y1="25" x2="25" y2="5"/>' +
                '</g></svg>';
        // Global options and their defaults
        var options = {}, defaults = {
            captions: true,
            buttons: 'auto',
            async: false,
            preload: 2,
            animation: 'slideIn',
            afterShow: null,
            afterHide: null,
            // callback when image changes with `currentIndex` and `imagesElements.length` as parameters
            onChange: null
        };
        // Object containing information about features compatibility
        var supports = {};
        // DOM Elements references
        var overlay, slider, previousButton, nextButton, closeButton;
        // Current image index inside the slider and displayed gallery index
        var currentIndex = 0, currentGallery = -1;
        // Touch event start position (for slide gesture)
        var touchStartX;
        // If set to true ignore touch events because animation was already fired
        var touchFlag = false;
        // Regex pattern to match image files
        var regex = /.+\.(gif|jpe?g|png|webp)/i;
        // Array of all used galleries (DOM elements)
        var galleries = [];
        // 2D array of galleries and images inside them
        var imagesMap = [];
        // Array containing temporary images DOM elements
        var imagesElements = [];

        // Script entry point
        function run(selector, userOptions) {
            // Fill supports object
            supports.transforms = testTransformsSupport();
            supports.svg = testSVGSupport();

            buildOverlay();

            // For each gallery bind a click event to every image inside it
            galleries = document.querySelectorAll(selector);
            [].forEach.call(
                galleries,
                function (galleryElement, galleryIndex) {
                    // Filter 'a' elements from those not linking to images
                    var tags = galleryElement.getElementsByTagName('a');
                    tags = [].filter.call(tags, function (element) {
                        return regex.test(element.href);
                    });

                    // Get all gallery images and save them in imagesMap with custom options
                    var galleryID = imagesMap.length;
                    imagesMap.push(tags);
                    imagesMap[galleryID].options = userOptions;
                }
            );
            prepareOverlay(0);
            showOverlay(0);
        }

        function buildOverlay() {
            overlay = getByID('baguetteBox-overlay');
            // Check if the overlay already exists
            if (overlay) {
                slider = getByID('baguetteBox-slider');
                previousButton = getByID('previous-button');
                nextButton = getByID('next-button');
                closeButton = getByID('close-button');
                return;
            }
            // Create overlay element
            overlay = create('div');
            overlay.id = 'baguetteBox-overlay';
            document.getElementsByTagName('body')[0].appendChild(overlay);
            // Create gallery slider element
            slider = create('div');
            slider.id = 'baguetteBox-slider';
            overlay.appendChild(slider);
            // Create all necessary buttons
            previousButton = create('button');
            previousButton.id = 'previous-button';
            previousButton.innerHTML = supports.svg ? leftArrow : '&lt;';
            overlay.appendChild(previousButton);

            nextButton = create('button');
            nextButton.id = 'next-button';
            nextButton.innerHTML = supports.svg ? rightArrow : '&gt;';
            overlay.appendChild(nextButton);

            closeButton = create('button');
            closeButton.id = 'close-button';
            closeButton.innerHTML = supports.svg ? closeX : 'X';
            overlay.appendChild(closeButton);

            previousButton.className = nextButton.className = closeButton.className = 'baguetteBox-button';

            bindEvents();
        }

        function bindEvents() {
            // When clicked on the overlay (outside displayed image) close it
            bind(overlay, 'click', function (event) {
                /*if(event.target && event.target.nodeName !== 'IMG' && event.target.nodeName !== 'FIGCAPTION')
                 hideOverlay();*/
            });
            // Add event listeners for buttons
            bind(previousButton, 'click', function (event) {
                /*jshint -W030 */
                event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
                showPreviousImage();
            });
            bind(nextButton, 'click', function (event) {
                /*jshint -W030 */
                event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
                showNextImage();
            });
            bind(closeButton, 'click', function (event) {
                /*jshint -W030 */
                event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
                hideOverlay();
                window.history.go(-1);
            });
            // Add touch events
            bind(overlay, 'touchstart', function (event) {
                // Save x axis position
                touchStartX = event.changedTouches[0].pageX;
            });
            bind(overlay, 'touchmove', function (event) {
                // If action was already triggered return
                if (touchFlag)
                    return;
                /*jshint -W030 */
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                touch = event.touches[0] || event.changedTouches[0];
                // Move at least 40 pixels to trigger the action
                if (touch.pageX - touchStartX > 40) {
                    touchFlag = true;
                    showPreviousImage();
                } else if (touch.pageX - touchStartX < -40) {
                    touchFlag = true;
                    showNextImage();
                }
            });
            bind(overlay, 'touchend', function (event) {
                touchFlag = false;
            });
            // Activate keyboard shortcuts
            bind(document, 'keydown', function (event) {
                switch (event.keyCode) {
                    case 37: // Left arrow
                        showPreviousImage();
                        break;
                    case 39: // Right arrow
                        showNextImage();
                        break;
                    case 27: // Esc
                        window.history.go(-1);
                        hideOverlay();
                        break;
                }
            });
        }

        function prepareOverlay(galleryIndex) {
            // If the same gallery is being opened prevent from loading it once again
            if (currentGallery === galleryIndex)
                return;
            currentGallery = galleryIndex;
            // Update gallery specific options
            setOptions(imagesMap[galleryIndex].options);
            // Empty slider of previous contents (more effective than .innerHTML = "")
            while (slider.firstChild)
                slider.removeChild(slider.firstChild);
            imagesElements.length = 0;
            // Prepare and append images containers
            //for(var i = 0, fullImage; i < imagesMap[galleryIndex].length; i++) {
            fullImage = create('div');
            fullImage.className = 'full-image';
            fullImage.id = 'baguette-img';
            //imagesElements.push(fullImage);
            slider.appendChild(fullImage);
            //}
        }

        function setOptions(newOptions) {
            if (!newOptions)
                newOptions = {};
            // Fill options object
            for (var item in defaults) {
                options[item] = defaults[item];
                if (typeof newOptions[item] !== 'undefined')
                    options[item] = newOptions[item];
            }
            /* Apply new options */
            // Change transition for proper animation
            slider.style.transition = slider.style.webkitTransition = (options.animation === 'fadeIn' ? 'opacity .4s ease' :
                options.animation === 'slideIn' ? '' : 'none');
            // Hide buttons if necessary
            if (options.buttons === 'auto' && ('ontouchstart' in window || imagesMap[currentGallery].length === 1))
                options.buttons = false;
            // Set buttons style to hide or display them
            previousButton.style.display = nextButton.style.display = (options.buttons ? '' : 'none');
        }

        function showOverlay(index) {
            // Return if overlay is already visible
            if (overlay.style.display === 'block')
                return;
            // Set current index to a new value and load proper image
            currentIndex = index;
            loadImage(currentIndex);

            updateOffset();
            overlay.style.display = 'block';
            // Fade in overlay
            setTimeout(function () {
                overlay.className = 'visible';
                if (options.afterShow)
                    options.afterShow();
            }, 50);
            if (options.onChange)
                options.onChange(currentIndex, imagesElements.length);
        }

        function hideOverlay() {
            // Return if overlay is already hidden
            if (overlay.style.display === 'none')
                return;
            // Fade out and hide the overlay
            overlay.className = '';
            setTimeout(function () {
                overlay.style.display = 'none';
                if (options.afterHide)
                    options.afterHide();
            }, 500);
        }

        function loadImage(index, callback) {
            if (index < 0) {
                return
            }
            var imageContainer = document.getElementById("baguette-img");
            // If index is invalid return
            if (typeof imageContainer === 'undefined')
                return;
            // Get element reference, optional caption and source path
            imageElement = imagesMap[currentGallery][index];
            imageCaption = (typeof(options.captions) === 'function') ?
                options.captions.call(imagesMap[currentGallery], imageElement) :
            imageElement.getAttribute('data-caption') || imageElement.title;
            imageSrc = getImageSrc(imageElement);

            imageContainer.innerHTML = '';
            // Prepare image container elements
            var figure = create('figure');
            var image = create('img');
            var figcaption = create('figcaption');
            imageContainer.appendChild(figure);
            // Add loader element
            figure.innerHTML = '<div class="spinner">' +
            '<div class="double-bounce1"></div>' +
            '<div class="double-bounce2"></div>' +
            '</div>';
            // Set callback function when image loads
            image.onload = function () {
                // Remove loader element
                var spinner = document.querySelector('#baguette-img .spinner');
                if (spinner != null)
                figure.removeChild(spinner);
                if (!options.async && callback)
                    callback();
            };
            image.setAttribute('src', imageSrc);
            figure.appendChild(image);
            // Insert caption if available
            if (options.captions && imageCaption) {
                figcaption.innerHTML = imageCaption;
                figure.appendChild(figcaption);
            }
            // Run callback
            if (options.async && callback)
                callback();
        }

        // Get image source location, mostly used for responsive images
        function getImageSrc(image) {
            // Set default image path from href
            var result = imageElement.href;
            // If dataset is supported find the most suitable image
            if (image.dataset) {
                var srcs = [];
                // Get all possible image versions depending on the resolution
                for (var item in image.dataset) {
                    if (item.substring(0, 3) === 'at-' && !isNaN(item.substring(3)))
                        srcs[item.replace('at-', '')] = image.dataset[item];
                }
                // Sort resolutions ascending
                keys = Object.keys(srcs).sort(function (a, b) {
                    return parseInt(a) < parseInt(b) ? -1 : 1;
                });
                // Get real screen resolution
                var width = window.innerWidth * window.devicePixelRatio;
                // Find the first image bigger than or equal to the current width
                var i = 0;
                while (i < keys.length - 1 && keys[i] < width)
                    i++;
                result = srcs[keys[i]] || result;
            }
            return result;
        }

        // Return false at the right end of the gallery
        function showNextImage() {
            var returnValue;
            // Check if next image exists
            if (currentIndex <= imagesMap[0].length - 2) {
                currentIndex++;
                updateOffset();
                preloadNext(currentIndex);
                returnValue = true;
            } else if (options.animation) {
                slider.className = 'bounce-from-right';
                setTimeout(function () {
                    slider.className = '';
                }, 400);
                returnValue = false;
            }
            if (options.onChange)
                options.onChange(currentIndex, imagesElements.length);
            return returnValue;
        }

        // Return false at the left end of the gallery
        function showPreviousImage() {
            var returnValue;
            // Check if previous image exists
            if (currentIndex >= 1) {
                currentIndex--;
                updateOffset();
                preloadPrev(currentIndex);
                returnValue = true;
            } else if (options.animation) {
                slider.className = 'bounce-from-left';
                setTimeout(function () {
                    slider.className = '';
                }, 400);
                returnValue = false;
            }
            if (options.onChange)
                options.onChange(currentIndex, imagesElements.length);
            return returnValue;
        }

        function updateOffset() {
            var offset = -currentIndex * 100 + '%';
            slider.style.opacity = 0;
            setTimeout(function () {
                /*jshint -W030 */
                slider.style.opacity = 1;
            }, 400);
        }

        // CSS 3D Transforms test
        function testTransformsSupport() {
            var div = create('div');
            return typeof div.style.perspective !== 'undefined' || typeof div.style.webkitPerspective !== 'undefined';
        }

        // Inline SVG test
        function testSVGSupport() {
            var div = create('div');
            div.innerHTML = '<svg/>';
            return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
        }

        function preloadNext(index) {
            if (index - currentIndex >= options.preload)
                return;
            loadImage(index + 1);
        }

        function preloadPrev(index) {
            if (currentIndex - index >= options.preload)
                return;
            loadImage(index - 1);
        }

        function bind(element, event, callback) {
            if (element.addEventListener)
                element.addEventListener(event, callback, false);
            else // IE8 fallback
                element.attachEvent('on' + event, callback);
        }

        function getByID(id) {
            return document.getElementById(id);
        }

        function create(element) {
            return document.createElement(element);
        }

        return {
            run: run,
            showNext: showNextImage,
            showPrevious: showPreviousImage
        };

    })();
}
/*
 document.getElementById("daxiao").innerHTML = window.screen.width+"x"+window.screen.height;

 window.onresize=function(){
 document.getElementById("daxiao").innerHTML = window.screen.width+"x"+window.screen.height;
 }
 */