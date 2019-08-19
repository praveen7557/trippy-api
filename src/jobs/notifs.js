const Trip = require("../api/models/trip.model");

module.exports = function (agenda) {
  agenda.define('send notification', async job => {
    console.log(job.attrs.data);
    let trip = await Trip.get(job.attrs.data.id);
    let chks = trip.check_list.filter(e => !e.checked);
    if (chks.length) {
      console.log("Pending items in checklist. You have only 3 days");
    } else {
      console.log("All set!!!")
    }
  });
};