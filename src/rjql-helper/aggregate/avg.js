const evaluate = require('../evaluate').evaluate;
const sum = require('./sum').sum;

module.exports.avg = function(qry, arr) {

    var opts = /^\$(count|max|min|avg|sum)\{(.+)\}\s(=|<|>|<=|>=)\s(.+)/.exec(qry);
    var _sum = sum(qry, arr);
    
    debugger;
    var _avg = _sum.value / arr.length;

    var status = evaluate(_avg, opts[3], opts[4]);

    return {
        value: _avg,
        status,
        verb: (status ? '' : 'Avg ' + _avg + ' didn\'t match the expected avg ' + opts[4])
    };
}