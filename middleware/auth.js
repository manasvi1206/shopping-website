function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please log in to continue.');
  const target = req.originalUrl || '/';
  return res.redirect('/auth/login?redirect=' + encodeURIComponent(target));
}

function isAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') return next();
  req.flash('error', 'Admin portal requires administrator access. Please log in with admin credentials.');
  return res.redirect('/auth/login?redirect=/admin');
}

// Makes user info and global state available in all views
function loadUser(req, res, next) {
  res.locals.currentUser = req.session.userId
    ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
    : null;
  res.locals.cartCount = (req.session.cart || []).reduce((sum, i) => sum + i.quantity, 0);
  res.locals.currentPath = req.path;
  res.locals.isAdminUser = req.session && req.session.userRole === 'admin';
  next();
}

module.exports = { isAuthenticated, isAdmin, loadUser };
