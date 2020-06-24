const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
    return function(req, res, next) {
        if(!req.user || (req.user && !req.user.scopes)) {
            next(boom.unauthorized('Missing scopes'));
        }

        const hasAccess = allowedScopes
            .map(scope => req.user.scopes.includes(scope))
            .find(scope => Boolean(scope));

        if(hasAccess) {
            next();
        } else {
            next(boom.unauthorized('Insuficient scopes'))
        }
    }
}

module.exports = scopesValidationHandler;