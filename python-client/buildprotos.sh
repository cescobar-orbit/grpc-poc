#!/usr/bin/env bash

python3 -m grpc_tools.protoc -I ../idl/ --python_out=. --grpc_python_out=. ../idl/*.proto

