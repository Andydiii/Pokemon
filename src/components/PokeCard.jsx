import { useState } from "react"
import { useEffect } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./typeCard";

export function PokeCard({selectedPokemon}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // when we fetch the pokemon data, true

    const { name, height, abilities, stats, types, moves, sprites} = data || {};

    const imgList = Object.keys(sprites || {}).filter((val) => {    // object.keys returns an array of keys of the object
        if (!sprites[val]) { return false; }
        if (['versions', 'other'].includes(val)) { return false;} // exclude the versions and other keys
        return true; // include the rest of the keys
    })
    
    // whenever the user selected a new pokemon, this block of code is triggered.
    // if data of the selcted pokemon is in localstorage -> extract to cache -> extract to data.
    // if not in loclastorage -> fetch from api -> extract to cache -> loclastorage
    useEffect(() => {
        // if we are fetching the data, exit logic 
        if (loading || !localStorage) {
            return
        }

        // check if the selected pokemon info is in the cache
            // 1. define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'));
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
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                const response = await fetch(finalUrl)
                const pokemonData = await response.json()
                setData(pokemonData);
                console.log(pokemonData);
                cache[selectedPokemon] = pokemonData; // cache is an object
                localStorage.setItem('pokedex' , JSON.stringify(cache));
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData();
        // if we fetch from the api, make sure to save the info to the cache for the next time.
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <h4>Loading...</h4>
        )
    }

    return (
        <div>
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}                
            </div>
            <img className="default-img" src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + '.png' }  alt={`${name}-large-img`} />
            <div className="img-container">
                {imgList.map((spritekey, spriteIndex) => {
                    const imgUrl = sprites[spritekey]; // get the url of the image
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={ `${name}-img-${spritekey}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat} = statObj;
                    return (
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll('-' , ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                
            </div>
        </div>
    )
}