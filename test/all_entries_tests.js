var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var server_url = "http://localhost:3000";

module.exports = function all_entries_testcases(server){
  describe("All entries page", function(){
    var saveBody;
    var saveRes;
    var linksArr = [];
    it("should save values of result and body in variables", function(done){
      request(server_url + "/migraine-status/all", function(err, res, body){
        saveBody = body;
        saveRes = res;
        expect(saveBody).is.ok;
        expect(saveRes).is.ok;
        done();
      })
    });
    it("should return HTML 200", function(){
      expect(saveRes.statusCode).to.equal(200);
    });
    it("should have title Entries list", function(){
      expect(saveBody).to.include('<title>Entries List</title>');
    });
    it("should contain extractable links", function(){
      var link_regex = /<a href=\"([0-9a-zA-Z/\-]+)\">/g;
      var arr;
      while((arr = link_regex.exec(saveBody)) !== null){
        linksArr.push(server_url + arr[1]);
      }
      expect(linksArr).is.not.empty;
    });
    //TDB: This should loop to check all links
    it("should not contain broken links", function(done){
      request(linksArr[4], function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });
  })
};
