

var qry = `keys>length = "1"
`;


var rjql = require('./sahir');

var json = `{
	"keys": []
}`;

var r = rjql.consolidated(json, qry);

console.time('Done', r);



//var r = rjql.consolidated(json2, qry6);

//console.log(r);

console.timeEnd('Done');

//console.table(r.qbs);

