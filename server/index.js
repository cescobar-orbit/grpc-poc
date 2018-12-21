
const PROTO_PATH = __dirname + '/../idl/';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const statProto = grpc.load(PROTO_PATH +'station.proto');


//console.log('PATH ', PROTO_PATH) 
// Suggested options for similarity to existing grpc.load behavior
/*var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

console.log('packageDefinition ', packagDefinition) 

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
*/

// The protoDescriptor object has the full package hierarchy
//let station = protoDescriptor.station;
//let dataCategory = protoDescriptor.datacategory;
//let dataSet = protoDescriptor.dataset
//let rawData = protoDescriptor.rawdata



const axios = require('axios');
  
axios.defaults.headers.common['token'] = 'pmHbhmwZINiyFjSGPZDiMEyExwOerMJp'
axios.defaults.params = { }


 async function getNOAAStations(){
  try {
    axios.defaults.params['limit'] = 1000
    let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations')
    console.log('stats ', res.data)
    return res.data
  } catch (error) {
    console.error(error)
  }
 }

 async function getNOAADataCategories () {
  try {
    axios.defaults.params['limit'] = 1000
    let res =  await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories')
    console.log('data categories: ', res.data)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

async function getNOAADataSet() {
  try {
    axios.defaults.params['limit'] = 1000	  
    let res = await axios.get('https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets')
    console.log('dataset ', res.data)
    return res.data
  } catch (error) {
    console.error(error)
  }
}

async function getNOAARawData () {
  try {
    axios.defaults.params['datasetid'] = 'GSOM'
    axios.defaults.params['startdate'] = '2018-01-01'
    axios.defaults.params['enddate'] = '2018-02-28'
    axios.defaults.params['limits'] = 1000

    let res = await axios.get('https://www.ncdc.noaa.gov:443/cdo-web/api/v2/data')
    console.log('raw data ', res.data)
    return res.data

  } catch (error) {
    console.error(error)
  }
}

getNOAAStations()

getNOAADataCategories()

getNOAADataSet()

getNOAARawData()

const server = new grpc.Server()
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Server running at http://127.0.0.1:50051')
server.start()
