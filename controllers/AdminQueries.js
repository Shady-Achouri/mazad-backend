const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const {
    MissingParameter,
    UnknownError,
    MalformedObjectId,
    ElementNotFound,
    UnAuthorized,
} = require("../errors/general");
const ENV = require("../static");
const {UserEmailExist} = require("../errors/user");
const jwt = require("jsonwebtoken");

/**
 * function create
 * @param  {String} lastName  lastName of admin
 * @param  {String} firstName  firstName of admin
 * @param  {String} username  phone of admin
 * @param  {String} email  email of admin
 * @param  {String} password  password of admin
 * @param   {String}  image  image of admin
 * @returns {Promise<Object>} return admin created
 */
exports.create = (
    lastName,
    firstName,
    username,
    email,
    password
    // image
) =>
    new Promise(async (resolve, reject) => {
        if (lastName === undefined || lastName.length === 0) {
            return reject(
                new MissingParameter("lastName is a required field", "lastName")
            );
        }
        if (firstName === undefined || firstName.length === 0) {
            return reject(
                new MissingParameter("firstName is a required field", "firstName")
            );
        }
        if (username === undefined || username.length === 0) {
            return reject(
                new MissingParameter("username is a required field", "username")
            );
        }
        if (email === undefined || email.length === 0) {
            return reject(new MissingParameter("email is a required field", "email"));
        }
        if (password === undefined || password.length === 0) {
            return reject(
                new MissingParameter("password is a required field", "password")
            );
        }
        if (email && (await Admin.findOne({email}))) {
            return reject(new UserEmailExist("This email already exists"));
        }
        const admin = new Admin();
        admin.lastName = lastName;
        admin.firstName = firstName;
        admin.username = username;
        admin.email = email;
        admin.password = bcrypt.hashSync(password, ENV.BCRYPT_SALT_ROUND);
        // admin.profilePic = image;
        return admin
            .save()
            .then((s) => {
                const authToken = jwt.sign(
                    {...s.toObject(), password: undefined},
                    ENV.JWT.KEY,
                    {
                        expiresIn: ENV.JWT.EXPIRE_TIME,
                    }
                );
                s.token = authToken;
                s.save();
                resolve(s);
            })
            .catch((e) => reject(new UnknownError(e.message)));
    });

/**
 * function getAdminById
 * @param  {String} id  id of admin to look for
 * @returns {Promise<Object>} return founded admin
 */
exports.getAdminById = (id) =>
    new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reject(new MalformedObjectId("ID invalide!"));
        }
        return (
            Admin.findById(id)
                // .populate("notifications")
                .then((admin) =>
                    admin
                        ? resolve(admin)
                        : reject(
                        new ElementNotFound(
                            "There is no admin registered using the specified id"
                        )
                        )
                )
                .catch((e) => reject(new UnknownError(e.message)))
        );
    });

/**
 * function update
 * @param {ObjectId} id id of the admin to update
 * @param  {String} lastName  lastName of admin to update
 * @param  {String} firstName  firstName of admin to update
 * @param  {String} username  username of admin to update
 * @param  {String} email  email of admin to update
 * @param  {String} password  password of admin to update
 * @returns {Promise<Object>} return updated admin
 */
exports.update = (
    id,
    lastName,
    firstName,
    username,
    email,
    password
    // image
) =>
    new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return reject(new MalformedObjectId("ID invalide!"));
            }
            const admin = await this.getAdminById(id);
            if (
                email &&
                (await Admin.findOne({
                    $and: [{email}, {email: {$ne: admin?.email}}],
                }))
            ) {
                return reject(new UserEmailExist("email already exist"));
            }
            if (
                username &&
                (await Admin.findOne({
                    $and: [{username}, {username: {$ne: admin?.username}}],
                }))
            ) {
                return reject(new UserAttributeExist("username already exist"));
            }
            if (lastName) {
                admin.lastName = lastName;
            }
            if (firstName) {
                admin.firstName = firstName;
            }
            if (username) {
                admin.username = username;
            }
            if (email) {
                admin.email = email;
            }
            if (password) {
                admin.password = bcrypt.hashSync(password, ENV.BCRYPT_SALT_ROUND);
            }
            // if (image) {
            //     admin.profilePic = image;
            // }
            return admin
                .save()
                .then(async (updatedAdmin) => {
                    const admin = await this.getAdminById(updatedAdmin?._id);
                    if (admin) {
                        resolve(admin);
                    }
                    return reject(new ElementNotFound("Admin Not Found"));
                })
                .catch((e) => {
                    reject(new UnknownError(e.message));
                });
        } catch (e) {
            return reject(e);
        }
    });

/**
 * function login
 * @param  {String} email  email of admin to login
 * @param  {String} password  password of admin to login
 * @returns {Promise<Object>} return token of the loggedin admin
 */
exports.login = (email, password) =>
    new Promise((resolve, reject) =>
        Admin.findOne({
            email,
        })
            .exec()
            .then((admin) => {
                if (admin) {
                    if (bcrypt.compareSync(password, admin.password)) {
                        let result = admin.toObject();
                        delete admin.password;
                        // eslint-disable-next-line no-underscore-dangle
                        const token = jwt.sign(
                            admin.toObject(),
                            ENV.JWT.KEY,
                            {
                                expiresIn: ENV.JWT.EXPIRE_TIME,
                            }
                        );
                        return resolve({connected: true, token: token, ...result});
                    }
                    return reject(
                        new UnAuthorized("Wrong username/password  combinations")
                    );
                }
                return reject(new UnAuthorized("Wrong username/password combinations"));
            })
            .catch((e) => reject(new UnknownError(e.message)))
    );

/**
 * function remove
 * @param  {String} _id  id of admin to remove
 * @returns {Object} return Removed admin
 */
exports.remove = (_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const admin = await this.getAdminById(_id);

            if (admin.deleted) {
                admin.delete();
                return resolve(admin);
            }
            admin.deleted = true;
            return admin
                .save()
                .then(() => resolve("Admin removed with success"))
                .catch((e) => reject(new UnknownError(e.message)));
        } catch (e) {
            return reject(e);
        }
    });

/**
 * function restore
 * @param  {ObjectId} id  id of admin to restore
 * @returns {String} return Success message of restored admin
 */
exports.restore = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const admin = await this.getAdminById(id);
            if (admin.deleted) {
                admin.deleted = false;
                return admin
                    .save()
                    .then(() => resolve("Admin restored with success"))
                    .catch((e) => reject(new UnknownError(e.message)));
            }
            return resolve(admin);
        } catch (e) {
            return reject(e);
        }
    });

/**
 * function getPage
 * @param  {String} filter  filter some admins
 * @param  {String} page  number of page of admins
 * @param  {String} count  number of count of admins
 * @returns {Array} return list of admins
 */
exports.getPage = (filter, page, count) =>
    new Promise((resolve, reject) => {
        if (page !== undefined && count !== undefined) {
            const pageNumber = page > 0 ? parseInt(page, 10) - 1 : 0;
            const countNumber = count ? parseInt(count, 10) : 10;
            return Admin.find(filter)
                .skip(pageNumber * countNumber)
                .limit(countNumber)
                .sort("-updated_at")
                .then((admin) => resolve(admin))
                .catch((error) => reject(new UnknownError(error.message)));
        } else {
            return Admin.find(filter)
                .sort("-updated_at")
                .then((admin) => {
                    resolve(admin);
                })
                .catch((error) => reject(new UnknownError(error.message)));
        }
    });
