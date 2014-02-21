/**
 * Gift Controller
 */

var GiftController = {

  // Get gift of the day
  find: function (req, res) {
    var today = new Date(),
        date =  ('0' + (today.getMonth() + 1)).slice(-2) + '/' + ('0' + today.getDate()).slice(-2) + '/' + today.getFullYear();

    Gift.findOne({
      date: date
    }).done(function (err, gift) {
      if (err) return res.serverError(err);

      if (gift) {
        res.send({
          'status': 'success',
          'gift': gift
        });
      } else {
        res.send({
          'status': 'error',
          'error': 'No gift available'
        }, 500);
      }
    });
  }
};

module.exports = GiftController;