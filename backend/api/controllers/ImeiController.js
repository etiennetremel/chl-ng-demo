/**
 * Imei Controller
 */

var ImeiController = {
  check: function (req, res) {
    Imei.findOne({
      imei: req.param('imei')
    }).done(function (err, imei) {
      if (err) return res.serverError(err);

      if (imei) {
        res.send({
          'status': 'success',
          'id': imei.id
        });
      } else {
        res.send({
          'status': 'error',
          'error': 'IMEI invalid'
        }, 500);
      }
    });
  }
};

module.exports = ImeiController;