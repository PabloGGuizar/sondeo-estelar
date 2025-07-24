import React, { useState } from 'react';
import Grid from './Grid';

// Objeto para mapear nombres a emojis
const bodyEmojis = {
  'Gigante Gaseoso Inexplorado': '🪐',
  'Exoplaneta Oceánico': '🌎',
  'Satélite Errante': '🌑',
  'Sistema Binario de Asteroides': '☄️',
  'Cometa Congelado': '💫',
};

const CELESTIAL_BODIES = [
  { name: 'Gigante Gaseoso Inexplorado', size: 5 },
  { name: 'Exoplaneta Oceánico', size: 4 },
  { name: 'Satélite Errante', size: 3 },
  { name: 'Sistema Binario de Asteroides', size: 2 },
  { name: 'Cometa Congelado', size: 1 },
];

const GRID_SIZE = 10;

function GameSetup({ onPlacementComplete }) {
  const [grid, setGrid] = useState(Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({ status: 'empty', icon: null })));
  const [selectedBodyIndex, setSelectedBodyIndex] = useState(0);
  const [orientation, setOrientation] = useState('horizontal');
  const [previewCells, setPreviewCells] = useState([]);

  const getPlacementPositions = (startIndex, bodySize, orientation) => {
    const positions = [];
    for (let i = 0; i < bodySize; i++) {
      positions.push(orientation === 'horizontal' ? startIndex + i : startIndex + i * GRID_SIZE);
    }
    return positions;
  };
  
  const canPlaceBody = (startIndex, bodySize, orientation, currentGrid) => {
    const positions = getPlacementPositions(startIndex, bodySize, orientation);
    const startRow = Math.floor(startIndex / GRID_SIZE);
    for (const pos of positions) {
      if (pos >= GRID_SIZE * GRID_SIZE || currentGrid[pos].status !== 'empty') return false;
      if (orientation === 'horizontal' && Math.floor(pos / GRID_SIZE) !== startRow) return false;
    }
    return true;
  };

  const handleCellHover = (index) => {
    if (selectedBodyIndex >= CELESTIAL_BODIES.length) return;
    const body = CELESTIAL_BODIES[selectedBodyIndex];
    if (canPlaceBody(index, body.size, orientation, grid)) {
      setPreviewCells(getPlacementPositions(index, body.size, orientation));
    } else {
      setPreviewCells([]);
    }
  };

  const handleGridMouseLeave = () => setPreviewCells([]);

  const handleCellClick = (index) => {
    if (selectedBodyIndex >= CELESTIAL_BODIES.length) return;
    const body = CELESTIAL_BODIES[selectedBodyIndex];
    
    if (canPlaceBody(index, body.size, orientation, grid)) {
      const newGrid = [...grid];
      const positions = getPlacementPositions(index, body.size, orientation);
      positions.forEach(pos => {
        newGrid[pos] = { 
          status: 'body', 
          bodyName: body.name, 
          icon: bodyEmojis[body.name]
        };
      });
      setGrid(newGrid);
      setSelectedBodyIndex(selectedBodyIndex + 1);
      setPreviewCells([]);
    } else {
      alert('No puedes colocar el cuerpo celeste aquí.');
    }
  };

  const toggleOrientation = () => setOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal');

  const allBodiesPlaced = selectedBodyIndex >= CELESTIAL_BODIES.length;

  const displayGrid = grid.map((cell, index) => {
    if (previewCells.includes(index)) {
      return { ...cell, status: 'preview' };
    }
    return cell;
  });

  return (
    <div className="setup-container narrative-box">
      <h1>Fase 1: Mapeado Cósmico</h1>
      <p className="narrative-text">El enlace es estable. Ahora, calibra tus sensores desplegando discretamente tus descubrimientos potenciales en el mapa estelar. Una buena estrategia es clave para la victoria.</p>
      
      {!allBodiesPlaced ? (
        <div className="setup-info">
          <p>Desplegando: <strong>{CELESTIAL_BODIES[selectedBodyIndex].name} {bodyEmojis[CELESTIAL_BODIES[selectedBodyIndex].name]}</strong></p>
          <p>Ocupa: {CELESTIAL_BODIES[selectedBodyIndex].size} sectores</p>
          <div className="setup-controls">
            <button onClick={toggleOrientation}>Rotar Eje (Actual: {orientation})</button>
          </div>
        </div>
      ) : (
        <div className="setup-info">
            <p className="narrative-text-success">¡Mapeado completado! Todos los cuerpos celestes han sido posicionados.</p>
            <p>Esperando la señal de sincronización de tu colega...</p>
        </div>
      )}
      
      <div onMouseLeave={handleGridMouseLeave}>
        <Grid 
          gridData={displayGrid} 
          onCellClick={handleCellClick}
          onCellHover={handleCellHover}
        />
      </div>
      
      {allBodiesPlaced && (
        <button className="ready-button" onClick={() => onPlacementComplete(grid)}>
          Sincronizar y Comenzar Sondeo
        </button>
      )}
    </div>
  );
}

export default GameSetup;
