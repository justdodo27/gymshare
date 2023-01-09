// // Uncomment to use localhost on a mobile emulator as a server
// const String serverUrlPrefix = 'http://10.0.2.2:8000/';


// // Uncomment to use localhost on a web browser as a server
// const String serverUrlPrefix = 'http://localhost:1337/';

// Uncomment to use production server
const String serverUrlPrefix = 'https://gymshare-production.up.railway.app/';

String buildUrl(String endpointName) => '$serverUrlPrefix$endpointName';
