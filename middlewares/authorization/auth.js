exports.requireUser = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    return next();
}

exports.restrictLogin = (req, res, next) => {
    if (req.session.userId) return res.redirect(req.headers.referer || '/');
    return next();
}

exports.restrictLogout = (req, res, next) => {
    if (!req.session.userId) return res.redirect(req.headers.referer || '/');
    return next();
}