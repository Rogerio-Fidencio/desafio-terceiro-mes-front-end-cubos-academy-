import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function capitalizeWord(word) {
  return word[0].toUpperCase() + word.slice(1, word.length);
}

export function formatToMoney(value) {
  const valueAsANumber = Number(value);

  return valueAsANumber.toLocaleString('pt-br', {
    style: 'currency', currency: 'BRL'
  });
}

export function formatToDate(date) {
  const generateDate = new Date(date);

  return format(generateDate, 'dd/MM/yyyy');
}

export function formatToWeekDay(date) {
  return format(date, 'eee', {
    locale: ptBR
  });
}