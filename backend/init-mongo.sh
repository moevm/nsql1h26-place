#!/bin/bash

mongosh <<EOF
use shrooms;
db.createCollection("maps");
db.maps.insertMany([
    {
        _id: "1",
        user_id: "1",
        name: "Карта подосиновиков",
        description: "На этой карте находятся все подосиновики в районе.",
        country: "Россия",
        area: "Свердловское городское поселение",
        coordinates: {x: 59.773007, y: 30.775178},
        visible: true,
        tags: ["1", "3"],
        created_at: "2026-03-01T10:00:00.389Z",
        updated_at: "2026-03-02T12:00:00.389Z",
        image_path: "map_icon.png"
    },
    {
        _id: "2",
        user_id: "1",
        name: "Ягодная карта",
        description: "Тут собраны все ягодны местности.",
        country: "Россия",
        area: "Гатчинский муниципальный округ",
        coordinates: {x: 59.598731, y: 29.677867},
        visible: true,
        tags: ["2"],
        created_at: "2026-03-04T10:00:00.389Z",
        updated_at: "2026-03-04T12:00:00.389Z",
        image_path: "map_icon.png"
    },
]);

db.createCollection("users");
db.users.insertMany([
    {
        _id: "1",
        username: "Joku_Jokkunen",
        password: "123",
        image_path: "cheliks.png"
    }
]);

db.createCollection("tags");
db.tags.insertMany([
    {
        _id: "1",
        name: "черника",
        image_path: "berry.png"
    },
    {
        _id: "2",
        name: "подосиновик",
        image_path: "shroom.png"
    },
        {
        _id: "3",
        name: "бабочка",
        image_path: "butterfly.png"
    }
]);

db.createCollection("routes");
db.routes.insertMany([
    {
        _id: "1",
        map_id: "1",
        name: "Маршрут с подосиновиками",
        description: "Тут прямо очень много подосиновиков",
        tags: ["2"],
        created_at: "2026-03-10T10:00:00.389Z",
        updated_at: "",
        waypoints: [
            {x: 59.787504, y: 30.773917, ordinal_number: 1},
            {x: 59.788287, y: 30.777903, ordinal_number: 3},
            {x: 59.788627, y: 30.778359, ordinal_number: 2},
        ],
        image_path: "route_icon.png"
    },
    {
        _id: "2",
        map_id: "1",
        name: "Маршрут с маленькими подосиновиками",
        description: "Тут только маленькие подосиновики",
        tags: ["2"],
        created_at: "2026-03-15T10:00:00.389Z",
        updated_at: "2026-03-15T13:10:00.389Z",
        waypoints: [
            {x: 59.780805, y: 30.757835, ordinal_number: 3},
            {x: 59.780529, y: 30.757449, ordinal_number: 2},
            {x: 59.780151, y: 30.756108, ordinal_number: 1},
        ],
        image_path: "route_icon.png"
    },
]);

db.createCollection("points");
db.points.insertMany([
    {
        _id: "1",
        map_id: "1",
        name: "Подосиновик",
        description: "Прямо-таки огромный подосиновик",
        tag: "2",
        created_at: "2026-03-15T10:00:00.389Z",
        updated_at: "",
        coordinates: {x: 59.778860, y: 30.751258},
        image_path: "point_icon.png"
    },
    {
        _id: "2",
        map_id: "1",
        name: "Подосиновик",
        description: "Какой-то подозрительный подосиновик",
        tag: "2",
        created_at: "2026-03-17T10:00:00.389Z",
        updated_at: "",
        coordinates: {x: 59.779850, y: 30.753382},
        image_path: "point_icon.png"
    },
    {
        _id: "3",
        map_id: "2",
        name: "Черника",
        description: "На третьем кусте справа много черники",
        tag: "1",
        created_at: "2026-03-12T10:00:00.389Z",
        updated_at: "",
        coordinates: {x: 59.597511, y: 29.684275},
        image_path: "point_icon.png"
    },
    {
        _id: "4",
        map_id: "2",
        name: "Черника",
        description: "Две ягоды растут за камнем",
        tag: "1",
        created_at: "2026-03-14T10:00:00.389Z",
        updated_at: "",
        coordinates: {x: 59.598408, y: 29.684190},
        image_path: "point_icon.png"
    },
]);

db.createCollection("areas");
db.areas.insertMany([
    {
        _id: "1",
        map_id: "2",
        name: "Черничная поляна",
        description: "Все усыпано черникой",
        tags: ["2"],
        created_at: "2026-03-20T10:00:00.389Z",
        updated_at: "",
        coordinates: {x: 59.778860, y: 30.751258},
        radius: 1.24567,
        image_path: "area_icon.png"
    }
]);
EOF