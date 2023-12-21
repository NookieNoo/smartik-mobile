import { MaskService } from 'react-native-masked-text';

export const plural = (count, words) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return (
    count + ' ' + words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]]
  );
};
export const formatPrice = (int, round = false) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: round ? 0 : 2,
  })
    .format(int)
    .replace(',', '.')
    .replace(' ₽', '₽');
};
export const formatIntegerPrice = (int) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(Math.floor(int));
};
export const formatDate = (date) => {
  return MaskService.toMask('datetime', date, {
    format: 'DD.MM.YYYY',
  });
};
