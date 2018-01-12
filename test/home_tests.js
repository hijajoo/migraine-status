var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var server_url = "http://localhost:3000";

module.exports = function home_page_testcases(server){
  describe("Home page: " + server_url , function(){
    var saveRes;
    var saveBody;
    var linksArr= [];
    it("should save values of result and body in variables", function(done){
      request.get(server_url, function(err, res, body){
        saveRes = res;
        saveBody = body;
        expect(saveRes).is.not.empty;
        expect(saveBody).is.not.empty;
        done();
      })
    });
    it("should return HTTP 200", function(){
      expect(saveRes.statusCode).to.equal(200);
    });
    it("should have title Migraine Status Home", function(){
      expect(saveBody).to.include('<title>Migraine Status Home</title>');
    });
    it("should contain extractable links", function(){
      var link_regex = /<a href=\"([0-9a-zA-Z/\-]+)\">/g;
      var arr;
      while((arr = link_regex.exec(saveBody)) !== null){
        linksArr.push(server_url + arr[1]);
      }
      expect(linksArr).is.not.empty;
    });
    it("should not contain broken links", function(done){
      request(linksArr[0], function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });
    it("should not contain broken links", function(done){
      request(linksArr[1], function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });
    it("should not contain broken links", function(done){
      request(linksArr[2], function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    })
  });
}
