var uuidPattern = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/;

module.exports.validateUUID = function(valueTobeTested) {
    var result = uuidPattern.test(valueTobeTested);
    return  {
        result,
        verb: !result ? 'Expected UUID, found ' + valueTobeTested : ''
    }
}