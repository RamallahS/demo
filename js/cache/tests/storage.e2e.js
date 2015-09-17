describe('should test the Storage service', function () {

    describe('should check operations with directories', function () {

        it('should extract service', function () {
            browser.executeAsyncScript(function (callback) {
                callback(Storage.getStatus());
            })
                .then(function (status) {
                    expect(status.status).toBe('Init success.');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check size of storage', function () {
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
                    expect(dataSize).toEqual({value: 0});
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should make directory', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.makeDir('testDirrectory')
                    .then(function (fileEntry) {
                        callback(fileEntry.fullPath);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe('/testDirrectory');
                })
                .thenCatch(function (error) {
                    throw new Error(error);
                });
        });

        /**
         * Directory has one level, as example "/directory_name"
         */

        it('should check some directory without create', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('testDirrectory2')
                    .then(callback)
                    .catch(callback)
            })
                .then(function (fileEntry) {
                    expect(fileEntry.name).toBe('NotFoundError');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check directory with create', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('testDirrectory2', true)
                    .then(function (fileEntry) {
                        callback(fileEntry.fullPath);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe('/testDirrectory2');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check exist directory', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('testDirrectory2')
                    .then(function (fileEntry) {
                        callback(fileEntry.fullPath);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe('/testDirrectory2');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should remove empty directory', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.removeDir('testDirrectory2')
                    .then(function (result) {
                        callback(result);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (result) {
                    expect(result).toBe(true);
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        /**
         * Directory has some level, as example "/directory_name/sub_directory_1/sub_directory_2"
         */

        it('should check exist directory with internal level', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('parent/child')
                    .then(function (fileEntry) {
                        callback(fileEntry.name);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry.name).toBe('NotFoundError');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check directory with internal level with create', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('parent/child', true)
                    .then(function (fileEntry) {
                        callback(fileEntry.fullPath);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe('/parent/child');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should remove parent directory which has child directory', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.removeDir('parent')
                    .then(function (result) {
                        callback(result);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (result) {
                    expect(result).toBe(true);
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check directory with internal level with create', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('parent/child')
                    .then(function (fileEntry) {
                        callback(fileEntry.name);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry.name).toBe('NotFoundError');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });

            browser.executeAsyncScript(function (callback) {
                Storage.hasDir('parent')
                    .then(function (fileEntry) {
                        callback(fileEntry.name);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry.name).toBe('NotFoundError');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });

        });

    });

    describe('should check operations with files', function () {

        it('should check exist file', function () {

            browser.executeAsyncScript(function (callback) {
                Storage.hasFile('testfile1')
                    .then(function (fileEntry) {
                        callback(fileEntry);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe(false);
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });

            browser.executeAsyncScript(function (callback) {
                Storage.hasFile('/testdir/testfile1')
                    .then(function (fileEntry) {
                        callback(fileEntry);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe(false);
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });

        });

        it('should create file', function () {

            browser.executeAsyncScript(function (callback) {
                Storage.makeFile('testfile1', 'Some data')
                    .then(function (fileEntry) {
                        fileEntry.getMetadata(function (meta) {
                            callback({
                                size: fileEntry.name,
                                fullPath: fileEntry.fullPath,
                                isFile: fileEntry.isFile,
                                size: meta.size
                            });
                        });
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toEqual({
                        fullPath: '/testfile1',
                        size: 'testfile1',
                        isFile: true,
                        size: 9
                    });
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });

        });

        it('should get size of filesystem after create the file', function () {
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
                    expect(dataSize).toEqual({value: 9});
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should check the file after create', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.hasFile('testfile1')
                    .then(function (fileEntry) {
                        callback(fileEntry.name);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (fileEntry) {
                    expect(fileEntry).toBe('testfile1');
                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

        it('should remove the file', function () {
            browser.executeAsyncScript(function (callback) {
                Storage.removeFile('testfile1')
                    .then(function (result) {
                        callback(result);
                    })
                    .catch(function (error) {
                        callback(error);
                    })
            })
                .then(function (result) {

                    expect(result).toBe(true);

                    // Check exists file after remove
                    browser.executeAsyncScript(function (callback) {
                        Storage.hasFile('testfile1')
                            .then(function (fileEntry) {
                                callback(fileEntry.name);
                            })
                            .catch(function (error) {
                                callback(error);
                            })
                    })
                        .then(function (fileEntry) {
                            expect(fileEntry).toBe(false);
                        })
                        .thenCatch(function (response) {
                            throw new Error(response);
                        });

                })
                .thenCatch(function (response) {
                    throw new Error(response);
                });
        });

    });

});