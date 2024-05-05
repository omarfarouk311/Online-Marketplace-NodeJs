exports.getPageNotFound = (req, res) => {
    res.status(404).render('404', {
        pageTitle: 'page not found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });
};
