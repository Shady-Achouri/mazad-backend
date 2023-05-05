const express = require("express");
const {
    create,
    update,
    getAdminById,
    remove,
    login,
    getPage,
    restore
} = require("../../controllers/AdminQueries");

const router = express.Router();

//ANCHOR: check the token in all the apis
/**
 * @method  POST
 * @route '/new' - Route for creating new admin
 * @param  {any} req
 * @param  {any} res
 */
//ANCHOR: check for the role of super admin
router.post("/new",
// checkToken,
// CheckFileUpload,
 async (req, res) => {
    const {lastName, firstName, username, email, password,  image} =
        req.body;
    try {
        const admin = await create(
            lastName,
            firstName,
            username,
            email,
            password,
            // picUrl
        );
        return res.status(200).json(admin);
    } catch (e) {
        return res.status(e.code >= 100 || e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  GET
 * @route '/info/:id' - Route for getting an existing admin by id
 * @param  {any} req
 * @param  {any} res
 */
router.get("/info/:id",
// checkToken,
async (req, res) => {
    const {id} = req.params;
    try {
        const admin = await getAdminById(id);

        return res.status(200).json(admin);
    } catch (e) {
        return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  POST
 * @route '/edit/:id' - Route for updating an existing admin by id
 * @middleware  checkToken
 * @param  {any} req
 * @param  {any} res
 */
router.post(
    "/edit/:id",
    // CheckFileUpload,
    // checkToken,
    async (req, res) => {
        try {
            const {
                // obAdmin: {
                    lastName,
                    firstName,
                    username,
                    email,
                    password,
                    // image
                // },
            } = req.body;
            const {id} = req.params;
            // let picUrl;
            // if (req.file) {
            //     //Test if the file type is image using mimetype
            //     if (!req.file.mimetype.startsWith("image")) {
            //         return res.status(400).json({
            //             error: true,
            //             message: "Veuillez uploader une image.",
            //         });
            //     }
            //     const img = `admin-${new Date().getTime()}.${mime.extension(
            //         req.file.mimetype
            //     )}`;
            //     picUrl = await createMedia(img, "admins", req.file.buffer);
            // } else if (image) {
            //     const img = `admin-${new Date().getTime()}.png`;
            //     picUrl = await createMedia64(img, "admins", image);
            // }
            const admin = await update(
                id,
                lastName,
                firstName,
                username,
                email,
                password,
                // picUrl
            );
            return res.status(200).json(admin);
        } catch (e) {
            return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
                error: true,
                message: e.message,
            });
        }
    }
);

/**
 * @method  POST
 * @route '/delete' - Route for deleting an existing admin by id
 * @param  {any} req
 * @param  {any} res
 */
router.post("/delete",
// checkToken,
 async (req, res) => {
    const {id} = req.body;
    try {
        await remove(id);
        return res.status(200).json({
            message: "Admin deleted",
        });
    } catch (e) {
        return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  POST
 * @route '/login' - Route for login a admin by his coords
 * @param  {any} req
 * @param  {any} res
 */
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const admin = await login(email, password);

        return res.status(200).json(admin);
    } catch (e) {
        return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  POST
 * @route '/logout' - Route for logout a admin
 * @middleware  {}  checkToken
 * @param  {any} req
 * @param  {any} res
 */
router.post("/logout",
// checkToken,
async (req, res) => {
    try {
        const {
            // obAdmin: {
                token
            // },
        } = req.body;
        await logout(token);
        return res.status(200).json("Logout success");
    } catch (e) {
        return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  GET
 * @route '/details/:token' - Route for getting an existing admin by token
 * @param  {any} req
 * @param  {any} res
 */
 router.get("/details/:token", async (req, res) => {
    const {token} = req.params;
    try {
        const admin = await getAdminByToken(token);

        return res.status(200).json(admin);
    } catch (e) {
        return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
            error: true,
            message: e.message,
        });
    }
});

/**
 * @method  GET
 * @route '/list' - Route for list  admins by filter / page / count
 * @param  {any} req
 * @param  {any} res
 */
 router.get(
    "/list",
    //  checkToken,
    async (req, res) => {
      try {
        const { page, count } = req.query;
        const admins = await getPage(
          {
            deleted: false,
            role: "admin"
          },
          page,
          count
        );
        return res.status(200).json(admins);
      } catch (e) {
        return res.status(e.code >= 100 && e.code < 600 ? e.code : 500).json({
          error: true,
          message: e.message,
        });
      }
    }
  );

/**
 * @method  GET
 * @route '/archive' - Route for archive  admins by filter / page / count
 * @param  {any} req
 * @param  {any} res
 */
 router.get(
    "/archive",
    //  checkToken,
    async (req, res) => {
      try {
        const { page, count } = req.query;
        const admins = await getPage(
          {
            deleted: true,
            role: "admin"
          },
          page,
          count
        );
        return res.status(200).json(admins);
      } catch (e) {
        return res.status(e.code >= 100 && e.code < 600 ? e.code : 500).json({
          error: true,
          message: e.message,
        });
      }
    }
  );

/**
 * @method  POST
 * @route '/restore' - Route for restore an existing admin by id
 * @param  {any} req
 * @param  {any} res
 */
 router.post("/restore", async (req, res) => {
    const { id } = req.body;
    try {
      const result = await restore(id);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
        error: true,
        message: e.message,
      });
    }
  });
module.exports = router;
