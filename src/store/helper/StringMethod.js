function join(arr /*, separator */) {
  let separator = arguments.length > 1 ? arguments[1] : '';
  return arr
    .filter(function (n) {
      return n;
    })
    .join(separator);
}

export const prettyDaDataAddress = (address = {}) => {
  let str = '';
  if ((address.region || address.area) && !address.city && !address.settlement) {
    return '';
  } else {
    str = join([
      join([address.street], ' '),
      ' ',
      join([address.house_type, address.house, address.block_type, address.block], ' '),
      join([address.settlement_type, address.settlement], ' '),
      (address.city !== address.region && join([address.city_type, address.city], ' ')) || '',
    ]);
  }

  str = str.replace(/д /i, 'д');
  str = str.replace(/к /i, 'к');
  str = str.replace(/стр /i, 'с');

  return str;
};

export const prettyDaDataAddressSuggest = (address = {}) => {
  let str = '';
  if ((address.region || address.area) && !address.city && !address.settlement) {
    return '';
  } else {
    str = join([
      address.street_with_type + ' ',
      join([address.house], ','),
      join([address.block_type, address.block], ''),
    ]);
  }

  str = str.replace(/стр/i, 'c');
  str = str.replace(/корп/i, 'к');
  str = str.replace(/ул /i, '');

  return str;
  /*if ((address.region || address.area) && !address.city && !address.settlement) {
		return ""
	} else {
		return join([
			address.settlement_with_type,
			address.street_with_type + " ",
			join([address.house,
				address.block_type, address.block], ". ")
		])
	}*/
};
