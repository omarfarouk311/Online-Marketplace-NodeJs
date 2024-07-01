exports.get403 = (req, res, next) => {
    res.render('errors/403', {
        pageTitle: 'Forbidden',
        path: '/403'
    });
};

exports.get404 = (req, res, next) => {
    res.render('errors/404', {
        pageTitle: 'Page not found',
        path: '/404',
    });
};

exports.get500 = (req, res, next) => {
    res.render('errors/500', {
        pageTitle: 'Error',
        path: '/500'
    });
};

exports.errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err.message);

    if (!('isAuthenticated' in res.locals)) {
        res.locals.isAuthenticated = false;
    }

    if (err.statusCode === 403) {
        return this.get403(req, res, next);
    }

    if (err.statusCode === 404) {
        return this.get404(req, res, next);
    }

    return this.get500(req, res, next);
};