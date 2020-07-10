const evaluate = require('../evaluate').evaluate;

module.exports.count = function(qry, arr) {
    var _count = 0;
    var opts = /^\$(count|max|min|avg|sum)\{(.+)\}\s(=|<|>|<=|>=)\s(.+)/.exec(qry);
    var propToCount = opts[2];
    var forValue;
    var i = propToCount.indexOf(':');
    if(i >= 0) {
        var temp = propToCount.substr(0, i).trim();
        var exp = propToCount.substr(i + 1).trim().replace(/^\//, '').replace(/\/$/, '');
        forValue = new RegExp(exp);
        propToCount = temp;
    }
   
    for(var o of arr) {
        var propValue = o[propToCount];
        if(propValue) {
            if(forValue) {
                if(forValue.test(propValue)) {
                    _count++;
                }
            } else {
                _count++;
            }
        }  
    }
    var status = evaluate(_count, opts[3], opts[4]);
    
    return {
        value: _count,
        status,
        verb: (status ? '' : 'Count ' + _count + ' didn\'t match the expected count ' + opts[4])
    };
}