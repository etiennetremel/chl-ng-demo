/**
 * Canditate Model
 */

 var Candidate = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    postcode: {
      type: 'string',
      required: true
    },
    city: {
      type: 'string',
      required: true
    },
    imeiId: 'string',
    giftId: 'string'
  }
};

module.exports = Candidate;