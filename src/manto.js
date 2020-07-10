const getAggregationFunction = require('./rjql-helper/rjql-util').getAggregationFunction;
const getEmptyResult = require('./rjql-helper/rjql-util').getEmptyResult;
const consolidateResults = require('./rjql-helper/result-consolidator').consolidateResults;
const getQueryProcessor = require('./rjql-helper/query-processor').getQueryProcessor;
const evaluateExpression = require('./rjql-helper/expression-evaluator').evaluateExpression;
const traverse = require('./rjql-helper/rjql-util').traverse;

module.exports.validate = function(_response, qry) {
    var hasConjunction = false;
    var results = [];
    var qp = getQueryProcessor(qry);
    var result = getEmptyResult();
    if (_response) {
        if (typeof _response === 'string') {
            try {
                _response = JSON.parse(_response);
            } catch (e) {
                debugger;
                console.log(e);
                result.verb = 'The response is not a valid JSON. <b>RJQL</b> works only for JSON. ';
                result.passed = false;
            }
        }

        if (result.verb == '') {
            do {
                hasConjunction = false;
                var _result = getEmptyResult();
                results.push(_result);
                _validate(_response, qp, _result);
                if (_result.next === '') {
                    qp.next();
                    var operator = getNextOperatorIfPresent(qp);
                    if (operator != null) {
                        _result.next = operator;
                    }
                }
            } while (_result.next != '');
        }

    }

    if (results.length === 0) {
        results.push(result);
    }

    return consolidateResults(results, _response);

    function getNextOperatorIfPresent(qp) {
        while (qp.hasNext()) {
            var q = qp.query();
            qp.next();
            if (q && '&&||'.indexOf(q) >= 0) {
                return q;
            }
        }
        return null;
    }

    function _validate(target, qp, result) {
        var q = qp.query();
        if (q == null || hasConjunction) {
            return;
        }
        if (q === '&&' || q === '||') {
            result.next = q;
            qp.next();
            hasConjunction = true;
            return;
        }
        var type = getQType(q);
        if (type.what != 'E') {
            target = traverse(target, type.q.split('>'));
            if (type.what == 'N') {
                qp.next();
                _validate(target, qp, result);
            } else { //A
                if(!target || !target[Symbol.iterator] || typeof target == 'string') {
                    result.verb = 'Expected an array found ' + typeof target;
                    result.passed = false;
                    result.errLineNo = qp.getLineNo();
                } else {
                    var r = false;
                    qp.next();
                    var aggregator = getAggregationFunction(qp.query());
                    if (!aggregator) {
                        for (var nd of target) {
                            r = _validate(nd, qp, result);
                            if (r) { result.target = nd; break; }
                        }
                        if (!nd) {
                            qp.next();
                            _validate(nd, qp, result);
                        }
                    } else {
                        runAggregatorFunction(aggregator, qp, target, result);
                    }
                }
            }
        } else {
            var status = evaluateExpression(type, target, result, qp);
            if (status) {
                qp.next();
                _validate(target, qp, result);
            }
        }
    }

    function runAggregatorFunction(aggregator, qp, target, result) {
        var aggregatedResult = aggregator(qp.query(), target);
        if (aggregatedResult.status) {
            result.target = target;
            qp.next();
            _validate(target, qp, result);
        } else {
            result.passed = aggregatedResult.status;
            result.verb = aggregatedResult.verb;
            result.errLineNo = qp.getLineNo();
        }
    }

    //N: Nested obj
    //A: Array
    //E: Expression
    function getQType(q) {
        var type = {};
        if (/:$/.test(q)) {
            type.what = 'N';
            if (/\[\]:$/.test(q)) {
                type.what = 'A';
            }
            q = q.replace(/(\[\])?:$/, '');
        } else {
            type.what = 'E';
        }
        type.q = q;
        return type;
    }         
}