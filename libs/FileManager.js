const fs = require('fs');
const path = require('path');
const {
    execSync,
} = require('child_process');
const {
    UnknownError,
} = require('../errors/general');
const ENV = require('../static');


exports.createMedia = (fileName, mediaDirectory, content) => new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(ENV.MEDIA.DIRECTORY, mediaDirectory))) {
        execSync(`mkdir "${path.join(ENV.MEDIA.DIRECTORY, mediaDirectory)}"`);
    }
    try {
        fs.writeFileSync(path.join(ENV.MEDIA.DIRECTORY, mediaDirectory, fileName), content);
        return resolve(path.join(mediaDirectory, fileName));
    } catch (e) {
        return reject(new UnknownError(e.message));
    }
});

exports.createMedia64 = (fileName, mediaDirectory, content) => new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(ENV.MEDIA.DIRECTORY, mediaDirectory))) {
        execSync(`mkdir -p "${path.join(ENV.MEDIA.DIRECTORY, mediaDirectory)}"`);
    }
    try {
        // eslint-disable-next-line no-useless-escape
        const matches = content.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        // eslint-disable-next-line no-buffer-constructor
        // const b = new Buffer(matches[2], 'base64');
        // Solution for Deprecated new Buffer 
        const b =  Buffer.from(matches[2], 'base64');
        fs.writeFileSync(path.join(ENV.MEDIA.DIRECTORY, mediaDirectory, fileName), b);
        return resolve(path.join(mediaDirectory, fileName));
    } catch (e) {
        return reject(new UnknownError(e.message));
    }
});
