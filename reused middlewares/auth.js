exports.requireUser = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    next();
}

exports.restrictLogin = (req, res, next) => {
    if (req.session.isLoggedIn) return res.redirect('/');
    next();
}
