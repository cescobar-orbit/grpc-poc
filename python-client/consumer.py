import sys
import random
import grpc

import station_pb2 as station
import station_pb2_grpc as rpc

def get_stations(stub):
    print("Calling get_stations")
    try:
        responses = stub.get(station.Empty())
        if responses:
            for response in responses:
                print(response.station.name)
     
    except:
        print("Unexpected error: ", sys.exc_info()[0])
        raise
     
def run():
    channel = grpc.insecure_channel('localhost:50051')
    try:
        grpc.channel_ready_future(channel).result(timeout=10)
    except grpc.FutureTimeoutError:
        sys.exit('Error connecting to server')
    else:
        stub = rpc.StationServiceStub(channel)
        print("------------- GetStations Streaming -------")
        get_stations(stub)



if __name__ == '__main__':
    run()
