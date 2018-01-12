const Browser = require('zombie');

module.exports = function create_using_form_testcases(){
  describe('Tesing the UI for Create entry form', function() {

    before(function(done) {
      this.browser = new Browser({ site: 'http://localhost:3000', waitDuration: 120*1000 });
      this.browser.visit('/daily-entry/create', done);
    });

    describe('Creates a successful entry and presses Save', function() {

      before(function(done) {
        this.browser
          .fill('date',    '01/01/2017')
          .select('status_on_wakeup', 'migraine')
          .select('tea', 'did not help')
          .pressButton('save', done);
      });


      it('should be successful', function() {
        this.browser.assert.success();
      });

      it('should have title Entry Detail', function(){
        this.browser.assert.text('title', 'Entry Detail');
      })
    });
  });
};
