var express = require('express');
var router = express.Router();

var all_entry_controller = require('../controllers/all-entry-controller');

router.get('/home', all_entry_controller.migraine_free_for);
router.get('/all', all_entry_controller.entry_list);
router.get('/all-detail', all_entry_controller.all_entry_detail);

module.exports = router;
