const Trip = require("../api/models/trip.model");
const User = require("../api/models/user.model");
var FCM = require('fcm-node');
const { fcmServerKey } = require("../config/vars");

module.exports = function (agenda) {
  agenda.define('send notification', async job => {
    console.log(job.attrs.data);
    let trip = await Trip.get(job.attrs.data.id);
    let user = await User.get(job.attrs.data.user_id);
    let chks = trip.check_list.filter(e => !e.checked);
    if (chks.length) {
      console.log("Pending items in checklist. You have only 3 days");
      var fcm = new FCM(fcmServerKey);
      console.log("tokens", user.tokens);
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: user.tokens,
        notification: {
          title: `Trip to ${trip.name} is in ${job.attrs.data.days} days`,
          body: 'There are pending items in checklist.',
          image: 'http://www.pngall.com/wp-content/uploads/2016/05/Vacation-Free-Download-PNG.png'
        },
        data: {
          id: trip.id,
          title: `Trip to ${trip.name} is in ${job.attrs.data.days} day${job.attrs.data.days == 1 ? '' : 's'}`,
          body: 'There are pending items in checklist.',
        }
      };

      fcm.send(message, function (err, response) {
        if (err) {
          console.log(message);
          console.log(err);
          console.log(JSON.stringify(err), "Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    } else {
      console.log("All set!!!")
    }
  });
};