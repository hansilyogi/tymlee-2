var express = require("express");
var router = express.Router();
var controller = require('./controller');

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/approved", controller.bannerApproved);
router.delete("/:vendorBannerId", controller.removeItem);

module.exports = router;