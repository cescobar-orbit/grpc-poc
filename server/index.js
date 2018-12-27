
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

const PROTO_PATH = __dirname + '/../idl/';
const stationDefinition = protoLoader.loadSync(PROTO_PATH + 'station.proto', {});
const stationProto = grpc.loadPackageDefinition(stationDefinition);

const dataCategoryDefinition = protoLoader.loadSync(PROTO_PATH + 'datacategory.proto', {});
const dataCategoryProto = grpc.loadPackageDefinition(dataCategoryDefinition);

const dataSetDefinition = protoLoader.loadSync(PROTO_PATH + 'dataset.proto', {});
const dataSetProto = grpc.loadPackageDefinition(dataSetDefinition);

const rawDataDefinition = protoLoader.loadSync(PROTO_PATH + 'rawdata.proto', {});
const rawDataProto = grpc.loadPackageDefinition(rawDataDefinition);

  
axios.defaults.headers.common['token'] = 'pmHbhmwZINiyFjSGPZDiMEyExwOerMJp';
axios.defaults.params = {};


const stations = async function getNOAAStations(){
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

const dataCategories = async function getNOAADataCategories () {
  try {
    axios.defaults.params['limit'] = 1000;
    let res =  await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories');
    //console.log('data categories: ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

const dataSet = async function getNOAADataSet() {
  try {
    axios.defaults.params['limit'] = 1000;	  
    let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets');
    //console.log('dataset ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

const rawData = async function getNOAARawData () {
  try {
    axios.defaults.params['datasetid'] = 'GSOM';
    axios.defaults.params['startdate'] = '2018-01-01';
    axios.defaults.params['enddate'] = '2018-02-28';
    axios.defaults.params['limits'] = 1000;

    let res = await axios.get('https://www.ncdc.noaa.gov:443/cdo-web/api/v2/data');
    //console.log('raw data ', res.data);
    return res.data;

  } catch (error) {
    console.error(error);
  }
}

//setTimeout(stations, 1000);
//setTimeout(dataCategories, 2000);
//setTimeout(dataSet, 3000);
//setTimeout(rawData, 4000);


const server = new grpc.Server();
server.addService(stationProto.noaa.StationService.service, { 
    get: (call, callback) => {
	stations().then((s) => { 
	   s.forEach((i) => {
	     call.write({id: i.id, 
		         name: i.name, 
		         mindate: i.mindate, 
		         maxdate: i.maxdate,
		         elevation: i.elevation,
		         elevationUnit: i.elevationUnit,
		         longitude: i.longitude,
		         latitude: i.latitude
	      });
	   }); 
	});
	call.end();
    }, 
   send: (call, callback) => {
   
   }
});

server.addService(dataCategoryProto.noaa.DataCategoryService.service, {
    get:(call, callback) => {
         setTimeout(dataCategories, 1000, (data) => {
	     data.forEach((e) => { 
	       console.log('pushing data categories ...', e);
	       return e;
	     });
	 }); 
    },
    send: (call, callback) => {
       //NOTE: This method is not implemented because the server's escence is to provide date to clients.
    }
});

server.addService(dataSetProto.noaa.DataSetService.service, {
     get: (call, callback) => {
          setTimeout(dataSet, 1000, (e) => {
	     console.log('pushing data set ...', e);
	     return e;
	  });
     },
   send: (call, callback) => {
     //NOTE: This method is not implemented because the server escence is to provide date to client.
   }
});

server.addService(rawDataProto.noaa.RawDataService.service, {
   get: (call, callback) => {
      setTimeout(rawData, 1000, (e) => {
         console.log('pushing rawdata ...', e);
	 return e;
      });
   },
  send: (call, callback) => {
    //Note: This method is not implemented because the server escence is to provide date to clients.
  }
});

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:50051');
server.start();

