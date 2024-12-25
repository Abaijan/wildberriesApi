const Router = require('express');
const router = new Router();
const SKUController = require('../controllers/sku.controller')

router.get('/sales/', SKUController.getSales)

module.exports = router;
