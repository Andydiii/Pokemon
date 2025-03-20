import { useState } from "react"
import { useEffect } from "react"

export function PokeCard({selectedPokemon}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // when we fetch the pokemon data, true

    useEffect(() => {

        // if we are fetching the data, exit logic 
        if (loading || !localStorage) {
            return
        }

        // check if the selected pokemon info is in the cache
            // 1. define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokemon'));
        }
            // 2. check if the selected pokemon is in the cahce, otherwise fetch from the API.
        if (selectedPokemon in cache) {
            // read from cache
            setData(cache[selectedPokemon])
            return
        }

        // if selected pokemon info is not in the cache, we fetch it from api
        async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/';
                const suffix = 'pokemon/' + selectedPokemon;
                const finalUrl = baseUrl + suffix;
                const response = await fetch(finalUrl)
                const pokemonData = await response.json()
                setData(pokemonData);

                cache[selectedPokemon] = pokemonData;
                localStorage.setItem(JSON.stringify(cache));
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        // if we fetch from the api, make sure to save the info to the cache for the next time.
    }, [selectedPokemon])

    return (
        <div>
            
        </div>
    )
}