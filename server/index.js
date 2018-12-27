
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

const PROTO_PATH = __dirname + '/../idl/';
const options = {
   keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
};
const stationDefinition = protoLoader.loadSync(PROTO_PATH + 'station.proto', options);
const stationProto = grpc.loadPackageDefinition(stationDefinition);

axios.defaults.headers.common['token'] = 'pmHbhmwZINiyFjSGPZDiMEyExwOerMJp';
axios.defaults.params = {};


const stations = function getNOAAStations(){
  try {
    axios.defaults.params['limit'] = 1000;
    //let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations');
    //console.log('stats ', res.data);
    let res = { "data": [
      {
        "id": "gcc.noaa.texas",
        "name": "ST001",
        "mindate": "2018-01-03",
        "maxdate": "2018-05-30",
        "elevation": "100",
        "elevationUnit": "meters",
        "longitude": "-22.3",
        "latitude": "30.20"
      },
      {
       "id": "gcc.noaa.nyc",
       "name": "ST002",
       "mindate": "2018-02-01",
       "maxdate": "2018-03-23",
       "elevation": "10",
       "elevationUnit": "meter",
       "longitude": "10.11",
       "latitude": "50.2"	      
      } 
     ]
    };
    //console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
 }


const getStations = (call, callback) => {
  
    const message = []; 
    stations().forEach((e) => {
          message.push({id: e.id, 
                        name: e.name,
	                mindate: e.mindate,
	                maxdate: e.maxdate,
	                elevation: e.elevation,
	                elevationUnit: e.elevationUnit,
	                longitude: e.longitude,
	                latitude: e.latitude
                       });
          });
    console.log(message);
    return message;              
   };

 

const server = new grpc.Server();
server.addService(stationProto.noaa.StationService.service, { 
    get: getStations,     
    send: (call, callback) => {}
});

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:50051');
server.start();

