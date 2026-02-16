import { useListMaps } from "./api/maps";

function App() {
    const [maps] = useListMaps();
    console.log(maps)

    return (
        <>
            <div>
                hello
            </div>
        </>
    )
}

export default App;