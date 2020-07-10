//something = "$in{'abc', 'def', 'xyz'}"

module.exports.validateIn = function(resultArray, QVE) {
    var values = QVE.replace(/^\$in{/, '').replace(/}$/, '');
    var map = toValueMap(values.split(/,\s*/));
    var result = true;
    if(!resultArray[Symbol.iterator] || typeof resultArray == 'string') {
        resultArray = [resultArray];
    }
    for(var o of resultArray) {
        if(!map[o]) {
            result = false;
            break;
        }
    }
    return {
        result,
        verb: !result ? '<b>' + o + '</b> wasn\'t expected in {' + values + '}' : ''
    }
}

function toValueMap(values) {
    var map = {};
    var DEF = '_';
    for(var val of values) {
        val = val.replace(/^'/, '').replace(/'$/, '');
        map[val] = DEF;
    }
    return map;
}