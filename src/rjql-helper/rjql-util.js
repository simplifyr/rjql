const validateRegex = require('./qvar/regex').validateRegex;
const validateSort = require('./qvar/sort').validateSort;
const validateUUID = require('./qvar/uuid').validateUUID;
const validateIn = require('./qvar/in').validateIn;
const validateIP = require('./qvar/ip').validateIP;

const count = require('./aggregate/count').count;
const avg = require('./aggregate/avg').avg;
const min = require('./aggregate/min').min;
const max = require('./aggregate/max').max;
const sum = require('./aggregate/sum').sum;



module.exports.getQEValidator = function(QVE) {
    var qvePattern = /^(\$[a-z]+){?/;
    if(qvePattern.test(QVE)) {
        var VE = qvePattern.exec(QVE)[1];
        switch(VE) {
            case '$uuid': 
                return validateUUID;
            case '$asort': 
                return validateSort;
            case '$dsort': 
                return validateSort;
            case '$regex':
                return validateRegex;
            case '$in':
                return validateIn;
            case '$ip':
                return validateIP;
            default:
                return null;
        }
    } else {
        return null;
    }
    
}


module.exports.getAggregationFunction = function(qry) {
    var opts = /^\$(count|max|min|avg|sum)/.exec(qry);
    if(opts == null) {
        return null;
    } else {
        switch(opts[1]) {
            case 'count':
                return count;
            case 'avg':
                return avg;
            case 'min':
                return min;
            case 'max':
                return max;
            case 'sum':
                return sum;
            default:
                return null;
        }
    }
}

module.exports.getEmptyResult = function() {
    return {
        errLineNo: -1,
        verb: '', //verbose
        passed: true,
        next: '', //operator
        target: undefined
    };
} 

module.exports.traverse = function(target, props) {
    try {
        for (var prop of props) {
            if(prop) {
                var arrayType = /\[(\d+)?\]$/.exec(prop);
                if (arrayType == null) {
                    target = target[prop];
                } else {
                    prop = prop.replace(arrayType[0], '');
                    target = target[prop];
                    if (arrayType[1] != undefined) {
                        var index = parseInt(arrayType[1]);
                        target = target[index];
                    }
                }
            }
        }
        return target;
    } catch(e) {
        return undefined;
    }
}