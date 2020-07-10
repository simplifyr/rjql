const evaluate = require('./evaluate').evaluate;
const getQEValidator = require('./rjql-util').getQEValidator;
const traverse = require('./rjql-util').traverse;

module.exports.evaluateExpression =  function(type, target, result, qp) {
    /***
    * parts[0] property to check
    * parts[1] target value
    */
    var operator = /\s+([=~<>]+)\s+/.exec(type.q)[1];
    var parts = type.q.split(/\s+[=~<>]+\s+/);
    var value = traverse(target, parts[0].split('>'));
    var rhs = toTarget(parts[1]);
    var QEValidator = getQEValidator(rhs);
    var temp = QEValidator ? QEValidator(value, rhs) : evaluate(value, operator, rhs);
    var status = typeof temp === 'boolean' ? temp : temp.result;
    if (!status) {
        if (value != undefined) { //temp fix
            result.verb = typeof temp != 'boolean' ? temp.verb : toVerbose(type.q, parts[0], rhs, value, operator);
        } else {
            status = false;
            result.verb = 'Property <b>' + parts[0] + '</b> doesn\'t exist'; 

        }
        result.errLineNo = qp.getLineNo();
    }
    result.operator = operator;
    result.passed = status;
    if(status || operator === '<>') {
        var t = target;
        var p = parts[0].split('>');
        for (var i = 0; i < p.length - 1; i++) {
            t = t[p[i]];
        }    
        result.target = t;
        result.errLineNo = qp.getLineNo();
    }
    return status;

    function toTarget(v) {
        return v.replace(/^"/, '').replace(/"$/, '');
    }
}

function toVerbose(q, lhs, rhs, v, operator) {
    switch(operator) {
        case '=':
            return 'Expected <i>' + lhs + '</i> to be <b>' + rhs + '</b> found <u>' + v + '</u>';
        case '~': 
            return 'Value <b>' + rhs + '</b> was not found in array <i>' + lhs + '</i>[' + v + ']';
        case '<>': 
            return 'Found <i>' + lhs + '</i> with value <b>' + rhs + '</b>, while not expecting it.';
        default: 
            return 'Query <b>' + q + '</b> failed for value <u>' + v + '</u>';
    }
}