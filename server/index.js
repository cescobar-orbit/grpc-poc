
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


 async function getNOAAStations(){
  try {
    axios.defaults.params['limit'] = 1000;
    let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations');
    console.log('stats ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
 }

 async function getNOAADataCategories () {
  try {
    axios.defaults.params['limit'] = 1000;
    let res =  await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories');
    console.log('data categories: ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function getNOAADataSet() {
  try {
    axios.defaults.params['limit'] = 1000;	  
    let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets');
    console.log('dataset ', res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function getNOAARawData () {
  try {
    axios.defaults.params['datasetid'] = 'GSOM';
    axios.defaults.params['startdate'] = '2018-01-01';
    axios.defaults.params['enddate'] = '2018-02-28';
    axios.defaults.params['limits'] = 1000;

    let res = await axios.get('https://www.ncdc.noaa.gov:443/cdo-web/api/v2/data');
    console.log('raw data ', res.data);
    return res.data;

  } catch (error) {
    console.error(error);
  }
}

getNOAAStations();

getNOAADataCategories();

getNOAADataSet();

getNOAARawData();

const server = new grpc.Server();
server.addService(stationProto.noaa.StationService.service, { 
    insert: (call, callback) => { 
       let id = call.id;
       let name = call.name;
       let datacoverage = call.datacovergate;
       let elevation = call.elevation;
       let elevationUnit = call.elevationUnit;
       let mindate = call.mindate;
       let maxdate = call.maxdate;
       let longitude = call.longitude;
       let latitude  = call.latitude;
    }    
});

server.addService(dataCategoryProto.noaa.DataCategoryService.service, {
    send: (call, callback) => {
       let id = call.id;
       let name = call.name;
    }
});

server.addService(dataSetProto.noaa.DataSetService.service, {
   send: (call, callback) => {
      let uid = call.uid;
      let id = call.id; 
      let name = call.name;
      let datacoverage = call.datacoverage;
      let mindate = call.mindate;
      let maxdate = call.maxdate;
   }
});

server.addService(rawDataProto.noaa.RawDataService.service, {
   send: (call, callback) => {
      let date = call.date;
      let datatype = call.datatype;
      let station = call.station;
      let attributes = call.attributes;
      let value = call.value;
   }
});

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:50051');
server.start();

