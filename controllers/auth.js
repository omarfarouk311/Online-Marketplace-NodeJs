exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    req.session.userId = '662d1f851af4b49fbe4f576c';
    req.session.isLoggedIn = true;
    req.session.save(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}
