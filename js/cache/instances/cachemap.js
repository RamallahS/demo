/**
 *  CACHEMAP INSTANCE
 *  @type {{makeKey, getByKey, make, save, getSize, getSizeForSetlist, removeCacheForSetlist}}
 */
var CacheMap = (function() {
    console.info('INIT CACHEMAP INSTANCE');

    const KEY_STORAGE = 'cachemap';

    var _cachemap = {};

    // Load data about setlists.
    chrome.storage.local.get(KEY_STORAGE, function(storage_date) {
        var dataObject = _.get(storage_date, KEY_STORAGE, {});

        if (_.isString(dataObject)) {
            _cachemap = JSON.parse(dataObject);
        } else {
            _cachemap = dataObject;
        }

        console.warn('load cachemap', _cachemap);
    });

    /**
     * Make key.
     * @static
     * @param value
     */
    function makeKey(value) {
        return value.replace(/[^\w]/mg, "_")
    }

    function getByKey(key) {
        return _.get(_cachemap, key, {});
    }

    function make(key, value) {
        console.warn('Make cachemap row:', key, value);
        _.set(_cachemap, key, value);
        return getByKey(key);
    }

    function save() {
        var saveData = {};
        saveData[KEY_STORAGE] = _cachemap;
        chrome.storage.local.set(saveData);
        console.warn('Save to storage', saveData);
        return true;
    }

    /**
     * Clear cachemap.
     */
    function clear() {
        _cachemap = {};
        save();
        return true;
    }

    function getSize() {
        var setlistWithSize = _.filter(_cachemap, 'size');

        var size = 0;
        _.forEach(setlistWithSize, function(val) {
            size += val.size;
        });

        return size;
    }

    function getSizeForSetlist(setlist_id) {
        var setlistWithId = _.filter(_cachemap, function(data) {
            return (_.indexOf(data.setlists, setlist_id) !== -1);
        });

        var size = 0;
        _.forEach(setlistWithId, function(val) {
            size += val.size;
        });

        return size;
    }

    function removeCacheForSetlist(setlist_id) {
        var result = {
            setlist_id: setlist_id,
            files_for_setlist: 0,
            files_in_cache: 0,
            removed: [],
            skipped: []
        };

        _.forEach(_cachemap, function(dataRow, key) {
            if (_.indexOf(dataRow.setlists, setlist_id) !== -1) {
                result.files_for_setlist++;

                // Check a resource if it exists in cache.
                if (_.get(dataRow, 'size', 0) > 0) {
                    result.files_in_cache++;
                }


                // Check a resource if it exist in another setlist
                if (dataRow.setlists.length > 1) {
                    // If resource used in other setlist
                    // Remove current setlist_id from array of setlist_id
                    result.skipped.push(dataRow.path);
                    _.remove(dataRow, function(n) {
                        return n === setlist_id;
                    });
                } else {
                    // if resource is unique for this setlist
                    // 1. delete file from filesystem
                    // 2. delete from Cachemap
                    result.removed.push(dataRow.path);
                    Storage.removeFile(dataRow.path);
                    delete _cachemap[key];
                }

            }
        });

        save();

        return result;

    }

    return {
        makeKey: makeKey,
        getByKey: getByKey,
        make: make,
        save: save,
        clear: clear,
        getSize: getSize,
        getSizeForSetlist: getSizeForSetlist,
        removeCacheForSetlist: removeCacheForSetlist
    };

}());