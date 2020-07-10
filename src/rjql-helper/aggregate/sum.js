const evaluate = require('../evaluate').evaluate;

module.exports.sum = function(qry, arr) {
    var opts = /^\$(count|max|min|avg|sum)\{(.+)\}\s(=|<|>|<=|>=)\s(.+)/.exec(qry);
    var propToAdd = opts[2];
    var _sum = 0;

    for(var o of arr) {
        var _v = o[propToAdd];
        if(_v) {
            try {
            _v = Number(_v);
            } catch(e) {}
            _sum += _v;
        }
    }

    var status = evaluate(_sum, opts[3], opts[4]);

    return {
        value: _sum,
        status,
        verb: (status ? '' : 'Sum ' + _sum + ' didn\'t match the expected sum ' + opts[4])
    };
    
}