var assert = require('assert');
var expect = require('chai').expect;
var server = require('../bin/www');
var request = require('request');
var server_url = 'http://localhost:3000';
var create_url = server_url + '/daily-entry/create';

describe("Add and display Migraine Status per Day", function(){
  this.timeout(10000);
  before(function(){
    server.listen(3000);
  })
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

  describe("Create Entry Page", function(){
    var saveBody;
    var saveRes;
    it("should save values of result and body in variables", function(done){
      request(server_url + "/daily-entry/create", function(err, res, body){
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
    it("should have title Create Single Day Entry", function(){
      expect(saveBody).to.include('<title>Create Single Day Entry</title>');
    });
    it("should not accept empty form data", function(done){
      options = {
        url: create_url,
        form: {
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter Date</li>");
        expect(body).to.include("<li>Enter status on wakeup</li>");
        done();
      })
    })
    it("should not accept empty date field", function(done){
      options = {
        url: create_url,
        form: {
          status_on_wakeup: "fine",
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter Date</li>");
        done();
      })
    })
    it("should not accept future date", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2100",
          status_on_wakeup: "fine",
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter Date</li>");
        done();
      })
    })
    it("should not accept empty status_on_wakeup field", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter status on wakeup</li>");
        done();
      })
    })
    it("should not accept non integer severity field", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          severity: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter a severity between 0 to 10</li>");
        done();
      })
    })
    it("should not accept value greater than 10 in severity field", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          severity: "20"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Enter a severity between 0 to 10</li>");
        done();
      })
    })
    it("should not accept invalid value in field Walk", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          walk: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Walk</li>");
        done();
      })
    })
    it("should not accept invalid value in field Tea", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          tea: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Tea</li>");
        done();
      })
    })
    it("should not accept invalid value in field Aciloc", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          aciloc: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Aciloc</li>");
        done();
      })
    })
    it("should not accept invalid value in field Bath", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          bath: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Bath</li>");
        done();
      })
    })
    it("should not accept invalid value in field Food", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          food: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Food</li>");
        done();
      })
    })
    it("should not accept invalid value in field Random med", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          random: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Random</li>");
        done();
      })
    })
    it("should not accept invalid value in field Rizora", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          rizora: "abcd"
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("<li>Invalid value for relief method: Rizora</li>");
        done();
      })
    })
    it("should accept correctly formatted data for an existing date", function(done){
      options = {
        url: create_url,
        form: {
          date: "01/01/2018",
          status_on_wakeup: "fine",
          severity: "0",
          Tea: "n/a",
        }
      };
      request.post(options, function(err, res, body){
        expect(body).to.include("Found");
        done();
      })
    })
  })

  after(function(){
    server.close();
  });
});
