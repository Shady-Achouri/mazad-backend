/* eslint-disable max-classes-per-file */
class UnknownRole extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnknownRole';
        this.code = 405;
    }
}
class UserEmailExist extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserEmailExist';
        this.code = 409;
    }
}
class BrandNameExists extends Error {
    constructor(message) {
        super(message);
        this.name = 'BrandNameExists';
        this.code = 409;
    }
}
class UserPhoneExist extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserPhoneExist';
        this.code = 410;
    }
}
class InvalidFile extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidFile';
        this.code = 415;
    }
}
module.exports = {
    UnknownRole,
    UserEmailExist,
    InvalidFile,
    UserPhoneExist,
    BrandNameExists
};
