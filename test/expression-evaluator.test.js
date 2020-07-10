const {describe} = require('mocha');

const {assert} = require('chai');

const evaluate = require('../src/rjql-helper/expression-evaluator').evaluateExpression;


describe('Expression Evaluator Test Suite', function() {
    
    it('Expression should be evaluated to true', function() {
        var qp = {
            getLineNo: function(){}
        };
        var type = {
            q: 'name = "Rahul"'
        };
        var target = {
            "name": "Rahul"
        };
        assert.equal(evaluate(type, target, {},  qp), true);
    });

    it('Expression should be evaluated to false', function() {
        var qp = {
            getLineNo: function(){}
        };
        var type = {
            q: 'name = "Rahul"'
        };
        var target = {
            "name": "RJQL"
        };
        assert.equal(evaluate(type, target, {},  qp), false);
    });

    it('Expression should be evaluated to true for $ip', function() {
        var qp = {
            getLineNo: function(){}
        };
        var type = {
            q: 'ip = "$ip"'
        };
        var target = {
            "ip": "123.45.67.03"
        };
        assert.equal(evaluate(type, target, {},  qp), true);
    });



});