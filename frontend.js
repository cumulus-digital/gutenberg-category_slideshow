(function ($, plugin_vars, window, undefined) {
	if ( ! plugin_vars) {
		return;
    }
    
    function loadMedia(cat, callback) {
        if ( ! cat) {
            return;
        }
        console.log(cat);
        $.ajax({
            url: plugin_vars.ajaxUrl,
            data: {
                'action': 'get_media_by_category',
                'category': cat,
            },
            type: 'POST',
            dataType: 'jsonp'
        }).done(callback);
    }

    function initSlideshow() {
        var $this = $(this);
        $this.empty();
        
        var cat = $this.attr('data-category');

        if ( ! cat) {
            return;
        }

        var timeout = $this.attr('data-timeout');
        if ( ! timeout) {
            timeout = 2;
        }
        timeout = timeout * 1000;

        clearTimeout($this.data('timer'));
        $this.data('timer', null);
        
        if ($this.data('loading')) {
            $this.data('loading').abort();
        }

        $this.data('loading', 
            $.ajax({
                url: plugin_vars.ajaxUrl,
                data: {
                    'action': 'get_media_by_category',
                    'category': cat,
                },
                type: 'POST',
                dataType: 'jsonp'
            }).done(function(data) {
                var images = [];
                data.forEach(function(img, i) {
                    if (img.hasOwnProperty('guid')) {
                        var url = (new URL(img.guid)).pathname;
                        images.push(
                            $('<img/>', { src: url, class: i < 1 ? 'current' : '' })
                        );
                    }
                })
                var container = $('<div/>');
                container.append(images);
                $this.html(container);
                $this.data('timer', setTimeout(nextImage, timeout));
            })
        );

        function nextImage() {
            clearTimeout($this.data('timer'));
            var $current = $this.find('.current');
            var $next = $current.next('img');
            if ( ! $next.size()) {
                $next = $current.siblings('img').eq(0);
            }
            $current.removeClass('current');
            $next.addClass('current');
            $this.data('timer', setTimeout(nextImage, timeout));
        }
    }
    window.gutenberg_category_slideshow.init = initSlideshow;

    $('.wp-block-cumulus-gutenberg-category-slideshow').each(initSlideshow);

})(jQuery, gutenberg_category_slideshow, window.self);
