const evaluate = require('../evaluate').evaluate;

module.exports.min = function(qry, arr) {
    
    var opts = /^\$(count|max|min|avg|sum)\{(.+)\}\s(=|<|>|<=|>=)\s(.+)/.exec(qry);
    var propToAdd = opts[2];
    var _min = Number.MAX_SAFE_INTEGER;

    for(var o of arr) {
        var _v = o[propToAdd];
        if(_v) {
            try {
            _v = Number(_v);
            } catch(e) {}
            if(_min > _v) {
                _min = _v;
            }
        }
    }

    var status = evaluate(_min, opts[3], opts[4]);

    return {
        value: _min,
        status,
        verb: (status ? '' : 'Minimum value ' + _min + ' didn\'t match the expected min ' + opts[4])
    };
    
}