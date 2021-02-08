const getEmptyResult = require('./rjql-util').getEmptyResult;

module.exports.consolidateResults = function(results, _response) {
    var c_verbose = [];
    var overAll = {
        total: results.length,
        passed: 0
    };
    var highlights = [];
    var result = results[0];
    var i = 0;
    for (var r of results) {
        var qb = to_c_verbose(r, i, overAll);
        c_verbose.push(qb);
        highlights.push({
            start: qb.linesToHighlight.start,
            end: qb.linesToHighlight.end,
            passed: qb.status
        })
        result = __compare(result, r);
        i++;
    }
    
    result.qbs = c_verbose;
    result.overAll = overAll;
    result.highlights = highlights;

    return result;

    function __compare(r1, r2) {
        var result = getEmptyResult();
        if(!r1.next) {
            r1.next = '&&';
        }
        if (r1.next == '&&') {
            result.passed = r1.passed && r2.passed;
            result.verb = r1.passed ? r2.verb : r1.verb;
            result.errLineNo = r1.passed ? r2.errLineNo : r1.errLineNo;
            result.next = r2.next;
        } else if (r1.next == '||') {
            result.passed = r1.passed || r2.passed;
            result.verb = r1.passed ? r2.verb : r1.verb;
            result.errLineNo = r1.passed ? r2.errLineNo : r1.errLineNo;
            result.next = r2.next;
        } else {
            return r1;
        }
        return result;
    }

    function to_c_verbose(r, i, o) {

        if (r.passed) {
            o.passed++;
        }
        return {
            queryBlock: i + 1,
            status: r.passed,
            verb: r.verb,
            line: r.errLineNo,
            linesToHighlight: getIPLineNo(r.target)
        }

        function getIPLineNo(t) {
            if (!t) {
                return {
                    start: -1,
                    end: -1
                }
            }
            if(typeof _response === 'string') {
                _response = JSON.parse(_response);
            }
            var match = JSON.stringify(t, null, ' ').replace(/\n\s+/g, '\n');
            var rs = JSON.stringify(_response, null, ' ').replace(/\n\s+/g, '\n');
            var index = rs.indexOf(match);
            var start = rs.substr(0, index).split('\n').length - 1;
            var end = start - 1 + match.split('\n').length;
            return { start, end }
        }
    }
}
