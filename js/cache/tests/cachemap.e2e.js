describe('should test the CacheMap service', function () {

    it('should check maker of key', function () {
        browser.executeAsyncScript(function (callback) {
            callback({
                test1: CacheMap.makeKey('...'),
                test2: CacheMap.makeKey('http://example.com'),
                test3: CacheMap.makeKey('http://example.net.com/turbo'),
                test4: CacheMap.makeKey('http://example.net.com/turbo.html'),
                test5: CacheMap.makeKey('http://example.net.com/turbo.html?param1=1')
            })
        }).then(function (response) {
            expect(response).toEqual({
                test1: '___',
                test2: 'http___example_com',
                test3: 'http___example_net_com_turbo',
                test4: 'http___example_net_com_turbo_html',
                test5: 'http___example_net_com_turbo_html_param1_1'
            });
        })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('should check size of cachemap', function () {
        browser.executeAsyncScript(function (callback) {
            callback(CacheMap.getSize())
        })
            .then(function (size) {
                expect(size).toBe(0);
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

    it('should get by a key if map is empty', function () {
        browser.executeAsyncScript(function (callback) {
            callback(CacheMap.getByKey('key'))
        })
            .then(function (response) {
                expect(response).toEqual({});
            })
            .thenCatch(function (response) {
                throw new Error(response);
            });
    });

});