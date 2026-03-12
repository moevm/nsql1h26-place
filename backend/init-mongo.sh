#!/bin/bash

mongosh <<EOF
use shrooms;

db.createCollection("users");
db.createCollection("maps");
db.createCollection("routes");
db.createCollection("points");
db.createCollection("areas");
db.createCollection("tags");


db.users.insertMany([
{
    _id: ObjectId("000000000000000000000001"),
    username: "Joku_Jokkunen",
    password: "123",
    image_path: "cheliks.png"
}
]);

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
    country: "Россия",
    area: "Свердловское городское поселение",
    coordinates: { x: 59.773007, y: 30.775178 },
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
    country: "Россия",
    area: "Гатчинский муниципальный округ",
    coordinates: { x: 59.598731, y: 29.677867 },
    visible: true,
    tags: [
        ObjectId("000000000000000000000011")
    ],
    created_at: ISODate("2026-03-04T10:00:00.389Z"),
    updated_at: ISODate("2026-03-04T12:00:00.389Z"),
    image_path: "map_icon.png"
}
]);

db.routes.insertMany([
{
    _id: ObjectId("000000000000000000000201"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Маршрут с подосиновиками",
    description: "Тут прямо очень много подосиновиков",
    tags: [
        ObjectId("000000000000000000000012")
    ],
    created_at: ISODate("2026-03-10T10:00:00.389Z"),
    updated_at: null,
    waypoints: [
        { x: 59.787504, y: 30.773917, ordinal_number: 1 },
        { x: 59.788627, y: 30.778359, ordinal_number: 2 },
        { x: 59.788287, y: 30.777903, ordinal_number: 3 }
    ],
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000202"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Маршрут с маленькими подосиновиками",
    description: "Тут только маленькие подосиновики",
    tags: [
        ObjectId("000000000000000000000012")
    ],
    created_at: ISODate("2026-03-15T10:00:00.389Z"),
    updated_at: ISODate("2026-03-15T13:10:00.389Z"),
    waypoints: [
        { x: 59.780151, y: 30.756108, ordinal_number: 1 },
        { x: 59.780529, y: 30.757449, ordinal_number: 2 },
        { x: 59.780805, y: 30.757835, ordinal_number: 3 }
    ],
    image_path: "route_icon.png"
}
]);

db.points.insertMany([
{
    _id: ObjectId("000000000000000000000301"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Подосиновик",
    description: "Прямо-таки огромный подосиновик",
    tag: ObjectId("000000000000000000000012"),
    created_at: ISODate("2026-03-15T10:00:00.389Z"),
    updated_at: null,
    coordinates: { x: 59.778860, y: 30.751258 },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000302"),
    map_id: ObjectId("000000000000000000000101"),
    name: "Подосиновик",
    description: "Какой-то подозрительный подосиновик",
    tag: ObjectId("000000000000000000000012"),
    created_at: ISODate("2026-03-17T10:00:00.389Z"),
    updated_at: null,
    coordinates: { x: 59.779850, y: 30.753382 },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000303"),
    map_id: ObjectId("000000000000000000000102"),
    name: "Черника",
    description: "На третьем кусте справа много черники",
    tag: ObjectId("000000000000000000000011"),
    created_at: ISODate("2026-03-12T10:00:00.389Z"),
    updated_at: null,
    coordinates: { x: 59.597511, y: 29.684275 },
    image_path: "point_icon.png"
}
]);

db.areas.insertMany([
{
    _id: ObjectId("000000000000000000000401"),
    map_id: ObjectId("000000000000000000000102"),
    name: "Черничная поляна",
    description: "Все усыпано черникой",
    tags: [
        ObjectId("000000000000000000000011")
    ],
    created_at: ISODate("2026-03-20T10:00:00.389Z"),
    updated_at: null,
    coordinates: { x: 59.778860, y: 30.751258 },
    radius: 1.24567,
    image_path: "area_icon.png"
}
]);

EOF