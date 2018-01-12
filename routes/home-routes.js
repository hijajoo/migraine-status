var express = require('express');
var router = express.Router();

var all_entry_controller = require('../controllers/all-entry-controller');

router.get('/home', all_entry_controller.migraine_free_for);
router.get('/all', all_entry_controller.entry_list);

module.exports = router;
