// https://github.com/jaredhanson/passport/issues/683#issuecomment-405441573

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_msg', 'Not authorised')
  res.redirect('/users/login')
}
