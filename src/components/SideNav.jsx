import { first151Pokemon, getFullPokedexNumber } from "../utils"

export function SideNav() {
    return (
        <nav>
            <div className={"header"}>
                <h1 className="text-gradient">
                    Pokedex
                </h1>
            </div>
            <input type="text" />
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button key={pokemonIndex} className={'nav-card'}>
                        <p>{getFullPokedexNumber(pokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                );
            })}
        </nav>
    )
} 