var perDayEntry = require('../models/per-day-entry-schema');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

// Display Genre create form on GET
exports.create_get = function(req, res, next) {
    res.render('entry_form', { title: 'Create Single Day Entry' });
};

//POST request for create form
exports.create_post =  [
    // Validate that the name field is not empty.
    body('date', 'Enter Date').isLength({ min: 1 }).trim(),
    body('status_on_wakeup', "Enter status on wakeup",).isLength({min:1}).trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create an entry object with escaped and trimmed data.
        var entry = new perDayEntry(
          { _id: req.body.date,
            status_on_wakeup: req.body.status_on_wakeup,
            severity: parseInt(req.body.severity),
            relief_methods: {
              tea: req.body.tea,
              walk: req.body.walk,
              bath: req.body.bath,
              aciloc: req.body.aciloc,
              food: req.body.food,
              random: req.body.random,
              rizora: req.body.rizora,
            },
            status_of_triggers: {
              night_meds_on_time: (req.body.night_meds_on_time === 'on'),
              ayurvedic_medicine: (req.body.ayurvedic_medicine === 'on'),
              overexertion: (req.body.overexertion === 'on'),
              acidity: (req.body.acidity === 'on'),
            }
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('entry_form', { title: 'Create Single Day Entry', entry: entry, errors: errors.array()});
            return;
        }
        else {
          //TBD: Move this to promise?
            perDayEntry.findOne({'_id': req.body.date})
              .exec(function(err, found_entry){
                if(err) return next(err);
                if(found_entry){
                  res.redirect(found_entry.url)
                }
              })
              entry.save(function (err) {
                if (err) { return next(err); }
                res.redirect(entry.url);
              });
        }
    }
];

// Display detail page for a specific entry
exports.entry_detail = function(req, res, next) {
  perDayEntry.findById(new Date(+req.params.id))
    .exec(function(err, entry){
      if(err) return next(err);
      res.render('entry_detail', { title: 'Entry Detail', entry: entry});
    });
};
