var perDayEntry = require('../models/per-day-entry');

var async = require('async');

exports.all_entry_list = function(req, res) {

    async.parallel({
        entry_count: function(callback) {
            perDayEntry.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Migraine Entry Home', error: err, data: results });
    });
};
