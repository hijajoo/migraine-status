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
      res.render('entry_list', { title: 'List of Entries', list_entries:  list_entries});
    });
};

exports.migraine_free_for = function(req, res, next) {
  perDayEntry.find({status_on_wakeup: {$ne: 'fine'}})
    .sort([['_id', 'descending']])
    .exec(function(err, list_of_migraine_entries){
      if(err) return next(err);
    //  console.log(list_of_migraine_entries);
      res.render('migraine_free_for', {title: 'Migraine Status Home', user: "Hina", last_migraine_entry: list_of_migraine_entries[0]})
    });
};
