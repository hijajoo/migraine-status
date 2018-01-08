var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var server_url = "http://localhost:3000";
var create_url = server_url + '/daily-entry/create';

module.exports = function create_update_delete_testcases(server){
  describe("Create/Update/Delete entries" , function(){
    var saveRes;
    var saveBody;
    var linksArr= [];
    it("should be able to create a new entry successfully", function(done){
      var form_data = {
          date: '2017-01-01',
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
          acidity: 'off'
         };
      request.post(create_url, {form: form_data}, function(err, res, body){
        expect(res.statusCode).to.equal(302);
        expect(body).to.include("Found. Redirecting to /daily-entry/entry/");
        var found_arr = body.match("Found. Redirecting to ([a-zA-Z0-9-_//]+)");
        request.post(server_url+ found_arr[1] + '/delete', function(err, res, body){
          expect(res.statusCode).to.equal(302);
          expect(body).to.include("Found.");
          done();
        });
      })
    });
  });
}
