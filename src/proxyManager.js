const proxies = [
  "http://user:pass@proxy1:8000",
  "http://user:pass@proxy2:8000",
  "http://user:pass@proxy3:8000"
];

let index = 0;

exports.getProxy = () => {
  const proxy = proxies[index % proxies.length];
  index++;
  return proxy;
};
