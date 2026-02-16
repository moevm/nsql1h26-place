#!/bin/bash

mongosh <<EOF
use shrooms;
db.createCollection("maps");
db.maps.insertMany([{ userid: "user123" }, { userid: "user456" }])
EOF