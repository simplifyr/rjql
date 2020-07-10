module.exports.validateSort = function(resultArray, QVE) {
    var clonedArray = resultArray.slice(0);
    var propertyToSort = /^\$[ad]sort({(\w+)})?$/.exec(QVE)[1];
    var ascendingOrder = /asort/.test(QVE);

    if(!clonedArray) {
        return {
            result: false,
            verb: 'Expected an array, found ' + clonedArray 
        };
    } else if(clonedArray.length <= 1) {
        return {
            result: clonedArray.length == 0 ? false : true,
            verb: clonedArray.length == 0 ? 'Empty array found' : ''
        }
    }

    if(propertyToSort) {
        if (typeof (clonedArray[0][propertyToSort]) === 'string') {
            clonedArray.sort(function (a, b) {
                if(a[propertyToSort] < b[propertyToSort]) {
                    return ascendingOrder ? -1 : 1;
                } else if(a[propertyToSort] > b[propertyToSort])  {
                    return ascendingOrder ? 1 : -1;
                } else {
                    return 0;
                }
            });
        } else {
            clonedArray.sort(function (a, b) {
                return ascendingOrder ? 
                    (a[propertyToSort] - b[propertyToSort]) :
                     (b[propertyToSort] - a[propertyToSort]);
            })
        }

    } else {
        //write for array of primitives
        if(typeof(clonedArray[0])==='string') {
			ascendingOrder? clonedArray.sort(): clonedArray.reverse();
	    }
		else {
			clonedArray.sort(function(a,b) {
				return ascendingOrder ? a - b : b - a;
		    });
		}
    }
   
    var result = isEqual(resultArray, clonedArray, propertyToSort);
    return {
        result,
        verb: !result ? ('Expected the array to be sorted in <b>' + 
                (ascendingOrder ? 'ascending' : 'descending') + '</b> order ' +
                 (propertyToSort ? ' based on property <b>"' + propertyToSort + '"</b>' : '')) : ''
    }
}

function isEqual(resultArray, clonedArray, propertyToSort) {
    var equal = true;
    if(propertyToSort) {
        for (var i = 0; i < resultArray.length; i++) {
            if (resultArray[i][propertyToSort] != clonedArray[i][propertyToSort]) {
                equal = false;
                break;
            }
        }
    } else {
        for (var i = 0; i < resultArray.length; i++) {
            if (resultArray[i] != clonedArray[i]) {
                equal = false;
                break;
            }
        }
    }   
    return equal;
}
