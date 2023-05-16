class NormalizePhoneNumber {
  normalizePhoneNumber(phoneNumber, withCountryCode = false, countryCode = '62') {
    if (!phoneNumber) {
      return null;
    }

    let normalizePhoneNumber = phoneNumber.toString();

    normalizePhoneNumber = normalizePhoneNumber.replace(/ /g, '');

    const matches = normalizePhoneNumber.matchAll(/([0-9])/gi);

    normalizePhoneNumber = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      normalizePhoneNumber += match[0];
    }

    if (normalizePhoneNumber.indexOf('0') === 0) {
      normalizePhoneNumber = normalizePhoneNumber.replace('0', '');
    }

    const normalizeCountryCode = this.normalizeCountryCode(countryCode);
    if (withCountryCode && normalizePhoneNumber.indexOf(normalizeCountryCode) !== 0) {
      normalizePhoneNumber = `${normalizeCountryCode}${normalizePhoneNumber}`;
    } else if (withCountryCode === false && normalizePhoneNumber.indexOf(normalizeCountryCode) === 0) {
      normalizePhoneNumber = normalizePhoneNumber.replace(normalizeCountryCode, '');
    } else if (withCountryCode === false && normalizePhoneNumber.indexOf(`+${normalizeCountryCode}`) === 0) {
      normalizePhoneNumber = normalizePhoneNumber.replace(`+${normalizeCountryCode}`, '');
    }

    return normalizePhoneNumber;
  }

  normalizeCountryCode(countryCode) {
    if (!countryCode) {
      return null;
    }

    let normalizeCountryCode = countryCode.toString();

    normalizeCountryCode = normalizeCountryCode.replace(/ /g, '');

    const matches = normalizeCountryCode.matchAll(/([0-9])/gi);

    normalizeCountryCode = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      normalizeCountryCode += match[0];
    }

    return normalizeCountryCode.replace('+', '');
  }
}

module.exports = new NormalizePhoneNumber();
