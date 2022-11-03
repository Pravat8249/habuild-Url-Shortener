const express = require("express"); //import express
const router = express.Router(); //used express to create route handlers
const urlController = require('../controllers/urlController');

router.post("/url/shorten",urlController.createUrl);

router.get("/:urlCode",urlController.getUrlcode);
router.put("/updateUrl/:urlid",urlController.urlUpdate);
router.delete("/delete/:urlid",urlController.UrlDelete);


module.exports = router;