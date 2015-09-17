/**
 *  SETLIST INSTANCE
 */
var Setlist = (function () {
    console.info('INIT SETLIST INSTANCE');

    const KEY_STORAGE = 'setlist';

    var _setlist = {};

    // Load data about setlists.
    chrome.storage.local.get(KEY_STORAGE, function (storage_date) {
        var dataObject = _.get(storage_date, KEY_STORAGE, {});

        if (_.isString(dataObject)) {
            _setlist = JSON.parse(dataObject);
        } else {
            _setlist = dataObject;
        }
    });

    // Add listener for actualize the setlist object.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && _.has(changes, KEY_STORAGE)) {
        }
    });

    function getSetlistKeys() {
        return _.keys(_setlist);
    }

    function getAssetsForSetlist(setlist_id) {
        return _.get(_setlist, [setlist_id, 'assets'].join('.'), []);
    }

    function getSetlistById(setlist_id) {
        var setlist = _.get(_setlist, setlist_id, false);
        if (!setlist) {
            return [];
        } else {
            return setlist;
        }
    }

    return {
        getSetlistKeys: getSetlistKeys,
        getAssetsForSetlist: getAssetsForSetlist,
        getSetlistById: getSetlistById
    }

}());