const { BASE_URL } = process.env;
/**
 * @param {date} Date
 * @return {formatted string}
 */
export function formatDate(date) {
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear().toString().substring(2);

  return `${day}.${month}.${year}`;
}

/**
 * @param {String} src
 * @returns {String} full image path
 */
export function imagePath(src) {
  return `${BASE_URL}${src}`;
}

export function fullName(person) {
  let name = [];

  if (person && person.firstName) {
    name.push(person.firstName);
  }

  if (person && person.lastName) {
    name.push(person.lastName);
  }

  if (name.length) {
    return name.join(' ');
  }

  return '';
}

export function formatNumber(number) {
  if (number > 9999) {
    return `${(number / 1000).toFixed(number % 1000 !== 0)} k`;
  } else if (number > 9999999) {
    return `${(number / 1000000).toFixed(number % 1000000 !== 0)} m`;
  }

  return `${number} `;
}

/**
 * Find boundary that contains all coordinates
 * @param {Array} coordinates
 * @returns {Object} lat, lng of nw and se
 */
export function computeLatLngBound(locations) {
  let n;
  let s;
  let e;
  let w;

  locations.forEach((location, i) => {
    if (i === 0) {
      n = location.latitude;
      s = location.latitude;
      e = location.longitude;
      w = location.longitude;
    } else {
      if (n < location.latitude) {
        n = location.latitude;
      }

      if (s > location.latitude) {
        s = location.latitude;
      }

      if (e < location.longitude) {
        e = location.longitude;
      }

      if (w > location.longitude) {
        w = location.longitude;
      }
    }
  });

  return {
    nw: { lat: n, lng: w },
    se: { lat: s, lng: e }
  };
}
