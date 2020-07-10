function parse(src) {
    try {
        var lines = src.split('\n');
        var QUERY_BLOCKS = populateQueryBlocks(lines);
        for (var qb of QUERY_BLOCKS) {
            if (qb.qType != 'C' && qb.end > qb.start) {
                parseChildren(qb, lines, qb.start++, qb.end);
            }
        }
        return {
            err: undefined,
            qbs: QUERY_BLOCKS
        };
    } catch(e) {
        console.log(e);
        return {
            err: e,
            qbs: undefined
        };
    }
}

/**
 * Parse children of Query Blocks
 * @param {*} parent Current query block
 * @param {*} lines all lines in source
 * @param {*} index query block start index
 * @param {*} till  query block ends at 
 */

function parseChildren(parent, lines, index, till) {
    if(index == till) {
        return;
    }
    var qry = lines[index];
    var type = getQType(qry);
    var tabCount = getTabCount(qry);
    var node = getNode(index, qry, parent);
    if(!node.query || tabCount > parent.tabCount) {
        if(node.query) { parent.children.push(node); }
        if(/(A|N)/.test(type)) {
            parseChildren(node, lines, index + 1, till);
        } else {
            parseChildren(parent, lines, index + 1, till);
        }
    } else {
        parseChildren(parent.parent, lines, index, till);
    }
}



/***
 * Divide the source into query blocks
 * 
 * 
 * Employees[]:
 *  employeeCode = "E1"
 *  prop[]:
 *      hello = "boom"
 * &&
 * Employees[]:
 *  employeeCode = "E1"
 *  region = "CA2"
 * 
 * The above source will be divided into
 * 3 blocks where lines start with no space or tab
 * in the beginning.
 * 
 *  @param {*} lines
 */
function populateQueryBlocks(lines) {
    var queryBlocks = []; 
    var current = undefined;
    var j = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i]) {
            if (getTabCount(lines[i]) === 0) {
                var qb = getQueryBlock(i, lines[i], undefined);
                queryBlocks.push(qb);
                if (current) {
                    current.end = j;
                }
                current = qb;
            }
            j++;
        }
    }
    current.end = j;
    return queryBlocks;
}

function getNode(i, qry, p) {
    return getQueryBlock(i, qry, p);
}

function getQueryBlock(i, qry, p) {
    return {
        start: i + 1,
        query: qry.trim(),
        end: -1,
        qType: getQType(qry),
        children: [],
        tabCount: getTabCount(qry),
        parent: p

    }
}


/**
 * Count no of tabs in the beginning of the
 * line.
 * @param {*} line 
 */
function getTabCount(line) {
    return parseInt(getSpaceCount(line) / 4);
    
    function getSpaceCount(line) {
        line = line.replace(/\t/g, '    ');
        var space = 0;
        for(var k = 0; k < line.length; k++) {
            if(line[k] != ' ') {
                break;
            }
            space++;
        }

        return space;
    }
}

/**
 * Get Query type.
 * 
 * @param {*} q 
 * @returns {type} :
 *  N: for nested objets
 *  A: for arrays
 *  E: for expressions
 *  C: for conjunction
 */
function getQType(q) {
    q = q.trim();
    var type = '';
    if (/:$/.test(q)) {
        type = 'N';
        if (/\[\]:$/.test(q)) {
            type = 'A';
        }
    } else if (q === '&&' || q === '||') {
        type = 'C';
    } else {
        type = 'E';
    }
    return type;
}     


module.exports.parse = parse;