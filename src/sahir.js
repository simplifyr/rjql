var executeTests = require('./query-runner/executor').executeTests;
var Parser = require('./parser/parser');
const consolidateResults = require('./rjql-helper/result-consolidator').consolidateResults;

module.exports.validate = function(res, qry) {
    var tests = Parser.parse(qry).qbs;
    return executeTests(res, tests);
}

module.exports.consolidated = function(res, qry) {
    var tests = Parser.parse(qry).qbs;
    return consolidateResults(executeTests(res, tests), res);
}