import React, { useState, useEffect, useMemo } from 'react';
import Grid from './Grid';

// La lista de cuerpos debe coincidir con la de GameSetup.jsx
const CELESTIAL_BODIES = [
  { name: 'Gigante Gaseoso Inexplorado', size: 5 },
  { name: 'Exoplaneta Oceánico', size: 4 },
  { name: 'Satélite Errante', size: 3 },
  { name: 'Sistema Binario de Asteroides', size: 2 },
  { name: 'Cometa Congelado', size: 1 },
];

const GRID_SIZE = 100;
const initialOpponentGrid = Array.from({ length: GRID_SIZE }, () => ({ status: 'empty', icon: null }));

function GameBoard({ conn, isHost, playerGrid: initialPlayerGrid }) {
  // Memoiza el cálculo de los cuerpos del jugador para optimizar
  const playerBodies = useMemo(() => {
    const bodies = new Map();
    initialPlayerGrid.forEach((cell, index) => {
      if (cell.bodyName) {
        if (!bodies.has(cell.bodyName)) {
          bodies.set(cell.bodyName, { positions: [], size: 0, hits: 0, name: cell.bodyName });
        }
        const body = bodies.get(cell.bodyName);
        body.positions.push(index);
        body.size++;
      }
    });
    return bodies;
  }, [initialPlayerGrid]);

  const [myGrid, setMyGrid] = useState(initialPlayerGrid);
  const [opponentGrid, setOpponentGrid] = useState(initialOpponentGrid);
  const [isMyTurn, setIsMyTurn] = useState(isHost);
  const [statusMessage, setStatusMessage] = useState('Sincronización completa. ¡La exploración ha comenzado!');
  const [isGameOver, setIsGameOver] = useState(false);
  const [discoveredOpponentBodies, setDiscoveredOpponentBodies] = useState(0);

  // Efecto principal para manejar la comunicación del juego
  useEffect(() => {
    if (conn) {
      conn.on('data', (data) => {
        if (data.type === 'scan') {
          handleOpponentScan(data.coord);
        } else if (data.type === 'scan_result') {
          handleScanResult(data);
        }
      });
    }
    // Las dependencias aseguran que las funciones usen los estados más recientes
  }, [conn, myGrid, opponentGrid, playerBodies]);

  // Procesa un ataque del oponente
  const handleOpponentScan = (coord) => {
    const cell = myGrid[coord];
    let result = 'miss';
    let discoveredBody = null;

    if (cell.status === 'body') {
      result = 'hit';
      const body = playerBodies.get(cell.bodyName);
      body.hits++;
      if (body.hits === body.size) {
        result = 'discovered';
        discoveredBody = body;
      }
    }

    const newMyGrid = [...myGrid];
    // Al ser golpeado, el emoji se oculta para mostrar el estado del impacto
    newMyGrid[coord] = { ...cell, status: result, icon: null }; 
    setMyGrid(newMyGrid);

    // Envía el resultado de vuelta al oponente
    conn.send({ 
      type: 'scan_result', 
      result, 
      coord,
      body: discoveredBody ? { name: discoveredBody.name, positions: discoveredBody.positions } : null
    });
    
    if (!isGameOver) setIsMyTurn(true);
  };

  // Procesa el resultado de nuestro ataque
  const handleScanResult = (data) => {
    const { result, coord, body } = data;
    const newOpponentGrid = [...opponentGrid];

    if (result === 'discovered') {
      setStatusMessage(`¡Descubrimiento Completo! Has catalogado el ${body.name}. Un gran hallazgo para la Federación.`);
      body.positions.forEach(pos => {
        newOpponentGrid[pos] = { ...newOpponentGrid[pos], status: 'discovered', icon: '🛰️' };
      });
      const newCount = discoveredOpponentBodies + 1;
      setDiscoveredOpponentBodies(newCount);
      if (newCount === CELESTIAL_BODIES.length) endGame(true);
    } else {
      newOpponentGrid[coord] = { ...newOpponentGrid[coord], status: result, icon: result === 'hit' ? '🛰️' : '⚫' };
      setStatusMessage(result === 'hit' ? '¡Contacto Estelar! Tus sensores detectan una anomalía.' : 'Vacío Cósmico. El sector está despejado.');
    }
    setOpponentGrid(newOpponentGrid);
  };
  
  // Termina la partida
  const endGame = (playerWon) => {
    setIsGameOver(true);
    setIsMyTurn(false);
    setStatusMessage(playerWon ? "¡Victoria! Has sido nombrado Gran Explorador Cósmico. Tu nombre será recordado." : "Misión terminada. Tu colega ha completado su catálogo primero. ¡Una digna competencia!");
  };

  // Maneja el clic en el tablero del oponente
  const handleCellClick = (index) => {
    if (!isMyTurn || isGameOver || opponentGrid[index].status !== 'empty') return;
    setStatusMessage(`Lanzando sonda de escaneo a la coordenada ${index}...`);
    conn.send({ type: 'scan', coord: index });
    setIsMyTurn(false);
  };

  // Devuelve el mensaje de turno apropiado
  const getTurnMessage = () => {
    if (isGameOver) return "El sondeo ha concluido.";
    return isMyTurn ? "Tu turno: Focaliza el telescopio y elige un sector." : "Esperando sondeo del oponente...";
  };

  return (
    <div className="game-container narrative-box">
      <h1>Fase 2: Exploración Activa</h1>
      <p className="turn-indicator">{getTurnMessage()}</p>
      <p className="status-message">{statusMessage}</p>
      <div className="game-area">
        <div className="grid-container">
          <h3>Mi Catálogo Estelar</h3>
          <Grid gridData={myGrid} onCellClick={() => {}} />
        </div>
        <div className="grid-container">
          <h3>Sondeo del Oponente</h3>
          <Grid gridData={opponentGrid} onCellClick={handleCellClick} />
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
