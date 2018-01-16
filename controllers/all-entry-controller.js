var perDayEntry = require('../models/per-day-entry-schema');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var debuglogger = require('../logger').debuglogger;

// Display list of all entries
exports.entry_list = function(req, res, next) {
  perDayEntry.find()
    .sort([['_id', 'ascending']])
    .exec(function (err, list_entries) {
      if (err) { return next(err); }
      // Successful, so render.
      debuglogger.debug("Found %d entries in entry_list", list_entries.length);
      res.render('entry_list', { title: 'List of Entries', list_entries:  list_entries});
    });
};

// Render function for the home page
// We want to pass the last entry where status_on_wakeup was not "fine"
exports.migraine_free_for = function(req, res, next) {
  perDayEntry.find({status_on_wakeup: {$ne: 'fine'}})
    .sort([['_id', 'descending']])
    .exec(function(err, list_of_migraine_entries){
      if(err) return next(err);
      debuglogger.debug("Found %d entries with migraine", list_of_migraine_entries.length);
      res.render('migraine_free_for', {title: 'Migraine Status Home', user: "Hina", last_migraine_entry: list_of_migraine_entries[0]})
    });
};

exports.all_entry_detail = function(req, res, next){
  perDayEntry.find()
    .sort([['_id', 'descending']])
    .exec(function(err, list_entries){
      if(err) return next(err);
      debuglogger.debug("Found %d entries in all_entry_detail", list_entries.length);
      res.render('all_entries_detail_table', {title: 'List of entries: Detail', list_entries: list_entries});
    });
}
