var ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

module.exports.validateIP = function(valueTobeTested) {
    var result = ipPattern.test(valueTobeTested);
    return  {
        result,
        verb: !result ? 'Expected IP Address, found ' + valueTobeTested : ''
    }
}