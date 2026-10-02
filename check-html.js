const http = require('http');
http.get('http://localhost:3000/buy', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<img[^>]+alt="Luxurious Corner Plot House in F-11"[^>]*>/i);
    console.log(match ? match[0] : 'Not found');
  });
}).on('error', console.error);
