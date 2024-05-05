exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = async (req, res, next) => {
    req.session.userId = '662d1f851af4b49fbe4f576c';
    req.session.isLoggedIn = true;
    res.redirect('/');
}
