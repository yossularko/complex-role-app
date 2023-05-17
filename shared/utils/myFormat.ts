const myNumberFormat = (number: number) => {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    number
  );
};

const myCurrencyFormat = (curr: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(curr);
};

const myDateTimeFormat = (date: string | number | Date) => {
  return new Date(date).toLocaleString("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const myDateFormat = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const myTimeFormat = (time: string | number | Date) => {
  return new Date(time).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export {
  myNumberFormat,
  myCurrencyFormat,
  myDateTimeFormat,
  myDateFormat,
  myTimeFormat,
};
