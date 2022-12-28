// // Uncomment to use localhost on a mobile as a server

const String serverUrlPrefix = 'http://127.0.0.1:1337/';


// // Uncomment to use localhost on a web browser as a server
// const String serverUrlPrefix = 'http://localhost:1337/';

String buildUrl(String endpointName) => '$serverUrlPrefix$endpointName';
