export const extractURL = (url: string): string => {
  const [protocol, _, host] = url.split("/");
  return protocol + "//" + host;
};
