/**
 *  STORAGE INSTANCE
 *  Implement work with storage of file.
 *  @type {{hasFile, makeFile, removeFile, hasDir, makeDir, removeDir, getSize, cleanStorage}}
 */
var Storage = (function() {
    console.info('INIT STORAGE INSTANCE');

    var fs, _status;

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function(filesystem) {
        fs = filesystem;
        _status = 'Init success.';
    }, function(e) {
        _status = ['Init error. ', JSON.stringify(e)].join();
        console.error(e, 'Error for memory allocation.');
    });

    function getStatus() {
        return {
            status: _status
        }
    }

    /**
     * Checking that file exists.
     * @param pathFile
     * @return {Promise} - [resolve:fileEntry, reject:false]
     */
    function hasFile(pathFile) {
        return new Promise(function(resolve, reject) {
            fs.root.getFile(pathFile, {create: false}, function(fileEntry) {
                if (_.get(fileEntry, 'isFile', false) === true)
                    resolve(fileEntry);
                else
                    reject(false);
            }, function() {
                reject(false);
            });
        });
    }

    /**
     * Make a file.
     * @param path - path to file
     * @param data - data for save
     */
    function makeFile(path, data) {

        var parsepath = path.match(/(.+)\/(.+)/im);
        if (parsepath) {
            var dir = parsepath[1];
        }

        console.warn('Save file to ', path, ' with content ', data);

        return new Promise(function(resolve, reject) {
            hasDir(dir, true)
                .then(function() {
                    fs.root.getFile(path, {create: true}, function(fileEntry) {
                        console.warn('Try save file to:', path);
                        fileEntry.createWriter(function(fileWriter) {

                            fileWriter.onwriteend = function() {
                                console.warn(path, ' - file saved', fileEntry);
                                resolve(fileEntry);
                                return true;
                            };

                            fileWriter.onerror = function(e) {
                                console.warn(path, ' - file save error', e);
                                return false;
                            };

                            var bb = new Blob([data], {type: "octet/stream"});
                            fileWriter.write(bb);

                        }, reject);

                    }, function(e) {
                        reject();
                        console.error(e, 'PutToCache.hasDir');
                    });
                })
                .catch(function(e) {
                    reject();
                    console.warn('some error', e);
                });
        });
    }

    /**
     * Remove file.
     * @param {String} path - Path to file.
     */
    function removeFile(path) {
        console.warn('try remove file:', path);
        return new Promise(function(resolve, reject) {
            fs.root.getFile(path, {create: false},
                function(fileEntry) {
                    fileEntry.remove(
                        function() {
                            resolve(true);
                            console.warn('File removed:', path);
                        },
                        function(e) {
                            reject(false);
                            console.warn('File not remove:', path, e);
                        });
                },
                function(e) {
                    resolve(true);
                    console.warn('File not found:', path, e);
                });
        });
    }

    /**
     * Checking that directory exists.
     * @param dir - path to a directory.
     * @param withCreate
     * @return {Promise} - [resolve:dirEntry, reject:errorObject]
     */
    function hasDir(dir, withCreate) {
        return new Promise(function(resolve, reject) {
            fs.root.getDirectory(dir, {create: false}, function(dirEntry) {
                resolve(dirEntry);
            }, function(e) {
                if (withCreate) {
                    resolve(makeDir(dir));
                } else {
                    reject(e);
                }
            });
        });
    }

    /**
     * Make a directory.
     * @param dir
     * @return {Promise} - [resolve:dirEntry, reject:empty]
     */
    function makeDir(dir) {
        return new Promise(function(resolve, reject) {
            var folders = dir.split('/'),
                index = 0,
                lastEntry;

            function createDir(rootDirEntry) {
                rootDirEntry.getDirectory(folders[index], {create: true},
                    function(dirEntry) {
                        index++;
                        if (index <= folders.length) {
                            lastEntry = dirEntry;
                            createDir(dirEntry);
                        } else {
                            resolve(lastEntry);
                        }
                    },
                    reject
                );
            }

            createDir(fs.root);
        });
    }

    /**
     * Remove a directory.
     * @param dir
     * @return {Promise} - [resolve:empty, reject:errorObject]
     */
    function removeDir(dir) {
        return new Promise(function(resolve, reject) {
            fs.root.getDirectory(dir, {}, function(dirEntry) {
                dirEntry.removeRecursively(function() {
                    resolve(true);
                }, reject);
            }, reject);
        });
    }

    /**
     * Get size of storage.
     * @return {Promise} - [resolve:number, reject:number]. Size in bytes.
     */
    function getSize() {
        return new Promise(function(mainResolve, mainReject) {
            var size = {value: 0},
                handlers = [];

            (function recursiveSelect(nextEntry) {
                var dirReader = nextEntry.createReader();
                dirReader.readEntries(function(entries) {
                    for (var i = 0, entry; entry = entries[i]; ++i) {
                        if (entry.isDirectory) {
                            recursiveSelect(entry);
                        } else {
                            handlers.push(
                                new Promise(function(resolve) {
                                    entry.getMetadata(function(meta) {
                                        size.value = size.value + meta.size;
                                        resolve();
                                    });
                                })
                            );
                        }
                    }
                }, function(e) {
                    console.error(e, 'getSize');
                    mainReject(e);
                });
            })(fs.root);

            setTimeout(function() {
                Promise.all(handlers)
                    .then(function() {
                        mainResolve(size);
                    })
                    .catch(function(e) {
                        size.error = e.toString();
                        mainReject(size);
                    });
            }, 2000);
        });
    };

    /**
     * Clean a storage.
     * @return {Promise} - [resolve:empty, reject:errorObject]
     */
    function cleanStorage() {
        return new Promise(function(resolve, reject) {
            var dirReader = fs.root.createReader();

            dirReader.readEntries(function(entries) {
                for (var i = 0, entry; entry = entries[i]; ++i) {
                    if (entry.isDirectory) {
                        entry.removeRecursively(function() {
                        }, reject);
                    } else {
                        entry.remove(function() {
                        }, reject);
                    }
                }
                resolve();
            }, reject);
        });
    }

    return {
        hasFile: hasFile,
        makeFile: makeFile,
        removeFile: removeFile,

        hasDir: hasDir,
        makeDir: makeDir,
        removeDir: removeDir,

        getSize: getSize,
        getStatus: getStatus,
        cleanStorage: cleanStorage
    }

}());