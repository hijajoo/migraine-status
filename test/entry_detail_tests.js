var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var server_url = "http://localhost:3000";
var all_entry_url = server_url + "/migraine-status/all";

module.exports = function entry_detail_testcases(server){
  describe("Test behavior and functionality of Entry Detail page", function(){
    var saveRes;
    var saveBody;
    it("should be able to store results and body of HTTP request in variables", function(done){
      request.get(all_entry_url, function(err, res, body){
        var entry_link_regex = /\/daily-entry\/entry\/[0-9]+/g;
        var arr = entry_link_regex.exec(body);
        expect(arr[0]).is.ok;
        request.get(server_url + arr[0], function(err, res, body){
          saveRes = res;
          saveBody = body;
          expect(saveRes).is.ok;
          expect(saveBody).is.ok;
          done();
        });
      });
    });
    it("should return HTTP 200", function(){
      expect(saveRes.statusCode).to.equal(200);
    })
    it("should have title Entry Detail", function(){
      expect(saveBody).to.include("<title>Entry Detail</title>");
    })
    it("should have valid value for field Severity", function(){
      var sev = saveBody.match("<td>Severity</td><td>[0-9]+</td>");
      expect(sev).is.ok;
    })
  })
};
