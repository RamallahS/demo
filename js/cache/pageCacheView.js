cpCacheViewService  = function () {

    var _show = false;

    function handlerKeyboard(e) {

        function checkFocus(target) {
            var i, elements = document.querySelectorAll('select[tabindex]');

            if (_.indexOf(elements, document.activeElement) === -1) {
                elements[0].focus();
                return;
            }

            for (i = 0; i < elements.length; i++) {
                if (document.activeElement === elements[i]) {

                    if (elements[i + target]) {
                        elements[i + target].focus();
                    } else {
                        elements[(target > 0) ? 0 : elements.length - 1].focus();
                    }
                    return;
                }
            }
        };

        var handled = false,
            parseKey = function (key) {
                switch (key) {
                    case 37:   // cursor left
                        checkFocus(-1);
                        return true;
                    case 39:   // cursor right
                        checkFocus(+1);
                        return true;
                    default:
                        return false;
                }
            }

        if (event.defaultPrevented) {
            return;
        }

        if (e.key !== undefined) {
            handled = parseKey(e.key);
        } else if (e.which !== undefined) {
            handled = parseKey(e.which);
        } else if (e.keyCode !== undefined) {
            handled = parseKey(e.keyCode);
        }

        if (handled) {
            event.preventDefault();
        }
    }

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    var render = function () {
        if (_show) {
            document.getElementById('render-container').innerHTML = '';
            window.removeEventListener('keydown', handlerKeyboard);
        } else {

            window.addEventListener('keydown', handlerKeyboard, true);

            document.getElementById('render-container').innerHTML = _.templates['cache']['layout-page']({
                allSize: bytesToSize(CacheMap.getSize())
            });

            // Calculate cache size from system
            Storage.getSize()
                .then(function (size) {
                    console.log('Size system cache:', size, bytesToSize(size.value), document.getElementById("systemSize"));
                    document.getElementById("systemSize").innerHTML = bytesToSize(size.value);
                });

            document.getElementById('clean-cache-button').addEventListener('click', function () {
                Storage.cleanStorage();
                CacheMap.clear();
                _show = false;
                render();
            });

            // Handler for change a setlist
            document.querySelector('#setlist').addEventListener('change', function (e) {
                var options = [],
                    value = this.options[this.selectedIndex].value;

                // Create list of resource's assets
                _.forEach(Setlist.getAssetsForSetlist(value), function (asset) {
                    options.push(['<option data-setlist="', value, '"', 'data-key="', CacheMap.makeKey(asset.resource), '" >', asset.name, '</option>'].join(''));
                });
                document.querySelector('#assets').innerHTML = options.join('');

                // Calculate size of setlist
                var setlistSize = bytesToSize(CacheMap.getSizeForSetlist(value));
                document.querySelector('#setlistSize').innerHTML = ['(', setlistSize, ')'].join('');

                // Create the description about the setlist.
                console.info(Setlist.getSetlistById(value));
                document.getElementById('setlist-description').innerHTML = _.templates['cache']['partials-setlist-description'](Setlist.getSetlistById(value));
            });

            document.querySelector('#assets').addEventListener('change', function (e) {
                var cacheMapresourceKey = this.options[this.selectedIndex].dataset.key,
                    cacheMapresourceValue = CacheMap.getByKey(cacheMapresourceKey);

                document.querySelector('#cache-view #description').innerHTML = _.templates['cache']['partials-asset-description']({
                    url: _.get(cacheMapresourceValue, 'url', 'undefined'),
                    path: _.get(cacheMapresourceValue, 'path', 'undefined'),
                    contentType: _.get(cacheMapresourceValue, 'content_type', 'undefined'),
                    size: _.get(cacheMapresourceValue, 'size', 'undefined'),
                    setlists: _.get(cacheMapresourceValue, 'setlists', []).join(', ')
                });
            });

            i18render();

        }
        _show = !_show;
    }

    this.toggleWindow = function () {
        render();
    }

    this.formatDateTime = function (value, parameters) {
        if (!dcodeIO.Long.isLong(value)) {
            var parsetime = dcodeIO.Long.fromValue(value).toString();
            if (parsetime === "0")
                return "ever";

            // convert 2300 to 23:00
            if (_.get(parameters, 'timeOnly') === true) {
                return parseInt(parsetime / 100) + ':' + (parsetime % 100);
            }

            return new Date(parsetime * 1000).toLocaleString();
        } else
            return value;
    }

    this.longToString = function (value) {
        if (!dcodeIO.Long.isLong(value))
            return dcodeIO.Long.fromValue(value).toString();
        else
            return value;
    }

};

cpCacheView = new cpCacheViewService();