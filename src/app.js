

var qry = `status = "500"
||
result[3]>ngoId = "111009"

`;


var rjql = require('./sahir');

var json = `{
	"status": 200,
	"message": "NGO's information",
	"result": [
		{
			"ngoId": 111001,
			"name": "We Donate",
			"founderName": "KP Poorna",
			"mobileNo": "9874563210",
			"discription": "testing testing",
			"country": "India",
			"state": "TS",
			"city": "Hyd",
			"locality": "Madhapur",
			"profilePic": ".../profile1.png"
		},
		{
			"ngoId": 111003,
			"name": "Socially India",
			"founderName": "KP Poorna",
			"mobileNo": "9874563210",
			"discription": "Providing Education",
			"country": "India",
			"state": "AP",
			"city": "Guntur",
			"locality": "Amaravati",
			"profilePic": ".../profile2.png"
		},
		{
			"ngoId": 111004,
			"name": "NGO 3",
			"founderName": "KP Poorna",
			"mobileNo": "9874563210",
			"discription": "Providing Food",
			"country": "India",
			"state": "TS",
			"city": "Warangal",
			"locality": "Warangal Rural",
			"profilePic": ".../profile3.png"
		},
		{
			"ngoId": 111005,
			"name": "NGO 4",
			"founderName": "KP Poorna",
			"mobileNo": "9874563210",
			"discription": "Providing Care",
			"country": "India",
			"state": "TS",
			"city": "Hyd",
			"locality": "Kukatpally",
			"profilePic": ".../profile4.png"
		}
	]
}`;

var r = rjql.consolidated(json, qry);

console.time('Done', r);



//var r = rjql.consolidated(json2, qry6);

//console.log(r);

console.timeEnd('Done');

//console.table(r.qbs);

