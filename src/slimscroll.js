var SlimScroll = (function () {
    function $(el) {
        if (!(this instanceof $)) {
            return new $(el)
        }
        if (typeof el === 'string') {
            var r = /<(\w+)><\/\1>$/.exec(el)
            if (r) {
                el = document.createElement(r[1])
            } else {
                el = document.querySelector(el)
            }
        }
        this.el = (el && el.nodeType === 1) ? el : document.documentElement
        return this
    }

    $.prototype = {
        parent: function () {
            return $(this.el.parentNode || this.el.parentElement)
        },
        closest: function (selector) {
            if (!selector) return $(document)
            var parent = this.parent()
            while (parent.el !== $(selector).el) {
                parent = parent.parent()
            }
            return parent
        },
        is: function (obj) {
            if (this.el === obj.el) {
                return true
            }
            return false
        },
        hasClass: function (className) {
            if (this.el.className.indexOf(className) >= 0) {
                return true
            }
            return false
        },
        addClass: function (className) {
            if (!className || typeof className === 'undefined') return
            if (this.hasClass(className)) return
            var cls = this.el.className.split(' ')
            cls.push(className)
            this.el.className = cls.join(' ').trim()
            return this
        },
        css: function (styleObj) {
            if (typeof styleObj === 'string') {
                return this.el.style[styleObj].replace('px', '')
            }
            for (var key in styleObj) {
                if (typeof styleObj[key] === 'number' && parseInt(styleObj[key])) styleObj[key] = parseInt(styleObj[key]) + 'px'
                if (key === 'zIndex') styleObj[key] = parseInt(styleObj[key])
                this.el.style[key] = styleObj[key]
            }
            return this
        },
        show: function () {
            this.el.style.display = 'block'
        },
        hide: function () {
            this.el.style.display = 'none'
        },
        wrap: function (obj) {
            this.parent().el.insertBefore(obj.el, this.el)
            obj.append(this)
            return this
        },
        append: function (obj) {
            this.el.appendChild(obj.el)
            return this
        },
        scrollTop: function (y) {
            if (typeof y !== 'undefined') {
                this.el.scrollTop = parseInt(y)
                return this
            }
            return this.el.scrollTop
        },
        outerHeight: function () {
            return this.el.offsetHeight || this.el.clientHeight
        },
        hover: function (hoverIn, hoverOut) {
            this.bind('mouseenter', hoverIn)
            this.bind('mouseleave', hoverOut)
        },
        bind: function (type, fn, capture) {
            var el = this.el;

            if (window.addEventListener) {
                el.addEventListener(type, fn, capture);

                var ev = document.createEvent('HTMLEvents');
                ev.initEvent(type, capture || false, false);
                // 在元素上存储创建的事件，方便自定义触发
                if (!el['ev' + type]) {
                    el['ev' + type] = ev;
                }

            } else if (window.attachEvent) {
                el.attachEvent('on' + type, fn);
                if (isNaN(el['cu' + type])) {
                    // 自定义属性，触发事件用
                    el['cu' + type] = 0;
                }

                var fnEv = function (event) {
                    if (event.propertyName === 'cu' + type) {
                        fn.call(el);
                    }
                };

                el.attachEvent('onpropertychange', fnEv);

                // 在元素上存储绑定的propertychange事件，方便删除
                if (!el['ev' + type]) {
                    el['ev' + type] = [fnEv];
                } else {
                    el['ev' + type].push(fnEv);
                }
            }

            return this;
        },
        trigger: function (type) {
            var el = this.el;
            if (typeof type === 'string') {
                if (document.dispatchEvent) {
                    if (el['ev' + type]) {
                        el.dispatchEvent(el['ev' + type]);
                    }
                } else if (document.attachEvent) {
                    // 改变对应自定义属性，触发自定义事件
                    el['cu' + type]++;
                }
            }
            return this;
        },
        unbind: function (type, fn, capture) {
            var el = this.el;
            if (window.removeEventListener) {
                el.removeEventListener(type, fn, capture || false);
            } else if (document.attachEvent) {
                el.detachEvent('on' + type, fn);
                var arrEv = el['ev' + type];
                if (arrEv instanceof Array) {
                    for (var i = 0; i < arrEv.length; i += 1) {
                        // 删除该方法名下所有绑定的propertychange事件
                        el.detachEvent('onpropertychange', arrEv[i]);
                    }
                }
            }
            return this;
        }
    }

    $.extend = function (deep) {
        var start = 1
        if (typeof deep === 'object') {
            start = 0
        }
        var objs = Array.prototype.slice.call(arguments, start),
            newObj = {}

        for (var i = 0; i < objs.length; i++) {
            if (typeof objs !== 'object') return
            for (var key in objs[i]) {
                newObj[key] = typeof objs[i][key] === 'object' && deep === true ? $.extend(true, objs[i][key]) : objs[i][key]
            }
        }
        return newObj
    }

    $.isPlainObject = function (obj) {
        return typeof obj === 'object' && !(obj instanceof Array)
    }

    function SlimScroll(el, options) {
        var defaults = {

            // width in pixels of the visible scroll area
            width: 'auto',

            // height in pixels of the visible scroll area
            height: '250px',

            // width in pixels of the scrollbar and rail
            size: '7px',

            // scrollbar color, accepts any hex/color value
            color: '#000',

            // scrollbar position - left/right
            position: 'right',

            // distance in pixels between the side edge and the scrollbar
            distance: '1px',

            // default scroll position on load - top / bottom / $('selector')
            start: 'top',

            // sets scrollbar opacity
            opacity: 0.4,

            // enables always-on mode for the scrollbar
            alwaysVisible: false,

            // check if we should hide the scrollbar when user is hovering over
            disableFadeOut: false,

            // sets visibility of the rail
            railVisible: false,

            // sets rail color
            railColor: '#333',

            // sets rail opacity
            railOpacity: 0.2,

            // whether  we should use jQuery UI Draggable to enable bar dragging
            railDraggable: true,

            // defautlt CSS class of the slimscroll rail
            railClass: 'slimScrollRail',

            // defautlt CSS class of the slimscroll bar
            barClass: 'slimScrollBar',

            // defautlt CSS class of the slimscroll wrapper
            wrapperClass: 'slimScrollDiv',

            // check if mousewheel should scroll the window if we reach top/bottom
            allowPageScroll: false,

            // scroll amount applied to each mouse wheel step
            wheelStep: 20,

            // scroll amount applied when user is using gestures
            touchScrollStep: 200,

            // sets border radius
            borderRadius: '7px',

            // sets border radius of the rail
            railBorderRadius: '7px'
        };



        var o = $.extend(defaults, options)

        // do it for every element that matches selector
        // this.each(function () {

        var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
            barHeight, percentScroll, lastScroll,
            divS = '<div></div>',
            minBarHeight = 30,
            releaseScroll = false;

        // used in event handlers and for better minification
        // var me = $(this);
        var me = $(el);


        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass)) {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.siblings('.' + o.barClass);
            rail = me.siblings('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options)) {
                // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                if ('height' in options && options.height === 'auto') {
                    me.parent().css({ height: 'auto' });
                    me.css({ height: 'auto' });
                    var height = me.parent().parent().outerHeight();
                    me.parent().css({ height: height });
                    me.css({ height: height });
                } else if ('height' in options) {
                    var h = options.height;
                    me.parent().css({ height: h });
                    me.css({ height: h });
                }

                if ('scrollTo' in options) {
                    // jump to a static point
                    offset = parseInt(o.scrollTo);
                }
                else if ('scrollBy' in options) {
                    // jump by value pixels
                    offset += parseInt(o.scrollBy);
                }
                else if ('destroy' in options) {
                    // remove slimscroll elements
                    bar.remove();
                    rail.remove();
                    me.unwrap();
                    return;
                }

                // scroll content by the given offset
                scrollContent(offset, false, true);
            }

            return;
        } else if ($.isPlainObject(options)) {
            if ('destroy' in options) {
                return;
            }
        }

        // optionally set height to the parent's height
        o.height = (o.height === 'auto') ? me.parent().outerHeight() : o.height;

        // wrap content
        var wrapper = $(divS)
            .addClass(o.wrapperClass)
            .css({
                position: 'relative',
                overflow: 'hidden',
                width: o.width,
                height: o.height
            });

        // update style for the div
        me.css({
            overflow: 'hidden',
            width: o.width,
            height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
            .addClass(o.railClass)
            .css({
                width: o.size,
                height: '100%',
                position: 'absolute',
                top: 0,
                display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
                'border-radius': o.railBorderRadius,
                background: o.railColor,
                opacity: o.railOpacity,
                zIndex: 998
            });

        // create scrollbar
        var bar = $(divS)
            .addClass(o.barClass)
            .css({
                background: o.color,
                width: o.size,
                position: 'absolute',
                top: 0,
                opacity: o.opacity,
                display: o.alwaysVisible ? 'block' : 'none',
                'border-radius': o.borderRadius,
                BorderRadius: o.borderRadius,
                MozBorderRadius: o.borderRadius,
                WebkitBorderRadius: o.borderRadius,
                zIndex: 999
            });

        // set position
        var posCss = (o.position === 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);


        //all binding events callback
        var events = {
            touchStart: function (e, b) {
                if (e.originalEvent.touches.length) {
                    // record where touch started
                    touchDif = e.originalEvent.touches[0].pageY;
                }
            },
            touchMove: function (e) {
                // prevent scrolling the page if necessary
                if (!releaseScroll) {
                    e.originalEvent.preventDefault();
                }
                if (e.originalEvent.touches.length) {
                    // see how far user swiped
                    var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
                    // scroll content
                    scrollContent(diff, true);
                    touchDif = e.originalEvent.touches[0].pageY;
                }
            },
            hoverIn: function () {
                isOverPanel = true;
                showBar();
                hideBar();
            },
            hoverOut: function () {
                isOverPanel = false;
                hideBar();
            },
            barHoverIn: function () {
                isOverBar = true;
            },
            barHoverOut: function () {
                isOverBar = false;
            },
            railHoverIn: function () {
                showBar();
            },
            railHoverOut: function () {
                hideBar();
            },
            barMouseDown: function (e) {
                var $doc = $(document);
                var t = parseFloat(bar.css('top'));
                var pageY = e.pageY;
                isDragg = true;

                function mousemove(e) {
                    var currTop = t + e.pageY - pageY;
                    bar.css({ top: currTop });
                    scrollContent(0, currTop, false);// scroll content
                }

                function mouseup(e) {
                    isDragg = false; hideBar();
                    $doc.unbind('mousemove', mousemove);
                    $doc.unbind('mouseup', mouseup);
                }

                $doc.bind('mousemove', mousemove);

                $doc.bind('mouseup', mouseup);
                return false;
            },
            barSelectedStart: function (e) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable) {
            bar.bind('mousedown', events.barMouseDown).bind('selectstart', events.barSelectedStart);
        }

        // on rail over
        rail.hover(events.railHoverIn, events.railHoverOut);

        // on bar over
        bar.hover(events.barHoverIn, events.barHoverOut);

        // show on parent mouseover
        me.hover(events.hoverIn, events.hoverOut);

        // support for mobile
        me.bind('touchstart', events.touchStart);

        me.bind('touchmove', events.touchMove);

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom') {
            // scroll content to bottom
            bar.css({ top: me.outerHeight() - bar.outerHeight() });
            scrollContent(0, true);
        }
        else if (o.start !== 'top') {
            // assume jQuery selector
            scrollContent($(o.start).position().top, null, true);

            // make sure bar stays hidden
            if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel(el);

        function _onWheel(e) {
            // use mouse wheel only when mouse is over
            if (!isOverPanel) { return; }

            e = e || window.event;

            var delta = 0;
            if (e.wheelDelta) { delta = -e.wheelDelta / 120; }
            if (e.detail) { delta = e.detail / 3; }

            var target = e.target || e.srcTarget || e.srcElement;
            if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
                // scroll content
                scrollContent(delta, true);
            }

            // stop window scroll
            if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
            if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump) {
            releaseScroll = false;
            var delta = y;
            var maxTop = me.outerHeight() - bar.outerHeight();

            if (isWheel) {
                // move bar with mouse wheel
                delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

                // move bar, make sure it doesn't go out
                delta = Math.min(Math.max(delta, 0), maxTop);

                // if scrolling down, make sure a fractional change to the
                // scroll position isn't rounded away when the scrollbar's CSS is set
                // this flooring of delta would happened automatically when
                // bar.css is set below, but we floor here for clarity
                delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

                // scroll the scrollbar
                bar.css({ top: delta + 'px' });
            }

            // calculate actual scroll amount
            percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
            // delta = percentScroll * (me[0].scrollHeight - me.outerHeight());
            delta = percentScroll * (me.el.scrollHeight - me.outerHeight());

            if (isJump) {
                delta = y;
                // var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                var offsetTop = delta / me.el.scrollHeight * me.outerHeight();
                offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
                bar.css({ top: offsetTop + 'px' });
            }

            // scroll content
            me.scrollTop(delta);

            // fire scrolling event
            me.trigger('slimscrolling', ~~delta);

            // ensure bar is visible
            showBar();

            // trigger hide when scroll is stopped
            hideBar();
        }

        function attachWheel(target) {
            if (window.addEventListener) {
                target.addEventListener('DOMMouseScroll', _onWheel, false);
                target.addEventListener('mousewheel', _onWheel, false);
            }
            else {
                document.attachEvent('onmousewheel', _onWheel)
            }
        }

        function getBarHeight() {
            // calculate scrollbar height and make sure it is not too small
            barHeight = Math.max((me.outerHeight() / me.el.scrollHeight) * me.outerHeight(), minBarHeight);
            bar.css({ height: barHeight + 'px' });

            // hide scrollbar if content is not long enough
            var display = barHeight == me.outerHeight() ? 'none' : 'block';
            bar.css({ display: display });
        }

        function showBar() {
            // recalculate bar height
            getBarHeight();
            clearTimeout(queueHide);

            // when bar reached top or bottom
            if (percentScroll == ~~percentScroll) {
                //release wheel
                releaseScroll = o.allowPageScroll;

                // publish approporiate event
                if (lastScroll != percentScroll) {
                    var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                    me.trigger('slimscroll', msg);
                }
            }
            else {
                releaseScroll = false;
            }
            lastScroll = percentScroll;

            // show only when required
            if (barHeight >= me.outerHeight()) {
                //allow window scroll
                releaseScroll = true;
                return;
            }
            // bar.stop(true, true).fadeIn('fast');
            bar.show()
            // if (o.railVisible) { rail.stop(true, true).fadeIn('fast'); }
            if (o.railVisible) { rail.show(); }
        }

        function hideBar() {
            // only hide when options allow it
            if (!o.alwaysVisible) {
                queueHide = setTimeout(function () {
                    if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg) {
                        // bar.fadeOut('slow');
                        // rail.fadeOut('slow');
                        bar.hide()
                        rail.hide()
                    }
                }, 1000);
            }
        }

        // });

        function unbind() {
            // make it draggable and no longer dependent on the jqueryUI
            bar.unbind('mousedown', events.barMouseDown).unbind('selectstart', events.barSelectedStart);
            // on rail over
            rail.unbind('mouseenter', events.railHoverIn).unbind('mouseleave', events.railHoverOut);

            // on bar over
            bar.unbind('mouseenter', events.barHoverIn).unbind('mouseleave', events.barHoverOut);

            // show on parent mouseover
            me.unbind('mouseenter', events.hoverIn).unbind('mouseleave', events.hoverOut);

            // support for mobile
            me.unbind('touchstart', events.touchStart);

            me.unbind('touchmove', events.touchMove);
        }
        return {
            
            unbind: function () {


                bar.unbind('mousedown', events.barMouseDown)
                    .unbind('mouseenter', events.barHoverIn)
                    .unbind('mouseleave', events.barHoverOut)
                    .unbind('selectstart', events.barSelectedStart);
                rail.unbind('mouseenter', events.railHoverIn)
                    .unbind('mouseleave', events.railHoverOut);
                bar.unbind('mouseenter', events.barHoverIn)
                    .unbind('mouseleave', events.barHoverOut);
                me.unbind('mouseenter', events.hoverIn)
                    .unbind('mouseleave', events.hoverOut)
                    .unbind('touchstart', events.touchStart)
                    .unbind('touchmove', events.touchMove);
                bar.el.remove();
                rail.el.remove();
                
            },

        }
    }

    return SlimScroll
})()




function unwrap(node) {
    if(node != undefined && node != null)
        node.replaceWith(...node.childNodes);
}

export function slimscroll(node, options) {
    // the node has been mounted in the DOM
    
    let slim  = SlimScroll(node,options)
    return {
        update(options) {
           
            slim.unbind()
            unwrap(node.parentNode);
            slim  = SlimScroll(node,options)
         
        },

        destroy() {
            // the node has been removed from the DOM
            slim.unbind();
            unwrap(node.parentNode);
        }
    };
}

