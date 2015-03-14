window.Modernizr = (function(window, document, undefined) {
    var version = '2.8.3',
        Modernizr = {},
        enableClasses = true,
        docElement = document.documentElement,
        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,
        inputElem = document.createElement('input'),
        smile = ':)',
        toString = {}.toString,
        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
        omPrefixes = 'Webkit Moz O ms',
        cssomPrefixes = omPrefixes.split(' '),
        domPrefixes = omPrefixes.toLowerCase().split(' '),
        ns = {
            'svg': 'http://www.w3.org/2000/svg'
        },
        tests = {},
        inputs = {},
        attrs = {},
        classes = [],
        slice = classes.slice,
        featureName, injectElementWithStyles = function(rule, callback, nodes, testnames) {
            var style, ret, node, docOverflow, div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');
            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }
            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }
            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }
            return !!ret;
        },
        testMediaQuery = function(mq) {
            var matchMedia = window.matchMedia || window.msMatchMedia;
            if (matchMedia) {
                return matchMedia(mq) && matchMedia(mq).matches || false;
            }
            var bool;
            injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function(node) {
                bool = (window.getComputedStyle ? getComputedStyle(node, null) : node.currentStyle)['position'] == 'absolute';
            });
            return bool;
        },
        isEventSupported = (function() {
            var TAGNAMES = {
                'select': 'input',
                'change': 'input',
                'submit': 'form',
                'reset': 'form',
                'error': 'img',
                'load': 'img',
                'abort': 'img'
            };

            function isEventSupported(eventName, element) {
                element = element || document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;
                var isSupported = eventName in element;
                if (!isSupported) {
                    if (!element.setAttribute) {
                        element = document.createElement('div');
                    }
                    if (element.setAttribute && element.removeAttribute) {
                        element.setAttribute(eventName, '');
                        isSupported = is(element[eventName], 'function');
                        if (!is(element[eventName], 'undefined')) {
                            element[eventName] = undefined;
                        }
                        element.removeAttribute(eventName);
                    }
                }
                element = null;
                return isSupported;
            }
            return isEventSupported;
        })(),
        _hasOwnProperty = ({}).hasOwnProperty,
        hasOwnProp;
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function(object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError();
            }
            var args = slice.call(arguments, 1),
                bound = function() {
                    if (this instanceof bound) {
                        var F = function() {};
                        F.prototype = target.prototype;
                        var self = new F();
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;
                    } else {
                        return target.apply(that, args.concat(slice.call(arguments)));
                    }
                };
            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {
                if (elem === false) return props[i];
                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }
                return item;
            }
        }
        return false;
    }

    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }
    tests['flexbox'] = function() {
        return testPropsAll('flexWrap');
    };
    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };
    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };
    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };
    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };
    tests['touch'] = function() {
        var bool;
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
                bool = node.offsetTop === 9;
            });
        }
        return bool;
    };
    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };
    tests['postmessage'] = function() {
        return !!window.postMessage;
    };
    tests['websqldatabase'] = function() {
        return !!window.openDatabase;
    };
    tests['indexedDB'] = function() {
        return !!testPropsAll("indexedDB", window);
    };
    tests['hashchange'] = function() {
        return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };
    tests['history'] = function() {
        return !!(window.history && history.pushState);
    };
    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };
    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');
        return contains(mStyle.backgroundColor, 'rgba');
    };
    tests['hsla'] = function() {
        setCss('background-color:hsla(120,40%,100%,.5)');
        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };
    tests['multiplebgs'] = function() {
        setCss('background:url(https://),url(https://),red url(https://)');
        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };
    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };
    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };
    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };
    tests['opacity'] = function() {
        setCssAll('opacity:.55');
        return (/^0.55$/).test(mStyle.opacity);
    };
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };
    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };
    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';
        setCss((str1 + '-webkit- '.split(' ').join(str2 + str1) +
            prefixes.join(str3 + str1)).slice(0, -str1.length));
        return contains(mStyle.backgroundImage, 'gradient');
    };
    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };
    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };
    tests['csstransforms3d'] = function() {
        var ret = !!testPropsAll('perspective');
        if (ret && 'webkitPerspective' in docElement.style) {
            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };
    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };
    tests['fontface'] = function() {
        var bool;
        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });
        return bool;
    };
    tests['generatedcontent'] = function() {
        var bool;
        injectElementWithStyles(['#', mod, '{font:0/0 a}#', mod, ':after{content:"', smile, '";visibility:hidden;font:3px/1 a}'].join(''), function(node) {
            bool = node.offsetHeight >= 3;
        });
        return bool;
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
            }
        } catch (e) {}
        return bool;
    };
    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');
                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(/^no$/, '');
            }
        } catch (e) {}
        return bool;
    };
    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };
    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };
    tests['webworkers'] = function() {
        return !!window.Worker;
    };
    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };
    tests['inlinesvg'] = function() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
        Modernizr['input'] = (function(props) {
            for (var i = 0, len = props.length; i < len; i++) {
                attrs[props[i]] = !!(props[i] in inputElem);
            }
            if (attrs.list) {
                attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        Modernizr['inputtypes'] = (function(props) {
            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';
                if (bool) {
                    inputElem.value = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';
                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {
                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;
                        bool = defaultView.getComputedStyle && defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' && (inputElem.offsetHeight !== 0);
                        docElement.removeChild(inputElem);
                    } else if (/^(search|tel)$/.test(inputElemType)) {} else if (/^(url|email)$/.test(inputElemType)) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;
                    } else {
                        bool = inputElem.value != smile;
                    }
                }
                inputs[props[i]] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();
            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    Modernizr.input || webforms();
    Modernizr.addTest = function(feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {
            feature = feature.toLowerCase();
            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }
            test = typeof test == 'function' ? test() : test;
            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;
        }
        return Modernizr;
    };
    setCss('');
    modElem = inputElem = null;;
    (function(window, document) {
        var version = '3.7.0';
        var options = window.html5 || {};
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
        var supportsHtml5Styles;
        var expando = '_html5shiv';
        var expanID = 0;
        var expandoData = {};
        var supportsUnknownElements;
        (function() {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                supportsHtml5Styles = ('hidden' in a);
                supportsUnknownElements = a.childNodes.length == 1 || (function() {
                    (document.createElement)('a');
                    var frag = document.createDocumentFragment();
                    return (typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined');
                }());
            } catch (e) {
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }
        }());

        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }

        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;
            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }
            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for (; i < l; i++) {
                clone.createElement(elems[i]);
            }
            return clone;
        }

        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }
            ownerDocument.createElement = function(nodeName) {
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };
            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' +
                getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                    data.createElem(nodeName);
                    data.frag.createElement(nodeName);
                    return 'c("' + nodeName + '")';
                }) + ');return n}')(html5, data.frag);
        }

        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);
            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' + 'mark{background:#FF0;color:#000}' + 'template{display:none}');
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        }
        var html5 = {
            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
            'version': version,
            'shivCSS': (options.shivCSS !== false),
            'supportsUnknownElements': supportsUnknownElements,
            'shivMethods': (options.shivMethods !== false),
            'type': 'default',
            'shivDocument': shivDocument,
            createElement: createElement,
            createDocumentFragment: createDocumentFragment
        };
        window.html5 = html5;
        shivDocument(document);
    }(this, document));
    Modernizr._version = version;
    Modernizr._prefixes = prefixes;
    Modernizr._domPrefixes = domPrefixes;
    Modernizr._cssomPrefixes = cssomPrefixes;
    Modernizr.mq = testMediaQuery;
    Modernizr.hasEvent = isEventSupported;
    Modernizr.testProp = function(prop) {
        return testProps([prop]);
    };
    Modernizr.testAllProps = testPropsAll;
    Modernizr.testStyles = injectElementWithStyles;
    Modernizr.prefixed = function(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
        (enableClasses ? ' js ' + classes.join(' ') : '');
    return Modernizr;
})(this, this.document);;
(function() {
    "use strict";

    function setup($) {
        $.fn._fadeIn = $.fn.fadeIn;
        var noOp = $.noop || function() {};
        var msie = /MSIE/.test(navigator.userAgent);
        var ie6 = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
        var mode = document.documentMode || 0;
        var setExpr = $.isFunction(document.createElement('div').style.setExpression);
        $.blockUI = function(opts) {
            install(window, opts);
        };
        $.unblockUI = function(opts) {
            remove(window, opts);
        };
        $.growlUI = function(title, message, timeout, onClose) {
            var $m = $('<div class="growlUI"></div>');
            if (title) $m.append('<h1>' + title + '</h1>');
            if (message) $m.append('<h2>' + message + '</h2>');
            if (timeout === undefined) timeout = 3000;
            var callBlock = function(opts) {
                opts = opts || {};
                $.blockUI({
                    message: $m,
                    fadeIn: typeof opts.fadeIn !== 'undefined' ? opts.fadeIn : 700,
                    fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
                    timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
                    centerY: false,
                    showOverlay: false,
                    onUnblock: onClose,
                    css: $.blockUI.defaults.growlCSS
                });
            };
            callBlock();
            var nonmousedOpacity = $m.css('opacity');
            $m.mouseover(function() {
                callBlock({
                    fadeIn: 0,
                    timeout: 30000
                });
                var displayBlock = $('.blockMsg');
                displayBlock.stop();
                displayBlock.fadeTo(300, 1);
            }).mouseout(function() {
                $('.blockMsg').fadeOut(1000);
            });
        };
        $.fn.block = function(opts) {
            if (this[0] === window) {
                $.blockUI(opts);
                return this;
            }
            var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
            this.each(function() {
                var $el = $(this);
                if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
                    return;
                $el.unblock({
                    fadeOut: 0
                });
            });
            return this.each(function() {
                if ($.css(this, 'position') == 'static') {
                    this.style.position = 'relative';
                    $(this).data('blockUI.static', true);
                }
                this.style.zoom = 1;
                install(this, opts);
            });
        };
        $.fn.unblock = function(opts) {
            if (this[0] === window) {
                $.unblockUI(opts);
                return this;
            }
            return this.each(function() {
                remove(this, opts);
            });
        };
        $.blockUI.version = 2.66;
        $.blockUI.defaults = {
            message: '<h1>Please wait...</h1>',
            title: null,
            draggable: true,
            theme: false,
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: '3px solid #aaa',
                backgroundColor: '#fff',
                cursor: 'wait'
            },
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },
            cursorReset: 'default',
            growlCSS: {
                width: '350px',
                top: '10px',
                left: '',
                right: '10px',
                border: 'none',
                padding: '5px',
                opacity: 0.6,
                cursor: 'default',
                color: '#fff',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                'border-radius': '10px'
            },
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
            forceIframe: false,
            baseZ: 1000,
            centerX: true,
            centerY: true,
            allowBodyStretch: true,
            bindEvents: true,
            constrainTabKey: true,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: true,
            focusInput: true,
            focusableElements: ':input:enabled:visible',
            onBlock: null,
            onUnblock: null,
            onOverlayClick: null,
            quirksmodeOffsetHack: 4,
            blockMsgClass: 'blockMsg',
            ignoreIfBlocked: false
        };
        var pageBlock = null;
        var pageBlockEls = [];

        function install(el, opts) {
            var css, themedCSS;
            var full = (el == window);
            var msg = (opts && opts.message !== undefined ? opts.message : undefined);
            opts = $.extend({}, $.blockUI.defaults, opts || {});
            if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
                return;
            opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
            css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
            if (opts.onOverlayClick)
                opts.overlayCSS.cursor = 'pointer';
            themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
            msg = msg === undefined ? opts.message : msg;
            if (full && pageBlock)
                remove(window, {
                    fadeOut: 0
                });
            if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
                var node = msg.jquery ? msg[0] : msg;
                var data = {};
                $(el).data('blockUI.history', data);
                data.el = node;
                data.parent = node.parentNode;
                data.display = node.style.display;
                data.position = node.style.position;
                if (data.parent)
                    data.parent.removeChild(node);
            }
            $(el).data('blockUI.onUnblock', opts.onUnblock);
            var z = opts.baseZ;
            var lyr1, lyr2, lyr3, s;
            if (msie || opts.forceIframe)
                lyr1 = $('<iframe class="blockUI" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>');
            else
                lyr1 = $('<div class="blockUI" style="display:none"></div>');
            if (opts.theme)
                lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (z++) + ';display:none"></div>');
            else
                lyr2 = $('<div class="blockUI blockOverlay" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
            if (opts.theme && full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">';
                if (opts.title) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            } else if (opts.theme) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">';
                if (opts.title) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            } else if (full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
            } else {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
            }
            lyr3 = $(s);
            if (msg) {
                if (opts.theme) {
                    lyr3.css(themedCSS);
                    lyr3.addClass('ui-widget-content');
                } else
                    lyr3.css(css);
            }
            if (!opts.theme)
                lyr2.css(opts.overlayCSS);
            lyr2.css('position', full ? 'fixed' : 'absolute');
            if (msie || opts.forceIframe)
                lyr1.css('opacity', 0.0);
            var layers = [lyr1, lyr2, lyr3],
                $par = full ? $('body') : $(el);
            $.each(layers, function() {
                this.appendTo($par);
            });
            if (opts.theme && opts.draggable && $.fn.draggable) {
                lyr3.draggable({
                    handle: '.ui-dialog-titlebar',
                    cancel: 'li'
                });
            }
            var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
            if (ie6 || expr) {
                if (full && opts.allowBodyStretch && $.support.boxModel)
                    $('html,body').css('height', '100%');
                if ((ie6 || !$.support.boxModel) && !full) {
                    var t = sz(el, 'borderTopWidth'),
                        l = sz(el, 'borderLeftWidth');
                    var fixT = t ? '(0 - ' + t + ')' : 0;
                    var fixL = l ? '(0 - ' + l + ')' : 0;
                }
                $.each(layers, function(i, o) {
                    var s = o[0].style;
                    s.position = 'absolute';
                    if (i < 2) {
                        if (full)
                            s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"');
                        else
                            s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
                        if (full)
                            s.setExpression('width', 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
                        else
                            s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
                        if (fixL) s.setExpression('left', fixL);
                        if (fixT) s.setExpression('top', fixT);
                    } else if (opts.centerY) {
                        if (full) s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                        s.marginTop = 0;
                    } else if (!opts.centerY && full) {
                        var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
                        var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + ' + top + ') + "px"';
                        s.setExpression('top', expression);
                    }
                });
            }
            if (msg) {
                if (opts.theme)
                    lyr3.find('.ui-widget-content').append(msg);
                else
                    lyr3.append(msg);
                if (msg.jquery || msg.nodeType)
                    $(msg).show();
            }
            if ((msie || opts.forceIframe) && opts.showOverlay)
                lyr1.show();
            if (opts.fadeIn) {
                var cb = opts.onBlock ? opts.onBlock : noOp;
                var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
                var cb2 = msg ? cb : noOp;
                if (opts.showOverlay)
                    lyr2._fadeIn(opts.fadeIn, cb1);
                if (msg)
                    lyr3._fadeIn(opts.fadeIn, cb2);
            } else {
                if (opts.showOverlay)
                    lyr2.show();
                if (msg)
                    lyr3.show();
                if (opts.onBlock)
                    opts.onBlock();
            }
            bind(1, el, opts);
            if (full) {
                pageBlock = lyr3[0];
                pageBlockEls = $(opts.focusableElements, pageBlock);
                if (opts.focusInput)
                    setTimeout(focus, 20);
            } else
                center(lyr3[0], opts.centerX, opts.centerY);
            if (opts.timeout) {
                var to = setTimeout(function() {
                    if (full)
                        $.unblockUI(opts);
                    else
                        $(el).unblock(opts);
                }, opts.timeout);
                $(el).data('blockUI.timeout', to);
            }
        }

        function remove(el, opts) {
            var count;
            var full = (el == window);
            var $el = $(el);
            var data = $el.data('blockUI.history');
            var to = $el.data('blockUI.timeout');
            if (to) {
                clearTimeout(to);
                $el.removeData('blockUI.timeout');
            }
            opts = $.extend({}, $.blockUI.defaults, opts || {});
            bind(0, el, opts);
            if (opts.onUnblock === null) {
                opts.onUnblock = $el.data('blockUI.onUnblock');
                $el.removeData('blockUI.onUnblock');
            }
            var els;
            if (full)
                els = $('body').children().filter('.blockUI').add('body > .blockUI');
            else
                els = $el.find('>.blockUI');
            if (opts.cursorReset) {
                if (els.length > 1)
                    els[1].style.cursor = opts.cursorReset;
                if (els.length > 2)
                    els[2].style.cursor = opts.cursorReset;
            }
            if (full)
                pageBlock = pageBlockEls = null;
            if (opts.fadeOut) {
                count = els.length;
                els.stop().fadeOut(opts.fadeOut, function() {
                    if (--count === 0)
                        reset(els, data, opts, el);
                });
            } else
                reset(els, data, opts, el);
        }

        function reset(els, data, opts, el) {
            var $el = $(el);
            if ($el.data('blockUI.isBlocked'))
                return;
            els.each(function(i, o) {
                if (this.parentNode)
                    this.parentNode.removeChild(this);
            });
            if (data && data.el) {
                data.el.style.display = data.display;
                data.el.style.position = data.position;
                if (data.parent)
                    data.parent.appendChild(data.el);
                $el.removeData('blockUI.history');
            }
            if ($el.data('blockUI.static')) {
                $el.css('position', 'static');
            }
            if (typeof opts.onUnblock == 'function')
                opts.onUnblock(el, opts);
            var body = $(document.body),
                w = body.width(),
                cssW = body[0].style.width;
            body.width(w - 1).width(w);
            body[0].style.width = cssW;
        }

        function bind(b, el, opts) {
            var full = el == window,
                $el = $(el);
            if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
                return;
            $el.data('blockUI.isBlocked', b);
            if (!full || !opts.bindEvents || (b && !opts.showOverlay))
                return;
            var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
            if (b)
                $(document).bind(events, opts, handler);
            else
                $(document).unbind(events, handler);
        }

        function handler(e) {
            if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
                if (pageBlock && e.data.constrainTabKey) {
                    var els = pageBlockEls;
                    var fwd = !e.shiftKey && e.target === els[els.length - 1];
                    var back = e.shiftKey && e.target === els[0];
                    if (fwd || back) {
                        setTimeout(function() {
                            focus(back);
                        }, 10);
                        return false;
                    }
                }
            }
            var opts = e.data;
            var target = $(e.target);
            if (target.hasClass('blockOverlay') && opts.onOverlayClick)
                opts.onOverlayClick(e);
            if (target.parents('div.' + opts.blockMsgClass).length > 0)
                return true;
            return target.parents().children().filter('div.blockUI').length === 0;
        }

        function focus(back) {
            if (!pageBlockEls)
                return;
            var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
            if (e)
                e.focus();
        }

        function center(el, x, y) {
            var p = el.parentNode,
                s = el.style;
            var l = ((p.offsetWidth - el.offsetWidth) / 2) - sz(p, 'borderLeftWidth');
            var t = ((p.offsetHeight - el.offsetHeight) / 2) - sz(p, 'borderTopWidth');
            if (x) s.left = l > 0 ? (l + 'px') : '0';
            if (y) s.top = t > 0 ? (t + 'px') : '0';
        }

        function sz(el, p) {
            return parseInt($.css(el, p), 10) || 0;
        }
    }
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }
})();
! function(a) {
    function b(b) {
        var c = "https://api.instagram.com/v1",
            d = {};
        if (null == b.accessToken && null == b.clientId) throw "You must provide an access token or a client id";
        if (d = a.extend(d, {
                access_token: b.accessToken || "",
                client_id: b.clientId || "",
                count: b.count || ""
            }), null != b.url) c = b.url;
        else if (null != b.hash) c += "/tags/" + b.hash + "/media/recent";
        else if (null != b.search) c += "/media/search", d = a.extend(d, b.search);
        else if (null != b.userId) {
            if (null == b.accessToken) throw "You must provide an access token";
            c += "/users/" + b.userId + "/media/recent"
        } else null != b.location ? (c += "/locations/" + b.location.id + "/media/recent", delete b.location.id, d = a.extend(d, b.location)) : c += "/media/popular";
        return {
            url: c,
            data: d
        }
    }
    a.fn.instagram = function(c) {
        var d = this;
        c = a.extend({}, a.fn.instagram.defaults, c);
        var e = b(c);
        return a.ajax({
            dataType: "jsonp",
            url: e.url,
            data: e.data,
            success: function(a) {
                d.trigger("didLoadInstagram", a)
            }
        }), this.trigger("willLoadInstagram", c), this
    }, a.fn.instagram.defaults = {
        accessToken: null,
        clientId: null,
        count: null,
        url: null,
        hash: null,
        userId: null,
        location: null,
        search: null
    }
}(jQuery);;
(function(k) {
    'use strict';
    k(['jquery'], function($) {
        var j = $.scrollTo = function(a, b, c) {
            return $(window).scrollTo(a, b, c)
        };
        j.defaults = {
            axis: 'xy',
            duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
            limit: !0
        };
        j.window = function(a) {
            return $(window)._scrollable()
        };
        $.fn._scrollable = function() {
            return this.map(function() {
                var a = this,
                    isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
                if (!isWin) return a;
                var b = (a.contentWindow || a).document || a.ownerDocument || a;
                return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement
            })
        };
        $.fn.scrollTo = function(f, g, h) {
            if (typeof g == 'object') {
                h = g;
                g = 0
            }
            if (typeof h == 'function') h = {
                onAfter: h
            };
            if (f == 'max') f = 9e9;
            h = $.extend({}, j.defaults, h);
            g = g || h.duration;
            h.queue = h.queue && h.axis.length > 1;
            if (h.queue) g /= 2;
            h.offset = both(h.offset);
            h.over = both(h.over);
            return this._scrollable().each(function() {
                if (f == null) return;
                var d = this,
                    $elem = $(d),
                    targ = f,
                    toff, attr = {},
                    win = $elem.is('html,body');
                switch (typeof targ) {
                    case 'number':
                    case 'string':
                        if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                            targ = both(targ);
                            break
                        }
                        targ = win ? $(targ) : $(targ, this);
                        if (!targ.length) return;
                    case 'object':
                        if (targ.is || targ.style) toff = (targ = $(targ)).offset()
                }
                var e = $.isFunction(h.offset) && h.offset(d, targ) || h.offset;
                $.each(h.axis.split(''), function(i, a) {
                    var b = a == 'x' ? 'Left' : 'Top',
                        pos = b.toLowerCase(),
                        key = 'scroll' + b,
                        old = d[key],
                        max = j.max(d, a);
                    if (toff) {
                        attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
                        if (h.margin) {
                            attr[key] -= parseInt(targ.css('margin' + b)) || 0;
                            attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0
                        }
                        attr[key] += e[pos] || 0;
                        if (h.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * h.over[pos]
                    } else {
                        var c = targ[pos];
                        attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c
                    }
                    if (h.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
                    if (!i && h.queue) {
                        if (old != attr[key]) animate(h.onAfterFirst);
                        delete attr[key]
                    }
                });
                animate(h.onAfter);

                function animate(a) {
                    $elem.animate(attr, g, h.easing, a && function() {
                        a.call(this, targ, h)
                    })
                }
            }).end()
        };
        j.max = function(a, b) {
            var c = b == 'x' ? 'Width' : 'Height',
                scroll = 'scroll' + c;
            if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()]();
            var d = 'client' + c,
                html = a.ownerDocument.documentElement,
                body = a.ownerDocument.body;
            return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d])
        };

        function both(a) {
            return $.isFunction(a) || typeof a == 'object' ? a : {
                top: a,
                left: a
            }
        }
        return j
    })
}(typeof define === 'function' && define.amd ? define : function(a, b) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = b(require('jquery'))
    } else {
        b(jQuery)
    }
}));
(function(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    "use strict";
    var PRECISION = 100;
    var instances = [],
        matchers = [];
    matchers.push(/^[0-9]*$/.source);
    matchers.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    matchers = new RegExp(matchers.join("|"));

    function parseDateString(dateString) {
        if (dateString instanceof Date) {
            return dateString;
        }
        if (String(dateString).match(matchers)) {
            if (String(dateString).match(/^[0-9]*$/)) {
                dateString = Number(dateString);
            }
            if (String(dateString).match(/\-/)) {
                dateString = String(dateString).replace(/\-/g, "/");
            }
            return new Date(dateString);
        } else {
            throw new Error("Couldn't cast `" + dateString + "` to a date object.");
        }
    }
    var DIRECTIVE_KEY_MAP = {
        Y: "years",
        m: "months",
        w: "weeks",
        d: "days",
        D: "totalDays",
        H: "hours",
        M: "minutes",
        S: "seconds"
    };

    function strftime(offsetObject) {
        return function(format) {
            var directives = format.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (directives) {
                for (var i = 0, len = directives.length; i < len; ++i) {
                    var directive = directives[i].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
                        regexp = new RegExp(directive[0]),
                        modifier = directive[1] || "",
                        plural = directive[3] || "",
                        value = null;
                    directive = directive[2];
                    if (DIRECTIVE_KEY_MAP.hasOwnProperty(directive)) {
                        value = DIRECTIVE_KEY_MAP[directive];
                        value = Number(offsetObject[value]);
                    }
                    if (value !== null) {
                        if (modifier === "!") {
                            value = pluralize(plural, value);
                        }
                        if (modifier === "") {
                            if (value < 10) {
                                value = "0" + value.toString();
                            }
                        }
                        format = format.replace(regexp, value.toString());
                    }
                }
            }
            format = format.replace(/%%/, "%");
            return format;
        };
    }

    function pluralize(format, count) {
        var plural = "s",
            singular = "";
        if (format) {
            format = format.replace(/(:|;|\s)/gi, "").split(/\,/);
            if (format.length === 1) {
                plural = format[0];
            } else {
                singular = format[0];
                plural = format[1];
            }
        }
        if (Math.abs(count) === 1) {
            return singular;
        } else {
            return plural;
        }
    }
    var Countdown = function(el, finalDate, callback) {
        this.el = el;
        this.$el = $(el);
        this.interval = null;
        this.offset = {};
        this.instanceNumber = instances.length;
        instances.push(this);
        this.$el.data("countdown-instance", this.instanceNumber);
        if (callback) {
            this.$el.on("update.countdown", callback);
            this.$el.on("stoped.countdown", callback);
            this.$el.on("finish.countdown", callback);
        }
        this.setFinalDate(finalDate);
        this.start();
    };
    $.extend(Countdown.prototype, {
        start: function() {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            var self = this;
            this.update();
            this.interval = setInterval(function() {
                self.update.call(self);
            }, PRECISION);
        },
        stop: function() {
            clearInterval(this.interval);
            this.interval = null;
            this.dispatchEvent("stoped");
        },
        pause: function() {
            this.stop.call(this);
        },
        resume: function() {
            this.start.call(this);
        },
        remove: function() {
            this.stop();
            instances[this.instanceNumber] = null;
            delete this.$el.data().countdownInstance;
        },
        setFinalDate: function(value) {
            this.finalDate = parseDateString(value);
        },
        update: function() {
            if (this.$el.closest("html").length === 0) {
                this.remove();
                return;
            }
            this.totalSecsLeft = this.finalDate.getTime() - new Date().getTime();
            this.totalSecsLeft = Math.ceil(this.totalSecsLeft / 1e3);
            this.totalSecsLeft = this.totalSecsLeft < 0 ? 0 : this.totalSecsLeft;
            this.offset = {
                seconds: this.totalSecsLeft % 60,
                minutes: Math.floor(this.totalSecsLeft / 60) % 60,
                hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
                days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
                weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
                months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30),
                years: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 365)
            };
            if (this.totalSecsLeft === 0) {
                this.stop();
                this.dispatchEvent("finish");
            } else {
                this.dispatchEvent("update");
            }
        },
        dispatchEvent: function(eventName) {
            var event = $.Event(eventName + ".countdown");
            event.finalDate = this.finalDate;
            event.offset = $.extend({}, this.offset);
            event.strftime = strftime(this.offset);
            this.$el.trigger(event);
        }
    });
    $.fn.countdown = function() {
        var argumentsArray = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            var instanceNumber = $(this).data("countdown-instance");
            if (instanceNumber !== undefined) {
                var instance = instances[instanceNumber],
                    method = argumentsArray[0];
                if (Countdown.prototype.hasOwnProperty(method)) {
                    instance[method].apply(instance, argumentsArray.slice(1));
                } else if (String(method).match(/^[$A-Z_][0-9A-Z_$]*$/i) === null) {
                    instance.setFinalDate.call(instance, method);
                    instance.start();
                } else {
                    $.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, method));
                }
            } else {
                new Countdown(this, argumentsArray[0], argumentsArray[1]);
            }
        });
    };
});
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;
    for (var i = toFix.length; i;) {
        $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
    }
    var special = $.event.special.mousewheel = {
        version: '4.0.0-pre',
        setup: function() {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            $.data(this, 'mousewheel-line-height', special._getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special._getPageHeight(this));
        },
        add: function(handleObj) {
            var data = handleObj.data,
                settings = data && data.mousewheel;
            if (settings) {
                if ('throttle' in settings || 'debounce' in settings) {
                    special._delayHandler.call(this, handleObj);
                }
                if ('intent' in settings) {
                    special._intentHandler.call(this, handleObj);
                }
            }
        },
        trigger: function(data, event) {
            if (!event) {
                event = data;
                data = null;
            }
            handler.call(this, event);
            return false;
        },
        teardown: function() {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },
        settings: {
            adjustOldDeltas: true,
            normalizeOffset: true
        },
        _getPageHeight: function(elem) {
            return $(elem).height();
        },
        _getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },
        _fix: function(orgEvent) {
            var deltaX = 0,
                deltaY = 0,
                absDelta = 0,
                offsetX = 0,
                offsetY = 0;
            event = $.event.fix(orgEvent);
            if ('detail' in orgEvent) {
                deltaY = orgEvent.detail;
            }
            if ('wheelDelta' in orgEvent) {
                deltaY = orgEvent.wheelDelta * -1;
            }
            if ('wheelDeltaY' in orgEvent) {
                deltaY = orgEvent.wheelDeltaY * -1;
            }
            if ('wheelDeltaX' in orgEvent) {
                deltaX = orgEvent.wheelDeltaX * -1;
            }
            if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
                deltaX = deltaY;
                deltaY = 0;
            }
            if ('deltaY' in orgEvent) {
                deltaY = orgEvent.deltaY;
            }
            if ('deltaX' in orgEvent) {
                deltaX = orgEvent.deltaX;
            }
            if (deltaY === 0 && deltaX === 0) {
                return;
            }
            if (orgEvent.deltaMode === 1) {
                var lineHeight = $.data(this, 'mousewheel-line-height');
                deltaY *= lineHeight;
                deltaX *= lineHeight;
            } else if (orgEvent.deltaMode === 2) {
                var pageHeight = $.data(this, 'mousewheel-page-height');
                deltaY *= pageHeight;
                deltaX *= pageHeight;
            }
            absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
            if (!lowestDelta || absDelta < lowestDelta) {
                lowestDelta = absDelta;
                if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                    lowestDelta /= 40;
                }
            }
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                deltaX /= 40;
                deltaY /= 40;
            }
            deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
            deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
            if (special.settings.normalizeOffset && this.getBoundingClientRect) {
                var boundingRect = this.getBoundingClientRect();
                offsetX = event.clientX - boundingRect.left;
                offsetY = event.clientY - boundingRect.top;
            }
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            event.deltaFactor = lowestDelta;
            event.offsetX = offsetX;
            event.offsetY = offsetY;
            event.deltaMode = 0;
            event.type = 'mousewheel';
            return event;
        },
        _intentHandler: function(handleObj) {
            var timeout, pX, pY, cX, cY, hasIntent = false,
                elem = this,
                settings = handleObj.data.mousewheel.intent,
                interval = settings.interval || 100,
                sensitivity = settings.sensitivity || 7,
                oldHandler = handleObj.handler,
                track = function(event) {
                    cX = event.pageX;
                    cY = event.pageY;
                },
                compare = function() {
                    if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < sensitivity) {
                        $(elem).off('mousemove', track);
                        hasIntent = true;
                    } else {
                        pX = cX;
                        pY = cY;
                        timeout = setTimeout(compare, interval);
                    }
                },
                newHandler = function(event) {
                    if (hasIntent) {
                        return oldHandler.apply(elem, arguments);
                    } else {
                        preventAndStopIfSet(settings, event);
                    }
                };
            $(elem).on('mouseenter', function() {
                pX = event.pageX;
                pY = event.pageY;
                $(elem).on('mousemove', track);
                timeout = setTimeout(compare, interval);
            }).on('mouseleave', function() {
                if (timeout) {
                    clearTimeout(timeout);
                }
                $(elem).off('mousemove', track);
                hasIntent = false;
            });
            handleObj.handler = newHandler;
        },
        _delayHandler: function(handleObj) {
            var delayTimeout, maxTimeout, lastRun, elem = this,
                method = 'throttle' in handleObj.data.mousewheel ? 'throttle' : 'debounce',
                settings = handleObj.data.mousewheel[method],
                leading = 'leading' in settings ? settings.leading : method === 'debounce' ? false : true,
                trailing = 'trailing' in settings ? settings.trailing : true,
                delay = settings.delay || 100,
                maxDelay = method === 'throttle' ? delay : settings.maxDelay,
                oldHandler = handleObj.handler,
                newHandler = function(event) {
                    var args = arguments,
                        clear = function() {
                            if (maxTimeout) {
                                clearTimeout(maxTimeout);
                            }
                            delayTimeout = null;
                            maxTimeout = null;
                            lastRun = null;
                        },
                        run = function() {
                            lastRun = +new Date();
                            return oldHandler.apply(elem, args);
                        },
                        maxDelayed = function() {
                            maxTimeout = null;
                            return run();
                        },
                        delayed = function() {
                            clear();
                            if (trailing) {
                                return run();
                            }
                        },
                        result;
                    if (delayTimeout) {
                        clearTimeout(delayTimeout);
                    } else {
                        if (leading) {
                            result = run();
                        }
                    }
                    delayTimeout = setTimeout(delayed, delay);
                    if (method === 'throttle') {
                        if (maxDelay && (+new Date() - lastRun) >= maxDelay) {
                            result = maxDelayed();
                        }
                    } else if (maxDelay && !maxTimeout) {
                        maxTimeout = setTimeout(maxDelayed, maxDelay);
                    }
                    preventAndStopIfSet(settings, event);
                    return result;
                };
            handleObj.handler = newHandler;
        }
    };

    function handler(event) {
        var orgEvent = event ? event.originalEvent || event : window.event,
            args = slice.call(arguments, 1);
        event = special._fix(orgEvent);
        args.unshift(event);
        if (nullLowestDeltaTimeout) {
            clearTimeout(nullLowestDeltaTimeout);
        }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
        return $.event.dispatch.apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

    function preventAndStopIfSet(settings, event) {
        if (settings.preventDefault === true) {
            event.preventDefault();
        }
        if (settings.stopPropagation === true) {
            event.stopPropagation();
        }
    }
}));
! function(e) {
    e.fn.midnight = function(t) {
        return "object" != typeof t && (t = {}), this.each(function() {
            var s = {
                headerClass: "midnightHeader",
                innerClass: "midnightInner",
                defaultClass: "default"
            };
            e.extend(s, t);
            var a = window.pageYOffset || document.documentElement.scrollTop,
                n = e(document).height(),
                r = e(this),
                o = {},
                l = {
                    top: 0,
                    height: r.outerHeight()
                },
                d = e("[data-midnight]"),
                f = [],
                h = function() {
                    for (var e = "transform WebkitTransform MozTransform OTransform msTransform".split(" "), t = 0; t < e.length; t++)
                        if (void 0 !== document.createElement("div").style[e[t]]) return e[t];
                    return !1
                },
                m = h();
            if (0 != d.length) {
                var c = function() {
                        var t = r.find("> ." + s.headerClass),
                            a = 0,
                            n = 0;
                        return t.length ? t.each(function() {
                            var t = e(this),
                                i = t.find("> ." + s.innerClass);
                            i.length ? (i.css("bottom", "auto"), n = i.outerHeight(), i.css("bottom", "0")) : (t.css("bottom", "auto"), n = t.outerHeight(), t.css("bottom", "0")), a = n > a ? n : a
                        }) : a = n = r.outerHeight(), a
                    },
                    u = function() {
                        l.height = c(), r.css("height", l.height + "px")
                    },
                    g = function() {
                        o["default"] = {}, d.each(function() {
                            var t = e(this),
                                s = t.data("midnight");
                            "string" == typeof s && (s = s.trim(), "" !== s && (o[s] = {}))
                        });
                        ({
                            top: r.css("padding-top"),
                            right: r.css("padding-right"),
                            bottom: r.css("padding-bottom"),
                            left: r.css("padding-left")
                        });
                        r.css({
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            overflow: "hidden"
                        }), u();
                        var t = r.find("> ." + s.headerClass);
                        t.length ? t.filter("." + s.defaultClass).length || t.filter("." + s.headerClass + ":first").clone(!0, !0).attr("class", s.headerClass + " " + s.defaultClass) : r.wrapInner('<div class="' + s.headerClass + " " + s.defaultClass + '"></div>');
                        var t = r.find("> ." + s.headerClass),
                            a = t.filter("." + s.defaultClass).clone(!0, !0);
                        for (headerClass in o)
                            if ("undefined" == typeof o[headerClass].element) {
                                var n = t.filter("." + headerClass);
                                o[headerClass].element = n.length ? n : a.clone(!0, !0).removeClass(s.defaultClass).addClass(headerClass).appendTo(r);
                                var i = {
                                    position: "absolute",
                                    overflow: "hidden",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                };
                                o[headerClass].element.css(i), m !== !1 && o[headerClass].element.css(m, "translateZ(0)"), o[headerClass].element.find("> ." + s.innerClass).length || o[headerClass].element.wrapInner('<div class="' + s.innerClass + '"></div>'), o[headerClass].inner = o[headerClass].element.find("> ." + s.innerClass), o[headerClass].inner.css(i), m !== !1 && o[headerClass].inner.css(m, "translateZ(0)"), o[headerClass].from = "", o[headerClass].progress = 0
                            }
                        t.each(function() {
                            var t = e(this),
                                a = !1;
                            for (headerClass in o) t.hasClass(headerClass) && (a = !0);
                            t.find("> ." + s.innerClass).length || t.wrapInner('<div class="' + s.innerClass + '"></div>'), a || t.hide()
                        })
                    };
                g();
                var p = function() {
                    for (n = e(document).height(), f = [], i = 0; i < d.length; i++) {
                        var t = e(d[i]);
                        f.push({
                            element: t,
                            "class": t.data("midnight"),
                            start: t.offset().top,
                            end: t.offset().top + t.outerHeight()
                        })
                    }
                };
                setInterval(p, 1e3);
                var x = function() {
                        a = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop, a = Math.max(a, 0), a = Math.min(a, n);
                        var e = l.height,
                            t = a + l.top,
                            s = a + l.top + e;
                        for (ix in o) o[ix].from = "", o[ix].progress = 0;
                        for (ix in f) s >= f[ix].start && t <= f[ix].end && (o[f[ix].class].visible = !0, t >= f[ix].start && s <= f[ix].end ? (o[f[ix].class].from = "top", o[f[ix].class].progress += 1) : s > f[ix].end && t < f[ix].end ? (o[f[ix].class].from = "top", o[f[ix].class].progress = 1 - (s - f[ix].end) / e) : s > f[ix].start && t < f[ix].start && ("top" === o[f[ix].class].from ? o[f[ix].class].progress += (s - f[ix].start) / e : (o[f[ix].class].from = "bottom", o[f[ix].class].progress = (s - f[ix].start) / e)))
                    },
                    C = function() {
                        var e = 0,
                            t = "";
                        for (ix in o) "" !== !o[ix].from && (e += o[ix].progress, t = ix);
                        1 > e && ("" === o[s.defaultClass].from ? (o[s.defaultClass].from = "top" === o[t].from ? "bottom" : "top", o[s.defaultClass].progress = 1 - e) : o[s.defaultClass].progress += 1 - e);
                        for (ix in o)
                            if ("" !== !o[ix].from) {
                                var a = 100 * (1 - o[ix].progress);
                                "top" === o[ix].from ? m !== !1 ? (o[ix].element[0].style[m] = "translateY(-" + a + "%) translateZ(0)", o[ix].inner[0].style[m] = "translateY(+" + a + "%) translateZ(0)") : (o[ix].element[0].style.top = "-" + a + "%", o[ix].inner[0].style.top = "+" + a + "%") : m !== !1 ? (o[ix].element[0].style[m] = "translateY(+" + a + "%) translateZ(0)", o[ix].inner[0].style[m] = "translateY(-" + a + "%) translateZ(0)") : (o[ix].element.style.top = "+" + a + "%", o[ix].inner.style.top = "-" + a + "%")
                            }
                    };
                e(window).resize(function() {
                    p(), u(), x(), C()
                }).trigger("resize"), requestAnimationFrame = window.requestAnimationFrame || function() {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
                        window.setTimeout(e, 1e3 / 60)
                    }
                }();
                var v = function() {
                    requestAnimationFrame(v), x(), C()
                };
                v()
            }
        })
    }
}(jQuery);;
(function($, window, document, navigator) {
    "use strict";
    var pluginName = "vide",
        defaults = {
            volume: 1,
            playbackRate: 1,
            muted: true,
            loop: true,
            autoplay: true,
            position: "50% 50%",
            posterType: "detect"
        };
    var iOS = /iPad|iPhone|iPod/i.test(navigator.userAgent),
        android = /Android/i.test(navigator.userAgent);
    $[pluginName] = {
        lookup: []
    };
    var parseOptions = function(str) {
        var obj = {},
            arr;
        arr = str.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",").split(",");
        var i, len, prop, val, delimiterIndex;
        for (i = 0, len = arr.length; i < len; i++) {
            if (arr[i].replace(/^(http|https|ftp):\/\//, "").search(":") === -1) {
                break;
            }
            delimiterIndex = arr[i].indexOf(":");
            prop = arr[i].substring(0, delimiterIndex);
            val = arr[i].substring(delimiterIndex + 1);
            if (!val) {
                val = undefined;
            }
            if (typeof val === "string") {
                val = val === "true" || (val === "false" ? false : val);
            }
            if (typeof val === "string") {
                val = !isNaN(val) ? +val : val;
            }
            obj[prop] = val;
        }
        if (prop == null && val == null) {
            return str;
        }
        return obj;
    };
    var parsePosition = function(str) {
        str = "" + str;
        var args = str.split(/\s+/),
            x = "50%",
            y = "50%";
        for (var i = 0, len = args.length, arg; i < len; i++) {
            arg = args[i];
            if (arg === "left") {
                x = "0%";
            } else if (arg === "right") {
                x = "100%";
            } else if (arg === "top") {
                y = "0%";
            } else if (arg === "bottom") {
                y = "100%";
            } else if (arg === "center") {
                if (i === 0) {
                    x = "50%";
                } else {
                    y = "50%";
                }
            } else {
                if (i === 0) {
                    x = arg;
                } else {
                    y = arg;
                }
            }
        }
        return {
            x: x,
            y: y
        };
    };
    var findPoster = function(path, callback) {
        var onLoad = function() {
            callback(this.src);
        };
        $("<img src='" + path + ".jpg'>").load(onLoad);
    };

    function Vide(element, path, options) {
        this.element = $(element);
        this._defaults = defaults;
        this._name = pluginName;
        if (typeof path === "string") {
            path = parseOptions(path);
        }
        if (!options) {
            options = {};
        } else if (typeof options === "string") {
            options = parseOptions(options);
        }
        if (typeof path === "string") {
            path = path.replace(/\.\w*$/, "");
        } else if (typeof path === "object") {
            for (var i in path) {
                if (path.hasOwnProperty(i)) {
                    path[i] = path[i].replace(/\.\w*$/, "");
                }
            }
        }
        this.settings = $.extend({}, defaults, options);
        this.path = path;
        this.init();
    }
    Vide.prototype.init = function() {
        var that = this;
        this.wrapper = $("<div>");
        var position = parsePosition(this.settings.position);
        this.wrapper.css({
            "position": "absolute",
            "z-index": 0,
            "top": 0,
            "left": 0,
            "bottom": 0,
            "right": 0,
            "overflow": "hidden",
            "-webkit-background-size": "cover",
            "-moz-background-size": "cover",
            "-o-background-size": "cover",
            "background-size": "cover",
            "background-repeat": "no-repeat",
            "background-position": position.x + " " + position.y
        }).addClass('vide-wrapper');
        var poster = this.path;
        if (typeof this.path === "object") {
            if (this.path.poster) {
                poster = this.path.poster;
            } else {
                if (this.path.mp4) {
                    poster = this.path.mp4;
                } else if (this.path.webm) {
                    poster = this.path.webm;
                } else if (this.path.ogv) {
                    poster = this.path.ogv;
                }
            }
        }
        if (this.settings.posterType === "detect") {
            findPoster(poster, function(url) {
                that.wrapper.css("background-image", "url(" + url + ")");
            });
        } else if (this.settings.posterType !== "none") {
            this.wrapper.css("background-image", "url(" + poster + "." + this.settings.posterType + ")");
        }
        if (this.element.css("position") === "static") {
            this.element.css("position", "relative");
        }
        this.element.prepend(this.wrapper);
        if (!iOS && !android) {
            if (typeof this.path === "object") {
                var sources = "";
                if (this.path.mp4) {
                    sources += "<source src='" + this.path.mp4 + ".mp4' type='video/mp4'>";
                }
                if (this.path.webm) {
                    sources += "<source src='" + this.path.webm + ".webm' type='video/webm'>";
                }
                if (this.path.ogv) {
                    sources += "<source src='" + this.path.ogv + ".ogv' type='video/ogv'>";
                }
                this.video = $("<video>" + sources + "</video>");
            } else {
                this.video = $("<video>" + "<source src='" + this.path + ".mp4' type='video/mp4'>" + "<source src='" + this.path + ".webm' type='video/webm'>" + "<source src='" + this.path + ".ogv' type='video/ogg'>" + "</video>");
            }
            this.video.css("visibility", "hidden");
            this.video.prop({
                autoplay: this.settings.autoplay,
                loop: this.settings.loop,
                volume: this.settings.volume,
                muted: this.settings.muted,
                playbackRate: this.settings.playbackRate,
                preload: "auto"
            });
            this.wrapper.append(this.video);
            this.video.css({
                "margin": "auto",
                "position": "absolute",
                "z-index": -1,
                "top": position.y,
                "left": position.x,
                "-webkit-transform": "translate(-" + position.x + ", -" + position.y + ")",
                "-ms-transform": "translate(-" + position.x + ", -" + position.y + ")",
                "transform": "translate(-" + position.x + ", -" + position.y + ")"
            });
            this.video.bind("loadedmetadata." + pluginName, function() {
                that.video.css("visibility", "visible");
                that.resize();
            });
            $(this.element).bind("resize." + pluginName, function() {
                that.resize();
            });
        }
    };
    Vide.prototype.getVideoObject = function() {
        return this.video ? this.video[0] : null;
    };
    Vide.prototype.resize = function() {
        if (!this.video) {
            return;
        }
        var videoHeight = this.video[0].videoHeight,
            videoWidth = this.video[0].videoWidth;
        var wrapperHeight = this.wrapper.height(),
            wrapperWidth = this.wrapper.width();
        if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
            this.video.css({
                "width": wrapperWidth + 2,
                "height": "auto"
            });
        } else {
            this.video.css({
                "width": "auto",
                "height": wrapperHeight + 2
            });
        }
    };
    Vide.prototype.destroy = function() {
        this.element.unbind(pluginName);
        if (this.video) {
            this.video.unbind(pluginName);
        }
        delete $[pluginName].lookup[this.index];
        this.element.removeData(pluginName);
        this.wrapper.remove();
    };
    $.fn[pluginName] = function(path, options) {
        var instance;
        this.each(function() {
            instance = $.data(this, pluginName);
            if (instance) {
                instance.destroy();
            }
            instance = new Vide(this, path, options);
            instance.index = $[pluginName].lookup.push(instance) - 1;
            $.data(this, pluginName, instance);
        });
        return this;
    };
    $(document).ready(function() {
        $(window).bind("resize." + pluginName, function() {
            for (var len = $[pluginName].lookup.length, instance, i = 0; i < len; i++) {
                instance = $[pluginName].lookup[i];
                if (instance) {
                    instance.resize();
                }
            }
        });
        $(document).find("[data-" + pluginName + "-bg]").each(function(i, element) {
            var $element = $(element),
                options = $element.data(pluginName + "-options"),
                path = $element.data(pluginName + "-bg");
            $element[pluginName](path, options);
        });
    });
})(window.jQuery, window, document, navigator);
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    'use strict';
    var Slick = window.Slick || {};
    Slick = (function() {
        var instanceUid = 0;

        function Slick(element, settings) {
            var _ = this,
                responsiveSettings, breakpoint;
            _.defaults = {
                accessibility: true,
                appendArrows: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return '<button type="button" data-role="none">' + (i + 1) + '</button>';
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                fade: false,
                focusOnSelect: false,
                infinite: true,
                lazyLoad: 'ondemand',
                onBeforeChange: null,
                onAfterChange: null,
                onInit: null,
                onReInit: null,
                pauseOnHover: true,
                pauseOnDotsHover: false,
                responsive: null,
                rtl: false,
                slide: 'div',
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 300,
                swipe: true,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                vertical: false
            };
            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentSlide: 0,
                currentLeft: null,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false
            };
            $.extend(_, _.initials);
            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.paused = false;
            _.positionProp = null;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.windowWidth = 0;
            _.windowTimer = null;
            _.options = $.extend({}, _.defaults, settings);
            _.originalSettings = _.options;
            responsiveSettings = _.options.responsive || null;
            if (responsiveSettings && responsiveSettings.length > -1) {
                for (breakpoint in responsiveSettings) {
                    if (responsiveSettings.hasOwnProperty(breakpoint)) {
                        _.breakpoints.push(responsiveSettings[breakpoint].breakpoint);
                        _.breakpointSettings[responsiveSettings[breakpoint].breakpoint] = responsiveSettings[breakpoint].settings;
                    }
                }
                _.breakpoints.sort(function(a, b) {
                    return b - a;
                });
            }
            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.instanceUid = instanceUid++;
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
            _.init();
        }
        return Slick;
    }());
    Slick.prototype.addSlide = function(markup, index, addBefore) {
        var _ = this;
        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }
        _.unload();
        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }
        _.$slides = _.$slideTrack.children(this.options.slide);
        _.$slideTrack.children(this.options.slide).detach();
        _.$slideTrack.append(_.$slides);
        _.$slides.each(function(index, element) {
            $(element).attr("index", index);
        });
        _.$slidesCache = _.$slides;
        _.reinit();
    };
    Slick.prototype.animateSlide = function(targetLeft, callback) {
        var animProps = {},
            _ = this;
        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }
        } else {
            if (_.cssTransitions === false) {
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });
            } else {
                _.applyTransition();
                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);
                if (callback) {
                    setTimeout(function() {
                        _.disableTransition();
                        callback.call();
                    }, _.options.speed);
                }
            }
        }
    };
    Slick.prototype.applyTransition = function(slide) {
        var _ = this,
            transition = {};
        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }
        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };
    Slick.prototype.autoPlay = function() {
        var _ = this;
        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
        if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
<<<<<<< Updated upstream
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
=======
<<<<<<< HEAD
<<<<<<< HEAD
//            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
=======
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
>>>>>>> origin/master
=======
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
>>>>>>> origin/master
>>>>>>> Stashed changes
        }
    };
    Slick.prototype.autoPlayClear = function() {
        var _ = this;
        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
    };
    Slick.prototype.autoPlayIterator = function() {
        var _ = this;
        var asNavFor = _.options.asNavFor != null ? $(_.options.asNavFor).getSlick() : null;
        if (_.options.infinite === false) {
            if (_.direction === 1) {
                if ((_.currentSlide + 1) === _.slideCount -
                    1) {
                    _.direction = 0;
                }
                _.slideHandler(_.currentSlide + _.options.slidesToScroll);
                if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide + asNavFor.options.slidesToScroll);
            } else {
                if ((_.currentSlide - 1 === 0)) {
                    _.direction = 1;
                }
                _.slideHandler(_.currentSlide - _.options.slidesToScroll);
                if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide - asNavFor.options.slidesToScroll);
            }
        } else {
            _.slideHandler(_.currentSlide + _.options.slidesToScroll);
            if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide + asNavFor.options.slidesToScroll);
        }
    };
    Slick.prototype.buildArrows = function() {
        var _ = this;
        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow = $(_.options.prevArrow);
            _.$nextArrow = $(_.options.nextArrow);
            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.appendTo(_.options.appendArrows);
            }
            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.appendTo(_.options.appendArrows);
            }
            if (_.options.infinite !== true) {
                _.$prevArrow.addClass('slick-disabled');
            }
        }
    };
    Slick.prototype.buildDots = function() {
        var _ = this,
            i, dotString;
        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            dotString = '<ul class="' + _.options.dotsClass + '">';
            for (i = 0; i <= _.getDotCount(); i += 1) {
                dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
            }
            dotString += '</ul>';
            _.$dots = $(dotString).appendTo(_.$slider);
            _.$dots.find('li').first().addClass('slick-active');
        }
    };
    Slick.prototype.buildOut = function() {
        var _ = this;
        _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
        _.slideCount = _.$slides.length;
        _.$slides.each(function(index, element) {
            $(element).attr("index", index);
        });
        _.$slidesCache = _.$slides;
        _.$slider.addClass('slick-slider');
        _.$slideTrack = (_.slideCount === 0) ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
        _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);
        if (_.options.centerMode === true) {
            _.options.slidesToScroll = 1;
            if (_.options.slidesToShow % 2 === 0) {
                _.options.slidesToShow = 3;
            }
        }
        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
        _.setupInfinite();
        _.buildArrows();
        _.buildDots();
        _.updateDots();
        if (_.options.accessibility === true) {
            _.$list.prop('tabIndex', 0);
        }
        _.setSlideClasses(typeof this.currentSlide === 'number' ? this.currentSlide : 0);
        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }
    };
    Slick.prototype.checkResponsive = function() {
        var _ = this,
            breakpoint, targetBreakpoint;
        if (_.originalSettings.responsive && _.originalSettings.responsive.length > -1 && _.originalSettings.responsive !== null) {
            targetBreakpoint = null;
            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if ($(window).width() < _.breakpoints[breakpoint]) {
                        targetBreakpoint = _.breakpoints[breakpoint];
                    }
                }
            }
            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint) {
                        _.activeBreakpoint = targetBreakpoint;
                        _.options = $.extend({}, _.options, _.breakpointSettings[targetBreakpoint]);
                        _.refresh();
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    _.options = $.extend({}, _.options, _.breakpointSettings[targetBreakpoint]);
                    _.refresh();
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = $.extend({}, _.options, _.originalSettings);
                    _.refresh();
                }
            }
        }
    };
    Slick.prototype.changeSlide = function(event) {
        var _ = this,
            $target = $(event.target);
        var asNavFor = _.options.asNavFor != null ? $(_.options.asNavFor).getSlick() : null;
        $target.is('a') && event.preventDefault();
        switch (event.data.message) {
            case 'previous':
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - _.options.slidesToScroll);
                    if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide - asNavFor.options.slidesToScroll);
                }
                break;
            case 'next':
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + _.options.slidesToScroll);
                    if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide + asNavFor.options.slidesToScroll);
                }
                break;
            case 'index':
                var index = $(event.target).parent().index() * _.options.slidesToScroll;
                _.slideHandler(index);
                if (asNavFor != null) asNavFor.slideHandler(index);
                break;
            default:
                return false;
        }
    };
    Slick.prototype.destroy = function() {
        var _ = this;
        _.autoPlayClear();
        _.touchObject = {};
        $('.slick-cloned', _.$slider).remove();
        if (_.$dots) {
            _.$dots.remove();
        }
        if (_.$prevArrow) {
            _.$prevArrow.remove();
            _.$nextArrow.remove();
        }
        if (_.$slides.parent().hasClass('slick-track')) {
            _.$slides.unwrap().unwrap();
        }
        _.$slides.removeClass('slick-slide slick-active slick-visible').removeAttr('style');
        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$list.off('.slick');
        $(window).off('.slick-' + _.instanceUid);
        $(document).off('.slick-' + _.instanceUid);
    };
    Slick.prototype.disableTransition = function(slide) {
        var _ = this,
            transition = {};
        transition[_.transitionType] = "";
        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };
    Slick.prototype.fadeSlide = function(slideIndex, callback) {
        var _ = this;
        if (_.cssTransitions === false) {
            _.$slides.eq(slideIndex).css({
                zIndex: 1000
            });
            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);
        } else {
            _.applyTransition(slideIndex);
            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: 1000
            });
            if (callback) {
                setTimeout(function() {
                    _.disableTransition(slideIndex);
                    callback.call();
                }, _.options.speed);
            }
        }
    };
    Slick.prototype.filterSlides = function(filter) {
        var _ = this;
        if (filter !== null) {
            _.unload();
            _.$slideTrack.children(this.options.slide).detach();
            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);
            _.reinit();
        }
    };
    Slick.prototype.getCurrent = function() {
        var _ = this;
        return _.currentSlide;
    };
    Slick.prototype.getDotCount = function() {
        var _ = this,
            breaker = 0,
            dotCounter = 0,
            dotCount = 0,
            dotLimit;
        dotLimit = _.options.infinite === true ? _.slideCount + _.options.slidesToShow - _.options.slidesToScroll : _.slideCount;
        while (breaker < dotLimit) {
            dotCount++;
            dotCounter += _.options.slidesToScroll;
            breaker = dotCounter + _.options.slidesToShow;
        }
        return dotCount;
    };
    Slick.prototype.getLeft = function(slideIndex) {
        var _ = this,
            targetLeft, verticalHeight, verticalOffset = 0;
        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight();
        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    _.slideOffset = ((_.slideCount % _.options.slidesToShow) * _.slideWidth) * -1;
                    verticalOffset = ((_.slideCount % _.options.slidesToShow) * verticalHeight) * -1;
                }
            }
        } else {
            if (_.slideCount % _.options.slidesToShow !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    _.slideOffset = (_.options.slidesToShow * _.slideWidth) - ((_.slideCount % _.options.slidesToShow) * _.slideWidth);
                    verticalOffset = ((_.slideCount % _.options.slidesToShow) * verticalHeight);
                }
            }
        }
        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }
        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }
        return targetLeft;
    };
    Slick.prototype.init = function() {
        var _ = this;
        if (!$(_.$slider).hasClass('slick-initialized')) {
            $(_.$slider).addClass('slick-initialized');
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.checkResponsive();
        }
        if (_.options.onInit !== null) {
            _.options.onInit.call(this, _);
        }
    };
    Slick.prototype.initArrowEvents = function() {
        var _ = this;
        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }
    };
    Slick.prototype.initDotEvents = function() {
        var _ = this;
        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }
        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.options.autoplay === true) {
            $('li', _.$dots).on('mouseenter.slick', _.autoPlayClear).on('mouseleave.slick', _.autoPlay);
        }
    };
    Slick.prototype.initializeEvents = function() {
        var _ = this;
        _.initArrowEvents();
        _.initDotEvents();
        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);
        if (_.options.pauseOnHover === true && _.options.autoplay === true) {
            _.$list.on('mouseenter.slick', _.autoPlayClear);
            _.$list.on('mouseleave.slick', _.autoPlay);
        }
        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }
        if (_.options.focusOnSelect === true) {
            $(_.options.slide, _.$slideTrack).on('click.slick', _.selectHandler);
        }
        $(window).on('orientationchange.slick.slick-' + _.instanceUid, function() {
            _.checkResponsive();
            _.setPosition();
        });
        $(window).on('resize.slick.slick-' + _.instanceUid, function() {
            if ($(window).width() !== _.windowWidth) {
                clearTimeout(_.windowDelay);
                _.windowDelay = window.setTimeout(function() {
                    _.windowWidth = $(window).width();
                    _.checkResponsive();
                    _.setPosition();
                }, 50);
            }
        });
        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };
    Slick.prototype.initUI = function() {
        var _ = this;
        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.show();
            _.$nextArrow.show();
        }
        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            _.$dots.show();
        }
        if (_.options.autoplay === true) {
            _.autoPlay();
        }
    };
    Slick.prototype.keyHandler = function(event) {
        var _ = this;
        if (event.keyCode === 37) {
            _.changeSlide({
                data: {
                    message: 'previous'
                }
            });
        } else if (event.keyCode === 39) {
            _.changeSlide({
                data: {
                    message: 'next'
                }
            });
        }
    };
    Slick.prototype.lazyLoad = function() {
        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {
            $('img[data-lazy]', imagesScope).each(function() {
                var image = $(this),
                    imageSource = $(this).attr('data-lazy') + "?" + new Date().getTime();
                image.load(function() {
                    image.animate({
                        opacity: 1
                    }, 200);
                }).css({
                    opacity: 0
                }).attr('src', imageSource).removeAttr('data-lazy').removeClass('slick-loading');
            });
        }
        if (_.options.centerMode === true || _.options.fade === true) {
            rangeStart = _.options.slidesToShow + _.currentSlide - 1;
            rangeEnd = rangeStart + _.options.slidesToShow + 2;
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = rangeStart + _.options.slidesToShow;
        }
        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);
        if (_.slideCount == 1) {
            cloneRange = _.$slider.find('.slick-slide')
            loadImages(cloneRange)
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange)
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }
    };
    Slick.prototype.loadSlider = function() {
        var _ = this;
        _.setPosition();
        _.$slideTrack.css({
            opacity: 1
        });
        _.$slider.removeClass('slick-loading');
        _.initUI();
        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }
    };
    Slick.prototype.postSlide = function(index) {
        var _ = this;
        if (_.options.onAfterChange !== null) {
            _.options.onAfterChange.call(this, _, index);
        }
        _.animating = false;
        _.setPosition();
        _.swipeLeft = null;
        if (_.options.autoplay === true && _.paused === false) {
            _.autoPlay();
        }
    };
    Slick.prototype.progressiveLazyLoad = function() {
        var _ = this,
            imgCount, targetImage;
        imgCount = $('img[data-lazy]').length;
        if (imgCount > 0) {
            targetImage = $('img[data-lazy]', _.$slider).first();
            targetImage.attr('src', targetImage.attr('data-lazy')).removeClass('slick-loading').load(function() {
                targetImage.removeAttr('data-lazy');
                _.progressiveLazyLoad();
            });
        }
    };
    Slick.prototype.refresh = function() {
        var _ = this,
            currentSlide = _.currentSlide;
        _.destroy();
        $.extend(_, _.initials);
        _.currentSlide = currentSlide;
        _.init();
    };
    Slick.prototype.reinit = function() {
        var _ = this;
        _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
        _.slideCount = _.$slides.length;
        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }
        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        if (_.options.focusOnSelect === true) {
            $(_.options.slide, _.$slideTrack).on('click.slick', _.selectHandler);
        }
        _.setSlideClasses(0);
        _.setPosition();
        if (_.options.onReInit !== null) {
            _.options.onReInit.call(this, _);
        }
    };
    Slick.prototype.removeSlide = function(index, removeBefore) {
        var _ = this;
        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }
        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }
        _.unload();
        _.$slideTrack.children(this.options.slide).eq(index).remove();
        _.$slides = _.$slideTrack.children(this.options.slide);
        _.$slideTrack.children(this.options.slide).detach();
        _.$slideTrack.append(_.$slides);
        _.$slidesCache = _.$slides;
        _.reinit();
    };
    Slick.prototype.setCSS = function(position) {
        var _ = this,
            positionProps = {},
            x, y;
        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? position + 'px' : '0px';
        y = _.positionProp == 'top' ? position + 'px' : '0px';
        positionProps[_.positionProp] = position;
        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }
    };
    Slick.prototype.setDimensions = function() {
        var _ = this;
        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }
        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();
        if (_.options.vertical === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }
        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };
    Slick.prototype.setFade = function() {
        var _ = this,
            targetLeft;
        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            $(element).css({
                position: 'relative',
                left: targetLeft,
                top: 0,
                zIndex: 800,
                opacity: 0
            });
        });
        _.$slides.eq(_.currentSlide).css({
            zIndex: 900,
            opacity: 1
        });
    };
    Slick.prototype.setPosition = function() {
        var _ = this;
        _.setDimensions();
        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }
    };
    Slick.prototype.setProps = function() {
        var _ = this;
        _.positionProp = _.options.vertical === true ? 'top' : 'left';
        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }
        if (document.body.style.WebkitTransition !== undefined || document.body.style.MozTransition !== undefined || document.body.style.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }
        if (document.body.style.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = "-moz-transform";
            _.transitionType = 'MozTransition';
        }
        if (document.body.style.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = "-webkit-transform";
            _.transitionType = 'webkitTransition';
        }
        if (document.body.style.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = "-ms-transform";
            _.transitionType = 'msTransition';
        }
        if (document.body.style.transform !== undefined) {
            _.animType = 'transform';
            _.transformType = "transform";
            _.transitionType = 'transition';
        }
        _.transformsEnabled = (_.animType !== null);
    };
    Slick.prototype.setSlideClasses = function(index) {
        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;
        _.$slider.find('.slick-slide').removeClass('slick-active').removeClass('slick-center');
        allSlides = _.$slider.find('.slick-slide');
        if (_.options.centerMode === true) {
            centerOffset = Math.floor(_.options.slidesToShow / 2);
            if (_.options.infinite === true) {
                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active');
                } else {
                    indexOffset = _.options.slidesToShow + index;
                    allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active');
                }
                if (index === 0) {
                    allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
                } else if (index === _.slideCount - 1) {
                    allSlides.eq(_.options.slidesToShow).addClass('slick-center');
                }
            }
            _.$slides.eq(index).addClass('slick-center');
        } else {
            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {
                _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active');
            } else if (allSlides.length <= _.options.slidesToShow) {
                allSlides.addClass('slick-active');
            } else {
                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {
                    allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active');
                } else {
                    allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active');
                }
            }
        }
        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }
    };
    Slick.prototype.setupInfinite = function() {
        var _ = this,
            i, slideIndex, infiniteCount;
        if (_.options.fade === true || _.options.vertical === true) {
            _.options.centerMode = false;
        }
        if (_.options.infinite === true && _.options.fade === false) {
            slideIndex = null;
            if (_.slideCount > _.options.slidesToShow) {
                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }
                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });
            }
        }
    };
    Slick.prototype.selectHandler = function(event) {
        var _ = this;
        var asNavFor = _.options.asNavFor != null ? $(_.options.asNavFor).getSlick() : null;
        var index = parseInt($(event.target).parent().attr("index"));
        if (!index) index = 0;
        console.log(index);
        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }
        _.slideHandler(index);
        if (asNavFor != null) {
            if (asNavFor.slideCount <= asNavFor.options.slidesToShow) {
                return;
            }
            asNavFor.slideHandler(index);
        }
    };
    Slick.prototype.slideHandler = function(index) {
        var targetSlide, animSlide, slideLeft, unevenOffset, targetLeft = null,
            _ = this;
        if (_.animating === true) {
            return false;
        }
        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);
        unevenOffset = _.slideCount % _.options.slidesToScroll !== 0 ? _.options.slidesToScroll : 0;
        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > (_.slideCount - _.options.slidesToShow + unevenOffset))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                _.animateSlide(slideLeft, function() {
                    _.postSlide(targetSlide);
                });
            }
            return false;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                _.animateSlide(slideLeft, function() {
                    _.postSlide(targetSlide);
                });
            }
            return false;
        }
        if (_.options.autoplay === true) {
            clearInterval(_.autoPlayTimer);
        }
        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount - _.options.slidesToScroll;
            }
        } else if (targetSlide > (_.slideCount - 1)) {
            animSlide = 0;
        } else {
            animSlide = targetSlide;
        }
        _.animating = true;
        if (_.options.onBeforeChange !== null && index !== _.currentSlide) {
            _.options.onBeforeChange.call(this, _, _.currentSlide, animSlide);
        }
        _.currentSlide = animSlide;
        _.setSlideClasses(_.currentSlide);
        _.updateDots();
        _.updateArrows();
        if (_.options.fade === true) {
            _.fadeSlide(animSlide, function() {
                _.postSlide(animSlide);
            });
            return false;
        }
        _.animateSlide(targetLeft, function() {
            _.postSlide(animSlide);
        });
    };
    Slick.prototype.startLoad = function() {
        var _ = this;
        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.hide();
            _.$nextArrow.hide();
        }
        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            _.$dots.hide();
        }
        _.$slider.addClass('slick-loading');
    };
    Slick.prototype.swipeDirection = function() {
        var xDist, yDist, r, swipeAngle, _ = this;
        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);
        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }
        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return 'left';
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return 'left';
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return 'right';
        }
        return 'vertical';
    };
    Slick.prototype.swipeEnd = function(event) {
        var _ = this;
        var asNavFor = _.options.asNavFor != null ? $(_.options.asNavFor).getSlick() : null;
        _.dragging = false;
        if (_.touchObject.curX === undefined) {
            return false;
        }
        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
            $(event.target).on('click.slick', function(event) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                $(event.target).off('click.slick');
            });
            switch (_.swipeDirection()) {
                case 'left':
                    _.slideHandler(_.currentSlide + _.options.slidesToScroll);
                    if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide + asNavFor.options.slidesToScroll);
                    _.touchObject = {};
                    break;
                case 'right':
                    _.slideHandler(_.currentSlide - _.options.slidesToScroll);
                    if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide - asNavFor.options.slidesToScroll);
                    _.touchObject = {};
                    break;
            }
        } else {
            if (_.touchObject.startX !== _.touchObject.curX) {
                _.slideHandler(_.currentSlide);
                if (asNavFor != null) asNavFor.slideHandler(asNavFor.currentSlide);
                _.touchObject = {};
            }
        }
    };
    Slick.prototype.swipeHandler = function(event) {
        var _ = this;
        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if ((_.options.draggable === false) || (_.options.draggable === false && !event.originalEvent.touches)) {
            return;
        }
        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
        _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
        switch (event.data.action) {
            case 'start':
                _.swipeStart(event);
                break;
            case 'move':
                _.swipeMove(event);
                break;
            case 'end':
                _.swipeEnd(event);
                break;
        }
    };
    Slick.prototype.swipeMove = function(event) {
        var _ = this,
            curLeft, swipeDirection, positionOffset, touches;
        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
        curLeft = _.getLeft(_.currentSlide);
        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }
        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
        _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
        swipeDirection = _.swipeDirection();
        if (swipeDirection === 'vertical') {
            return;
        }
        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }
        positionOffset = _.touchObject.curX > _.touchObject.startX ? 1 : -1;
        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + _.touchObject.swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (_.touchObject.swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }
        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }
        _.setCSS(_.swipeLeft);
    };
    Slick.prototype.swipeStart = function(event) {
        var _ = this,
            touches;
        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }
        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }
        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
        _.dragging = true;
    };
    Slick.prototype.unfilterSlides = function() {
        var _ = this;
        if (_.$slidesCache !== null) {
            _.unload();
            _.$slideTrack.children(this.options.slide).detach();
            _.$slidesCache.appendTo(_.$slideTrack);
            _.reinit();
        }
    };
    Slick.prototype.unload = function() {
        var _ = this;
        $('.slick-cloned', _.$slider).remove();
        if (_.$dots) {
            _.$dots.remove();
        }
        if (_.$prevArrow) {
            _.$prevArrow.remove();
            _.$nextArrow.remove();
        }
        _.$slides.removeClass('slick-slide slick-active slick-visible').removeAttr('style');
    };
    Slick.prototype.updateArrows = function() {
        var _ = this;
        if (_.options.arrows === true && _.options.infinite !== true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.removeClass('slick-disabled');
            _.$nextArrow.removeClass('slick-disabled');
            if (_.currentSlide === 0) {
                _.$prevArrow.addClass('slick-disabled');
                _.$nextArrow.removeClass('slick-disabled');
            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
                _.$nextArrow.addClass('slick-disabled');
                _.$prevArrow.removeClass('slick-disabled');
            }
        }
    };
    Slick.prototype.updateDots = function() {
        var _ = this;
        if (_.$dots !== null) {
            _.$dots.find('li').removeClass('slick-active');
            _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
        }
    };
    $.fn.slick = function(options) {
        var _ = this;
        return _.each(function(index, element) {
            element.slick = new Slick(element, options);
        });
    };
    $.fn.slickAdd = function(slide, slideIndex, addBefore) {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.addSlide(slide, slideIndex, addBefore);
        });
    };
    $.fn.slickCurrentSlide = function() {
        var _ = this;
        return _.get(0).slick.getCurrent();
    };
    $.fn.slickFilter = function(filter) {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.filterSlides(filter);
        });
    };
    $.fn.slickGoTo = function(slide) {
        var _ = this;
        return _.each(function(index, element) {
            var asNavFor = element.slick.options.asNavFor != null ? $(element.slick.options.asNavFor) : null;
            if (asNavFor != null) asNavFor.slickGoTo(slide);
            element.slick.slideHandler(slide);
        });
    };
    $.fn.slickNext = function() {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.changeSlide({
                data: {
                    message: 'next'
                }
            });
        });
    };
    $.fn.slickPause = function() {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.autoPlayClear();
            element.slick.paused = true;
        });
    };
    $.fn.slickPlay = function() {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.paused = false;
            element.slick.autoPlay();
        });
    };
    $.fn.slickPrev = function() {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.changeSlide({
                data: {
                    message: 'previous'
                }
            });
        });
    };
    $.fn.slickRemove = function(slideIndex, removeBefore) {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.removeSlide(slideIndex, removeBefore);
        });
    };
    $.fn.slickGetOption = function(option) {
        var _ = this;
        return _.get(0).slick.options[option];
    };
    $.fn.slickSetOption = function(option, value, refresh) {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.options[option] = value;
            if (refresh === true) {
                element.slick.unload();
                element.slick.reinit();
            }
        });
    };
    $.fn.slickUnfilter = function() {
        var _ = this;
        return _.each(function(index, element) {
            element.slick.unfilterSlides();
        });
    };
    $.fn.unslick = function() {
        var _ = this;
        return _.each(function(index, element) {
            if (element.slick) {
                element.slick.destroy();
            }
        });
    };
    $.fn.getSlick = function() {
        var s = null;
        var _ = this;
        _.each(function(index, element) {
            s = element.slick;
        });
        return s;
    };
}));
! function(e, t) {
    "use strict";
    var r = function(r) {
            var i, s = "ScrollMagic",
                a = {
                    container: t,
                    vertical: !0,
                    globalSceneOptions: {},
                    loglevel: 2,
                    refreshInterval: 100
                },
                l = this,
                c = e.extend({}, a, r),
                u = [],
                g = !1,
                f = 0,
                h = "PAUSED",
                d = !0,
                p = 0,
                v = !1,
                m = !0,
                w = function() {
                    if (e.each(c, function(e) {
                            a.hasOwnProperty(e) || delete c[e]
                        }), c.container = e(c.container).first(), 0 === c.container.length) throw s + " init failed.";
                    d = !e.contains(document, c.container.get(0)), p = c.vertical ? c.container.height() : c.container.width(), c.container.on("scroll resize", F);
                    try {
                        TweenLite.ticker.addEventListener("tick", y), v = !0
                    } catch (r) {
                        c.container.on("scroll resize", y), v = !1
                    }
                    c.refreshInterval = parseInt(c.refreshInterval), c.refreshInterval > 0 && (i = t.setInterval(b, c.refreshInterval))
                },
                E = function() {
                    return c.vertical ? c.container.scrollTop() : c.container.scrollLeft()
                },
                S = function(e) {
                    c.vertical ? c.container.scrollTop(e) : c.container.scrollLeft(e)
                },
                y = function() {
                    if (g && m) {
                        var t = e.isArray(g) ? g : u.slice(0),
                            r = f;
                        f = l.scrollPos();
                        var n = f - r;
                        h = 0 === n ? "PAUSED" : n > 0 ? "FORWARD" : "REVERSE", 0 > n && t.reverse(), e.each(t, function(e, t) {
                            t.update(!0)
                        }), 0 === t.length && c.loglevel >= 3, g = !1
                    }
                },
                F = function(e) {
                    "resize" == e.type && (p = c.vertical ? c.container.height() : c.container.width()), g = !0
                },
                b = function() {
                    d || p != (c.vertical ? c.container.height() : c.container.width()) && c.container.trigger("resize"), e.each(u, function(e, t) {
                        t.refresh()
                    })
                },
                T = function(e) {
                    if (e.length <= 1) return e;
                    var t = e.slice(0);
                    return t.sort(function(e, t) {
                        return e.scrollOffset() > t.scrollOffset() ? 1 : -1
                    }), t
                };
            return this.addScene = function(t) {
                return e.isArray(t) ? e.each(t, function(e, t) {
                    l.addScene(t)
                }) : t instanceof n && (t.parent() != l ? t.addTo(l) : e.inArray(t, u) < 0 && (u.push(t), u = T(u), t.on("shift." + s + "_sort", function() {
                    u = T(u)
                }), e.each(c.globalSceneOptions, function(e, r) {
                    t[e] && t[e].call(t, r)
                }))), l
            }, this.removeScene = function(t) {
                if (e.isArray(t)) e.each(t, function(e, t) {
                    l.removeScene(t)
                });
                else {
                    var r = e.inArray(t, u);
                    r > -1 && (t.off("shift." + s + "_sort"), u.splice(r, 1), t.remove())
                }
                return l
            }, this.updateScene = function(t, r) {
                return e.isArray(t) ? e.each(t, function(e, t) {
                    l.updateScene(t, r)
                }) : r ? t.update(!0) : (e.isArray(g) || (g = []), -1 == e.inArray(t, g) && g.push(t), g = T(g)), l
            }, this.update = function(e) {
                return F({
                    type: "resize"
                }), e && y(), l
            }, this.scrollTo = function(t) {
                if (t instanceof n) t.parent() === l ? l.scrollTo(t.scrollOffset()) : log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", t);
                else if ("string" === e.type(t) || o(t) || t instanceof e) {
                    var r = e(t).first();
                    if (r[0]) {
                        var i = r.offset();
                        l.scrollTo(c.vertical ? i.top : i.left)
                    } else log(2, "scrollTo(): The supplied element could not be found. Scroll cancelled.", t)
                } else e.isFunction(t) ? S = t : S.call(c.container[0], t);
                return l
            }, this.scrollPos = function(t) {
                return arguments.length ? (e.isFunction(t) && (E = t), l) : E.call(l)
            }, this.info = function(e) {
                var t = {
                    size: p,
                    vertical: c.vertical,
                    scrollPos: f,
                    scrollDirection: h,
                    container: c.container,
                    isDocument: d
                };
                return arguments.length ? void 0 !== t[e] ? t[e] : void 0 : t
            }, this.loglevel = function(e) {
                return arguments.length ? (c.loglevel != e && (c.loglevel = e), l) : c.loglevel
            }, this.enabled = function(e) {
                return arguments.length ? (m != e && (m = !!e, l.updateScene(u, !0)), l) : m
            }, this.destroy = function(e) {
                t.clearTimeout(i);
                for (var r = u.length; r--;) u[r].destroy(e);
                return c.container.off("scroll resize", F), v ? TweenLite.ticker.removeEventListener("tick", y) : c.container.off("scroll resize", y), null
            }, w(), l
        },
        n = function(n) {
            var o, a, l, c, u, g, f, h = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                },
                d = "ScrollScene",
                p = {
                    duration: 0,
                    offset: 0,
                    triggerElement: null,
                    triggerHook: "onCenter",
                    reverse: !0,
                    tweenChanges: !1,
                    loglevel: 2
                },
                v = this,
                m = e.extend({}, p, n),
                w = "BEFORE",
                E = 0,
                S = {
                    start: 0,
                    end: 0
                },
                y = 0,
                F = !0,
                b = {
                    unknownOptionSupplied: function() {
                        e.each(m, function(e) {
                            p.hasOwnProperty(e) || delete m[e]
                        })
                    },
                    duration: function() {
                        if (e.isFunction(m.duration)) {
                            o = m.duration;
                            try {
                                m.duration = parseFloat(o())
                            } catch (t) {
                                o = void 0, m.duration = p.duration
                            }
                        } else m.duration = parseFloat(m.duration), (!e.isNumeric(m.duration) || m.duration < 0) && (m.duration = p.duration)
                    },
                    offset: function() {
                        m.offset = parseFloat(m.offset), e.isNumeric(m.offset) || (m.offset = p.offset)
                    },
                    triggerElement: function() {
                        null !== m.triggerElement && 0 === e(m.triggerElement).length && (m.triggerElement = p.triggerElement)
                    },
                    triggerHook: function() {
                        m.triggerHook in h || (m.triggerHook = e.isNumeric(m.triggerHook) ? Math.max(0, Math.min(parseFloat(m.triggerHook), 1)) : p.triggerHook)
                    },
                    reverse: function() {
                        m.reverse = !!m.reverse
                    },
                    tweenChanges: function() {
                        m.tweenChanges = !!m.tweenChanges
                    }
                },
                T = function() {
                    z(), v.on("change.internal", function(e) {
                        "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? I() : "reverse" === e.what && v.update())
                    }).on("shift.internal", function(e) {
                        C(), v.update(), ("AFTER" === w && "duration" === e.reason || "DURING" === w && 0 === m.duration) && P()
                    }).on("progress.internal", function() {
                        x(), P()
                    }).on("destroy", function(e) {
                        e.preventDefault()
                    })
                },
                z = function(t) {
                    if (arguments.length) e.isArray(t) || (t = [t]);
                    else {
                        t = [];
                        for (var r in b) t.push(r)
                    }
                    e.each(t, function(e, t) {
                        b[t] && b[t]()
                    })
                },
                R = function(e, t) {
                    var r = !1,
                        n = m[e];
                    return m[e] != t && (m[e] = t, z(e), r = n != m[e]), r
                },
                C = function() {
                    S = {
                        start: y + m.offset
                    }, a && m.triggerElement && (S.start -= a.info("size") * v.triggerHook()), S.end = S.start + m.duration
                },
                D = function(e) {
                    if (o) {
                        var t = "duration";
                        R(t, o.call(v)) && !e && (v.trigger("change", {
                            what: t,
                            newval: m[t]
                        }), v.trigger("shift", {
                            reason: t
                        }))
                    }
                },
                I = function(t) {
                    var r = 0;
                    if (a && m.triggerElement) {
                        for (var n = e(m.triggerElement).first(), o = a.info(), s = i(o.container), l = o.vertical ? "top" : "left"; n.parent().data("ScrollMagicPinSpacer");) n = n.parent();
                        var c = i(n);
                        o.isDocument || (s[l] -= a.scrollPos()), r = c[l] - s[l]
                    }
                    var u = r != y;
                    y = r, u && !t && v.trigger("shift", {
                        reason: "triggerElementPosition"
                    })
                },
                x = function(e) {
                    if (l) {
                        var t = e >= 0 && 1 >= e ? e : E;
                        if (-1 === l.repeat())
                            if ("DURING" === w && l.paused()) l.play();
                            else {
                                if ("DURING" === w || l.paused()) return !1;
                                l.pause()
                            } else {
                            if (t == l.progress()) return !1;
                            0 === m.duration ? "DURING" === w ? l.play() : l.reverse() : m.tweenChanges ? l.tweenTo(t * l.duration()) : l.progress(t).pause()
                        }
                        return !0
                    }
                    return !1
                },
                P = function(e) {
                    if (c && a) {
                        var t = a.info();
                        if (e || "DURING" !== w) {
                            var r = {
                                    position: u.inFlow ? "relative" : "absolute",
                                    top: 0,
                                    left: 0
                                },
                                n = c.css("position") != r.position;
                            u.pushFollowers ? m.duration > 0 && ("AFTER" === w && 0 === parseFloat(u.spacer.css("padding-top")) ? n = !0 : "BEFORE" === w && 0 === parseFloat(u.spacer.css("padding-bottom")) && (n = !0)) : r[t.vertical ? "top" : "left"] = m.duration * E, c.css(r), n && (c.removeClass(u.pinnedClass), k())
                        } else {
                            "fixed" != c.css("position") && (c.css("position", "fixed"), k(), c.addClass(u.pinnedClass));
                            var o = i(u.spacer, !0),
                                s = m.reverse || 0 === m.duration ? t.scrollPos - S.start : Math.round(E * m.duration * 10) / 10;
                            o.top -= parseFloat(u.spacer.css("margin-top")), o[t.vertical ? "top" : "left"] += s, c.css({
                                top: o.top,
                                left: o.left
                            })
                        }
                    }
                },
                k = function() {
                    if (c && a && u.inFlow) {
                        var r = "AFTER" === w,
                            n = "BEFORE" === w,
                            i = "DURING" === w,
                            o = "fixed" == c.css("position"),
                            l = a.info("vertical"),
                            g = u.spacer.children().first(),
                            f = s(u.spacer.css("display")),
                            h = {};
                        f ? (h["margin-top"] = n || i && o ? c.css("margin-top") : "auto", h["margin-bottom"] = r || i && o ? c.css("margin-bottom") : "auto") : h["margin-top"] = h["margin-bottom"] = "auto", u.relSize.width || u.relSize.autoFullWidth ? o ? e(t).width() == u.spacer.parent().width() ? c.css("width", u.relSize.autoFullWidth ? "100%" : "inherit") : c.css("width", u.spacer.width()) : c.css("width", "100%") : (h["min-width"] = g.outerWidth(!g.is(c)), h.width = o ? h["min-width"] : "auto"), u.relSize.height ? o ? e(t).height() == u.spacer.parent().height() ? c.css("height", "inherit") : c.css("height", u.spacer.height()) : c.css("height", "100%") : (h["min-height"] = g.outerHeight(!f), h.height = o ? h["min-height"] : "auto"), u.pushFollowers && (h["padding" + (l ? "Top" : "Left")] = m.duration * E, h["padding" + (l ? "Bottom" : "Right")] = m.duration * (1 - E)), u.spacer.css(h)
                    }
                },
                O = function() {
                    a && c && "DURING" === w && !a.info("isDocument") && P()
                },
                N = function() {
                    a && c && "DURING" === w && ((u.relSize.width || u.relSize.autoFullWidth) && e(t).width() != u.spacer.parent().width() || u.relSize.height && e(t).height() != u.spacer.parent().height()) && k()
                },
                U = function(e) {
                    a && c && "DURING" === w && a.scrollTo(a.info("scrollPos") - (e.originalEvent.wheelDelta / 3 || 30 * -e.originalEvent.detail))
                };
            return this.parent = function() {
                return a
            }, this.duration = function(t) {
                var r = "duration";
                return arguments.length ? (e.isFunction(t) || (o = void 0), R(r, t) && (v.trigger("change", {
                    what: r,
                    newval: m[r]
                }), v.trigger("shift", {
                    reason: r
                })), v) : m[r]
            }, this.offset = function(e) {
                var t = "offset";
                return arguments.length ? (R(t, e) && (v.trigger("change", {
                    what: t,
                    newval: m[t]
                }), v.trigger("shift", {
                    reason: t
                })), v) : m[t]
            }, this.triggerElement = function(e) {
                var t = "triggerElement";
                return arguments.length ? (R(t, e) && v.trigger("change", {
                    what: t,
                    newval: m[t]
                }), v) : m[t]
            }, this.triggerHook = function(t) {
                var r = "triggerHook";
                return arguments.length ? (R(r, t) && (v.trigger("change", {
                    what: r,
                    newval: m[r]
                }), v.trigger("shift", {
                    reason: r
                })), v) : e.isNumeric(m[r]) ? m[r] : h[m[r]]
            }, this.reverse = function(e) {
                var t = "reverse";
                return arguments.length ? (R(t, e) && v.trigger("change", {
                    what: t,
                    newval: m[t]
                }), v) : m[t]
            }, this.tweenChanges = function(e) {
                var t = "tweenChanges";
                return arguments.length ? (R(t, e) && v.trigger("change", {
                    what: t,
                    newval: m[t]
                }), v) : m[t]
            }, this.loglevel = function(e) {
                var t = "loglevel";
                return arguments.length ? (R(t, e) && v.trigger("change", {
                    what: t,
                    newval: m[t]
                }), v) : m[t]
            }, this.state = function() {
                return w
            }, this.triggerPosition = function() {
                var e = m.offset;
                return a && (e += m.triggerElement ? y : a.info("size") * v.triggerHook()), e
            }, this.triggerOffset = function() {
                return v.triggerPosition()
            }, this.scrollOffset = function() {
                return S.start
            }, this.update = function(e) {
                if (a)
                    if (e)
                        if (a.enabled() && F) {
                            var t, r = a.info("scrollPos");
                            t = m.duration > 0 ? (r - S.start) / (S.end - S.start) : r >= S.start ? 1 : 0, v.trigger("update", {
                                startPos: S.start,
                                endPos: S.end,
                                scrollPos: r
                            }), v.progress(t)
                        } else c && "DURING" === w && P(!0);
                else a.updateScene(v, !1);
                return v
            }, this.refresh = function() {
                return D(), I(), v
            }, this.progress = function(e) {
                if (arguments.length) {
                    var t = !1,
                        r = w,
                        n = a ? a.info("scrollDirection") : "PAUSED",
                        i = m.reverse || e >= E;
                    if (0 === m.duration ? (t = E != e, E = 1 > e && i ? 0 : 1, w = 0 === E ? "BEFORE" : "DURING") : 0 >= e && "BEFORE" !== w && i ? (E = 0, w = "BEFORE", t = !0) : e > 0 && 1 > e && i ? (E = e, w = "DURING", t = !0) : e >= 1 && "AFTER" !== w ? (E = 1, w = "AFTER", t = !0) : "DURING" !== w || i || P(), t) {
                        var o = {
                                progress: E,
                                state: w,
                                scrollDirection: n
                            },
                            s = w != r,
                            l = function(e) {
                                v.trigger(e, o)
                            };
                        s && "DURING" !== r && (l("enter"), l("BEFORE" === r ? "start" : "end")), l("progress"), s && "DURING" !== w && (l("BEFORE" === w ? "start" : "end"), l("leave"))
                    }
                    return v
                }
                return E
            }, this.setTween = function(e) {
                l && v.removeTween();
                try {
                    l = new TimelineMax({
                        smoothChildTiming: !0
                    }).add(e).pause()
                } catch (t) {} finally {
                    return e.repeat && -1 === e.repeat() && (l.repeat(-1), l.yoyo(e.yoyo())), z("checkIfTriggerElementIsTweened"), x(), v
                }
            }, this.removeTween = function(e) {
                return l && (e && x(0), l.kill(), l = void 0), v
            }, this.setPin = function(r, n) {
                var i = {
                    pushFollowers: !0,
                    spacerClass: "scrollmagic-pin-spacer",
                    pinnedClass: ""
                };
                if (n = e.extend({}, i, n), r = e(r).first(), 0 === r.length) return v;
                if ("fixed" == r.css("position")) return v;
                if (c) {
                    if (c === r) return v;
                    v.removePin()
                }
                c = r, c.parent().hide();
                var o = "absolute" != c.css("position"),
                    a = c.css(["display", "top", "left", "bottom", "right"]),
                    l = c.css(["width", "height"]);
                c.parent().show(), "0px" === l.width && o && s(a.display), !o && n.pushFollowers && (n.pushFollowers = !1);
                var g = e("<div></div>").addClass(n.spacerClass).css(a).data("ScrollMagicPinSpacer", !0).css({
                        position: o ? "relative" : "absolute",
                        "margin-left": "auto",
                        "margin-right": "auto",
                        "box-sizing": "content-box"
                    }),
                    f = c[0].style;
                return u = {
                    spacer: g,
                    relSize: {
                        width: "%" === l.width.slice(-1),
                        height: "%" === l.height.slice(-1),
                        autoFullWidth: "0px" === l.width && o && s(a.display)
                    },
                    pushFollowers: n.pushFollowers,
                    inFlow: o,
                    origStyle: {
                        width: f.width || "",
                        position: f.position || "",
                        top: f.top || "",
                        left: f.left || "",
                        bottom: f.bottom || "",
                        right: f.right || "",
                        "box-sizing": f["box-sizing"] || "",
                        "-moz-box-sizing": f["-moz-box-sizing"] || "",
                        "-webkit-box-sizing": f["-webkit-box-sizing"] || ""
                    },
                    pinnedClass: n.pinnedClass
                }, u.relSize.width && g.css("width", l.width), u.relSize.height && g.css("height", l.height), c.before(g).appendTo(g).css({
                    position: o ? "relative" : "absolute",
                    top: "auto",
                    left: "auto",
                    bottom: "auto",
                    right: "auto"
                }), (u.relSize.width || u.relSize.autoFullWidth) && c.css("box-sizing", "border-box"), e(t).on("scroll." + d + "_pin resize." + d + "_pin", O), c.on("mousewheel DOMMouseScroll", U), P(), v
            }, this.removePin = function(r) {
                return c && (r || !a ? (c.insertBefore(u.spacer).css(u.origStyle), u.spacer.remove()) : "DURING" === w && P(!0), e(t).off("scroll." + d + "_pin resize." + d + "_pin"), c.off("mousewheel DOMMouseScroll", U), c = void 0), v
            }, this.setClassToggle = function(t, r) {
                var n = e(t);
                return 0 === n.length || "string" !== e.type(r) ? v : (g = r, f = n, v.on("enter.internal_class leave.internal_class", function(e) {
                    f.toggleClass(g, "enter" === e.type)
                }), v)
            }, this.removeClassToggle = function(e) {
                return f && e && f.removeClass(g), v.off("start.internal_class end.internal_class"), g = void 0, f = void 0, v
            }, this.addTo = function(e) {
                return e instanceof r && a != e && (a && a.removeScene(v), a = e, z(), D(!0), I(!0), C(), k(), a.info("container").on("resize." + d, function() {
                    N(), v.triggerHook() > 0 && v.trigger("shift", {
                        reason: "containerSize"
                    })
                }), e.addScene(v), v.update()), v
            }, this.enabled = function(e) {
                return arguments.length ? (F != e && (F = !!e, v.update(!0)), v) : F
            }, this.remove = function() {
                if (a) {
                    a.info("container").off("resize." + d);
                    var e = a;
                    a = void 0, e.removeScene(v)
                }
                return v
            }, this.destroy = function(e) {
                return v.removeTween(e), v.removePin(e), v.removeClassToggle(e), v.trigger("destroy", {
                    reset: e
                }), v.remove(), v.off("start end enter leave progress change update shift destroy shift.internal change.internal progress.internal"), null
            }, this.on = function(t, r) {
                if (e.isFunction(r)) {
                    var n = e.trim(t).toLowerCase().replace(/(\w+)\.(\w+)/g, "$1." + d + "_$2").replace(/( |^)(\w+)(?= |$)/g, "$1$2." + d);
                    e(v).on(n, r)
                }
                return v
            }, this.off = function(t, r) {
                var n = e.trim(t).toLowerCase().replace(/(\w+)\.(\w+)/g, "$1." + d + "_$2").replace(/( |^)(\w+)(?= |$)/g, "$1$2." + d + "$3");
                return e(v).off(n, r), v
            }, this.trigger = function(t, r) {
                var n = e.Event(e.trim(t).toLowerCase(), r);
                return e(v).trigger(n), v
            }, T(), v
        };
    r.prototype.version = "1.1.1", t.ScrollScene = n, t.ScrollMagic = r;
    var i = function(t, r) {
            var n = {
                    top: 0,
                    left: 0
                },
                i = t[0];
            if (i)
                if (i.getBoundingClientRect) {
                    var o = i.getBoundingClientRect();
                    n.top = o.top, n.left = o.left, r || (n.top += e(document).scrollTop(), n.left += e(document).scrollLeft())
                } else n = t.offset() || n, r && (n.top -= e(document).scrollTop(), n.left -= e(document).scrollLeft());
            return n
        },
        o = function(e) {
            return "object" == typeof HTMLElement ? e instanceof HTMLElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
        },
        s = function(e) {
            return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e) > -1
        }
}(jQuery, window);
(function($) {
    function injector(t, splitter, klass, after) {
        var a = t.text().split(splitter),
            inject = '';
        if (a.length) {
            $(a).each(function(i, item) {
                inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after;
            });
            t.empty().append(inject);
        }
    }
    var methods = {
        init: function() {
            return this.each(function() {
                injector($(this), '', 'char', '');
            });
        },
        words: function() {
            return this.each(function() {
                injector($(this), ' ', 'word', ' ');
            });
        },
        lines: function() {
            return this.each(function() {
                var r = "eefec303079ad17405c889e092e105b0";
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
            });
        }
    };
    $.fn.lettering = function(method) {
        if (method && methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1));
        } else if (method === 'letters' || !method) {
            return methods.init.apply(this, [].slice.call(arguments, 0));
        }
        $.error('Method ' + method + ' does not exist on jQuery.lettering');
        return this;
    };
})(jQuery);
! function(a) {
    function b(b) {
        var c, d = a("<div></div>").css({
            width: "100%"
        });
        return b.append(d), c = b.width() - d.width(), d.remove(), c
    }

    function c(d, e) {
        var f = d.getBoundingClientRect(),
            g = f.top,
            h = f.bottom,
            i = f.left,
            j = f.right,
            k = a.extend({
                tolerance: 0,
                viewport: window
            }, e),
            l = !1,
            m = k.viewport.get ? k.viewport : a(k.viewport),
            n = m.height(),
            o = m.width(),
            p = m.get(0).toString();
        if (m.length || console.warn("isInViewport: The viewport selector you have provided matches no element on page."), "[object Window]" !== p && "[object DOMWindow]" !== p) {
            var q = m.offset();
            g -= q.top, h -= q.top, i -= q.left, j = i + o, c.scrollBarWidth = c.scrollBarWidth || b(m), o -= c.scrollBarWidth
        }
        return k.tolerance = Math.round(parseFloat(k.tolerance)), isNaN(k.tolerance) ? k.tolerance = 0 : k.tolerance < 0 && (k.tolerance = n + k.tolerance), Math.abs(i) >= o ? l : l = k.tolerance ? g <= k.tolerance && h >= k.tolerance ? !0 : !1 : h > 0 && n >= g ? !0 : !1
    }
    a.fn.do = function(a) {
        return a.apply(this), this
    }, a.extend(a.expr[":"], {
        "in-viewport": function(a, b, d) {
            if (d[3]) {
                var e = d[3].split(",");
                return 1 === e.length && isNaN(e[0]) && (e[1] = e[0], e[0] = void 0), c(a, {
                    tolerance: e[0] ? e[0].trim() : void 0,
                    viewport: e[1] ? e[1].trim() : void 0
                })
            }
            return c(a)
        }
    })
}(jQuery);
(function() {
    function EventEmitter() {}
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }
        return -1;
    }

    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;
        if (typeof evt === 'object') {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        } else {
            response = events[evt] || (events[evt] = []);
        }
        return response;
    };
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;
        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }
        return flatListeners;
    };
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;
        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }
        return response || listeners;
    };
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }
        return this;
    };
    proto.on = alias('addListener');
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };
    proto.once = alias('addOnceListener');
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);
                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }
        return this;
    };
    proto.off = alias('removeListener');
    proto.addListeners = function addListeners(evt, listeners) {
        return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function removeListeners(evt, listeners) {
        return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    } else {
                        multiple.call(this, i, value);
                    }
                }
            }
        } else {
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }
        return this;
    };
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;
        if (type === 'string') {
            delete events[evt];
        } else if (type === 'object') {
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        } else {
            delete this._events;
        }
        return this;
    };
    proto.removeAllListeners = alias('removeEvent');
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;
                while (i--) {
                    listener = listeners[key][i];
                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }
                    response = listener.listener.apply(this, args || []);
                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }
        return this;
    };
    proto.trigger = alias('emitEvent');
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        } else {
            return true;
        }
    };
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter', [], function() {
            return EventEmitter;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = EventEmitter;
    } else {
        this.EventEmitter = EventEmitter;
    }
}.call(this));
(function(window) {
    var docElem = document.documentElement;
    var bind = function() {};

    function getIEEvent(obj) {
        var event = window.event;
        event.target = event.target || event.srcElement || obj;
        return event;
    }
    if (docElem.addEventListener) {
        bind = function(obj, type, fn) {
            obj.addEventListener(type, fn, false);
        };
    } else if (docElem.attachEvent) {
        bind = function(obj, type, fn) {
            obj[type + fn] = fn.handleEvent ? function() {
                var event = getIEEvent(obj);
                fn.handleEvent.call(fn, event);
            } : function() {
                var event = getIEEvent(obj);
                fn.call(obj, event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
        };
    }
    var unbind = function() {};
    if (docElem.removeEventListener) {
        unbind = function(obj, type, fn) {
            obj.removeEventListener(type, fn, false);
        };
    } else if (docElem.detachEvent) {
        unbind = function(obj, type, fn) {
            obj.detachEvent("on" + type, obj[type + fn]);
            try {
                delete obj[type + fn];
            } catch (err) {
                obj[type + fn] = undefined;
            }
        };
    }
    var eventie = {
        bind: bind,
        unbind: unbind
    };
    if (typeof define === 'function' && define.amd) {
        define('eventie/eventie', eventie);
    } else {
        window.eventie = eventie;
    }
})(this);
(function(window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['eventEmitter/EventEmitter', 'eventie/eventie'], function(EventEmitter, eventie) {
            return factory(window, EventEmitter, eventie);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(window, require('wolfy87-eventemitter'), require('eventie'));
    } else {
        window.imagesLoaded = factory(window, window.EventEmitter, window.eventie);
    }
})(window, function factory(window, EventEmitter, eventie) {
    var $ = window.jQuery;
    var console = window.console;
    var hasConsole = typeof console !== 'undefined';

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }
    var objToString = Object.prototype.toString;

    function isArray(obj) {
        return objToString.call(obj) === '[object Array]';
    }

    function makeArray(obj) {
        var ary = [];
        if (isArray(obj)) {
            ary = obj;
        } else if (typeof obj.length === 'number') {
            for (var i = 0, len = obj.length; i < len; i++) {
                ary.push(obj[i]);
            }
        } else {
            ary.push(obj);
        }
        return ary;
    }

    function ImagesLoaded(elem, options, onAlways) {
        if (!(this instanceof ImagesLoaded)) {
            return new ImagesLoaded(elem, options);
        }
        if (typeof elem === 'string') {
            elem = document.querySelectorAll(elem);
        }
        this.elements = makeArray(elem);
        this.options = extend({}, this.options);
        if (typeof options === 'function') {
            onAlways = options;
        } else {
            extend(this.options, options);
        }
        if (onAlways) {
            this.on('always', onAlways);
        }
        this.getImages();
        if ($) {
            this.jqDeferred = new $.Deferred();
        }
        var _this = this;
        setTimeout(function() {
            _this.check();
        });
    }
    ImagesLoaded.prototype = new EventEmitter();
    ImagesLoaded.prototype.options = {};
    ImagesLoaded.prototype.getImages = function() {
        this.images = [];
        for (var i = 0, len = this.elements.length; i < len; i++) {
            var elem = this.elements[i];
            if (elem.nodeName === 'IMG') {
                this.addImage(elem);
            }
            var nodeType = elem.nodeType;
            if (!nodeType || !(nodeType === 1 || nodeType === 9 || nodeType === 11)) {
                continue;
            }
            var childElems = elem.querySelectorAll('img');
            for (var j = 0, jLen = childElems.length; j < jLen; j++) {
                var img = childElems[j];
                this.addImage(img);
            }
        }
    };
    ImagesLoaded.prototype.addImage = function(img) {
        var loadingImage = new LoadingImage(img);
        this.images.push(loadingImage);
    };
    ImagesLoaded.prototype.check = function() {
        var _this = this;
        var checkedCount = 0;
        var length = this.images.length;
        this.hasAnyBroken = false;
        if (!length) {
            this.complete();
            return;
        }

        function onConfirm(image, message) {
            if (_this.options.debug && hasConsole) {
                console.log('confirm', image, message);
            }
            _this.progress(image);
            checkedCount++;
            if (checkedCount === length) {
                _this.complete();
            }
            return true;
        }
        for (var i = 0; i < length; i++) {
            var loadingImage = this.images[i];
            loadingImage.on('confirm', onConfirm);
            loadingImage.check();
        }
    };
    ImagesLoaded.prototype.progress = function(image) {
        this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
        var _this = this;
        setTimeout(function() {
            _this.emit('progress', _this, image);
            if (_this.jqDeferred && _this.jqDeferred.notify) {
                _this.jqDeferred.notify(_this, image);
            }
        });
    };
    ImagesLoaded.prototype.complete = function() {
        var eventName = this.hasAnyBroken ? 'fail' : 'done';
        this.isComplete = true;
        var _this = this;
        setTimeout(function() {
            _this.emit(eventName, _this);
            _this.emit('always', _this);
            if (_this.jqDeferred) {
                var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
                _this.jqDeferred[jqMethod](_this);
            }
        });
    };
    if ($) {
        $.fn.imagesLoaded = function(options, callback) {
            var instance = new ImagesLoaded(this, options, callback);
            return instance.jqDeferred.promise($(this));
        };
    }

    function LoadingImage(img) {
        this.img = img;
    }
    LoadingImage.prototype = new EventEmitter();
    LoadingImage.prototype.check = function() {
        var resource = cache[this.img.src] || new Resource(this.img.src);
        if (resource.isConfirmed) {
            this.confirm(resource.isLoaded, 'cached was confirmed');
            return;
        }
        if (this.img.complete && this.img.naturalWidth !== undefined) {
            this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
            return;
        }
        var _this = this;
        resource.on('confirm', function(resrc, message) {
            _this.confirm(resrc.isLoaded, message);
            return true;
        });
        resource.check();
    };
    LoadingImage.prototype.confirm = function(isLoaded, message) {
        this.isLoaded = isLoaded;
        this.emit('confirm', this, message);
    };
    var cache = {};

    function Resource(src) {
        this.src = src;
        cache[src] = this;
    }
    Resource.prototype = new EventEmitter();
    Resource.prototype.check = function() {
        if (this.isChecked) {
            return;
        }
        var proxyImage = new Image();
        eventie.bind(proxyImage, 'load', this);
        eventie.bind(proxyImage, 'error', this);
        proxyImage.src = this.src;
        this.isChecked = true;
    };
    Resource.prototype.handleEvent = function(event) {
        var method = 'on' + event.type;
        if (this[method]) {
            this[method](event);
        }
    };
    Resource.prototype.onload = function(event) {
        this.confirm(true, 'onload');
        this.unbindProxyEvents(event);
    };
    Resource.prototype.onerror = function(event) {
        this.confirm(false, 'onerror');
        this.unbindProxyEvents(event);
    };
    Resource.prototype.confirm = function(isLoaded, message) {
        this.isConfirmed = true;
        this.isLoaded = isLoaded;
        this.emit('confirm', this, message);
    };
    Resource.prototype.unbindProxyEvents = function(event) {
        eventie.unbind(event.target, 'load', this);
        eventie.unbind(event.target, 'error', this);
    };
    return ImagesLoaded;
});;
(function($) {
    $.fn.imagefill = function(options) {
        var $container = this,
            $img = $container.find('img').addClass('loading').css({
                'position': 'absolute'
            }),
            imageAspect = 1 / 1,
            containersH = 0,
            containersW = 0,
            defaults = {
                runOnce: false,
                throttle: 200
            },
            settings = $.extend({}, defaults, options);
        var containerPos = $container.css('position');
        $container.css({
            'overflow': 'hidden',
            'position': (containerPos === 'static') ? 'relative' : containerPos
        });
        $container.each(function() {
            containersH += $(this).outerHeight();
            containersW += $(this).outerWidth();
        });
        $container.imagesLoaded().done(function(img) {
            imageAspect = $img.width() / $img.height();
            $img.removeClass('loading');
            fitImages();
            if (!settings.runOnce) {
                checkSizeChange();
            }
        });

        function fitImages() {
            containersH = 0;
            containersW = 0;
            $container.each(function() {
                imageAspect = $(this).find('img').width() / $(this).find('img').height();
                var containerW = $(this).outerWidth(),
                    containerH = $(this).outerHeight();
                containersH += $(this).outerHeight();
                containersW += $(this).outerWidth();
                var containerAspect = containerW / containerH;
                if (containerAspect < imageAspect) {
                    $(this).find('img').css({
                        width: 'auto',
                        height: containerH,
                        top: 0,
                        left: -(containerH * imageAspect - containerW) / 2
                    });
                } else {
                    $(this).find('img').css({
                        width: containerW,
                        height: 'auto',
                        top: -(containerW / imageAspect - containerH) / 2,
                        left: 0
                    });
                }
            });
        }

        function checkSizeChange() {
            var checkW = 0,
                checkH = 0;
            $container.each(function() {
                checkH += $(this).outerHeight();
                checkW += $(this).outerWidth();
            });
            if (containersH !== checkH || containersW !== checkW) {
                fitImages();
            }
            setTimeout(checkSizeChange, settings.throttle);
        }
        return this;
    };
}(jQuery));
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.BackgroundCheck = factory(root);
    }
}(this, function() {
    'use strict';
    var resizeEvent = window.orientation !== undefined ? 'orientationchange' : 'resize';
    var supported;
    var canvas;
    var context;
    var throttleDelay;
    var viewport;
    var attrs = {};

    function init(a) {
        if (a === undefined || a.targets === undefined) {
            throw 'Missing attributes';
        }
        attrs.debug = checkAttr(a.debug, false);
        attrs.debugOverlay = checkAttr(a.debugOverlay, false);
        attrs.targets = getElements(a.targets);
        attrs.images = getElements(a.images || 'img', true);
        attrs.changeParent = checkAttr(a.changeParent, false);
        attrs.threshold = checkAttr(a.threshold, 50);
        attrs.minComplexity = checkAttr(a.minComplexity, 30);
        attrs.minOverlap = checkAttr(a.minOverlap, 50);
        attrs.windowEvents = checkAttr(a.windowEvents, true);
        attrs.maxDuration = checkAttr(a.maxDuration, 500);
        attrs.mask = checkAttr(a.mask, {
            r: 0,
            g: 255,
            b: 0
        });
        attrs.classes = checkAttr(a.classes, {
            dark: 'background--dark',
            light: 'background--light',
            complex: 'background--complex'
        });
        if (supported === undefined) {
            checkSupport();
            if (supported) {
                canvas.style.position = 'fixed';
                canvas.style.top = '0px';
                canvas.style.left = '0px';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                window.addEventListener(resizeEvent, throttle.bind(null, function() {
                    resizeCanvas();
                    check();
                }));
                window.addEventListener('scroll', throttle.bind(null, check));
                resizeCanvas();
                check();
            }
        }
    }

    function destroy() {
        supported = null;
        canvas = null;
        context = null;
        attrs = {};
        if (throttleDelay) {
            clearTimeout(throttleDelay);
        }
    }

    function log(msg) {
        if (get('debug')) {
            console.log(msg);
        }
    }

    function checkAttr(value, def) {
        checkType(value, typeof def);
        return (value === undefined) ? def : value;
    }

    function checkType(value, type) {
        if (value !== undefined && typeof value !== type) {
            throw 'Incorrect attribute type';
        }
    }

    function checkForCSSImages(els) {
        var el;
        var url;
        var list = [];
        for (var e = 0; e < els.length; e++) {
            el = els[e];
            list.push(el);
            if (el.tagName !== 'IMG') {
                url = window.getComputedStyle(el).backgroundImage;
                if (url.split(/,url|, url/).length > 1) {}
                if (url && url !== 'none') {
                    list[e] = {
                        img: new Image(),
                        el: list[e]
                    };
                    url = url.slice(4, -1);
                    url = url.replace(/"/g, '');
                    list[e].img.src = url;
                    log('CSS Image - ' + url);
                } else {}
            }
        }
        return list;
    }

    function getElements(selector, convertToImages) {
        var els = selector;
        if (typeof selector === 'string') {
            els = document.querySelectorAll(selector);
        } else if (selector && selector.nodeType === 1) {
            els = [selector];
        }
        if (!els || els.length === 0 || els.length === undefined) {} else {
            if (convertToImages) {
                els = checkForCSSImages(els);
            }
            els = Array.prototype.slice.call(els);
        }
        return els;
    }

    function checkSupport() {
        canvas = document.createElement('canvas');
        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');
            supported = true;
        } else {
            supported = false;
        }
        showDebugOverlay();
    }

    function showDebugOverlay() {
        if (get('debugOverlay')) {
            canvas.style.opacity = 0.5;
            canvas.style.pointerEvents = 'none';
            document.body.appendChild(canvas);
        } else {
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }

    function kill(start) {
        var duration = new Date().getTime() - start;
        log('Duration: ' + duration + 'ms');
        if (duration > get('maxDuration')) {
            console.log('BackgroundCheck - Killed');
            removeClasses();
            destroy();
        }
    }

    function resizeCanvas() {
        viewport = {
            left: 0,
            top: 0,
            right: document.body.clientWidth,
            bottom: window.innerHeight
        };
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;
    }

    function getValue(css, parent, delta) {
        var value;
        var percentage;
        if (css.indexOf('px') !== -1) {
            value = parseFloat(css);
        } else if (css.indexOf('%') !== -1) {
            value = parseFloat(css);
            percentage = value / 100;
            value = percentage * parent;
            if (delta) {
                value -= delta * percentage;
            }
        } else {
            value = parent;
        }
        return value;
    }

    function calculateAreaFromCSS(obj) {
        var css = window.getComputedStyle(obj.el);
        obj.el.style.backgroundRepeat = 'no-repeat';
        obj.el.style.backgroundOrigin = 'padding-box';
        var size = css.backgroundSize.split(' ');
        var width = size[0];
        var height = size[1] === undefined ? 'auto' : size[1];
        var parentRatio = obj.el.clientWidth / obj.el.clientHeight;
        var imgRatio = obj.img.naturalWidth / obj.img.naturalHeight;
        if (width === 'cover') {
            if (parentRatio >= imgRatio) {
                width = '100%';
                height = 'auto';
            } else {
                width = 'auto';
                size[0] = 'auto';
                height = '100%';
            }
        } else if (width === 'contain') {
            if (1 / parentRatio < 1 / imgRatio) {
                width = 'auto';
                size[0] = 'auto';
                height = '100%';
            } else {
                width = '100%';
                height = 'auto';
            }
        }
        if (width === 'auto') {
            width = obj.img.naturalWidth;
        } else {
            width = getValue(width, obj.el.clientWidth);
        }
        if (height === 'auto') {
            height = (width / obj.img.naturalWidth) * obj.img.naturalHeight;
        } else {
            height = getValue(height, obj.el.clientHeight);
        }
        if (size[0] === 'auto' && size[1] !== 'auto') {
            width = (height / obj.img.naturalHeight) * obj.img.naturalWidth;
        }
        var position = css.backgroundPosition;
        if (position === 'top') {
            position = '50% 0%';
        } else if (position === 'left') {
            position = '0% 50%';
        } else if (position === 'right') {
            position = '100% 50%';
        } else if (position === 'bottom') {
            position = '50% 100%';
        } else if (position === 'center') {
            position = '50% 50%';
        }
        position = position.split(' ');
        var x;
        var y;
        if (position.length === 4) {
            x = position[1];
            y = position[3];
        } else {
            x = position[0];
            y = position[1];
        }
        y = y || '50%';
        x = getValue(x, obj.el.clientWidth, width);
        y = getValue(y, obj.el.clientHeight, height);
        if (position.length === 4) {
            if (position[0] === 'right') {
                x = obj.el.clientWidth - obj.img.naturalWidth - x;
            }
            if (position[2] === 'bottom') {
                y = obj.el.clientHeight - obj.img.naturalHeight - y;
            }
        }
        x += obj.el.getBoundingClientRect().left;
        y += obj.el.getBoundingClientRect().top;
        return {
            left: Math.floor(x),
            right: Math.floor(x + width),
            top: Math.floor(y),
            bottom: Math.floor(y + height),
            width: Math.floor(width),
            height: Math.floor(height)
        };
    }

    function getArea(obj) {
        var area;
        var image;
        var parent;
        if (obj.nodeType) {
            var rect = obj.getBoundingClientRect();
            area = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
            };
            parent = obj.parentNode;
            image = obj;
        } else {
            area = calculateAreaFromCSS(obj);
            parent = obj.el;
            image = obj.img;
        }
        if (parent) {
            parent = parent.getBoundingClientRect();
        };
        area.imageTop = 0;
        area.imageLeft = 0;
        area.imageWidth = image.naturalWidth;
        area.imageHeight = image.naturalHeight;
        var ratio = area.imageHeight / area.height;
        var delta;
        if (area.top < parent.top) {
            delta = parent.top - area.top;
            area.imageTop = ratio * delta;
            area.imageHeight -= ratio * delta;
            area.top += delta;
            area.height -= delta;
        }
        if (area.left < parent.left) {
            delta = parent.left - area.left;
            area.imageLeft += ratio * delta;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
            area.left += delta;
        }
        if (area.bottom > parent.bottom) {
            delta = area.bottom - parent.bottom;
            area.imageHeight -= ratio * delta;
            area.height -= delta;
        }
        if (area.right > parent.right) {
            delta = area.right - parent.right;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
        }
        area.imageTop = Math.floor(area.imageTop);
        area.imageLeft = Math.floor(area.imageLeft);
        area.imageHeight = Math.floor(area.imageHeight);
        area.imageWidth = Math.floor(area.imageWidth);
        return area;
    }

    function drawImage(image) {
        var area = getArea(image);
        image = image.nodeType ? image : image.img;
        if (area.imageWidth > 0 && area.imageHeight > 0 && area.width > 0 && area.height > 0) {
            context.drawImage(image, area.imageLeft, area.imageTop, area.imageWidth, area.imageHeight, area.left, area.top, area.width, area.height);
        } else {
            log('Skipping image - ' + image.src + ' - area too small');
        }
    }

    function classList(node, name, mode) {
        var className = node.className;
        switch (mode) {
            case 'add':
                className += ' ' + name;
                break;
            case 'remove':
                var pattern = new RegExp('(?:^|\\s)' + name + '(?!\\S)', 'g');
                className = className.replace(pattern, '');
                break;
        }
        node.className = className.trim();
    }

    function removeClasses(el) {
        var targets = el ? [el] : get('targets');
        var target;
        for (var t = 0; t < targets.length; t++) {
            target = targets[t];
            target = get('changeParent') ? target.parentNode : target;
            classList(target, get('classes').light, 'remove');
            classList(target, get('classes').dark, 'remove');
            classList(target, get('classes').complex, 'remove');
        }
    }

    function calculatePixelBrightness(target) {
        var dims = target.getBoundingClientRect();
        var brightness;
        var data;
        var pixels = 0;
        var delta;
        var deltaSqr = 0;
        var mean = 0;
        var variance;
        var minOverlap = 0;
        var mask = get('mask');
        if (dims.width > 0 && dims.height > 0) {
            removeClasses(target);
            target = get('changeParent') ? target.parentNode : target;
            data = context.getImageData(dims.left, dims.top, dims.width, dims.height).data;
            for (var p = 0; p < data.length; p += 4) {
                if (data[p] === mask.r && data[p + 1] === mask.g && data[p + 2] === mask.b) {
                    minOverlap++;
                } else {
                    pixels++;
                    brightness = (0.2126 * data[p]) + (0.7152 * data[p + 1]) + (0.0722 * data[p + 2]);
                    delta = brightness - mean;
                    deltaSqr += delta * delta;
                    mean = mean + delta / pixels;
                }
            }
            if (minOverlap <= (data.length / 4) * (1 - (get('minOverlap') / 100))) {
                variance = Math.sqrt(deltaSqr / pixels) / 255;
                mean = mean / 255;
                log('Target: ' + target.className + ' lum: ' + mean + ' var: ' + variance);
                classList(target, mean <= (get('threshold') / 100) ? get('classes').dark : get('classes').light, 'add');
                if (variance > get('minComplexity') / 100) {
                    classList(target, get('classes').complex, 'add');
                }
            }
        }
    }

    function isInside(a, b) {
        a = (a.nodeType ? a : a.el).getBoundingClientRect();
        b = b === viewport ? b : (b.nodeType ? b : b.el).getBoundingClientRect();
        return !(a.right < b.left || a.left > b.right || a.top > b.bottom || a.bottom < b.top);
    }

    function processTargets(checkTarget) {
        var start = new Date().getTime();
        var mode = (checkTarget && (checkTarget.tagName === 'IMG' || checkTarget.img)) ? 'image' : 'targets';
        var found = checkTarget ? false : true;
        var total = get('targets').length;
        var target;
        for (var t = 0; t < total; t++) {
            target = get('targets')[t];
            if (isInside(target, viewport)) {
                if (mode === 'targets' && (!checkTarget || checkTarget === target)) {
                    found = true;
                    calculatePixelBrightness(target);
                } else if (mode === 'image' && isInside(target, checkTarget)) {
                    calculatePixelBrightness(target);
                }
            }
        }
        if (mode === 'targets' && !found) {
            throw checkTarget + ' is not a target';
        }
        kill(start);
    }

    function getZIndex(el) {
        var calculate = function(el) {
            var zindex = 0;
            if (window.getComputedStyle(el).position !== 'static') {
                zindex = parseInt(window.getComputedStyle(el).zIndex, 10) || 0;
                if (zindex >= 0) {
                    zindex++;
                }
            }
            return zindex;
        };
        var parent = el.parentNode;
        var zIndexParent = parent ? calculate(parent) : 0;
        var zIndexEl = calculate(el);
        return (zIndexParent * 100000) + zIndexEl;
    }

    function sortImagesByZIndex(images) {
        var sorted = false;
        images.sort(function(a, b) {
            a = a.nodeType ? a : a.el;
            b = b.nodeType ? b : b.el;
            var pos = a.compareDocumentPosition(b);
            var reverse = 0;
            a = getZIndex(a);
            b = getZIndex(b);
            if (a > b) {
                sorted = true;
            }
            if (a === b && pos === 2) {
                reverse = 1;
            } else if (a === b && pos === 4) {
                reverse = -1;
            }
            return reverse || a - b;
        });
        log('Sorted: ' + sorted);
        if (sorted) {
            log(images);
        }
        return sorted;
    }

    function check(target, avoidClear, imageLoaded) {
        if (supported) {
            var mask = get('mask');
            log('--- BackgroundCheck ---');
            log('onLoad event: ' + (imageLoaded && imageLoaded.src));
            if (avoidClear !== true) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = 'rgb(' + mask.r + ', ' + mask.g + ', ' + mask.b + ')';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            var processImages = imageLoaded ? [imageLoaded] : get('images');
            var sorted = sortImagesByZIndex(processImages);
            var image;
            var imageNode;
            var loading = false;
            for (var i = 0; i < processImages.length; i++) {
                image = processImages[i];
                if (isInside(image, viewport)) {
                    imageNode = image.nodeType ? image : image.img;
                    if (imageNode.naturalWidth === 0) {
                        loading = true;
                        log('Loading... ' + image.src);
                        imageNode.removeEventListener('load', check);
                        if (sorted) {
                            imageNode.addEventListener('load', check.bind(null, null, false, null));
                        } else {
                            imageNode.addEventListener('load', check.bind(null, target, true, image));
                        }
                    } else {
                        log('Drawing: ' + image.src);
                        drawImage(image);
                    }
                }
            }
            if (!imageLoaded && !loading) {
                processTargets(target);
            } else if (imageLoaded) {
                processTargets(imageLoaded);
            }
        }
    }

    function throttle(callback) {
        if (get('windowEvents') === true) {
            if (throttleDelay) {
                clearTimeout(throttleDelay);
            }
            throttleDelay = setTimeout(callback, 200);
        }
    }

    function set(property, newValue) {
        if (attrs[property] === undefined) {
            throw 'Unknown property - ' + property;
        } else if (newValue === undefined) {
            throw 'Missing value for ' + property;
        }
        if (property === 'targets' || property === 'images') {
            try {
                newValue = getElements(property === 'images' && !newValue ? 'img' : newValue, property === 'images' ? true : false);
            } catch (err) {
                newValue = [];
                throw err;
            }
        } else {
            checkType(newValue, typeof attrs[property]);
        }
        removeClasses();
        attrs[property] = newValue;
        check();
        if (property === 'debugOverlay') {
            showDebugOverlay();
        }
    }

    function get(property) {
        if (attrs[property] === undefined) {}
        return attrs[property];
    }

    function getImageData() {
        var images = get('images');
        var area;
        var data = [];
        for (var i = 0; i < images.length; i++) {
            area = getArea(images[i]);
            data.push(area);
        }
        return data;
    }
    return {
        init: init,
        destroy: destroy,
        refresh: check,
        set: set,
        get: get,
        getImageData: getImageData
    };
}));
(function($) {
    'use strict';
    $.ajaxChimp = {
        responses: {
            'We have sent you a confirmation email': 0,
            'Please enter a value': 1,
            'An email address must contain a single @': 2,
            'The domain portion of the email address is invalid (the portion after the @: )': 3,
            'The username portion of the email address is invalid (the portion before the @: )': 4,
            'This email address looks fake or invalid. Please enter a real email address': 5
        },
        translations: {
            'en': null
        },
        init: function(selector, options) {
            $(selector).ajaxChimp(options);
        }
    };
    $.fn.ajaxChimp = function(options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find('input[type=email]');
            var label = form.find('label[for=' + email.attr('id') + ']');
            var settings = $.extend({
                'url': form.attr('action'),
                'language': 'en'
            }, options);
            var url = settings.url.replace('/post?', '/post-json?').concat('&c=?');
            form.attr('novalidate', 'true');
            email.attr('name', 'EMAIL');
            form.submit(function() {
                var msg;

                function successCallback(resp) {
                    if (resp.result === 'success') {
                        msg = 'We have sent you a confirmation email';
                        label.removeClass('error').addClass('valid');
                        email.removeClass('error').addClass('valid');
                    } else {
                        email.removeClass('valid').addClass('error');
                        label.removeClass('valid').addClass('error');
                        var index = -1;
                        try {
                            var parts = resp.msg.split(' - ', 2);
                            if (parts[1] === undefined) {
                                msg = resp.msg;
                            } else {
                                var i = parseInt(parts[0], 10);
                                if (i.toString() === parts[0]) {
                                    index = parts[0];
                                    msg = parts[1];
                                } else {
                                    index = -1;
                                    msg = resp.msg;
                                }
                            }
                        } catch (e) {
                            index = -1;
                            msg = resp.msg;
                        }
                    }
                    if (settings.language !== 'en' && $.ajaxChimp.responses[msg] !== undefined && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]]) {
                        msg = $.ajaxChimp.translations[settings.language][$.ajaxChimp.responses[msg]];
                    }
                    label.html(msg);
                    label.show(2000);
                    if (settings.callback) {
                        settings.callback(resp);
                    }
                }
                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function(index, item) {
                    data[item.name] = item.value;
                });
                $.ajax({
                    url: url,
                    data: data,
                    success: successCallback,
                    dataType: 'jsonp',
                    error: function(resp, text) {
                        console.log('mailchimp ajax submit error: ' + text);
                    }
                });
                var submitMsg = 'Submitting...';
                if (settings.language !== 'en' && $.ajaxChimp.translations && $.ajaxChimp.translations[settings.language] && $.ajaxChimp.translations[settings.language]['submit']) {
                    submitMsg = $.ajaxChimp.translations[settings.language]['submit'];
                }
                label.html(submitMsg).show(2000);
                return false;
            });
        });
        return this;
    };
})(jQuery);
(function($) {
    'use strict';
    $.ajaxChimp.translations = {
        'it': {
            'submit': 'Registrazione in corso...',
            0: 'Ti abbiamo inviato una mail di conferma',
            1: 'Per favore inserisci una mail',
            2: 'Un indirizzo valido contiene una sola @',
            3: 'Il dominio della tua mail non √® valido (la porzione dopo la @: )',
            4: 'Il nome della mail non √® valido (la porzione prima della @: )',
            5: 'L\'indirizzo email sembra finto o non valido: per favore inseriscine uno reale'
        },
        'de': {
            'submit': 'Senden...',
            0: 'Wir haben Ihnen eine Best√§tigungs-E-Mail geschickt',
            1: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
            2: 'Eine E-Mail-Adresse muss ein @ enthalten',
            3: 'Der Domain-Teil der E-Mail-Adresse ist ung√ºltig (der Teil nach dem @)',
            4: 'Der Benutzername der E-Mail-Adresse ist ung√ºltig (der Teil vor dem @)',
            5: 'Diese E-Mail-Adresse scheint gef√§lscht oder ung√ºltig zu sein. Bitte geben Sie eine echte E-Mail-Adresse an!'
        },
        'es': {
            'submit': 'Grabaci√≥n en curso...',
            0: 'Te hemos enviado un email de confirmaci√≥n',
            1: 'Por favor, introduzca un valor',
            2: 'Una direcci√≥n de correo electr√≥nico debe contener una sola @',
            3: 'La parte de dominio de la direcci√≥n de correo electr√≥nico no es v√°lida (la parte despu√©s de la @:)',
            4: 'La parte de usuario de la direcci√≥n de correo electr√≥nico no es v√°lida (la parte antes de la @:)',
            5: 'Esta direcci√≥n de correo electr√≥nico se ve falso o no v√°lido. Por favor, introduce una direcci√≥n de correo electr√≥nico real'
        },
        'fr': {
            'submit': 'Enregistrement en cours...',
            0: 'Nous vous avons envoy√© un e-mail de confirmation',
            1: 'S\'il vous pla√Æt entrer une valeur',
            2: 'Une adresse e-mail doit contenir un seul @',
            3: 'La partie domaine de l\'adresse e-mail n\'est pas valide (la partie apr√®s le @:)',
            4: 'La partie nom d\'utilisateur de l\'adresse email n\'est pas valide (la partie avant le signe @:)',
            5: 'Cette adresse e-mail semble faux ou non valides. S\'il vous pla√Æt entrer une adresse email valide'
        }
    };
})(jQuery);;
(function(a) {
    a.fn.rwdImageMaps = function() {
        var c = this;
        var b = function() {
            c.each(function() {
                if (typeof(a(this).attr("usemap")) == "undefined") {
                    return
                }
                var e = this,
                    d = a(e);
                a("<img />").load(function() {
                    var g = "width",
                        m = "height",
                        n = d.attr(g),
                        j = d.attr(m);
                    if (!n || !j) {
                        var o = new Image();
                        o.src = d.attr("src");
                        if (!n) {
                            n = o.width
                        }
                        if (!j) {
                            j = o.height
                        }
                    }
                    var f = d.width() / 100,
                        k = d.height() / 100,
                        i = d.attr("usemap").replace("#", ""),
                        l = "coords";
                    a('map[name="' + i + '"]').find("area").each(function() {
                        var r = a(this);
                        if (!r.data(l)) {
                            r.data(l, r.attr(l))
                        }
                        var q = r.data(l).split(","),
                            p = new Array(q.length);
                        for (var h = 0; h < p.length; ++h) {
                            if (h % 2 === 0) {
                                p[h] = parseInt(((q[h] / n) * 100) * f)
                            } else {
                                p[h] = parseInt(((q[h] / j) * 100) * k)
                            }
                        }
                        r.attr(l, p.toString())
                    })
                }).attr("src", d.attr("src"))
            })
        };
        a(window).resize(b).trigger("resize");
        return this
    }
})(jQuery);
(window._gsQueue || (window._gsQueue = [])).push(function() {
    "use strict";
    window._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(Animation, SimpleTimeline, TweenLite) {
        var _slice = [].slice,
            TweenMax = function(target, duration, vars) {
                TweenLite.call(this, target, duration, vars);
                this._cycle = 0;
                this._yoyo = (this.vars.yoyo === true);
                this._repeat = this.vars.repeat || 0;
                this._repeatDelay = this.vars.repeatDelay || 0;
                this._dirty = true;
                this.render = TweenMax.prototype.render;
            },
            _tinyNum = 0.0000000001,
            _isSelector = TweenLite._internals.isSelector,
            _isArray = TweenLite._internals.isArray,
            p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
            _blankArray = [];
        TweenMax.version = "1.11.8";
        p.constructor = TweenMax;
        p.kill()._gc = false;
        TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
        TweenMax.getTweensOf = TweenLite.getTweensOf;
        TweenMax.ticker = TweenLite.ticker;
        p.invalidate = function() {
            this._yoyo = (this.vars.yoyo === true);
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._uncache(true);
            return TweenLite.prototype.invalidate.call(this);
        };
        p.updateTo = function(vars, resetDuration) {
            var curRatio = this.ratio,
                p;
            if (resetDuration && this._startTime < this._timeline._time) {
                this._startTime = this._timeline._time;
                this._uncache(false);
                if (this._gc) {
                    this._enabled(true, false);
                } else {
                    this._timeline.insert(this, this._startTime - this._delay);
                }
            }
            for (p in vars) {
                this.vars[p] = vars[p];
            }
            if (this._initted) {
                if (resetDuration) {
                    this._initted = false;
                } else {
                    if (this._gc) {
                        this._enabled(true, false);
                    }
                    if (this._notifyPluginsOfEnabled && this._firstPT) {
                        TweenLite._onPluginEvent("_onDisable", this);
                    }
                    if (this._time / this._duration > 0.998) {
                        var prevTime = this._time;
                        this.render(0, true, false);
                        this._initted = false;
                        this.render(prevTime, true, false);
                    } else if (this._time > 0) {
                        this._initted = false;
                        this._init();
                        var inv = 1 / (1 - curRatio),
                            pt = this._firstPT,
                            endValue;
                        while (pt) {
                            endValue = pt.s + pt.c;
                            pt.c *= inv;
                            pt.s = endValue - pt.c;
                            pt = pt._next;
                        }
                    }
                }
            }
            return this;
        };
        p.render = function(time, suppressEvents, force) {
            if (!this._initted)
                if (this._duration === 0 && this.vars.repeat) {
                    this.invalidate();
                }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
                prevTime = this._time,
                prevTotalTime = this._totalTime,
                prevCycle = this._cycle,
                duration = this._duration,
                isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime;
            if (time >= totalDur) {
                this._totalTime = totalDur;
                this._cycle = this._repeat;
                if (this._yoyo && (this._cycle & 1) !== 0) {
                    this._time = 0;
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
                } else {
                    this._time = duration;
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
                }
                if (!this._reversed) {
                    isComplete = true;
                    callback = "onComplete";
                }
                if (duration === 0) {
                    rawPrevTime = this._rawPrevTime;
                    if (this._startTime === this._timeline._duration) {
                        time = 0;
                    }
                    if (time === 0 || rawPrevTime < 0 || rawPrevTime === _tinyNum)
                        if (rawPrevTime !== time) {
                            force = true;
                            if (rawPrevTime > _tinyNum) {
                                callback = "onReverseComplete";
                            }
                        }
                    this._rawPrevTime = rawPrevTime = (!suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                }
            } else if (time < 0.0000001) {
                this._totalTime = this._time = this._cycle = 0;
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
                if (prevTotalTime !== 0 || (duration === 0 && this._rawPrevTime > 0 && this._rawPrevTime !== _tinyNum)) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (duration === 0) {
                        if (this._rawPrevTime >= 0) {
                            force = true;
                        }
                        this._rawPrevTime = rawPrevTime = (!suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                    }
                } else if (!this._initted) {
                    force = true;
                }
            } else {
                this._totalTime = this._time = time;
                if (this._repeat !== 0) {
                    cycleDuration = duration + this._repeatDelay;
                    this._cycle = (this._totalTime / cycleDuration) >> 0;
                    if (this._cycle !== 0)
                        if (this._cycle === this._totalTime / cycleDuration) {
                            this._cycle--;
                        }
                    this._time = this._totalTime - (this._cycle * cycleDuration);
                    if (this._yoyo)
                        if ((this._cycle & 1) !== 0) {
                            this._time = duration - this._time;
                        }
                    if (this._time > duration) {
                        this._time = duration;
                    } else if (this._time < 0) {
                        this._time = 0;
                    }
                }
                if (this._easeType) {
                    r = this._time / duration;
                    type = this._easeType;
                    pow = this._easePower;
                    if (type === 1 || (type === 3 && r >= 0.5)) {
                        r = 1 - r;
                    }
                    if (type === 3) {
                        r *= 2;
                    }
                    if (pow === 1) {
                        r *= r;
                    } else if (pow === 2) {
                        r *= r * r;
                    } else if (pow === 3) {
                        r *= r * r * r;
                    } else if (pow === 4) {
                        r *= r * r * r * r;
                    }
                    if (type === 1) {
                        this.ratio = 1 - r;
                    } else if (type === 2) {
                        this.ratio = r;
                    } else if (this._time / duration < 0.5) {
                        this.ratio = r / 2;
                    } else {
                        this.ratio = 1 - (r / 2);
                    }
                } else {
                    this.ratio = this._ease.getRatio(this._time / duration);
                }
            }
            if (prevTime === this._time && !force && prevCycle === this._cycle) {
                if (prevTotalTime !== this._totalTime)
                    if (this._onUpdate)
                        if (!suppressEvents) {
                            this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                        }
                return;
            } else if (!this._initted) {
                this._init();
                if (!this._initted || this._gc) {
                    return;
                }
                if (this._time && !isComplete) {
                    this.ratio = this._ease.getRatio(this._time / duration);
                } else if (isComplete && this._ease._calcEnd) {
                    this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
                }
            }
            if (!this._active)
                if (!this._paused && this._time !== prevTime && time >= 0) {
                    this._active = true;
                }
            if (prevTotalTime === 0) {
                if (this._startAt) {
                    if (time >= 0) {
                        this._startAt.render(time, suppressEvents, force);
                    } else if (!callback) {
                        callback = "_dummyGS";
                    }
                }
                if (this.vars.onStart)
                    if (this._totalTime !== 0 || duration === 0)
                        if (!suppressEvents) {
                            this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
                        }
            }
            pt = this._firstPT;
            while (pt) {
                if (pt.f) {
                    pt.t[pt.p](pt.c * this.ratio + pt.s);
                } else {
                    pt.t[pt.p] = pt.c * this.ratio + pt.s;
                }
                pt = pt._next;
            }
            if (this._onUpdate) {
                if (time < 0)
                    if (this._startAt && this._startTime) {
                        this._startAt.render(time, suppressEvents, force);
                    }
                if (!suppressEvents)
                    if (this._totalTime !== prevTotalTime || isComplete) {
                        this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                    }
            }
            if (this._cycle !== prevCycle)
                if (!suppressEvents)
                    if (!this._gc)
                        if (this.vars.onRepeat) {
                            this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || _blankArray);
                        }
            if (callback)
                if (!this._gc) {
                    if (time < 0 && this._startAt && !this._onUpdate && this._startTime) {
                        this._startAt.render(time, suppressEvents, force);
                    }
                    if (isComplete) {
                        if (this._timeline.autoRemoveChildren) {
                            this._enabled(false, false);
                        }
                        this._active = false;
                    }
                    if (!suppressEvents && this.vars[callback]) {
                        this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
                    }
                    if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
                        this._rawPrevTime = 0;
                    }
                }
        };
        TweenMax.to = function(target, duration, vars) {
            return new TweenMax(target, duration, vars);
        };
        TweenMax.from = function(target, duration, vars) {
            vars.runBackwards = true;
            vars.immediateRender = (vars.immediateRender != false);
            return new TweenMax(target, duration, vars);
        };
        TweenMax.fromTo = function(target, duration, fromVars, toVars) {
            toVars.startAt = fromVars;
            toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
            return new TweenMax(target, duration, toVars);
        };
        TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            stagger = stagger || 0;
            var delay = vars.delay || 0,
                a = [],
                finalComplete = function() {
                    if (vars.onComplete) {
                        vars.onComplete.apply(vars.onCompleteScope || this, arguments);
                    }
                    onCompleteAll.apply(onCompleteAllScope || this, onCompleteAllParams || _blankArray);
                },
                l, copy, i, p;
            if (!_isArray(targets)) {
                if (typeof(targets) === "string") {
                    targets = TweenLite.selector(targets) || targets;
                }
                if (_isSelector(targets)) {
                    targets = _slice.call(targets, 0);
                }
            }
            l = targets.length;
            for (i = 0; i < l; i++) {
                copy = {};
                for (p in vars) {
                    copy[p] = vars[p];
                }
                copy.delay = delay;
                if (i === l - 1 && onCompleteAll) {
                    copy.onComplete = finalComplete;
                }
                a[i] = new TweenMax(targets[i], duration, copy);
                delay += stagger;
            }
            return a;
        };
        TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            vars.runBackwards = true;
            vars.immediateRender = (vars.immediateRender != false);
            return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            toVars.startAt = fromVars;
            toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
            return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
            return new TweenMax(callback, 0, {
                delay: delay,
                onComplete: callback,
                onCompleteParams: params,
                onCompleteScope: scope,
                onReverseComplete: callback,
                onReverseCompleteParams: params,
                onReverseCompleteScope: scope,
                immediateRender: false,
                useFrames: useFrames,
                overwrite: 0
            });
        };
        TweenMax.set = function(target, vars) {
            return new TweenMax(target, 0, vars);
        };
        TweenMax.isTweening = function(target) {
            return (TweenLite.getTweensOf(target, true).length > 0);
        };
        var _getChildrenOf = function(timeline, includeTimelines) {
                var a = [],
                    cnt = 0,
                    tween = timeline._first;
                while (tween) {
                    if (tween instanceof TweenLite) {
                        a[cnt++] = tween;
                    } else {
                        if (includeTimelines) {
                            a[cnt++] = tween;
                        }
                        a = a.concat(_getChildrenOf(tween, includeTimelines));
                        cnt = a.length;
                    }
                    tween = tween._next;
                }
                return a;
            },
            getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
                return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat(_getChildrenOf(Animation._rootFramesTimeline, includeTimelines));
            };
        TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
            if (tweens == null) {
                tweens = true;
            }
            if (delayedCalls == null) {
                delayedCalls = true;
            }
            var a = getAllTweens((timelines != false)),
                l = a.length,
                allTrue = (tweens && delayedCalls && timelines),
                isDC, tween, i;
            for (i = 0; i < l; i++) {
                tween = a[i];
                if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
                    if (complete) {
                        tween.totalTime(tween.totalDuration());
                    } else {
                        tween._enabled(false, false);
                    }
                }
            }
        };
        TweenMax.killChildTweensOf = function(parent, complete) {
            if (parent == null) {
                return;
            }
            var tl = TweenLite._tweenLookup,
                a, curParent, p, i, l;
            if (typeof(parent) === "string") {
                parent = TweenLite.selector(parent) || parent;
            }
            if (_isSelector(parent)) {
                parent = _slice.call(parent, 0);
            }
            if (_isArray(parent)) {
                i = parent.length;
                while (--i > -1) {
                    TweenMax.killChildTweensOf(parent[i], complete);
                }
                return;
            }
            a = [];
            for (p in tl) {
                curParent = tl[p].target.parentNode;
                while (curParent) {
                    if (curParent === parent) {
                        a = a.concat(tl[p].tweens);
                    }
                    curParent = curParent.parentNode;
                }
            }
            l = a.length;
            for (i = 0; i < l; i++) {
                if (complete) {
                    a[i].totalTime(a[i].totalDuration());
                }
                a[i]._enabled(false, false);
            }
        };
        var _changePause = function(pause, tweens, delayedCalls, timelines) {
            tweens = (tweens !== false);
            delayedCalls = (delayedCalls !== false);
            timelines = (timelines !== false);
            var a = getAllTweens(timelines),
                allTrue = (tweens && delayedCalls && timelines),
                i = a.length,
                isDC, tween;
            while (--i > -1) {
                tween = a[i];
                if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
                    tween.paused(pause);
                }
            }
        };
        TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
            _changePause(true, tweens, delayedCalls, timelines);
        };
        TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
            _changePause(false, tweens, delayedCalls, timelines);
        };
        TweenMax.globalTimeScale = function(value) {
            var tl = Animation._rootTimeline,
                t = TweenLite.ticker.time;
            if (!arguments.length) {
                return tl._timeScale;
            }
            value = value || _tinyNum;
            tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
            tl = Animation._rootFramesTimeline;
            t = TweenLite.ticker.frame;
            tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
            tl._timeScale = Animation._rootTimeline._timeScale = value;
            return value;
        };
        p.progress = function(value) {
            return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), false);
        };
        p.totalProgress = function(value) {
            return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime(this.totalDuration() * value, false);
        };
        p.time = function(value, suppressEvents) {
            if (!arguments.length) {
                return this._time;
            }
            if (this._dirty) {
                this.totalDuration();
            }
            if (value > this._duration) {
                value = this._duration;
            }
            if (this._yoyo && (this._cycle & 1) !== 0) {
                value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
            } else if (this._repeat !== 0) {
                value += this._cycle * (this._duration + this._repeatDelay);
            }
            return this.totalTime(value, suppressEvents);
        };
        p.duration = function(value) {
            if (!arguments.length) {
                return this._duration;
            }
            return Animation.prototype.duration.call(this, value);
        };
        p.totalDuration = function(value) {
            if (!arguments.length) {
                if (this._dirty) {
                    this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
                    this._dirty = false;
                }
                return this._totalDuration;
            }
            return (this._repeat === -1) ? this : this.duration((value - (this._repeat * this._repeatDelay)) / (this._repeat + 1));
        };
        p.repeat = function(value) {
            if (!arguments.length) {
                return this._repeat;
            }
            this._repeat = value;
            return this._uncache(true);
        };
        p.repeatDelay = function(value) {
            if (!arguments.length) {
                return this._repeatDelay;
            }
            this._repeatDelay = value;
            return this._uncache(true);
        };
        p.yoyo = function(value) {
            if (!arguments.length) {
                return this._yoyo;
            }
            this._yoyo = value;
            return this;
        };
        return TweenMax;
    }, true);
    window._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(Animation, SimpleTimeline, TweenLite) {
        var TimelineLite = function(vars) {
                SimpleTimeline.call(this, vars);
                this._labels = {};
                this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
                this.smoothChildTiming = (this.vars.smoothChildTiming === true);
                this._sortChildren = true;
                this._onUpdate = this.vars.onUpdate;
                var v = this.vars,
                    val, p;
                for (p in v) {
                    val = v[p];
                    if (_isArray(val))
                        if (val.join("").indexOf("{self}") !== -1) {
                            v[p] = this._swapSelfInParams(val);
                        }
                }
                if (_isArray(v.tweens)) {
                    this.add(v.tweens, 0, v.align, v.stagger);
                }
            },
            _tinyNum = 0.0000000001,
            _isSelector = TweenLite._internals.isSelector,
            _isArray = TweenLite._internals.isArray,
            _blankArray = [],
            _globals = window._gsDefine.globals,
            _copy = function(vars) {
                var copy = {},
                    p;
                for (p in vars) {
                    copy[p] = vars[p];
                }
                return copy;
            },
            _pauseCallback = function(tween, callback, params, scope) {
                tween._timeline.pause(tween._startTime);
                if (callback) {
                    callback.apply(scope || tween._timeline, params || _blankArray);
                }
            },
            _slice = _blankArray.slice,
            p = TimelineLite.prototype = new SimpleTimeline();
        TimelineLite.version = "1.11.8";
        p.constructor = TimelineLite;
        p.kill()._gc = false;
        p.to = function(target, duration, vars, position) {
            var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(new Engine(target, duration, vars), position) : this.set(target, vars, position);
        };
        p.from = function(target, duration, vars, position) {
            return this.add(((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
        };
        p.fromTo = function(target, duration, fromVars, toVars, position) {
            var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
        };
        p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            var tl = new TimelineLite({
                    onComplete: onCompleteAll,
                    onCompleteParams: onCompleteAllParams,
                    onCompleteScope: onCompleteAllScope,
                    smoothChildTiming: this.smoothChildTiming
                }),
                i;
            if (typeof(targets) === "string") {
                targets = TweenLite.selector(targets) || targets;
            }
            if (_isSelector(targets)) {
                targets = _slice.call(targets, 0);
            }
            stagger = stagger || 0;
            for (i = 0; i < targets.length; i++) {
                if (vars.startAt) {
                    vars.startAt = _copy(vars.startAt);
                }
                tl.to(targets[i], duration, _copy(vars), i * stagger);
            }
            return this.add(tl, position);
        };
        p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            vars.immediateRender = (vars.immediateRender != false);
            vars.runBackwards = true;
            return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            toVars.startAt = fromVars;
            toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
            return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.call = function(callback, params, scope, position) {
            return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
        };
        p.set = function(target, vars, position) {
            position = this._parseTimeOrLabel(position, 0, true);
            if (vars.immediateRender == null) {
                vars.immediateRender = (position === this._time && !this._paused);
            }
            return this.add(new TweenLite(target, 0, vars), position);
        };
        TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
            vars = vars || {};
            if (vars.smoothChildTiming == null) {
                vars.smoothChildTiming = true;
            }
            var tl = new TimelineLite(vars),
                root = tl._timeline,
                tween, next;
            if (ignoreDelayedCalls == null) {
                ignoreDelayedCalls = true;
            }
            root._remove(tl, true);
            tl._startTime = 0;
            tl._rawPrevTime = tl._time = tl._totalTime = root._time;
            tween = root._first;
            while (tween) {
                next = tween._next;
                if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
                    tl.add(tween, tween._startTime - tween._delay);
                }
                tween = next;
            }
            root.add(tl, 0);
            return tl;
        };
        p.add = function(value, position, align, stagger) {
            var curTime, l, i, child, tl, beforeRawTime;
            if (typeof(position) !== "number") {
                position = this._parseTimeOrLabel(position, 0, true, value);
            }
            if (!(value instanceof Animation)) {
                if ((value instanceof Array) || (value && value.push && _isArray(value))) {
                    align = align || "normal";
                    stagger = stagger || 0;
                    curTime = position;
                    l = value.length;
                    for (i = 0; i < l; i++) {
                        if (_isArray(child = value[i])) {
                            child = new TimelineLite({
                                tweens: child
                            });
                        }
                        this.add(child, curTime);
                        if (typeof(child) !== "string" && typeof(child) !== "function") {
                            if (align === "sequence") {
                                curTime = child._startTime + (child.totalDuration() / child._timeScale);
                            } else if (align === "start") {
                                child._startTime -= child.delay();
                            }
                        }
                        curTime += stagger;
                    }
                    return this._uncache(true);
                } else if (typeof(value) === "string") {
                    return this.addLabel(value, position);
                } else if (typeof(value) === "function") {
                    value = TweenLite.delayedCall(0, value);
                } else {
                    throw ("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
                }
            }
            SimpleTimeline.prototype.add.call(this, value, position);
            if (this._gc || this._time === this._duration)
                if (!this._paused)
                    if (this._duration < this.duration()) {
                        tl = this;
                        beforeRawTime = (tl.rawTime() > value._startTime);
                        while (tl._timeline) {
                            if (beforeRawTime && tl._timeline.smoothChildTiming) {
                                tl.totalTime(tl._totalTime, true);
                            } else if (tl._gc) {
                                tl._enabled(true, false);
                            }
                            tl = tl._timeline;
                        }
                    }
            return this;
        };
        p.remove = function(value) {
            if (value instanceof Animation) {
                return this._remove(value, false);
            } else if (value instanceof Array || (value && value.push && _isArray(value))) {
                var i = value.length;
                while (--i > -1) {
                    this.remove(value[i]);
                }
                return this;
            } else if (typeof(value) === "string") {
                return this.removeLabel(value);
            }
            return this.kill(null, value);
        };
        p._remove = function(tween, skipDisable) {
            SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
            var last = this._last;
            if (!last) {
                this._time = this._totalTime = this._duration = this._totalDuration = 0;
            } else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
                this._time = this.duration();
                this._totalTime = this._totalDuration;
            }
            return this;
        };
        p.append = function(value, offsetOrLabel) {
            return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
        };
        p.insert = p.insertMultiple = function(value, position, align, stagger) {
            return this.add(value, position || 0, align, stagger);
        };
        p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
            return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
        };
        p.addLabel = function(label, position) {
            this._labels[label] = this._parseTimeOrLabel(position);
            return this;
        };
        p.addPause = function(position, callback, params, scope) {
            return this.call(_pauseCallback, ["{self}", callback, params, scope], this, position);
        };
        p.removeLabel = function(label) {
            delete this._labels[label];
            return this;
        };
        p.getLabelTime = function(label) {
            return (this._labels[label] != null) ? this._labels[label] : -1;
        };
        p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
            var i;
            if (ignore instanceof Animation && ignore.timeline === this) {
                this.remove(ignore);
            } else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
                i = ignore.length;
                while (--i > -1) {
                    if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
                        this.remove(ignore[i]);
                    }
                }
            }
            if (typeof(offsetOrLabel) === "string") {
                return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
            }
            offsetOrLabel = offsetOrLabel || 0;
            if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) {
                i = timeOrLabel.indexOf("=");
                if (i === -1) {
                    if (this._labels[timeOrLabel] == null) {
                        return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
                    }
                    return this._labels[timeOrLabel] + offsetOrLabel;
                }
                offsetOrLabel = parseInt(timeOrLabel.charAt(i - 1) + "1", 10) * Number(timeOrLabel.substr(i + 1));
                timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i - 1), 0, appendIfAbsent) : this.duration();
            } else if (timeOrLabel == null) {
                timeOrLabel = this.duration();
            }
            return Number(timeOrLabel) + offsetOrLabel;
        };
        p.seek = function(position, suppressEvents) {
            return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
        };
        p.stop = function() {
            return this.paused(true);
        };
        p.gotoAndPlay = function(position, suppressEvents) {
            return this.play(position, suppressEvents);
        };
        p.gotoAndStop = function(position, suppressEvents) {
            return this.pause(position, suppressEvents);
        };
        p.render = function(time, suppressEvents, force) {
            if (this._gc) {
                this._enabled(true, false);
            }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
                prevTime = this._time,
                prevStart = this._startTime,
                prevTimeScale = this._timeScale,
                prevPaused = this._paused,
                tween, isComplete, next, callback, internalForce;
            if (time >= totalDur) {
                this._totalTime = this._time = totalDur;
                if (!this._reversed)
                    if (!this._hasPausedChild()) {
                        isComplete = true;
                        callback = "onComplete";
                        if (this._duration === 0)
                            if (time === 0 || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum)
                                if (this._rawPrevTime !== time && this._first) {
                                    internalForce = true;
                                    if (this._rawPrevTime > _tinyNum) {
                                        callback = "onReverseComplete";
                                    }
                                }
                    }
                this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                time = totalDur + 0.0001;
            } else if (time < 0.0000001) {
                this._totalTime = this._time = 0;
                if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (this._duration === 0)
                        if (this._rawPrevTime >= 0 && this._first) {
                            internalForce = true;
                        }
                    this._rawPrevTime = time;
                } else {
                    this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                    time = 0;
                    if (!this._initted) {
                        internalForce = true;
                    }
                }
            } else {
                this._totalTime = this._time = this._rawPrevTime = time;
            }
            if ((this._time === prevTime || !this._first) && !force && !internalForce) {
                return;
            } else if (!this._initted) {
                this._initted = true;
            }
            if (!this._active)
                if (!this._paused && this._time !== prevTime && time > 0) {
                    this._active = true;
                }
            if (prevTime === 0)
                if (this.vars.onStart)
                    if (this._time !== 0)
                        if (!suppressEvents) {
                            this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
                        }
            if (this._time >= prevTime) {
                tween = this._first;
                while (tween) {
                    next = tween._next;
                    if (this._paused && !prevPaused) {
                        break;
                    } else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        } else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            } else {
                tween = this._last;
                while (tween) {
                    next = tween._prev;
                    if (this._paused && !prevPaused) {
                        break;
                    } else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        } else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            if (this._onUpdate)
                if (!suppressEvents) {
                    this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                }
            if (callback)
                if (!this._gc)
                    if (prevStart === this._startTime || prevTimeScale !== this._timeScale)
                        if (this._time === 0 || totalDur >= this.totalDuration()) {
                            if (isComplete) {
                                if (this._timeline.autoRemoveChildren) {
                                    this._enabled(false, false);
                                }
                                this._active = false;
                            }
                            if (!suppressEvents && this.vars[callback]) {
                                this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
                            }
                        }
        };
        p._hasPausedChild = function() {
            var tween = this._first;
            while (tween) {
                if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
                    return true;
                }
                tween = tween._next;
            }
            return false;
        };
        p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || -9999999999;
            var a = [],
                tween = this._first,
                cnt = 0;
            while (tween) {
                if (tween._startTime < ignoreBeforeTime) {} else if (tween instanceof TweenLite) {
                    if (tweens !== false) {
                        a[cnt++] = tween;
                    }
                } else {
                    if (timelines !== false) {
                        a[cnt++] = tween;
                    }
                    if (nested !== false) {
                        a = a.concat(tween.getChildren(true, tweens, timelines));
                        cnt = a.length;
                    }
                }
                tween = tween._next;
            }
            return a;
        };
        p.getTweensOf = function(target, nested) {
            var tweens = TweenLite.getTweensOf(target),
                i = tweens.length,
                a = [],
                cnt = 0;
            while (--i > -1) {
                if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
                    a[cnt++] = tweens[i];
                }
            }
            return a;
        };
        p._contains = function(tween) {
            var tl = tween.timeline;
            while (tl) {
                if (tl === this) {
                    return true;
                }
                tl = tl.timeline;
            }
            return false;
        };
        p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || 0;
            var tween = this._first,
                labels = this._labels,
                p;
            while (tween) {
                if (tween._startTime >= ignoreBeforeTime) {
                    tween._startTime += amount;
                }
                tween = tween._next;
            }
            if (adjustLabels) {
                for (p in labels) {
                    if (labels[p] >= ignoreBeforeTime) {
                        labels[p] += amount;
                    }
                }
            }
            return this._uncache(true);
        };
        p._kill = function(vars, target) {
            if (!vars && !target) {
                return this._enabled(false, false);
            }
            var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
                i = tweens.length,
                changed = false;
            while (--i > -1) {
                if (tweens[i]._kill(vars, target)) {
                    changed = true;
                }
            }
            return changed;
        };
        p.clear = function(labels) {
            var tweens = this.getChildren(false, true, true),
                i = tweens.length;
            this._time = this._totalTime = 0;
            while (--i > -1) {
                tweens[i]._enabled(false, false);
            }
            if (labels !== false) {
                this._labels = {};
            }
            return this._uncache(true);
        };
        p.invalidate = function() {
            var tween = this._first;
            while (tween) {
                tween.invalidate();
                tween = tween._next;
            }
            return this;
        };
        p._enabled = function(enabled, ignoreTimeline) {
            if (enabled === this._gc) {
                var tween = this._first;
                while (tween) {
                    tween._enabled(enabled, true);
                    tween = tween._next;
                }
            }
            return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
        };
        p.duration = function(value) {
            if (!arguments.length) {
                if (this._dirty) {
                    this.totalDuration();
                }
                return this._duration;
            }
            if (this.duration() !== 0 && value !== 0) {
                this.timeScale(this._duration / value);
            }
            return this;
        };
        p.totalDuration = function(value) {
            if (!arguments.length) {
                if (this._dirty) {
                    var max = 0,
                        tween = this._last,
                        prevStart = 999999999999,
                        prev, end;
                    while (tween) {
                        prev = tween._prev;
                        if (tween._dirty) {
                            tween.totalDuration();
                        }
                        if (tween._startTime > prevStart && this._sortChildren && !tween._paused) {
                            this.add(tween, tween._startTime - tween._delay);
                        } else {
                            prevStart = tween._startTime;
                        }
                        if (tween._startTime < 0 && !tween._paused) {
                            max -= tween._startTime;
                            if (this._timeline.smoothChildTiming) {
                                this._startTime += tween._startTime / this._timeScale;
                            }
                            this.shiftChildren(-tween._startTime, false, -9999999999);
                            prevStart = 0;
                        }
                        end = tween._startTime + (tween._totalDuration / tween._timeScale);
                        if (end > max) {
                            max = end;
                        }
                        tween = prev;
                    }
                    this._duration = this._totalDuration = max;
                    this._dirty = false;
                }
                return this._totalDuration;
            }
            if (this.totalDuration() !== 0)
                if (value !== 0) {
                    this.timeScale(this._totalDuration / value);
                }
            return this;
        };
        p.usesFrames = function() {
            var tl = this._timeline;
            while (tl._timeline) {
                tl = tl._timeline;
            }
            return (tl === Animation._rootFramesTimeline);
        };
        p.rawTime = function() {
            return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
        };
        return TimelineLite;
    }, true);
    window._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(TimelineLite, TweenLite, Ease) {
        var TimelineMax = function(vars) {
                TimelineLite.call(this, vars);
                this._repeat = this.vars.repeat || 0;
                this._repeatDelay = this.vars.repeatDelay || 0;
                this._cycle = 0;
                this._yoyo = (this.vars.yoyo === true);
                this._dirty = true;
            },
            _tinyNum = 0.0000000001,
            _blankArray = [],
            _easeNone = new Ease(null, null, 1, 0),
            p = TimelineMax.prototype = new TimelineLite();
        p.constructor = TimelineMax;
        p.kill()._gc = false;
        TimelineMax.version = "1.11.8";
        p.invalidate = function() {
            this._yoyo = (this.vars.yoyo === true);
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._uncache(true);
            return TimelineLite.prototype.invalidate.call(this);
        };
        p.addCallback = function(callback, position, params, scope) {
            return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
        };
        p.removeCallback = function(callback, position) {
            if (callback) {
                if (position == null) {
                    this._kill(null, callback);
                } else {
                    var a = this.getTweensOf(callback, false),
                        i = a.length,
                        time = this._parseTimeOrLabel(position);
                    while (--i > -1) {
                        if (a[i]._startTime === time) {
                            a[i]._enabled(false, false);
                        }
                    }
                }
            }
            return this;
        };
        p.tweenTo = function(position, vars) {
            vars = vars || {};
            var copy = {
                    ease: _easeNone,
                    overwrite: (vars.delay ? 2 : 1),
                    useFrames: this.usesFrames(),
                    immediateRender: false
                },
                duration, p, t;
            for (p in vars) {
                copy[p] = vars[p];
            }
            copy.time = this._parseTimeOrLabel(position);
            duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
            t = new TweenLite(this, duration, copy);
            copy.onStart = function() {
                t.target.paused(true);
                if (t.vars.time !== t.target.time() && duration === t.duration()) {
                    t.duration(Math.abs(t.vars.time - t.target.time()) / t.target._timeScale);
                }
                if (vars.onStart) {
                    vars.onStart.apply(vars.onStartScope || t, vars.onStartParams || _blankArray);
                }
            };
            return t;
        };
        p.tweenFromTo = function(fromPosition, toPosition, vars) {
            vars = vars || {};
            fromPosition = this._parseTimeOrLabel(fromPosition);
            vars.startAt = {
                onComplete: this.seek,
                onCompleteParams: [fromPosition],
                onCompleteScope: this
            };
            vars.immediateRender = (vars.immediateRender !== false);
            var t = this.tweenTo(toPosition, vars);
            return t.duration((Math.abs(t.vars.time - fromPosition) / this._timeScale) || 0.001);
        };
        p.render = function(time, suppressEvents, force) {
            if (this._gc) {
                this._enabled(true, false);
            }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
                dur = this._duration,
                prevTime = this._time,
                prevTotalTime = this._totalTime,
                prevStart = this._startTime,
                prevTimeScale = this._timeScale,
                prevRawPrevTime = this._rawPrevTime,
                prevPaused = this._paused,
                prevCycle = this._cycle,
                tween, isComplete, next, callback, internalForce, cycleDuration;
            if (time >= totalDur) {
                if (!this._locked) {
                    this._totalTime = totalDur;
                    this._cycle = this._repeat;
                }
                if (!this._reversed)
                    if (!this._hasPausedChild()) {
                        isComplete = true;
                        callback = "onComplete";
                        if (this._duration === 0)
                            if (time === 0 || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum)
                                if (prevRawPrevTime !== time && this._first) {
                                    internalForce = true;
                                    if (prevRawPrevTime > _tinyNum) {
                                        callback = "onReverseComplete";
                                    }
                                }
                    }
                this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                if (this._yoyo && (this._cycle & 1) !== 0) {
                    this._time = time = 0;
                } else {
                    this._time = dur;
                    time = dur + 0.0001;
                }
            } else if (time < 0.0000001) {
                if (!this._locked) {
                    this._totalTime = this._cycle = 0;
                }
                this._time = 0;
                if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (dur === 0)
                        if (prevRawPrevTime >= 0 && this._first) {
                            internalForce = true;
                        }
                    this._rawPrevTime = time;
                } else {
                    this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                    time = 0;
                    if (!this._initted) {
                        internalForce = true;
                    }
                }
            } else {
                if (dur === 0 && prevRawPrevTime < 0) {
                    internalForce = true;
                }
                this._time = this._rawPrevTime = time;
                if (!this._locked) {
                    this._totalTime = time;
                    if (this._repeat !== 0) {
                        cycleDuration = dur + this._repeatDelay;
                        this._cycle = (this._totalTime / cycleDuration) >> 0;
                        if (this._cycle !== 0)
                            if (this._cycle === this._totalTime / cycleDuration) {
                                this._cycle--;
                            }
                        this._time = this._totalTime - (this._cycle * cycleDuration);
                        if (this._yoyo)
                            if ((this._cycle & 1) !== 0) {
                                this._time = dur - this._time;
                            }
                        if (this._time > dur) {
                            this._time = dur;
                            time = dur + 0.0001;
                        } else if (this._time < 0) {
                            this._time = time = 0;
                        } else {
                            time = this._time;
                        }
                    }
                }
            }
            if (this._cycle !== prevCycle)
                if (!this._locked) {
                    var backwards = (this._yoyo && (prevCycle & 1) !== 0),
                        wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
                        recTotalTime = this._totalTime,
                        recCycle = this._cycle,
                        recRawPrevTime = this._rawPrevTime,
                        recTime = this._time;
                    this._totalTime = prevCycle * dur;
                    if (this._cycle < prevCycle) {
                        backwards = !backwards;
                    } else {
                        this._totalTime += dur;
                    }
                    this._time = prevTime;
                    this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
                    this._cycle = prevCycle;
                    this._locked = true;
                    prevTime = (backwards) ? 0 : dur;
                    this.render(prevTime, suppressEvents, (dur === 0));
                    if (!suppressEvents)
                        if (!this._gc) {
                            if (this.vars.onRepeat) {
                                this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || _blankArray);
                            }
                        }
                    if (wrap) {
                        prevTime = (backwards) ? dur + 0.0001 : -0.0001;
                        this.render(prevTime, true, false);
                    }
                    this._locked = false;
                    if (this._paused && !prevPaused) {
                        return;
                    }
                    this._time = recTime;
                    this._totalTime = recTotalTime;
                    this._cycle = recCycle;
                    this._rawPrevTime = recRawPrevTime;
                }
            if ((this._time === prevTime || !this._first) && !force && !internalForce) {
                if (prevTotalTime !== this._totalTime)
                    if (this._onUpdate)
                        if (!suppressEvents) {
                            this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                        }
                return;
            } else if (!this._initted) {
                this._initted = true;
            }
            if (!this._active)
                if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
                    this._active = true;
                }
            if (prevTotalTime === 0)
                if (this.vars.onStart)
                    if (this._totalTime !== 0)
                        if (!suppressEvents) {
                            this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
                        }
            if (this._time >= prevTime) {
                tween = this._first;
                while (tween) {
                    next = tween._next;
                    if (this._paused && !prevPaused) {
                        break;
                    } else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        } else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            } else {
                tween = this._last;
                while (tween) {
                    next = tween._prev;
                    if (this._paused && !prevPaused) {
                        break;
                    } else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        } else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            if (this._onUpdate)
                if (!suppressEvents) {
                    this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                }
            if (callback)
                if (!this._locked)
                    if (!this._gc)
                        if (prevStart === this._startTime || prevTimeScale !== this._timeScale)
                            if (this._time === 0 || totalDur >= this.totalDuration()) {
                                if (isComplete) {
                                    if (this._timeline.autoRemoveChildren) {
                                        this._enabled(false, false);
                                    }
                                    this._active = false;
                                }
                                if (!suppressEvents && this.vars[callback]) {
                                    this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
                                }
                            }
        };
        p.getActive = function(nested, tweens, timelines) {
            if (nested == null) {
                nested = true;
            }
            if (tweens == null) {
                tweens = true;
            }
            if (timelines == null) {
                timelines = false;
            }
            var a = [],
                all = this.getChildren(nested, tweens, timelines),
                cnt = 0,
                l = all.length,
                i, tween;
            for (i = 0; i < l; i++) {
                tween = all[i];
                if (tween.isActive()) {
                    a[cnt++] = tween;
                }
            }
            return a;
        };
        p.getLabelAfter = function(time) {
            if (!time)
                if (time !== 0) {
                    time = this._time;
                }
            var labels = this.getLabelsArray(),
                l = labels.length,
                i;
            for (i = 0; i < l; i++) {
                if (labels[i].time > time) {
                    return labels[i].name;
                }
            }
            return null;
        };
        p.getLabelBefore = function(time) {
            if (time == null) {
                time = this._time;
            }
            var labels = this.getLabelsArray(),
                i = labels.length;
            while (--i > -1) {
                if (labels[i].time < time) {
                    return labels[i].name;
                }
            }
            return null;
        };
        p.getLabelsArray = function() {
            var a = [],
                cnt = 0,
                p;
            for (p in this._labels) {
                a[cnt++] = {
                    time: this._labels[p],
                    name: p
                };
            }
            a.sort(function(a, b) {
                return a.time - b.time;
            });
            return a;
        };
        p.progress = function(value) {
            return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), false);
        };
        p.totalProgress = function(value) {
            return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime(this.totalDuration() * value, false);
        };
        p.totalDuration = function(value) {
            if (!arguments.length) {
                if (this._dirty) {
                    TimelineLite.prototype.totalDuration.call(this);
                    this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
                }
                return this._totalDuration;
            }
            return (this._repeat === -1) ? this : this.duration((value - (this._repeat * this._repeatDelay)) / (this._repeat + 1));
        };
        p.time = function(value, suppressEvents) {
            if (!arguments.length) {
                return this._time;
            }
            if (this._dirty) {
                this.totalDuration();
            }
            if (value > this._duration) {
                value = this._duration;
            }
            if (this._yoyo && (this._cycle & 1) !== 0) {
                value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
            } else if (this._repeat !== 0) {
                value += this._cycle * (this._duration + this._repeatDelay);
            }
            return this.totalTime(value, suppressEvents);
        };
        p.repeat = function(value) {
            if (!arguments.length) {
                return this._repeat;
            }
            this._repeat = value;
            return this._uncache(true);
        };
        p.repeatDelay = function(value) {
            if (!arguments.length) {
                return this._repeatDelay;
            }
            this._repeatDelay = value;
            return this._uncache(true);
        };
        p.yoyo = function(value) {
            if (!arguments.length) {
                return this._yoyo;
            }
            this._yoyo = value;
            return this;
        };
        p.currentLabel = function(value) {
            if (!arguments.length) {
                return this.getLabelBefore(this._time + 0.00000001);
            }
            return this.seek(value, true);
        };
        return TimelineMax;
    }, true);
    (function() {
        var _RAD2DEG = 180 / Math.PI,
            _r1 = [],
            _r2 = [],
            _r3 = [],
            _corProps = {},
            Segment = function(a, b, c, d) {
                this.a = a;
                this.b = b;
                this.c = c;
                this.d = d;
                this.da = d - a;
                this.ca = c - a;
                this.ba = b - a;
            },
            _correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
            cubicToQuadratic = function(a, b, c, d) {
                var q1 = {
                        a: a
                    },
                    q2 = {},
                    q3 = {},
                    q4 = {
                        c: d
                    },
                    mab = (a + b) / 2,
                    mbc = (b + c) / 2,
                    mcd = (c + d) / 2,
                    mabc = (mab + mbc) / 2,
                    mbcd = (mbc + mcd) / 2,
                    m8 = (mbcd - mabc) / 8;
                q1.b = mab + (a - mab) / 4;
                q2.b = mabc + m8;
                q1.c = q2.a = (q1.b + q2.b) / 2;
                q2.c = q3.a = (mabc + mbcd) / 2;
                q3.b = mbcd - m8;
                q4.b = mcd + (d - mcd) / 4;
                q3.c = q4.a = (q3.b + q4.b) / 2;
                return [q1, q2, q3, q4];
            },
            _calculateControlPoints = function(a, curviness, quad, basic, correlate) {
                var l = a.length - 1,
                    ii = 0,
                    cp1 = a[0].a,
                    i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
                for (i = 0; i < l; i++) {
                    seg = a[ii];
                    p1 = seg.a;
                    p2 = seg.d;
                    p3 = a[ii + 1].d;
                    if (correlate) {
                        r1 = _r1[i];
                        r2 = _r2[i];
                        tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
                        m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
                        m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
                        mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
                    } else {
                        m1 = p2 - (p2 - p1) * curviness * 0.5;
                        m2 = p2 + (p3 - p2) * curviness * 0.5;
                        mm = p2 - (m1 + m2) / 2;
                    }
                    m1 += mm;
                    m2 += mm;
                    seg.c = cp2 = m1;
                    if (i !== 0) {
                        seg.b = cp1;
                    } else {
                        seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6;
                    }
                    seg.da = p2 - p1;
                    seg.ca = cp2 - p1;
                    seg.ba = cp1 - p1;
                    if (quad) {
                        qb = cubicToQuadratic(p1, cp1, cp2, p2);
                        a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
                        ii += 4;
                    } else {
                        ii++;
                    }
                    cp1 = m2;
                }
                seg = a[ii];
                seg.b = cp1;
                seg.c = cp1 + (seg.d - cp1) * 0.4;
                seg.da = seg.d - seg.a;
                seg.ca = seg.c - seg.a;
                seg.ba = cp1 - seg.a;
                if (quad) {
                    qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
                    a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
                }
            },
            _parseAnchors = function(values, p, correlate, prepend) {
                var a = [],
                    l, i, p1, p2, p3, tmp;
                if (prepend) {
                    values = [prepend].concat(values);
                    i = values.length;
                    while (--i > -1) {
                        if (typeof((tmp = values[i][p])) === "string")
                            if (tmp.charAt(1) === "=") {
                                values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2));
                            }
                    }
                }
                l = values.length - 2;
                if (l < 0) {
                    a[0] = new Segment(values[0][p], 0, 0, values[(l < -1) ? 0 : 1][p]);
                    return a;
                }
                for (i = 0; i < l; i++) {
                    p1 = values[i][p];
                    p2 = values[i + 1][p];
                    a[i] = new Segment(p1, 0, 0, p2);
                    if (correlate) {
                        p3 = values[i + 2][p];
                        _r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
                        _r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
                    }
                }
                a[i] = new Segment(values[i][p], 0, 0, values[i + 1][p]);
                return a;
            },
            bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
                var obj = {},
                    props = [],
                    first = prepend || values[0],
                    i, p, a, j, r, l, seamless, last;
                correlate = (typeof(correlate) === "string") ? "," + correlate + "," : _correlate;
                if (curviness == null) {
                    curviness = 1;
                }
                for (p in values[0]) {
                    props.push(p);
                }
                if (values.length > 1) {
                    last = values[values.length - 1];
                    seamless = true;
                    i = props.length;
                    while (--i > -1) {
                        p = props[i];
                        if (Math.abs(first[p] - last[p]) > 0.05) {
                            seamless = false;
                            break;
                        }
                    }
                    if (seamless) {
                        values = values.concat();
                        if (prepend) {
                            values.unshift(prepend);
                        }
                        values.push(values[1]);
                        prepend = values[values.length - 3];
                    }
                }
                _r1.length = _r2.length = _r3.length = 0;
                i = props.length;
                while (--i > -1) {
                    p = props[i];
                    _corProps[p] = (correlate.indexOf("," + p + ",") !== -1);
                    obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
                }
                i = _r1.length;
                while (--i > -1) {
                    _r1[i] = Math.sqrt(_r1[i]);
                    _r2[i] = Math.sqrt(_r2[i]);
                }
                if (!basic) {
                    i = props.length;
                    while (--i > -1) {
                        if (_corProps[p]) {
                            a = obj[props[i]];
                            l = a.length - 1;
                            for (j = 0; j < l; j++) {
                                r = a[j + 1].da / _r2[j] + a[j].da / _r1[j];
                                _r3[j] = (_r3[j] || 0) + r * r;
                            }
                        }
                    }
                    i = _r3.length;
                    while (--i > -1) {
                        _r3[i] = Math.sqrt(_r3[i]);
                    }
                }
                i = props.length;
                j = quadratic ? 4 : 1;
                while (--i > -1) {
                    p = props[i];
                    a = obj[p];
                    _calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]);
                    if (seamless) {
                        a.splice(0, j);
                        a.splice(a.length - j, j);
                    }
                }
                return obj;
            },
            _parseBezierData = function(values, type, prepend) {
                type = type || "soft";
                var obj = {},
                    inc = (type === "cubic") ? 3 : 2,
                    soft = (type === "soft"),
                    props = [],
                    a, b, c, d, cur, i, j, l, p, cnt, tmp;
                if (soft && prepend) {
                    values = [prepend].concat(values);
                }
                if (values == null || values.length < inc + 1) {
                    throw "invalid Bezier data";
                }
                for (p in values[0]) {
                    props.push(p);
                }
                i = props.length;
                while (--i > -1) {
                    p = props[i];
                    obj[p] = cur = [];
                    cnt = 0;
                    l = values.length;
                    for (j = 0; j < l; j++) {
                        a = (prepend == null) ? values[j][p] : (typeof((tmp = values[j][p])) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
                        if (soft)
                            if (j > 1)
                                if (j < l - 1) {
                                    cur[cnt++] = (a + cur[cnt - 2]) / 2;
                                }
                        cur[cnt++] = a;
                    }
                    l = cnt - inc + 1;
                    cnt = 0;
                    for (j = 0; j < l; j += inc) {
                        a = cur[j];
                        b = cur[j + 1];
                        c = cur[j + 2];
                        d = (inc === 2) ? 0 : cur[j + 3];
                        cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
                    }
                    cur.length = cnt;
                }
                return obj;
            },
            _addCubicLengths = function(a, steps, resolution) {
                var inc = 1 / resolution,
                    j = a.length,
                    d, d1, s, da, ca, ba, p, i, inv, bez, index;
                while (--j > -1) {
                    bez = a[j];
                    s = bez.a;
                    da = bez.d - s;
                    ca = bez.c - s;
                    ba = bez.b - s;
                    d = d1 = 0;
                    for (i = 1; i <= resolution; i++) {
                        p = inc * i;
                        inv = 1 - p;
                        d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
                        index = j * resolution + i - 1;
                        steps[index] = (steps[index] || 0) + d * d;
                    }
                }
            },
            _parseLengthData = function(obj, resolution) {
                resolution = resolution >> 0 || 6;
                var a = [],
                    lengths = [],
                    d = 0,
                    total = 0,
                    threshold = resolution - 1,
                    segments = [],
                    curLS = [],
                    p, i, l, index;
                for (p in obj) {
                    _addCubicLengths(obj[p], a, resolution);
                }
                l = a.length;
                for (i = 0; i < l; i++) {
                    d += Math.sqrt(a[i]);
                    index = i % resolution;
                    curLS[index] = d;
                    if (index === threshold) {
                        total += d;
                        index = (i / resolution) >> 0;
                        segments[index] = curLS;
                        lengths[index] = total;
                        d = 0;
                        curLS = [];
                    }
                }
                return {
                    length: total,
                    lengths: lengths,
                    segments: segments
                };
            },
            BezierPlugin = window._gsDefine.plugin({
                propName: "bezier",
                priority: -1,
                version: "1.3.2",
                API: 2,
                global: true,
                init: function(target, vars, tween) {
                    this._target = target;
                    if (vars instanceof Array) {
                        vars = {
                            values: vars
                        };
                    }
                    this._func = {};
                    this._round = {};
                    this._props = [];
                    this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
                    var values = vars.values || [],
                        first = {},
                        second = values[0],
                        autoRotate = vars.autoRotate || tween.vars.orientToBezier,
                        p, isFunc, i, j, prepend;
                    this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [
                        ["x", "y", "rotation", ((autoRotate === true) ? 0 : Number(autoRotate) || 0)]
                    ] : null;
                    for (p in second) {
                        this._props.push(p);
                    }
                    i = this._props.length;
                    while (--i > -1) {
                        p = this._props[i];
                        this._overwriteProps.push(p);
                        isFunc = this._func[p] = (typeof(target[p]) === "function");
                        first[p] = (!isFunc) ? parseFloat(target[p]) : target[((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3))]();
                        if (!prepend)
                            if (first[p] !== values[0][p]) {
                                prepend = first;
                            }
                    }
                    this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
                    this._segCount = this._beziers[p].length;
                    if (this._timeRes) {
                        var ld = _parseLengthData(this._beziers, this._timeRes);
                        this._length = ld.length;
                        this._lengths = ld.lengths;
                        this._segments = ld.segments;
                        this._l1 = this._li = this._s1 = this._si = 0;
                        this._l2 = this._lengths[0];
                        this._curSeg = this._segments[0];
                        this._s2 = this._curSeg[0];
                        this._prec = 1 / this._curSeg.length;
                    }
                    if ((autoRotate = this._autoRotate)) {
                        this._initialRotations = [];
                        if (!(autoRotate[0] instanceof Array)) {
                            this._autoRotate = autoRotate = [autoRotate];
                        }
                        i = autoRotate.length;
                        while (--i > -1) {
                            for (j = 0; j < 3; j++) {
                                p = autoRotate[i][j];
                                this._func[p] = (typeof(target[p]) === "function") ? target[((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3))] : false;
                            }
                            p = autoRotate[i][2];
                            this._initialRotations[i] = this._func[p] ? this._func[p].call(this._target) : this._target[p];
                        }
                    }
                    this._startRatio = tween.vars.runBackwards ? 1 : 0;
                    return true;
                },
                set: function(v) {
                    var segments = this._segCount,
                        func = this._func,
                        target = this._target,
                        notStart = (v !== this._startRatio),
                        curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
                    if (!this._timeRes) {
                        curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
                        t = (v - (curIndex * (1 / segments))) * segments;
                    } else {
                        lengths = this._lengths;
                        curSeg = this._curSeg;
                        v *= this._length;
                        i = this._li;
                        if (v > this._l2 && i < segments - 1) {
                            l = segments - 1;
                            while (i < l && (this._l2 = lengths[++i]) <= v) {}
                            this._l1 = lengths[i - 1];
                            this._li = i;
                            this._curSeg = curSeg = this._segments[i];
                            this._s2 = curSeg[(this._s1 = this._si = 0)];
                        } else if (v < this._l1 && i > 0) {
                            while (i > 0 && (this._l1 = lengths[--i]) >= v) {}
                            if (i === 0 && v < this._l1) {
                                this._l1 = 0;
                            } else {
                                i++;
                            }
                            this._l2 = lengths[i];
                            this._li = i;
                            this._curSeg = curSeg = this._segments[i];
                            this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
                            this._s2 = curSeg[this._si];
                        }
                        curIndex = i;
                        v -= this._l1;
                        i = this._si;
                        if (v > this._s2 && i < curSeg.length - 1) {
                            l = curSeg.length - 1;
                            while (i < l && (this._s2 = curSeg[++i]) <= v) {}
                            this._s1 = curSeg[i - 1];
                            this._si = i;
                        } else if (v < this._s1 && i > 0) {
                            while (i > 0 && (this._s1 = curSeg[--i]) >= v) {}
                            if (i === 0 && v < this._s1) {
                                this._s1 = 0;
                            } else {
                                i++;
                            }
                            this._s2 = curSeg[i];
                            this._si = i;
                        }
                        t = (i + (v - this._s1) / (this._s2 - this._s1)) * this._prec;
                    }
                    inv = 1 - t;
                    i = this._props.length;
                    while (--i > -1) {
                        p = this._props[i];
                        b = this._beziers[p][curIndex];
                        val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
                        if (this._round[p]) {
                            val = Math.round(val);
                        }
                        if (func[p]) {
                            target[p](val);
                        } else {
                            target[p] = val;
                        }
                    }
                    if (this._autoRotate) {
                        var ar = this._autoRotate,
                            b2, x1, y1, x2, y2, add, conv;
                        i = ar.length;
                        while (--i > -1) {
                            p = ar[i][2];
                            add = ar[i][3] || 0;
                            conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
                            b = this._beziers[ar[i][0]];
                            b2 = this._beziers[ar[i][1]];
                            if (b && b2) {
                                b = b[curIndex];
                                b2 = b2[curIndex];
                                x1 = b.a + (b.b - b.a) * t;
                                x2 = b.b + (b.c - b.b) * t;
                                x1 += (x2 - x1) * t;
                                x2 += ((b.c + (b.d - b.c) * t) - x2) * t;
                                y1 = b2.a + (b2.b - b2.a) * t;
                                y2 = b2.b + (b2.c - b2.b) * t;
                                y1 += (y2 - y1) * t;
                                y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;
                                val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];
                                if (func[p]) {
                                    target[p](val);
                                } else {
                                    target[p] = val;
                                }
                            }
                        }
                    }
                }
            }),
            p = BezierPlugin.prototype;
        BezierPlugin.bezierThrough = bezierThrough;
        BezierPlugin.cubicToQuadratic = cubicToQuadratic;
        BezierPlugin._autoCSS = true;
        BezierPlugin.quadraticToCubic = function(a, b, c) {
            return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
        };
        BezierPlugin._cssRegister = function() {
            var CSSPlugin = window._gsDefine.globals.CSSPlugin;
            if (!CSSPlugin) {
                return;
            }
            var _internals = CSSPlugin._internals,
                _parseToProxy = _internals._parseToProxy,
                _setPluginRatio = _internals._setPluginRatio,
                CSSPropTween = _internals.CSSPropTween;
            _internals._registerComplexSpecialProp("bezier", {
                parser: function(t, e, prop, cssp, pt, plugin) {
                    if (e instanceof Array) {
                        e = {
                            values: e
                        };
                    }
                    plugin = new BezierPlugin();
                    var values = e.values,
                        l = values.length - 1,
                        pluginValues = [],
                        v = {},
                        i, p, data;
                    if (l < 0) {
                        return pt;
                    }
                    for (i = 0; i <= l; i++) {
                        data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
                        pluginValues[i] = data.end;
                    }
                    for (p in e) {
                        v[p] = e[p];
                    }
                    v.values = pluginValues;
                    pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
                    pt.data = data;
                    pt.plugin = plugin;
                    pt.setRatio = _setPluginRatio;
                    if (v.autoRotate === 0) {
                        v.autoRotate = true;
                    }
                    if (v.autoRotate && !(v.autoRotate instanceof Array)) {
                        i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
                        v.autoRotate = (data.end.left != null) ? [
                            ["left", "top", "rotation", i, false]
                        ] : (data.end.x != null) ? [
                            ["x", "y", "rotation", i, false]
                        ] : false;
                    }
                    if (v.autoRotate) {
                        if (!cssp._transform) {
                            cssp._enableTransforms(false);
                        }
                        data.autoRotate = cssp._target._gsTransform;
                    }
                    plugin._onInitTween(data.proxy, v, cssp._tween);
                    return pt;
                }
            });
        };
        p._roundProps = function(lookup, value) {
            var op = this._overwriteProps,
                i = op.length;
            while (--i > -1) {
                if (lookup[op[i]] || lookup.bezier || lookup.bezierThrough) {
                    this._round[op[i]] = value;
                }
            }
        };
        p._kill = function(lookup) {
            var a = this._props,
                p, i;
            for (p in this._beziers) {
                if (p in lookup) {
                    delete this._beziers[p];
                    delete this._func[p];
                    i = a.length;
                    while (--i > -1) {
                        if (a[i] === p) {
                            a.splice(i, 1);
                        }
                    }
                }
            }
            return this._super._kill.call(this, lookup);
        };
    }());
    window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(TweenPlugin, TweenLite) {
        var CSSPlugin = function() {
                TweenPlugin.call(this, "css");
                this._overwriteProps.length = 0;
                this.setRatio = CSSPlugin.prototype.setRatio;
            },
            _hasPriority, _suffixMap, _cs, _overwriteProps, _specialProps = {},
            p = CSSPlugin.prototype = new TweenPlugin("css");
        p.constructor = CSSPlugin;
        CSSPlugin.version = "1.11.8";
        CSSPlugin.API = 2;
        CSSPlugin.defaultTransformPerspective = 0;
        CSSPlugin.defaultSkewType = "compensated";
        p = "px";
        CSSPlugin.suffixMap = {
            top: p,
            right: p,
            bottom: p,
            left: p,
            width: p,
            height: p,
            fontSize: p,
            padding: p,
            margin: p,
            perspective: p,
            lineHeight: ""
        };
        var _numExp = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
            _relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
            _valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
            _NaNExp = /[^\d\-\.]/g,
            _suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
            _opacityExp = /opacity *= *([^)]*)/,
            _opacityValExp = /opacity:([^;]*)/,
            _alphaFilterExp = /alpha\(opacity *=.+?\)/i,
            _rgbhslExp = /^(rgb|hsl)/,
            _capsExp = /([A-Z])/g,
            _camelExp = /-([a-z])/gi,
            _urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
            _camelFunc = function(s, g) {
                return g.toUpperCase();
            },
            _horizExp = /(?:Left|Right|Width)/i,
            _ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
            _ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
            _commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi,
            _DEG2RAD = Math.PI / 180,
            _RAD2DEG = 180 / Math.PI,
            _forcePT = {},
            _doc = document,
            _tempDiv = _doc.createElement("div"),
            _tempImg = _doc.createElement("img"),
            _internals = CSSPlugin._internals = {
                _specialProps: _specialProps
            },
            _agent = navigator.userAgent,
            _autoRound, _reqSafariFix, _isSafari, _isFirefox, _isSafariLT6, _ieVers, _supportsOpacity = (function() {
                var i = _agent.indexOf("Android"),
                    d = _doc.createElement("div"),
                    a;
                _isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i + 8, 1)) > 3));
                _isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/") + 8, 1)) < 6));
                _isFirefox = (_agent.indexOf("Firefox") !== -1);
                if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
                    _ieVers = parseFloat(RegExp.$1);
                }
                d.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>";
                a = d.getElementsByTagName("a")[0];
                return a ? /^0.55/.test(a.style.opacity) : false;
            }()),
            _getIEOpacity = function(v) {
                return (_opacityExp.test(((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "")) ? (parseFloat(RegExp.$1) / 100) : 1);
            },
            _log = function(s) {
                if (window.console) {
                    console.log(s);
                }
            },
            _prefixCSS = "",
            _prefix = "",
            _checkPropPrefix = function(p, e) {
                e = e || _tempDiv;
                var s = e.style,
                    a, i;
                if (s[p] !== undefined) {
                    return p;
                }
                p = p.charAt(0).toUpperCase() + p.substr(1);
                a = ["O", "Moz", "ms", "Ms", "Webkit"];
                i = 5;
                while (--i > -1 && s[a[i] + p] === undefined) {}
                if (i >= 0) {
                    _prefix = (i === 3) ? "ms" : a[i];
                    _prefixCSS = "-" + _prefix.toLowerCase() + "-";
                    return _prefix + p;
                }
                return null;
            },
            _getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},
            _getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
                var rv;
                if (!_supportsOpacity)
                    if (p === "opacity") {
                        return _getIEOpacity(t);
                    }
                if (!calc && t.style[p]) {
                    rv = t.style[p];
                } else if ((cs = cs || _getComputedStyle(t, null))) {
                    rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
                } else if (t.currentStyle) {
                    rv = t.currentStyle[p];
                }
                return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
            },
            _convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
                if (sfx === "px" || !sfx) {
                    return v;
                }
                if (sfx === "auto" || !v) {
                    return 0;
                }
                var horiz = _horizExp.test(p),
                    node = t,
                    style = _tempDiv.style,
                    neg = (v < 0),
                    pix, cache, time;
                if (neg) {
                    v = -v;
                }
                if (sfx === "%" && p.indexOf("border") !== -1) {
                    pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
                } else {
                    style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
                    if (sfx === "%" || !node.appendChild) {
                        node = t.parentNode || _doc.body;
                        cache = node._gsCache;
                        time = TweenLite.ticker.frame;
                        if (cache && horiz && cache.time === time) {
                            return cache.width * v / 100;
                        }
                        style[(horiz ? "width" : "height")] = v + sfx;
                    } else {
                        style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
                    }
                    node.appendChild(_tempDiv);
                    pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
                    node.removeChild(_tempDiv);
                    if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
                        cache = node._gsCache = node._gsCache || {};
                        cache.time = time;
                        cache.width = pix / v * 100;
                    }
                    if (pix === 0 && !recurse) {
                        pix = _convertToPixels(t, p, v, sfx, true);
                    }
                }
                return neg ? -pix : pix;
            },
            _calculateOffset = _internals.calculateOffset = function(t, p, cs) {
                if (_getStyle(t, "position", cs) !== "absolute") {
                    return 0;
                }
                var dim = ((p === "left") ? "Left" : "Top"),
                    v = _getStyle(t, "margin" + dim, cs);
                return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
            },
            _getAllStyles = function(t, cs) {
                var s = {},
                    i, tr;
                if ((cs = cs || _getComputedStyle(t, null))) {
                    if ((i = cs.length)) {
                        while (--i > -1) {
                            s[cs[i].replace(_camelExp, _camelFunc)] = cs.getPropertyValue(cs[i]);
                        }
                    } else {
                        for (i in cs) {
                            s[i] = cs[i];
                        }
                    }
                } else if ((cs = t.currentStyle || t.style)) {
                    for (i in cs) {
                        if (typeof(i) === "string" && s[i] === undefined) {
                            s[i.replace(_camelExp, _camelFunc)] = cs[i];
                        }
                    }
                }
                if (!_supportsOpacity) {
                    s.opacity = _getIEOpacity(t);
                }
                tr = _getTransform(t, cs, false);
                s.rotation = tr.rotation;
                s.skewX = tr.skewX;
                s.scaleX = tr.scaleX;
                s.scaleY = tr.scaleY;
                s.x = tr.x;
                s.y = tr.y;
                if (_supports3D) {
                    s.z = tr.z;
                    s.rotationX = tr.rotationX;
                    s.rotationY = tr.rotationY;
                    s.scaleZ = tr.scaleZ;
                }
                if (s.filters) {
                    delete s.filters;
                }
                return s;
            },
            _cssDif = function(t, s1, s2, vars, forceLookup) {
                var difs = {},
                    style = t.style,
                    val, p, mpt;
                for (p in s2) {
                    if (p !== "cssText")
                        if (p !== "length")
                            if (isNaN(p))
                                if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p]))
                                    if (p.indexOf("Origin") === -1)
                                        if (typeof(val) === "number" || typeof(val) === "string") {
                                            difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val;
                                            if (style[p] !== undefined) {
                                                mpt = new MiniPropTween(style, p, style[p], mpt);
                                            }
                                        }
                }
                if (vars) {
                    for (p in vars) {
                        if (p !== "className") {
                            difs[p] = vars[p];
                        }
                    }
                }
                return {
                    difs: difs,
                    firstMPT: mpt
                };
            },
            _dimensions = {
                width: ["Left", "Right"],
                height: ["Top", "Bottom"]
            },
            _margins = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
            _getDimension = function(t, p, cs) {
                var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
                    a = _dimensions[p],
                    i = a.length;
                cs = cs || _getComputedStyle(t, null);
                while (--i > -1) {
                    v -= parseFloat(_getStyle(t, "padding" + a[i], cs, true)) || 0;
                    v -= parseFloat(_getStyle(t, "border" + a[i] + "Width", cs, true)) || 0;
                }
                return v;
            },
            _parsePosition = function(v, recObj) {
                if (v == null || v === "" || v === "auto" || v === "auto auto") {
                    v = "0 0";
                }
                var a = v.split(" "),
                    x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
                    y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
                if (y == null) {
                    y = "0";
                } else if (y === "center") {
                    y = "50%";
                }
                if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) {
                    x = "50%";
                }
                if (recObj) {
                    recObj.oxp = (x.indexOf("%") !== -1);
                    recObj.oyp = (y.indexOf("%") !== -1);
                    recObj.oxr = (x.charAt(1) === "=");
                    recObj.oyr = (y.charAt(1) === "=");
                    recObj.ox = parseFloat(x.replace(_NaNExp, ""));
                    recObj.oy = parseFloat(y.replace(_NaNExp, ""));
                }
                return x + " " + y + ((a.length > 2) ? " " + a[2] : "");
            },
            _parseChange = function(e, b) {
                return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(b);
            },
            _parseVal = function(v, d) {
                return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) + d : parseFloat(v);
            },
            _parseAngle = function(v, d, p, directionalEnd) {
                var min = 0.000001,
                    cap, split, dif, result;
                if (v == null) {
                    result = d;
                } else if (typeof(v) === "number") {
                    result = v;
                } else {
                    cap = 360;
                    split = v.split("_");
                    dif = Number(split[0].replace(_NaNExp, "")) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - ((v.charAt(1) === "=") ? 0 : d);
                    if (split.length) {
                        if (directionalEnd) {
                            directionalEnd[p] = d + dif;
                        }
                        if (v.indexOf("short") !== -1) {
                            dif = dif % cap;
                            if (dif !== dif % (cap / 2)) {
                                dif = (dif < 0) ? dif + cap : dif - cap;
                            }
                        }
                        if (v.indexOf("_cw") !== -1 && dif < 0) {
                            dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
                        } else if (v.indexOf("ccw") !== -1 && dif > 0) {
                            dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
                        }
                    }
                    result = d + dif;
                }
                if (result < min && result > -min) {
                    result = 0;
                }
                return result;
            },
            _colorLookup = {
                aqua: [0, 255, 255],
                lime: [0, 255, 0],
                silver: [192, 192, 192],
                black: [0, 0, 0],
                maroon: [128, 0, 0],
                teal: [0, 128, 128],
                blue: [0, 0, 255],
                navy: [0, 0, 128],
                white: [255, 255, 255],
                fuchsia: [255, 0, 255],
                olive: [128, 128, 0],
                yellow: [255, 255, 0],
                orange: [255, 165, 0],
                gray: [128, 128, 128],
                purple: [128, 0, 128],
                green: [0, 128, 0],
                red: [255, 0, 0],
                pink: [255, 192, 203],
                cyan: [0, 255, 255],
                transparent: [255, 255, 255, 0]
            },
            _hue = function(h, m1, m2) {
                h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
                return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
            },
            _parseColor = function(v) {
                var c1, c2, c3, h, s, l;
                if (!v || v === "") {
                    return _colorLookup.black;
                }
                if (typeof(v) === "number") {
                    return [v >> 16, (v >> 8) & 255, v & 255];
                }
                if (v.charAt(v.length - 1) === ",") {
                    v = v.substr(0, v.length - 1);
                }
                if (_colorLookup[v]) {
                    return _colorLookup[v];
                }
                if (v.charAt(0) === "#") {
                    if (v.length === 4) {
                        c1 = v.charAt(1), c2 = v.charAt(2), c3 = v.charAt(3);
                        v = "#" + c1 + c1 + c2 + c2 + c3 + c3;
                    }
                    v = parseInt(v.substr(1), 16);
                    return [v >> 16, (v >> 8) & 255, v & 255];
                }
                if (v.substr(0, 3) === "hsl") {
                    v = v.match(_numExp);
                    h = (Number(v[0]) % 360) / 360;
                    s = Number(v[1]) / 100;
                    l = Number(v[2]) / 100;
                    c2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
                    c1 = l * 2 - c2;
                    if (v.length > 3) {
                        v[3] = Number(v[3]);
                    }
                    v[0] = _hue(h + 1 / 3, c1, c2);
                    v[1] = _hue(h, c1, c2);
                    v[2] = _hue(h - 1 / 3, c1, c2);
                    return v;
                }
                v = v.match(_numExp) || _colorLookup.transparent;
                v[0] = Number(v[0]);
                v[1] = Number(v[1]);
                v[2] = Number(v[2]);
                if (v.length > 3) {
                    v[3] = Number(v[3]);
                }
                return v;
            },
            _colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
        for (p in _colorLookup) {
            _colorExp += "|" + p + "\\b";
        }
        _colorExp = new RegExp(_colorExp + ")", "gi");
        var _getFormatter = function(dflt, clr, collapsible, multi) {
                if (dflt == null) {
                    return function(v) {
                        return v;
                    };
                }
                var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
                    dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
                    pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
                    sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
                    delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
                    numVals = dVals.length,
                    dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
                    formatter;
                if (!numVals) {
                    return function(v) {
                        return v;
                    };
                }
                if (clr) {
                    formatter = function(v) {
                        var color, vals, i, a;
                        if (typeof(v) === "number") {
                            v += dSfx;
                        } else if (multi && _commasOutsideParenExp.test(v)) {
                            a = v.replace(_commasOutsideParenExp, "|").split("|");
                            for (i = 0; i < a.length; i++) {
                                a[i] = formatter(a[i]);
                            }
                            return a.join(",");
                        }
                        color = (v.match(_colorExp) || [dColor])[0];
                        vals = v.split(color).join("").match(_valuesExp) || [];
                        i = vals.length;
                        if (numVals > i--) {
                            while (++i < numVals) {
                                vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
                            }
                        }
                        return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
                    };
                    return formatter;
                }
                formatter = function(v) {
                    var vals, a, i;
                    if (typeof(v) === "number") {
                        v += dSfx;
                    } else if (multi && _commasOutsideParenExp.test(v)) {
                        a = v.replace(_commasOutsideParenExp, "|").split("|");
                        for (i = 0; i < a.length; i++) {
                            a[i] = formatter(a[i]);
                        }
                        return a.join(",");
                    }
                    vals = v.match(_valuesExp) || [];
                    i = vals.length;
                    if (numVals > i--) {
                        while (++i < numVals) {
                            vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
                        }
                    }
                    return pfx + vals.join(delim) + sfx;
                };
                return formatter;
            },
            _getEdgeParser = function(props) {
                props = props.split(",");
                return function(t, e, p, cssp, pt, plugin, vars) {
                    var a = (e + "").split(" "),
                        i;
                    vars = {};
                    for (i = 0; i < 4; i++) {
                        vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
                    }
                    return cssp.parse(t, vars, pt, plugin);
                };
            },
            _setPluginRatio = _internals._setPluginRatio = function(v) {
                this.plugin.setRatio(v);
                var d = this.data,
                    proxy = d.proxy,
                    mpt = d.firstMPT,
                    min = 0.000001,
                    val, pt, i, str;
                while (mpt) {
                    val = proxy[mpt.v];
                    if (mpt.r) {
                        val = Math.round(val);
                    } else if (val < min && val > -min) {
                        val = 0;
                    }
                    mpt.t[mpt.p] = val;
                    mpt = mpt._next;
                }
                if (d.autoRotate) {
                    d.autoRotate.rotation = proxy.rotation;
                }
                if (v === 1) {
                    mpt = d.firstMPT;
                    while (mpt) {
                        pt = mpt.t;
                        if (!pt.type) {
                            pt.e = pt.s + pt.xs0;
                        } else if (pt.type === 1) {
                            str = pt.xs0 + pt.s + pt.xs1;
                            for (i = 1; i < pt.l; i++) {
                                str += pt["xn" + i] + pt["xs" + (i + 1)];
                            }
                            pt.e = str;
                        }
                        mpt = mpt._next;
                    }
                }
            },
            MiniPropTween = function(t, p, v, next, r) {
                this.t = t;
                this.p = p;
                this.v = v;
                this.r = r;
                if (next) {
                    next._prev = this;
                    this._next = next;
                }
            },
            _parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
                var bpt = pt,
                    start = {},
                    end = {},
                    transform = cssp._transform,
                    oldForce = _forcePT,
                    i, p, xp, mpt, firstPT;
                cssp._transform = null;
                _forcePT = vars;
                pt = firstPT = cssp.parse(t, vars, pt, plugin);
                _forcePT = oldForce;
                if (shallow) {
                    cssp._transform = transform;
                    if (bpt) {
                        bpt._prev = null;
                        if (bpt._prev) {
                            bpt._prev._next = null;
                        }
                    }
                }
                while (pt && pt !== bpt) {
                    if (pt.type <= 1) {
                        p = pt.p;
                        end[p] = pt.s + pt.c;
                        start[p] = pt.s;
                        if (!shallow) {
                            mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
                            pt.c = 0;
                        }
                        if (pt.type === 1) {
                            i = pt.l;
                            while (--i > 0) {
                                xp = "xn" + i;
                                p = pt.p + "_" + xp;
                                end[p] = pt.data[xp];
                                start[p] = pt[xp];
                                if (!shallow) {
                                    mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
                                }
                            }
                        }
                    }
                    pt = pt._next;
                }
                return {
                    proxy: start,
                    end: end,
                    firstMPT: mpt,
                    pt: firstPT
                };
            },
            CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
                this.t = t;
                this.p = p;
                this.s = s;
                this.c = c;
                this.n = n || p;
                if (!(t instanceof CSSPropTween)) {
                    _overwriteProps.push(this.n);
                }
                this.r = r;
                this.type = type || 0;
                if (pr) {
                    this.pr = pr;
                    _hasPriority = true;
                }
                this.b = (b === undefined) ? s : b;
                this.e = (e === undefined) ? s + c : e;
                if (next) {
                    this._next = next;
                    next._prev = this;
                }
            },
            _parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
                b = b || dflt || "";
                pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
                e += "";
                var ba = b.split(", ").join(",").split(" "),
                    ea = e.split(", ").join(",").split(" "),
                    l = ba.length,
                    autoRound = (_autoRound !== false),
                    i, xi, ni, bv, ev, bnums, enums, bn, rgba, temp, cv, str;
                if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
                    ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
                    ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
                    l = ba.length;
                }
                if (l !== ea.length) {
                    ba = (dflt || "").split(" ");
                    l = ba.length;
                }
                pt.plugin = plugin;
                pt.setRatio = setRatio;
                for (i = 0; i < l; i++) {
                    bv = ba[i];
                    ev = ea[i];
                    bn = parseFloat(bv);
                    if (bn || bn === 0) {
                        pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);
                    } else if (clrs && (bv.charAt(0) === "#" || _colorLookup[bv] || _rgbhslExp.test(bv))) {
                        str = ev.charAt(ev.length - 1) === "," ? ")," : ")";
                        bv = _parseColor(bv);
                        ev = _parseColor(ev);
                        rgba = (bv.length + ev.length > 6);
                        if (rgba && !_supportsOpacity && ev[3] === 0) {
                            pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
                            pt.e = pt.e.split(ea[i]).join("transparent");
                        } else {
                            if (!_supportsOpacity) {
                                rgba = false;
                            }
                            pt.appendXtra((rgba ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true).appendXtra("", bv[1], ev[1] - bv[1], ",", true).appendXtra("", bv[2], ev[2] - bv[2], (rgba ? "," : str), true);
                            if (rgba) {
                                bv = (bv.length < 4) ? 1 : bv[3];
                                pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
                            }
                        }
                    } else {
                        bnums = bv.match(_numExp);
                        if (!bnums) {
                            pt["xs" + pt.l] += pt.l ? " " + bv : bv;
                        } else {
                            enums = ev.match(_relNumExp);
                            if (!enums || enums.length !== bnums.length) {
                                return pt;
                            }
                            ni = 0;
                            for (xi = 0; xi < bnums.length; xi++) {
                                cv = bnums[xi];
                                temp = bv.indexOf(cv, ni);
                                pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
                                ni = temp + cv.length;
                            }
                            pt["xs" + pt.l] += bv.substr(ni);
                        }
                    }
                }
                if (e.indexOf("=") !== -1)
                    if (pt.data) {
                        str = pt.xs0 + pt.data.s;
                        for (i = 1; i < pt.l; i++) {
                            str += pt["xs" + i] + pt.data["xn" + i];
                        }
                        pt.e = str + pt["xs" + i];
                    }
                if (!pt.l) {
                    pt.type = -1;
                    pt.xs0 = pt.e;
                }
                return pt.xfirst || pt;
            },
            i = 9;
        p = CSSPropTween.prototype;
        p.l = p.pr = 0;
        while (--i > 0) {
            p["xn" + i] = 0;
            p["xs" + i] = "";
        }
        p.xs0 = "";
        p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;
        p.appendXtra = function(pfx, s, c, sfx, r, pad) {
            var pt = this,
                l = pt.l;
            pt["xs" + l] += (pad && l) ? " " + pfx : pfx || "";
            if (!c)
                if (l !== 0 && !pt.plugin) {
                    pt["xs" + l] += s + (sfx || "");
                    return pt;
                }
            pt.l++;
            pt.type = pt.setRatio ? 2 : 1;
            pt["xs" + pt.l] = sfx || "";
            if (l > 0) {
                pt.data["xn" + l] = s + c;
                pt.rxp["xn" + l] = r;
                pt["xn" + l] = s;
                if (!pt.plugin) {
                    pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
                    pt.xfirst.xs0 = 0;
                }
                return pt;
            }
            pt.data = {
                s: s + c
            };
            pt.rxp = {};
            pt.s = s;
            pt.c = c;
            pt.r = r;
            return pt;
        };
        var SpecialProp = function(p, options) {
                options = options || {};
                this.p = options.prefix ? _checkPropPrefix(p) || p : p;
                _specialProps[p] = _specialProps[this.p] = this;
                this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
                if (options.parser) {
                    this.parse = options.parser;
                }
                this.clrs = options.color;
                this.multi = options.multi;
                this.keyword = options.keyword;
                this.dflt = options.defaultValue;
                this.pr = options.priority || 0;
            },
            _registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
                if (typeof(options) !== "object") {
                    options = {
                        parser: defaults
                    };
                }
                var a = p.split(","),
                    d = options.defaultValue,
                    i, temp;
                defaults = defaults || [d];
                for (i = 0; i < a.length; i++) {
                    options.prefix = (i === 0 && options.prefix);
                    options.defaultValue = defaults[i] || d;
                    temp = new SpecialProp(a[i], options);
                }
            },
            _registerPluginProp = function(p) {
                if (!_specialProps[p]) {
                    var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
                    _registerComplexSpecialProp(p, {
                        parser: function(t, e, p, cssp, pt, plugin, vars) {
                            var pluginClass = (window.GreenSockGlobals || window).com.greensock.plugins[pluginName];
                            if (!pluginClass) {
                                _log("Error: " + pluginName + " js file not loaded.");
                                return pt;
                            }
                            pluginClass._cssRegister();
                            return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
                        }
                    });
                }
            };
        p = SpecialProp.prototype;
        p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
            var kwd = this.keyword,
                i, ba, ea, l, bi, ei;
            if (this.multi)
                if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
                    ba = b.replace(_commasOutsideParenExp, "|").split("|");
                    ea = e.replace(_commasOutsideParenExp, "|").split("|");
                } else if (kwd) {
                ba = [b];
                ea = [e];
            }
            if (ea) {
                l = (ea.length > ba.length) ? ea.length : ba.length;
                for (i = 0; i < l; i++) {
                    b = ba[i] = ba[i] || this.dflt;
                    e = ea[i] = ea[i] || this.dflt;
                    if (kwd) {
                        bi = b.indexOf(kwd);
                        ei = e.indexOf(kwd);
                        if (bi !== ei) {
                            e = (ei === -1) ? ea : ba;
                            e[i] += " " + kwd;
                        }
                    }
                }
                b = ba.join(", ");
                e = ea.join(", ");
            }
            return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
        };
        p.parse = function(t, e, p, cssp, pt, plugin, vars) {
            return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
        };
        CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
            _registerComplexSpecialProp(name, {
                parser: function(t, e, p, cssp, pt, plugin, vars) {
                    var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
                    rv.plugin = plugin;
                    rv.setRatio = onInitTween(t, e, cssp._tween, p);
                    return rv;
                },
                priority: priority
            });
        };
        var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective").split(","),
            _transformProp = _checkPropPrefix("transform"),
            _transformPropCSS = _prefixCSS + "transform",
            _transformOriginProp = _checkPropPrefix("transformOrigin"),
            _supports3D = (_checkPropPrefix("perspective") !== null),
            Transform = _internals.Transform = function() {
                this.skewY = 0;
            },
            _getTransform = _internals.getTransform = function(t, cs, rec, parse) {
                if (t._gsTransform && rec && !parse) {
                    return t._gsTransform;
                }
                var tm = rec ? t._gsTransform || new Transform() : new Transform(),
                    invX = (tm.scaleX < 0),
                    min = 0.00002,
                    rnd = 100000,
                    minAngle = 179.99,
                    minPI = minAngle * _DEG2RAD,
                    zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin || 0 : 0,
                    s, m, i, n, dec, scaleX, scaleY, rotation, skewX, difX, difY, difR, difS;
                if (_transformProp) {
                    s = _getStyle(t, _transformPropCSS, cs, true);
                } else if (t.currentStyle) {
                    s = t.currentStyle.filter.match(_ieGetMatrixExp);
                    s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
                }
                m = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [];
                i = m.length;
                while (--i > -1) {
                    n = Number(m[i]);
                    m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n;
                }
                if (m.length === 16) {
                    var a13 = m[8],
                        a23 = m[9],
                        a33 = m[10],
                        a14 = m[12],
                        a24 = m[13],
                        a34 = m[14];
                    if (tm.zOrigin) {
                        a34 = -tm.zOrigin;
                        a14 = a13 * a34 - m[12];
                        a24 = a23 * a34 - m[13];
                        a34 = a33 * a34 + tm.zOrigin - m[14];
                    }
                    if (!rec || parse || tm.rotationX == null) {
                        var a11 = m[0],
                            a21 = m[1],
                            a31 = m[2],
                            a41 = m[3],
                            a12 = m[4],
                            a22 = m[5],
                            a32 = m[6],
                            a42 = m[7],
                            a43 = m[11],
                            angle = Math.atan2(a32, a33),
                            xFlip = (angle < -minPI || angle > minPI),
                            t1, t2, t3, cos, sin, yFlip, zFlip;
                        tm.rotationX = angle * _RAD2DEG;
                        if (angle) {
                            cos = Math.cos(-angle);
                            sin = Math.sin(-angle);
                            t1 = a12 * cos + a13 * sin;
                            t2 = a22 * cos + a23 * sin;
                            t3 = a32 * cos + a33 * sin;
                            a13 = a12 * -sin + a13 * cos;
                            a23 = a22 * -sin + a23 * cos;
                            a33 = a32 * -sin + a33 * cos;
                            a43 = a42 * -sin + a43 * cos;
                            a12 = t1;
                            a22 = t2;
                            a32 = t3;
                        }
                        angle = Math.atan2(a13, a11);
                        tm.rotationY = angle * _RAD2DEG;
                        if (angle) {
                            yFlip = (angle < -minPI || angle > minPI);
                            cos = Math.cos(-angle);
                            sin = Math.sin(-angle);
                            t1 = a11 * cos - a13 * sin;
                            t2 = a21 * cos - a23 * sin;
                            t3 = a31 * cos - a33 * sin;
                            a23 = a21 * sin + a23 * cos;
                            a33 = a31 * sin + a33 * cos;
                            a43 = a41 * sin + a43 * cos;
                            a11 = t1;
                            a21 = t2;
                            a31 = t3;
                        }
                        angle = Math.atan2(a21, a22);
                        tm.rotation = angle * _RAD2DEG;
                        if (angle) {
                            zFlip = (angle < -minPI || angle > minPI);
                            cos = Math.cos(-angle);
                            sin = Math.sin(-angle);
                            a11 = a11 * cos + a12 * sin;
                            t2 = a21 * cos + a22 * sin;
                            a22 = a21 * -sin + a22 * cos;
                            a32 = a31 * -sin + a32 * cos;
                            a21 = t2;
                        }
                        if (zFlip && xFlip) {
                            tm.rotation = tm.rotationX = 0;
                        } else if (zFlip && yFlip) {
                            tm.rotation = tm.rotationY = 0;
                        } else if (yFlip && xFlip) {
                            tm.rotationY = tm.rotationX = 0;
                        }
                        tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
                        tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
                        tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
                        tm.skewX = 0;
                        tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
                        tm.x = a14;
                        tm.y = a24;
                        tm.z = a34;
                    }
                } else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY)) && !(tm.x !== undefined && _getStyle(t, "display", cs) === "none")) {
                    var k = (m.length >= 6),
                        a = k ? m[0] : 1,
                        b = m[1] || 0,
                        c = m[2] || 0,
                        d = k ? m[3] : 1;
                    tm.x = m[4] || 0;
                    tm.y = m[5] || 0;
                    scaleX = Math.sqrt(a * a + b * b);
                    scaleY = Math.sqrt(d * d + c * c);
                    rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0;
                    skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
                    difX = scaleX - Math.abs(tm.scaleX || 0);
                    difY = scaleY - Math.abs(tm.scaleY || 0);
                    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
                        if (invX) {
                            scaleX *= -1;
                            skewX += (rotation <= 0) ? 180 : -180;
                            rotation += (rotation <= 0) ? 180 : -180;
                        } else {
                            scaleY *= -1;
                            skewX += (skewX <= 0) ? 180 : -180;
                        }
                    }
                    difR = (rotation - tm.rotation) % 180;
                    difS = (skewX - tm.skewX) % 180;
                    if (tm.skewX === undefined || difX > min || difX < -min || difY > min || difY < -min || (difR > -minAngle && difR < minAngle && (difR * rnd) | 0 !== 0) || (difS > -minAngle && difS < minAngle && (difS * rnd) | 0 !== 0)) {
                        tm.scaleX = scaleX;
                        tm.scaleY = scaleY;
                        tm.rotation = rotation;
                        tm.skewX = skewX;
                    }
                    if (_supports3D) {
                        tm.rotationX = tm.rotationY = tm.z = 0;
                        tm.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
                        tm.scaleZ = 1;
                    }
                }
                tm.zOrigin = zOrigin;
                for (i in tm) {
                    if (tm[i] < min)
                        if (tm[i] > -min) {
                            tm[i] = 0;
                        }
                }
                if (rec) {
                    t._gsTransform = tm;
                }
                return tm;
            },
            _setIETransformRatio = function(v) {
                var t = this.data,
                    ang = -t.rotation * _DEG2RAD,
                    skew = ang + t.skewX * _DEG2RAD,
                    rnd = 100000,
                    a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
                    b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
                    c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
                    d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
                    style = this.t.style,
                    cs = this.t.currentStyle,
                    filters, val;
                if (!cs) {
                    return;
                }
                val = b;
                b = -c;
                c = -val;
                filters = cs.filter;
                style.filter = "";
                var w = this.t.offsetWidth,
                    h = this.t.offsetHeight,
                    clip = (cs.position !== "absolute"),
                    m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
                    ox = t.x,
                    oy = t.y,
                    dx, dy;
                if (t.ox != null) {
                    dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
                    dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
                    ox += dx - (dx * a + dy * b);
                    oy += dy - (dx * c + dy * d);
                }
                if (!clip) {
                    m += ", sizingMethod='auto expand')";
                } else {
                    dx = (w / 2);
                    dy = (h / 2);
                    m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
                }
                if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
                    style.filter = filters.replace(_ieSetMatrixExp, m);
                } else {
                    style.filter = m + " " + filters;
                }
                if (v === 0 || v === 1)
                    if (a === 1)
                        if (b === 0)
                            if (c === 0)
                                if (d === 1)
                                    if (!clip || m.indexOf("Dx=0, Dy=0") !== -1)
                                        if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100)
                                            if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
                                                style.removeAttribute("filter");
                                            }
                if (!clip) {
                    var mult = (_ieVers < 8) ? 1 : -1,
                        marg, prop, dif;
                    dx = t.ieOffsetX || 0;
                    dy = t.ieOffsetY || 0;
                    t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
                    t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
                    for (i = 0; i < 4; i++) {
                        prop = _margins[i];
                        marg = cs[prop];
                        val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
                        if (val !== t[prop]) {
                            dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY;
                        } else {
                            dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
                        }
                        style[prop] = (t[prop] = Math.round(val - dif * ((i === 0 || i === 2) ? 1 : mult))) + "px";
                    }
                }
            },
            _set3DTransformRatio = _internals.set3DTransformRatio = function(v) {
                var t = this.data,
                    style = this.t.style,
                    angle = t.rotation * _DEG2RAD,
                    sx = t.scaleX,
                    sy = t.scaleY,
                    sz = t.scaleZ,
                    perspective = t.perspective,
                    a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, zOrigin, rnd, cos, sin, t1, t2, t3, t4;
                if (_isFirefox) {
                    var n = 0.0001;
                    if (sx < n && sx > -n) {
                        sx = sz = 0.00002;
                    }
                    if (sy < n && sy > -n) {
                        sy = sz = 0.00002;
                    }
                    if (perspective && !t.z && !t.rotationX && !t.rotationY) {
                        perspective = 0;
                    }
                }
                if (angle || t.skewX) {
                    cos = Math.cos(angle);
                    sin = Math.sin(angle);
                    a11 = cos;
                    a21 = sin;
                    if (t.skewX) {
                        angle -= t.skewX * _DEG2RAD;
                        cos = Math.cos(angle);
                        sin = Math.sin(angle);
                        if (t.skewType === "simple") {
                            t1 = Math.tan(t.skewX * _DEG2RAD);
                            t1 = Math.sqrt(1 + t1 * t1);
                            cos *= t1;
                            sin *= t1;
                        }
                    }
                    a12 = -sin;
                    a22 = cos;
                } else if (!t.rotationY && !t.rotationX && sz === 1 && !perspective) {
                    style[_transformProp] = "translate3d(" + t.x + "px," + t.y + "px," + t.z + "px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
                    return;
                } else {
                    a11 = a22 = 1;
                    a12 = a21 = 0;
                }
                a33 = 1;
                a13 = a14 = a23 = a24 = a31 = a32 = a34 = a41 = a42 = 0;
                a43 = (perspective) ? -1 / perspective : 0;
                zOrigin = t.zOrigin;
                rnd = 100000;
                angle = t.rotationY * _DEG2RAD;
                if (angle) {
                    cos = Math.cos(angle);
                    sin = Math.sin(angle);
                    a31 = a33 * -sin;
                    a41 = a43 * -sin;
                    a13 = a11 * sin;
                    a23 = a21 * sin;
                    a33 *= cos;
                    a43 *= cos;
                    a11 *= cos;
                    a21 *= cos;
                }
                angle = t.rotationX * _DEG2RAD;
                if (angle) {
                    cos = Math.cos(angle);
                    sin = Math.sin(angle);
                    t1 = a12 * cos + a13 * sin;
                    t2 = a22 * cos + a23 * sin;
                    t3 = a32 * cos + a33 * sin;
                    t4 = a42 * cos + a43 * sin;
                    a13 = a12 * -sin + a13 * cos;
                    a23 = a22 * -sin + a23 * cos;
                    a33 = a32 * -sin + a33 * cos;
                    a43 = a42 * -sin + a43 * cos;
                    a12 = t1;
                    a22 = t2;
                    a32 = t3;
                    a42 = t4;
                }
                if (sz !== 1) {
                    a13 *= sz;
                    a23 *= sz;
                    a33 *= sz;
                    a43 *= sz;
                }
                if (sy !== 1) {
                    a12 *= sy;
                    a22 *= sy;
                    a32 *= sy;
                    a42 *= sy;
                }
                if (sx !== 1) {
                    a11 *= sx;
                    a21 *= sx;
                    a31 *= sx;
                    a41 *= sx;
                }
                if (zOrigin) {
                    a34 -= zOrigin;
                    a14 = a13 * a34;
                    a24 = a23 * a34;
                    a34 = a33 * a34 + zOrigin;
                }
                a14 = (t1 = (a14 += t.x) - (a14 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a14 : a14;
                a24 = (t1 = (a24 += t.y) - (a24 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a24 : a24;
                a34 = (t1 = (a34 += t.z) - (a34 |= 0)) ? ((t1 * rnd + (t1 < 0 ? -0.5 : 0.5)) | 0) / rnd + a34 : a34;
                style[_transformProp] = "matrix3d(" + [(((a11 * rnd) | 0) / rnd), (((a21 * rnd) | 0) / rnd), (((a31 * rnd) | 0) / rnd), (((a41 * rnd) | 0) / rnd), (((a12 * rnd) | 0) / rnd), (((a22 * rnd) | 0) / rnd), (((a32 * rnd) | 0) / rnd), (((a42 * rnd) | 0) / rnd), (((a13 * rnd) | 0) / rnd), (((a23 * rnd) | 0) / rnd), (((a33 * rnd) | 0) / rnd), (((a43 * rnd) | 0) / rnd), a14, a24, a34, (perspective ? (1 + (-a34 / perspective)) : 1)].join(",") + ")";
            },
            _set2DTransformRatio = _internals.set2DTransformRatio = function(v) {
                var t = this.data,
                    targ = this.t,
                    style = targ.style,
                    ang, skew, rnd, sx, sy;
                if (t.rotationX || t.rotationY || t.z || t.force3D) {
                    this.setRatio = _set3DTransformRatio;
                    _set3DTransformRatio.call(this, v);
                    return;
                }
                if (!t.rotation && !t.skewX) {
                    style[_transformProp] = "matrix(" + t.scaleX + ",0,0," + t.scaleY + "," + t.x + "," + t.y + ")";
                } else {
                    ang = t.rotation * _DEG2RAD;
                    skew = ang - t.skewX * _DEG2RAD;
                    rnd = 100000;
                    sx = t.scaleX * rnd;
                    sy = t.scaleY * rnd;
                    style[_transformProp] = "matrix(" + (((Math.cos(ang) * sx) | 0) / rnd) + "," + (((Math.sin(ang) * sx) | 0) / rnd) + "," + (((Math.sin(skew) * -sy) | 0) / rnd) + "," + (((Math.cos(skew) * sy) | 0) / rnd) + "," + t.x + "," + t.y + ")";
                }
            };
        _registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType", {
            parser: function(t, e, p, cssp, pt, plugin, vars) {
                if (cssp._transform) {
                    return pt;
                }
                var m1 = cssp._transform = _getTransform(t, _cs, true, vars.parseTransform),
                    style = t.style,
                    min = 0.000001,
                    i = _transformProps.length,
                    v = vars,
                    endRotations = {},
                    m2, skewY, copy, orig, has3D, hasChange, dr;
                if (typeof(v.transform) === "string" && _transformProp) {
                    copy = style.cssText;
                    style[_transformProp] = v.transform;
                    style.display = "block";
                    m2 = _getTransform(t, null, false);
                    style.cssText = copy;
                } else if (typeof(v) === "object") {
                    m2 = {
                        scaleX: _parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
                        scaleY: _parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
                        scaleZ: _parseVal(v.scaleZ, m1.scaleZ),
                        x: _parseVal(v.x, m1.x),
                        y: _parseVal(v.y, m1.y),
                        z: _parseVal(v.z, m1.z),
                        perspective: _parseVal(v.transformPerspective, m1.perspective)
                    };
                    dr = v.directionalRotation;
                    if (dr != null) {
                        if (typeof(dr) === "object") {
                            for (copy in dr) {
                                v[copy] = dr[copy];
                            }
                        } else {
                            v.rotation = dr;
                        }
                    }
                    m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation, m1.rotation, "rotation", endRotations);
                    if (_supports3D) {
                        m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
                        m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
                    }
                    m2.skewX = (v.skewX == null) ? m1.skewX : _parseAngle(v.skewX, m1.skewX);
                    m2.skewY = (v.skewY == null) ? m1.skewY : _parseAngle(v.skewY, m1.skewY);
                    if ((skewY = m2.skewY - m1.skewY)) {
                        m2.skewX += skewY;
                        m2.rotation += skewY;
                    }
                }
                if (_supports3D && v.force3D != null) {
                    m1.force3D = v.force3D;
                    hasChange = true;
                }
                m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;
                has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
                if (!has3D && v.scale != null) {
                    m2.scaleZ = 1;
                }
                while (--i > -1) {
                    p = _transformProps[i];
                    orig = m2[p] - m1[p];
                    if (orig > min || orig < -min || _forcePT[p] != null) {
                        hasChange = true;
                        pt = new CSSPropTween(m1, p, m1[p], orig, pt);
                        if (p in endRotations) {
                            pt.e = endRotations[p];
                        }
                        pt.xs0 = 0;
                        pt.plugin = plugin;
                        cssp._overwriteProps.push(pt.n);
                    }
                }
                orig = v.transformOrigin;
                if (orig || (_supports3D && has3D && m1.zOrigin)) {
                    if (_transformProp) {
                        hasChange = true;
                        p = _transformOriginProp;
                        orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + "";
                        pt = new CSSPropTween(style, p, 0, 0, pt, -1, "transformOrigin");
                        pt.b = style[p];
                        pt.plugin = plugin;
                        if (_supports3D) {
                            copy = m1.zOrigin;
                            orig = orig.split(" ");
                            m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0;
                            pt.xs0 = pt.e = style[p] = orig[0] + " " + (orig[1] || "50%") + " 0px";
                            pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n);
                            pt.b = copy;
                            pt.xs0 = pt.e = m1.zOrigin;
                        } else {
                            pt.xs0 = pt.e = style[p] = orig;
                        }
                    } else {
                        _parsePosition(orig + "", m1);
                    }
                }
                if (hasChange) {
                    cssp._transformType = (has3D || this._transformType === 3) ? 3 : 2;
                }
                return pt;
            },
            prefix: true
        });
        _registerComplexSpecialProp("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: true,
            color: true,
            multi: true,
            keyword: "inset"
        });
        _registerComplexSpecialProp("borderRadius", {
            defaultValue: "0px",
            parser: function(t, e, p, cssp, pt, plugin) {
                e = this.format(e);
                var props = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                    style = t.style,
                    ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
                w = parseFloat(t.offsetWidth);
                h = parseFloat(t.offsetHeight);
                ea1 = e.split(" ");
                for (i = 0; i < props.length; i++) {
                    if (this.p.indexOf("border")) {
                        props[i] = _checkPropPrefix(props[i]);
                    }
                    bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
                    if (bs.indexOf(" ") !== -1) {
                        bs2 = bs.split(" ");
                        bs = bs2[0];
                        bs2 = bs2[1];
                    }
                    es = es2 = ea1[i];
                    bn = parseFloat(bs);
                    bsfx = bs.substr((bn + "").length);
                    rel = (es.charAt(1) === "=");
                    if (rel) {
                        en = parseInt(es.charAt(0) + "1", 10);
                        es = es.substr(2);
                        en *= parseFloat(es);
                        esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
                    } else {
                        en = parseFloat(es);
                        esfx = es.substr((en + "").length);
                    }
                    if (esfx === "") {
                        esfx = _suffixMap[p] || bsfx;
                    }
                    if (esfx !== bsfx) {
                        hn = _convertToPixels(t, "borderLeft", bn, bsfx);
                        vn = _convertToPixels(t, "borderTop", bn, bsfx);
                        if (esfx === "%") {
                            bs = (hn / w * 100) + "%";
                            bs2 = (vn / h * 100) + "%";
                        } else if (esfx === "em") {
                            em = _convertToPixels(t, "borderLeft", 1, "em");
                            bs = (hn / em) + "em";
                            bs2 = (vn / em) + "em";
                        } else {
                            bs = hn + "px";
                            bs2 = vn + "px";
                        }
                        if (rel) {
                            es = (parseFloat(bs) + en) + esfx;
                            es2 = (parseFloat(bs2) + en) + esfx;
                        }
                    }
                    pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
                }
                return pt;
            },
            prefix: true,
            formatter: _getFormatter("0px 0px 0px 0px", false, true)
        });
        _registerComplexSpecialProp("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(t, e, p, cssp, pt, plugin) {
                var bp = "background-position",
                    cs = (_cs || _getComputedStyle(t, null)),
                    bs = this.format(((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
                    es = this.format(e),
                    ba, ea, i, pct, overlap, src;
                if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1)) {
                    src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
                    if (src && src !== "none") {
                        ba = bs.split(" ");
                        ea = es.split(" ");
                        _tempImg.setAttribute("src", src);
                        i = 2;
                        while (--i > -1) {
                            bs = ba[i];
                            pct = (bs.indexOf("%") !== -1);
                            if (pct !== (ea[i].indexOf("%") !== -1)) {
                                overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
                                ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
                            }
                        }
                        bs = ba.join(" ");
                    }
                }
                return this.parseComplex(t.style, bs, es, pt, plugin);
            },
            formatter: _parsePosition
        });
        _registerComplexSpecialProp("backgroundSize", {
            defaultValue: "0 0",
            formatter: _parsePosition
        });
        _registerComplexSpecialProp("perspective", {
            defaultValue: "0px",
            prefix: true
        });
        _registerComplexSpecialProp("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: true
        });
        _registerComplexSpecialProp("transformStyle", {
            prefix: true
        });
        _registerComplexSpecialProp("backfaceVisibility", {
            prefix: true
        });
        _registerComplexSpecialProp("userSelect", {
            prefix: true
        });
        _registerComplexSpecialProp("margin", {
            parser: _getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")
        });
        _registerComplexSpecialProp("padding", {
            parser: _getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")
        });
        _registerComplexSpecialProp("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(t, e, p, cssp, pt, plugin) {
                var b, cs, delim;
                if (_ieVers < 9) {
                    cs = t.currentStyle;
                    delim = _ieVers < 8 ? " " : ",";
                    b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
                    e = this.format(e).split(",").join(delim);
                } else {
                    b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
                    e = this.format(e);
                }
                return this.parseComplex(t.style, b, e, pt, plugin);
            }
        });
        _registerComplexSpecialProp("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: true,
            multi: true
        });
        _registerComplexSpecialProp("autoRound,strictUnits", {
            parser: function(t, e, p, cssp, pt) {
                return pt;
            }
        });
        _registerComplexSpecialProp("border", {
            defaultValue: "0px solid #000",
            parser: function(t, e, p, cssp, pt, plugin) {
                return this.parseComplex(t.style, this.format(_getStyle(t, "borderTopWidth", _cs, false, "0px") + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), this.format(e), pt, plugin);
            },
            color: true,
            formatter: function(v) {
                var a = v.split(" ");
                return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
            }
        });
        _registerComplexSpecialProp("borderWidth", {
            parser: _getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        });
        _registerComplexSpecialProp("float,cssFloat,styleFloat", {
            parser: function(t, e, p, cssp, pt, plugin) {
                var s = t.style,
                    prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
                return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
            }
        });
        var _setIEOpacityRatio = function(v) {
            var t = this.t,
                filters = t.filter || _getStyle(this.data, "filter"),
                val = (this.s + this.c * v) | 0,
                skip;
            if (val === 100) {
                if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
                    t.removeAttribute("filter");
                    skip = (!_getStyle(this.data, "filter"));
                } else {
                    t.filter = filters.replace(_alphaFilterExp, "");
                    skip = true;
                }
            }
            if (!skip) {
                if (this.xn1) {
                    t.filter = filters = filters || ("alpha(opacity=" + val + ")");
                }
                if (filters.indexOf("opacity") === -1) {
                    if (val !== 0 || !this.xn1) {
                        t.filter = filters + " alpha(opacity=" + val + ")";
                    }
                } else {
                    t.filter = filters.replace(_opacityExp, "opacity=" + val);
                }
            }
        };
        _registerComplexSpecialProp("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(t, e, p, cssp, pt, plugin) {
                var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
                    style = t.style,
                    isAutoAlpha = (p === "autoAlpha");
                if (typeof(e) === "string" && e.charAt(1) === "=") {
                    e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
                }
                if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) {
                    b = 0;
                }
                if (_supportsOpacity) {
                    pt = new CSSPropTween(style, "opacity", b, e - b, pt);
                } else {
                    pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
                    pt.xn1 = isAutoAlpha ? 1 : 0;
                    style.zoom = 1;
                    pt.type = 2;
                    pt.b = "alpha(opacity=" + pt.s + ")";
                    pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
                    pt.data = t;
                    pt.plugin = plugin;
                    pt.setRatio = _setIEOpacityRatio;
                }
                if (isAutoAlpha) {
                    pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
                    pt.xs0 = "inherit";
                    cssp._overwriteProps.push(pt.n);
                    cssp._overwriteProps.push(p);
                }
                return pt;
            }
        });
        var _removeProp = function(s, p) {
                if (p) {
                    if (s.removeProperty) {
                        if (p.substr(0, 2) === "ms") {
                            p = "M" + p.substr(1);
                        }
                        s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
                    } else {
                        s.removeAttribute(p);
                    }
                }
            },
            _setClassNameRatio = function(v) {
                this.t._gsClassPT = this;
                if (v === 1 || v === 0) {
                    this.t.className = (v === 0) ? this.b : this.e;
                    var mpt = this.data,
                        s = this.t.style;
                    while (mpt) {
                        if (!mpt.v) {
                            _removeProp(s, mpt.p);
                        } else {
                            s[mpt.p] = mpt.v;
                        }
                        mpt = mpt._next;
                    }
                    if (v === 1 && this.t._gsClassPT === this) {
                        this.t._gsClassPT = null;
                    }
                } else if (this.t.className !== this.e) {
                    this.t.className = this.e;
                }
            };
        _registerComplexSpecialProp("className", {
            parser: function(t, e, p, cssp, pt, plugin, vars) {
                var b = t.className,
                    cssText = t.style.cssText,
                    difData, bs, cnpt, cnptLookup, mpt;
                pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
                pt.setRatio = _setClassNameRatio;
                pt.pr = -11;
                _hasPriority = true;
                pt.b = b;
                bs = _getAllStyles(t, _cs);
                cnpt = t._gsClassPT;
                if (cnpt) {
                    cnptLookup = {};
                    mpt = cnpt.data;
                    while (mpt) {
                        cnptLookup[mpt.p] = 1;
                        mpt = mpt._next;
                    }
                    cnpt.setRatio(1);
                }
                t._gsClassPT = pt;
                pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
                if (cssp._tween._duration) {
                    t.className = pt.e;
                    difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
                    t.className = b;
                    pt.data = difData.firstMPT;
                    t.style.cssText = cssText;
                    pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin);
                }
                return pt;
            }
        });
        var _setClearPropsRatio = function(v) {
            if (v === 1 || v === 0)
                if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") {
                    var s = this.t.style,
                        transformParse = _specialProps.transform.parse,
                        a, p, i, clearTransform;
                    if (this.e === "all") {
                        s.cssText = "";
                        clearTransform = true;
                    } else {
                        a = this.e.split(",");
                        i = a.length;
                        while (--i > -1) {
                            p = a[i];
                            if (_specialProps[p]) {
                                if (_specialProps[p].parse === transformParse) {
                                    clearTransform = true;
                                } else {
                                    p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p;
                                }
                            }
                            _removeProp(s, p);
                        }
                    }
                    if (clearTransform) {
                        _removeProp(s, _transformProp);
                        if (this.t._gsTransform) {
                            delete this.t._gsTransform;
                        }
                    }
                }
        };
        _registerComplexSpecialProp("clearProps", {
            parser: function(t, e, p, cssp, pt) {
                pt = new CSSPropTween(t, p, 0, 0, pt, 2);
                pt.setRatio = _setClearPropsRatio;
                pt.e = e;
                pt.pr = -10;
                pt.data = cssp._tween;
                _hasPriority = true;
                return pt;
            }
        });
        p = "bezier,throwProps,physicsProps,physics2D".split(",");
        i = p.length;
        while (i--) {
            _registerPluginProp(p[i]);
        }
        p = CSSPlugin.prototype;
        p._firstPT = null;
        p._onInitTween = function(target, vars, tween) {
            if (!target.nodeType) {
                return false;
            }
            this._target = target;
            this._tween = tween;
            this._vars = vars;
            _autoRound = vars.autoRound;
            _hasPriority = false;
            _suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
            _cs = _getComputedStyle(target, "");
            _overwriteProps = this._overwriteProps;
            var style = target.style,
                v, pt, pt2, first, last, next, zIndex, tpt, threeD;
            if (_reqSafariFix)
                if (style.zIndex === "") {
                    v = _getStyle(target, "zIndex", _cs);
                    if (v === "auto" || v === "") {
                        style.zIndex = 0;
                    }
                }
            if (typeof(vars) === "string") {
                first = style.cssText;
                v = _getAllStyles(target, _cs);
                style.cssText = first + ";" + vars;
                v = _cssDif(target, v, _getAllStyles(target)).difs;
                if (!_supportsOpacity && _opacityValExp.test(vars)) {
                    v.opacity = parseFloat(RegExp.$1);
                }
                vars = v;
                style.cssText = first;
            }
            this._firstPT = pt = this.parse(target, vars, null);
            if (this._transformType) {
                threeD = (this._transformType === 3);
                if (!_transformProp) {
                    style.zoom = 1;
                } else if (_isSafari) {
                    _reqSafariFix = true;
                    if (style.zIndex === "") {
                        zIndex = _getStyle(target, "zIndex", _cs);
                        if (zIndex === "auto" || zIndex === "") {
                            style.zIndex = 0;
                        }
                    }
                    if (_isSafariLT6) {
                        style.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden");
                    }
                }
                pt2 = pt;
                while (pt2 && pt2._next) {
                    pt2 = pt2._next;
                }
                tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
                this._linkCSSP(tpt, null, pt2);
                tpt.setRatio = (threeD && _supports3D) ? _set3DTransformRatio : _transformProp ? _set2DTransformRatio : _setIETransformRatio;
                tpt.data = this._transform || _getTransform(target, _cs, true);
                _overwriteProps.pop();
            }
            if (_hasPriority) {
                while (pt) {
                    next = pt._next;
                    pt2 = first;
                    while (pt2 && pt2.pr > pt.pr) {
                        pt2 = pt2._next;
                    }
                    if ((pt._prev = pt2 ? pt2._prev : last)) {
                        pt._prev._next = pt;
                    } else {
                        first = pt;
                    }
                    if ((pt._next = pt2)) {
                        pt2._prev = pt;
                    } else {
                        last = pt;
                    }
                    pt = next;
                }
                this._firstPT = first;
            }
            return true;
        };
        p.parse = function(target, vars, pt, plugin) {
            var style = target.style,
                p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
            for (p in vars) {
                es = vars[p];
                sp = _specialProps[p];
                if (sp) {
                    pt = sp.parse(target, es, p, this, pt, plugin, vars);
                } else {
                    bs = _getStyle(target, p, _cs) + "";
                    isStr = (typeof(es) === "string");
                    if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) {
                        if (!isStr) {
                            es = _parseColor(es);
                            es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
                        }
                        pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);
                    } else if (isStr && (es.indexOf(" ") !== -1 || es.indexOf(",") !== -1)) {
                        pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);
                    } else {
                        bn = parseFloat(bs);
                        bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : "";
                        if (bs === "" || bs === "auto") {
                            if (p === "width" || p === "height") {
                                bn = _getDimension(target, p, _cs);
                                bsfx = "px";
                            } else if (p === "left" || p === "top") {
                                bn = _calculateOffset(target, p, _cs);
                                bsfx = "px";
                            } else {
                                bn = (p !== "opacity") ? 0 : 1;
                                bsfx = "";
                            }
                        }
                        rel = (isStr && es.charAt(1) === "=");
                        if (rel) {
                            en = parseInt(es.charAt(0) + "1", 10);
                            es = es.substr(2);
                            en *= parseFloat(es);
                            esfx = es.replace(_suffixExp, "");
                        } else {
                            en = parseFloat(es);
                            esfx = isStr ? es.substr((en + "").length) || "" : "";
                        }
                        if (esfx === "") {
                            esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx;
                        }
                        es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p];
                        if (bsfx !== esfx)
                            if (esfx !== "")
                                if (en || en === 0)
                                    if (bn) {
                                        bn = _convertToPixels(target, p, bn, bsfx);
                                        if (esfx === "%") {
                                            bn /= _convertToPixels(target, p, 100, "%") / 100;
                                            if (vars.strictUnits !== true) {
                                                bs = bn + "%";
                                            }
                                        } else if (esfx === "em") {
                                            bn /= _convertToPixels(target, p, 1, "em");
                                        } else if (esfx !== "px") {
                                            en = _convertToPixels(target, p, en, esfx);
                                            esfx = "px";
                                        }
                                        if (rel)
                                            if (en || en === 0) {
                                                es = (en + bn) + esfx;
                                            }
                                    }
                        if (rel) {
                            en += bn;
                        }
                        if ((bn || bn === 0) && (en || en === 0)) {
                            pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
                            pt.xs0 = esfx;
                        } else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
                            _log("invalid " + p + " tween value: " + vars[p]);
                        } else {
                            pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
                            pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es;
                        }
                    }
                }
                if (plugin)
                    if (pt && !pt.plugin) {
                        pt.plugin = plugin;
                    }
            }
            return pt;
        };
        p.setRatio = function(v) {
            var pt = this._firstPT,
                min = 0.000001,
                val, str, i;
            if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
                while (pt) {
                    if (pt.type !== 2) {
                        pt.t[pt.p] = pt.e;
                    } else {
                        pt.setRatio(v);
                    }
                    pt = pt._next;
                }
            } else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
                while (pt) {
                    val = pt.c * v + pt.s;
                    if (pt.r) {
                        val = Math.round(val);
                    } else if (val < min)
                        if (val > -min) {
                            val = 0;
                        }
                    if (!pt.type) {
                        pt.t[pt.p] = val + pt.xs0;
                    } else if (pt.type === 1) {
                        i = pt.l;
                        if (i === 2) {
                            pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
                        } else if (i === 3) {
                            pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
                        } else if (i === 4) {
                            pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
                        } else if (i === 5) {
                            pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
                        } else {
                            str = pt.xs0 + val + pt.xs1;
                            for (i = 1; i < pt.l; i++) {
                                str += pt["xn" + i] + pt["xs" + (i + 1)];
                            }
                            pt.t[pt.p] = str;
                        }
                    } else if (pt.type === -1) {
                        pt.t[pt.p] = pt.xs0;
                    } else if (pt.setRatio) {
                        pt.setRatio(v);
                    }
                    pt = pt._next;
                }
            } else {
                while (pt) {
                    if (pt.type !== 2) {
                        pt.t[pt.p] = pt.b;
                    } else {
                        pt.setRatio(v);
                    }
                    pt = pt._next;
                }
            }
        };
        p._enableTransforms = function(threeD) {
            this._transformType = (threeD || this._transformType === 3) ? 3 : 2;
            this._transform = this._transform || _getTransform(this._target, _cs, true);
        };
        p._linkCSSP = function(pt, next, prev, remove) {
            if (pt) {
                if (next) {
                    next._prev = pt;
                }
                if (pt._next) {
                    pt._next._prev = pt._prev;
                }
                if (pt._prev) {
                    pt._prev._next = pt._next;
                } else if (this._firstPT === pt) {
                    this._firstPT = pt._next;
                    remove = true;
                }
                if (prev) {
                    prev._next = pt;
                } else if (!remove && this._firstPT === null) {
                    this._firstPT = pt;
                }
                pt._next = next;
                pt._prev = prev;
            }
            return pt;
        };
        p._kill = function(lookup) {
            var copy = lookup,
                pt, p, xfirst;
            if (lookup.autoAlpha || lookup.alpha) {
                copy = {};
                for (p in lookup) {
                    copy[p] = lookup[p];
                }
                copy.opacity = 1;
                if (copy.autoAlpha) {
                    copy.visibility = 1;
                }
            }
            if (lookup.className && (pt = this._classNamePT)) {
                xfirst = pt.xfirst;
                if (xfirst && xfirst._prev) {
                    this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev);
                } else if (xfirst === this._firstPT) {
                    this._firstPT = pt._next;
                }
                if (pt._next) {
                    this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
                }
                this._classNamePT = null;
            }
            return TweenPlugin.prototype._kill.call(this, copy);
        };
        var _getChildStyles = function(e, props, targets) {
            var children, i, child, type;
            if (e.slice) {
                i = e.length;
                while (--i > -1) {
                    _getChildStyles(e[i], props, targets);
                }
                return;
            }
            children = e.childNodes;
            i = children.length;
            while (--i > -1) {
                child = children[i];
                type = child.type;
                if (child.style) {
                    props.push(_getAllStyles(child));
                    if (targets) {
                        targets.push(child);
                    }
                }
                if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
                    _getChildStyles(child, props, targets);
                }
            }
        };
        CSSPlugin.cascadeTo = function(target, duration, vars) {
            var tween = TweenLite.to(target, duration, vars),
                results = [tween],
                b = [],
                e = [],
                targets = [],
                _reservedProps = TweenLite._internals.reservedProps,
                i, difs, p;
            target = tween._targets || tween.target;
            _getChildStyles(target, b, targets);
            tween.render(duration, true);
            _getChildStyles(target, e);
            tween.render(0, true);
            tween._enabled(true);
            i = targets.length;
            while (--i > -1) {
                difs = _cssDif(targets[i], b[i], e[i]);
                if (difs.firstMPT) {
                    difs = difs.difs;
                    for (p in vars) {
                        if (_reservedProps[p]) {
                            difs[p] = vars[p];
                        }
                    }
                    results.push(TweenLite.to(targets[i], duration, difs));
                }
            }
            return results;
        };
        TweenPlugin.activate([CSSPlugin]);
        return CSSPlugin;
    }, true);
    (function() {
        var RoundPropsPlugin = window._gsDefine.plugin({
                propName: "roundProps",
                priority: -1,
                API: 2,
                init: function(target, value, tween) {
                    this._tween = tween;
                    return true;
                }
            }),
            p = RoundPropsPlugin.prototype;
        p._onInitAllProps = function() {
            var tween = this._tween,
                rp = (tween.vars.roundProps instanceof Array) ? tween.vars.roundProps : tween.vars.roundProps.split(","),
                i = rp.length,
                lookup = {},
                rpt = tween._propLookup.roundProps,
                prop, pt, next;
            while (--i > -1) {
                lookup[rp[i]] = 1;
            }
            i = rp.length;
            while (--i > -1) {
                prop = rp[i];
                pt = tween._firstPT;
                while (pt) {
                    next = pt._next;
                    if (pt.pg) {
                        pt.t._roundProps(lookup, true);
                    } else if (pt.n === prop) {
                        this._add(pt.t, prop, pt.s, pt.c);
                        if (next) {
                            next._prev = pt._prev;
                        }
                        if (pt._prev) {
                            pt._prev._next = next;
                        } else if (tween._firstPT === pt) {
                            tween._firstPT = next;
                        }
                        pt._next = pt._prev = null;
                        tween._propLookup[prop] = rpt;
                    }
                    pt = next;
                }
            }
            return false;
        };
        p._add = function(target, p, s, c) {
            this._addTween(target, p, s, s + c, p, true);
            this._overwriteProps.push(p);
        };
    }());
    window._gsDefine.plugin({
        propName: "attr",
        API: 2,
        version: "0.3.0",
        init: function(target, value, tween) {
            var p, start, end;
            if (typeof(target.setAttribute) !== "function") {
                return false;
            }
            this._target = target;
            this._proxy = {};
            this._start = {};
            this._end = {};
            this._endRatio = tween.vars.runBackwards ? 0 : 1;
            for (p in value) {
                this._start[p] = this._proxy[p] = start = target.getAttribute(p);
                this._end[p] = end = value[p];
                this._addTween(this._proxy, p, parseFloat(start), end, p);
                this._overwriteProps.push(p);
            }
            return true;
        },
        set: function(ratio) {
            this._super.setRatio.call(this, ratio);
            var props = this._overwriteProps,
                i = props.length,
                lookup = (ratio !== 0 && ratio !== 1) ? this._proxy : (ratio === this._endRatio) ? this._end : this._start,
                p;
            while (--i > -1) {
                p = props[i];
                this._target.setAttribute(p, lookup[p] + "");
            }
        }
    })
    window._gsDefine.plugin({
        propName: "directionalRotation",
        API: 2,
        version: "0.2.0",
        init: function(target, value, tween) {
            if (typeof(value) !== "object") {
                value = {
                    rotation: value
                };
            }
            this.finals = {};
            var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
                min = 0.000001,
                p, v, start, end, dif, split;
            for (p in value) {
                if (p !== "useRadians") {
                    split = (value[p] + "").split("_");
                    v = split[0];
                    start = parseFloat((typeof(target[p]) !== "function") ? target[p] : target[((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3))]());
                    end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
                    dif = end - start;
                    if (split.length) {
                        v = split.join("_");
                        if (v.indexOf("short") !== -1) {
                            dif = dif % cap;
                            if (dif !== dif % (cap / 2)) {
                                dif = (dif < 0) ? dif + cap : dif - cap;
                            }
                        }
                        if (v.indexOf("_cw") !== -1 && dif < 0) {
                            dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
                        } else if (v.indexOf("ccw") !== -1 && dif > 0) {
                            dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
                        }
                    }
                    if (dif > min || dif < -min) {
                        this._addTween(target, p, start, start + dif, p);
                        this._overwriteProps.push(p);
                    }
                }
            }
            return true;
        },
        set: function(ratio) {
            var pt;
            if (ratio !== 1) {
                this._super.setRatio.call(this, ratio);
            } else {
                pt = this._firstPT;
                while (pt) {
                    if (pt.f) {
                        pt.t[pt.p](this.finals[pt.p]);
                    } else {
                        pt.t[pt.p] = this.finals[pt.p];
                    }
                    pt = pt._next;
                }
            }
        }
    })._autoCSS = true;
    window._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
        var w = (window.GreenSockGlobals || window),
            gs = w.com.greensock,
            _2PI = Math.PI * 2,
            _HALF_PI = Math.PI / 2,
            _class = gs._class,
            _create = function(n, f) {
                var C = _class("easing." + n, function() {}, true),
                    p = C.prototype = new Ease();
                p.constructor = C;
                p.getRatio = f;
                return C;
            },
            _easeReg = Ease.register || function() {},
            _wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
                var C = _class("easing." + name, {
                    easeOut: new EaseOut(),
                    easeIn: new EaseIn(),
                    easeInOut: new EaseInOut()
                }, true);
                _easeReg(C, name);
                return C;
            },
            EasePoint = function(time, value, next) {
                this.t = time;
                this.v = value;
                if (next) {
                    this.next = next;
                    next.prev = this;
                    this.c = next.v - value;
                    this.gap = next.t - time;
                }
            },
            _createBack = function(n, f) {
                var C = _class("easing." + n, function(overshoot) {
                        this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
                        this._p2 = this._p1 * 1.525;
                    }, true),
                    p = C.prototype = new Ease();
                p.constructor = C;
                p.getRatio = f;
                p.config = function(overshoot) {
                    return new C(overshoot);
                };
                return C;
            },
            Back = _wrap("Back", _createBack("BackOut", function(p) {
                return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
            }), _createBack("BackIn", function(p) {
                return p * p * ((this._p1 + 1) * p - this._p1);
            }), _createBack("BackInOut", function(p) {
                return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
            })),
            SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
                power = (power || power === 0) ? power : 0.7;
                if (linearRatio == null) {
                    linearRatio = 0.7;
                } else if (linearRatio > 1) {
                    linearRatio = 1;
                }
                this._p = (linearRatio !== 1) ? power : 0;
                this._p1 = (1 - linearRatio) / 2;
                this._p2 = linearRatio;
                this._p3 = this._p1 + this._p2;
                this._calcEnd = (yoyoMode === true);
            }, true),
            p = SlowMo.prototype = new Ease(),
            SteppedEase, RoughEase, _createElastic;
        p.constructor = SlowMo;
        p.getRatio = function(p) {
            var r = p + (0.5 - p) * this._p;
            if (p < this._p1) {
                return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
            } else if (p > this._p3) {
                return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
            }
            return this._calcEnd ? 1 : r;
        };
        SlowMo.ease = new SlowMo(0.7, 0.7);
        p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
            return new SlowMo(linearRatio, power, yoyoMode);
        };
        SteppedEase = _class("easing.SteppedEase", function(steps) {
            steps = steps || 1;
            this._p1 = 1 / steps;
            this._p2 = steps + 1;
        }, true);
        p = SteppedEase.prototype = new Ease();
        p.constructor = SteppedEase;
        p.getRatio = function(p) {
            if (p < 0) {
                p = 0;
            } else if (p >= 1) {
                p = 0.999999999;
            }
            return ((this._p2 * p) >> 0) * this._p1;
        };
        p.config = SteppedEase.config = function(steps) {
            return new SteppedEase(steps);
        };
        RoughEase = _class("easing.RoughEase", function(vars) {
            vars = vars || {};
            var taper = vars.taper || "none",
                a = [],
                cnt = 0,
                points = (vars.points || 20) | 0,
                i = points,
                randomize = (vars.randomize !== false),
                clamp = (vars.clamp === true),
                template = (vars.template instanceof Ease) ? vars.template : null,
                strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
                x, y, bump, invX, obj, pnt;
            while (--i > -1) {
                x = randomize ? Math.random() : (1 / points) * i;
                y = template ? template.getRatio(x) : x;
                if (taper === "none") {
                    bump = strength;
                } else if (taper === "out") {
                    invX = 1 - x;
                    bump = invX * invX * strength;
                } else if (taper === "in") {
                    bump = x * x * strength;
                } else if (x < 0.5) {
                    invX = x * 2;
                    bump = invX * invX * 0.5 * strength;
                } else {
                    invX = (1 - x) * 2;
                    bump = invX * invX * 0.5 * strength;
                }
                if (randomize) {
                    y += (Math.random() * bump) - (bump * 0.5);
                } else if (i % 2) {
                    y += bump * 0.5;
                } else {
                    y -= bump * 0.5;
                }
                if (clamp) {
                    if (y > 1) {
                        y = 1;
                    } else if (y < 0) {
                        y = 0;
                    }
                }
                a[cnt++] = {
                    x: x,
                    y: y
                };
            }
            a.sort(function(a, b) {
                return a.x - b.x;
            });
            pnt = new EasePoint(1, 1, null);
            i = points;
            while (--i > -1) {
                obj = a[i];
                pnt = new EasePoint(obj.x, obj.y, pnt);
            }
            this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
        }, true);
        p = RoughEase.prototype = new Ease();
        p.constructor = RoughEase;
        p.getRatio = function(p) {
            var pnt = this._prev;
            if (p > pnt.t) {
                while (pnt.next && p >= pnt.t) {
                    pnt = pnt.next;
                }
                pnt = pnt.prev;
            } else {
                while (pnt.prev && p <= pnt.t) {
                    pnt = pnt.prev;
                }
            }
            this._prev = pnt;
            return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
        };
        p.config = function(vars) {
            return new RoughEase(vars);
        };
        RoughEase.ease = new RoughEase();
        _wrap("Bounce", _create("BounceOut", function(p) {
            if (p < 1 / 2.75) {
                return 7.5625 * p * p;
            } else if (p < 2 / 2.75) {
                return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            } else if (p < 2.5 / 2.75) {
                return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }
            return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }), _create("BounceIn", function(p) {
            if ((p = 1 - p) < 1 / 2.75) {
                return 1 - (7.5625 * p * p);
            } else if (p < 2 / 2.75) {
                return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
            } else if (p < 2.5 / 2.75) {
                return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
            }
            return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
        }), _create("BounceInOut", function(p) {
            var invert = (p < 0.5);
            if (invert) {
                p = 1 - (p * 2);
            } else {
                p = (p * 2) - 1;
            }
            if (p < 1 / 2.75) {
                p = 7.5625 * p * p;
            } else if (p < 2 / 2.75) {
                p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            } else if (p < 2.5 / 2.75) {
                p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            } else {
                p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
            }
            return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
        }));
        _wrap("Circ", _create("CircOut", function(p) {
            return Math.sqrt(1 - (p = p - 1) * p);
        }), _create("CircIn", function(p) {
            return -(Math.sqrt(1 - (p * p)) - 1);
        }), _create("CircInOut", function(p) {
            return ((p *= 2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
        }));
        _createElastic = function(n, f, def) {
            var C = _class("easing." + n, function(amplitude, period) {
                    this._p1 = amplitude || 1;
                    this._p2 = period || def;
                    this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
                }, true),
                p = C.prototype = new Ease();
            p.constructor = C;
            p.getRatio = f;
            p.config = function(amplitude, period) {
                return new C(amplitude, period);
            };
            return C;
        };
        _wrap("Elastic", _createElastic("ElasticOut", function(p) {
            return this._p1 * Math.pow(2, -10 * p) * Math.sin((p - this._p3) * _2PI / this._p2) + 1;
        }, 0.3), _createElastic("ElasticIn", function(p) {
            return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * _2PI / this._p2));
        }, 0.3), _createElastic("ElasticInOut", function(p) {
            return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * _2PI / this._p2)) : this._p1 * Math.pow(2, -10 * (p -= 1)) * Math.sin((p - this._p3) * _2PI / this._p2) * 0.5 + 1;
        }, 0.45));
        _wrap("Expo", _create("ExpoOut", function(p) {
            return 1 - Math.pow(2, -10 * p);
        }), _create("ExpoIn", function(p) {
            return Math.pow(2, 10 * (p - 1)) - 0.001;
        }), _create("ExpoInOut", function(p) {
            return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
        }));
        _wrap("Sine", _create("SineOut", function(p) {
            return Math.sin(p * _HALF_PI);
        }), _create("SineIn", function(p) {
            return -Math.cos(p * _HALF_PI) + 1;
        }), _create("SineInOut", function(p) {
            return -0.5 * (Math.cos(Math.PI * p) - 1);
        }));
        _class("easing.EaseLookup", {
            find: function(s) {
                return Ease.map[s];
            }
        }, true);
        _easeReg(w.SlowMo, "SlowMo", "ease,");
        _easeReg(RoughEase, "RoughEase", "ease,");
        _easeReg(SteppedEase, "SteppedEase", "ease,");
        return Back;
    }, true);
});
(function(window) {
    "use strict";
    var _globals = window.GreenSockGlobals || window;
    if (_globals.TweenLite) {
        return;
    }
    var _namespace = function(ns) {
            var a = ns.split("."),
                p = _globals,
                i;
            for (i = 0; i < a.length; i++) {
                p[a[i]] = p = p[a[i]] || {};
            }
            return p;
        },
        gs = _namespace("com.greensock"),
        _tinyNum = 0.0000000001,
        _slice = [].slice,
        _emptyFunc = function() {},
        _isArray = (function() {
            var toString = Object.prototype.toString,
                array = toString.call([]);
            return function(obj) {
                return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
            };
        }()),
        a, i, p, _ticker, _tickerActive, _defLookup = {},
        Definition = function(ns, dependencies, func, global) {
            this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : [];
            _defLookup[ns] = this;
            this.gsClass = null;
            this.func = func;
            var _classes = [];
            this.check = function(init) {
                var i = dependencies.length,
                    missing = i,
                    cur, a, n, cl;
                while (--i > -1) {
                    if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
                        _classes[i] = cur.gsClass;
                        missing--;
                    } else if (init) {
                        cur.sc.push(this);
                    }
                }
                if (missing === 0 && func) {
                    a = ("com.greensock." + ns).split(".");
                    n = a.pop();
                    cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);
                    if (global) {
                        _globals[n] = cl;
                        if (typeof(define) === "function" && define.amd) {
                            define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").join("/"), [], function() {
                                return cl;
                            });
                        } else if (typeof(module) !== "undefined" && module.exports) {
                            module.exports = cl;
                        }
                    }
                    for (i = 0; i < this.sc.length; i++) {
                        this.sc[i].check();
                    }
                }
            };
            this.check(true);
        },
        _gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
            return new Definition(ns, dependencies, func, global);
        },
        _class = gs._class = function(ns, func, global) {
            func = func || function() {};
            _gsDefine(ns, [], function() {
                return func;
            }, global);
            return func;
        };
    _gsDefine.globals = _globals;
    var _baseParams = [0, 0, 1, 1],
        _blankArray = [],
        Ease = _class("easing.Ease", function(func, extraParams, type, power) {
            this._func = func;
            this._type = type || 0;
            this._power = power || 0;
            this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
        }, true),
        _easeMap = Ease.map = {},
        _easeReg = Ease.register = function(ease, names, types, create) {
            var na = names.split(","),
                i = na.length,
                ta = (types || "easeIn,easeOut,easeInOut").split(","),
                e, name, j, type;
            while (--i > -1) {
                name = na[i];
                e = create ? _class("easing." + name, null, true) : gs.easing[name] || {};
                j = ta.length;
                while (--j > -1) {
                    type = ta[j];
                    _easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
                }
            }
        };
    p = Ease.prototype;
    p._calcEnd = false;
    p.getRatio = function(p) {
        if (this._func) {
            this._params[0] = p;
            return this._func.apply(null, this._params);
        }
        var t = this._type,
            pw = this._power,
            r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
        if (pw === 1) {
            r *= r;
        } else if (pw === 2) {
            r *= r * r;
        } else if (pw === 3) {
            r *= r * r * r;
        } else if (pw === 4) {
            r *= r * r * r * r;
        }
        return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
    };
    a = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
    i = a.length;
    while (--i > -1) {
        p = a[i] + ",Power" + i;
        _easeReg(new Ease(null, null, 1, i), p, "easeOut", true);
        _easeReg(new Ease(null, null, 2, i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
        _easeReg(new Ease(null, null, 3, i), p, "easeInOut");
    }
    _easeMap.linear = gs.easing.Linear.easeIn;
    _easeMap.swing = gs.easing.Quad.easeInOut;
    var EventDispatcher = _class("events.EventDispatcher", function(target) {
        this._listeners = {};
        this._eventTarget = target || this;
    });
    p = EventDispatcher.prototype;
    p.addEventListener = function(type, callback, scope, useParam, priority) {
        priority = priority || 0;
        var list = this._listeners[type],
            index = 0,
            listener, i;
        if (list == null) {
            this._listeners[type] = list = [];
        }
        i = list.length;
        while (--i > -1) {
            listener = list[i];
            if (listener.c === callback && listener.s === scope) {
                list.splice(i, 1);
            } else if (index === 0 && listener.pr < priority) {
                index = i + 1;
            }
        }
        list.splice(index, 0, {
            c: callback,
            s: scope,
            up: useParam,
            pr: priority
        });
        if (this === _ticker && !_tickerActive) {
            _ticker.wake();
        }
    };
    p.removeEventListener = function(type, callback) {
        var list = this._listeners[type],
            i;
        if (list) {
            i = list.length;
            while (--i > -1) {
                if (list[i].c === callback) {
                    list.splice(i, 1);
                    return;
                }
            }
        }
    };
    p.dispatchEvent = function(type) {
        var list = this._listeners[type],
            i, t, listener;
        if (list) {
            i = list.length;
            t = this._eventTarget;
            while (--i > -1) {
                listener = list[i];
                if (listener.up) {
                    listener.c.call(listener.s || t, {
                        type: type,
                        target: t
                    });
                } else {
                    listener.c.call(listener.s || t);
                }
            }
        }
    };
    var _reqAnimFrame = window.requestAnimationFrame,
        _cancelAnimFrame = window.cancelAnimationFrame,
        _getTime = Date.now || function() {
            return new Date().getTime();
        },
        _lastUpdate = _getTime();
    a = ["ms", "moz", "webkit", "o"];
    i = a.length;
    while (--i > -1 && !_reqAnimFrame) {
        _reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
        _cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
    }
    _class("Ticker", function(fps, useRAF) {
        var _self = this,
            _startTime = _getTime(),
            _useRAF = (useRAF !== false && _reqAnimFrame),
            _fps, _req, _id, _gap, _nextTime, _tick = function(manual) {
                _lastUpdate = _getTime();
                _self.time = (_lastUpdate - _startTime) / 1000;
                var overlap = _self.time - _nextTime,
                    dispatch;
                if (!_fps || overlap > 0 || manual === true) {
                    _self.frame++;
                    _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
                    dispatch = true;
                }
                if (manual !== true) {
                    _id = _req(_tick);
                }
                if (dispatch) {
                    _self.dispatchEvent("tick");
                }
            };
        EventDispatcher.call(_self);
        _self.time = _self.frame = 0;
        _self.tick = function() {
            _tick(true);
        };
        _self.sleep = function() {
            if (_id == null) {
                return;
            }
            if (!_useRAF || !_cancelAnimFrame) {
                clearTimeout(_id);
            } else {
                _cancelAnimFrame(_id);
            }
            _req = _emptyFunc;
            _id = null;
            if (_self === _ticker) {
                _tickerActive = false;
            }
        };
        _self.wake = function() {
            if (_id !== null) {
                _self.sleep();
            }
            _req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) {
                return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0);
            } : _reqAnimFrame;
            if (_self === _ticker) {
                _tickerActive = true;
            }
            _tick(2);
        };
        _self.fps = function(value) {
            if (!arguments.length) {
                return _fps;
            }
            _fps = value;
            _gap = 1 / (_fps || 60);
            _nextTime = this.time + _gap;
            _self.wake();
        };
        _self.useRAF = function(value) {
            if (!arguments.length) {
                return _useRAF;
            }
            _self.sleep();
            _useRAF = value;
            _self.fps(_fps);
        };
        _self.fps(fps);
        setTimeout(function() {
            if (_useRAF && (!_id || _self.frame < 5)) {
                _self.useRAF(false);
            }
        }, 1500);
    });
    p = gs.Ticker.prototype = new gs.events.EventDispatcher();
    p.constructor = gs.Ticker;
    var Animation = _class("core.Animation", function(duration, vars) {
        this.vars = vars = vars || {};
        this._duration = this._totalDuration = duration || 0;
        this._delay = Number(vars.delay) || 0;
        this._timeScale = 1;
        this._active = (vars.immediateRender === true);
        this.data = vars.data;
        this._reversed = (vars.reversed === true);
        if (!_rootTimeline) {
            return;
        }
        if (!_tickerActive) {
            _ticker.wake();
        }
        var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
        tl.add(this, tl._time);
        if (this.vars.paused) {
            this.paused(true);
        }
    });
    _ticker = Animation.ticker = new gs.Ticker();
    p = Animation.prototype;
    p._dirty = p._gc = p._initted = p._paused = false;
    p._totalTime = p._time = 0;
    p._rawPrevTime = -1;
    p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
    p._paused = false;
    var _checkTimeout = function() {
        if (_tickerActive && _getTime() - _lastUpdate > 2000) {
            _ticker.wake();
        }
        setTimeout(_checkTimeout, 2000);
    };
    _checkTimeout();
    p.play = function(from, suppressEvents) {
        if (from != null) {
            this.seek(from, suppressEvents);
        }
        return this.reversed(false).paused(false);
    };
    p.pause = function(atTime, suppressEvents) {
        if (atTime != null) {
            this.seek(atTime, suppressEvents);
        }
        return this.paused(true);
    };
    p.resume = function(from, suppressEvents) {
        if (from != null) {
            this.seek(from, suppressEvents);
        }
        return this.paused(false);
    };
    p.seek = function(time, suppressEvents) {
        return this.totalTime(Number(time), suppressEvents !== false);
    };
    p.restart = function(includeDelay, suppressEvents) {
        return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
    };
    p.reverse = function(from, suppressEvents) {
        if (from != null) {
            this.seek((from || this.totalDuration()), suppressEvents);
        }
        return this.reversed(true).paused(false);
    };
    p.render = function(time, suppressEvents, force) {};
    p.invalidate = function() {
        return this;
    };
    p.isActive = function() {
        var tl = this._timeline,
            startTime = this._startTime,
            rawTime;
        return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
    };
    p._enabled = function(enabled, ignoreTimeline) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        this._gc = !enabled;
        this._active = this.isActive();
        if (ignoreTimeline !== true) {
            if (enabled && !this.timeline) {
                this._timeline.add(this, this._startTime - this._delay);
            } else if (!enabled && this.timeline) {
                this._timeline._remove(this, true);
            }
        }
        return false;
    };
    p._kill = function(vars, target) {
        return this._enabled(false, false);
    };
    p.kill = function(vars, target) {
        this._kill(vars, target);
        return this;
    };
    p._uncache = function(includeSelf) {
        var tween = includeSelf ? this : this.timeline;
        while (tween) {
            tween._dirty = true;
            tween = tween.timeline;
        }
        return this;
    };
    p._swapSelfInParams = function(params) {
        var i = params.length,
            copy = params.concat();
        while (--i > -1) {
            if (params[i] === "{self}") {
                copy[i] = this;
            }
        }
        return copy;
    };
    p.eventCallback = function(type, callback, params, scope) {
        if ((type || "").substr(0, 2) === "on") {
            var v = this.vars;
            if (arguments.length === 1) {
                return v[type];
            }
            if (callback == null) {
                delete v[type];
            } else {
                v[type] = callback;
                v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
                v[type + "Scope"] = scope;
            }
            if (type === "onUpdate") {
                this._onUpdate = callback;
            }
        }
        return this;
    };
    p.delay = function(value) {
        if (!arguments.length) {
            return this._delay;
        }
        if (this._timeline.smoothChildTiming) {
            this.startTime(this._startTime + value - this._delay);
        }
        this._delay = value;
        return this;
    };
    p.duration = function(value) {
        if (!arguments.length) {
            this._dirty = false;
            return this._duration;
        }
        this._duration = this._totalDuration = value;
        this._uncache(true);
        if (this._timeline.smoothChildTiming)
            if (this._time > 0)
                if (this._time < this._duration)
                    if (value !== 0) {
                        this.totalTime(this._totalTime * (value / this._duration), true);
                    }
        return this;
    };
    p.totalDuration = function(value) {
        this._dirty = false;
        return (!arguments.length) ? this._totalDuration : this.duration(value);
    };
    p.time = function(value, suppressEvents) {
        if (!arguments.length) {
            return this._time;
        }
        if (this._dirty) {
            this.totalDuration();
        }
        return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
    };
    p.totalTime = function(time, suppressEvents, uncapped) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        if (!arguments.length) {
            return this._totalTime;
        }
        if (this._timeline) {
            if (time < 0 && !uncapped) {
                time += this.totalDuration();
            }
            if (this._timeline.smoothChildTiming) {
                if (this._dirty) {
                    this.totalDuration();
                }
                var totalDuration = this._totalDuration,
                    tl = this._timeline;
                if (time > totalDuration && !uncapped) {
                    time = totalDuration;
                }
                this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
                if (!tl._dirty) {
                    this._uncache(false);
                }
                if (tl._timeline) {
                    while (tl._timeline) {
                        if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
                            tl.totalTime(tl._totalTime, true);
                        }
                        tl = tl._timeline;
                    }
                }
            }
            if (this._gc) {
                this._enabled(true, false);
            }
            if (this._totalTime !== time || this._duration === 0) {
                this.render(time, suppressEvents, false);
            }
        }
        return this;
    };
    p.progress = p.totalProgress = function(value, suppressEvents) {
        return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * value, suppressEvents);
    };
    p.startTime = function(value) {
        if (!arguments.length) {
            return this._startTime;
        }
        if (value !== this._startTime) {
            this._startTime = value;
            if (this.timeline)
                if (this.timeline._sortChildren) {
                    this.timeline.add(this, value - this._delay);
                }
        }
        return this;
    };
    p.timeScale = function(value) {
        if (!arguments.length) {
            return this._timeScale;
        }
        value = value || _tinyNum;
        if (this._timeline && this._timeline.smoothChildTiming) {
            var pauseTime = this._pauseTime,
                t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
            this._startTime = t - ((t - this._startTime) * this._timeScale / value);
        }
        this._timeScale = value;
        return this._uncache(false);
    };
    p.reversed = function(value) {
        if (!arguments.length) {
            return this._reversed;
        }
        if (value != this._reversed) {
            this._reversed = value;
            this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
        }
        return this;
    };
    p.paused = function(value) {
        if (!arguments.length) {
            return this._paused;
        }
        if (value != this._paused)
            if (this._timeline) {
                if (!_tickerActive && !value) {
                    _ticker.wake();
                }
                var tl = this._timeline,
                    raw = tl.rawTime(),
                    elapsed = raw - this._pauseTime;
                if (!value && tl.smoothChildTiming) {
                    this._startTime += elapsed;
                    this._uncache(false);
                }
                this._pauseTime = value ? raw : null;
                this._paused = value;
                this._active = this.isActive();
                if (!value && elapsed !== 0 && this._initted && this.duration()) {
                    this.render((tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale), true, true);
                }
            }
        if (this._gc && !value) {
            this._enabled(true, false);
        }
        return this;
    };
    var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
        Animation.call(this, 0, vars);
        this.autoRemoveChildren = this.smoothChildTiming = true;
    });
    p = SimpleTimeline.prototype = new Animation();
    p.constructor = SimpleTimeline;
    p.kill()._gc = false;
    p._first = p._last = null;
    p._sortChildren = false;
    p.add = p.insert = function(child, position, align, stagger) {
        var prevTween, st;
        child._startTime = Number(position || 0) + child._delay;
        if (child._paused)
            if (this !== child._timeline) {
                child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
            }
        if (child.timeline) {
            child.timeline._remove(child, true);
        }
        child.timeline = child._timeline = this;
        if (child._gc) {
            child._enabled(true, true);
        }
        prevTween = this._last;
        if (this._sortChildren) {
            st = child._startTime;
            while (prevTween && prevTween._startTime > st) {
                prevTween = prevTween._prev;
            }
        }
        if (prevTween) {
            child._next = prevTween._next;
            prevTween._next = child;
        } else {
            child._next = this._first;
            this._first = child;
        }
        if (child._next) {
            child._next._prev = child;
        } else {
            this._last = child;
        }
        child._prev = prevTween;
        if (this._timeline) {
            this._uncache(true);
        }
        return this;
    };
    p._remove = function(tween, skipDisable) {
        if (tween.timeline === this) {
            if (!skipDisable) {
                tween._enabled(false, true);
            }
            tween.timeline = null;
            if (tween._prev) {
                tween._prev._next = tween._next;
            } else if (this._first === tween) {
                this._first = tween._next;
            }
            if (tween._next) {
                tween._next._prev = tween._prev;
            } else if (this._last === tween) {
                this._last = tween._prev;
            }
            if (this._timeline) {
                this._uncache(true);
            }
        }
        return this;
    };
    p.render = function(time, suppressEvents, force) {
        var tween = this._first,
            next;
        this._totalTime = this._time = this._rawPrevTime = time;
        while (tween) {
            next = tween._next;
            if (tween._active || (time >= tween._startTime && !tween._paused)) {
                if (!tween._reversed) {
                    tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                } else {
                    tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                }
            }
            tween = next;
        }
    };
    p.rawTime = function() {
        if (!_tickerActive) {
            _ticker.wake();
        }
        return this._totalTime;
    };
    var TweenLite = _class("TweenLite", function(target, duration, vars) {
            Animation.call(this, duration, vars);
            this.render = TweenLite.prototype.render;
            if (target == null) {
                throw "Cannot tween a null target.";
            }
            this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
            var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
                overwrite = this.vars.overwrite,
                i, targ, targets;
            this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];
            if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
                this._targets = targets = _slice.call(target, 0);
                this._propLookup = [];
                this._siblings = [];
                for (i = 0; i < targets.length; i++) {
                    targ = targets[i];
                    if (!targ) {
                        targets.splice(i--, 1);
                        continue;
                    } else if (typeof(targ) === "string") {
                        targ = targets[i--] = TweenLite.selector(targ);
                        if (typeof(targ) === "string") {
                            targets.splice(i + 1, 1);
                        }
                        continue;
                    } else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) {
                        targets.splice(i--, 1);
                        this._targets = targets = targets.concat(_slice.call(targ, 0));
                        continue;
                    }
                    this._siblings[i] = _register(targ, this, false);
                    if (overwrite === 1)
                        if (this._siblings[i].length > 1) {
                            _applyOverwrite(targ, this, null, 1, this._siblings[i]);
                        }
                }
            } else {
                this._propLookup = {};
                this._siblings = _register(target, this, false);
                if (overwrite === 1)
                    if (this._siblings.length > 1) {
                        _applyOverwrite(target, this, null, 1, this._siblings);
                    }
            }
            if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
                this.render(-this._delay, false, true);
            }
        }, true),
        _isSelector = function(v) {
            return (v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType)));
        },
        _autoCSS = function(vars, target) {
            var css = {},
                p;
            for (p in vars) {
                if (!_reservedProps[p] && (!(p in target) || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) {
                    css[p] = vars[p];
                    delete vars[p];
                }
            }
            vars.css = css;
        };
    p = TweenLite.prototype = new Animation();
    p.constructor = TweenLite;
    p.kill()._gc = false;
    p.ratio = 0;
    p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
    p._notifyPluginsOfEnabled = false;
    TweenLite.version = "1.11.8";
    TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
    TweenLite.defaultOverwrite = "auto";
    TweenLite.ticker = _ticker;
    TweenLite.autoSleep = true;
    TweenLite.selector = window.$ || window.jQuery || function(e) {
        if (window.$) {
            TweenLite.selector = window.$;
            return window.$(e);
        }
        return window.document ? window.document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e) : e;
    };
    var _internals = TweenLite._internals = {
            isArray: _isArray,
            isSelector: _isSelector
        },
        _plugins = TweenLite._plugins = {},
        _tweenLookup = TweenLite._tweenLookup = {},
        _tweenLookupNum = 0,
        _reservedProps = _internals.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1
        },
        _overwriteLookup = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            "true": 1,
            "false": 0
        },
        _rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
        _rootTimeline = Animation._rootTimeline = new SimpleTimeline();
    _rootTimeline._startTime = _ticker.time;
    _rootFramesTimeline._startTime = _ticker.frame;
    _rootTimeline._active = _rootFramesTimeline._active = true;
    Animation._updateRoot = function() {
        _rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
        _rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
        if (!(_ticker.frame % 120)) {
            var i, a, p;
            for (p in _tweenLookup) {
                a = _tweenLookup[p].tweens;
                i = a.length;
                while (--i > -1) {
                    if (a[i]._gc) {
                        a.splice(i, 1);
                    }
                }
                if (a.length === 0) {
                    delete _tweenLookup[p];
                }
            }
            p = _rootTimeline._first;
            if (!p || p._paused)
                if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
                    while (p && p._paused) {
                        p = p._next;
                    }
                    if (!p) {
                        _ticker.sleep();
                    }
                }
        }
    };
    _ticker.addEventListener("tick", Animation._updateRoot);
    var _register = function(target, tween, scrub) {
            var id = target._gsTweenID,
                a, i;
            if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
                _tweenLookup[id] = {
                    target: target,
                    tweens: []
                };
            }
            if (tween) {
                a = _tweenLookup[id].tweens;
                a[(i = a.length)] = tween;
                if (scrub) {
                    while (--i > -1) {
                        if (a[i] === tween) {
                            a.splice(i, 1);
                        }
                    }
                }
            }
            return _tweenLookup[id].tweens;
        },
        _applyOverwrite = function(target, tween, props, mode, siblings) {
            var i, changed, curTween, l;
            if (mode === 1 || mode >= 4) {
                l = siblings.length;
                for (i = 0; i < l; i++) {
                    if ((curTween = siblings[i]) !== tween) {
                        if (!curTween._gc)
                            if (curTween._enabled(false, false)) {
                                changed = true;
                            }
                    } else if (mode === 5) {
                        break;
                    }
                }
                return changed;
            }
            var startTime = tween._startTime + _tinyNum,
                overlaps = [],
                oCount = 0,
                zeroDur = (tween._duration === 0),
                globalStart;
            i = siblings.length;
            while (--i > -1) {
                if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {} else if (curTween._timeline !== tween._timeline) {
                    globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
                    if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
                        overlaps[oCount++] = curTween;
                    }
                } else if (curTween._startTime <= startTime)
                    if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime)
                        if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
                            overlaps[oCount++] = curTween;
                        }
            }
            i = oCount;
            while (--i > -1) {
                curTween = overlaps[i];
                if (mode === 2)
                    if (curTween._kill(props, target)) {
                        changed = true;
                    }
                if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
                    if (curTween._enabled(false, false)) {
                        changed = true;
                    }
                }
            }
            return changed;
        },
        _checkOverlap = function(tween, reference, zeroDur) {
            var tl = tween._timeline,
                ts = tl._timeScale,
                t = tween._startTime;
            while (tl._timeline) {
                t += tl._startTime;
                ts *= tl._timeScale;
                if (tl._paused) {
                    return -100;
                }
                tl = tl._timeline;
            }
            t /= ts;
            return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
        };
    p._init = function() {
        var v = this.vars,
            op = this._overwrittenProps,
            dur = this._duration,
            immediate = v.immediateRender,
            ease = v.ease,
            i, initPlugins, pt, p;
        if (v.startAt) {
            if (this._startAt) {
                this._startAt.render(-1, true);
            }
            v.startAt.overwrite = 0;
            v.startAt.immediateRender = true;
            this._startAt = TweenLite.to(this.target, 0, v.startAt);
            if (immediate) {
                if (this._time > 0) {
                    this._startAt = null;
                } else if (dur !== 0) {
                    return;
                }
            }
        } else if (v.runBackwards && dur !== 0) {
            if (this._startAt) {
                this._startAt.render(-1, true);
                this._startAt = null;
            } else {
                pt = {};
                for (p in v) {
                    if (!_reservedProps[p] || p === "autoCSS") {
                        pt[p] = v[p];
                    }
                }
                pt.overwrite = 0;
                pt.data = "isFromStart";
                this._startAt = TweenLite.to(this.target, 0, pt);
                if (!v.immediateRender) {
                    this._startAt.render(-1, true);
                } else if (this._time === 0) {
                    return;
                }
            }
        }
        if (!ease) {
            this._ease = TweenLite.defaultEase;
        } else if (ease instanceof Ease) {
            this._ease = (v.easeParams instanceof Array) ? ease.config.apply(ease, v.easeParams) : ease;
        } else {
            this._ease = (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
        }
        this._easeType = this._ease._type;
        this._easePower = this._ease._power;
        this._firstPT = null;
        if (this._targets) {
            i = this._targets.length;
            while (--i > -1) {
                if (this._initProps(this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null))) {
                    initPlugins = true;
                }
            }
        } else {
            initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
        }
        if (initPlugins) {
            TweenLite._onPluginEvent("_onInitAllProps", this);
        }
        if (op)
            if (!this._firstPT)
                if (typeof(this.target) !== "function") {
                    this._enabled(false, false);
                }
        if (v.runBackwards) {
            pt = this._firstPT;
            while (pt) {
                pt.s += pt.c;
                pt.c = -pt.c;
                pt = pt._next;
            }
        }
        this._onUpdate = v.onUpdate;
        this._initted = true;
    };
    p._initProps = function(target, propLookup, siblings, overwrittenProps) {
        var p, i, initPlugins, plugin, pt, v;
        if (target == null) {
            return false;
        }
        if (!this.vars.css)
            if (target.style)
                if (target !== window && target.nodeType)
                    if (_plugins.css)
                        if (this.vars.autoCSS !== false) {
                            _autoCSS(this.vars, target);
                        }
        for (p in this.vars) {
            v = this.vars[p];
            if (_reservedProps[p]) {
                if (v)
                    if ((v instanceof Array) || (v.push && _isArray(v)))
                        if (v.join("").indexOf("{self}") !== -1) {
                            this.vars[p] = v = this._swapSelfInParams(v, this);
                        }
            } else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {
                this._firstPT = pt = {
                    _next: this._firstPT,
                    t: plugin,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: true,
                    n: p,
                    pg: true,
                    pr: plugin._priority
                };
                i = plugin._overwriteProps.length;
                while (--i > -1) {
                    propLookup[plugin._overwriteProps[i]] = this._firstPT;
                }
                if (plugin._priority || plugin._onInitAllProps) {
                    initPlugins = true;
                }
                if (plugin._onDisable || plugin._onEnable) {
                    this._notifyPluginsOfEnabled = true;
                }
            } else {
                this._firstPT = propLookup[p] = pt = {
                    _next: this._firstPT,
                    t: target,
                    p: p,
                    f: (typeof(target[p]) === "function"),
                    n: p,
                    pg: false,
                    pr: 0
                };
                pt.s = (!pt.f) ? parseFloat(target[p]) : target[((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3))]();
                pt.c = (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : (Number(v) - pt.s) || 0;
            }
            if (pt)
                if (pt._next) {
                    pt._next._prev = pt;
                }
        }
        if (overwrittenProps)
            if (this._kill(overwrittenProps, target)) {
                return this._initProps(target, propLookup, siblings, overwrittenProps);
            }
        if (this._overwrite > 1)
            if (this._firstPT)
                if (siblings.length > 1)
                    if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
                        this._kill(propLookup, target);
                        return this._initProps(target, propLookup, siblings, overwrittenProps);
                    }
        return initPlugins;
    };
    p.render = function(time, suppressEvents, force) {
        var prevTime = this._time,
            duration = this._duration,
            isComplete, callback, pt, rawPrevTime;
        if (time >= duration) {
            this._totalTime = this._time = duration;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
            if (!this._reversed) {
                isComplete = true;
                callback = "onComplete";
            }
            if (duration === 0) {
                rawPrevTime = this._rawPrevTime;
                if (this._startTime === this._timeline._duration) {
                    time = 0;
                }
                if (time === 0 || rawPrevTime < 0 || rawPrevTime === _tinyNum)
                    if (rawPrevTime !== time) {
                        force = true;
                        if (rawPrevTime > _tinyNum) {
                            callback = "onReverseComplete";
                        }
                    }
                this._rawPrevTime = rawPrevTime = (!suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
            }
        } else if (time < 0.0000001) {
            this._totalTime = this._time = 0;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
            if (prevTime !== 0 || (duration === 0 && this._rawPrevTime > 0 && this._rawPrevTime !== _tinyNum)) {
                callback = "onReverseComplete";
                isComplete = this._reversed;
            }
            if (time < 0) {
                this._active = false;
                if (duration === 0) {
                    if (this._rawPrevTime >= 0) {
                        force = true;
                    }
                    this._rawPrevTime = rawPrevTime = (!suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum;
                }
            } else if (!this._initted) {
                force = true;
            }
        } else {
            this._totalTime = this._time = time;
            if (this._easeType) {
                var r = time / duration,
                    type = this._easeType,
                    pow = this._easePower;
                if (type === 1 || (type === 3 && r >= 0.5)) {
                    r = 1 - r;
                }
                if (type === 3) {
                    r *= 2;
                }
                if (pow === 1) {
                    r *= r;
                } else if (pow === 2) {
                    r *= r * r;
                } else if (pow === 3) {
                    r *= r * r * r;
                } else if (pow === 4) {
                    r *= r * r * r * r;
                }
                if (type === 1) {
                    this.ratio = 1 - r;
                } else if (type === 2) {
                    this.ratio = r;
                } else if (time / duration < 0.5) {
                    this.ratio = r / 2;
                } else {
                    this.ratio = 1 - (r / 2);
                }
            } else {
                this.ratio = this._ease.getRatio(time / duration);
            }
        }
        if (this._time === prevTime && !force) {
            return;
        } else if (!this._initted) {
            this._init();
            if (!this._initted || this._gc) {
                return;
            }
            if (this._time && !isComplete) {
                this.ratio = this._ease.getRatio(this._time / duration);
            } else if (isComplete && this._ease._calcEnd) {
                this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
            }
        }
        if (!this._active)
            if (!this._paused && this._time !== prevTime && time >= 0) {
                this._active = true;
            }
        if (prevTime === 0) {
            if (this._startAt) {
                if (time >= 0) {
                    this._startAt.render(time, suppressEvents, force);
                } else if (!callback) {
                    callback = "_dummyGS";
                }
            }
            if (this.vars.onStart)
                if (this._time !== 0 || duration === 0)
                    if (!suppressEvents) {
                        this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
                    }
        }
        pt = this._firstPT;
        while (pt) {
            if (pt.f) {
                pt.t[pt.p](pt.c * this.ratio + pt.s);
            } else {
                pt.t[pt.p] = pt.c * this.ratio + pt.s;
            }
            pt = pt._next;
        }
        if (this._onUpdate) {
            if (time < 0)
                if (this._startAt && this._startTime) {
                    this._startAt.render(time, suppressEvents, force);
                }
            if (!suppressEvents)
                if (this._time !== prevTime || isComplete) {
                    this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
                }
        }
        if (callback)
            if (!this._gc) {
                if (time < 0 && this._startAt && !this._onUpdate && this._startTime) {
                    this._startAt.render(time, suppressEvents, force);
                }
                if (isComplete) {
                    if (this._timeline.autoRemoveChildren) {
                        this._enabled(false, false);
                    }
                    this._active = false;
                }
                if (!suppressEvents && this.vars[callback]) {
                    this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
                }
                if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
                    this._rawPrevTime = 0;
                }
            }
    };
    p._kill = function(vars, target) {
        if (vars === "all") {
            vars = null;
        }
        if (vars == null)
            if (target == null || target === this.target) {
                return this._enabled(false, false);
            }
        target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
        var i, overwrittenProps, p, pt, propLookup, changed, killProps, record;
        if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
            i = target.length;
            while (--i > -1) {
                if (this._kill(vars, target[i])) {
                    changed = true;
                }
            }
        } else {
            if (this._targets) {
                i = this._targets.length;
                while (--i > -1) {
                    if (target === this._targets[i]) {
                        propLookup = this._propLookup[i] || {};
                        this._overwrittenProps = this._overwrittenProps || [];
                        overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
                        break;
                    }
                }
            } else if (target !== this.target) {
                return false;
            } else {
                propLookup = this._propLookup;
                overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
            }
            if (propLookup) {
                killProps = vars || propLookup;
                record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill));
                for (p in killProps) {
                    if ((pt = propLookup[p])) {
                        if (pt.pg && pt.t._kill(killProps)) {
                            changed = true;
                        }
                        if (!pt.pg || pt.t._overwriteProps.length === 0) {
                            if (pt._prev) {
                                pt._prev._next = pt._next;
                            } else if (pt === this._firstPT) {
                                this._firstPT = pt._next;
                            }
                            if (pt._next) {
                                pt._next._prev = pt._prev;
                            }
                            pt._next = pt._prev = null;
                        }
                        delete propLookup[p];
                    }
                    if (record) {
                        overwrittenProps[p] = 1;
                    }
                }
                if (!this._firstPT && this._initted) {
                    this._enabled(false, false);
                }
            }
        }
        return changed;
    };
    p.invalidate = function() {
        if (this._notifyPluginsOfEnabled) {
            TweenLite._onPluginEvent("_onDisable", this);
        }
        this._firstPT = null;
        this._overwrittenProps = null;
        this._onUpdate = null;
        this._startAt = null;
        this._initted = this._active = this._notifyPluginsOfEnabled = false;
        this._propLookup = (this._targets) ? {} : [];
        return this;
    };
    p._enabled = function(enabled, ignoreTimeline) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        if (enabled && this._gc) {
            var targets = this._targets,
                i;
            if (targets) {
                i = targets.length;
                while (--i > -1) {
                    this._siblings[i] = _register(targets[i], this, true);
                }
            } else {
                this._siblings = _register(this.target, this, true);
            }
        }
        Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
        if (this._notifyPluginsOfEnabled)
            if (this._firstPT) {
                return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
            }
        return false;
    };
    TweenLite.to = function(target, duration, vars) {
        return new TweenLite(target, duration, vars);
    };
    TweenLite.from = function(target, duration, vars) {
        vars.runBackwards = true;
        vars.immediateRender = (vars.immediateRender != false);
        return new TweenLite(target, duration, vars);
    };
    TweenLite.fromTo = function(target, duration, fromVars, toVars) {
        toVars.startAt = fromVars;
        toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
        return new TweenLite(target, duration, toVars);
    };
    TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
        return new TweenLite(callback, 0, {
            delay: delay,
            onComplete: callback,
            onCompleteParams: params,
            onCompleteScope: scope,
            onReverseComplete: callback,
            onReverseCompleteParams: params,
            onReverseCompleteScope: scope,
            immediateRender: false,
            useFrames: useFrames,
            overwrite: 0
        });
    };
    TweenLite.set = function(target, vars) {
        return new TweenLite(target, 0, vars);
    };
    TweenLite.getTweensOf = function(target, onlyActive) {
        if (target == null) {
            return [];
        }
        target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
        var i, a, j, t;
        if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
            i = target.length;
            a = [];
            while (--i > -1) {
                a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
            }
            i = a.length;
            while (--i > -1) {
                t = a[i];
                j = i;
                while (--j > -1) {
                    if (t === a[j]) {
                        a.splice(i, 1);
                    }
                }
            }
        } else {
            a = _register(target).concat();
            i = a.length;
            while (--i > -1) {
                if (a[i]._gc || (onlyActive && !a[i].isActive())) {
                    a.splice(i, 1);
                }
            }
        }
        return a;
    };
    TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
        if (typeof(onlyActive) === "object") {
            vars = onlyActive;
            onlyActive = false;
        }
        var a = TweenLite.getTweensOf(target, onlyActive),
            i = a.length;
        while (--i > -1) {
            a[i]._kill(vars, target);
        }
    };
    var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
        this._overwriteProps = (props || "").split(",");
        this._propName = this._overwriteProps[0];
        this._priority = priority || 0;
        this._super = TweenPlugin.prototype;
    }, true);
    p = TweenPlugin.prototype;
    TweenPlugin.version = "1.10.1";
    TweenPlugin.API = 2;
    p._firstPT = null;
    p._addTween = function(target, prop, start, end, overwriteProp, round) {
        var c, pt;
        if (end != null && (c = (typeof(end) === "number" || end.charAt(1) !== "=") ? Number(end) - start : parseInt(end.charAt(0) + "1", 10) * Number(end.substr(2)))) {
            this._firstPT = pt = {
                _next: this._firstPT,
                t: target,
                p: prop,
                s: start,
                c: c,
                f: (typeof(target[prop]) === "function"),
                n: overwriteProp || prop,
                r: round
            };
            if (pt._next) {
                pt._next._prev = pt;
            }
            return pt;
        }
    };
    p.setRatio = function(v) {
        var pt = this._firstPT,
            min = 0.000001,
            val;
        while (pt) {
            val = pt.c * v + pt.s;
            if (pt.r) {
                val = Math.round(val);
            } else if (val < min)
                if (val > -min) {
                    val = 0;
                }
            if (pt.f) {
                pt.t[pt.p](val);
            } else {
                pt.t[pt.p] = val;
            }
            pt = pt._next;
        }
    };
    p._kill = function(lookup) {
        var a = this._overwriteProps,
            pt = this._firstPT,
            i;
        if (lookup[this._propName] != null) {
            this._overwriteProps = [];
        } else {
            i = a.length;
            while (--i > -1) {
                if (lookup[a[i]] != null) {
                    a.splice(i, 1);
                }
            }
        }
        while (pt) {
            if (lookup[pt.n] != null) {
                if (pt._next) {
                    pt._next._prev = pt._prev;
                }
                if (pt._prev) {
                    pt._prev._next = pt._next;
                    pt._prev = null;
                } else if (this._firstPT === pt) {
                    this._firstPT = pt._next;
                }
            }
            pt = pt._next;
        }
        return false;
    };
    p._roundProps = function(lookup, value) {
        var pt = this._firstPT;
        while (pt) {
            if (lookup[this._propName] || (pt.n != null && lookup[pt.n.split(this._propName + "_").join("")])) {
                pt.r = value;
            }
            pt = pt._next;
        }
    };
    TweenLite._onPluginEvent = function(type, tween) {
        var pt = tween._firstPT,
            changed, pt2, first, last, next;
        if (type === "_onInitAllProps") {
            while (pt) {
                next = pt._next;
                pt2 = first;
                while (pt2 && pt2.pr > pt.pr) {
                    pt2 = pt2._next;
                }
                if ((pt._prev = pt2 ? pt2._prev : last)) {
                    pt._prev._next = pt;
                } else {
                    first = pt;
                }
                if ((pt._next = pt2)) {
                    pt2._prev = pt;
                } else {
                    last = pt;
                }
                pt = next;
            }
            pt = tween._firstPT = first;
        }
        while (pt) {
            if (pt.pg)
                if (typeof(pt.t[type]) === "function")
                    if (pt.t[type]()) {
                        changed = true;
                    }
            pt = pt._next;
        }
        return changed;
    };
    TweenPlugin.activate = function(plugins) {
        var i = plugins.length;
        while (--i > -1) {
            if (plugins[i].API === TweenPlugin.API) {
                _plugins[(new plugins[i]())._propName] = plugins[i];
            }
        }
        return true;
    };
    _gsDefine.plugin = function(config) {
        if (!config || !config.propName || !config.init || !config.API) {
            throw "illegal plugin definition.";
        }
        var propName = config.propName,
            priority = config.priority || 0,
            overwriteProps = config.overwriteProps,
            map = {
                init: "_onInitTween",
                set: "setRatio",
                kill: "_kill",
                round: "_roundProps",
                initAll: "_onInitAllProps"
            },
            Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin", function() {
                TweenPlugin.call(this, propName, priority);
                this._overwriteProps = overwriteProps || [];
            }, (config.global === true)),
            p = Plugin.prototype = new TweenPlugin(propName),
            prop;
        p.constructor = Plugin;
        Plugin.API = config.API;
        for (prop in map) {
            if (typeof(config[prop]) === "function") {
                p[map[prop]] = config[prop];
            }
        }
        Plugin.version = config.version;
        TweenPlugin.activate([Plugin]);
        return Plugin;
    };
    a = window._gsQueue;
    if (a) {
        for (i = 0; i < a.length; i++) {
            a[i]();
        }
        for (p in _defLookup) {
            if (!_defLookup[p].func) {
                window.console.log("GSAP encountered missing dependency: com.greensock." + p);
            }
        }
    }
    _tickerActive = false;
})(window);
typeof JSON != "object" && (JSON = {}),
    function() {
        "use strict";

        function f(e) {
            return e < 10 ? "0" + e : e
        }

        function quote(e) {
            return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
                var t = meta[e];
                return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + e + '"'
        }

        function str(e, t) {
            var n, r, i, s, o = gap,
                u, a = t[e];
            a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
            switch (typeof a) {
                case "string":
                    return quote(a);
                case "number":
                    return isFinite(a) ? String(a) : "null";
                case "boolean":
                case "null":
                    return String(a);
                case "object":
                    if (!a) return "null";
                    gap += indent, u = [];
                    if (Object.prototype.toString.apply(a) === "[object Array]") {
                        s = a.length;
                        for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
                        return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                    }
                    if (rep && typeof rep == "object") {
                        s = rep.length;
                        for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                    } else
                        for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                    return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
            }
        }
        typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
            var r;
            gap = "", indent = "";
            if (typeof n == "number")
                for (r = 0; r < n; r += 1) indent += " ";
            else typeof n == "string" && (indent = n);
            rep = t;
            if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
                "": e
            });
            throw new Error("JSON.stringify")
        }), typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var n, r, i = e[t];
                if (i && typeof i == "object")
                    for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
                return reviver.call(e, t, i)
            }
            var j;
            text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }));
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(),
    function(e, t) {
        "use strict";
        var n = e.History = e.History || {},
            r = e.jQuery;
        if (typeof n.Adapter != "undefined") throw new Error("History.js Adapter has already been loaded...");
        n.Adapter = {
            bind: function(e, t, n) {
                r(e).bind(t, n)
            },
            trigger: function(e, t, n) {
                r(e).trigger(t, n)
            },
            extractEventData: function(e, n, r) {
                var i = n && n.originalEvent && n.originalEvent[e] || r && r[e] || t;
                return i
            },
            onDomLoad: function(e) {
                r(e)
            }
        }, typeof n.init != "undefined" && n.init()
    }(window),
    function(e, t) {
        "use strict";
        var n = e.document,
            r = e.setTimeout || r,
            i = e.clearTimeout || i,
            s = e.setInterval || s,
            o = e.History = e.History || {};
        if (typeof o.initHtml4 != "undefined") throw new Error("History.js HTML4 Support has already been loaded...");
        o.initHtml4 = function() {
            if (typeof o.initHtml4.initialized != "undefined") return !1;
            o.initHtml4.initialized = !0, o.enabled = !0, o.savedHashes = [], o.isLastHash = function(e) {
                var t = o.getHashByIndex(),
                    n;
                return n = e === t, n
            }, o.isHashEqual = function(e, t) {
                return e = encodeURIComponent(e).replace(/%25/g, "%"), t = encodeURIComponent(t).replace(/%25/g, "%"), e === t
            }, o.saveHash = function(e) {
                return o.isLastHash(e) ? !1 : (o.savedHashes.push(e), !0)
            }, o.getHashByIndex = function(e) {
                var t = null;
                return typeof e == "undefined" ? t = o.savedHashes[o.savedHashes.length - 1] : e < 0 ? t = o.savedHashes[o.savedHashes.length + e] : t = o.savedHashes[e], t
            }, o.discardedHashes = {}, o.discardedStates = {}, o.discardState = function(e, t, n) {
                var r = o.getHashByState(e),
                    i;
                return i = {
                    discardedState: e,
                    backState: n,
                    forwardState: t
                }, o.discardedStates[r] = i, !0
            }, o.discardHash = function(e, t, n) {
                var r = {
                    discardedHash: e,
                    backState: n,
                    forwardState: t
                };
                return o.discardedHashes[e] = r, !0
            }, o.discardedState = function(e) {
                var t = o.getHashByState(e),
                    n;
                return n = o.discardedStates[t] || !1, n
            }, o.discardedHash = function(e) {
                var t = o.discardedHashes[e] || !1;
                return t
            }, o.recycleState = function(e) {
                var t = o.getHashByState(e);
                return o.discardedState(e) && delete o.discardedStates[t], !0
            }, o.emulated.hashChange && (o.hashChangeInit = function() {
                o.checkerFunction = null;
                var t = "",
                    r, i, u, a, f = Boolean(o.getHash());
                return o.isInternetExplorer() ? (r = "historyjs-iframe", i = n.createElement("iframe"), i.setAttribute("id", r), i.setAttribute("src", "#"), i.style.display = "none", n.body.appendChild(i), i.contentWindow.document.open(), i.contentWindow.document.close(), u = "", a = !1, o.checkerFunction = function() {
                    if (a) return !1;
                    a = !0;
                    var n = o.getHash(),
                        r = o.getHash(i.contentWindow.document);
                    return n !== t ? (t = n, r !== n && (u = r = n, i.contentWindow.document.open(), i.contentWindow.document.close(), i.contentWindow.document.location.hash = o.escapeHash(n)), o.Adapter.trigger(e, "hashchange")) : r !== u && (u = r, f && r === "" ? o.back() : o.setHash(r, !1)), a = !1, !0
                }) : o.checkerFunction = function() {
                    var n = o.getHash() || "";
                    return n !== t && (t = n, o.Adapter.trigger(e, "hashchange")), !0
                }, o.intervalList.push(s(o.checkerFunction, o.options.hashChangeInterval)), !0
            }, o.Adapter.onDomLoad(o.hashChangeInit)), o.emulated.pushState && (o.onHashChange = function(t) {
                var n = t && t.newURL || o.getLocationHref(),
                    r = o.getHashByUrl(n),
                    i = null,
                    s = null,
                    u = null,
                    a;
                return o.isLastHash(r) ? (o.busy(!1), !1) : (o.doubleCheckComplete(), o.saveHash(r), r && o.isTraditionalAnchor(r) ? (o.Adapter.trigger(e, "anchorchange"), o.busy(!1), !1) : (i = o.extractState(o.getFullUrl(r || o.getLocationHref()), !0), o.isLastSavedState(i) ? (o.busy(!1), !1) : (s = o.getHashByState(i), a = o.discardedState(i), a ? (o.getHashByIndex(-2) === o.getHashByState(a.forwardState) ? o.back(!1) : o.forward(!1), !1) : (o.pushState(i.data, i.title, encodeURI(i.url), !1), !0))))
            }, o.Adapter.bind(e, "hashchange", o.onHashChange), o.pushState = function(t, n, r, i) {
                r = encodeURI(r).replace(/%25/g, "%");
                if (o.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                if (i !== !1 && o.busy()) return o.pushQueue({
                    scope: o,
                    callback: o.pushState,
                    args: arguments,
                    queue: i
                }), !1;
                o.busy(!0);
                var s = o.createStateObject(t, n, r),
                    u = o.getHashByState(s),
                    a = o.getState(!1),
                    f = o.getHashByState(a),
                    l = o.getHash(),
                    c = o.expectedStateId == s.id;
                return o.storeState(s), o.expectedStateId = s.id, o.recycleState(s), o.setTitle(s), u === f ? (o.busy(!1), !1) : (o.saveState(s), c || o.Adapter.trigger(e, "statechange"), !o.isHashEqual(u, l) && !o.isHashEqual(u, o.getShortUrl(o.getLocationHref())) && o.setHash(u, !1), o.busy(!1), !0)
            }, o.replaceState = function(t, n, r, i) {
                r = encodeURI(r).replace(/%25/g, "%");
                if (o.getHashByUrl(r)) throw new Error("History.js does not support states with fragment-identifiers (hashes/anchors).");
                if (i !== !1 && o.busy()) return o.pushQueue({
                    scope: o,
                    callback: o.replaceState,
                    args: arguments,
                    queue: i
                }), !1;
                o.busy(!0);
                var s = o.createStateObject(t, n, r),
                    u = o.getHashByState(s),
                    a = o.getState(!1),
                    f = o.getHashByState(a),
                    l = o.getStateByIndex(-2);
                return o.discardState(a, s, l), u === f ? (o.storeState(s), o.expectedStateId = s.id, o.recycleState(s), o.setTitle(s), o.saveState(s), o.Adapter.trigger(e, "statechange"), o.busy(!1)) : o.pushState(s.data, s.title, s.url, !1), !0
            }), o.emulated.pushState && o.getHash() && !o.emulated.hashChange && o.Adapter.onDomLoad(function() {
                o.Adapter.trigger(e, "hashchange")
            })
        }, typeof o.init != "undefined" && o.init()
    }(window),
    function(e, t) {
        "use strict";
        var n = e.console || t,
            r = e.document,
            i = e.navigator,
            s = e.sessionStorage || !1,
            o = e.setTimeout,
            u = e.clearTimeout,
            a = e.setInterval,
            f = e.clearInterval,
            l = e.JSON,
            c = e.alert,
            h = e.History = e.History || {},
            p = e.history;
        try {
            s.setItem("TEST", "1"), s.removeItem("TEST")
        } catch (d) {
            s = !1
        }
        l.stringify = l.stringify || l.encode, l.parse = l.parse || l.decode;
        if (typeof h.init != "undefined") throw new Error("History.js Core has already been loaded...");
        h.init = function(e) {
            return typeof h.Adapter == "undefined" ? !1 : (typeof h.initCore != "undefined" && h.initCore(), typeof h.initHtml4 != "undefined" && h.initHtml4(), !0)
        }, h.initCore = function(d) {
            if (typeof h.initCore.initialized != "undefined") return !1;
            h.initCore.initialized = !0, h.options = h.options || {}, h.options.hashChangeInterval = h.options.hashChangeInterval || 100, h.options.safariPollInterval = h.options.safariPollInterval || 500, h.options.doubleCheckInterval = h.options.doubleCheckInterval || 500, h.options.disableSuid = h.options.disableSuid || !1, h.options.storeInterval = h.options.storeInterval || 1e3, h.options.busyDelay = h.options.busyDelay || 250, h.options.debug = h.options.debug || !1, h.options.initialTitle = h.options.initialTitle || r.title, h.options.html4Mode = h.options.html4Mode || !1, h.options.delayInit = h.options.delayInit || !1, h.intervalList = [], h.clearAllIntervals = function() {
                var e, t = h.intervalList;
                if (typeof t != "undefined" && t !== null) {
                    for (e = 0; e < t.length; e++) f(t[e]);
                    h.intervalList = null
                }
            }, h.debug = function() {
                (h.options.debug || !1) && h.log.apply(h, arguments)
            }, h.log = function() {
                var e = typeof n != "undefined" && typeof n.log != "undefined" && typeof n.log.apply != "undefined",
                    t = r.getElementById("log"),
                    i, s, o, u, a;
                e ? (u = Array.prototype.slice.call(arguments), i = u.shift(), typeof n.debug != "undefined" ? n.debug.apply(n, [i, u]) : n.log.apply(n, [i, u])) : i = "\n" + arguments[0] + "\n";
                for (s = 1, o = arguments.length; s < o; ++s) {
                    a = arguments[s];
                    if (typeof a == "object" && typeof l != "undefined") try {
                        a = l.stringify(a)
                    } catch (f) {}
                    i += "\n" + a + "\n"
                }
                return t ? (t.value += i + "\n-----\n", t.scrollTop = t.scrollHeight - t.clientHeight) : e || c(i), !0
            }, h.getInternetExplorerMajorVersion = function() {
                var e = h.getInternetExplorerMajorVersion.cached = typeof h.getInternetExplorerMajorVersion.cached != "undefined" ? h.getInternetExplorerMajorVersion.cached : function() {
                    var e = 3,
                        t = r.createElement("div"),
                        n = t.getElementsByTagName("i");
                    while ((t.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->") && n[0]);
                    return e > 4 ? e : !1
                }();
                return e
            }, h.isInternetExplorer = function() {
                var e = h.isInternetExplorer.cached = typeof h.isInternetExplorer.cached != "undefined" ? h.isInternetExplorer.cached : Boolean(h.getInternetExplorerMajorVersion());
                return e
            }, h.options.html4Mode ? h.emulated = {
                pushState: !0,
                hashChange: !0
            } : h.emulated = {
                pushState: !Boolean(e.history && e.history.pushState && e.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),
                hashChange: Boolean(!("onhashchange" in e || "onhashchange" in r) || h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8)
            }, h.enabled = !h.emulated.pushState, h.bugs = {
                setHash: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                safariPoll: Boolean(!h.emulated.pushState && i.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),
                ieDoubleCheck: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 8),
                hashEscape: Boolean(h.isInternetExplorer() && h.getInternetExplorerMajorVersion() < 7)
            }, h.isEmptyObject = function(e) {
                for (var t in e)
                    if (e.hasOwnProperty(t)) return !1;
                return !0
            }, h.cloneObject = function(e) {
                var t, n;
                return e ? (t = l.stringify(e), n = l.parse(t)) : n = {}, n
            }, h.getRootUrl = function() {
                var e = r.location.protocol + "//" + (r.location.hostname || r.location.host);
                if (r.location.port || !1) e += ":" + r.location.port;
                return e += "/", e
            }, h.getBaseHref = function() {
                var e = r.getElementsByTagName("base"),
                    t = null,
                    n = "";
                return e.length === 1 && (t = e[0], n = t.href.replace(/[^\/]+$/, "")), n = n.replace(/\/+$/, ""), n && (n += "/"), n
            }, h.getBaseUrl = function() {
                var e = h.getBaseHref() || h.getBasePageUrl() || h.getRootUrl();
                return e
            }, h.getPageUrl = function() {
                var e = h.getState(!1, !1),
                    t = (e || {}).url || h.getLocationHref(),
                    n;
                return n = t.replace(/\/+$/, "").replace(/[^\/]+$/, function(e, t, n) {
                    return /\./.test(e) ? e : e + "/"
                }), n
            }, h.getBasePageUrl = function() {
                var e = h.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(e, t, n) {
                    return /[^\/]$/.test(e) ? "" : e
                }).replace(/\/+$/, "") + "/";
                return e
            }, h.getFullUrl = function(e, t) {
                var n = e,
                    r = e.substring(0, 1);
                return t = typeof t == "undefined" ? !0 : t, /[a-z]+\:\/\//.test(e) || (r === "/" ? n = h.getRootUrl() + e.replace(/^\/+/, "") : r === "#" ? n = h.getPageUrl().replace(/#.*/, "") + e : r === "?" ? n = h.getPageUrl().replace(/[\?#].*/, "") + e : t ? n = h.getBaseUrl() + e.replace(/^(\.\/)+/, "") : n = h.getBasePageUrl() + e.replace(/^(\.\/)+/, "")), n.replace(/\#$/, "")
            }, h.getShortUrl = function(e) {
                var t = e,
                    n = h.getBaseUrl(),
                    r = h.getRootUrl();
                return h.emulated.pushState && (t = t.replace(n, "")), t = t.replace(r, "/"), h.isTraditionalAnchor(t) && (t = "./" + t), t = t.replace(/^(\.\/)+/g, "./").replace(/\#$/, ""), t
            }, h.getLocationHref = function(e) {
                return e = e || r, e.URL === e.location.href ? e.location.href : e.location.href === decodeURIComponent(e.URL) ? e.URL : e.location.hash && decodeURIComponent(e.location.href.replace(/^[^#]+/, "")) === e.location.hash ? e.location.href : e.URL.indexOf("#") == -1 && e.location.href.indexOf("#") != -1 ? e.location.href : e.URL || e.location.href
            }, h.store = {}, h.idToState = h.idToState || {}, h.stateToId = h.stateToId || {}, h.urlToId = h.urlToId || {}, h.storedStates = h.storedStates || [], h.savedStates = h.savedStates || [], h.normalizeStore = function() {
                h.store.idToState = h.store.idToState || {}, h.store.urlToId = h.store.urlToId || {}, h.store.stateToId = h.store.stateToId || {}
            }, h.getState = function(e, t) {
                typeof e == "undefined" && (e = !0), typeof t == "undefined" && (t = !0);
                var n = h.getLastSavedState();
                return !n && t && (n = h.createStateObject()), e && (n = h.cloneObject(n), n.url = n.cleanUrl || n.url), n
            }, h.getIdByState = function(e) {
                var t = h.extractId(e.url),
                    n;
                if (!t) {
                    n = h.getStateString(e);
                    if (typeof h.stateToId[n] != "undefined") t = h.stateToId[n];
                    else if (typeof h.store.stateToId[n] != "undefined") t = h.store.stateToId[n];
                    else {
                        for (;;) {
                            t = (new Date).getTime() + String(Math.random()).replace(/\D/g, "");
                            if (typeof h.idToState[t] == "undefined" && typeof h.store.idToState[t] == "undefined") break
                        }
                        h.stateToId[n] = t, h.idToState[t] = e
                    }
                }
                return t
            }, h.normalizeState = function(e) {
                var t, n;
                if (!e || typeof e != "object") e = {};
                if (typeof e.normalized != "undefined") return e;
                if (!e.data || typeof e.data != "object") e.data = {};
                return t = {}, t.normalized = !0, t.title = e.title || "", t.url = h.getFullUrl(e.url ? e.url : h.getLocationHref()), t.hash = h.getShortUrl(t.url), t.data = h.cloneObject(e.data), t.id = h.getIdByState(t), t.cleanUrl = t.url.replace(/\??\&_suid.*/, ""), t.url = t.cleanUrl, n = !h.isEmptyObject(t.data), (t.title || n) && h.options.disableSuid !== !0 && (t.hash = h.getShortUrl(t.url).replace(/\??\&_suid.*/, ""), /\?/.test(t.hash) || (t.hash += "?"), t.hash += "&_suid=" + t.id), t.hashedUrl = h.getFullUrl(t.hash), (h.emulated.pushState || h.bugs.safariPoll) && h.hasUrlDuplicate(t) && (t.url = t.hashedUrl), t
            }, h.createStateObject = function(e, t, n) {
                var r = {
                    data: e,
                    title: t,
                    url: n
                };
                return r = h.normalizeState(r), r
            }, h.getStateById = function(e) {
                e = String(e);
                var n = h.idToState[e] || h.store.idToState[e] || t;
                return n
            }, h.getStateString = function(e) {
                var t, n, r;
                return t = h.normalizeState(e), n = {
                    data: t.data,
                    title: e.title,
                    url: e.url
                }, r = l.stringify(n), r
            }, h.getStateId = function(e) {
                var t, n;
                return t = h.normalizeState(e), n = t.id, n
            }, h.getHashByState = function(e) {
                var t, n;
                return t = h.normalizeState(e), n = t.hash, n
            }, h.extractId = function(e) {
                var t, n, r, i;
                return e.indexOf("#") != -1 ? i = e.split("#")[0] : i = e, n = /(.*)\&_suid=([0-9]+)$/.exec(i), r = n ? n[1] || e : e, t = n ? String(n[2] || "") : "", t || !1
            }, h.isTraditionalAnchor = function(e) {
                var t = !/[\/\?\.]/.test(e);
                return t
            }, h.extractState = function(e, t) {
                var n = null,
                    r, i;
                return t = t || !1, r = h.extractId(e), r && (n = h.getStateById(r)), n || (i = h.getFullUrl(e), r = h.getIdByUrl(i) || !1, r && (n = h.getStateById(r)), !n && t && !h.isTraditionalAnchor(e) && (n = h.createStateObject(null, null, i))), n
            }, h.getIdByUrl = function(e) {
                var n = h.urlToId[e] || h.store.urlToId[e] || t;
                return n
            }, h.getLastSavedState = function() {
                return h.savedStates[h.savedStates.length - 1] || t
            }, h.getLastStoredState = function() {
                return h.storedStates[h.storedStates.length - 1] || t
            }, h.hasUrlDuplicate = function(e) {
                var t = !1,
                    n;
                return n = h.extractState(e.url), t = n && n.id !== e.id, t
            }, h.storeState = function(e) {
                return h.urlToId[e.url] = e.id, h.storedStates.push(h.cloneObject(e)), e
            }, h.isLastSavedState = function(e) {
                var t = !1,
                    n, r, i;
                return h.savedStates.length && (n = e.id, r = h.getLastSavedState(), i = r.id, t = n === i), t
            }, h.saveState = function(e) {
                return h.isLastSavedState(e) ? !1 : (h.savedStates.push(h.cloneObject(e)), !0)
            }, h.getStateByIndex = function(e) {
                var t = null;
                return typeof e == "undefined" ? t = h.savedStates[h.savedStates.length - 1] : e < 0 ? t = h.savedStates[h.savedStates.length + e] : t = h.savedStates[e], t
            }, h.getCurrentIndex = function() {
                var e = null;
                return h.savedStates.length < 1 ? e = 0 : e = h.savedStates.length - 1, e
            }, h.getHash = function(e) {
                var t = h.getLocationHref(e),
                    n;
                return n = h.getHashByUrl(t), n
            }, h.unescapeHash = function(e) {
                var t = h.normalizeHash(e);
                return t = decodeURIComponent(t), t
            }, h.normalizeHash = function(e) {
                var t = e.replace(/[^#]*#/, "").replace(/#.*/, "");
                return t
            }, h.setHash = function(e, t) {
                var n, i;
                return t !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.setHash,
                    args: arguments,
                    queue: t
                }), !1) : (h.busy(!0), n = h.extractState(e, !0), n && !h.emulated.pushState ? h.pushState(n.data, n.title, n.url, !1) : h.getHash() !== e && (h.bugs.setHash ? (i = h.getPageUrl(), h.pushState(null, null, i + "#" + e, !1)) : r.location.hash = e), h)
            }, h.escapeHash = function(t) {
                var n = h.normalizeHash(t);
                return n = e.encodeURIComponent(n), h.bugs.hashEscape || (n = n.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), n
            }, h.getHashByUrl = function(e) {
                var t = String(e).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
                return t = h.unescapeHash(t), t
            }, h.setTitle = function(e) {
                var t = e.title,
                    n;
                t || (n = h.getStateByIndex(0), n && n.url === e.url && (t = n.title || h.options.initialTitle));
                try {
                    r.getElementsByTagName("title")[0].innerHTML = t.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
                } catch (i) {}
                return r.title = t, h
            }, h.queues = [], h.busy = function(e) {
                typeof e != "undefined" ? h.busy.flag = e : typeof h.busy.flag == "undefined" && (h.busy.flag = !1);
                if (!h.busy.flag) {
                    u(h.busy.timeout);
                    var t = function() {
                        var e, n, r;
                        if (h.busy.flag) return;
                        for (e = h.queues.length - 1; e >= 0; --e) {
                            n = h.queues[e];
                            if (n.length === 0) continue;
                            r = n.shift(), h.fireQueueItem(r), h.busy.timeout = o(t, h.options.busyDelay)
                        }
                    };
                    h.busy.timeout = o(t, h.options.busyDelay)
                }
                return h.busy.flag
            }, h.busy.flag = !1, h.fireQueueItem = function(e) {
                return e.callback.apply(e.scope || h, e.args || [])
            }, h.pushQueue = function(e) {
                return h.queues[e.queue || 0] = h.queues[e.queue || 0] || [], h.queues[e.queue || 0].push(e), h
            }, h.queue = function(e, t) {
                return typeof e == "function" && (e = {
                    callback: e
                }), typeof t != "undefined" && (e.queue = t), h.busy() ? h.pushQueue(e) : h.fireQueueItem(e), h
            }, h.clearQueue = function() {
                return h.busy.flag = !1, h.queues = [], h
            }, h.stateChanged = !1, h.doubleChecker = !1, h.doubleCheckComplete = function() {
                return h.stateChanged = !0, h.doubleCheckClear(), h
            }, h.doubleCheckClear = function() {
                return h.doubleChecker && (u(h.doubleChecker), h.doubleChecker = !1), h
            }, h.doubleCheck = function(e) {
                return h.stateChanged = !1, h.doubleCheckClear(), h.bugs.ieDoubleCheck && (h.doubleChecker = o(function() {
                    return h.doubleCheckClear(), h.stateChanged || e(), !0
                }, h.options.doubleCheckInterval)), h
            }, h.safariStatePoll = function() {
                var t = h.extractState(h.getLocationHref()),
                    n;
                if (!h.isLastSavedState(t)) return n = t, n || (n = h.createStateObject()), h.Adapter.trigger(e, "popstate"), h;
                return
            }, h.back = function(e) {
                return e !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.back,
                    args: arguments,
                    queue: e
                }), !1) : (h.busy(!0), h.doubleCheck(function() {
                    h.back(!1)
                }), p.go(-1), !0)
            }, h.forward = function(e) {
                return e !== !1 && h.busy() ? (h.pushQueue({
                    scope: h,
                    callback: h.forward,
                    args: arguments,
                    queue: e
                }), !1) : (h.busy(!0), h.doubleCheck(function() {
                    h.forward(!1)
                }), p.go(1), !0)
            }, h.go = function(e, t) {
                var n;
                if (e > 0)
                    for (n = 1; n <= e; ++n) h.forward(t);
                else {
                    if (!(e < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed.");
                    for (n = -1; n >= e; --n) h.back(t)
                }
                return h
            };
            if (h.emulated.pushState) {
                var v = function() {};
                h.pushState = h.pushState || v, h.replaceState = h.replaceState || v
            } else h.onPopState = function(t, n) {
                var r = !1,
                    i = !1,
                    s, o;
                return h.doubleCheckComplete(), s = h.getHash(), s ? (o = h.extractState(s || h.getLocationHref(), !0), o ? h.replaceState(o.data, o.title, o.url, !1) : (h.Adapter.trigger(e, "anchorchange"), h.busy(!1)), h.expectedStateId = !1, !1) : (r = h.Adapter.extractEventData("state", t, n) || !1, r ? i = h.getStateById(r) : h.expectedStateId ? i = h.getStateById(h.expectedStateId) : i = h.extractState(h.getLocationHref()), i || (i = h.createStateObject(null, null, h.getLocationHref())), h.expectedStateId = !1, h.isLastSavedState(i) ? (h.busy(!1), !1) : (h.storeState(i), h.saveState(i), h.setTitle(i), h.Adapter.trigger(e, "statechange"), h.busy(!1), !0))
            }, h.Adapter.bind(e, "popstate", h.onPopState), h.pushState = function(t, n, r, i) {
                if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                if (i !== !1 && h.busy()) return h.pushQueue({
                    scope: h,
                    callback: h.pushState,
                    args: arguments,
                    queue: i
                }), !1;
                h.busy(!0);
                var s = h.createStateObject(t, n, r);
                return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.pushState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
            }, h.replaceState = function(t, n, r, i) {
                if (h.getHashByUrl(r) && h.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                if (i !== !1 && h.busy()) return h.pushQueue({
                    scope: h,
                    callback: h.replaceState,
                    args: arguments,
                    queue: i
                }), !1;
                h.busy(!0);
                var s = h.createStateObject(t, n, r);
                return h.isLastSavedState(s) ? h.busy(!1) : (h.storeState(s), h.expectedStateId = s.id, p.replaceState(s.id, s.title, s.url), h.Adapter.trigger(e, "popstate")), !0
            };
            if (s) {
                try {
                    h.store = l.parse(s.getItem("History.store")) || {}
                } catch (m) {
                    h.store = {}
                }
                h.normalizeStore()
            } else h.store = {}, h.normalizeStore();
            h.Adapter.bind(e, "unload", h.clearAllIntervals), h.saveState(h.storeState(h.extractState(h.getLocationHref(), !0))), s && (h.onUnload = function() {
                var e, t, n;
                try {
                    e = l.parse(s.getItem("History.store")) || {}
                } catch (r) {
                    e = {}
                }
                e.idToState = e.idToState || {}, e.urlToId = e.urlToId || {}, e.stateToId = e.stateToId || {};
                for (t in h.idToState) {
                    if (!h.idToState.hasOwnProperty(t)) continue;
                    e.idToState[t] = h.idToState[t]
                }
                for (t in h.urlToId) {
                    if (!h.urlToId.hasOwnProperty(t)) continue;
                    e.urlToId[t] = h.urlToId[t]
                }
                for (t in h.stateToId) {
                    if (!h.stateToId.hasOwnProperty(t)) continue;
                    e.stateToId[t] = h.stateToId[t]
                }
                h.store = e, h.normalizeStore(), n = l.stringify(e);
                try {
                    s.setItem("History.store", n)
                } catch (i) {
                    if (i.code !== DOMException.QUOTA_EXCEEDED_ERR) throw i;
                    s.length && (s.removeItem("History.store"), s.setItem("History.store", n))
                }
            }, h.intervalList.push(a(h.onUnload, h.options.storeInterval)), h.Adapter.bind(e, "beforeunload", h.onUnload), h.Adapter.bind(e, "unload", h.onUnload));
            if (!h.emulated.pushState) {
                h.bugs.safariPoll && h.intervalList.push(a(h.safariStatePoll, h.options.safariPollInterval));
                if (i.vendor === "Apple Computer, Inc." || (i.appCodeName || "") === "Mozilla") h.Adapter.bind(e, "hashchange", function() {
                    h.Adapter.trigger(e, "popstate")
                }), h.getHash() && h.Adapter.onDomLoad(function() {
                    h.Adapter.trigger(e, "hashchange")
                })
            }
        }, (!h.options || !h.options.delayInit) && h.init()
    }(window)
this.createjs = this.createjs || {},
    function() {
        "use strict";
        var a = createjs.PreloadJS = createjs.PreloadJS || {};
        a.version = "0.6.0", a.buildDate = "Thu, 11 Dec 2014 23:32:09 GMT"
    }(), this.createjs = this.createjs || {}, createjs.extend = function(a, b) {
        "use strict";

        function c() {
            this.constructor = a
        }
        return c.prototype = b.prototype, a.prototype = new c
    }, this.createjs = this.createjs || {}, createjs.promote = function(a, b) {
        "use strict";
        var c = a.prototype,
            d = Object.getPrototypeOf && Object.getPrototypeOf(c) || c.__proto__;
        if (d) {
            c[(b += "_") + "constructor"] = d.constructor;
            for (var e in d) c.hasOwnProperty(e) && "function" == typeof d[e] && (c[b + e] = d[e])
        }
        return a
    }, this.createjs = this.createjs || {}, createjs.indexOf = function(a, b) {
        "use strict";
        for (var c = 0, d = a.length; d > c; c++)
            if (b === a[c]) return c;
        return -1
    }, this.createjs = this.createjs || {},
    function() {
        "use strict";
        createjs.proxy = function(a, b) {
            var c = Array.prototype.slice.call(arguments, 2);
            return function() {
                return a.apply(b, Array.prototype.slice.call(arguments, 0).concat(c))
            }
        }
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            throw "BrowserDetect cannot be instantiated"
        }
        var b = a.agent = window.navigator.userAgent;
        a.isWindowPhone = b.indexOf("IEMobile") > -1 || b.indexOf("Windows Phone") > -1, a.isFirefox = b.indexOf("Firefox") > -1, a.isOpera = null != window.opera, a.isChrome = b.indexOf("Chrome") > -1, a.isIOS = (b.indexOf("iPod") > -1 || b.indexOf("iPhone") > -1 || b.indexOf("iPad") > -1) && !a.isWindowPhone, a.isAndroid = b.indexOf("Android") > -1 && !a.isWindowPhone, a.isBlackberry = b.indexOf("Blackberry") > -1, createjs.BrowserDetect = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.type = a, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.bubbles = !!b, this.cancelable = !!c, this.timeStamp = (new Date).getTime(), this.defaultPrevented = !1, this.propagationStopped = !1, this.immediatePropagationStopped = !1, this.removed = !1
        }
        var b = a.prototype;
        b.preventDefault = function() {
            this.defaultPrevented = this.cancelable && !0
        }, b.stopPropagation = function() {
            this.propagationStopped = !0
        }, b.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = this.propagationStopped = !0
        }, b.remove = function() {
            this.removed = !0
        }, b.clone = function() {
            return new a(this.type, this.bubbles, this.cancelable)
        }, b.set = function(a) {
            for (var b in a) this[b] = a[b];
            return this
        }, b.toString = function() {
            return "[Event (type=" + this.type + ")]"
        }, createjs.Event = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.Event_constructor("error"), this.title = a, this.message = b, this.data = c
        }
        var b = createjs.extend(a, createjs.Event);
        b.clone = function() {
            return new createjs.ErrorEvent(this.title, this.message, this.data)
        }, createjs.ErrorEvent = createjs.promote(a, "Event")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this._listeners = null, this._captureListeners = null
        }
        var b = a.prototype;
        a.initialize = function(a) {
            a.addEventListener = b.addEventListener, a.on = b.on, a.removeEventListener = a.off = b.removeEventListener, a.removeAllEventListeners = b.removeAllEventListeners, a.hasEventListener = b.hasEventListener, a.dispatchEvent = b.dispatchEvent, a._dispatchEvent = b._dispatchEvent, a.willTrigger = b.willTrigger
        }, b.addEventListener = function(a, b, c) {
            var d;
            d = c ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
            var e = d[a];
            return e && this.removeEventListener(a, b, c), e = d[a], e ? e.push(b) : d[a] = [b], b
        }, b.on = function(a, b, c, d, e, f) {
            return b.handleEvent && (c = c || b, b = b.handleEvent), c = c || this, this.addEventListener(a, function(a) {
                b.call(c, a, e), d && a.remove()
            }, f)
        }, b.removeEventListener = function(a, b, c) {
            var d = c ? this._captureListeners : this._listeners;
            if (d) {
                var e = d[a];
                if (e)
                    for (var f = 0, g = e.length; g > f; f++)
                        if (e[f] == b) {
                            1 == g ? delete d[a] : e.splice(f, 1);
                            break
                        }
            }
        }, b.off = b.removeEventListener, b.removeAllEventListeners = function(a) {
            a ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
        }, b.dispatchEvent = function(a) {
            if ("string" == typeof a) {
                var b = this._listeners;
                if (!b || !b[a]) return !1;
                a = new createjs.Event(a)
            } else a.target && a.clone && (a = a.clone());
            try {
                a.target = this
            } catch (c) {}
            if (a.bubbles && this.parent) {
                for (var d = this, e = [d]; d.parent;) e.push(d = d.parent);
                var f, g = e.length;
                for (f = g - 1; f >= 0 && !a.propagationStopped; f--) e[f]._dispatchEvent(a, 1 + (0 == f));
                for (f = 1; g > f && !a.propagationStopped; f++) e[f]._dispatchEvent(a, 3)
            } else this._dispatchEvent(a, 2);
            return a.defaultPrevented
        }, b.hasEventListener = function(a) {
            var b = this._listeners,
                c = this._captureListeners;
            return !!(b && b[a] || c && c[a])
        }, b.willTrigger = function(a) {
            for (var b = this; b;) {
                if (b.hasEventListener(a)) return !0;
                b = b.parent
            }
            return !1
        }, b.toString = function() {
            return "[EventDispatcher]"
        }, b._dispatchEvent = function(a, b) {
            var c, d = 1 == b ? this._captureListeners : this._listeners;
            if (a && d) {
                var e = d[a.type];
                if (!e || !(c = e.length)) return;
                try {
                    a.currentTarget = this
                } catch (f) {}
                try {
                    a.eventPhase = b
                } catch (f) {}
                a.removed = !1, e = e.slice();
                for (var g = 0; c > g && !a.immediatePropagationStopped; g++) {
                    var h = e[g];
                    h.handleEvent ? h.handleEvent(a) : h(a), a.removed && (this.off(a.type, h, 1 == b), a.removed = !1)
                }
            }
        }, createjs.EventDispatcher = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.Event_constructor("progress"), this.loaded = a, this.total = null == b ? 1 : b, this.progress = 0 == b ? 0 : this.loaded / this.total
        }
        var b = createjs.extend(a, createjs.Event);
        b.clone = function() {
            return new createjs.ProgressEvent(this.loaded, this.total)
        }, createjs.ProgressEvent = createjs.promote(a, "Event")
    }(window),
    function() {
        function a(b, d) {
            function f(a) {
                if (f[a] !== q) return f[a];
                var b;
                if ("bug-string-char-index" == a) b = "a" != "a" [0];
                else if ("json" == a) b = f("json-stringify") && f("json-parse");
                else {
                    var c, e = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                    if ("json-stringify" == a) {
                        var i = d.stringify,
                            k = "function" == typeof i && t;
                        if (k) {
                            (c = function() {
                                return 1
                            }).toJSON = c;
                            try {
                                k = "0" === i(0) && "0" === i(new g) && '""' == i(new h) && i(s) === q && i(q) === q && i() === q && "1" === i(c) && "[1]" == i([c]) && "[null]" == i([q]) && "null" == i(null) && "[null,null,null]" == i([q, s, null]) && i({
                                    a: [c, !0, !1, null, "\x00\b\n\f\r	"]
                                }) == e && "1" === i(null, c) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new j(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == i(new j(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new j(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == i(new j(-1))
                            } catch (l) {
                                k = !1
                            }
                        }
                        b = k
                    }
                    if ("json-parse" == a) {
                        var m = d.parse;
                        if ("function" == typeof m) try {
                            if (0 === m("0") && !m(!1)) {
                                c = m(e);
                                var n = 5 == c.a.length && 1 === c.a[0];
                                if (n) {
                                    try {
                                        n = !m('"	"')
                                    } catch (l) {}
                                    if (n) try {
                                        n = 1 !== m("01")
                                    } catch (l) {}
                                    if (n) try {
                                        n = 1 !== m("1.")
                                    } catch (l) {}
                                }
                            }
                        } catch (l) {
                            n = !1
                        }
                        b = n
                    }
                }
                return f[a] = !!b
            }
            b || (b = e.Object()), d || (d = e.Object());
            var g = b.Number || e.Number,
                h = b.String || e.String,
                i = b.Object || e.Object,
                j = b.Date || e.Date,
                k = b.SyntaxError || e.SyntaxError,
                l = b.TypeError || e.TypeError,
                m = b.Math || e.Math,
                n = b.JSON || e.JSON;
            "object" == typeof n && n && (d.stringify = n.stringify, d.parse = n.parse);
            var o, p, q, r = i.prototype,
                s = r.toString,
                t = new j(-0xc782b5b800cec);
            try {
                t = -109252 == t.getUTCFullYear() && 0 === t.getUTCMonth() && 1 === t.getUTCDate() && 10 == t.getUTCHours() && 37 == t.getUTCMinutes() && 6 == t.getUTCSeconds() && 708 == t.getUTCMilliseconds()
            } catch (u) {}
            if (!f("json")) {
                var v = "[object Function]",
                    w = "[object Date]",
                    x = "[object Number]",
                    y = "[object String]",
                    z = "[object Array]",
                    A = "[object Boolean]",
                    B = f("bug-string-char-index");
                if (!t) var C = m.floor,
                    D = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                    E = function(a, b) {
                        return D[b] + 365 * (a - 1970) + C((a - 1969 + (b = +(b > 1))) / 4) - C((a - 1901 + b) / 100) + C((a - 1601 + b) / 400)
                    };
                if ((o = r.hasOwnProperty) || (o = function(a) {
                        var b, c = {};
                        return (c.__proto__ = null, c.__proto__ = {
                            toString: 1
                        }, c).toString != s ? o = function(a) {
                            var b = this.__proto__,
                                c = a in (this.__proto__ = null, this);
                            return this.__proto__ = b, c
                        } : (b = c.constructor, o = function(a) {
                            var c = (this.constructor || b).prototype;
                            return a in this && !(a in c && this[a] === c[a])
                        }), c = null, o.call(this, a)
                    }), p = function(a, b) {
                        var d, e, f, g = 0;
                        (d = function() {
                            this.valueOf = 0
                        }).prototype.valueOf = 0, e = new d;
                        for (f in e) o.call(e, f) && g++;
                        return d = e = null, g ? p = 2 == g ? function(a, b) {
                            var c, d = {},
                                e = s.call(a) == v;
                            for (c in a) e && "prototype" == c || o.call(d, c) || !(d[c] = 1) || !o.call(a, c) || b(c)
                        } : function(a, b) {
                            var c, d, e = s.call(a) == v;
                            for (c in a) e && "prototype" == c || !o.call(a, c) || (d = "constructor" === c) || b(c);
                            (d || o.call(a, c = "constructor")) && b(c)
                        } : (e = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], p = function(a, b) {
                            var d, f, g = s.call(a) == v,
                                h = !g && "function" != typeof a.constructor && c[typeof a.hasOwnProperty] && a.hasOwnProperty || o;
                            for (d in a) g && "prototype" == d || !h.call(a, d) || b(d);
                            for (f = e.length; d = e[--f]; h.call(a, d) && b(d));
                        }), p(a, b)
                    }, !f("json-stringify")) {
                    var F = {
                            92: "\\\\",
                            34: '\\"',
                            8: "\\b",
                            12: "\\f",
                            10: "\\n",
                            13: "\\r",
                            9: "\\t"
                        },
                        G = "000000",
                        H = function(a, b) {
                            return (G + (b || 0)).slice(-a)
                        },
                        I = "\\u00",
                        J = function(a) {
                            for (var b = '"', c = 0, d = a.length, e = !B || d > 10, f = e && (B ? a.split("") : a); d > c; c++) {
                                var g = a.charCodeAt(c);
                                switch (g) {
                                    case 8:
                                    case 9:
                                    case 10:
                                    case 12:
                                    case 13:
                                    case 34:
                                    case 92:
                                        b += F[g];
                                        break;
                                    default:
                                        if (32 > g) {
                                            b += I + H(2, g.toString(16));
                                            break
                                        }
                                        b += e ? f[c] : a.charAt(c)
                                }
                            }
                            return b + '"'
                        },
                        K = function(a, b, c, d, e, f, g) {
                            var h, i, j, k, m, n, r, t, u, v, B, D, F, G, I, L;
                            try {
                                h = b[a]
                            } catch (M) {}
                            if ("object" == typeof h && h)
                                if (i = s.call(h), i != w || o.call(h, "toJSON")) "function" == typeof h.toJSON && (i != x && i != y && i != z || o.call(h, "toJSON")) && (h = h.toJSON(a));
                                else if (h > -1 / 0 && 1 / 0 > h) {
                                if (E) {
                                    for (m = C(h / 864e5), j = C(m / 365.2425) + 1970 - 1; E(j + 1, 0) <= m; j++);
                                    for (k = C((m - E(j, 0)) / 30.42); E(j, k + 1) <= m; k++);
                                    m = 1 + m - E(j, k), n = (h % 864e5 + 864e5) % 864e5, r = C(n / 36e5) % 24, t = C(n / 6e4) % 60, u = C(n / 1e3) % 60, v = n % 1e3
                                } else j = h.getUTCFullYear(), k = h.getUTCMonth(), m = h.getUTCDate(), r = h.getUTCHours(), t = h.getUTCMinutes(), u = h.getUTCSeconds(), v = h.getUTCMilliseconds();
                                h = (0 >= j || j >= 1e4 ? (0 > j ? "-" : "+") + H(6, 0 > j ? -j : j) : H(4, j)) + "-" + H(2, k + 1) + "-" + H(2, m) + "T" + H(2, r) + ":" + H(2, t) + ":" + H(2, u) + "." + H(3, v) + "Z"
                            } else h = null;
                            if (c && (h = c.call(b, a, h)), null === h) return "null";
                            if (i = s.call(h), i == A) return "" + h;
                            if (i == x) return h > -1 / 0 && 1 / 0 > h ? "" + h : "null";
                            if (i == y) return J("" + h);
                            if ("object" == typeof h) {
                                for (G = g.length; G--;)
                                    if (g[G] === h) throw l();
                                if (g.push(h), B = [], I = f, f += e, i == z) {
                                    for (F = 0, G = h.length; G > F; F++) D = K(F, h, c, d, e, f, g), B.push(D === q ? "null" : D);
                                    L = B.length ? e ? "[\n" + f + B.join(",\n" + f) + "\n" + I + "]" : "[" + B.join(",") + "]" : "[]"
                                } else p(d || h, function(a) {
                                    var b = K(a, h, c, d, e, f, g);
                                    b !== q && B.push(J(a) + ":" + (e ? " " : "") + b)
                                }), L = B.length ? e ? "{\n" + f + B.join(",\n" + f) + "\n" + I + "}" : "{" + B.join(",") + "}" : "{}";
                                return g.pop(), L
                            }
                        };
                    d.stringify = function(a, b, d) {
                        var e, f, g, h;
                        if (c[typeof b] && b)
                            if ((h = s.call(b)) == v) f = b;
                            else if (h == z) {
                            g = {};
                            for (var i, j = 0, k = b.length; k > j; i = b[j++], h = s.call(i), (h == y || h == x) && (g[i] = 1));
                        }
                        if (d)
                            if ((h = s.call(d)) == x) {
                                if ((d -= d % 1) > 0)
                                    for (e = "", d > 10 && (d = 10); e.length < d; e += " ");
                            } else h == y && (e = d.length <= 10 ? d : d.slice(0, 10));
                        return K("", (i = {}, i[""] = a, i), f, g, e, "", [])
                    }
                }
                if (!f("json-parse")) {
                    var L, M, N = h.fromCharCode,
                        O = {
                            92: "\\",
                            34: '"',
                            47: "/",
                            98: "\b",
                            116: "	",
                            110: "\n",
                            102: "\f",
                            114: "\r"
                        },
                        P = function() {
                            throw L = M = null, k()
                        },
                        Q = function() {
                            for (var a, b, c, d, e, f = M, g = f.length; g > L;) switch (e = f.charCodeAt(L)) {
                                case 9:
                                case 10:
                                case 13:
                                case 32:
                                    L++;
                                    break;
                                case 123:
                                case 125:
                                case 91:
                                case 93:
                                case 58:
                                case 44:
                                    return a = B ? f.charAt(L) : f[L], L++, a;
                                case 34:
                                    for (a = "@", L++; g > L;)
                                        if (e = f.charCodeAt(L), 32 > e) P();
                                        else if (92 == e) switch (e = f.charCodeAt(++L)) {
                                        case 92:
                                        case 34:
                                        case 47:
                                        case 98:
                                        case 116:
                                        case 110:
                                        case 102:
                                        case 114:
                                            a += O[e], L++;
                                            break;
                                        case 117:
                                            for (b = ++L, c = L + 4; c > L; L++) e = f.charCodeAt(L), e >= 48 && 57 >= e || e >= 97 && 102 >= e || e >= 65 && 70 >= e || P();
                                            a += N("0x" + f.slice(b, L));
                                            break;
                                        default:
                                            P()
                                    } else {
                                        if (34 == e) break;
                                        for (e = f.charCodeAt(L), b = L; e >= 32 && 92 != e && 34 != e;) e = f.charCodeAt(++L);
                                        a += f.slice(b, L)
                                    }
                                    if (34 == f.charCodeAt(L)) return L++, a;
                                    P();
                                default:
                                    if (b = L, 45 == e && (d = !0, e = f.charCodeAt(++L)), e >= 48 && 57 >= e) {
                                        for (48 == e && (e = f.charCodeAt(L + 1), e >= 48 && 57 >= e) && P(), d = !1; g > L && (e = f.charCodeAt(L), e >= 48 && 57 >= e); L++);
                                        if (46 == f.charCodeAt(L)) {
                                            for (c = ++L; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                                            c == L && P(), L = c
                                        }
                                        if (e = f.charCodeAt(L), 101 == e || 69 == e) {
                                            for (e = f.charCodeAt(++L), (43 == e || 45 == e) && L++, c = L; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                                            c == L && P(), L = c
                                        }
                                        return +f.slice(b, L)
                                    }
                                    if (d && P(), "true" == f.slice(L, L + 4)) return L += 4, !0;
                                    if ("false" == f.slice(L, L + 5)) return L += 5, !1;
                                    if ("null" == f.slice(L, L + 4)) return L += 4, null;
                                    P()
                            }
                            return "$"
                        },
                        R = function(a) {
                            var b, c;
                            if ("$" == a && P(), "string" == typeof a) {
                                if ("@" == (B ? a.charAt(0) : a[0])) return a.slice(1);
                                if ("[" == a) {
                                    for (b = []; a = Q(), "]" != a; c || (c = !0)) c && ("," == a ? (a = Q(), "]" == a && P()) : P()), "," == a && P(), b.push(R(a));
                                    return b
                                }
                                if ("{" == a) {
                                    for (b = {}; a = Q(), "}" != a; c || (c = !0)) c && ("," == a ? (a = Q(), "}" == a && P()) : P()), ("," == a || "string" != typeof a || "@" != (B ? a.charAt(0) : a[0]) || ":" != Q()) && P(), b[a.slice(1)] = R(Q());
                                    return b
                                }
                                P()
                            }
                            return a
                        },
                        S = function(a, b, c) {
                            var d = T(a, b, c);
                            d === q ? delete a[b] : a[b] = d
                        },
                        T = function(a, b, c) {
                            var d, e = a[b];
                            if ("object" == typeof e && e)
                                if (s.call(e) == z)
                                    for (d = e.length; d--;) S(e, d, c);
                                else p(e, function(a) {
                                    S(e, a, c)
                                });
                            return c.call(a, b, e)
                        };
                    d.parse = function(a, b) {
                        var c, d;
                        return L = 0, M = "" + a, c = R(Q()), "$" != Q() && P(), L = M = null, b && s.call(b) == v ? T((d = {}, d[""] = c, d), "", b) : c
                    }
                }
            }
            return d.runInContext = a, d
        }
        var b = "function" == typeof define && define.amd,
            c = {
                "function": !0,
                object: !0
            },
            d = c[typeof exports] && exports && !exports.nodeType && exports,
            e = c[typeof window] && window || this,
            f = d && c[typeof module] && module && !module.nodeType && "object" == typeof global && global;
        if (!f || f.global !== f && f.window !== f && f.self !== f || (e = f), d && !b) a(e, d);
        else {
            var g = e.JSON,
                h = e.JSON3,
                i = !1,
                j = a(e, e.JSON3 = {
                    noConflict: function() {
                        return i || (i = !0, e.JSON = g, e.JSON3 = h, g = h = null), j
                    }
                });
            e.JSON = {
                parse: j.parse,
                stringify: j.stringify
            }
        }
        b && define(function() {
            return j
        })
    }.call(this),
    function() {
        var a = {};
        a.parseXML = function(a, b) {
            var c = null;
            try {
                if (window.DOMParser) {
                    var d = new DOMParser;
                    c = d.parseFromString(a, b)
                } else c = new ActiveXObject("Microsoft.XMLDOM"), c.async = !1, c.loadXML(a)
            } catch (e) {}
            return c
        }, a.parseJSON = function(a) {
            if (null == a) return null;
            try {
                return JSON.parse(a)
            } catch (b) {
                throw b
            }
        }, createjs.DataUtils = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a() {
            this.src = null, this.type = null, this.id = null, this.maintainOrder = !1, this.callback = null, this.data = null, this.method = createjs.LoadItem.GET, this.values = null, this.headers = null, this.withCredentials = !1, this.mimeType = null, this.crossOrigin = null, this.loadTimeout = 8e3
        }
        var b = a.prototype = {},
            c = a;
        c.create = function(b) {
            if ("string" == typeof b) {
                var d = new a;
                return d.src = b, d
            }
            if (b instanceof c) return b;
            if (b instanceof Object) return b;
            throw new Error("Type not recognized.")
        }, b.set = function(a) {
            for (var b in a) this[b] = a[b];
            return this
        }, createjs.LoadItem = c
    }(),
    function() {
        var a = {};
        a.ABSOLUTE_PATT = /^(?:\w+:)?\/{2}/i, a.RELATIVE_PATT = /^[./]*?\//i, a.EXTENSION_PATT = /\/?[^/]+\.(\w{1,5})$/i, a.parseURI = function(b) {
            var c = {
                absolute: !1,
                relative: !1
            };
            if (null == b) return c;
            var d = b.indexOf("?");
            d > -1 && (b = b.substr(0, d));
            var e;
            return a.ABSOLUTE_PATT.test(b) ? c.absolute = !0 : a.RELATIVE_PATT.test(b) && (c.relative = !0), (e = b.match(a.EXTENSION_PATT)) && (c.extension = e[1].toLowerCase()), c
        }, a.formatQueryString = function(a, b) {
            if (null == a) throw new Error("You must specify data.");
            var c = [];
            for (var d in a) c.push(d + "=" + escape(a[d]));
            return b && (c = c.concat(b)), c.join("&")
        }, a.buildPath = function(a, b) {
            if (null == b) return a;
            var c = [],
                d = a.indexOf("?");
            if (-1 != d) {
                var e = a.slice(d + 1);
                c = c.concat(e.split("&"))
            }
            return -1 != d ? a.slice(0, d) + "?" + this._formatQueryString(b, c) : a + "?" + this._formatQueryString(b, c)
        }, a.isCrossDomain = function(a) {
            var b = document.createElement("a");
            b.href = a.src;
            var c = document.createElement("a");
            c.href = location.href;
            var d = "" != b.hostname && (b.port != c.port || b.protocol != c.protocol || b.hostname != c.hostname);
            return d
        }, a.isLocal = function(a) {
            var b = document.createElement("a");
            return b.href = a.src, "" == b.hostname && "file:" == b.protocol
        }, a.isBinary = function(a) {
            switch (a) {
                case createjs.AbstractLoader.IMAGE:
                case createjs.AbstractLoader.BINARY:
                    return !0;
                default:
                    return !1
            }
        }, a.isImageTag = function(a) {
            return a instanceof HTMLImageElement
        }, a.isAudioTag = function(a) {
            return window.HTMLAudioElement ? a instanceof HTMLAudioElement : !1
        }, a.isVideoTag = function(a) {
            return window.HTMLVideoElement ? a instanceof HTMLVideoElement : void 0
        }, a.isText = function(a) {
            switch (a) {
                case createjs.AbstractLoader.TEXT:
                case createjs.AbstractLoader.JSON:
                case createjs.AbstractLoader.MANIFEST:
                case createjs.AbstractLoader.XML:
                case createjs.AbstractLoader.CSS:
                case createjs.AbstractLoader.SVG:
                case createjs.AbstractLoader.JAVASCRIPT:
                    return !0;
                default:
                    return !1
            }
        }, a.getTypeByExtension = function(a) {
            if (null == a) return createjs.AbstractLoader.TEXT;
            switch (a.toLowerCase()) {
                case "jpeg":
                case "jpg":
                case "gif":
                case "png":
                case "webp":
                case "bmp":
                    return createjs.AbstractLoader.IMAGE;
                case "ogg":
                case "mp3":
                case "webm":
                    return createjs.AbstractLoader.SOUND;
                case "mp4":
                case "webm":
                case "ts":
                    return createjs.AbstractLoader.VIDEO;
                case "json":
                    return createjs.AbstractLoader.JSON;
                case "xml":
                    return createjs.AbstractLoader.XML;
                case "css":
                    return createjs.AbstractLoader.CSS;
                case "js":
                    return createjs.AbstractLoader.JAVASCRIPT;
                case "svg":
                    return createjs.AbstractLoader.SVG;
                default:
                    return createjs.AbstractLoader.TEXT
            }
        }, createjs.RequestUtils = a
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.EventDispatcher_constructor(), this.loaded = !1, this.canceled = !1, this.progress = 0, this.type = c, this.resultFormatter = null, this._item = a ? createjs.LoadItem.create(a) : null, this._preferXHR = b, this._result = null, this._rawResult = null, this._loadedItems = null, this._tagSrcAttribute = null, this._tag = null
        }
        var b = createjs.extend(a, createjs.EventDispatcher),
            c = a;
        c.POST = "POST", c.GET = "GET", c.BINARY = "binary", c.CSS = "css", c.IMAGE = "image", c.JAVASCRIPT = "javascript", c.JSON = "json", c.JSONP = "jsonp", c.MANIFEST = "manifest", c.SOUND = "sound", c.VIDEO = "video", c.SPRITESHEET = "spritesheet", c.SVG = "svg", c.TEXT = "text", c.XML = "xml", b.getItem = function() {
            return this._item
        }, b.getResult = function(a) {
            return a ? this._rawResult : this._result
        }, b.getTag = function() {
            return this._tag
        }, b.setTag = function(a) {
            this._tag = a
        }, b.load = function() {
            this._createRequest(), this._request.on("complete", this, this), this._request.on("progress", this, this), this._request.on("loadStart", this, this), this._request.on("abort", this, this), this._request.on("timeout", this, this), this._request.on("error", this, this);
            var a = new createjs.Event("initialize");
            a.loader = this._request, this.dispatchEvent(a), this._request.load()
        }, b.cancel = function() {
            this.canceled = !0, this.destroy()
        }, b.destroy = function() {
            this._request && (this._request.removeAllEventListeners(), this._request.destroy()), this._request = null, this._item = null, this._rawResult = null, this._result = null, this._loadItems = null, this.removeAllEventListeners()
        }, b.getLoadedItems = function() {
            return this._loadedItems
        }, b._createRequest = function() {
            this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.TagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
        }, b._createTag = function() {
            return null
        }, b._sendLoadStart = function() {
            this._isCanceled() || this.dispatchEvent("loadstart")
        }, b._sendProgress = function(a) {
            if (!this._isCanceled()) {
                var b = null;
                "number" == typeof a ? (this.progress = a, b = new createjs.ProgressEvent(this.progress)) : (b = a, this.progress = a.loaded / a.total, b.progress = this.progress, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0)), this.hasEventListener("progress") && this.dispatchEvent(b)
            }
        }, b._sendComplete = function() {
            if (!this._isCanceled()) {
                this.loaded = !0;
                var a = new createjs.Event("complete");
                a.rawResult = this._rawResult, null != this._result && (a.result = this._result), this.dispatchEvent(a)
            }
        }, b._sendError = function(a) {
            !this._isCanceled() && this.hasEventListener("error") && (null == a && (a = new createjs.ErrorEvent("PRELOAD_ERROR_EMPTY")), this.dispatchEvent(a))
        }, b._isCanceled = function() {
            return null == window.createjs || this.canceled ? !0 : !1
        }, b.resultFormatter = null, b.handleEvent = function(a) {
            switch (a.type) {
                case "complete":
                    this._rawResult = a.target._response;
                    var b = this.resultFormatter && this.resultFormatter(this),
                        c = this;
                    b instanceof Function ? b(function(a) {
                        c._result = a, c._sendComplete()
                    }) : (this._result = b || this._rawResult, this._sendComplete());
                    break;
                case "progress":
                    this._sendProgress(a);
                    break;
                case "error":
                    this._sendError(a);
                    break;
                case "loadstart":
                    this._sendLoadStart();
                    break;
                case "abort":
                case "timeout":
                    this._isCanceled() || this.dispatchEvent(a.type)
            }
        }, b.buildPath = function(a, b) {
            return createjs.RequestUtils.buildPath(a, b)
        }, b.toString = function() {
            return "[PreloadJS AbstractLoader]"
        }, createjs.AbstractLoader = createjs.promote(a, "EventDispatcher")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.AbstractLoader_constructor(a, b, c), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src"
        }
        var b = createjs.extend(a, createjs.AbstractLoader);
        b.load = function() {
            this._tag || (this._tag = this._createTag(this._item.src)), this._tag.preload = "auto", this._tag.load(), this.AbstractLoader_load()
        }, b._createTag = function() {}, b._createRequest = function() {
            this._request = this._preferXHR ? new createjs.XHRRequest(this._item) : new createjs.MediaTagRequest(this._item, this._tag || this._createTag(), this._tagSrcAttribute)
        }, b._formatResult = function(a) {
            return this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._preferXHR && (a.getTag().src = a.getResult(!0)), a.getTag()
        }, createjs.AbstractMediaLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";
        var a = function(a) {
                this._item = a
            },
            b = createjs.extend(a, createjs.EventDispatcher);
        b.load = function() {}, b.destroy = function() {}, b.cancel = function() {}, createjs.AbstractRequest = createjs.promote(a, "EventDispatcher")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this), this._addedToDOM = !1, this._startTagVisibility = null
        }
        var b = createjs.extend(a, createjs.AbstractRequest);
        b.load = function() {
            null == this._tag.parentNode && (window.document.body.appendChild(this._tag), this._addedToDOM = !0), this._tag.onload = createjs.proxy(this._handleTagComplete, this), this._tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
            var a = new createjs.Event("initialize");
            a.loader = this._tag, this.dispatchEvent(a), this._hideTag(), this._tag[this._tagSrcAttribute] = this._item.src
        }, b.destroy = function() {
            this._clean(), this._tag = null, this.AbstractRequest_destroy()
        }, b._handleReadyStateChange = function() {
            clearTimeout(this._loadTimeout);
            var a = this._tag;
            ("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete()
        }, b._handleTagComplete = function() {
            this._rawResult = this._tag, this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult, this._clean(), this._showTag(), this.dispatchEvent("complete")
        }, b._clean = function() {
            this._tag.onload = null, this._tag.onreadystatechange = null, this._addedToDOM && null != this._tag.parentNode && this._tag.parentNode.removeChild(this._tag)
        }, b._hideTag = function() {
            this._startTagVisibility = this._tag.style.visibility, this._tag.style.visibility = "hidden"
        }, b._showTag = function() {
            this._tag.style.visibility = this._startTagVisibility
        }, b._handleStalled = function() {}, createjs.TagRequest = createjs.promote(a, "AbstractRequest")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.AbstractRequest_constructor(a), this._tag = b, this._tagSrcAttribute = c, this._loadedHandler = createjs.proxy(this._handleTagComplete, this)
        }
        var b = createjs.extend(a, createjs.TagRequest);
        b.load = function() {
            this._tag.onstalled = createjs.proxy(this._handleStalled, this), this._tag.onprogress = createjs.proxy(this._handleProgress, this), this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler, !1), this.TagRequest_load()
        }, b._handleReadyStateChange = function() {
            clearTimeout(this._loadTimeout);
            var a = this._tag;
            ("loaded" == a.readyState || "complete" == a.readyState) && this._handleTagComplete()
        }, b._handleStalled = function() {}, b._handleProgress = function(a) {
            if (a && !(a.loaded > 0 && 0 == a.total)) {
                var b = new createjs.ProgressEvent(a.loaded, a.total);
                this.dispatchEvent(b)
            }
        }, b._clean = function() {
            this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler), this._tag.onstalled = null, this._tag.onprogress = null, this.TagRequest__clean()
        }, createjs.MediaTagRequest = createjs.promote(a, "TagRequest")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractRequest_constructor(a), this._request = null, this._loadTimeout = null, this._xhrLevel = 1, this._response = null, this._rawResponse = null, this._canceled = !1, this._handleLoadStartProxy = createjs.proxy(this._handleLoadStart, this), this._handleProgressProxy = createjs.proxy(this._handleProgress, this), this._handleAbortProxy = createjs.proxy(this._handleAbort, this), this._handleErrorProxy = createjs.proxy(this._handleError, this), this._handleTimeoutProxy = createjs.proxy(this._handleTimeout, this), this._handleLoadProxy = createjs.proxy(this._handleLoad, this), this._handleReadyStateChangeProxy = createjs.proxy(this._handleReadyStateChange, this), !this._createXHR(a)
        }
        var b = createjs.extend(a, createjs.AbstractRequest);
        a.ACTIVEX_VERSIONS = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], b.getResult = function(a) {
            return a && this._rawResponse ? this._rawResponse : this._response
        }, b.cancel = function() {
            this.canceled = !0, this._clean(), this._request.abort()
        }, b.load = function() {
            if (null == this._request) return void this._handleError();
            this._request.addEventListener("loadstart", this._handleLoadStartProxy, !1), this._request.addEventListener("progress", this._handleProgressProxy, !1), this._request.addEventListener("abort", this._handleAbortProxy, !1), this._request.addEventListener("error", this._handleErrorProxy, !1), this._request.addEventListener("timeout", this._handleTimeoutProxy, !1), this._request.addEventListener("load", this._handleLoadProxy, !1), this._request.addEventListener("readystatechange", this._handleReadyStateChangeProxy, !1), 1 == this._xhrLevel && (this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), this._item.loadTimeout));
            try {
                this._item.values && this._item.method != createjs.AbstractLoader.GET ? this._item.method == createjs.AbstractLoader.POST && this._request.send(createjs.RequestUtils.formatQueryString(this._item.values)) : this._request.send()
            } catch (a) {
                this.dispatchEvent(new createjs.ErrorEvent("XHR_SEND", null, a))
            }
        }, b.setResponseType = function(a) {
            this._request.responseType = a
        }, b.getAllResponseHeaders = function() {
            return this._request.getAllResponseHeaders instanceof Function ? this._request.getAllResponseHeaders() : null
        }, b.getResponseHeader = function(a) {
            return this._request.getResponseHeader instanceof Function ? this._request.getResponseHeader(a) : null
        }, b._handleProgress = function(a) {
            if (a && !(a.loaded > 0 && 0 == a.total)) {
                var b = new createjs.ProgressEvent(a.loaded, a.total);
                this.dispatchEvent(b)
            }
        }, b._handleLoadStart = function() {
            clearTimeout(this._loadTimeout), this.dispatchEvent("loadstart")
        }, b._handleAbort = function(a) {
            this._clean(), this.dispatchEvent(new createjs.ErrorEvent("XHR_ABORTED", null, a))
        }, b._handleError = function(a) {
            this._clean(), this.dispatchEvent(new createjs.ErrorEvent(a.message))
        }, b._handleReadyStateChange = function() {
            4 == this._request.readyState && this._handleLoad()
        }, b._handleLoad = function() {
            if (!this.loaded) {
                this.loaded = !0;
                var a = this._checkError();
                if (a) return void this._handleError(a);
                this._response = this._getResponse(), this._clean(), this.dispatchEvent(new createjs.Event("complete"))
            }
        }, b._handleTimeout = function(a) {
            this._clean(), this.dispatchEvent(new createjs.ErrorEvent("PRELOAD_TIMEOUT", null, a))
        }, b._checkError = function() {
            var a = parseInt(this._request.status);
            switch (a) {
                case 404:
                case 0:
                    return new Error(a)
            }
            return null
        }, b._getResponse = function() {
            if (null != this._response) return this._response;
            if (null != this._request.response) return this._request.response;
            try {
                if (null != this._request.responseText) return this._request.responseText
            } catch (a) {}
            try {
                if (null != this._request.responseXML) return this._request.responseXML
            } catch (a) {}
            return null
        }, b._createXHR = function(a) {
            var b = createjs.RequestUtils.isCrossDomain(a),
                c = {},
                d = null;
            if (window.XMLHttpRequest) d = new XMLHttpRequest, b && void 0 === d.withCredentials && window.XDomainRequest && (d = new XDomainRequest);
            else {
                for (var e = 0, f = s.ACTIVEX_VERSIONS.length; f > e; e++) {
                    {
                        s.ACTIVEX_VERSIONS[e]
                    }
                    try {
                        d = new ActiveXObject(axVersions);
                        break
                    } catch (g) {}
                }
                if (null == d) return !1
            }
            a.mimeType && d.overrideMimeType && d.overrideMimeType(a.mimeType), this._xhrLevel = "string" == typeof d.responseType ? 2 : 1;
            var h = null;
            if (h = a.method == createjs.AbstractLoader.GET ? createjs.RequestUtils.buildPath(a.src, a.values) : a.src, d.open(a.method || createjs.AbstractLoader.GET, h, !0), b && d instanceof XMLHttpRequest && 1 == this._xhrLevel && (c.Origin = location.origin), a.values && a.method == createjs.AbstractLoader.POST && (c["Content-Type"] = "application/x-www-form-urlencoded"), b || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"), a.headers)
                for (var i in a.headers) c[i] = a.headers[i];
            for (i in c) d.setRequestHeader(i, c[i]);
            return d instanceof XMLHttpRequest && void 0 !== a.withCredentials && (d.withCredentials = a.withCredentials), this._request = d, !0
        }, b._clean = function() {
            clearTimeout(this._loadTimeout), this._request.removeEventListener("loadstart", this._handleLoadStartProxy), this._request.removeEventListener("progress", this._handleProgressProxy), this._request.removeEventListener("abort", this._handleAbortProxy), this._request.removeEventListener("error", this._handleErrorProxy), this._request.removeEventListener("timeout", this._handleTimeoutProxy), this._request.removeEventListener("load", this._handleLoadProxy), this._request.removeEventListener("readystatechange", this._handleReadyStateChangeProxy)
        }, b.toString = function() {
            return "[PreloadJS XHRRequest]"
        }, createjs.XHRRequest = createjs.promote(a, "AbstractRequest")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b, c) {
            this.AbstractLoader_constructor(), this.init(a, b, c)
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        b.init = function(a, b, c) {
            this.useXHR = !0, this.preferXHR = !0, this._preferXHR = !0, this.setPreferXHR(a), this.stopOnError = !1, this.maintainScriptOrder = !0, this.next = null, this._paused = !1, this._basePath = b, this._crossOrigin = c, this._typeCallbacks = {}, this._extensionCallbacks = {}, this._loadStartWasDispatched = !1, this._maxConnections = 1, this._currentlyLoadingScript = null, this._currentLoads = [], this._loadQueue = [], this._loadQueueBackup = [], this._loadItemsById = {}, this._loadItemsBySrc = {}, this._loadedResults = {}, this._loadedRawResults = {}, this._numItems = 0, this._numItemsLoaded = 0, this._scriptOrder = [], this._loadedScripts = [], this._lastProgress = 0 / 0, this._availableLoaders = [createjs.ImageLoader, createjs.JavaScriptLoader, createjs.CSSLoader, createjs.JSONLoader, createjs.JSONPLoader, createjs.SoundLoader, createjs.ManifestLoader, createjs.SpriteSheetLoader, createjs.XMLLoader, createjs.SVGLoader, createjs.BinaryLoader, createjs.VideoLoader, createjs.TextLoader], this._defaultLoaderLength = this._availableLoaders.length
        }, c.loadTimeout = 8e3, c.LOAD_TIMEOUT = 0, c.BINARY = createjs.AbstractLoader.BINARY, c.CSS = createjs.AbstractLoader.CSS, c.IMAGE = createjs.AbstractLoader.IMAGE, c.JAVASCRIPT = createjs.AbstractLoader.JAVASCRIPT, c.JSON = createjs.AbstractLoader.JSON, c.JSONP = createjs.AbstractLoader.JSONP, c.MANIFEST = createjs.AbstractLoader.MANIFEST, c.SOUND = createjs.AbstractLoader.SOUND, c.VIDEO = createjs.AbstractLoader.VIDEO, c.SVG = createjs.AbstractLoader.SVG, c.TEXT = createjs.AbstractLoader.TEXT, c.XML = createjs.AbstractLoader.XML, c.POST = createjs.AbstractLoader.POST, c.GET = createjs.AbstractLoader.GET, b.registerLoader = function(a) {
            if (!a || !a.canLoadItem) throw new Error("loader is of an incorrect type.");
            if (-1 != this._availableLoaders.indexOf(a)) throw new Error("loader already exists.");
            this._availableLoaders.unshift(a)
        }, b.unregisterLoader = function(a) {
            var b = this._availableLoaders.indexOf(a); - 1 != b && b < this._defaultLoaderLength - 1 && this._availableLoaders.splice(b, 1)
        }, b.setUseXHR = function(a) {
            return this.setPreferXHR(a)
        }, b.setPreferXHR = function(a) {
            return this.preferXHR = 0 != a && null != window.XMLHttpRequest, this.preferXHR
        }, b.removeAll = function() {
            this.remove()
        }, b.remove = function(a) {
            var b = null;
            if (!a || a instanceof Array) {
                if (a) b = a;
                else if (arguments.length > 0) return
            } else b = [a];
            var c = !1;
            if (b) {
                for (; b.length;) {
                    var d = b.pop(),
                        e = this.getResult(d);
                    for (f = this._loadQueue.length - 1; f >= 0; f--)
                        if (g = this._loadQueue[f].getItem(), g.id == d || g.src == d) {
                            this._loadQueue.splice(f, 1)[0].cancel();
                            break
                        }
                    for (f = this._loadQueueBackup.length - 1; f >= 0; f--)
                        if (g = this._loadQueueBackup[f].getItem(), g.id == d || g.src == d) {
                            this._loadQueueBackup.splice(f, 1)[0].cancel();
                            break
                        }
                    if (e) delete this._loadItemsById[e.id], delete this._loadItemsBySrc[e.src], this._disposeItem(e);
                    else
                        for (var f = this._currentLoads.length - 1; f >= 0; f--) {
                            var g = this._currentLoads[f].getItem();
                            if (g.id == d || g.src == d) {
                                this._currentLoads.splice(f, 1)[0].cancel(), c = !0;
                                break
                            }
                        }
                }
                c && this._loadNext()
            } else {
                this.close();
                for (var h in this._loadItemsById) this._disposeItem(this._loadItemsById[h]);
                this.init(this.preferXHR, this._basePath)
            }
        }, b.reset = function() {
            this.close();
            for (var a in this._loadItemsById) this._disposeItem(this._loadItemsById[a]);
            for (var b = [], c = 0, d = this._loadQueueBackup.length; d > c; c++) b.push(this._loadQueueBackup[c].getItem());
            this.loadManifest(b, !1)
        }, b.installPlugin = function(a) {
            if (null != a && null != a.getPreloadHandlers) {
                var b = a.getPreloadHandlers();
                if (b.scope = a, null != b.types)
                    for (var c = 0, d = b.types.length; d > c; c++) this._typeCallbacks[b.types[c]] = b;
                if (null != b.extensions)
                    for (c = 0, d = b.extensions.length; d > c; c++) this._extensionCallbacks[b.extensions[c]] = b
            }
        }, b.setMaxConnections = function(a) {
            this._maxConnections = a, !this._paused && this._loadQueue.length > 0 && this._loadNext()
        }, b.loadFile = function(a, b, c) {
            if (null == a) {
                var d = new createjs.ErrorEvent("PRELOAD_NO_FILE");
                return void this._sendError(d)
            }
            this._addItem(a, null, c), this.setPaused(b !== !1 ? !1 : !0)
        }, b.loadManifest = function(a, b, d) {
            var e = null,
                f = null;
            if (a instanceof Array) {
                if (0 == a.length) {
                    var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_EMPTY");
                    return void this._sendError(g)
                }
                e = a
            } else if ("string" == typeof a) e = [{
                src: a,
                type: c.MANIFEST
            }];
            else {
                if ("object" != typeof a) {
                    var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_NULL");
                    return void this._sendError(g)
                }
                if (void 0 !== a.src) {
                    if (null == a.type) a.type = c.MANIFEST;
                    else if (a.type != c.MANIFEST) {
                        var g = new createjs.ErrorEvent("PRELOAD_MANIFEST_TYPE");
                        this._sendError(g)
                    }
                    e = [a]
                } else void 0 !== a.manifest && (e = a.manifest, f = a.path)
            }
            for (var h = 0, i = e.length; i > h; h++) this._addItem(e[h], f, d);
            this.setPaused(b !== !1 ? !1 : !0)
        }, b.load = function() {
            this.setPaused(!1)
        }, b.getItem = function(a) {
            return this._loadItemsById[a] || this._loadItemsBySrc[a]
        }, b.getResult = function(a, b) {
            var c = this._loadItemsById[a] || this._loadItemsBySrc[a];
            if (null == c) return null;
            var d = c.id;
            return b && this._loadedRawResults[d] ? this._loadedRawResults[d] : this._loadedResults[d]
        }, b.getItems = function(a) {
            for (var b = [], c = 0, d = this._loadQueueBackup.length; d > c; c++) {
                var e = this._loadQueueBackup[c],
                    f = e.getItem();
                (a !== !0 || e.loaded) && b.push({
                    item: f,
                    result: this.getResult(f.id),
                    rawResult: this.getResult(f.id, !0)
                })
            }
            return b
        }, b.setPaused = function(a) {
            this._paused = a, this._paused || this._loadNext()
        }, b.close = function() {
            for (; this._currentLoads.length;) this._currentLoads.pop().cancel();
            this._scriptOrder.length = 0, this._loadedScripts.length = 0, this.loadStartWasDispatched = !1, this._itemCount = 0, this._lastProgress = 0 / 0
        }, b._addItem = function(a, b, c) {
            var d = this._createLoadItem(a, b, c);
            if (null != d) {
                var e = this._createLoader(d);
                null != e && (d._loader = e, this._loadQueue.push(e), this._loadQueueBackup.push(e), this._numItems++, this._updateProgress(), (this.maintainScriptOrder && d.type == createjs.LoadQueue.JAVASCRIPT || d.maintainOrder === !0) && (this._scriptOrder.push(d), this._loadedScripts.push(null)))
            }
        }, b._createLoadItem = function(a, b, d) {
            var e = createjs.LoadItem.create(a);
            if (null == e) return null;
            var f = createjs.RequestUtils.parseURI(e.src);
            f.extension && (e.ext = f.extension), null == e.type && (e.type = createjs.RequestUtils.getTypeByExtension(e.ext));
            var g = "",
                h = d || this._basePath,
                i = e.src;
            if (!f.absolute && !f.relative)
                if (b) {
                    g = b;
                    var j = createjs.RequestUtils.parseURI(b);
                    i = b + i, null == h || j.absolute || j.relative || (g = h + g)
                } else null != h && (g = h);
            e.src = g + e.src, e.path = g, (void 0 === e.id || null === e.id || "" === e.id) && (e.id = i);
            var k = this._typeCallbacks[e.type] || this._extensionCallbacks[e.ext];
            if (k) {
                var l = k.callback.call(k.scope, e, this);
                if (l === !1) return null;
                l === !0 || null != l && (e._loader = l), f = createjs.RequestUtils.parseURI(e.src), null != f.extension && (e.ext = f.extension)
            }
            return this._loadItemsById[e.id] = e, this._loadItemsBySrc[e.src] = e, null == e.loadTimeout && (e.loadTimeout = c.loadTimeout), null == e.crossOrigin && (e.crossOrigin = this._crossOrigin), e
        }, b._createLoader = function(a) {
            if (null != a._loader) return a._loader;
            for (var b = this.preferXHR, c = 0; c < this._availableLoaders.length; c++) {
                var d = this._availableLoaders[c];
                if (d && d.canLoadItem(a)) return new d(a, b)
            }
            return null
        }, b._loadNext = function() {
            if (!this._paused) {
                this._loadStartWasDispatched || (this._sendLoadStart(), this._loadStartWasDispatched = !0), this._numItems == this._numItemsLoaded ? (this.loaded = !0, this._sendComplete(), this.next && this.next.load && this.next.load()) : this.loaded = !1;
                for (var a = 0; a < this._loadQueue.length && !(this._currentLoads.length >= this._maxConnections); a++) {
                    var b = this._loadQueue[a];
                    this._canStartLoad(b) && (this._loadQueue.splice(a, 1), a--, this._loadItem(b))
                }
            }
        }, b._loadItem = function(a) {
            a.on("fileload", this._handleFileLoad, this), a.on("progress", this._handleProgress, this), a.on("complete", this._handleFileComplete, this), a.on("error", this._handleError, this), a.on("fileerror", this._handleFileError, this), this._currentLoads.push(a), this._sendFileStart(a.getItem()), a.load()
        }, b._handleFileLoad = function(a) {
            a.target = null, this.dispatchEvent(a)
        }, b._handleFileError = function(a) {
            var b = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, a.item);
            this._sendError(b)
        }, b._handleError = function(a) {
            var b = a.target;
            this._numItemsLoaded++, this._finishOrderedItem(b, !0), this._updateProgress();
            var c = new createjs.ErrorEvent("FILE_LOAD_ERROR", null, b.getItem());
            this._sendError(c), this.stopOnError || (this._removeLoadItem(b), this._loadNext())
        }, b._handleFileComplete = function(a) {
            var b = a.target,
                c = b.getItem(),
                d = b.getResult();
            this._loadedResults[c.id] = d;
            var e = b.getResult(!0);
            null != e && e !== d && (this._loadedRawResults[c.id] = e), this._saveLoadedItems(b), this._removeLoadItem(b), this._finishOrderedItem(b) || this._processFinishedLoad(c, b)
        }, b._saveLoadedItems = function(a) {
            var b = a.getLoadedItems();
            if (null !== b)
                for (var c = 0; c < b.length; c++) {
                    var d = b[c].item;
                    this._loadItemsBySrc[d.src] = d, this._loadItemsById[d.id] = d, this._loadedResults[d.id] = b[c].result, this._loadedRawResults[d.id] = b[c].rawResult
                }
        }, b._finishOrderedItem = function(a, b) {
            var c = a.getItem();
            if (this.maintainScriptOrder && c.type == createjs.LoadQueue.JAVASCRIPT || c.maintainOrder) {
                a instanceof createjs.JavaScriptLoader && (this._currentlyLoadingScript = !1);
                var d = createjs.indexOf(this._scriptOrder, c);
                return -1 == d ? !1 : (this._loadedScripts[d] = b === !0 ? !0 : c, this._checkScriptLoadOrder(), !0)
            }
            return !1
        }, b._checkScriptLoadOrder = function() {
            for (var a = this._loadedScripts.length, b = 0; a > b; b++) {
                var c = this._loadedScripts[b];
                if (null === c) break;
                if (c !== !0) {
                    var d = this._loadedResults[c.id];
                    c.type == createjs.LoadQueue.JAVASCRIPT && (document.body || document.getElementsByTagName("body")[0]).appendChild(d);
                    var e = c._loader;
                    this._processFinishedLoad(c, e), this._loadedScripts[b] = !0
                }
            }
        }, b._processFinishedLoad = function(a, b) {
            this._numItemsLoaded++, this._updateProgress(), this._sendFileComplete(a, b), this._loadNext()
        }, b._canStartLoad = function(a) {
            if (!this.maintainScriptOrder || a.preferXHR) return !0;
            var b = a.getItem();
            if (b.type != createjs.LoadQueue.JAVASCRIPT) return !0;
            if (this._currentlyLoadingScript) return !1;
            for (var c = this._scriptOrder.indexOf(b), d = 0; c > d;) {
                var e = this._loadedScripts[d];
                if (null == e) return !1;
                d++
            }
            return this._currentlyLoadingScript = !0, !0
        }, b._removeLoadItem = function(a) {
            var b = a.getItem();
            delete b._loader;
            for (var c = this._currentLoads.length, d = 0; c > d; d++)
                if (this._currentLoads[d] == a) {
                    this._currentLoads.splice(d, 1);
                    break
                }
        }, b._handleProgress = function(a) {
            var b = a.target;
            this._sendFileProgress(b.getItem(), b.progress), this._updateProgress()
        }, b._updateProgress = function() {
            var a = this._numItemsLoaded / this._numItems,
                b = this._numItems - this._numItemsLoaded;
            if (b > 0) {
                for (var c = 0, d = 0, e = this._currentLoads.length; e > d; d++) c += this._currentLoads[d].progress;
                a += c / b * (b / this._numItems)
            }
            this._lastProgress != a && (this._sendProgress(a), this._lastProgress = a)
        }, b._disposeItem = function(a) {
            delete this._loadedResults[a.id], delete this._loadedRawResults[a.id], delete this._loadItemsById[a.id], delete this._loadItemsBySrc[a.src]
        }, b._sendFileProgress = function(a, b) {
            if (this._isCanceled()) return void this._cleanUp();
            if (this.hasEventListener("fileprogress")) {
                var c = new createjs.Event("fileprogress");
                c.progress = b, c.loaded = b, c.total = 1, c.item = a, this.dispatchEvent(c)
            }
        }, b._sendFileComplete = function(a, b) {
            if (!this._isCanceled()) {
                var c = new createjs.Event("fileload");
                c.loader = b, c.item = a, c.result = this._loadedResults[a.id], c.rawResult = this._loadedRawResults[a.id], a.completeHandler && a.completeHandler(c), this.hasEventListener("fileload") && this.dispatchEvent(c)
            }
        }, b._sendFileStart = function(a) {
            var b = new createjs.Event("filestart");
            b.item = a, this.hasEventListener("filestart") && this.dispatchEvent(b)
        }, b.toString = function() {
            return "[PreloadJS LoadQueue]"
        }, createjs.LoadQueue = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.TEXT)
        }
        var b = (createjs.extend(a, createjs.AbstractLoader), a);
        b.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.TEXT
        }, createjs.TextLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.BINARY), this.on("initialize", this._updateXHR, this)
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.BINARY
        }, b._updateXHR = function(a) {
            a.loader.setResponseType("arraybuffer")
        }, createjs.BinaryLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.CSS), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "href", this._tag = document.createElement(b ? "style" : "link"), this._tag.rel = "stylesheet", this._tag.type = "text/css"
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.CSS
        }, b._formatResult = function(a) {
            if (this._preferXHR) {
                var b = a.getTag(),
                    c = document.getElementsByTagName("head")[0];
                if (c.appendChild(b), b.styleSheet) b.styleSheet.cssText = a.getResult(!0);
                else {
                    var d = document.createTextNode(a.getResult(!0));
                    b.appendChild(d)
                }
            } else b = this._tag;
            return b
        }, createjs.CSSLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.IMAGE), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", createjs.RequestUtils.isImageTag(a) ? this._tag = a : createjs.RequestUtils.isImageTag(a.src) ? this._tag = a.src : createjs.RequestUtils.isImageTag(a.tag) && (this._tag = a.tag), null != this._tag ? this._preferXHR = !1 : this._tag = document.createElement("img"), this.on("initialize", this._updateXHR, this)
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.IMAGE
        }, b.load = function() {
            if ("" != this._tag.src && this._tag.complete) return void this._sendComplete();
            var a = this._item.crossOrigin;
            1 == a && (a = "Anonymous"), null == a || createjs.RequestUtils.isLocal(this._item.src) || (this._tag.crossOrigin = a), this.AbstractLoader_load()
        }, b._updateXHR = function(a) {
            a.loader.mimeType = "text/plain; charset=x-user-defined-binary", a.loader.setResponseType && a.loader.setResponseType("blob")
        }, b._formatResult = function(a) {
            var b = this;
            return function(c) {
                var d = b._tag,
                    e = window.URL || window.webkitURL;
                if (b._preferXHR)
                    if (e) {
                        var f = e.createObjectURL(a.getResult(!0));
                        d.src = f, d.onload = function() {
                            e.revokeObjectURL(b.src)
                        }
                    } else d.src = a.getItem().src;
                else;
                d.complete ? c(d) : d.onload = function() {
                    c(this)
                }
            }
        }, createjs.ImageLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.JAVASCRIPT), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "src", this.setTag(document.createElement("script"))
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.JAVASCRIPT
        }, b._formatResult = function(a) {
            var b = a.getTag();
            return this._preferXHR && (b.text = a.getResult(!0)), b
        }, createjs.JavaScriptLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.JSON), this.resultFormatter = this._formatResult
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.JSON && !a._loadAsJSONP
        }, b._formatResult = function(a) {
            var b = null;
            try {
                b = createjs.DataUtils.parseJSON(a.getResult(!0))
            } catch (c) {
                var d = new createjs.ErrorEvent("JSON_FORMAT", null, c);
                return this._sendError(d), c
            }
            return b
        }, createjs.JSONLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, !1, createjs.AbstractLoader.JSONP), this.setTag(document.createElement("script")), this.getTag().type = "text/javascript"
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.JSONP || a._loadAsJSONP
        }, b.cancel = function() {
            this.AbstractLoader_cancel(), this._dispose()
        }, b.load = function() {
            if (null == this._item.callback) throw new Error("callback is required for loading JSONP requests.");
            if (null != window[this._item.callback]) throw new Error("JSONP callback '" + this._item.callback + "' already exists on window. You need to specify a different callback or re-name the current one.");
            window[this._item.callback] = createjs.proxy(this._handleLoad, this), window.document.body.appendChild(this._tag), this._tag.src = this._item.src
        }, b._handleLoad = function(a) {
            this._result = this._rawResult = a, this._sendComplete(), this._dispose()
        }, b._dispose = function() {
            window.document.body.removeChild(this._tag), delete window[this._item.callback]
        }, createjs.JSONPLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, null, createjs.AbstractLoader.MANIFEST), this._manifestQueue = null
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.MANIFEST_PROGRESS = .25, c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.MANIFEST
        }, b.load = function() {
            this.AbstractLoader_load()
        }, b._createRequest = function() {
            var a = this._item.callback;
            this._request = null != a ? new createjs.JSONPLoader(this._item) : new createjs.JSONLoader(this._item)
        }, b.handleEvent = function(a) {
            switch (a.type) {
                case "complete":
                    return this._rawResult = a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(c.MANIFEST_PROGRESS), void this._loadManifest(this._result);
                case "progress":
                    return a.loaded *= c.MANIFEST_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0), void this._sendProgress(a)
            }
            this.AbstractLoader_handleEvent(a)
        }, b.destroy = function() {
            this.AbstractLoader_destroy(), this._manifestQueue.close()
        }, b._loadManifest = function(a) {
            if (a && a.manifest) {
                var b = this._manifestQueue = new createjs.LoadQueue;
                b.on("fileload", this._handleManifestFileLoad, this), b.on("progress", this._handleManifestProgress, this), b.on("complete", this._handleManifestComplete, this, !0), b.on("error", this._handleManifestError, this, !0), b.loadManifest(a)
            } else this._sendComplete()
        }, b._handleManifestFileLoad = function(a) {
            a.target = null, this.dispatchEvent(a)
        }, b._handleManifestComplete = function() {
            this._loadedItems = this._manifestQueue.getItems(!0), this._sendComplete()
        }, b._handleManifestProgress = function(a) {
            this.progress = a.progress * (1 - c.MANIFEST_PROGRESS) + c.MANIFEST_PROGRESS, this._sendProgress(this.progress)
        }, b._handleManifestError = function(a) {
            var b = new createjs.Event("fileerror");
            b.item = a.data, this.dispatchEvent(b)
        }, createjs.ManifestLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractMediaLoader_constructor(a, b, createjs.AbstractLoader.SOUND), createjs.RequestUtils.isAudioTag(a) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.src) ? this._tag = a : createjs.RequestUtils.isAudioTag(a.tag) && (this._tag = createjs.RequestUtils.isAudioTag(a) ? a : a.src), null != this._tag && (this._preferXHR = !1)
        }
        var b = createjs.extend(a, createjs.AbstractMediaLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.SOUND
        }, b._createTag = function(a) {
            var b = document.createElement("audio");
            return b.autoplay = !1, b.preload = "none", b.src = a, b
        }, createjs.SoundLoader = createjs.promote(a, "AbstractMediaLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractMediaLoader_constructor(a, b, createjs.AbstractLoader.VIDEO), createjs.RequestUtils.isVideoTag(a) || createjs.RequestUtils.isVideoTag(a.src) ? (this.setTag(createjs.RequestUtils.isVideoTag(a) ? a : a.src), this._preferXHR = !1) : this.setTag(this._createTag())
        }
        var b = createjs.extend(a, createjs.AbstractMediaLoader),
            c = a;
        b._createTag = function() {
            return document.createElement("video")
        }, c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.VIDEO
        }, createjs.VideoLoader = createjs.promote(a, "AbstractMediaLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, null, createjs.AbstractLoader.SPRITESHEET), this._manifestQueue = null
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.SPRITESHEET_PROGRESS = .25, c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.SPRITESHEET
        }, b.destroy = function() {
            this.AbstractLoader_destroy, this._manifestQueue.close()
        }, b._createRequest = function() {
            var a = this._item.callback;
            this._request = null != a && a instanceof Function ? new createjs.JSONPLoader(this._item) : new createjs.JSONLoader(this._item)
        }, b.handleEvent = function(a) {
            switch (a.type) {
                case "complete":
                    return this._rawResult = a.target.getResult(!0), this._result = a.target.getResult(), this._sendProgress(c.SPRITESHEET_PROGRESS), void this._loadManifest(this._result);
                case "progress":
                    return a.loaded *= c.SPRITESHEET_PROGRESS, this.progress = a.loaded / a.total, (isNaN(this.progress) || 1 / 0 == this.progress) && (this.progress = 0), void this._sendProgress(a)
            }
            this.AbstractLoader_handleEvent(a)
        }, b._loadManifest = function(a) {
            if (a && a.images) {
                var b = this._manifestQueue = new createjs.LoadQueue;
                b.on("complete", this._handleManifestComplete, this, !0), b.on("fileload", this._handleManifestFileLoad, this), b.on("progress", this._handleManifestProgress, this), b.on("error", this._handleManifestError, this, !0), b.loadManifest(a.images)
            }
        }, b._handleManifestFileLoad = function(a) {
            var b = a.result;
            if (null != b) {
                var c = this.getResult().images,
                    d = c.indexOf(a.item.src);
                c[d] = b
            }
        }, b._handleManifestComplete = function() {
            this._result = new createjs.SpriteSheet(this._result), this._loadedItems = this._manifestQueue.getItems(!0), this._sendComplete()
        }, b._handleManifestProgress = function(a) {
            this.progress = a.progress * (1 - c.SPRITESHEET_PROGRESS) + c.SPRITESHEET_PROGRESS, this._sendProgress(this.progress)
        }, b._handleManifestError = function(a) {
            var b = new createjs.Event("fileerror");
            b.item = a.data, this.dispatchEvent(b)
        }, createjs.SpriteSheetLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a, b) {
            this.AbstractLoader_constructor(a, b, createjs.AbstractLoader.SVG), this.resultFormatter = this._formatResult, this._tagSrcAttribute = "data", b ? this.setTag(document.createElement("svg")) : (this.setTag(document.createElement("object")), this.getTag().type = "image/svg+xml"), this.getTag().style.visibility = "hidden"
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.SVG
        }, b._formatResult = function(a) {
            var b = createjs.DataUtils.parseXML(a.getResult(!0), "text/xml"),
                c = a.getTag();
            return !this._preferXHR && document.body.contains(c) && document.body.removeChild(c), null != b.documentElement ? (c.appendChild(b.documentElement), c.style.visibility = "visible", c) : b
        }, createjs.SVGLoader = createjs.promote(a, "AbstractLoader")
    }(), this.createjs = this.createjs || {},
    function() {
        "use strict";

        function a(a) {
            this.AbstractLoader_constructor(a, !0, createjs.AbstractLoader.XML), this.resultFormatter = this._formatResult
        }
        var b = createjs.extend(a, createjs.AbstractLoader),
            c = a;
        c.canLoadItem = function(a) {
            return a.type == createjs.AbstractLoader.XML
        }, b._formatResult = function(a) {
            return createjs.DataUtils.parseXML(a.getResult(!0), "text/xml")
        }, createjs.XMLLoader = createjs.promote(a, "AbstractLoader")
    }();
(function(root, factory) {
    if (typeof exports === "object" && exports) {
        factory(exports);
    } else {
        var mustache = {};
        factory(mustache);
        if (typeof define === "function" && define.amd) {
            define(mustache);
        } else {
            root.Mustache = mustache;
        }
    }
}(this, function(mustache) {
    var RegExp_test = RegExp.prototype.test;

    function testRegExp(re, string) {
        return RegExp_test.call(re, string);
    }
    var nonSpaceRe = /\S/;

    function isWhitespace(string) {
        return !testRegExp(nonSpaceRe, string);
    }
    var Object_toString = Object.prototype.toString;
    var isArray = Array.isArray || function(object) {
        return Object_toString.call(object) === '[object Array]';
    };

    function isFunction(object) {
        return typeof object === 'function';
    }

    function escapeRegExp(string) {
        return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    }

    function escapeTags(tags) {
        if (!isArray(tags) || tags.length !== 2) {
            throw new Error('Invalid tags: ' + tags);
        }
        return [new RegExp(escapeRegExp(tags[0]) + "\\s*"), new RegExp("\\s*" + escapeRegExp(tags[1]))];
    }
    var whiteRe = /\s*/;
    var spaceRe = /\s+/;
    var equalsRe = /\s*=/;
    var curlyRe = /\s*\}/;
    var tagRe = /#|\^|\/|>|\{|&|=|!/;

    function parseTemplate(template, tags) {
        tags = tags || mustache.tags;
        template = template || '';
        if (typeof tags === 'string') {
            tags = tags.split(spaceRe);
        }
        var tagRes = escapeTags(tags);
        var scanner = new Scanner(template);
        var sections = [];
        var tokens = [];
        var spaces = [];
        var hasTag = false;
        var nonSpace = false;

        function stripSpace() {
            if (hasTag && !nonSpace) {
                while (spaces.length) {
                    delete tokens[spaces.pop()];
                }
            } else {
                spaces = [];
            }
            hasTag = false;
            nonSpace = false;
        }
        var start, type, value, chr, token, openSection;
        while (!scanner.eos()) {
            start = scanner.pos;
            value = scanner.scanUntil(tagRes[0]);
            if (value) {
                for (var i = 0, len = value.length; i < len; ++i) {
                    chr = value.charAt(i);
                    if (isWhitespace(chr)) {
                        spaces.push(tokens.length);
                    } else {
                        nonSpace = true;
                    }
                    tokens.push(['text', chr, start, start + 1]);
                    start += 1;
                    if (chr === '\n') {
                        stripSpace();
                    }
                }
            }
            if (!scanner.scan(tagRes[0])) break;
            hasTag = true;
            type = scanner.scan(tagRe) || 'name';
            scanner.scan(whiteRe);
            if (type === '=') {
                value = scanner.scanUntil(equalsRe);
                scanner.scan(equalsRe);
                scanner.scanUntil(tagRes[1]);
            } else if (type === '{') {
                value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
                scanner.scan(curlyRe);
                scanner.scanUntil(tagRes[1]);
                type = '&';
            } else {
                value = scanner.scanUntil(tagRes[1]);
            }
            if (!scanner.scan(tagRes[1])) {
                throw new Error('Unclosed tag at ' + scanner.pos);
            }
            token = [type, value, start, scanner.pos];
            tokens.push(token);
            if (type === '#' || type === '^') {
                sections.push(token);
            } else if (type === '/') {
                openSection = sections.pop();
                if (!openSection) {
                    throw new Error('Unopened section "' + value + '" at ' + start);
                }
                if (openSection[1] !== value) {
                    throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
                }
            } else if (type === 'name' || type === '{' || type === '&') {
                nonSpace = true;
            } else if (type === '=') {
                tagRes = escapeTags(tags = value.split(spaceRe));
            }
        }
        openSection = sections.pop();
        if (openSection) {
            throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
        }
        return nestTokens(squashTokens(tokens));
    }

    function squashTokens(tokens) {
        var squashedTokens = [];
        var token, lastToken;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            if (token) {
                if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
                    lastToken[1] += token[1];
                    lastToken[3] = token[3];
                } else {
                    squashedTokens.push(token);
                    lastToken = token;
                }
            }
        }
        return squashedTokens;
    }

    function nestTokens(tokens) {
        var nestedTokens = [];
        var collector = nestedTokens;
        var sections = [];
        var token, section;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            switch (token[0]) {
                case '#':
                case '^':
                    collector.push(token);
                    sections.push(token);
                    collector = token[4] = [];
                    break;
                case '/':
                    section = sections.pop();
                    section[5] = token[2];
                    collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
                    break;
                default:
                    collector.push(token);
            }
        }
        return nestedTokens;
    }

    function Scanner(string) {
        this.string = string;
        this.tail = string;
        this.pos = 0;
    }
    Scanner.prototype.eos = function() {
        return this.tail === "";
    };
    Scanner.prototype.scan = function(re) {
        var match = this.tail.match(re);
        if (match && match.index === 0) {
            var string = match[0];
            this.tail = this.tail.substring(string.length);
            this.pos += string.length;
            return string;
        }
        return "";
    };
    Scanner.prototype.scanUntil = function(re) {
        var index = this.tail.search(re),
            match;
        switch (index) {
            case -1:
                match = this.tail;
                this.tail = "";
                break;
            case 0:
                match = "";
                break;
            default:
                match = this.tail.substring(0, index);
                this.tail = this.tail.substring(index);
        }
        this.pos += match.length;
        return match;
    };

    function Context(view, parentContext) {
        this.view = view == null ? {} : view;
        this.cache = {
            '.': this.view
        };
        this.parent = parentContext;
    }
    Context.prototype.push = function(view) {
        return new Context(view, this);
    };
    Context.prototype.lookup = function(name) {
        var value;
        if (name in this.cache) {
            value = this.cache[name];
        } else {
            var context = this;
            while (context) {
                if (name.indexOf('.') > 0) {
                    value = context.view;
                    var names = name.split('.'),
                        i = 0;
                    while (value != null && i < names.length) {
                        value = value[names[i++]];
                    }
                } else {
                    value = context.view[name];
                }
                if (value != null) break;
                context = context.parent;
            }
            this.cache[name] = value;
        }
        if (isFunction(value)) {
            value = value.call(this.view);
        }
        return value;
    };

    function Writer() {
        this.cache = {};
    }
    Writer.prototype.clearCache = function() {
        this.cache = {};
    };
    Writer.prototype.parse = function(template, tags) {
        var cache = this.cache;
        var tokens = cache[template];
        if (tokens == null) {
            tokens = cache[template] = parseTemplate(template, tags);
        }
        return tokens;
    };
    Writer.prototype.render = function(template, view, partials) {
        var tokens = this.parse(template);
        var context = (view instanceof Context) ? view : new Context(view);
        return this.renderTokens(tokens, context, partials, template);
    };
    Writer.prototype.renderTokens = function(tokens, context, partials, originalTemplate) {
        var buffer = '';
        var self = this;

        function subRender(template) {
            return self.render(template, context, partials);
        }
        var token, value;
        for (var i = 0, len = tokens.length; i < len; ++i) {
            token = tokens[i];
            switch (token[0]) {
                case '#':
                    value = context.lookup(token[1]);
                    if (!value) continue;
                    if (isArray(value)) {
                        for (var j = 0, jlen = value.length; j < jlen; ++j) {
                            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
                        }
                    } else if (typeof value === 'object' || typeof value === 'string') {
                        buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
                    } else if (isFunction(value)) {
                        if (typeof originalTemplate !== 'string') {
                            throw new Error('Cannot use higher-order sections without the original template');
                        }
                        value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
                        if (value != null) buffer += value;
                    } else {
                        buffer += this.renderTokens(token[4], context, partials, originalTemplate);
                    }
                    break;
                case '^':
                    value = context.lookup(token[1]);
                    if (!value || (isArray(value) && value.length === 0)) {
                        buffer += this.renderTokens(token[4], context, partials, originalTemplate);
                    }
                    break;
                case '>':
                    if (!partials) continue;
                    value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
                    if (value != null) buffer += this.renderTokens(this.parse(value), context, partials, value);
                    break;
                case '&':
                    value = context.lookup(token[1]);
                    if (value != null) buffer += value;
                    break;
                case 'name':
                    value = context.lookup(token[1]);
                    if (value != null) buffer += mustache.escape(value);
                    break;
                case 'text':
                    buffer += token[1];
                    break;
            }
        }
        return buffer;
    };
    mustache.name = "mustache.js";
    mustache.version = "0.8.1";
    mustache.tags = ["{{", "}}"];
    var defaultWriter = new Writer();
    mustache.clearCache = function() {
        return defaultWriter.clearCache();
    };
    mustache.parse = function(template, tags) {
        return defaultWriter.parse(template, tags);
    };
    mustache.render = function(template, view, partials) {
        return defaultWriter.render(template, view, partials);
    };
    mustache.to_html = function(template, view, partials, send) {
        var result = mustache.render(template, view, partials);
        if (isFunction(send)) {
            send(result);
        } else {
            return result;
        }
    };
    mustache.escape = escapeHtml;
    mustache.Scanner = Scanner;
    mustache.Context = Context;
    mustache.Writer = Writer;
}));
(function(a) {
    function b(a, b, c) {
        switch (arguments.length) {
            case 2:
                return null != a ? a : b;
            case 3:
                return null != a ? a : null != b ? b : c;
            default:
                throw new Error("Implement me")
        }
    }

    function c(a, b) {
        return zb.call(a, b)
    }

    function d() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function e(a) {
        tb.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + a)
    }

    function f(a, b) {
        var c = !0;
        return m(function() {
            return c && (e(a), c = !1), b.apply(this, arguments)
        }, b)
    }

    function g(a, b) {
        qc[a] || (e(b), qc[a] = !0)
    }

    function h(a, b) {
        return function(c) {
            return p(a.call(this, c), b)
        }
    }

    function i(a, b) {
        return function(c) {
            return this.localeData().ordinal(a.call(this, c), b)
        }
    }

    function j() {}

    function k(a, b) {
        b !== !1 && F(a), n(this, a), this._d = new Date(+a._d)
    }

    function l(a) {
        var b = y(a),
            c = b.year || 0,
            d = b.quarter || 0,
            e = b.month || 0,
            f = b.week || 0,
            g = b.day || 0,
            h = b.hour || 0,
            i = b.minute || 0,
            j = b.second || 0,
            k = b.millisecond || 0;
        this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = tb.localeData(), this._bubble()
    }

    function m(a, b) {
        for (var d in b) c(b, d) && (a[d] = b[d]);
        return c(b, "toString") && (a.toString = b.toString), c(b, "valueOf") && (a.valueOf = b.valueOf), a
    }

    function n(a, b) {
        var c, d, e;
        if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = b._pf), "undefined" != typeof b._locale && (a._locale = b._locale), Ib.length > 0)
            for (c in Ib) d = Ib[c], e = b[d], "undefined" != typeof e && (a[d] = e);
        return a
    }

    function o(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function p(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b;) d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }

    function q(a, b) {
        var c = {
            milliseconds: 0,
            months: 0
        };
        return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
    }

    function r(a, b) {
        var c;
        return b = K(b, a), a.isBefore(b) ? c = q(a, b) : (c = q(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c
    }

    function s(a, b) {
        return function(c, d) {
            var e, f;
            return null === d || isNaN(+d) || (g(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = tb.duration(c, d), t(this, e, a), this
        }
    }

    function t(a, b, c, d) {
        var e = b._milliseconds,
            f = b._days,
            g = b._months;
        d = null == d ? !0 : d, e && a._d.setTime(+a._d + e * c), f && nb(a, "Date", mb(a, "Date") + f * c), g && lb(a, mb(a, "Month") + g * c), d && tb.updateOffset(a, f || g)
    }

    function u(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function v(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }

    function w(a, b, c) {
        var d, e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && A(a[d]) !== A(b[d])) && g++;
        return g + f
    }

    function x(a) {
        if (a) {
            var b = a.toLowerCase().replace(/(.)s$/, "$1");
            a = jc[a] || kc[b] || b
        }
        return a
    }

    function y(a) {
        var b, d, e = {};
        for (d in a) c(a, d) && (b = x(d), b && (e[b] = a[d]));
        return e
    }

    function z(b) {
        var c, d;
        if (0 === b.indexOf("week")) c = 7, d = "day";
        else {
            if (0 !== b.indexOf("month")) return;
            c = 12, d = "month"
        }
        tb[b] = function(e, f) {
            var g, h, i = tb._locale[b],
                j = [];
            if ("number" == typeof e && (f = e, e = a), h = function(a) {
                    var b = tb().utc().set(d, a);
                    return i.call(tb._locale, b, e || "")
                }, null != f) return h(f);
            for (g = 0; c > g; g++) j.push(h(g));
            return j
        }
    }

    function A(a) {
        var b = +a,
            c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function B(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function C(a, b, c) {
        return hb(tb([a, 11, 31 + b - c]), b, c).week
    }

    function D(a) {
        return E(a) ? 366 : 365
    }

    function E(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function F(a) {
        var b;
        a._a && -2 === a._pf.overflow && (b = a._a[Bb] < 0 || a._a[Bb] > 11 ? Bb : a._a[Cb] < 1 || a._a[Cb] > B(a._a[Ab], a._a[Bb]) ? Cb : a._a[Db] < 0 || a._a[Db] > 23 ? Db : a._a[Eb] < 0 || a._a[Eb] > 59 ? Eb : a._a[Fb] < 0 || a._a[Fb] > 59 ? Fb : a._a[Gb] < 0 || a._a[Gb] > 999 ? Gb : -1, a._pf._overflowDayOfYear && (Ab > b || b > Cb) && (b = Cb), a._pf.overflow = b)
    }

    function G(a) {
        return null == a._isValid && (a._isValid = !isNaN(a._d.getTime()) && a._pf.overflow < 0 && !a._pf.empty && !a._pf.invalidMonth && !a._pf.nullInput && !a._pf.invalidFormat && !a._pf.userInvalidated, a._strict && (a._isValid = a._isValid && 0 === a._pf.charsLeftOver && 0 === a._pf.unusedTokens.length)), a._isValid
    }

    function H(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function I(a) {
        for (var b, c, d, e, f = 0; f < a.length;) {
            for (e = H(a[f]).split("-"), b = e.length, c = H(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                if (d = J(e.slice(0, b).join("-"))) return d;
                if (c && c.length >= b && w(e, c, !0) >= b - 1) break;
                b--
            }
            f++
        }
        return null
    }

    function J(a) {
        var b = null;
        if (!Hb[a] && Jb) try {
            b = tb.locale(), require("./locale/" + a), tb.locale(b)
        } catch (c) {}
        return Hb[a]
    }

    function K(a, b) {
        return b._isUTC ? tb(a).zone(b._offset || 0) : tb(a).local()
    }

    function L(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function M(a) {
        var b, c, d = a.match(Nb);
        for (b = 0, c = d.length; c > b; b++) d[b] = pc[d[b]] ? pc[d[b]] : L(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function N(a, b) {
        return a.isValid() ? (b = O(b, a.localeData()), lc[b] || (lc[b] = M(b)), lc[b](a)) : a.localeData().invalidDate()
    }

    function O(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (Ob.lastIndex = 0; d >= 0 && Ob.test(a);) a = a.replace(Ob, c), Ob.lastIndex = 0, d -= 1;
        return a
    }

    function P(a, b) {
        var c, d = b._strict;
        switch (a) {
            case "Q":
                return Zb;
            case "DDDD":
                return _b;
            case "YYYY":
            case "GGGG":
            case "gggg":
                return d ? ac : Rb;
            case "Y":
            case "G":
            case "g":
                return cc;
            case "YYYYYY":
            case "YYYYY":
            case "GGGGG":
            case "ggggg":
                return d ? bc : Sb;
            case "S":
                if (d) return Zb;
            case "SS":
                if (d) return $b;
            case "SSS":
                if (d) return _b;
            case "DDD":
                return Qb;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
                return Ub;
            case "a":
            case "A":
                return b._locale._meridiemParse;
            case "X":
                return Xb;
            case "Z":
            case "ZZ":
                return Vb;
            case "T":
                return Wb;
            case "SSSS":
                return Tb;
            case "MM":
            case "DD":
            case "YY":
            case "GG":
            case "gg":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "ww":
            case "WW":
                return d ? $b : Pb;
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
            case "w":
            case "W":
            case "e":
            case "E":
                return Pb;
            case "Do":
                return Yb;
            default:
                return c = new RegExp(Y(X(a.replace("\\", "")), "i"))
        }
    }

    function Q(a) {
        a = a || "";
        var b = a.match(Vb) || [],
            c = b[b.length - 1] || [],
            d = (c + "").match(hc) || ["-", 0, 0],
            e = +(60 * d[1]) + A(d[2]);
        return "+" === d[0] ? -e : e
    }

    function R(a, b, c) {
        var d, e = c._a;
        switch (a) {
            case "Q":
                null != b && (e[Bb] = 3 * (A(b) - 1));
                break;
            case "M":
            case "MM":
                null != b && (e[Bb] = A(b) - 1);
                break;
            case "MMM":
            case "MMMM":
                d = c._locale.monthsParse(b), null != d ? e[Bb] = d : c._pf.invalidMonth = b;
                break;
            case "D":
            case "DD":
                null != b && (e[Cb] = A(b));
                break;
            case "Do":
                null != b && (e[Cb] = A(parseInt(b, 10)));
                break;
            case "DDD":
            case "DDDD":
                null != b && (c._dayOfYear = A(b));
                break;
            case "YY":
                e[Ab] = tb.parseTwoDigitYear(b);
                break;
            case "YYYY":
            case "YYYYY":
            case "YYYYYY":
                e[Ab] = A(b);
                break;
            case "a":
            case "A":
                c._isPm = c._locale.isPM(b);
                break;
            case "H":
            case "HH":
            case "h":
            case "hh":
                e[Db] = A(b);
                break;
            case "m":
            case "mm":
                e[Eb] = A(b);
                break;
            case "s":
            case "ss":
                e[Fb] = A(b);
                break;
            case "S":
            case "SS":
            case "SSS":
            case "SSSS":
                e[Gb] = A(1e3 * ("0." + b));
                break;
            case "X":
                c._d = new Date(1e3 * parseFloat(b));
                break;
            case "Z":
            case "ZZ":
                c._useUTC = !0, c._tzm = Q(b);
                break;
            case "dd":
            case "ddd":
            case "dddd":
                d = c._locale.weekdaysParse(b), null != d ? (c._w = c._w || {}, c._w.d = d) : c._pf.invalidWeekday = b;
                break;
            case "w":
            case "ww":
            case "W":
            case "WW":
            case "d":
            case "e":
            case "E":
                a = a.substr(0, 1);
            case "gggg":
            case "GGGG":
            case "GGGGG":
                a = a.substr(0, 2), b && (c._w = c._w || {}, c._w[a] = A(b));
                break;
            case "gg":
            case "GG":
                c._w = c._w || {}, c._w[a] = tb.parseTwoDigitYear(b)
        }
    }

    function S(a) {
        var c, d, e, f, g, h, i;
        c = a._w, null != c.GG || null != c.W || null != c.E ? (g = 1, h = 4, d = b(c.GG, a._a[Ab], hb(tb(), 1, 4).year), e = b(c.W, 1), f = b(c.E, 1)) : (g = a._locale._week.dow, h = a._locale._week.doy, d = b(c.gg, a._a[Ab], hb(tb(), g, h).year), e = b(c.w, 1), null != c.d ? (f = c.d, g > f && ++e) : f = null != c.e ? c.e + g : g), i = ib(d, e, f, h, g), a._a[Ab] = i.year, a._dayOfYear = i.dayOfYear
    }

    function T(a) {
        var c, d, e, f, g = [];
        if (!a._d) {
            for (e = V(a), a._w && null == a._a[Cb] && null == a._a[Bb] && S(a), a._dayOfYear && (f = b(a._a[Ab], e[Ab]), a._dayOfYear > D(f) && (a._pf._overflowDayOfYear = !0), d = db(f, 0, a._dayOfYear), a._a[Bb] = d.getUTCMonth(), a._a[Cb] = d.getUTCDate()), c = 0; 3 > c && null == a._a[c]; ++c) a._a[c] = g[c] = e[c];
            for (; 7 > c; c++) a._a[c] = g[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
            a._d = (a._useUTC ? db : cb).apply(null, g), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() + a._tzm)
        }
    }

    function U(a) {
        var b;
        a._d || (b = y(a._i), a._a = [b.year, b.month, b.day, b.hour, b.minute, b.second, b.millisecond], T(a))
    }

    function V(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function W(a) {
        if (a._f === tb.ISO_8601) return void $(a);
        a._a = [], a._pf.empty = !0;
        var b, c, d, e, f, g = "" + a._i,
            h = g.length,
            i = 0;
        for (d = O(a._f, a._locale).match(Nb) || [], b = 0; b < d.length; b++) e = d[b], c = (g.match(P(e, a)) || [])[0], c && (f = g.substr(0, g.indexOf(c)), f.length > 0 && a._pf.unusedInput.push(f), g = g.slice(g.indexOf(c) + c.length), i += c.length), pc[e] ? (c ? a._pf.empty = !1 : a._pf.unusedTokens.push(e), R(e, c, a)) : a._strict && !c && a._pf.unusedTokens.push(e);
        a._pf.charsLeftOver = h - i, g.length > 0 && a._pf.unusedInput.push(g), a._isPm && a._a[Db] < 12 && (a._a[Db] += 12), a._isPm === !1 && 12 === a._a[Db] && (a._a[Db] = 0), T(a), F(a)
    }

    function X(a) {
        return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e
        })
    }

    function Y(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function Z(a) {
        var b, c, e, f, g;
        if (0 === a._f.length) return a._pf.invalidFormat = !0, void(a._d = new Date(0 / 0));
        for (f = 0; f < a._f.length; f++) g = 0, b = n({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._pf = d(), b._f = a._f[f], W(b), G(b) && (g += b._pf.charsLeftOver, g += 10 * b._pf.unusedTokens.length, b._pf.score = g, (null == e || e > g) && (e = g, c = b));
        m(a, c || b)
    }

    function $(a) {
        var b, c, d = a._i,
            e = dc.exec(d);
        if (e) {
            for (a._pf.iso = !0, b = 0, c = fc.length; c > b; b++)
                if (fc[b][1].exec(d)) {
                    a._f = fc[b][0] + (e[6] || " ");
                    break
                }
            for (b = 0, c = gc.length; c > b; b++)
                if (gc[b][1].exec(d)) {
                    a._f += gc[b][0];
                    break
                }
            d.match(Vb) && (a._f += "Z"), W(a)
        } else a._isValid = !1
    }

    function _(a) {
        $(a), a._isValid === !1 && (delete a._isValid, tb.createFromInputFallback(a))
    }

    function ab(a, b) {
        var c, d = [];
        for (c = 0; c < a.length; ++c) d.push(b(a[c], c));
        return d
    }

    function bb(b) {
        var c, d = b._i;
        d === a ? b._d = new Date : v(d) ? b._d = new Date(+d) : null !== (c = Kb.exec(d)) ? b._d = new Date(+c[1]) : "string" == typeof d ? _(b) : u(d) ? (b._a = ab(d.slice(0), function(a) {
            return parseInt(a, 10)
        }), T(b)) : "object" == typeof d ? U(b) : "number" == typeof d ? b._d = new Date(d) : tb.createFromInputFallback(b)
    }

    function cb(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 1970 > a && h.setFullYear(a), h
    }

    function db(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 1970 > a && b.setUTCFullYear(a), b
    }

    function eb(a, b) {
        if ("string" == typeof a)
            if (isNaN(a)) {
                if (a = b.weekdaysParse(a), "number" != typeof a) return null
            } else a = parseInt(a, 10);
        return a
    }

    function fb(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }

    function gb(a, b, c) {
        var d = tb.duration(a).abs(),
            e = yb(d.as("s")),
            f = yb(d.as("m")),
            g = yb(d.as("h")),
            h = yb(d.as("d")),
            i = yb(d.as("M")),
            j = yb(d.as("y")),
            k = e < mc.s && ["s", e] || 1 === f && ["m"] || f < mc.m && ["mm", f] || 1 === g && ["h"] || g < mc.h && ["hh", g] || 1 === h && ["d"] || h < mc.d && ["dd", h] || 1 === i && ["M"] || i < mc.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
        return k[2] = b, k[3] = +a > 0, k[4] = c, fb.apply({}, k)
    }

    function hb(a, b, c) {
        var d, e = c - b,
            f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = tb(a).add(f, "d"), {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }

    function ib(a, b, c, d, e) {
        var f, g, h = db(a, 0, 1).getUTCDay();
        return h = 0 === h ? 7 : h, c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : D(a - 1) + g
        }
    }

    function jb(b) {
        var c = b._i,
            d = b._f;
        return b._locale = b._locale || tb.localeData(b._l), null === c || d === a && "" === c ? tb.invalid({
            nullInput: !0
        }) : ("string" == typeof c && (b._i = c = b._locale.preparse(c)), tb.isMoment(c) ? new k(c, !0) : (d ? u(d) ? Z(b) : W(b) : bb(b), new k(b)))
    }

    function kb(a, b) {
        var c, d;
        if (1 === b.length && u(b[0]) && (b = b[0]), !b.length) return tb();
        for (c = b[0], d = 1; d < b.length; ++d) b[d][a](c) && (c = b[d]);
        return c
    }

    function lb(a, b) {
        var c;
        return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), B(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a)
    }

    function mb(a, b) {
        return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
    }

    function nb(a, b, c) {
        return "Month" === b ? lb(a, c) : a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
    }

    function ob(a, b) {
        return function(c) {
            return null != c ? (nb(this, a, c), tb.updateOffset(this, b), this) : mb(this, a)
        }
    }

    function pb(a) {
        return 400 * a / 146097
    }

    function qb(a) {
        return 146097 * a / 400
    }

    function rb(a) {
        tb.duration.fn[a] = function() {
            return this._data[a]
        }
    }

    function sb(a) {
        "undefined" == typeof ender && (ub = xb.moment, xb.moment = a ? f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", tb) : tb)
    }
    for (var tb, ub, vb, wb = "2.8.3", xb = "undefined" != typeof global ? global : this, yb = Math.round, zb = Object.prototype.hasOwnProperty, Ab = 0, Bb = 1, Cb = 2, Db = 3, Eb = 4, Fb = 5, Gb = 6, Hb = {}, Ib = [], Jb = "undefined" != typeof module && module.exports, Kb = /^\/?Date\((\-?\d+)/i, Lb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Mb = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Nb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, Ob = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, Pb = /\d\d?/, Qb = /\d{1,3}/, Rb = /\d{1,4}/, Sb = /[+\-]?\d{1,6}/, Tb = /\d+/, Ub = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Vb = /Z|[\+\-]\d\d:?\d\d/gi, Wb = /T/i, Xb = /[\+\-]?\d+(\.\d{1,3})?/, Yb = /\d{1,2}/, Zb = /\d/, $b = /\d\d/, _b = /\d{3}/, ac = /\d{4}/, bc = /[+-]?\d{6}/, cc = /[+-]?\d+/, dc = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ec = "YYYY-MM-DDTHH:mm:ssZ", fc = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
            ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
            ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d{2}/],
            ["YYYY-DDD", /\d{4}-\d{3}/]
        ], gc = [
            ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
            ["HH:mm", /(T| )\d\d:\d\d/],
            ["HH", /(T| )\d\d/]
        ], hc = /([\+\-]|\d\d)/gi, ic = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }), jc = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            D: "date",
            w: "week",
            W: "isoWeek",
            M: "month",
            Q: "quarter",
            y: "year",
            DDD: "dayOfYear",
            e: "weekday",
            E: "isoWeekday",
            gg: "weekYear",
            GG: "isoWeekYear"
        }, kc = {
            dayofyear: "dayOfYear",
            isoweekday: "isoWeekday",
            isoweek: "isoWeek",
            weekyear: "weekYear",
            isoweekyear: "isoWeekYear"
        }, lc = {}, mc = {
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            M: 11
        }, nc = "DDD w W M D d".split(" "), oc = "M D H h m s w W".split(" "), pc = {
            M: function() {
                return this.month() + 1
            },
            MMM: function(a) {
                return this.localeData().monthsShort(this, a)
            },
            MMMM: function(a) {
                return this.localeData().months(this, a)
            },
            D: function() {
                return this.date()
            },
            DDD: function() {
                return this.dayOfYear()
            },
            d: function() {
                return this.day()
            },
            dd: function(a) {
                return this.localeData().weekdaysMin(this, a)
            },
            ddd: function(a) {
                return this.localeData().weekdaysShort(this, a)
            },
            dddd: function(a) {
                return this.localeData().weekdays(this, a)
            },
            w: function() {
                return this.week()
            },
            W: function() {
                return this.isoWeek()
            },
            YY: function() {
                return p(this.year() % 100, 2)
            },
            YYYY: function() {
                return p(this.year(), 4)
            },
            YYYYY: function() {
                return p(this.year(), 5)
            },
            YYYYYY: function() {
                var a = this.year(),
                    b = a >= 0 ? "+" : "-";
                return b + p(Math.abs(a), 6)
            },
            gg: function() {
                return p(this.weekYear() % 100, 2)
            },
            gggg: function() {
                return p(this.weekYear(), 4)
            },
            ggggg: function() {
                return p(this.weekYear(), 5)
            },
            GG: function() {
                return p(this.isoWeekYear() % 100, 2)
            },
            GGGG: function() {
                return p(this.isoWeekYear(), 4)
            },
            GGGGG: function() {
                return p(this.isoWeekYear(), 5)
            },
            e: function() {
                return this.weekday()
            },
            E: function() {
                return this.isoWeekday()
            },
            a: function() {
                return this.localeData().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function() {
                return this.localeData().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function() {
                return this.hours()
            },
            h: function() {
                return this.hours() % 12 || 12
            },
            m: function() {
                return this.minutes()
            },
            s: function() {
                return this.seconds()
            },
            S: function() {
                return A(this.milliseconds() / 100)
            },
            SS: function() {
                return p(A(this.milliseconds() / 10), 2)
            },
            SSS: function() {
                return p(this.milliseconds(), 3)
            },
            SSSS: function() {
                return p(this.milliseconds(), 3)
            },
            Z: function() {
                var a = -this.zone(),
                    b = "+";
                return 0 > a && (a = -a, b = "-"), b + p(A(a / 60), 2) + ":" + p(A(a) % 60, 2)
            },
            ZZ: function() {
                var a = -this.zone(),
                    b = "+";
                return 0 > a && (a = -a, b = "-"), b + p(A(a / 60), 2) + p(A(a) % 60, 2)
            },
            z: function() {
                return this.zoneAbbr()
            },
            zz: function() {
                return this.zoneName()
            },
            X: function() {
                return this.unix()
            },
            Q: function() {
                return this.quarter()
            }
        }, qc = {}, rc = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; nc.length;) vb = nc.pop(), pc[vb + "o"] = i(pc[vb], vb);
    for (; oc.length;) vb = oc.pop(), pc[vb + vb] = h(pc[vb], 2);
    pc.DDDD = h(pc.DDD, 3), m(j.prototype, {
        set: function(a) {
            var b, c;
            for (c in a) b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function(a) {
            var b, c, d;
            for (this._monthsParse || (this._monthsParse = []), b = 0; 12 > b; b++)
                if (this._monthsParse[b] || (c = tb.utc([2e3, b]), d = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""), this._monthsParse[b] = new RegExp(d.replace(".", ""), "i")), this._monthsParse[b].test(a)) return b
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(a) {
            return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function(a) {
            var b, c, d;
            for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)
                if (this._weekdaysParse[b] || (c = tb([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY LT",
            LLLL: "dddd, MMMM D, YYYY LT"
        },
        longDateFormat: function(a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
            }), this._longDateFormat[a] = b), b
        },
        isPM: function(a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(a, b) {
            var c = this._calendar[a];
            return "function" == typeof c ? c.apply(b) : c
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function(a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        preparse: function(a) {
            return a
        },
        postformat: function(a) {
            return a
        },
        week: function(a) {
            return hb(a, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        },
        _invalidDate: "Invalid date",
        invalidDate: function() {
            return this._invalidDate
        }
    }), tb = function(b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._i = b, g._f = c, g._l = e, g._strict = f, g._isUTC = !1, g._pf = d(), jb(g)
    }, tb.suppressDeprecationWarnings = !1, tb.createFromInputFallback = f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(a) {
        a._d = new Date(a._i)
    }), tb.min = function() {
        var a = [].slice.call(arguments, 0);
        return kb("isBefore", a)
    }, tb.max = function() {
        var a = [].slice.call(arguments, 0);
        return kb("isAfter", a)
    }, tb.utc = function(b, c, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._useUTC = !0, g._isUTC = !0, g._l = e, g._i = b, g._f = c, g._strict = f, g._pf = d(), jb(g).utc()
    }, tb.unix = function(a) {
        return tb(1e3 * a)
    }, tb.duration = function(a, b) {
        var d, e, f, g, h = a,
            i = null;
        return tb.isDuration(a) ? h = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (h = {}, b ? h[b] = a : h.milliseconds = a) : (i = Lb.exec(a)) ? (d = "-" === i[1] ? -1 : 1, h = {
            y: 0,
            d: A(i[Cb]) * d,
            h: A(i[Db]) * d,
            m: A(i[Eb]) * d,
            s: A(i[Fb]) * d,
            ms: A(i[Gb]) * d
        }) : (i = Mb.exec(a)) ? (d = "-" === i[1] ? -1 : 1, f = function(a) {
            var b = a && parseFloat(a.replace(",", "."));
            return (isNaN(b) ? 0 : b) * d
        }, h = {
            y: f(i[2]),
            M: f(i[3]),
            d: f(i[4]),
            h: f(i[5]),
            m: f(i[6]),
            s: f(i[7]),
            w: f(i[8])
        }) : "object" == typeof h && ("from" in h || "to" in h) && (g = r(tb(h.from), tb(h.to)), h = {}, h.ms = g.milliseconds, h.M = g.months), e = new l(h), tb.isDuration(a) && c(a, "_locale") && (e._locale = a._locale), e
    }, tb.version = wb, tb.defaultFormat = ec, tb.ISO_8601 = function() {}, tb.momentProperties = Ib, tb.updateOffset = function() {}, tb.relativeTimeThreshold = function(b, c) {
        return mc[b] === a ? !1 : c === a ? mc[b] : (mc[b] = c, !0)
    }, tb.lang = f("moment.lang is deprecated. Use moment.locale instead.", function(a, b) {
        return tb.locale(a, b)
    }), tb.locale = function(a, b) {
        var c;
        return a && (c = "undefined" != typeof b ? tb.defineLocale(a, b) : tb.localeData(a), c && (tb.duration._locale = tb._locale = c)), tb._locale._abbr
    }, tb.defineLocale = function(a, b) {
        return null !== b ? (b.abbr = a, Hb[a] || (Hb[a] = new j), Hb[a].set(b), tb.locale(a), Hb[a]) : (delete Hb[a], null)
    }, tb.langData = f("moment.langData is deprecated. Use moment.localeData instead.", function(a) {
        return tb.localeData(a)
    }), tb.localeData = function(a) {
        var b;
        if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return tb._locale;
        if (!u(a)) {
            if (b = J(a)) return b;
            a = [a]
        }
        return I(a)
    }, tb.isMoment = function(a) {
        return a instanceof k || null != a && c(a, "_isAMomentObject")
    }, tb.isDuration = function(a) {
        return a instanceof l
    };
    for (vb = rc.length - 1; vb >= 0; --vb) z(rc[vb]);
    tb.normalizeUnits = function(a) {
        return x(a)
    }, tb.invalid = function(a) {
        var b = tb.utc(0 / 0);
        return null != a ? m(b._pf, a) : b._pf.userInvalidated = !0, b
    }, tb.parseZone = function() {
        return tb.apply(null, arguments).parseZone()
    }, tb.parseTwoDigitYear = function(a) {
        return A(a) + (A(a) > 68 ? 1900 : 2e3)
    }, m(tb.fn = k.prototype, {
        clone: function() {
            return tb(this)
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0)
        },
        unix: function() {
            return Math.floor(+this / 1e3)
        },
        toString: function() {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function() {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function() {
            var a = tb(this).utc();
            return 0 < a.year() && a.year() <= 9999 ? N(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : N(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function() {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function() {
            return G(this)
        },
        isDSTShifted: function() {
            return this._a ? this.isValid() && w(this._a, (this._isUTC ? tb.utc(this._a) : tb(this._a)).toArray()) > 0 : !1
        },
        parsingFlags: function() {
            return m({}, this._pf)
        },
        invalidAt: function() {
            return this._pf.overflow
        },
        utc: function(a) {
            return this.zone(0, a)
        },
        local: function(a) {
            return this._isUTC && (this.zone(0, a), this._isUTC = !1, a && this.add(this._dateTzOffset(), "m")), this
        },
        format: function(a) {
            var b = N(this, a || tb.defaultFormat);
            return this.localeData().postformat(b)
        },
        add: s(1, "add"),
        subtract: s(-1, "subtract"),
        diff: function(a, b, c) {
            var d, e, f, g = K(a, this),
                h = 6e4 * (this.zone() - g.zone());
            return b = x(b), "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + g.daysInMonth()), e = 12 * (this.year() - g.year()) + (this.month() - g.month()), f = this - tb(this).startOf("month") - (g - tb(g).startOf("month")), f -= 6e4 * (this.zone() - tb(this).startOf("month").zone() - (g.zone() - tb(g).startOf("month").zone())), e += f / d, "year" === b && (e /= 12)) : (d = this - g, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - h) / 864e5 : "week" === b ? (d - h) / 6048e5 : d), c ? e : o(e)
        },
        from: function(a, b) {
            return tb.duration({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b)
        },
        fromNow: function(a) {
            return this.from(tb(), a)
        },
        calendar: function(a) {
            var b = a || tb(),
                c = K(b, this).startOf("day"),
                d = this.diff(c, "days", !0),
                e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse";
            return this.format(this.localeData().calendar(e, this))
        },
        isLeapYear: function() {
            return E(this.year())
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
        },
        day: function(a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = eb(a, this.localeData()), this.add(a - b, "d")) : b
        },
        month: ob("Month", !0),
        startOf: function(a) {
            switch (a = x(a)) {
                case "year":
                    this.month(0);
                case "quarter":
                case "month":
                    this.date(1);
                case "week":
                case "isoWeek":
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
        },
        endOf: function(a) {
            return a = x(a), this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
        },
        isAfter: function(a, b) {
            return b = x("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = tb.isMoment(a) ? a : tb(a), +this > +a) : +this.clone().startOf(b) > +tb(a).startOf(b)
        },
        isBefore: function(a, b) {
            return b = x("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = tb.isMoment(a) ? a : tb(a), +a > +this) : +this.clone().startOf(b) < +tb(a).startOf(b)
        },
        isSame: function(a, b) {
            return b = x(b || "millisecond"), "millisecond" === b ? (a = tb.isMoment(a) ? a : tb(a), +this === +a) : +this.clone().startOf(b) === +K(a, this).startOf(b)
        },
        min: f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(a) {
            return a = tb.apply(null, arguments), this > a ? this : a
        }),
        max: f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(a) {
            return a = tb.apply(null, arguments), a > this ? this : a
        }),
        zone: function(a, b) {
            var c, d = this._offset || 0;
            return null == a ? this._isUTC ? d : this._dateTzOffset() : ("string" == typeof a && (a = Q(a)), Math.abs(a) < 16 && (a = 60 * a), !this._isUTC && b && (c = this._dateTzOffset()), this._offset = a, this._isUTC = !0, null != c && this.subtract(c, "m"), d !== a && (!b || this._changeInProgress ? t(this, tb.duration(d - a, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, tb.updateOffset(this, !0), this._changeInProgress = null)), this)
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function() {
            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i), this
        },
        hasAlignedHourOffset: function(a) {
            return a = a ? tb(a).zone() : 0, (this.zone() - a) % 60 === 0
        },
        daysInMonth: function() {
            return B(this.year(), this.month())
        },
        dayOfYear: function(a) {
            var b = yb((tb(this).startOf("day") - tb(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add(a - b, "d")
        },
        quarter: function(a) {
            return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
        },
        weekYear: function(a) {
            var b = hb(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == a ? b : this.add(a - b, "y")
        },
        isoWeekYear: function(a) {
            var b = hb(this, 1, 4).year;
            return null == a ? b : this.add(a - b, "y")
        },
        week: function(a) {
            var b = this.localeData().week(this);
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        isoWeek: function(a) {
            var b = hb(this, 1, 4).week;
            return null == a ? b : this.add(7 * (a - b), "d")
        },
        weekday: function(a) {
            var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == a ? b : this.add(a - b, "d")
        },
        isoWeekday: function(a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        isoWeeksInYear: function() {
            return C(this.year(), 1, 4)
        },
        weeksInYear: function() {
            var a = this.localeData()._week;
            return C(this.year(), a.dow, a.doy)
        },
        get: function(a) {
            return a = x(a), this[a]()
        },
        set: function(a, b) {
            return a = x(a), "function" == typeof this[a] && this[a](b), this
        },
        locale: function(b) {
            var c;
            return b === a ? this._locale._abbr : (c = tb.localeData(b), null != c && (this._locale = c), this)
        },
        lang: f("moment().lang() is deprecated. Use moment().localeData() instead.", function(b) {
            return b === a ? this.localeData() : this.locale(b)
        }),
        localeData: function() {
            return this._locale
        },
        _dateTzOffset: function() {
            return 15 * Math.round(this._d.getTimezoneOffset() / 15)
        }
    }), tb.fn.millisecond = tb.fn.milliseconds = ob("Milliseconds", !1), tb.fn.second = tb.fn.seconds = ob("Seconds", !1), tb.fn.minute = tb.fn.minutes = ob("Minutes", !1), tb.fn.hour = tb.fn.hours = ob("Hours", !0), tb.fn.date = ob("Date", !0), tb.fn.dates = f("dates accessor is deprecated. Use date instead.", ob("Date", !0)), tb.fn.year = ob("FullYear", !0), tb.fn.years = f("years accessor is deprecated. Use year instead.", ob("FullYear", !0)), tb.fn.days = tb.fn.day, tb.fn.months = tb.fn.month, tb.fn.weeks = tb.fn.week, tb.fn.isoWeeks = tb.fn.isoWeek, tb.fn.quarters = tb.fn.quarter, tb.fn.toJSON = tb.fn.toISOString, m(tb.duration.fn = l.prototype, {
        _bubble: function() {
            var a, b, c, d = this._milliseconds,
                e = this._days,
                f = this._months,
                g = this._data,
                h = 0;
            g.milliseconds = d % 1e3, a = o(d / 1e3), g.seconds = a % 60, b = o(a / 60), g.minutes = b % 60, c = o(b / 60), g.hours = c % 24, e += o(c / 24), h = o(pb(e)), e -= o(qb(h)), f += o(e / 30), e %= 30, h += o(f / 12), f %= 12, g.days = e, g.months = f, g.years = h
        },
        abs: function() {
            return this._milliseconds = Math.abs(this._milliseconds), this._days = Math.abs(this._days), this._months = Math.abs(this._months), this._data.milliseconds = Math.abs(this._data.milliseconds), this._data.seconds = Math.abs(this._data.seconds), this._data.minutes = Math.abs(this._data.minutes), this._data.hours = Math.abs(this._data.hours), this._data.months = Math.abs(this._data.months), this._data.years = Math.abs(this._data.years), this
        },
        weeks: function() {
            return o(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * A(this._months / 12)
        },
        humanize: function(a) {
            var b = gb(this, !a, this.localeData());
            return a && (b = this.localeData().pastFuture(+this, b)), this.localeData().postformat(b)
        },
        add: function(a, b) {
            var c = tb.duration(a, b);
            return this._milliseconds += c._milliseconds, this._days += c._days, this._months += c._months, this._bubble(), this
        },
        subtract: function(a, b) {
            var c = tb.duration(a, b);
            return this._milliseconds -= c._milliseconds, this._days -= c._days, this._months -= c._months, this._bubble(), this
        },
        get: function(a) {
            return a = x(a), this[a.toLowerCase() + "s"]()
        },
        as: function(a) {
            var b, c;
            if (a = x(a), "month" === a || "year" === a) return b = this._days + this._milliseconds / 864e5, c = this._months + 12 * pb(b), "month" === a ? c : c / 12;
            switch (b = this._days + qb(this._months / 12), a) {
                case "week":
                    return b / 7 + this._milliseconds / 6048e5;
                case "day":
                    return b + this._milliseconds / 864e5;
                case "hour":
                    return 24 * b + this._milliseconds / 36e5;
                case "minute":
                    return 24 * b * 60 + this._milliseconds / 6e4;
                case "second":
                    return 24 * b * 60 * 60 + this._milliseconds / 1e3;
                case "millisecond":
                    return Math.floor(24 * b * 60 * 60 * 1e3) + this._milliseconds;
                default:
                    throw new Error("Unknown unit " + a)
            }
        },
        lang: tb.fn.lang,
        locale: tb.fn.locale,
        toIsoString: f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function() {
            return this.toISOString()
        }),
        toISOString: function() {
            var a = Math.abs(this.years()),
                b = Math.abs(this.months()),
                c = Math.abs(this.days()),
                d = Math.abs(this.hours()),
                e = Math.abs(this.minutes()),
                f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
        },
        localeData: function() {
            return this._locale
        }
    }), tb.duration.fn.toString = tb.duration.fn.toISOString;
    for (vb in ic) c(ic, vb) && rb(vb.toLowerCase());
    tb.duration.fn.asMilliseconds = function() {
        return this.as("ms")
    }, tb.duration.fn.asSeconds = function() {
        return this.as("s")
    }, tb.duration.fn.asMinutes = function() {
        return this.as("m")
    }, tb.duration.fn.asHours = function() {
        return this.as("h")
    }, tb.duration.fn.asDays = function() {
        return this.as("d")
    }, tb.duration.fn.asWeeks = function() {
        return this.as("weeks")
    }, tb.duration.fn.asMonths = function() {
        return this.as("M")
    }, tb.duration.fn.asYears = function() {
        return this.as("y")
    }, tb.locale("en", {
        ordinal: function(a) {
            var b = a % 10,
                c = 1 === A(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), Jb ? module.exports = tb : "function" == typeof define && define.amd ? (define("moment", function(a, b, c) {
        return c.config && c.config() && c.config().noGlobal === !0 && (xb.moment = ub), tb
    }), sb(!0)) : sb()
}).call(this);
var Froogaloop = function() {
    function e(a) {
        return new e.fn.init(a)
    }

    function h(a, c, b) {
        if (!b.contentWindow.postMessage) return !1;
        var f = b.getAttribute("src").split("?")[0],
            a = JSON.stringify({
                method: a,
                value: c
            });
        "//" === f.substr(0, 2) && (f = window.location.protocol + f);
        b.contentWindow.postMessage(a, f)
    }

    function j(a) {
        var c, b;
        try {
            c = JSON.parse(a.data), b = c.event || c.method
        } catch (f) {}
        "ready" == b && !i && (i = !0);
        if (a.origin != k) return !1;
        var a = c.value,
            e = c.data,
            g = "" === g ? null : c.player_id;
        c = g ? d[g][b] : d[b];
        b = [];
        if (!c) return !1;
        void 0 !== a && b.push(a);
        e && b.push(e);
        g && b.push(g);
        return 0 < b.length ? c.apply(null, b) : c.call()
    }

    function l(a, c, b) {
        b ? (d[b] || (d[b] = {}), d[b][a] = c) : d[a] = c
    }
    var d = {},
        i = !1,
        k = "";
    e.fn = e.prototype = {
        element: null,
        init: function(a) {
            "string" === typeof a && (a = document.getElementById(a));
            this.element = a;
            a = this.element.getAttribute("src");
            "//" === a.substr(0, 2) && (a = window.location.protocol + a);
            for (var a = a.split("/"), c = "", b = 0, f = a.length; b < f; b++) {
                if (3 > b) c += a[b];
                else break;
                2 > b && (c += "/")
            }
            k = c;
            return this
        },
        api: function(a, c) {
            if (!this.element || !a) return !1;
            var b = this.element,
                f = "" !== b.id ? b.id : null,
                d = !c || !c.constructor || !c.call || !c.apply ? c : null,
                e = c && c.constructor && c.call && c.apply ? c : null;
            e && l(a, e, f);
            h(a, d, b);
            return this
        },
        addEvent: function(a, c) {
            if (!this.element) return !1;
            var b = this.element,
                d = "" !== b.id ? b.id : null;
            l(a, c, d);
            "ready" != a ? h("addEventListener", a, b) : "ready" == a && i && c.call(null, d);
            return this
        },
        removeEvent: function(a) {
            if (!this.element) return !1;
            var c = this.element,
                b;
            a: {
                if ((b = "" !== c.id ? c.id : null) && d[b]) {
                    if (!d[b][a]) {
                        b = !1;
                        break a
                    }
                    d[b][a] = null
                } else {
                    if (!d[a]) {
                        b = !1;
                        break a
                    }
                    d[a] = null
                }
                b = !0
            }
            "ready" != a && b && h("removeEventListener", a, c)
        }
    };
    e.fn.init.prototype = e.fn;
    window.addEventListener ? window.addEventListener("message", j, !1) : window.attachEvent("onmessage", j);
    return window.Froogaloop = window.$f = e
}();
! function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
    else if ("function" == typeof define && define.amd) define([], a);
    else {
        var b;
        "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self), b.ProgressBar = a()
    }
}(function() {
    var a;
    return function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                a[g][0].call(k.exports, function(b) {
                    var c = a[g][1][b];
                    return e(c ? c : b)
                }, k, k.exports, b, a, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function(b, c, d) {
            ! function(b) {
                "undefined" == typeof SHIFTY_DEBUG_NOW && (SHIFTY_DEBUG_NOW = function() {
                    return +new Date
                });
                var e = function() {
                    "use strict";

                    function e() {}

                    function f(a, b) {
                        var c;
                        for (c in a) Object.hasOwnProperty.call(a, c) && b(c)
                    }

                    function g(a, b) {
                        return f(b, function(c) {
                            a[c] = b[c]
                        }), a
                    }

                    function h(a, b) {
                        f(b, function(c) {
                            "undefined" == typeof a[c] && (a[c] = b[c])
                        })
                    }

                    function i(a, b, c, d, e, f, g) {
                        var h, i = (a - f) / e;
                        for (h in b) b.hasOwnProperty(h) && (b[h] = j(c[h], d[h], o[g[h]], i));
                        return b
                    }

                    function j(a, b, c, d) {
                        return a + (b - a) * c(d)
                    }

                    function k(a, b) {
                        var c = n.prototype.filter,
                            d = a._filterArgs;
                        f(c, function(e) {
                            "undefined" != typeof c[e][b] && c[e][b].apply(a, d)
                        })
                    }

                    function l(a, b, c, d, e, f, g, h, j) {
                        v = b + c, w = Math.min(u(), v), x = w >= v, a.isPlaying() && !x ? (j(a._timeoutHandler, s), k(a, "beforeTween"), i(w, d, e, f, c, b, g), k(a, "afterTween"), h(d)) : x && (h(f), a.stop(!0))
                    }

                    function m(a, b) {
                        var c = {};
                        return "string" == typeof b ? f(a, function(a) {
                            c[a] = b
                        }) : f(a, function(a) {
                            c[a] || (c[a] = b[a] || q)
                        }), c
                    }

                    function n(a, b) {
                        this._currentState = a || {}, this._configured = !1, this._scheduleFunction = p, "undefined" != typeof b && this.setConfig(b)
                    }
                    var o, p, q = "linear",
                        r = 500,
                        s = 1e3 / 60,
                        t = Date.now ? Date.now : function() {
                            return +new Date
                        },
                        u = SHIFTY_DEBUG_NOW ? SHIFTY_DEBUG_NOW : t;
                    p = "undefined" != typeof window ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame || setTimeout : setTimeout;
                    var v, w, x;
                    return n.prototype.tween = function(a) {
                        return this._isTweening ? this : (void 0 === a && this._configured || this.setConfig(a), this._start(this.get()), this.resume())
                    }, n.prototype.setConfig = function(a) {
                        a = a || {}, this._configured = !0, this._pausedAtTime = null, this._start = a.start || e, this._step = a.step || e, this._finish = a.finish || e, this._duration = a.duration || r, this._currentState = a.from || this.get(), this._originalState = this.get(), this._targetState = a.to || this.get(), this._timestamp = u();
                        var b = this._currentState,
                            c = this._targetState;
                        return h(c, b), this._easing = m(b, a.easing || q), this._filterArgs = [b, this._originalState, c, this._easing], k(this, "tweenCreated"), this
                    }, n.prototype.get = function() {
                        return g({}, this._currentState)
                    }, n.prototype.set = function(a) {
                        this._currentState = a
                    }, n.prototype.pause = function() {
                        return this._pausedAtTime = u(), this._isPaused = !0, this
                    }, n.prototype.resume = function() {
                        this._isPaused && (this._timestamp += u() - this._pausedAtTime), this._isPaused = !1, this._isTweening = !0;
                        var a = this;
                        return this._timeoutHandler = function() {
                            l(a, a._timestamp, a._duration, a._currentState, a._originalState, a._targetState, a._easing, a._step, a._scheduleFunction)
                        }, this._timeoutHandler(), this
                    }, n.prototype.stop = function(a) {
                        return this._isTweening = !1, this._isPaused = !1, this._timeoutHandler = e, a && (g(this._currentState, this._targetState), k(this, "afterTweenEnd"), this._finish.call(this, this._currentState)), this
                    }, n.prototype.isPlaying = function() {
                        return this._isTweening && !this._isPaused
                    }, n.prototype.setScheduleFunction = function(a) {
                        this._scheduleFunction = a
                    }, n.prototype.dispose = function() {
                        var a;
                        for (a in this) this.hasOwnProperty(a) && delete this[a]
                    }, n.prototype.filter = {}, n.prototype.formula = {
                        linear: function(a) {
                            return a
                        }
                    }, o = n.prototype.formula, g(n, {
                        now: u,
                        each: f,
                        tweenProps: i,
                        tweenProp: j,
                        applyFilter: k,
                        shallowCopy: g,
                        defaults: h,
                        composeEasingObject: m
                    }), "function" == typeof SHIFTY_DEBUG_NOW && (b.timeoutHandler = l), "object" == typeof d ? c.exports = n : "function" == typeof a && a.amd ? a(function() {
                        return n
                    }) : "undefined" == typeof b.Tweenable && (b.Tweenable = n), n
                }();
                ! function() {
                    e.shallowCopy(e.prototype.formula, {
                        easeInQuad: function(a) {
                            return Math.pow(a, 2)
                        },
                        easeOutQuad: function(a) {
                            return -(Math.pow(a - 1, 2) - 1)
                        },
                        easeInOutQuad: function(a) {
                            return (a /= .5) < 1 ? .5 * Math.pow(a, 2) : -.5 * ((a -= 2) * a - 2)
                        },
                        easeInCubic: function(a) {
                            return Math.pow(a, 3)
                        },
                        easeOutCubic: function(a) {
                            return Math.pow(a - 1, 3) + 1
                        },
                        easeInOutCubic: function(a) {
                            return (a /= .5) < 1 ? .5 * Math.pow(a, 3) : .5 * (Math.pow(a - 2, 3) + 2)
                        },
                        easeInQuart: function(a) {
                            return Math.pow(a, 4)
                        },
                        easeOutQuart: function(a) {
                            return -(Math.pow(a - 1, 4) - 1)
                        },
                        easeInOutQuart: function(a) {
                            return (a /= .5) < 1 ? .5 * Math.pow(a, 4) : -.5 * ((a -= 2) * Math.pow(a, 3) - 2)
                        },
                        easeInQuint: function(a) {
                            return Math.pow(a, 5)
                        },
                        easeOutQuint: function(a) {
                            return Math.pow(a - 1, 5) + 1
                        },
                        easeInOutQuint: function(a) {
                            return (a /= .5) < 1 ? .5 * Math.pow(a, 5) : .5 * (Math.pow(a - 2, 5) + 2)
                        },
                        easeInSine: function(a) {
                            return -Math.cos(a * (Math.PI / 2)) + 1
                        },
                        easeOutSine: function(a) {
                            return Math.sin(a * (Math.PI / 2))
                        },
                        easeInOutSine: function(a) {
                            return -.5 * (Math.cos(Math.PI * a) - 1)
                        },
                        easeInExpo: function(a) {
                            return 0 === a ? 0 : Math.pow(2, 10 * (a - 1))
                        },
                        easeOutExpo: function(a) {
                            return 1 === a ? 1 : -Math.pow(2, -10 * a) + 1
                        },
                        easeInOutExpo: function(a) {
                            return 0 === a ? 0 : 1 === a ? 1 : (a /= .5) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (-Math.pow(2, -10 * --a) + 2)
                        },
                        easeInCirc: function(a) {
                            return -(Math.sqrt(1 - a * a) - 1)
                        },
                        easeOutCirc: function(a) {
                            return Math.sqrt(1 - Math.pow(a - 1, 2))
                        },
                        easeInOutCirc: function(a) {
                            return (a /= .5) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
                        },
                        easeOutBounce: function(a) {
                            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
                        },
                        easeInBack: function(a) {
                            var b = 1.70158;
                            return a * a * ((b + 1) * a - b)
                        },
                        easeOutBack: function(a) {
                            var b = 1.70158;
                            return (a -= 1) * a * ((b + 1) * a + b) + 1
                        },
                        easeInOutBack: function(a) {
                            var b = 1.70158;
                            return (a /= .5) < 1 ? .5 * a * a * (((b *= 1.525) + 1) * a - b) : .5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2)
                        },
                        elastic: function(a) {
                            return -1 * Math.pow(4, -8 * a) * Math.sin(2 * (6 * a - 1) * Math.PI / 2) + 1
                        },
                        swingFromTo: function(a) {
                            var b = 1.70158;
                            return (a /= .5) < 1 ? .5 * a * a * (((b *= 1.525) + 1) * a - b) : .5 * ((a -= 2) * a * (((b *= 1.525) + 1) * a + b) + 2)
                        },
                        swingFrom: function(a) {
                            var b = 1.70158;
                            return a * a * ((b + 1) * a - b)
                        },
                        swingTo: function(a) {
                            var b = 1.70158;
                            return (a -= 1) * a * ((b + 1) * a + b) + 1
                        },
                        bounce: function(a) {
                            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
                        },
                        bouncePast: function(a) {
                            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 2 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 2 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 2 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
                        },
                        easeFromTo: function(a) {
                            return (a /= .5) < 1 ? .5 * Math.pow(a, 4) : -.5 * ((a -= 2) * Math.pow(a, 3) - 2)
                        },
                        easeFrom: function(a) {
                            return Math.pow(a, 4)
                        },
                        easeTo: function(a) {
                            return Math.pow(a, .25)
                        }
                    })
                }(),
                function() {
                    function a(a, b, c, d, e, f) {
                        function g(a) {
                            return ((n * a + o) * a + p) * a
                        }

                        function h(a) {
                            return ((q * a + r) * a + s) * a
                        }

                        function i(a) {
                            return (3 * n * a + 2 * o) * a + p
                        }

                        function j(a) {
                            return 1 / (200 * a)
                        }

                        function k(a, b) {
                            return h(m(a, b))
                        }

                        function l(a) {
                            return a >= 0 ? a : 0 - a
                        }

                        function m(a, b) {
                            var c, d, e, f, h, j;
                            for (e = a, j = 0; 8 > j; j++) {
                                if (f = g(e) - a, l(f) < b) return e;
                                if (h = i(e), l(h) < 1e-6) break;
                                e -= f / h
                            }
                            if (c = 0, d = 1, e = a, c > e) return c;
                            if (e > d) return d;
                            for (; d > c;) {
                                if (f = g(e), l(f - a) < b) return e;
                                a > f ? c = e : d = e, e = .5 * (d - c) + c
                            }
                            return e
                        }
                        var n = 0,
                            o = 0,
                            p = 0,
                            q = 0,
                            r = 0,
                            s = 0;
                        return p = 3 * b, o = 3 * (d - b) - p, n = 1 - p - o, s = 3 * c, r = 3 * (e - c) - s, q = 1 - s - r, k(a, j(f))
                    }

                    function b(b, c, d, e) {
                        return function(f) {
                            return a(f, b, c, d, e, 1)
                        }
                    }
                    e.setBezierFunction = function(a, c, d, f, g) {
                        var h = b(c, d, f, g);
                        return h.x1 = c, h.y1 = d, h.x2 = f, h.y2 = g, e.prototype.formula[a] = h
                    }, e.unsetBezierFunction = function(a) {
                        delete e.prototype.formula[a]
                    }
                }(),
                function() {
                    function a(a, b, c, d, f) {
                        return e.tweenProps(d, b, a, c, 1, 0, f)
                    }
                    var b = new e;
                    b._filterArgs = [], e.interpolate = function(c, d, f, g) {
                        var h = e.shallowCopy({}, c),
                            i = e.composeEasingObject(c, g || "linear");
                        b.set({});
                        var j = b._filterArgs;
                        j.length = 0, j[0] = h, j[1] = c, j[2] = d, j[3] = i, e.applyFilter(b, "tweenCreated"), e.applyFilter(b, "beforeTween");
                        var k = a(c, h, d, f, i);
                        return e.applyFilter(b, "afterTween"), k
                    }
                }(),
                function(a) {
                    function b(a, b) {
                        B.length = 0;
                        var c, d = a.length;
                        for (c = 0; d > c; c++) B.push("_" + b + "_" + c);
                        return B
                    }

                    function c(a) {
                        var b = a.match(v);
                        return b ? (1 === b.length || a[0].match(u)) && b.unshift("") : b = ["", ""], b.join(A)
                    }

                    function d(b) {
                        a.each(b, function(a) {
                            var c = b[a];
                            "string" == typeof c && c.match(z) && (b[a] = e(c))
                        })
                    }

                    function e(a) {
                        return i(z, a, f)
                    }

                    function f(a) {
                        var b = g(a);
                        return "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")"
                    }

                    function g(a) {
                        return a = a.replace(/#/, ""), 3 === a.length && (a = a.split(""), a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]), C[0] = h(a.substr(0, 2)), C[1] = h(a.substr(2, 2)), C[2] = h(a.substr(4, 2)), C
                    }

                    function h(a) {
                        return parseInt(a, 16)
                    }

                    function i(a, b, c) {
                        var d = b.match(a),
                            e = b.replace(a, A);
                        if (d)
                            for (var f, g = d.length, h = 0; g > h; h++) f = d.shift(), e = e.replace(A, c(f));
                        return e
                    }

                    function j(a) {
                        return i(x, a, k)
                    }

                    function k(a) {
                        for (var b = a.match(w), c = b.length, d = a.match(y)[0], e = 0; c > e; e++) d += parseInt(b[e], 10) + ",";
                        return d = d.slice(0, -1) + ")"
                    }

                    function l(d) {
                        var e = {};
                        return a.each(d, function(a) {
                            var f = d[a];
                            if ("string" == typeof f) {
                                var g = r(f);
                                e[a] = {
                                    formatString: c(f),
                                    chunkNames: b(g, a)
                                }
                            }
                        }), e
                    }

                    function m(b, c) {
                        a.each(c, function(a) {
                            for (var d = b[a], e = r(d), f = e.length, g = 0; f > g; g++) b[c[a].chunkNames[g]] = +e[g];
                            delete b[a]
                        })
                    }

                    function n(b, c) {
                        a.each(c, function(a) {
                            var d = b[a],
                                e = o(b, c[a].chunkNames),
                                f = p(e, c[a].chunkNames);
                            d = q(c[a].formatString, f), b[a] = j(d)
                        })
                    }

                    function o(a, b) {
                        for (var c, d = {}, e = b.length, f = 0; e > f; f++) c = b[f], d[c] = a[c], delete a[c];
                        return d
                    }

                    function p(a, b) {
                        D.length = 0;
                        for (var c = b.length, d = 0; c > d; d++) D.push(a[b[d]]);
                        return D
                    }

                    function q(a, b) {
                        for (var c = a, d = b.length, e = 0; d > e; e++) c = c.replace(A, +b[e].toFixed(4));
                        return c
                    }

                    function r(a) {
                        return a.match(w)
                    }

                    function s(b, c) {
                        a.each(c, function(a) {
                            for (var d = c[a], e = d.chunkNames, f = e.length, g = b[a].split(" "), h = g[g.length - 1], i = 0; f > i; i++) b[e[i]] = g[i] || h;
                            delete b[a]
                        })
                    }

                    function t(b, c) {
                        a.each(c, function(a) {
                            for (var d = c[a], e = d.chunkNames, f = e.length, g = "", h = 0; f > h; h++) g += " " + b[e[h]], delete b[e[h]];
                            b[a] = g.substr(1)
                        })
                    }
                    var u = /(\d|\-|\.)/,
                        v = /([^\-0-9\.]+)/g,
                        w = /[0-9.\-]+/g,
                        x = new RegExp("rgb\\(" + w.source + /,\s*/.source + w.source + /,\s*/.source + w.source + "\\)", "g"),
                        y = /^.*\(/,
                        z = /#([0-9]|[a-f]){3,6}/gi,
                        A = "VAL",
                        B = [],
                        C = [],
                        D = [];
                    a.prototype.filter.token = {
                        tweenCreated: function(a, b, c) {
                            d(a), d(b), d(c), this._tokenData = l(a)
                        },
                        beforeTween: function(a, b, c, d) {
                            s(d, this._tokenData), m(a, this._tokenData), m(b, this._tokenData), m(c, this._tokenData)
                        },
                        afterTween: function(a, b, c, d) {
                            n(a, this._tokenData), n(b, this._tokenData), n(c, this._tokenData), t(d, this._tokenData)
                        }
                    }
                }(e)
            }(this)
        }, {}],
        2: [function(a, b) {
            var c = a("./shape"),
                d = a("./utils"),
                e = function() {
                    this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}", c.apply(this, arguments)
                };
            e.prototype = new c, e.prototype.constructor = e, e.prototype._pathString = function(a) {
                var b = a.strokeWidth;
                a.trailWidth && a.trailWidth > a.strokeWidth && (b = a.trailWidth);
                var c = 50 - b / 2;
                return d.render(this._pathTemplate, {
                    radius: c,
                    "2radius": 2 * c
                })
            }, e.prototype._trailString = function(a) {
                return this._pathString(a)
            }, b.exports = e
        }, {
            "./shape": 6,
            "./utils": 8
        }],
        3: [function(a, b) {
            var c = a("./shape"),
                d = a("./utils"),
                e = function() {
                    this._pathTemplate = "M 0,{center} L 100,{center}", c.apply(this, arguments)
                };
            e.prototype = new c, e.prototype.constructor = e, e.prototype._initializeSvg = function(a, b) {
                a.setAttribute("viewBox", "0 0 100 " + b.strokeWidth), a.setAttribute("preserveAspectRatio", "none")
            }, e.prototype._pathString = function(a) {
                return d.render(this._pathTemplate, {
                    center: a.strokeWidth / 2
                })
            }, e.prototype._trailString = function(a) {
                return this._pathString(a)
            }, b.exports = e
        }, {
            "./shape": 6,
            "./utils": 8
        }],
        4: [function(a, b) {
            var c = a("./line"),
                d = a("./circle"),
                e = a("./square"),
                f = a("./path");
            b.exports = {
                Line: c,
                Circle: d,
                Square: e,
                Path: f
            }
        }, {
            "./circle": 2,
            "./line": 3,
            "./path": 5,
            "./square": 7
        }],
        5: [function(a, b) {
            var c = a("shifty"),
                d = a("./utils"),
                e = {
                    easeIn: "easeInCubic",
                    easeOut: "easeOutCubic",
                    easeInOut: "easeInOutCubic"
                },
                f = function(a, b) {
                    b = d.extend({
                        duration: 800,
                        easing: "linear",
                        from: {},
                        to: {},
                        step: function() {}
                    }, b), this._path = a, this._opts = b, this._tweenable = null;
                    var c = this._path.getTotalLength();
                    this._path.style.strokeDasharray = c + " " + c, this.set(0)
                };
            f.prototype.value = function() {
                var a = this._getComputedDashOffset(),
                    b = this._path.getTotalLength(),
                    c = 1 - a / b;
                return parseFloat(c.toFixed(6), 10)
            }, f.prototype.set = function(a) {
                this.stop(), this._path.style.strokeDashoffset = this._progressToOffset(a);
                var b = this._opts.step;
                if (d.isFunction(b)) {
                    var c = this._easing(this._opts.easing),
                        e = this._calculateTo(a, c);
                    b(e, this._opts.attachment || this)
                }
            }, f.prototype.stop = function() {
                this._stopTween(), this._path.style.strokeDashoffset = this._getComputedDashOffset()
            }, f.prototype.animate = function(a, b, e) {
                b = b || {}, d.isFunction(b) && (e = b, b = {});
                var f = d.extend({}, b),
                    g = d.extend({}, this._opts);
                b = d.extend(g, b);
                var h = this._easing(b.easing),
                    i = this._resolveFromAndTo(a, h, f);
                this.stop(), this._path.getBoundingClientRect();
                var j = this._getComputedDashOffset(),
                    k = this._progressToOffset(a),
                    l = this;
                this._tweenable = new c, this._tweenable.tween({
                    from: d.extend({
                        offset: j
                    }, i.from),
                    to: d.extend({
                        offset: k
                    }, i.to),
                    duration: b.duration,
                    easing: h,
                    step: function(a) {
                        l._path.style.strokeDashoffset = a.offset, b.step(a, b.attachment)
                    },
                    finish: function() {
                        d.isFunction(e) && e()
                    }
                })
            }, f.prototype._getComputedDashOffset = function() {
                var a = window.getComputedStyle(this._path, null);
                return parseFloat(a.getPropertyValue("stroke-dashoffset"), 10)
            }, f.prototype._progressToOffset = function(a) {
                var b = this._path.getTotalLength();
                return b - a * b
            }, f.prototype._resolveFromAndTo = function(a, b, c) {
                return c.from && c.to ? {
                    from: c.from,
                    to: c.to
                } : {
                    from: this._calculateFrom(b),
                    to: this._calculateTo(a, b)
                }
            }, f.prototype._calculateFrom = function(a) {
                return c.interpolate(this._opts.from, this._opts.to, this.value(), a)
            }, f.prototype._calculateTo = function(a, b) {
                return c.interpolate(this._opts.from, this._opts.to, a, b)
            }, f.prototype._stopTween = function() {
                null !== this._tweenable && (this._tweenable.stop(), this._tweenable.dispose(), this._tweenable = null)
            }, f.prototype._easing = function(a) {
                return e.hasOwnProperty(a) ? e[a] : a
            }, b.exports = f
        }, {
            "./utils": 8,
            shifty: 1
        }],
        6: [function(a, b) {
            var c = a("./path"),
                d = a("./utils"),
                e = "Object is destroyed",
                f = function g(a, b) {
                    if (!(this instanceof g)) throw new Error("Constructor was called without new keyword");
                    if (0 !== arguments.length) {
                        this._opts = d.extend({
                            color: "#555",
                            strokeWidth: 1,
                            trailColor: null,
                            trailWidth: null,
                            fill: null,
                            text: {
                                autoStyle: !0,
                                color: null,
                                value: "",
                                className: "progressbar-text"
                            }
                        }, b, !0);
                        var e, f = this._createSvgView(this._opts);
                        if (e = d.isString(a) ? document.querySelector(a) : a, !e) throw new Error("Container does not exist: " + a);
                        this._container = e, this._container.appendChild(f.svg), this.text = null, this._opts.text.value && (this.text = this._createTextElement(this._opts, this._container), this._container.appendChild(this.text)), this.svg = f.svg, this.path = f.path, this.trail = f.trail;
                        var h = d.extend({
                            attachment: this
                        }, this._opts);
                        this._progressPath = new c(f.path, h)
                    }
                };
            f.prototype.animate = function(a, b, c) {
                if (null === this._progressPath) throw new Error(e);
                this._progressPath.animate(a, b, c)
            }, f.prototype.stop = function() {
                if (null === this._progressPath) throw new Error(e);
                void 0 !== this._progressPath && this._progressPath.stop()
            }, f.prototype.destroy = function() {
                if (null === this._progressPath) throw new Error(e);
                this.stop(), this.svg.parentNode.removeChild(this.svg), this.svg = null, this.path = null, this.trail = null, this._progressPath = null, null !== this.text && (this.text.parentNode.removeChild(this.text), this.text = null)
            }, f.prototype.set = function(a) {
                if (null === this._progressPath) throw new Error(e);
                this._progressPath.set(a)
            }, f.prototype.value = function() {
                if (null === this._progressPath) throw new Error(e);
                return void 0 === this._progressPath ? 0 : this._progressPath.value()
            }, f.prototype.setText = function(a) {
                if (null === this._progressPath) throw new Error(e);
                null === this.text && (this.text = this._createTextElement(this._opts, this._container), this._container.appendChild(this.text)), this.text.removeChild(this.text.firstChild), this.text.appendChild(document.createTextNode(a))
            }, f.prototype._createSvgView = function(a) {
                var b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this._initializeSvg(b, a);
                var c = null;
                (a.trailColor || a.trailWidth) && (c = this._createTrail(a), b.appendChild(c));
                var d = this._createPath(a);
                return b.appendChild(d), {
                    svg: b,
                    path: d,
                    trail: c
                }
            }, f.prototype._initializeSvg = function(a) {
                a.setAttribute("viewBox", "0 0 100 100")
            }, f.prototype._createPath = function(a) {
                var b = this._pathString(a);
                return this._createPathElement(b, a)
            }, f.prototype._createTrail = function(a) {
                var b = this._trailString(a),
                    c = d.extend({}, a);
                return c.trailColor || (c.trailColor = "#eee"), c.trailWidth || (c.trailWidth = c.strokeWidth), c.color = c.trailColor, c.strokeWidth = c.trailWidth, c.fill = null, this._createPathElement(b, c)
            }, f.prototype._createPathElement = function(a, b) {
                var c = document.createElementNS("http://www.w3.org/2000/svg", "path");
                return c.setAttribute("d", a), c.setAttribute("stroke", b.color), c.setAttribute("stroke-width", b.strokeWidth), b.fill ? c.setAttribute("fill", b.fill) : c.setAttribute("fill-opacity", "0"), c
            }, f.prototype._createTextElement = function(a, b) {
                var c = document.createElement("p");
                return c.appendChild(document.createTextNode(a.text.value)), a.text.autoStyle && (b.style.position = "relative", c.style.position = "absolute", c.style.top = "50%", c.style.left = "50%", c.style.padding = 0, c.style.margin = 0, d.setStyle(c, "transform", "translate(-50%, -50%)"), c.style.color = a.text.color ? a.text.color : a.color), c.className = a.text.className, c
            }, f.prototype._pathString = function() {
                throw new Error("Override this function for each progress bar")
            }, f.prototype._trailString = function() {
                throw new Error("Override this function for each progress bar")
            }, b.exports = f
        }, {
            "./path": 5,
            "./utils": 8
        }],
        7: [function(a, b) {
            var c = a("./shape"),
                d = a("./utils"),
                e = function() {
                    this._pathTemplate = "M 0,{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{strokeWidth}", this._trailTemplate = "M {startMargin},{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{halfOfStrokeWidth}", c.apply(this, arguments)
                };
            e.prototype = new c, e.prototype.constructor = e, e.prototype._pathString = function(a) {
                var b = 100 - a.strokeWidth / 2;
                return d.render(this._pathTemplate, {
                    width: b,
                    strokeWidth: a.strokeWidth,
                    halfOfStrokeWidth: a.strokeWidth / 2
                })
            }, e.prototype._trailString = function(a) {
                var b = 100 - a.strokeWidth / 2;
                return d.render(this._trailTemplate, {
                    width: b,
                    strokeWidth: a.strokeWidth,
                    halfOfStrokeWidth: a.strokeWidth / 2,
                    startMargin: a.strokeWidth / 2 - a.trailWidth / 2
                })
            }, b.exports = e
        }, {
            "./shape": 6,
            "./utils": 8
        }],
        8: [function(a, b) {
            function c(a, b, d) {
                a = a || {}, b = b || {}, d = d || !1;
                for (var e in b)
                    if (b.hasOwnProperty(e)) {
                        var f = a[e],
                            g = b[e];
                        a[e] = d && j(f) && j(g) ? c(f, g, d) : g
                    }
                return a
            }

            function d(a, b) {
                var c = a;
                for (var d in b)
                    if (b.hasOwnProperty(d)) {
                        var e = b[d],
                            f = "\\{" + d + "\\}",
                            g = new RegExp(f, "g");
                        c = c.replace(g, e)
                    }
                return c
            }

            function e(a, b, c) {
                for (var d = 0; d < k.length; ++d) {
                    var e = f(k[d]);
                    a.style[e + f(b)] = c
                }
                a.style[b] = c
            }

            function f(a) {
                return a.charAt(0).toUpperCase() + a.slice(1)
            }

            function g(a) {
                return "string" == typeof a || a instanceof String
            }

            function h(a) {
                return "function" == typeof a
            }

            function i(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }

            function j(a) {
                if (i(a)) return !1;
                var b = typeof a;
                return "object" === b && !!a
            }
            var k = "webkit moz o ms".split(" ");
            b.exports = {
                extend: c,
                render: d,
                setStyle: e,
                capitalize: f,
                isString: g,
                isFunction: h,
                isObject: j
            }
        }, {}]
    }, {}, [4])(4)
});
(function($) {
    $.fn.fullpageElements = function() {
        $elements = this;
        var defaults = {
            horizontalOffset: 0,
            verticalOffset: 0,
            horizontal: true,
            vertical: true,
            horizontalAttribute: "width",
            verticalAttribute: "height",
            skipMobile: false,
            iOSHeightCorrection: "+=50px"
        }
        $(window).on('resize', function(event) {
            return $elements.each(function() {
                var ww = $(window).width(),
                    wh = $(window).outerHeight(),
                    options = $(this).data("fullpage-element"),
                    skip = false;
                var settings = $.extend({}, defaults, options);
                if (settings.skipMobile == true && $.fn.isMobile()) {
                    skip = true
                };
                if (skip != true) {
                    if (settings.horizontal) {
                        $(this).css(settings.horizontalAttribute, ww - settings.horizontalOffset)
                    };
                    if (settings.vertical) {
                        $(this).css(settings.verticalAttribute, wh - settings.verticalOffset);
                    };
                    if ($.fn.iOSversion() > 7) {
                        $(this).css(settings.verticalAttribute, settings.iOSHeightCorrection);
                    };
                };
            });
        });
        $(window).trigger('resize');
    };
})(jQuery);
$(document).ready(function() {
    VimeoPlayer.init();
});

function openVimeoPlayer(videoID) {
    VimeoPlayer.createModal(videoID);
}
VimeoPlayer = {
    init: function() {
        this.register();
        this.autoOpenModal();
    },
    register: function() {
        $("body").on('click', '[data-vimeo-video]', function(event) {
            var videoID = $(this).data('vimeo-video');
            openVimeoPlayer(videoID);
            event.preventDefault();
        });
    },
    createModal: function(videoID) {
        $("body").addClass('modal-open');
        $("video:in-viewport").prop('muted', 'true').each(function() {
            $(this).get(0).pause();
        });
        var dimensions = VimeoPlayer.getDimensions();
        var $modal = $("<div />").addClass('vimeo-player-modal'),
            $inner = $("<div/>").addClass('relative-inner').appendTo($modal);
        Header.changeTriggerBehavior("VimeoPlayer.dispose");
        $modal.on('click', function(event) {
            VimeoPlayer.dispose();
        });
        document.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                VimeoPlayer.dispose();
            }
        };
        var $sharer = Sharer.getMarkup();
        $sharer.appendTo($inner);
        Sharer.initialize($modal, "?vimeoid=" + videoID);
        $modal.appendTo($("body")).css('height', $(window).height());
        var $video = $("<div />").html("<iframe src='//player.vimeo.com/video/" + videoID + "?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autoplay=1&amp;color=a88f3e&api=1' width='500' height='281' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>").addClass("vimeo-player vertical-centered");
        setTimeout(function() {
            $video.appendTo($inner);
            $iframe = $video.find("iframe");
            $iframe.attr({
                width: dimensions.width,
                height: dimensions.height
            }).addClass('vimeo-iframe');
            var player = $f($iframe.get(0));
            player.addEvent('ready', function() {
                player.addEvent('finish', VimeoPlayer.dispose);
            });
            $(window).on('resize', function(event) {
                var dimensions = VimeoPlayer.getDimensions();
                $("iframe.vimeo-iframe").attr({
                    width: dimensions.width,
                    height: dimensions.height
                })
            });
        }, 1000);
    },
    getDimensions: function() {
        var wh = $(window).height(),
            ww = $(window).width(),
            padding = 250,
            screenRatio = wh / ww,
            videoRatioH = 16 / 9,
            videoRatio = 9 / 16;
        if (screenRatio > videoRatio) {
            var w = ww - padding,
                h = w * videoRatio;
        } else {
            var h = wh - padding,
                w = h * videoRatioH;
        }
        return {
            "width": w,
            "height": h
        }
    },
    dispose: function($iframe, e) {
        var $player = $(".vimeo-player-modal");
        if ($(".vimeo-player-modal").get(0)) {
            $player.height(0);
            setTimeout(function() {
                $player.remove();
                $("body").removeClass('modal-open');
                Header.revertTriggerBehavior();
                $("video:in-viewport").prop('muted', null).each(function() {
                    $(this).get(0).play();
                });
            }, 250);
        };
    },
    autoOpenModal: function() {
        var videoID = $.urlParam('vimeoid');
        if (videoID) {
            setTimeout(function() {
                openVimeoPlayer(videoID);
            }, 500);
        };
    }
};
(function($) {
    $.fn.videoAutoMuted = function() {
        $videos = this;
        var defaults = {}
        $(window).on('resize scroll', function(event) {
            $videos.each(function() {
                var visible = $(this).is(":in-viewport()"),
                    video = $(this).find("video"),
                    videoDom = video.get(0),
                    animating = video.data('animating'),
                    timeline = new TimelineMax();
                if (videoDom) {
                    if (visible) {
                        if (videoDom.paused && animating != true) {
                            video.prop('muted', null);
                            videoDom.volume = 0;
                            videoDom.play();
                            timeline.add([TweenMax.to(video, 0.75, {
                                "volume": 1,
                                onStart: function() {
                                    video.data('animating', true)
                                },
                                onComplete: function() {
                                    video.data('animating', false)
                                }
                            })]);
                        };
                    } else {
                        if (!videoDom.paused && animating != true) {
                            timeline.add([TweenMax.to(video, 0.75, {
                                "volume": 0,
                                onStart: function() {
                                    video.data('animating', true)
                                },
                                onComplete: function() {
                                    video.data('animating', false);
                                    videoDom.pause();
                                }
                            })]);
                        }
                    };
                };
            });
        });
        $(window).trigger('resize scroll');
    };
})(jQuery);
jQuery(document).ready(function($) {
    Sharer.initialize();
});
Sharer = {
    initialize: function($container, params, url, title) {
        Sharer.$container = $container;
        Sharer.setUrl(params, url, title);
        Sharer.shareEvents();
    },
    getMarkup: function(params) {
        var template = $('#sharer-template').html(),
            rendered = Mustache.render(template);
        return $("<span />").html(rendered);
    },
    getFacebookParams: function(params, url, title) {
        if (params === undefined) {
            params = "";
        };
        data = {
            t: title !== undefined ? title : document.title,
            u: url !== undefined ? encodeURI(url) : encodeURI(window.location + params)
        }
        return $.param(data);
    },
    getTwitterParams: function(params, url, title) {
        if (params === undefined) {
            params = "";
        };
        data = {
            text: title !== undefined ? title : document.title,
            url: url !== undefined ? encodeURI(url) : encodeURI(window.location + params)
        }
        return $.param(data);
    },
    getScope: function() {
        if (Sharer.$container !== undefined) {
            return Sharer.$container;
        } else {
            return $("body");
        }
    },
    setUrl: function(params, url, title) {
        Sharer.getScope().find("nav.sharer a.facebook-share").attr("href", "https://www.facebook.com/sharer/sharer.php?" + Sharer.getFacebookParams(params, url, title));
        Sharer.getScope().find("nav.sharer a.twitter-share").attr("href", "https://twitter.com/intent/tweet?" + Sharer.getTwitterParams(params, url, title));
    },
    shareEvents: function() {
        Sharer.getScope().find("nav.sharer a.facebook-share").on('click', function() {
            var url = $(this).attr('href');
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = this.href,
                opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
            window.open(url, 'facebook', opts);
            return false;
        });
        Sharer.getScope().find("nav.sharer a.twitter-share").click(function(event) {
            var width = 575,
                height = 400,
                left = ($(window).width() - width) / 2,
                top = ($(window).height() - height) / 2,
                url = this.href,
                opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
            window.open(url, 'twitter', opts);
            return false;
        });
    }
}
PageLoader = {
    init: function() {
        circle = new ProgressBar.Line('#progress-circle', {
            color: '#cbc9b6',
            strokeWidth: 0.25,
        });
        PageLoader.activateMenu();
        PageLoader.transport();
        PageLoader.checkForPreload($("[data-pjax-container]").html(), function() {
            PageLoader.onLoadMethod()
        });
        window.onbeforeunload = function() {
            PageLoader.showLoader();
        }
    },
    onLoadMethod: function() {
        PageLoader.hideLoader();
        var callback = eval($("[data-pjax-container]").find('#on-load-method').data('method'));
        if (callback !== undefined) {
            var options = {};
            options = $("[data-pjax-container]").find('#on-load-method').data('options');
            callback.call(this, options);
        };
    },
    onLeaveMethod: function() {
        var callback = eval($("[data-pjax-container]").find('#on-leave-method').data('method'));
        if (callback !== undefined) {
            callback.call();
        };
    },
    hideLoader: function() {
        setTimeout(function() {
            TweenMax.to($("#page-loader"), 0.5, {
                "opacity": 0,
                ease: SlowMo.easeInOut,
                onComplete: function() {
                    $("#page-loader").addClass('off');
                }
            });
        }, 750);
    },
    showLoader: function() {
        $("body").removeClass('nav-open');
        $("nav#site-nav").removeClass('visible');
        PageLoader.onLeaveMethod();
        window.circle.set(0);
        TweenMax.to($("#page-loader"), 0.25, {
            "opacity": 1,
            ease: SlowMo.easeInOut,
            onStart: function() {
                $("#page-loader").removeClass('off')
            }
        });
    },
    transport: function() {
        var State = History.getState();
        History.Adapter.bind(window, 'statechange', function() {
            var State = History.getState();
            var htmlReady = $("html").data('loaded');
            var rand = Math.floor(Math.random() * 10000);
            var hasHash = State.hash.search("#") >= 0 ? true : false;
            if (State.hash.length && !hasHash) {
                PageLoader.getPage(State.url + "?rand=" + rand);
            }
        });
        $(document).on('click touchstart', '[data-pjax]', function() {
            var url = $(this).attr('href');
            PageLoader.pushState(url, this);
            return false;
        });
    },
    pushState: function(url, el) {
        var rand = Math.floor(Math.random() * 10000);
        var elementTitle = $(el).attr('title') != undefined ? $(el).attr('title') : "";
        var title = '{0} - {1}'.f(BASE_TITLE, elementTitle)
        History.pushState({
            state: 1,
            rand: rand
        }, title, url);
    },
    getPage: function(url) {
        $("html").data('loaded', true);
        PageLoader.showLoader();
        VimeoPlayer.dispose();
        jQuery.ajax({
            url: url,
            dataType: 'html',
            type: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-PJAX', 'true')
            },
            success: function(source) {
                PageLoader.checkForPreload(source, function() {
                    PageLoader.setHTML(source)
                });
            },
            error: function() {
                console.log('Transport error');
            }
        });
    },
    setHTML: function(source) {
        var $container = $("[data-pjax-container]");
        $container.empty();
        $container.html(source);
        setTimeout(function() {
            ga('send', 'pageview', {
                'page': window.location.pathname
            });
            PageLoader.activateMenu();
            Sharer.initialize();
            FB.XFBML.parse();
            Main.newsletter();
            PageLoader.onLoadMethod();
        }, 1000);
    },
    checkForPreload: function(source, callback) {
        var $shim = $("<div/>").html(source),
            $e = $shim.find('[data-preload-items]') || $(source).find('[data-preload-items]');
        $("#progress-circle").fadeIn();
        var preloadItems = eval($e.data("preload-items"));
        if (preloadItems !== undefined) {
            var manifest = [];
            var preload = new createjs.LoadQueue();
            preload.setMaxConnections(15);
            if (preloadItems.length > 0) {
                for (var i = preloadItems.length - 1; i >= 0; i--) {
                    var $items = $e.find("[" + preloadItems[i] + "]");
                    $items.each(function() {
                        var sel = preloadItems[i].replace('data-', ''),
                            data = $(this).data(sel);
                        if (data.length > 0)
                            manifest.push({
                                src: data,
                                id: Math.random() * 1000 + "-ouisurf-file",
                                element: this
                            });
                    });
                };
            };
            if (manifest.length > 0) {
                preload.loadManifest(manifest);
                preload.load();
                preload.addEventListener("progress", function(event) {
                    window.circle.animate(parseFloat(event.loaded.toFixed(3)));
                });
                preload.addEventListener("complete", function(event) {
                    callback.call();
                });
            } else {
                callback.call();
            }
        } else {
            window.circle.animate(1);
            callback.call();
        }
    },
    activateMenu: function(url) {
        var path = document.location.pathname;
        if (url !== undefined)
            path = url;
        var $a = $('a[href="' + path + '"]').not('.root').addClass('active');
        $('a').not($a).removeClass('active');
    }
};
(function($) {
    $.each(['show', 'hide'], function(i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function() {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);
$.fn.isMobile = function() {
    return $(window).width() > MOBILE_BREAKPOINT ? false : true;
}
$.fn.isTouch = function() {
    return !!('ontouchstart' in window);
}
$.fn.isTablet = function() {
    return !$.fn.isMobile() && $.fn.isTouch() ? true : false
}
$.fn.iOSversion = function() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return parseInt(v[1], 10);
    }
}
$.urlParam = function(name) {
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param, params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
var filterFloat = function(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
        return Number(value);
    return NaN;
}
String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
$(document).ready(function() {
    Header.initialize();
});
Header = {
    initialize: function() {
        Header.trigger();
        $(window).on("resize", function() {
            Header.dimensions();
        });
        $(window).on("scroll", function() {
            Header.logoSize();
        });
        $(window).trigger('resize scroll');
    },
    enableContrastCheck: function() {
        BackgroundCheck.init({
            targets: 'header#site-header h1#brand, header#site-header a#trigger-nav',
            images: ".bg-check"
        });
    },
    refreshContrastCheck: function() {
        $("header#site-header h1#brand, header#site-header a#trigger-nav").removeClass('background--light background--dark background--complex');
        Header.enableContrastCheck();
    },
    dimensions: function() {
        $("nav#site-nav").css('top', ($(window).height() + 250) * -1);
    },
    logoSize: function() {
        var $logo = $("h1#brand"),
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > $(window).height() / 1.5) {
            $logo.addClass('compact');
        } else {
            $logo.removeClass('compact');
        }
    },
    trigger: function() {
        $("a#trigger-nav").on('click', function(event) {
            var callback = $(this).data('callback');
            if (callback) {
                var method = eval(callback);
                method.call(this);
            } else {
                $("nav#site-nav").toggleClass('visible');
                $("body").toggleClass('nav-open');
                $(this).toggleClass('active');
            }
            return false;
        });
    },
    changeTriggerBehavior: function(func) {
        $("a#trigger-nav").addClass('active').data('callback', func);
    },
    revertTriggerBehavior: function() {
        $("a#trigger-nav").removeClass('active').data('callback', null);
    },
    compact: function() {
        $(window).on('scroll', function(event) {
            var y = window.scrollY;
            if (y > 500) {
                $("header#site-header").addClass('compact');
            } else {
                $("header#site-header").removeClass('compact');
            }
        });
    },
    mobile: function() {}
}
$(document).ready(function() {
    Main.init();
    PageLoader.init();
});
Main = {
    init: function() {
        this.scrollTo();
        this.newsletter();
        this.touchDevices();
    },
    scrollTo: function() {
        $(document).on('click', '[data-scroll-to]', function(event) {
            event.preventDefault();
            $.scrollTo($(this).attr('href'), 550, {
                'axis': 'y',
                'offset': 0
            });
        });
    },
    socketInit: function() {
        var socketConnected = $("body").data("socket-connected");
        if (!socketConnected) {
            socket = io("", {
                'path': '/live/socket.io'
            });
            $("body").data("socket-connected", true);
            socket.on('episode available', function(data) {
                if ($("body").hasClass('home')) {
                    OuisurfLive.displayLiveWidget(data);
                };
            });
            socket.emit('request live');
        };
    },
    newsletter: function() {
        var $form = $("form#newsletter");
        $form.on('submit', function(event) {
            $.blockUI({
                baseZ: 20000,
                message: null
            });
        });
        $form.ajaxChimp({
            url: $form.attr('action'),
            language: 'fr',
            callback: function(response) {
                $.unblockUI();
                $form.find("p#messages").empty().html(response.msg);
                if (response.result == "success") {
                    $form.find('input').attr('disabled', 'disabled');
                } else {
                    $form.find('input').attr('disabled', null);
                }
            }
        });
    },
    touchDevices: function() {
        if ($.fn.isTouch()) {
            $("body").addClass('touch');
        };
    },
    setHeaderFixed: function() {
        $("body").addClass('filled-header');
    },
    unsetHeaderFixed: function() {
        $("body").removeClass('filled-header');
    },
    lazyload: function() {
        Main.bLazy = new Blazy({
            offset: $(window).height() * 1.5,
            success: function(element) {
                var $e = $(element);
                $e.addClass('img-loaded');
                $e.parent().addClass('img-loaded');
            }
        });
    },
    reloadLazyloading: function() {
        Main.bLazy.revalidate();
    }
};
Home = {
    defaults: {
        mouseEvents: true,
        keyboardEvents: true,
        refreshContrast: true,
        isHome: true,
        startAt: 0
    },
    initialize: function(options) {
        var settings = $.extend({}, Home.defaults, options);
        if (settings.isHome) {
            $("body").addClass('home');
        };
        $(window).on("resize", function() {
            Home.setCarouselDimensions();
        });
        $(window).trigger('resize');
        Home.slickCarousel = $('#episodes-carousel');
        Home.episodeNavigator();
        Home.episodesCarousel(settings);
        if (settings.mouseEvents && !$.fn.isTouch()) {
            Home.mouseEvents();
        };
        if ($.fn.isMobile()) {
            Home.touchDevice();
        };
        if (settings.keyboardEvents) {
            Home.keyboardEvents();
        };
        if (settings.refreshContrast) {
            Header.refreshContrastCheck();
        }
    },
    touchDevice: function() {
        $("#episodes-carousel article.episode").each(function() {
            var bg = $(this).data('video-intro-poster');
            $(this).css('background-image', 'url(' + bg + ')');
        });
    },
    homeCarouselObserver: function(next_episode_order, trigger) {
        $(window).on('resize.episode', function(event) {
            $("body").css('paddingBottom', $(window).outerHeight());
        });
        $(window).trigger('resize.episode');
        $(window).on('scroll.episode', (function(event) {
            var $el = $("footer#home-carousel")
            $trigger = trigger, visible = $trigger.is(":in-viewport()"), initialized = $el.data("initialized"), startAt = next_episode_order;
            if (visible && !initialized) {
                $el.removeClass('hide');
                $el.data("initialized", true);
                Home.initialize({
                    mouseEvents: false,
                    keyboardEvents: false,
                    refreshContrast: false,
                    isHome: false,
                    startAt: startAt
                });
            } else if (!visible && initialized) {
                $el.addClass('hide');
                $el.data("initialized", false);
                Home.destroy();
            }
        }));
    },
    destroy: function() {
        Home.slickCarousel.unslick();
        Home.removeOtherVideos();
        $(document).off('keydown.home');
        clearTimeout($('div#video-backgrounds').data('videoInitTimeout'));
        var $lines = $('.progress-line');
        TweenMax.killAll(null, $lines);
        $lines.remove();
        $('#episodes-carousel').off('mousewheel.carousel');
    },
    setCarouselDimensions: function() {
        var wh = $(window).height(),
            ww = $(window).width();
        $('#episodes-carousel').add("#episodes-carousel article.episode").height(wh);
    },
    episodesCarousel: function(settings) {
        Home.slickCarousel.slick({
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 3,
            slide: "article.episode",
            focusOnSelect: false,
            arrows: true,
            infinite: true,
            speed: 350,
            cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
            onAfterChange: function(event, index) {
                Home.initEpisodeBackground(index);
            },
            responsive: [{
                breakpoint: 1024,
                settings: {
                    arrows: true,
                    centerMode: true,
                    centerPadding: '0',
                    slidesToShow: 1
                }
            }, {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '0',
                    slidesToShow: 1
                }
            }, {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '0',
                    slidesToShow: 1
                }
            }]
        });
        Home.slickCarousel.slickGoTo(settings.startAt);
    },
    mouseEvents: function() {
        $(document).on('click', '#episodes-carousel article.episode.slick-active.slick-center', function(event) {
            event.preventDefault();
            var $a = $(this).find("a.btn-square").not(".disabled");
            if ($a.get(0)) {
                PageLoader.pushState($a.attr('href'));
            };
        });
        $('#episodes-carousel').on('mousewheel.carousel', {
            mousewheel: {
                debounce: {
                    leading: true,
                    trailing: false,
                    maxDelay: 2500
                }
            }
        }, function(event) {
            var $this = $(this),
                slide = null;
            current = Home.slickCarousel.slickCurrentSlide(), deltaFactor = event.deltaFactor, direction = event.deltaY > 0 ? 'next' : 'prev', increment = deltaFactor > 1 ? 50 : 1;
            if (direction == 'next') {
                slide = current + 1;
                $this.stop().animate({
                    'margin-left': "-=" + increment
                }, 150);
            } else {
                slide = current - 1;
                $this.stop().animate({
                    'margin-left': "+=" + increment
                }, 150);
            }
            if ($this.data('scrollTimeout')) {
                clearTimeout($this.data('scrollTimeout'));
            }
            $this.data('scrollTimeout', setTimeout(function() {
                $this.animate({
                    'margin-left': -275,
                    'margin-right': -275
                }, 150);
                if (direction == 'next') {
                    Home.slickCarousel.slickNext();
                } else {
                    Home.slickCarousel.slickPrev();
                }
            }, 250));
        });
    },
    keyboardEvents: function() {
        $(document).on('keydown.home', function(e) {
            e = e || window.event;
            if (e.keyCode == 36) {
                Home.slickCarousel.slickGoTo(0);
            }
            if (e.keyCode == 13) {
                $("#episodes-carousel article.episode.slick-active.slick-center").trigger('click');
            }
            if (e.keyCode == 37 || e.keyCode == 33) {
                Home.slickCarousel.slickPrev();
            }
            if (e.keyCode == 39 || e.keyCode == 34) {
                Home.slickCarousel.slickNext();
            }
        });
    },
    initEpisodeBackground: function(index) {
        var $el = $('#episodes-carousel article.episode.slick-center.slick-active'),
            mp4 = $el.data('video-intro-mp4') ? $el.data('video-intro-mp4') : null,
            webm = $el.data('video-intro-webm') ? $el.data('video-intro-webm') : null,
            poster = $el.data('video-intro-poster') ? $el.data('video-intro-poster') : null,
            $videoBg = $("<div/>").addClass('video-bg'),
            $target = $('div#video-backgrounds'),
            timeout = Modernizr.touch ? 250 : 750;
        Home.activateEpisodeNavigator(null, index);
        if ($target.data('videoInitTimeout')) {
            clearTimeout($target.data('videoInitTimeout'));
        }
        $target.data('videoInitTimeout', setTimeout(function() {
            var src = {};
            if (mp4 || webm && !Modernizr.touch) {
                $videoBg.prependTo($target).addClass('.video-bg');
                var isPoster = false;
                if (mp4) {
                    src.mp4 = mp4
                };
                if (webm) {
                    src.webm = webm
                };
                $videoBg.vide(src, {
                    posterType: "none",
                    muted: true,
                    loop: false
                }).fadeIn(500, function() {
                    Home.removeOtherVideos($videoBg)
                });
                Home.videoObserver($videoBg);
            } else if (!Modernizr.touch) {
                Home.removeOtherVideos();
                Home.videoProgressBar(null);
            }
            if (Modernizr.touch && poster) {
                src.poster = poster;
                $videoBg.vide(src, {
                    muted: true,
                    loop: false
                }).fadeIn(500, function() {
                    Home.removeOtherVideos($videoBg)
                });
                Home.videoProgressBar(null);
            } else if (Modernizr.touch && !poster) {
                Home.videoProgressBar(null);
            }
        }, timeout));
    },
    removeOtherVideos: function(current) {
        current = current != undefined ? current : "";
        $(".video-bg").not(current).fadeOut(250, function() {
            var $video = $(this);
            $video.remove();
        });
    },
    videoObserver: function($videoBg) {
        var $video = $videoBg.find('video');
        Home.removeProgressBar();
        $video.on('canplay', function() {
            Home.videoProgressBar(this);
            $video.addClass('visible');
        });
    },
    videoProgressBar: function(video) {
        var $progress = $("#progress-bar"),
            $line = $("<span/>").addClass('progress-line');
        if (!video) {
            Home.removeProgressBar();
        };
        $line.appendTo($progress);
        if (video) {
            TweenMax.to($line, video.duration - 3.5, {
                "width": "100%",
                ease: Linear.easeNone,
                onComplete: function() {
<<<<<<< Updated upstream
        //            Home.slickCarousel.slickNext()
=======
<<<<<<< HEAD
<<<<<<< HEAD
                    Home.slickCarousel.slickNext()
=======
        //            Home.slickCarousel.slickNext()
>>>>>>> origin/master
=======
        //            Home.slickCarousel.slickNext()
>>>>>>> origin/master
>>>>>>> Stashed changes
                }
            });
        } else {
            TweenMax.to($line, 10, {
                "width": "100%",
                ease: Linear.easeNone,
                onComplete: function() {
<<<<<<< Updated upstream
         //           Home.slickCarousel.slickNext()
=======
<<<<<<< HEAD
<<<<<<< HEAD
                    Home.slickCarousel.slickNext()
=======
         //           Home.slickCarousel.slickNext()
>>>>>>> origin/master
=======
         //           Home.slickCarousel.slickNext()
>>>>>>> origin/master
>>>>>>> Stashed changes
                }
            });
        }
    },
    removeProgressBar: function() {
        var $progress = $("#progress-bar"),
            $others = $progress.find('.progress-line');
        TweenMax.killTweensOf($others);
        $others.remove();
    },
    episodeNavigator: function() {
        $("nav#episodes-navigator ul li a").on('click', function(event) {
            var index = $(this).parent().index();
            Home.slickCarousel.slickGoTo(index);
            Home.activateEpisodeNavigator(this);
            event.preventDefault();
        });
    },
    activateEpisodeNavigator: function(el, index) {
        if (el != undefined) {
            var $el = $(el);
        };
        if (index !== undefined) {
            var $parent = $($("nav#episodes-navigator ul li").get(index)),
                $el = $parent.find('a');
        };
        $el.addClass('active');
        $("nav#episodes-navigator ul li a").not($el).removeClass('active');
    },
    leave: function() {
        OuisurfLive.displayLiveWidget(false);
        setTimeout(function() {
            Home.destroy();
            $("body").removeClass('home');
        }, 350);
    }
}
Preface = {
    init: function() {
        $("body").addClass('preface');
        Preface.intro();
        Preface.misc();
        if (!$.fn.isTouch()) {
            Preface.scrollEffects();
        }
        if ($.fn.isTouch()) {
            Preface.mobile();
        };
        Header.refreshContrastCheck();
        $('html, body').animate({
            scrollTop: 0
        }, 250);
        $('img[usemap]').rwdImageMaps();
        Home.homeCarouselObserver(1, $("footer#site-footer .shim"));
    },
    intro: function() {
        $("#preface-intro").vide("/static/videos/teaser", {
            loop: true
        });
        $("section#preface .vide-wrapper").videoAutoMuted();
    },
    scrollEffects: function() {
        var sceneController = new ScrollMagic();
        new ScrollScene({
            triggerElement: "#preface-intro nav.play-intro",
            duration: $(window).height() + ($(window).height() / 2),
            offset: $("#preface-intro nav.play-intro").outerHeight() + 50
        }).addTo(sceneController).setTween(new TimelineMax().add([TweenMax.to("#preface-intro .vide-wrapper", 5, {
            top: $(window).height() + "px",
            ease: Linear.easeNone
        }), TweenMax.to("#preface-intro nav.play-intro, #preface-intro a.btn-scroll-down", 2, {
            opacity: 0,
            ease: Linear.easeNone
        })]));
        new ScrollScene({
            triggerElement: "#pourquoi-afrique",
            offset: ($(window).height() / 2.5) * -1,
            duration: $(window).height()
        }).addTo(sceneController).setTween(TweenMax.to($("#pourquoi-afrique header.faded"), 5, {
            "opacity": 1,
            "paddingTop": 110,
            ease: Linear.easeNone
        }));
        new ScrollScene({
            triggerElement: "#about-gars-horizontal",
            offset: ($(window).height() / 2.5) * -1,
            duration: $(window).height() / 1.5
        }).addTo(sceneController).setTween(new TimelineMax().add([TweenMax.to("#about-gars-horizontal img.pull-left", 5, {
            "marginLeft": 0,
            ease: Linear.easeNone
        }), TweenMax.to("#about-gars-horizontal img.pull-right", 5, {
            "marginRight": 0,
            ease: Linear.easeNone
        })]));
        var $experience = $("#about-experience"),
            $bgExperience = $("#about-experience .bg");
        new ScrollScene({
            triggerElement: $experience,
            duration: $experience.height() * 1.5
        }).addTo(sceneController).setTween(new TimelineMax().add([TweenMax.to($bgExperience, 1, {
            marginTop: (($bgExperience.height() / 2.5) * -1) + "px",
            ease: Linear.easeNone
        })]));
    },
    misc: function() {
        $("[data-fullpage-element]").fullpageElements();
        $("aside.nouveau h4").lettering('letters');
    },
    mobile: function() {
        $("article.country").on('touchend', function(event) {
            $(this).addClass('hover').siblings().removeClass('hover');
        });
        $("section#preface .faded").addClass('touch-device-fix').removeClass('faded');
    },
    leave: function() {
        $("body").css('paddingBottom', 0);
        $("body").removeClass('preface');
    }
}
EpisodesList = {
    init: function() {
        $("body").addClass('filled-header episodes-list');
        $("header#site-header nav#schedule-evasion").fadeIn();
        Header.refreshContrastCheck();
        EpisodesList.hover();
    },
    hover: function() {
        $("section#episodes-list article.episode-square .ion-plus").on('click', function(event) {
            var $parent = $(this).parent().parent().parent();
            if (!$parent.hasClass('active')) {
                $parent.addClass('active').siblings().removeClass('active');
            } else {
                $parent.removeClass('active');
            }
        });
    },
    leave: function() {
        $("body").removeClass('filled-header episodes-list');
        $("header#site-header nav#schedule-evasion").fadeOut();
    }
}
EpisodeDetails = {
    initialize: function(options) {
        EpisodeDetails.sceneController = new ScrollMagic();
        EpisodeDetails.header();
        EpisodeDetails.styles();
        EpisodeDetails.contentControl();
        EpisodeDetails.albums();
        EpisodeDetails.videosPano();
        Home.homeCarouselObserver(options.next_episode_order, $("footer#episode-footer .shim"));
        if (!$.fn.isMobile() && !$.fn.isTablet()) {
            EpisodeDetails.map(options.lat, options.lng);
        } else if ($.fn.isTablet()) {
            EpisodeDetails.mapTablet(options.lat, options.lng);
        } else if ($.fn.isMobile()) {
            EpisodeDetails.mapMobile(options.lat, options.lng);
        }
        var dateString = $('section#episode-details h4#countdown').data("countdown-date");
        var date = moment(dateString).utc()._d;
        $('section#episode-details h4#countdown').countdown(new Date(date), function(event) {
            format = OuisurfLive.dateFormating(date);
            $(this).text(event.strftime(format));
        });
        $("[data-fullpage-element]").fullpageElements();
        $("section#episode-details article.video, #episode-header").videoAutoMuted();
        Header.refreshContrastCheck();
        if ($.fn.isMobile()) {
            EpisodeDetails.mobile();
        };
        if ($.fn.isTouch()) {
            EpisodeDetails.touch();
        };
        $('html, body').animate({
            scrollTop: 0
        }, 250);
        $("window").trigger('resize');
    },
    header: function() {
        var $header = $("#episode-header"),
            mp4 = $header.data('video-intro-mp4'),
            webm = $header.data('video-intro-webm'),
            poster = $header.data('video-intro-poster'),
            src = {};
        if (mp4) {
            src.mp4 = mp4
        };
        if (webm) {
            src.webm = webm
        };
        if (poster) {
            src.poster = poster
        };
        $header.vide(src, {
            muted: true,
            loop: true,
            autoplay: true
        });
        var $video = $header.find('video');
        $video.on('canplay', function() {
            $header.addClass('visible');
        });
        if (!$.fn.isTouch() || !$.fn.isMobile()) {
            new ScrollScene({
                triggerElement: "#episode-header a.btn-scroll-down",
                duration: $(window).height() + ($(window).height() / 2)
            }).addTo(EpisodeDetails.sceneController).setTween(new TimelineMax().add([TweenMax.to("#episode-header .vide-wrapper", 2, {
                top: $(window).height() * 1.25 + "px",
                ease: Linear.easeNone
            }), TweenMax.to("#episode-header .container", 1, {
                opacity: 0,
                ease: Linear.easeNone
            }), TweenMax.to("#episode-header aside", 1, {
                "top": "-150px",
                opacity: 0,
                ease: Linear.easeNone
            })]));
        };
        setTimeout(function() {
            $(window).trigger('scroll');
        }, 500);
    },
    albums: function() {
        $("article.album").each(function() {
            $(this).find('figure.fill').imagefill();
        });
    },
    styles: function() {
        $("[data-bg-color]").each(function() {
            var bgColor = $(this).data("bg-color");
            $(this).css("backgroundColor", bgColor);
        });
        if (!$.fn.isMobile()) {
            $("[data-overide-height]").each(function() {
                var height = $(this).data("overide-height");
                $(this).css("height", height);
            });
        };
    },
    contentControl: function() {
        if (!$.fn.isTouch()) {
            $("[data-parallax-bg]").each(function() {
                var height = $(this).height(),
                    $bg = $(this).find('.bg');
                new ScrollScene({
                    triggerElement: this,
                    duration: height * 2
                }).addTo(EpisodeDetails.sceneController).setTween(new TimelineMax().add([TweenMax.to($bg, 1, {
                    marginTop: (($bg.height() / 2.5) * -1) + "px",
                    ease: Linear.easeNone
                })]));
            });
            $("[data-parallax-text]").each(function() {
                var height = $(this).height(),
                    $content = $(this).find('.vertical-centered');
                $content.css('marginTop', "+=100");
                new ScrollScene({
                    triggerElement: this,
                    duration: height * 2
                }).addTo(EpisodeDetails.sceneController).setTween(new TimelineMax().add([TweenMax.to($content, 1, {
                    marginTop: ((height / 1.15) * -1) + "px",
                    ease: Linear.easeNone
                })]));
            });
        }
        $("article.episode-detail.video").each(function(i, element) {
            var mp4 = $(this).data('video-intro-mp4'),
                webm = $(this).data('video-intro-webm'),
                poster = $(this).data('video-intro-poster'),
                src = {},
                id = $(this).attr('id'),
                trigger = $(this).prev('.trigger-line'),
                $body = $(this).find(".body"),
                $footer = $(this).find('footer.infos'),
                pinToScene = $(this).data("pin-to-scene"),
                pinDuration = $(this).data("pin-duration");
            if (mp4) {
                src.mp4 = mp4
            };
            if (webm) {
                src.webm = webm
            };
            if (poster) {
                src.poster = poster
            };
            $(this).vide(src, {
                muted: true,
                loop: true,
                autoplay: false
            });
            if (pinToScene == "True" && !$.fn.isTouch()) {
                new ScrollScene({
                    triggerElement: trigger,
                    duration: $(window).height() * 2,
                    offset: $(window).height() / 2
                }).setPin(this).addTo(EpisodeDetails.sceneController);
                new ScrollScene({
                    triggerElement: trigger,
                    duration: 500,
                    offset: $(window).height() / 2
                }).addTo(EpisodeDetails.sceneController).setTween(new TimelineMax().add([TweenMax.to($body, 5, {
                    opacity: 1,
                    "marginTop": 0,
                    ease: Linear.easeNone
                }), TweenMax.to($footer, 2.5, {
                    opacity: 1,
                    ease: Linear.easeNone
                })]));
                new ScrollScene({
                    triggerElement: trigger,
                    duration: 500,
                    offset: $(window).height() * 2
                }).addTo(EpisodeDetails.sceneController).setTween(new TimelineMax().add([TweenMax.to($body, 5, {
                    opacity: 0,
                    "marginTop": -250,
                    ease: Linear.easeNone
                })]));
            };
            if ($.fn.isTouch()) {
                $(this).addClass('touch');
            };
        });
    },
    videosPano: function() {
        $("article.episode-detail.video-360").each(function(i, element) {
            var $btn = $(this).find("a.btn-play, a.btn-square"),
                code = $(this).find('.embed-code').data('embed'),
                w = $(this).width(),
                h = $(this).height(),
                d = "&width=" + w + "&height=" + h;
            $btn.on('click', function(event) {
                event.preventDefault();
                var $embed = $("<div/>").addClass('embed').height(h).html(code);
                var $close = $("<a/>").addClass('btn-close').html("<i class='ion-ios7-close-empty'></i>").appendTo($embed);
                $close.on('click', function(event) {
                    $embed.remove();
                });
                var $iframe = $embed.find('iframe'),
                    newSrc = $iframe.attr('src') + d;
                $iframe.attr('width', w).attr('height', h).attr('src', newSrc);
                $embed.appendTo(element);
            });
        });
    },
    map: function(lat, lng) {
        $("article.episode-detail.map").each(function(i, element) {
            var $el = $(this),
                trigger = $el.prev('.trigger-line'),
                $locations = $el.find("ul.all-locations li"),
                $map = $el.find(".gmap"),
                position = i;
            $locations.on('click', function(event) {
                var index = $(this).index(),
                    top = (trigger.offset().top + $(window).height() * index) + 25;
                $.scrollTo(top, 150, {
                    'axis': 'y'
                });
            });
            var map = EpisodeDetails.createGmap($map.get(0), lat, lng);
            new ScrollScene({
                triggerElement: trigger,
                duration: $(window).height() * $locations.length,
                offset: $(window).height() / 2
            }).setClassToggle($el, "pinned").setPin($el).addTo(EpisodeDetails.sceneController);
            $locations.each(function(i, element) {
                var offset = $(window).height() * i,
                    $location = $(this),
                    location_lat = $location.data('lat'),
                    location_lng = $location.data('lng'),
                    $descriptionContainer = $("#location-description");
                var marker = EpisodeDetails.createMarker(location_lat, location_lng, map, false);
                var locationScene = new ScrollScene({
                    triggerElement: trigger,
                    duration: $(window).height(),
                    offset: offset
                }).setClassToggle($location, "active").on("enter", function(event) {
                    map.panTo(new google.maps.LatLng(location_lat, location_lng));
                    marker.setVisible(true);
                    google.maps.event.trigger(map, 'resize');
                    var contentHTML = $location.find(".details").html();
                    $descriptionContainer.empty().html(contentHTML);
                }).on("leave", function(event) {
                    marker.setVisible(false);
                }).addTo(EpisodeDetails.sceneController);
            });
            $(window).on('scroll.map', function(event) {
                visible = $el.is(":in-viewport()");
                if (visible == true) {
                    $map.removeClass('hide');
                    google.maps.event.trigger(map, 'resize');
                } else {
                    $map.addClass('hide');
                }
            });
            setTimeout(function() {
                $(window).trigger('scroll.map');
            }, 500);
        });
    },
    mapTablet: function(lat, lng) {
        $("article.episode-detail.map").each(function(i, element) {
            var $el = $(this),
                trigger = $el.prev('.trigger-line'),
                $locations = $el.find("ul.all-locations-tablet li"),
                $map = $el.find(".gmap"),
                position = i,
                markers = [];
            var map = EpisodeDetails.createGmap($map.get(0), lat, lng, 12);
            $locations.each(function(i, element) {
                var offset = $(window).height() * i,
                    $location = $(this),
                    location_lat = $location.data('lat'),
                    location_lng = $location.data('lng'),
                    $descriptionContainer = $("#location-description");
                var marker = EpisodeDetails.createMarker(location_lat, location_lng, map);
                markers.push(marker);
                $location.on('click', function(event) {
                    var contentHTML = $location.find(".details").html();
                    $descriptionContainer.empty().html(contentHTML);
                    map.panTo(new google.maps.LatLng(location_lat, location_lng));
                    $.each(markers, function(index, val) {
                        markers[index].setVisible(false);
                    });
                    marker.setVisible(true);
                    $location.addClass('active').siblings().removeClass('active');
                });
                if (i == 0) {
                    $location.trigger('click');
                };
            });
            $(window).on('scroll', function(event) {
                visible = $el.is(":in-viewport()");
                if (visible) {
                    $el.addClass('active');
                } else {
                    $el.removeClass('active');
                }
            });
        });
    },
    mapMobile: function(lat, lng) {
        $("article.episode-detail.map").each(function(i, element) {
            var $el = $(this),
                $target = $el.find("> .inner-relative"),
                $locations = $el.find("ul.all-locations-mobile li"),
                $map = $el.find(".gmap"),
                position = i;
            $locations.each(function(i, element) {
                var $location = $(this),
                    location_lat = $location.data('lat'),
                    location_lng = $location.data('lng');
                var contentHTML = $location.find(".details").html();
                var $container = $("<div/>").addClass('mobile-map-container'),
                    $map = $("<div/>").addClass('gmap').appendTo($container),
                    $decription = $("<div/>").addClass('description').html(contentHTML).appendTo($container);
                $container.appendTo($target);
                var map = EpisodeDetails.createGmap($map.get(0), location_lat, location_lng, 14);
                var marker = EpisodeDetails.createMarker(location_lat, location_lng, map);
                marker.setVisible(true);
            });
        });
    },
    createGmap: function(el, lat, lng, zoom) {
        var center = new google.maps.LatLng(lat, lng),
            draggable = Modernizr.touch ? false : true,
            pan = Modernizr.touch ? true : false,
            zoom = zoom !== undefined ? zoom : 14;
        var mapOptions = {
            center: center,
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            panControl: false,
            scaleControl: true,
            scrollwheel: false,
            zoomControl: true,
            draggable: draggable,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_CENTER
            }
        }
        var map = new google.maps.Map(el, mapOptions);
        return map;
    },
    createMarker: function(lat, lng, map, setVisible) {
        var visible = setVisible == undefined ? false : setVisible;
        var svg = {
            path: "M15,0C6.729,0,0,6.529,0,14.554c0,3.232,2.127,8.502,6.503,16.11c3.095,5.381,6.139,9.868,6.267,10.056L15,44l2.23-3.279 c0.128-0.188,3.172-4.675,6.267-10.056C27.873,23.056,30,17.786,30,14.554C30,6.529,23.271,0,15,0z M15,22 c-4.294,0-7.775-3.378-7.775-7.544S10.706,6.912,15,6.912s7.775,3.378,7.775,7.544S19.294,22,15,22z",
            fillColor: '#FFFFFF',
            fillOpacity: 1,
            anchor: new google.maps.Point(15, 44),
            strokeWeight: 0,
            scale: 1
        };
        var markerLatLng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: markerLatLng,
            icon: svg,
            map: map
        });
        marker.setVisible(visible);
        return marker;
    },
    mobile: function() {
        $("section#episode-details article.episode-detail").each(function() {
            var $inner = $(this).find('.vertical-centered'),
                paddingTop = parseInt($(this).css('paddingTop')),
                paddingBottom = parseInt($(this).css('paddingBottom'));
            if ($inner.get(0)) {
                var height = $inner.outerHeight(true);
                $(this).css('height', height + paddingTop + paddingBottom + 50);
            };
        });
    },
    touch: function() {
        $("section#episode-details #episode-content article.episode-detail.image.hover-effect").on('touchstart', function(event) {
            $(this).toggleClass('hover').siblings().removeClass('hover');
        });
    },
    leave: function() {
        $("body").css('paddingBottom', 0);
        $(window).off('resize.episode');
        $(window).off('scroll.episode');
    }
}
Music = {
    init: function() {
        Music.navigation();
        $("[data-fullpage-element]").fullpageElements();
        Header.refreshContrastCheck();
        setTimeout(function() {
            $("#episodes-playlists article").each(function(index, val) {
                Sharer.initialize($(this), null, $(this).data("url"), $(this).data("title"));
            });
        }, 750);
        var episodeId = $.urlParam('episodeId');
        if (episodeId) {
            setTimeout(function() {
                Music.showPlaylist("#episode-" + episodeId)
            }, 500);
        };
    },
    sharer: function() {},
    navigation: function() {
        var $nav = $("nav#episodes-list"),
            $trigger = $("a#toggle-episodes-menu");
        $trigger.on('click', function(event) {
            event.preventDefault();
            var visible = $nav.hasClass('visible')
            if (!visible) {
                Music.openNav($nav);
            } else {
                Music.closeNav($nav);
            }
        });
        $nav.find("a.back").on('click', function(event) {
            event.preventDefault();
            Music.closeNav();
        });
        $nav.find("ul li a").on('click', function(event) {
            event.preventDefault();
            Music.showPlaylist($(this).attr("href"));
            Music.closeNav();
        });
        document.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                Music.closeNav($nav);
            }
        };
    },
    openNav: function() {
        $("nav#episodes-list").toggleClass('visible');
        Header.changeTriggerBehavior("Music.closeNav");
    },
    closeNav: function() {
        $("nav#episodes-list").removeClass('visible');
        Header.revertTriggerBehavior();
    },
    showPlaylist: function(id) {
        var $el = $("#episodes-playlists").find(id);
        $.scrollTo($el, 250);
    }
}
OuisurfLive = {
    init: function() {
        OuisurfLive.initUI();
        OuisurfLive.instagramPhotos();
    },
    displayLiveWidget: function(live) {
        if (live) {
            $("a#live-show-alert").fadeIn();
        } else {
            $("a#live-show-alert").fadeOut();
        }
    },
    sockectEvents: function() {
        socket.on('disconnect', function(data) {
            $("body").data("socket-connected", false)
        });
        socket.on('connect', function(data) {
            var socketConnected = $("body").data("socket-connected");
            if (!socketConnected) {
                $("body").data("socket-connected", true);
                socket.emit('request welcome');
            };
        });
        socket.on('welcome', function(data) {
            OuisurfLive.checkUI(data);
        });
        socket.on('episode started', function(data) {
            OuisurfLive.checkUI(data);
        });
        socket.on('episode over', function(data) {
            OuisurfLive.checkUI(data);
        });
        socket.on('new event', function(data) {
            OuisurfLive.eventReceived(data, true);
        });
        socket.on('start countdown', function(data) {
            console.log(data);
        });
    },
    initUI: function() {
        if (!$.fn.isMobile()) {
            $("[data-fullpage-element]").fullpageElements();
            $(window).on('scroll', function(event) {
                var eventsVisible = $("#events-list").is(":in-viewport()"),
                    contestVisible = $("#contest-box").is(":in-viewport()");
                if (contestVisible || !eventsVisible) {
                    $("#sidebar-live").removeClass('sticky');
                } else {
                    $("#sidebar-live").addClass('sticky');
                }
            });
            setTimeout(function() {
                $(window).trigger('scroll');
            }, 1000);
        };
    },
    checkUI: function(data) {
        var nextEpisode = data.next_episode != undefined ? data.next_episode.id : null,
            nextEpisodeDatetime = data.next_episode_datetime != undefined ? data.next_episode_datetime : null
        episodePlaying = data.playing_episode.id != undefined ? data.playing_episode.id : null, parsedDate = nextEpisodeDatetime ? moment(nextEpisodeDatetime).utc()._d : null;
        if (episodePlaying) {
            OuisurfLive.live(data);
        } else {
            OuisurfLive.offline(data, parsedDate);
        }
    },
    live: function(data) {
        $("aside.infos .offline").slideUp(250, function() {
            $("aside.infos .live").fadeIn();
        });
        OuisurfLive.createEvents(data, false);
    },
    offline: function(data, parsedDate) {
        console.log('Show is offline: display next show data', data);
        OuisurfLive.startEpisodeCountdown(parsedDate);
        $("aside.infos .live").slideUp(250, function() {
            $("aside.infos .offline").fadeIn();
        });
        OuisurfLive.createEvents(data, true);
    },
    startEpisodeCountdown: function(date) {
        var difference = (date.getTime() - new Date().getTime()),
            then = new Date().getTime() + difference,
            format = OuisurfLive.dateFormating(then);
        if ($('#clock').data('countdown-instance') !== undefined) {
            $('#clock').countdown('remove');
        };
        $('#clock').countdown(new Date(then), function(event) {
            $(this).text(event.strftime(format));
        });
    },
    eventReceived: function(data, autoOpen) {
        var $el = $("[data-event-id='" + data.id + "']"),
            isOnline = $el.hasClass('online');
        if (!isOnline) {
            $el.addClass('online');
            var $play = $("<a/>").addClass("btn-play-small circle-icon").html("<i class='ion-play'></i>").attr("href", "http://vimeo.com/" + data.vimeo_id).attr("target", "_blank").attr("data-vimeo-video", data.vimeo_id).appendTo($el);
            if (autoOpen) {
                $.scrollTo($el, 550, {
                    axis: 'y',
                    offset: -100,
                    onAfter: function() {
                        $play.trigger('click');
                    }
                });
            }
            OuisurfLive.startNextEventCountdown();
        };
    },
    createEvents: function(data, nextEvents) {
        var $container = $("#events-container");
        $("#events-container").empty();
        if (nextEvents) {
            $(data.next_events).each(function(i, element) {
                if (!OuisurfLive.eventExist(this.id)) {
                    var $html = OuisurfLive.createEvent(this, i);
                    $html.find('figure').imagefill();
                    $html.appendTo($container);
                };
            });
        } else {
            $(data.playing_events).each(function(i, element) {
                if (!OuisurfLive.eventExist(this.id)) {
                    var $html = OuisurfLive.createEvent(this, i);
                    $html.find('figure').imagefill();
                    $html.appendTo($container);
                };
            });
            $(data.passed_events).each(function() {
                OuisurfLive.eventReceived(this);
            });
        }
        OuisurfLive.episodeEventsCountdown();
        OuisurfLive.startNextEventCountdown();
    },
    createEvent: function(data, order) {
        var template = $('#template-event').html(),
            templateData = {
                id: data.id,
                order: pad(order + 1, 2),
                title: data.title,
                episode_title: data.episode.title,
                broadcast_datetime: data.broadcast_datetime,
                thumbnail: MEDIA_URL + data.thumbnail
            };
        var rendered = Mustache.render(template, templateData);
        return $("<span />").html(rendered);
    },
    startNextEventCountdown: function() {
        var $el = $("article.event-video").not(".online").filter(":first-child");
        if ($el.get(0)) {
            var datetime = $el.find('h4.countdown').data('broadcast-datetime'),
                parsedDate = new Date(moment(datetime).utc()._d).getTime(),
                difference = parsedDate - new Date().getTime(),
                then = new Date().getTime() + difference;
            if ($('#clock-event').data('countdown-instance') !== undefined) {
                $('#clock-event').countdown('remove');
            };
            var format = OuisurfLive.dateFormating(then)
            $("#clock-event").fadeIn().countdown(then, function(event) {
                $(this).text(event.strftime(format));
            });
        } else {
            $("#clock-event").fadeOut();
        }
    },
    eventExist: function(id) {
        return $("article[data-event-id='" + id + "']").get(0) !== undefined ? true : false;
    },
    episodeEventsCountdown: function() {
        $("[data-event-id]").each(function() {
            var $el = $(this).find("h4.countdown"),
                datetime = $el.data('broadcast-datetime'),
                parsedDate = new Date(moment(datetime).utc()._d).getTime(),
                difference = parsedDate - new Date().getTime(),
                then = new Date().getTime() + difference;
            var format = OuisurfLive.dateFormating(then)
            $el.countdown(then, function(event) {
                $(this).text(event.strftime(format));
            }).on('finish.countdown', function() {
                $el.fadeOut(250);
            });
        });
    },
    dateFormating: function(parsedDate) {
        var now = moment(moment()),
            then = moment(parsedDate),
            daysDifference = then.diff(now, 'days');
        if (daysDifference < 1) {
            format = '%H:%M:%S'
        } else {
            format = '%D jours %H:%M:%S';
        }
        return format;
    },
    instagramPhotos: function() {
        var $container = $("#instagram-photos-container"),
            url = "/instagram/";
        $.getJSON(url, function(response, textStatus) {
            OuisurfLive.placeInstagramPhotos(response, $container);
        });
        loadMore = setInterval(function() {
            var $target = $("#instagram-photos").find('.next-instragram-container:first');
            $.getJSON(url, function(response, textStatus) {
                OuisurfLive.placeInstagramPhotos(response, $target);
            });
        }, 1000 * 60 * 1);
    },
    placeInstagramPhotos: function(response, $target) {
        $(response.data).each(function() {
            var existing = OuisurfLive.instagramPhotoExist(this.id);
            if (!existing) {
                var $article = $("<article />").addClass('col-sm-3 no-padding');
                var $a = $("<a/>").attr('target', "_blank").attr('href', this.link).appendTo($article)
                var $img = $("<img/>").attr('id', this.id).attr('src', this.images.standard_resolution.url).addClass("img-responsive").appendTo($a);
                $article.appendTo($target);
            };
        });
        $("<span/>").addClass("next-instragram-container").insertBefore($target);
    },
    instagramPhotoExist: function(id) {
        return $("img[id='" + id + "']").get(0) !== undefined ? true : false;
    },
    leave: function() {}
}