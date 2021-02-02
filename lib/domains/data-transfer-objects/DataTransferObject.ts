export const DataTransferObject = {
  encode(data: any) {
    return unescape(encodeURIComponent(JSON.stringify(data)));
  },

  decode(data: any) {
    return JSON.parse(decodeURIComponent(escape(data)));
  },
};
