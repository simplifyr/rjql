const {describe} = require('mocha');

const {assert} = require('chai');

const Parser = require('../src/parser/parser');


describe('Parser Test Suite', function() {
    
    it('Should parse RJQL for Query type = `E`', function() {
        var rjql = 'name = "Rahul"';
        assert.equal(Parser.parse(rjql).qbs[0].qType, 'E');
    });

    it('Should parse RJQL for Query type `A` and `N`', function() {
var qry2 = `Employees[]:
	employeeCode = "E1"
	region = "QA"`;
        assert.equal(Parser.parse(qry2).qbs[0].qType, 'A');
    });



});