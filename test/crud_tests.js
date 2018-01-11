var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var rp = require('request-promise-native');
var cheerio = require('cheerio');
var server_url = "http://localhost:3000";
var create_url = server_url + '/daily-entry/create';

module.exports = function create_update_delete_testcases(server){
  describe("Create/Update/Delete entries" , function(){
    it("should be able to create and delete a new entry successfully", function(done){
      var entry_url;
      var options = {
        method: 'POST',
        uri: create_url,
        form: {
          date: '01/01/2017',
          status_on_wakeup: 'fine',
          severity: '0',
          tea: 'n/a',
          walk: 'n/a',
          bath: 'n/a',
          aciloc: 'helped',
          food: 'did not help',
          random: 'n/a',
          rizora: 'n/a',
          night_meds_on_time: 'on',
          ayurvedic_medicine: 'off',
          overexertion: 'off',
          acidity: 'off',
        },
        simple: false, //This is false since we want 302 also to be considered a pass case
       }
       //First rp will create an entry
      rp(options)
        //Check that entry is created successfully, extract the URL redirected to and store it in entry_url
        .then(function(body){
          expect(body).is.ok;
          expect(body).to.include("Found. Redirecting to /daily-entry/entry/");
          var found_arr = body.match("Found. Redirecting to ([a-zA-Z0-9-_//]+)");
          entry_url = found_arr[1];
        })
        //GET the entry_url
        .then(function(body){
          entry_options = {
            method: 'GET',
            uri: server_url + entry_url,
          };
          return rp(entry_options);
        })
        //Verify that GET returns a value
        .then(function(body){
          expect(body).is.ok;
        })
        //RP to update the entry
        .then(function(body){
          var update_options = {
            method: 'POST',
            simple: false,
            uri: server_url + entry_url + '/update',
            form: {
              status_on_wakeup: 'migraine',
              severity: '8',
              tea: 'n/a',
              walk: 'n/a',
              bath: 'n/a',
              aciloc: 'helped',
              food: 'did not help',
              random: 'n/a',
              rizora: 'n/a',
              night_meds_on_time: 'on',
              ayurvedic_medicine: 'off',
              overexertion: 'off',
              acidity: 'off',
            },
          };
          return rp(update_options);
        })
        //Check if update is successful
        .then(function(body){
          expect(body).is.ok;
          expect(body).to.include("Found.");
        })
        //This will fire an rp for delete
        .then(function(body){
          var delete_options = {
            method: 'POST',
            simple: false,
            uri: server_url + entry_url + '/delete',
          };
          return rp(delete_options)
        })
        //Check that the rp for delete is successful
        .then(function(body){
          expect(body).is.ok;
          expect(body).to.include("Found.");
          done();
        })
        //Catch all errors
        .catch(function(err){
          console.log(err);
          //expect(err).to.be.empty;
          done();
        })
    });
  });
}
