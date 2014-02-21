/**
 * Imei Controller
 */

var ImeiController = {
  check: function (req, res) {
    Imei.findOne({
      imei: req.param('imei')
    }).done(function (err, imei) {
      if (err) return res.serverError(err);
      res.send({
        'status': 'success',
        'id': imei.id
      });
    });
  }
};

module.exports = ImeiController;