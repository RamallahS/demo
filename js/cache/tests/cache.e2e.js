describe('should test the Cache service', function () {

    it('should get resource for first setlist', function () {
        browser.executeAsyncScript(function (callback) {
            var resource = Cache.getResource({
                setlist_id: '1234567890',
                target: 'url',
                value: 'http://example.com.github.io/public-pages/testimage.jpg'
            });

            callback({
                "private": resource.private,
                "public": resource.public
            });
        })
            .then(function (response) {
                expect(response.private).toEqual({
                    _setlist_id: '1234567890', _use_cache: true
                });
                expect(response.public).toEqual({
                    data: {
                        path: '1234567890/http___example.com_github_io_public_pages_testimage_jpg',
                        setlists: ['1234567890'],
                        content_type: null,
                        size: null,
                        url: 'http://example.com.github.io/public-pages/testimage.jpg'
                    },
                    key: 'http___example.com_github_io_public_pages_testimage_jpg'
                });
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('should get resource for first setlist', function () {
        browser.executeAsyncScript(function (callback) {
            var resource = Cache.getResource({
                setlist_id: '12345678902',
                target: 'url',
                value: 'http://example.com.github.io/public-pages/testimage.jpg'
            });

            callback({
                "private": resource.private,
                "public": resource.public
            });
        })
            .then(function (response) {
                expect(response.private).toEqual({
                    _setlist_id: '12345678902', _use_cache: true
                });
                expect(response.public).toEqual({
                    data: {
                        path: '1234567890/http___example.com_github_io_public_pages_testimage_jpg',
                        setlists: ['1234567890', '12345678902'],
                        content_type: null,
                        size: null,
                        url: 'http://example.com.github.io/public-pages/testimage.jpg'
                    },
                    key: 'http___example.com_github_io_public_pages_testimage_jpg'
                });
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('should check resource in CahceMap', function () {
        browser.executeAsyncScript(function (callback) {
            var getFromMapByKey = CacheMap.getByKey('http___example.com_github_io_public_pages_testimage_jpg');

            callback(getFromMapByKey);
        })
            .then(function (response) {
                expect(response).toEqual({
                    path: '1234567890/http___example.com_github_io_public_pages_testimage_jpg',
                    setlists: ['1234567890', '12345678902'],
                    content_type: null,
                    size: null,
                    url: 'http://example.com.github.io/public-pages/testimage.jpg'
                });
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('should get content from resource', function () {
        browser.executeAsyncScript(function (callback) {
            var resource = Cache.getResource({
                setlist_id: '1234567890',
                target: 'url',
                value: 'http://example.com.github.io/public-pages/testimage.jpg'
            });

            resource.getContent()
                .then(function (filedata) {
                    callback(filedata);
                })
                .catch(function (message) {
                    callback(message);
                });

        })
            .then(function (response) {
                expect(response).toEqual({
                    size: 10188, type: 'image/jpeg', slice: {}
                });
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('check size of storage after load a file', function () {
        browser.executeAsyncScript(function (callback) {
            Storage.getSize()
                .then(function (size) {
                    callback(size);
                })
                .catch(function (error) {
                    callback(error);
                });
        })
            .then(function (dataSize) {
                expect(dataSize).toEqual({value: 10188});
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

});