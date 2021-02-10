import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const dayJS = dayjs;

export function getDayJs() {
  return dayJS();
}

export function getUnix() {
  return dayjs().unix();
}

export function getUnixFrom(number: number | undefined = 0) {
  const count = number.toString().length;
  const isMilliSeconds = count === 13;

  if (isMilliSeconds) {
    // https://day.js.org/docs/en/parse/unix-timestamp-milliseconds
    return dayjs(number).unix();
  }

  // https://day.js.org/docs/en/parse/unix-timestamp
  return dayjs.unix(number).unix();
}

export function getDayJSFrom(number: number | undefined = 0) {
  const count = number.toString().length;
  const isMilliSeconds = count === 13;

  if (isMilliSeconds) {
    // https://day.js.org/docs/en/parse/unix-timestamp-milliseconds
    return dayjs(number);
  }

  // https://day.js.org/docs/en/parse/unix-timestamp
  return dayjs.unix(number);
}
