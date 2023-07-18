const dns = require('dns');

const isValidUrl = (url) => {
  let domain;
  if(url.startsWith('http')){
    domain = url.split('://')[1];
    if(domain[domain.length - 1] === '/'){
      domain = domain.slice(0, -1);
    }

    dns.lookup(domain, (err, address, family) => {
      if(err) {
        return false;
      }
    });
    return true;
  }else {
    return false;
  }
}

module.exports = isValidUrl