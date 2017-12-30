var express = require('express');
var router = express.Router();

var all_info_controller = require('../controllers/all-info');

router.get('/home', all_info_controller.entry_count);
router.get('/create', all_info_controller.single_entry_create_get);

router.post('/create', all_info_controller.single_entry_create_post);

module.exports = router;
