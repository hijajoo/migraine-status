var assert = require('assert');
var expect = require('chai').expect;
var server = require('../bin/www');
var request = require('request');
require('it-each')({ testPerIteration: true });
var server_url = 'http://localhost:3000';

describe("Add and display Migraine Status per Day", function(){
  this.timeout(10000);
  before(function(){
    server.listen(3000);
  })
  describe("Home page: " + server_url , function(){
    var saveRes;
    var saveBody;
    var linksArr= [];
    it("should save values of result and body in a variable", function(done){
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
    it("should have title Migraine Entry Home", function(){
      expect(saveBody).to.include('<title>Migraine Entry Home</title>');
    });
    it("should have valid count of entries", function(){
      var entry_count = saveBody.match(/<li><strong>Migraine Entries:<\/strong> ([0-9]+)<\/li>/);
      expect(+entry_count[1]).is.ok;
    })
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

  after(function(){
    server.close();
  });
});
