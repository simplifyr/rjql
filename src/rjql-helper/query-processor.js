module.exports.getQueryProcessor = function(qry) {
    var qrs = qry.split(/\n/);
    var index = 0;

    return {
        query: function () {
            if (index < qrs.length) {
                do {
                    var q = qrs[index].trim();
                    if (q.length == 0) {
                        index++;
                    } else {
                        return q;
                    }
                } while (index < qrs.length);

            }
            return null;
        },
        next: function () {
            index++;
            //console.log(qrs[index]);
        },
        hasNext: function () {
            return index < qrs.length;
        },
        getLineNo: function () {
            return index + 1;
        }
    }
}