const logger = require('../logger/logger');

function adminAuth(req, res, next) {
  try {
    if (req.session.user) {
      next();
    } else {
      var erro = 'Usuario não esta autenticado. For favor faça login';
      req.flash('erro', erro);
      logger.error(error);
      res.redirect('/login/index');
      return
    }
  } catch (error) {   
    logger.error(error);
    res.redirect('/login/index');
  }
}
module.exports = adminAuth;