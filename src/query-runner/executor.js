var Util = require('../rjql-helper/rjql-util');
const evaluateExpression = require('../rjql-helper/expression-evaluator').evaluateExpression;


function executeTests(response, tests) {
    var result = {};
    var results = [];
    if (response) {
        if (typeof response === 'string') {
            try {
                response = JSON.parse(response);
            } catch (e) {
                setInvalidJSON(result);
                return result;
            }
        } 
        if(typeof response === 'object') {
            for(var i = 0; i < tests.length; i++) {
                var _result = Util.getEmptyResult();
                
                if(tests[i].qType != 'C') {
                    executeTest(response, tests[i], _result);
                    //In case of failed test generating verbose again
                    //because in most cases verbose would be relaced 
                    //by sub sequent query results.
                    if(_result.target && !_result.passed) {
                        var __result = Util.getEmptyResult();
                        for(var c of tests[i].children) {
                                executeTest(_result.target, c, __result);
                        }
                        _result.verb = __result.verb;
                    } else if(_result.passed) {
                        _result.verb = 'OK';
                    }
                    results.push(_result);
                } else {
                    results[i - 1].next = tests[i].query;
                }
            }
        } else {
            setInvalidJSON(result);
            return result;
        }
    }
    return results;
}


function executeTest(json, test, _result) {
    test.query  = test.query.replace(/(\[\])?:$/, '');
    if(test.qType === 'E') {
        _evaluateExp(test, json, _result);
    } else {
        var target = Util.traverse(json, test.query.split('>'));
        if(test.qType === 'N') {
            for(var child of test.children) {
                executeTest(target, child, _result);
                if(_result.passed) {
                    break;
                }
            }
        } else { //A
            var index = 0;
            var hasAggregator = false;
            for(var _t of target) {
                var forceBreak = false;
                for(var child of test.children) {
                    var aggregator = Util.getAggregationFunction(child.query);
                    if (!aggregator) {
                        executeTest(_t, child, _result);
                        if(!_result.passed) {
                            forceBreak = true;
                            break;
                        }
                    } else {
                        runAggregatorFunction(aggregator, child, target, _result);
                        hasAggregator = true;
                        forceBreak = true;
                        break;
                    }
                }
                //reassgining target as parent in place of individual child node as target 
                if(!forceBreak && _result.passed) {
                    _result.target = _t;
                }
                if(hasAggregator) {
                    if(hasAggregator && test.children.length > 1) {
                        _result.warn = 'Ignoring rest of the queries after Aggregation function.'; 
                    }
                    break;
                }
                if(!forceBreak && _result.operator != '<>') {
                    break;
                }
                if(_result.operator == '<>' && forceBreak) {
                    break;
                }
            }
           
        }

    }
}


function _evaluateExp (test, target, result) {
    test.q = test.query;
    test.getLineNo = function() {
        return this.start;
    }
    return evaluateExpression(test, target, result, test);
}

function runAggregatorFunction(aggregator, test, target, result) {
    var aggregatedResult = aggregator(test.query, target);
    if (aggregatedResult.status) {
        result.target = target;
    } else {
        result.passed = aggregatedResult.status;
        result.verb = aggregatedResult.verb;
        result.errLineNo =test.start;
    }
}


function setInvalidJSON(result) {
    result.verb = 'The response is not a valid JSON. <b>RJQL</b> works only for JSON. ';
    result.passed = false;
}

module.exports.executeTests = executeTests;