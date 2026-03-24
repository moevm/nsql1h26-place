#!/bin/bash

mongosh <<EOF
use shrooms;

db.createCollection("users");
db.createCollection("maps");
db.createCollection("mapobjects");
db.createCollection("tags");

db.tags.insertMany([
{
    _id: ObjectId("000000000000000000000011"),
    name: "черника",
    image_path: "berry.png"
},
{
    _id: ObjectId("000000000000000000000012"),
    name: "подосиновик",
    image_path: "shroom.png"
},
{
    _id: ObjectId("000000000000000000000013"),
    name: "бабочка",
    image_path: "butterfly.png"
}
]);

db.maps.insertMany([
{
    _id: ObjectId("000000000000000000000101"),
    user_id: ObjectId("000000000000000000000001"),
    name: "Карта подосиновиков",
    description: "На этой карте находятся все подосиновики в районе.",
    area: "Свердловское городское поселение",
    location: {
        type: "Point",
        coordinates: [59.773007, 30.775178]
    },
    visible: true,
    tags: [
        ObjectId("000000000000000000000011"),
        ObjectId("000000000000000000000013")
    ],
    created_at: ISODate("2026-03-01T10:00:00.389Z"),
    updated_at: null,
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000102"),
    user_id: ObjectId("000000000000000000000001"),
    name: "Ягодная карта",
    description: "Тут собраны все ягоды местности.",
    area: "Гатчинский муниципальный округ",
    location: {
        type: "Point",
        coordinates: [59.598731, 29.677867]
    },
    visible: true,
    tags: [
        ObjectId("000000000000000000000011")
    ],
    created_at: ISODate("2026-03-04T10:00:00.389Z"),
    updated_at: ISODate("2026-03-04T12:00:00.389Z"),
    image_path: "map_icon.png"
}
]);

db.mapobjects.insertMany([
{
    _id: ObjectId("000000000000000000000201"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Маршрут с подосиновиками",
    type: "Route",
    description: "Тут прямо очень много подосиновиков",
    tags: [
        ObjectId("000000000000000000000012")
    ],
    created_at: ISODate("2026-03-10T10:00:00.389Z"),
    updated_at: null,
    location: {
        type: "LineString",
        coordinates: [
            [ 59.787504, 30.773917],
            [ 59.788627, 30.778359],
            [ 59.788287, 30.777903]
        ]
    },
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000202"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Маршрут с маленькими подосиновиками",
    description: "Тут только маленькие подосиновики",
    type: "Route",
    tags: [
        ObjectId("000000000000000000000012")
    ],
    created_at: ISODate("2026-03-15T10:00:00.389Z"),
    updated_at: ISODate("2026-03-15T13:10:00.389Z"),
    location: {
        type: "LineString",
        coordinates: [
            [ 59.780151, 30.756108],
            [ 59.780529, 30.757449],
            [ 59.780805, 30.757835],
        ]
    },
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000301"),
    map_id: ObjectId("000000000000000000000101"),
    type: "Point",
    name: "Подосиновик",
    description: "Прямо-таки огромный подосиновик",
    tag: ObjectId("000000000000000000000012"),
    created_at: ISODate("2026-03-15T10:00:00.389Z"),
    updated_at: null,
    location: {
        type: "Point",
        coordinates: [ 59.778860, 30.751258 ]
    },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000302"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Подосиновик",
    type: "Point",
    description: "Какой-то подозрительный подосиновик",
    tag: ObjectId("000000000000000000000012"),
    created_at: ISODate("2026-03-17T10:00:00.389Z"),
    updated_at: null,
    location: {
        type: "Point",
        coordinates: [ 59.779850, 30.753382 ]
    },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000303"),
    map_id: ObjectId("000000000000000000000102"),
    name: "Черника",
    type: "Point",
    description: "На третьем кусте справа много черники",
    tag: ObjectId("000000000000000000000011"),
    created_at: ISODate("2026-03-12T10:00:00.389Z"),
    updated_at: null,
    location: {
        type: "Point",
        coordinates: [ 59.597511, 29.684275 ]
    },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000401"),
    map_id: ObjectId("000000000000000000000102"),
    name: "Черничная поляна",
    type: "Area",
    description: "Все усыпано черникой",
    tags: [
        ObjectId("000000000000000000000011")
    ],
    created_at: ISODate("2026-03-20T10:00:00.389Z"),
    updated_at: null,
    location: {
        type: "Polygon",
        coordinates: [[[ 59.778860, 30.751252 ], [ 59.778860, 30.751258 ]], [[ 59.778860, 30.751252 ], [ 59.778860, 30.751258 ]]]
    },
    image_path: "area_icon.png"
}
]);

EOF