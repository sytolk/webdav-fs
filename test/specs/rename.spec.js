const path = require("path");
const fileExists = require("exists-file").sync;
const directoryExists = require("directory-exists").sync;

const targetDir = path.resolve(__dirname, "../testContents/base-ü-1/child-ü-1");
const TEST_CONTENTS = path.resolve(__dirname, "../testContents");

describe("rename", function () {
    const makeDir = (client, dir) =>
        new Promise((resolve, reject) => {
            client.mkdir(dir, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

    beforeEach(function () {
        setup.call(this);
        return makeDir(this.client, "/base-ü-1").then(() => makeDir(this.client, "/child-ü-1"));
    });

    afterEach(function () {
        tearDown.call(this);
    });

    it("can rename and move a directory containing special characters", function (done) {
        this.client.rename("/child-ü-1", "/base-ü-1/child-ü-1", function (err) {
            expect(err).to.be.null;
            expect(directoryExists(targetDir)).to.be.true;
            done();
        });
    });

    it("can move a file", function (done) {
        this.client.rename("/fractal.jpg", "/dir1/dir2/fractal.jpg", function (err) {
            expect(err).to.be.null;
            expect(fileExists(path.join(TEST_CONTENTS, "./fractal.jpg"))).to.be.false;
            expect(fileExists(path.join(TEST_CONTENTS, "./dir1/dir2/fractal.jpg"))).to.be.true;
            done();
        });
    });
});
