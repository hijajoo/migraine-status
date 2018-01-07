var assert = require('assert');
var expect = require('chai').expect;
var request = require('request');
var server_url = "http://localhost:3000";
var create_url = server_url + '/daily-entry/create';

module.exports = function create_entry_testcases(server){
  describe("Create Entry Page", function(){
    var saveBody;
    var saveRes;
    it("should save values of result and body in variables", function(done){
      request(create_url, function(err, res, body){
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
    it("should have title Create a new Entry", function(){
      expect(saveBody).to.include('<title>Create a new Entry</title>');
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
};
