const {describe} = require('mocha');

const {assert} = require('chai');

const evaluate = require('../src/rjql-helper/evaluate').evaluate;


describe('Evaluate Test Suite', function() {
    
    it('Should return true if value is found in array', function() {
        assert.equal(evaluate(["bmw", "ford"], '~', "\"ford\""), true);
    });

    it('Should return true result and target are equal', function() {
        assert.equal(evaluate("ford", '=', "\"ford\""), true);
    });

});