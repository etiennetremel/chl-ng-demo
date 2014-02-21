/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var fs = require('fs'),
    schedule = require('node-schedule'),
    nodemailer = require('nodemailer'),
    imeiFile = __dirname + '/seed/imei.json',
    giftFile = __dirname + '/seed/gift.json';

module.exports.bootstrap = function (next) {

  // Seed datas to DB from JSON
  Imei.find().done(function (err, imei) {
    if (err) console.log(err);

    if (imei.length === 0) {
      console.info('Seed datas...');
      async.parallel({
        imei: function (callback) {
          fs.readFile(imeiFile, 'utf8', function (err, imeiData) {
            if (err) console.log('Error: ', err);
            Imei.createEach(JSON.parse(imeiData)).done(function (err, data) {
              if (err) console.log('Error: ', err);
              callback();
            });
          });
        },
        gift: function (callback) {
          fs.readFile(giftFile, 'utf8', function (err, giftData) {
            if (err) console.log('Error: ', err);

            Gift.createEach(JSON.parse(giftData)).done(function (err, d) {
              if (err) console.log('Error: ', err);
              callback();
            });
          });
        }
      }, function(err, results) {
        if (err) console.log('Error: ', err);
        console.info('... done');
        next();
      });
    } else {
      next();
    }
  });


  // Setup Cron everyday at 0:00am;
  var rule = new schedule.RecurrenceRule();
  //rule.hour = 0;
  rule.minute = 4;

  var j = schedule.scheduleJob(rule, function () {

    console.log('Picking candidate....');

    // Pick only candidate subscribed during the previous day
    var date = new Date();

    // Today (for test purpose) day
    date.setDate(date.getDate());

    // Should be previous day because we are picking the day before
    // date.setDate(date.getDate() - 1);

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    var start = new Date(date);

    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);

    var end = new Date(date);

    Candidate.find({
      createdAt: {
        '$gt': start,
        '$lt': end
      }
    }).done(function (err, n) {

      Candidate.find({
        createdAt: {
          '$gt': start,
          '$lt': end
        }
      }).skip(Math.random()*(n.length-1)).limit(1).done(function (err, candidate) {
        if (err) console.log('Error:', err);

        candidate = candidate[0];

        if (!candidate) {
          return console.log('No candidates');
        }

        console.log('Winner..... will.... beee...., congratulation', candidate.name);

        // Email Candidate

        // Setup transport
        var smtpTransport = nodemailer.createTransport('SMTP',{
          service: sails.config.mail.service,
          auth: {
            user: sails.config.mail.user,
            pass: sails.config.mail.pass
          }
        });

        // Fetch Template
        // to do...

        // Setup Email
        var mailOptions = {
          from: sails.config.mail.from,
          to: 'etienne.tremel@orange.fr',
          subject: 'Your free Samsung Galaxy Gift',
          text: 'Your free Samsung Galaxy Gift',
          html: 'Test'
        };

        // Send email with defined transport object
        smtpTransport.sendMail(mailOptions, function(err, res){
          if (err) {
            console.log('Error: ', err);
          } else {
            console.log('Message sent: ', res.message);
          }

          smtpTransport.close();
        });

        // Update candidate with Gift Id
        date =  ('0' + (start.getMonth() + 1)).slice(-2) + '/' + ('0' + start.getDate()).slice(-2) + '/' + start.getFullYear();

        Gift.findOne({
          date: date
        }).done(function (err, gift) {
          if (err) console.log('Error: ', err);

          if (gift) {
            candidate.giftId = gift.id;
            Candidate.update(candidate.id, candidate, function (err, candidate) {
              if (err) {
                console.log('Error: ', err);
              } else {
                console.log('Candidate updated');
              }
            });
          }
        });

        // Update IMEI
        Imei.update(candidate.imeiId, {hasBeenDrawn: true}).done(function (err, imei) {
          if (err) {
            console.log('Error: ', err);
          } else {
            console.log('Imei updated');
          }
        });
      });
    });
  });

};