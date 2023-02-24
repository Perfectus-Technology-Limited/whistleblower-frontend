export const truncateText = (text, length = 50) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
}

export const shortenEthAddress = (address, sliceValue, maxLength = 10) => {
  if (address.length < maxLength) return address;

  const firstPart = address.slice(0, sliceValue);
  const lastPart = address.slice(-sliceValue);
  const middlePart = '...';
  const shortenedAddress = `${firstPart}${middlePart}${lastPart}`;

  return shortenedAddress;
}