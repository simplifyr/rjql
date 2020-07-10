const evaluate = require('../evaluate').evaluate;

module.exports.max = function(qry, arr) {
    
    var opts = /^\$(count|max|min|avg|sum)\{(.+)\}\s(=|<|>|<=|>=)\s(.+)/.exec(qry);
    var propToAdd = opts[2];
    var _max = Number.MIN_SAFE_INTEGER;

    for(var o of arr) {
        var _v = o[propToAdd];
        if(_v) {
            try {
            _v = Number(_v);
            } catch(e) {}
            if(_max < _v) {
                _max = _v;
            }
        }
    }

    var status = evaluate(_max, opts[3], opts[4]);

    return {
        value: _max,
        status,
        verb: (status ? '' : 'Maximum value ' + _max + ' didn\'t match the expected max ' + opts[4])
    };
    
}