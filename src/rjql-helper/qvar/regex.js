module.exports.validateRegex = function(valueToBeTested, QVE) {
    var regexPattern = QVE.replace(/\$regex{\/?/, '').replace(/\/?}$/, '');
    var regex = new RegExp(regexPattern);
    var result = regex.test(valueToBeTested);
    return {
        result,
        verb: !result ? '<b>' + valueToBeTested + '</b> doesn\'t match the regex pattern specified' : ''
    }
}