// // Uncomment to use localhost on a mobile as a server
const String serverUrlPrefix = 'http://10.0.2.2:1337/';

// // Uncomment to use localhost on a web browser as a server
// const String serverUrlPrefix = 'http://localhost:1337/';

String buildUrl(String endpointName) => '$serverUrlPrefix$endpointName';
