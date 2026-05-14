db = db.getSiblingDB('shrooms');

const buildCircleArea = (center, radiusMeters, steps = 36) => {
    const [lat, lon] = center;
    const safeRadius = Math.max(0, radiusMeters);
    const safeSteps = Math.max(3, steps);
    const latRad = (lat * Math.PI) / 180;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLon = Math.cos(latRad) * 111320;
    const latDelta = safeRadius / metersPerDegreeLat;
    const lonDelta = metersPerDegreeLon === 0 ? 0 : safeRadius / metersPerDegreeLon;
    const points = [];

    for (let i = 0; i < safeSteps; i += 1) {
        const angle = (i / safeSteps) * Math.PI * 2;
        const pointLat = lat + latDelta * Math.sin(angle);
        const pointLon = lon + lonDelta * Math.cos(angle);
        points.push([Number(pointLat.toFixed(6)), Number(pointLon.toFixed(6))]);
    }

    points.push(points[0]);

    return { type: "Polygon", coordinates: [points] };
};

db.createCollection("users");
db.createCollection("maps");
db.createCollection("mapobjects");
db.createCollection("tags");

db.users.insertMany([
{
    _id: ObjectId("000000000000000000000001"),
    username: "netlibra",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000002"),
    username: "ryebread",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000003"),
    username: "blackeye",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000004"),
    username: "highnoon",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000005"),
    username: "pinecone",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000006"),
    username: "pearpie",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000007"),
    username: "lettuce",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
{
    _id: ObjectId("000000000000000000000008"),
    username: "cookies",
    password_hash: "$2b$12$xW/oiIG6JLE4APfWGFQsQuzq64vBVVeotnfOUJr27Y6P1qsHL3tJK",
    image_path: null
},
]);

db.tags.insertMany([
{
    _id: ObjectId("000000000000000000000001"),
    name: "вода",
    image_path: "water.png"
},
{
    _id: ObjectId("000000000000000000000002"),
    name: "рыбалка",
    image_path: "fishing.png"
},
{
    _id: ObjectId("000000000000000000000003"),
    name: "ягода",
    image_path: "berry.png"
},
{
    _id: ObjectId("000000000000000000000004"),
    name: "гриб",
    image_path: "shroom.png"
},
{
    _id: ObjectId("000000000000000000000005"),
    name: "пикник",
    image_path: "picnic.png"
},
{
    _id: ObjectId("000000000000000000000006"),
    name: "отдых",
    image_path: "rest.png"
},
{
    _id: ObjectId("000000000000000000000007"),
    name: "туризм",
    image_path: "tourism.png"
},
{
    _id: ObjectId("000000000000000000000008"),
    name: "поход",
    image_path: "camping.png"
},
{
    _id: ObjectId("000000000000000000000009"),
    name: "белый гриб",
    image_path: ""
},
{
    _id: ObjectId("000000000000000000000010"),
    name: "клюква",
    image_path: ""
},
{
    _id: ObjectId("000000000000000000000011"),
    name: "родник",
    image_path: ""
},
{
    _id: ObjectId("000000000000000000000012"),
    name: "озеро",
    image_path: ""
},
{
    _id: ObjectId("000000000000000000000013"),
    name: "земляника",
    image_path: ""
},
{
    _id: ObjectId("000000000000000000000014"),
    name: "вид",
    image_path: ""
},
]);

db.maps.insertMany([
{
    _id: ObjectId("000000000000000000000001"),
    user_id: ObjectId("000000000000000000000001"),
    name: "Карта подосиновиков",
    description: "На этой карте находятся все подосиновики в районе.",
    area: "Свердловское городское поселение",
    location: {
        type: "Point",
        coordinates: [59.773007, 30.775178]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000004")],
    created_at: ISODate("2026-03-01T10:00:00.389Z"),
    updated_at: null,
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000002"),
    user_id: ObjectId("000000000000000000000002"),
    name: "Ягодная карта",
    description: "Тут собраны все ягоды местности.",
    area: "Гатчинский муниципальный округ",
    location: {
        type: "Point",
        coordinates: [59.598731, 29.677867]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000003")],
    created_at: ISODate("2026-03-04T10:00:00.389Z"),
    updated_at: ISODate("2026-03-04T12:00:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000003"),
    user_id: ObjectId("000000000000000000000002"),
    name: "Грибная карта",
    description: "Лучшие места для сбора грибов.",
    area: "Ломоносовский муниципальный район",
    location: {
        type: "Point",
        coordinates: [59.721421, 29.845112]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000004")],
    created_at: ISODate("2026-03-05T09:15:00.389Z"),
    updated_at: ISODate("2026-03-05T11:20:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000004"),
    user_id: ObjectId("000000000000000000000003"),
    name: "Рыбные места",
    description: "Популярные точки для рыбалки.",
    area: "Выборгский район",
    location: {
        type: "Point",
        coordinates: [60.712345, 28.752134]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000002")],
    created_at: ISODate("2026-03-06T08:40:00.389Z"),
    updated_at: ISODate("2026-03-06T10:10:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000005"),
    user_id: ObjectId("000000000000000000000003"),
    name: "Тропы для походов",
    description: "Пешеходные маршруты и лесные тропы.",
    area: "Приозерский район",
    location: {
        type: "Point",
        coordinates: [61.034567, 30.112233]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000008"), ObjectId("000000000000000000000007")],
    created_at: ISODate("2026-03-07T07:30:00.389Z"),
    updated_at: ISODate("2026-03-07T09:45:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000006"),
    user_id: ObjectId("000000000000000000000005"),
    name: "Озера для отдыха",
    description: "Живописные места у озер.",
    area: "Всеволожский район",
    location: {
        type: "Point",
        coordinates: [60.198765, 30.554433]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000002"), ObjectId("000000000000000000000008")],
    created_at: ISODate("2026-03-08T11:10:00.389Z"),
    updated_at: ISODate("2026-03-08T13:00:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000007"),
    user_id: ObjectId("000000000000000000000008"),
    name: "Черничные поляны",
    description: "Места с большим количеством черники.",
    area: "Тосненский район",
    location: {
        type: "Point",
        coordinates: [59.487654, 30.998877]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000003")],
    created_at: ISODate("2026-03-09T06:50:00.389Z"),
    updated_at: ISODate("2026-03-09T08:25:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000008"),
    user_id: ObjectId("000000000000000000000005"),
    name: "Карта кемпингов",
    description: "Удобные места для палаточного лагеря.",
    area: "Киришский район",
    location: {
        type: "Point",
        coordinates: [59.452211, 32.014785]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000006"), ObjectId("000000000000000000000008")],
    created_at: ISODate("2026-03-10T12:20:00.389Z"),
    updated_at: ISODate("2026-03-10T14:00:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000009"),
    user_id: ObjectId("000000000000000000000006"),
    name: "Лесные родники",
    description: "Проверенные источники чистой воды.",
    area: "Кингисеппский район",
    location: {
        type: "Point",
        coordinates: [59.376543, 28.613245]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000001")],
    created_at: ISODate("2026-03-11T09:00:00.389Z"),
    updated_at: ISODate("2026-03-11T10:35:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000010"),
    user_id: ObjectId("000000000000000000000007"),
    name: "Клюквенные болота",
    description: "Места для сбора клюквы.",
    area: "Волховский район",
    location: {
        type: "Point",
        coordinates: [60.021357, 32.765421]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000003")],
    created_at: ISODate("2026-03-12T08:00:00.389Z"),
    updated_at: ISODate("2026-03-12T09:55:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000011"),
    user_id: ObjectId("000000000000000000000004"),
    name: "Смотровые площадки",
    description: "Лучшие виды и обзорные точки.",
    area: "Лужский район",
    location: {
        type: "Point",
        coordinates: [58.734221, 29.112478]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000007")],
    created_at: ISODate("2026-03-13T10:45:00.389Z"),
    updated_at: ISODate("2026-03-13T12:05:00.389Z"),
    image_path: "map_icon.png"
},
{
    _id: ObjectId("000000000000000000000012"),
    user_id: ObjectId("000000000000000000000002"),
    name: "Места для пикника",
    description: "Спокойные зоны для отдыха на природе.",
    area: "Подпорожский район",
    location: {
        type: "Point",
        coordinates: [60.923451, 34.156789]
    },
    visible: true,
    tags: [ObjectId("000000000000000000000005"), ObjectId("000000000000000000000006")],
    created_at: ISODate("2026-03-14T13:15:00.389Z"),
    updated_at: ISODate("2026-03-14T15:30:00.389Z"),
    image_path: "map_icon.png"
}
]);

db.mapobjects.insertMany([
{
    _id: ObjectId("000000000000000000000001"),
    map_id: ObjectId("000000000000000000000001"),
    name: "Маршрут с подосиновиками",
    type: "Route",
    description: "Тут прямо очень много подосиновиков",
    tags: [ObjectId("000000000000000000000004")],
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
    _id: ObjectId("000000000000000000000002"),
    map_id: ObjectId("000000000000000000000001"),
    name: "Маршрут с маленькими подосиновиками",
    description: "Тут только маленькие подосиновики",
    type: "Route",
    tags: [ObjectId("000000000000000000000004")],
    created_at: ISODate("2026-03-15T10:00:00.389Z"),
    updated_at: ISODate("2026-03-15T13:10:00.389Z"),
    location: {
        type: "LineString",
        coordinates: [
            [ 59.780151, 30.756108],
            [ 59.780529, 30.757449],
            [ 59.780805, 30.757835]
        ]
    },
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000003"),
    map_id: ObjectId("000000000000000000000002"),
    name: "Черничная поляна",
    type: "Area",
    description: "Все усыпано черникой",
    tags: [ObjectId("000000000000000000000003")],
    created_at: ISODate("2026-03-20T10:00:00.389Z"),
    updated_at: null,
    location: buildCircleArea([59.778860, 30.751252], 150),
    image_path: "area_icon.png"
},
{
    _id: ObjectId("000000000000000000000004"),
    map_id: ObjectId("000000000000000000000003"),
    name: "Лисичковый маршрут",
    type: "Route",
    description: "Тропа через густой лес с большим количеством лисичек.",
    tags: [ObjectId("000000000000000000000004")],
    created_at: ISODate("2026-03-21T08:15:00.389Z"),
    updated_at: null,
    location: {
        type: "LineString",
        coordinates: [
            [59.812345, 30.654321],
            [59.813112, 30.657843],
            [59.814001, 30.660214]
        ]
    },
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000005"),
    map_id: ObjectId("000000000000000000000004"),
    name: "Белый гриб",
    type: "Point",
    description: "Белые грибы возле старой ели.",
    tags: [ObjectId("000000000000000000000004"), ObjectId("000000000000000000000009")],
    created_at: ISODate("2026-03-22T09:40:00.389Z"),
    updated_at: ISODate("2026-03-22T11:05:00.389Z"),
    location: {
        type: "Point",
        coordinates: [59.745612, 30.812451]
    },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000006"),
    map_id: ObjectId("000000000000000000000005"),
    name: "Клюквенное болото",
    type: "Area",
    description: "Большое болотистое место с обилием клюквы.",
    tags: [ObjectId("000000000000000000000003"), ObjectId("000000000000000000000010")],
    created_at: ISODate("2026-03-23T07:20:00.389Z"),
    updated_at: null,
    location: buildCircleArea([59.900934, 30.925431], 300),
    image_path: "area_icon.png"
},
{
    _id: ObjectId("000000000000000000000007"),
    map_id: ObjectId("000000000000000000000002"),
    name: "Лесной родник",
    type: "Point",
    description: "Источник чистой воды рядом с лесной дорогой.",
    tags: [ObjectId("000000000000000000000001"), ObjectId("000000000000000000000011")],
    created_at: ISODate("2026-03-24T10:55:00.389Z"),
    updated_at: null,
    location: {
        type: "Point",
        coordinates: [59.667843, 30.556712]
    },
    image_path: "point_icon.png"
},
{
    _id: ObjectId("000000000000000000000008"),
    map_id: ObjectId("000000000000000000000002"),
    name: "Маршрут вдоль озера",
    type: "Route",
    description: "Красивый маршрут с видами на озеро и местами для отдыха.",
    tags: [ObjectId("000000000000000000000012"), ObjectId("000000000000000000000007")],
    created_at: ISODate("2026-03-25T12:10:00.389Z"),
    updated_at: ISODate("2026-03-25T14:25:00.389Z"),
    location: {
        type: "LineString",
        coordinates: [
            [60.012345, 30.445566],
            [60.013457, 30.448912],
            [60.014782, 30.452341]
        ]
    },
    image_path: "route_icon.png"
},
{
    _id: ObjectId("000000000000000000000009"),
    map_id: ObjectId("000000000000000000000002"),
    name: "Поляна земляники",
    type: "Area",
    description: "Небольшая солнечная поляна с земляникой.",
    tags: [ObjectId("000000000000000000000003"), ObjectId("000000000000000000000013")],
    created_at: ISODate("2026-03-26T06:45:00.389Z"),
    updated_at: null,
    location: buildCircleArea([59.834256, 30.713674], 120),
    image_path: "area_icon.png"
},
{
    _id: ObjectId("000000000000000000000010"),
    map_id: ObjectId("000000000000000000000002"),
    name: "Смотровая точка на холме",
    type: "Point",
    description: "Отсюда открывается хороший вид на лес и озеро.",
    tags: [ObjectId("000000000000000000000014"), ObjectId("000000000000000000000007")],
    created_at: ISODate("2026-03-27T15:00:00.389Z"),
    updated_at: ISODate("2026-03-27T16:40:00.389Z"),
    location: {
        type: "Point",
        coordinates: [59.954321, 30.334455]
    },
    image_path: "point_icon.png"
}
]);
