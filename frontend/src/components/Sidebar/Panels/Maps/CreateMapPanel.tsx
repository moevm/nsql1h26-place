import { useState } from 'react'
import '../Panels.css'
import { createMap } from '../../../../api/maps'
import { useMapStore } from '../../../../stores/mapsStore'
import { LuX } from 'react-icons/lu'
import { useAuthStore } from '../../../../stores/authStore'

type CreateMapPanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreateMapPanel = ({setAdditionalOpen} : CreateMapPanelProps) => {
    const { addMap } = useMapStore()
    const { user } = useAuthStore()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [country, setCountry] = useState('')
    const [area, setArea] = useState('')
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false)

    type GeocodeResult = {
        lat: string
        lon: string
        display_name?: string
        address?: {
            city?: string
            town?: string
            village?: string
            municipality?: string
            county?: string
            state_district?: string
        }
    }

    const extractCity = (result: GeocodeResult) => {
        return (
            result.address?.city
            ?? result.address?.town
            ?? result.address?.village
            ?? result.address?.municipality
            ?? result.address?.county
            ?? result.address?.state_district
            ?? null
        )
    }

    const geocodeAreaCenter = async (areaName: string, countryName: string) => {
        const query = `${areaName}, ${countryName}`.trim();
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Не удалось получить координаты области');
        }

        const results = await response.json() as GeocodeResult[];
        const first = results[0];

        if (!first) {
            throw new Error('Область не найдена. Уточните название области и страны.');
        }

        const uniqueCities = Array.from(new Set(results.map(extractCity).filter((city): city is string => !!city && city.trim().length > 0)))

        if (uniqueCities.length > 1) {
            throw new Error(`Найдено несколько мест в разных городах (${uniqueCities.join(', ')}). Уточните запрос в поле области через запятую, например: "${areaName}, ${uniqueCities[0]}".`)
        }

        const lat = Number(first.lat);
        const lon = Number(first.lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            throw new Error('Геокодер вернул некорректные координаты');
        }

        return { x: lat, y: lon };
    };

    const handleCreateMap = async () => {
        setLoading(true)

        try {
            const coordinates = await geocodeAreaCenter(area.trim(), country.trim());

            const newMap = await createMap({
                user_id: user?._id || "",
                name: name.trim(),
                description: description.trim(),
                country: country.trim(),
                area: area.trim(),
                coordinates,
                visible: visible,
                tags: [],
                image_path: "map_icon.png"
            })

            addMap(newMap)
            setAdditionalOpen(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось создать карту!'
            alert(message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание карты</h3>
                <LuX className='panel__close' onClick={() => setAdditionalOpen(false)} />
            </div>
            <div className="create-form">
                <label htmlFor="title">Название</label>
                <input
                    id="title"
                    className="create-form__input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Например: Карта подосиновиков"
                />

                <label htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    className="create-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание карты"
                />

                <hr className='divider' />

                <label htmlFor="country">Страна</label>
                <input
                    id="country"
                    className="create-form__input"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Россия"
                />

                <label htmlFor="area">Область</label>
                <input
                    id="area"
                    className="create-form__input"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    placeholder="Свердловское городское поселение"
                />

                <hr className='divider' />

                <label htmlFor="visible">Видимость</label>
                <select id='visible' className="create-form__input">
                    <option onClick={() => setVisible(true)}>Публичная</option>
                    <option onClick={() => setVisible(false)}>Приватная</option>
                </select>

                <hr className='divider' />

                <div className="create-form__actions">
                    <button className="create-form__btn create-form__btn--ghost" onClick={() => setAdditionalOpen(false)}>
                        Отменить
                    </button>
                    <button className="create-form__btn card__btn--safe" onClick={handleCreateMap} disabled={loading}>
                        Принять
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateMapPanel