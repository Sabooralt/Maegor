import { formatDistanceToNow } from "date-fns";

export const formatDateToIso = (date) => {
  const distance = formatDistanceToNow(new Date(date), { addSuffix: true });

  const replacements = {
    "about ": "",
    "less than a minute ago": "1m",
    "minute ago": "1m",
    "minutes ago": "m",
    "hour ago": "1h",
    "hours ago": "h",
    "day ago": "1d",
    "days ago": "d",
    "month ago": "1mo",
    "months ago": "mo",
    "year ago": "1y",
    "years ago": "y",
    ago: "",
  };

  return Object.keys(replacements).reduce((str, key) => {
    return str.replace(new RegExp(key, "g"), replacements[key]);
  }, distance);
};
