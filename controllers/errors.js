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
}