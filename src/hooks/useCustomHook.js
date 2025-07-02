import React, { useState, useEffect } from 'react';

// Hook personalizado - useCustomHook.js
const useCustomHook = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

// Componente para mostrar personajes
const CharacterCard = ({ title, name, image, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="text-center">
        <p className="text-xl font-semibold mb-4 capitalize text-gray-700">{name}</p>
        <img 
          src={image} 
          alt={name}
          className="mx-auto rounded-lg shadow-sm max-w-xs w-full h-auto"
        />
      </div>
    </div>
  );
};

// Componente principal App
const App = () => {
  // URLs de las APIs
  const urlPokemon = 'https://pokeapi.co/api/v2/pokemon/1';
  const urlRick = 'https://rickandmortyapi.com/api/character/1';

  // Usando nuestro hook personalizado para ambas APIs
  const { data: pokemonData, loading: pokemonLoading, error: pokemonError } = useCustomHook(urlPokemon);
  const { data: rickData, loading: rickLoading, error: rickError } = useCustomHook(urlRick);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hook Personalizado Demo
          </h1>
          <p className="text-gray-600">
            Usando useCustomHook para hacer fetch a diferentes APIs
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personaje Pokemon */}
          <CharacterCard
            title="Personaje Pokemon"
            name={pokemonData?.name || ''}
            image={pokemonData?.sprites?.front_default || ''}
            loading={pokemonLoading}
            error={pokemonError}
          />

          {/* Personaje Rick and Morty */}
          <CharacterCard
            title="Personaje Rick and Morty"
            name={rickData?.name || ''}
            image={rickData?.image || ''}
            loading={rickLoading}
            error={rickError}
          />
        </div>

        {/* Información adicional cuando los datos estén cargados */}
        {pokemonData && rickData && !pokemonLoading && !rickLoading && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Detalles adicionales:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-800">Pokemon:</h4>
                <p>Altura: {pokemonData.height / 10} m</p>
                <p>Peso: {pokemonData.weight / 10} kg</p>
                <p>Tipo: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Rick & Morty:</h4>
                <p>Especie: {rickData.species}</p>
                <p>Estado: {rickData.status}</p>
                <p>Origen: {rickData.origin.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Explicación del código */}
        <div className="mt-8 bg-gray-800 text-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">💡 Cómo funciona el Hook:</h3>
          <div className="text-sm space-y-2">
            <p><span className="text-yellow-300">useCustomHook(url)</span> - Recibe una URL como parámetro</p>
            <p><span className="text-yellow-300">useState</span> - Gestiona data, loading y error</p>
            <p><span className="text-yellow-300">useEffect</span> - Ejecuta el fetch cuando cambia la URL</p>
            <p><span className="text-yellow-300">return</span> - Devuelve los estados para usar en componentes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;