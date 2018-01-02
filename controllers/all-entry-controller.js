var perDayEntry = require('../models/per-day-entry-schema');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

//Display entry count on Home page
exports.entry_count = function(req, res) {
    async.parallel({
        entry_count: function(callback) {
            perDayEntry.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Migraine Entry Home', error: err, data: results });
    });
};

// Display list of all entries
exports.entry_list = function(req, res, next) {
  perDayEntry.find()
    .sort([['_id', 'ascending']])
    .exec(function (err, list_entries) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('entry_list', { title: 'Entries List', list_entries:  list_entries});
    });
};
