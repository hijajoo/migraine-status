var express = require('express');
var router = express.Router();

var single_entry_controller = require('../controllers/single-entry-controller');

router.get('/create', single_entry_controller.create_get);
router.post('/create', single_entry_controller.create_post);

router.get('/entry/:id', single_entry_controller.entry_detail);
router.post('/entry/:id/update', single_entry_controller.entry_update);
router.post('/entry/:id/delete', single_entry_controller.entry_delete);

module.exports = router;
