/**
 * Canditate Controller
 */

var CanditateController = {
  create: function (req, res) {

    // Check IMEI is valid
    Imei.findOne({
      id: req.param('imeiId')
    }).done(function (err, imei) {
      if (err)  return res.serverError(err);
      if (!imei) {
        return res.serverError({
          'status': 'error',
          'error': 'ImeiId not valid.'
        });
      }

      // Check if not already a winner
      if (imei.hasBeenDrawn) {
        return res.serverError({
          'status': 'error',
          'error': 'Sorry, you already won a gift. You can only participate once.'
        });
      }

      // Create Candidate
      Candidate.create({
        name: req.param('name'),
        email: req.param('email'),
        address: req.param('address'),
        postcode: req.param('postcode'),
        city: req.param('city'),
        imeiId: req.param('imeiId')
      }).done(function (err, candidate) {
        if (err) return res.serverError(err);
        res.send({
          'status': 'success',
          'message' : ''
        });
      });
    });
  }
};

module.exports = CanditateController;