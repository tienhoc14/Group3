//custom middleware
function requireAdmin(req, res, next) {
    if (req.session["Admin"]) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function requireStaff(req, res, next) {
    if (req.session["Staff"]) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function requireCoordinator(req, res, next) {
    if (req.session["Coordinator"]) {
        return next()
    } else {
        res.redirect('/login')
    }
}

function requireManager(req, res, next) {
    if (req.session["Manager"]) {
        return next()
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    requireAdmin,
    requireCoordinator,
    requireManager,
    requireStaff
}