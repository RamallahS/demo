/**
 *  CACHE FACADE
 */
var Cache = (function() {

    /**
     * @param parameters
     * @return {Resource}
     */
    function getResource(parameters) {
        return new Resource(parameters);
    }

    return {
        getResource: getResource
    };

}());

/**
 * Resource class
 * @constructor
 * @param parameters
 */
var Resource = function(parameters) {

    this.private = {
        _setlist_id: _.get(parameters, 'setlist_id', 'unset'),
        _use_cache: _.get(parameters, 'cache', true)
    };

    this.public = {
        key: null,
        data: {
            url: null,
            path: null,
            size: null,
            content_type: null,
            setlists: []
        }
    };

    switch (_.get(parameters, 'target')) {
        case 'url':
            this.public.data.url = decodeURIComponent(_.get(parameters, 'value'));
            this.public.key = CacheMap.makeKey(this.public.data.url);
            this.prepareResource();
    }

};

Resource.prototype.REPLACE_PATTERNS = {
    'content_type': ['text/html', 'text/css'],
    'patterns': [
        {
            id: 0,
            regular: '/(src|href)="http:\/\/(?!' + cpConfig.get('proxy.host') + ')/g',
            to_replace: function(proxy, resource, setlist) {
                return "$1=\"http://" + proxy + "/cache?setlist=" + setlist + "&resource=http://";
            }
        },
        {
            id: 1,
            regular: /(src|href)="(\.{2})/img,
            to_replace: function(proxy, resource, setlist) {
                resource = _.trimRight(resource, '/') + '/';
                return "$1=\"http://" + proxy + "/cache?setlist=" + setlist + "&resource=" + resource + "/$2";
            }
        },
        {
            id: 2,
            regular: /(src|href)="\/\//g,
            to_replace: function(proxy, resource, setlist) {
                return '$1="http://' + proxy + '/cache?setlist=' + setlist + '&resource=http://';
            }
        },
        {
            id: 3,
            regular: '/src="(?!http|' + cpConfig.get('proxy.host') + ')/g',
            to_replace: function(proxy, resource, setlist) {
                return '$1="http://' + proxy + '/cache?setlist=' + setlist + '&resource=http://' + resource + '/';
            }
        }
    ]
};

Resource.prototype.getFromMapByKey = function() {
    return CacheMap.getByKey(this.public.key);
};

Resource.prototype.getContent = function() {
    var self = this;

    return new Promise(function(resolve, reject) {

        if (self.private._use_cache) {
            // If need to use internal cache.
            Storage.hasFile(self.public.data.path)
                .then(function(fileEntry) {
                    // if FILE was FOUND then need read file and to return file as blob.
                    console.warn('File found', self.public.data.path, fileEntry);
                    self._loadLocalFile(fileEntry)
                        .then(function(blobData) {
                            console.warn('file data', blobData);
                            resolve(blobData);
                        })
                        .catch(function(message) {
                            console.warn('error load file', message);
                            reject(message);
                        });
                })
                .catch(function(e) {
                    // If FILE was NOT FOUND then need download by url and parse it
                    // if contentType was declared as needed.
                    console.warn('File not found', self.public.data.path, e);
                   self.loadRemoteFile(self.public.data.url)
                        .then(function(fileData) {
                            console.warn('file loaded', fileData);
                            resolve(fileData);
                            Storage.makeFile(self.public.data.path, fileData);
                        })
                        .catch(function(e) {
                            console.warn('file not load', e);
                        });
                });
        } else {
            // If not need to use internal cache.
            self.loadRemoteFile(self.public.data.url)
                .then(resolve)
                .catch(reject);
        }

    });
};

Resource.prototype.prepareResource = function() {
    var self = this,
        _mapData = self.getFromMapByKey();

    // Load data about resource from mapCache or create new record.
    if (_.isEmpty(_mapData)) {
        self.public.data = CacheMap.make(self.public.key, self.public.data);
    } else {
        self.public.data = _mapData;
    }

    // Check path to file.
    if (!self.public.data.path) {
        self.public.data.path = self.private._setlist_id + '/' + self.public.key.replace(/\_\_token_Bearer\_\w+/img, "");
    }

    // Check list of setlsit.
    if (self.private._setlist_id !== 'unset' && _.indexOf(self.public.data.setlists, self.private._setlist_id) == -1) {
        self.public.data.setlists.push(self.private._setlist_id);
    }

    console.warn('target cachemap row', self.public.data);
    CacheMap.save();

    return true;
};

Resource.prototype._loadLocalFile = function(fileEntry) {
    return new Promise(function(resolve, reject) {
        fileEntry.file(function(filedata) {
            var reader = new FileReader();

            reader.onloadend = function() {
                console.warn(fileEntry, ' - file loaded');
                var blob = new Blob([this.result]);
                resolve(blob);
            };
            reader.readAsArrayBuffer(filedata);

        }, function(e) {
            reject(['Error file load', e].join(' '));
        });
    });
}

/**
 * Load file from network.
 * @param url
 * @return {Promise}
 */
Resource.prototype.loadRemoteFile = function() {
    var self = this,
        url = this.public.data.url;
    console.warn('Load file from ', url);
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.responseType = 'blob';
        req.open('GET', decodeURIComponent(url));

        req.onload = function() {
            console.warn('File loadeded:', url, this.response);

            var response = this.response;
            var content_type = this.response.type;

            self.public.data.content_type = this.getResponseHeader("Content-Type");
            self.public.data.size = this.response.size;
            CacheMap.save();

            // Check response for some content types.
            if (cpConfig.get('proxy.host') && cpConfig.get('proxy.port') && _.indexOf(self.REPLACE_PATTERNS.content_type, content_type) !== -1) {
                // need parse
                console.warn('not need to parse');
                var proxy = [cpConfig.get('proxy.host'), cpConfig.get('proxy.port')].join(':');
                var resource = self.public.data.url;

                console.warn('!!!!!!!', url);
                var reader = new window.FileReader();

                reader.onloadend = function() {
                    var text = reader.result,
                        replacePatterns = self.REPLACE_PATTERNS.patterns;

                    if (cpConfig.get('proxy.host') && cpConfig.get('proxy.port')) {
                        var proxy = [cpConfig.get('proxy.host'), cpConfig.get('proxy.port')].join(':');
                        for (var i = 0; i < replacePatterns.length; i++) {
                            var regular = new RegExp(replacePatterns[i].regular),
                                to_replace = replacePatterns[i].to_replace(proxy, resource, self.private._setlist_id);
                            text = text.replace(regular, to_replace);
                        }
                    }

                    self.public.data.size = text.length;
                    CacheMap.save();

                    resolve(text);
                };

                reader.readAsText(response);
            } else {
                // not need parse
                console.warn('not need to parse');
                resolve(response);
            }

        };

        req.onerror = function() {
            reject('Error load file');
        };

        req.send();
    });
};