var express = require('express');
var router = express.Router();

var all_info_controller = require('../controllers/all-info');

router.get('/all', all_info_controller.all_entry_list);
module.exports = router;
