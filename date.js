let date = {};
date.getDateIndonesia = (date, jam = true) => {
  var currentDate = new Date(date);
  var day = currentDate.getDate().toString().padStart(2, '0');
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var year = currentDate.getFullYear();
  var jam = currentDate.getHours();
  var menit = currentDate.getMinutes();

  if (jam == true) {
    var resDate = `${day}-${month}-${year} ${jam}:${menit}`;
    return resDate;
  } else {
    var resDate = `${day}-${month}-${year}`;
    return resDate;
  }
};
date.getDateIndonesiaNotJam = (date) => {
  var currentDate = new Date(date);
  var day = currentDate.getDate().toString().padStart(2, '0');
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var year = currentDate.getFullYear();

  var resDate = `${day}-${month}-${year}`;
  return resDate;
};

date.getDateUSA = (date, jam = true) => {
  var currentDate = new Date(date);
  var day = currentDate.getDate().toString().padStart(2, '0');
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var year = currentDate.getFullYear();
  var jam = currentDate.getHours();
  var menit = currentDate.getMinutes();

  if (jam == true) {
    var resDate = `${day}-${month}-${year} ${jam}:${menit}`;
    return resDate;
  } else {
    var resDate = `${year}-${month}-${day}`;
    return resDate;
  }
};

date.getDateUSANotJam = (date) => {
  var currentDate = new Date(date);
  var day = currentDate.getDate().toString().padStart(2, '0');
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var year = currentDate.getFullYear();
  var resDate = `${year}-${month}-${day}`;
  return resDate;
};

date.UTCnow = () => {
  const timeZoneOffset = 7 * 60;
  let currentDate = new Date();
  // currentDate = new Date(currentDate.getTime() + timeZoneOffset * 60000)

  return currentDate;
};
date.UTCnowGM7 = () => {
  const timeZoneOffset = 7 * 60;
  let currentDate = new Date();
  currentDate = new Date(currentDate.getTime() + timeZoneOffset * 60000);

  return currentDate;
};

module.exports = date;
