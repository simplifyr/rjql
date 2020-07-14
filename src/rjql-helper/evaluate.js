module.exports.evaluate = function(result, operator, targetValue) {
    targetValue = toTarget(targetValue);
    if (operator === '=') {
        return String(targetValue) === String(result);
    } else if (operator === '<>') {
        return result != targetValue;
    } else if (operator === '~') {
        return result.indexOf(targetValue) >= 0;
    } else {
        targetValue = Number(targetValue);
        result = Number(result);
        switch (operator) {
            case '>':
                return result > targetValue;
            case '>=':
                return result >= targetValue;
            case '<':
                return result < targetValue;
            case '<=':
                return result <= targetValue;
        }
    }

    function toTarget(v) {
        return v[0] === '"' && v[v.length - 1] === '"' ?
                v.replace(/^"/, '').replace(/"$/, '') : v;
    }
}