module.exports = ({ country, date, page }) => {
  const offset = (page - 1) * 25;
  return `https://www.booking.com/searchresults.html?ss=${country}&checkin=${date}&offset=${offset}`;
};
