var assert = require('assert');
var expect = require('chai').expect;
var server = require('../bin/www');
var request = require('request');
var entry_detail_testcases = require('../test/entry_detail_tests');
var home_page_testcases = require('../test/home_tests');
var create_entry_testcases = require('../test/create_entry_tests');
var all_entries_testcases = require('../test/all_entries_tests');

describe("Testing Individual pages in Migraine Status application", function(){
  this.timeout(10000);
  before(function(){
    server.listen(3000);
  })

  home_page_testcases(server);
  all_entries_testcases(server);
  entry_detail_testcases(server);
  create_entry_testcases(server);

  after(function(){
    server.close();
  });
});
