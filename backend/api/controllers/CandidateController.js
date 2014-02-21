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

      if (imei) {
        // Check if not already a winner
        if (imei.hasBeenDrawn) {
          return res.send({
            'status': 'error',
            'error': 'Sorry, you already won a gift. You can only participate once.'
          }, 500);
        }

        // Check if candidate already applied today
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        var start = new Date(date);

        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);

        var end = new Date(date);

        Candidate.findOne({
          imeiId: req.param('imeiId'),
          createdAt: {
            '$gt': start,
            '$lt': end
          }
        }).done(function (err, candidate) {

          if (candidate) {
            res.send({
              'status': 'error',
              'error': 'Your are already in the draw.'
            }, 500);
          } else {

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
                'message': ''
              });
            });
          }
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

module.exports = CanditateController;