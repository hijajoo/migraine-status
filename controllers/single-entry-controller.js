var perDayEntry = require('../models/per-day-entry-schema');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
var validReliefInput = [
  "n/a",
  "helped",
  "did not help"
];

// Display Genre create form on GET
exports.create_get = function(req, res, next) {
    res.render('entry_form', { title: 'Create a new Entry' });
};

//POST request for create form
exports.create_post =  [
    // Validate that the name field is not empty.
    body('date', 'Enter Date').trim().isLength({ min: 1 }).not().isAfter(),
    body('status_on_wakeup', "Enter status on wakeup").trim().isLength({min:1}),
    body('severity', "Enter a severity between 0 to 10").optional().isInt({min:0, max:10}),
    body('tea', "Invalid value for relief method: Tea").optional().trim().isIn(validReliefInput),
    body('walk', "Invalid value for relief method: Walk").optional().trim().isIn(validReliefInput),
    body('aciloc', "Invalid value for relief method: Aciloc").optional().trim().isIn(validReliefInput),
    body('bath', "Invalid value for relief method: Bath").optional().trim().isIn(validReliefInput),
    body('food', "Invalid value for relief method: Food").optional().trim().isIn(validReliefInput),
    body('random', "Invalid value for relief method: Random").optional().trim().isIn(validReliefInput),
    body('rizora', "Invalid value for relief method: Rizora").optional().trim().isIn(validReliefInput),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create an entry object with escaped and trimmed data.
        var entry = new perDayEntry(
          { _id: req.body.date,
            status_on_wakeup: req.body.status_on_wakeup,
            severity: (req.body.severity === undefined ? 0: parseInt(req.body.severity)),
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
            res.render('entry_form', { title: 'Create a new Entry', entry: entry, errors: errors.array()});
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

exports.entry_update = function(req, res, next){
  perDayEntry.findById(new Date(+req.params.id))
    .exec(function(err, entry){
      if(err) next(err);
      console.log(entry.date_yyyymmdd);
      entry.status_on_wakeup = req.body.status_on_wakeup;
      entry.severity = req.body.severity;
      entry.relief_methods.tea = req.body.tea;
      entry.relief_methods.walk = req.body.walk;
      entry.relief_methods.bath = req.body.bath;
      entry.relief_methods.aciloc = req.body.aciloc;
      entry.relief_methods.food = req.body.food;
      entry.relief_methods.random = req.body.random;
      entry.relief_methods.rizora = req.body.rizora;
      entry.status_of_triggers.night_meds_on_time = req.body.night_meds_on_time;
      entry.status_of_triggers.ayurvedic_medicine = req.body.ayurvedic_medicine;
      entry.status_of_triggers.overexertion = req.body.overexertion;
      entry.status_of_triggers.acidity = req.body.acidity;
      entry.save(function(err){
        if(err) return next(err);
        res.redirect(entry.url);
        next();
      })
    })
}

exports.entry_delete = function(req, res, next){
  perDayEntry.findById(new Date(+req.params.id))
    .exec(function(err, entry){
      entry.remove(function(err){
        if(err) return next(err);
        res.redirect('http://localhost:3000/migraine-status/all');
        next();
      })
    })
}
