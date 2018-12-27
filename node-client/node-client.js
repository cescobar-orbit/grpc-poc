const async = require('async');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/../idl/';

const stationDef = protoLoader.loadSync(PROTO_PATH + 'station.proto',{});
const stationProto = grpc.loadPackageDefinition(stationDef);

const client = new stationProto.noaa.StationService('localhost:50051',
	                               grpc.credentials.createInsecure()
);

function runStats(callback) {
  let call = client.get();
  call.on('data', (stat) => {
     console.log('Got message ... ', stat);
  });
  call.emit('data');
  call.on('end', callback);
 }

 function main() {
  async.series([
    runStats
  ]);
 }
 
 if(require.main === module) { 
    main();
 }

 exports.runStats = runStats;
