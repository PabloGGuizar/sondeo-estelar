import React, { useState, useEffect, useRef } from 'react';
import Grid from './Grid';

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
  const [myGrid, setMyGrid] = useState(initialPlayerGrid);
  const [opponentGrid, setOpponentGrid] = useState(initialOpponentGrid);
  const [isMyTurn, setIsMyTurn] = useState(isHost);
  const [statusMessage, setStatusMessage] = useState('Sincronización completa. ¡La exploración ha comenzado!');
  const [isGameOver, setIsGameOver] = useState(false);
  
  const stateRef = useRef();
  stateRef.current = { myGrid, opponentGrid, isGameOver };

  useEffect(() => {
    if (conn) {
      const handleData = (data) => {
        const { myGrid: currentMyGrid, opponentGrid: currentOpponentGrid, isGameOver: currentIsGameOver } = stateRef.current;

        if (data.type === 'scan') {
          handleOpponentScan(data.coord, currentMyGrid, currentIsGameOver);
        } else if (data.type === 'scan_result') {
          handleScanResult(data, currentOpponentGrid);
        // **PASO 1: Escuchar el mensaje de fin de juego**
        } else if (data.type === 'game_over') {
          endGame(false); // Si recibimos este mensaje, significa que perdimos.
        }
      };
      
      conn.on('data', handleData);

      // Limpieza del listener para evitar duplicados
      return () => {
        conn.off('data', handleData);
      };
    }
  }, [conn]);

  const handleOpponentScan = (coord, currentMyGrid, currentIsGameOver) => {
    const playerBodies = new Map();
    initialPlayerGrid.forEach((cell, index) => {
        if (cell.bodyName) {
            if (!playerBodies.has(cell.bodyName)) {
                playerBodies.set(cell.bodyName, { positions: [], size: 0, hits: 0, name: cell.bodyName });
            }
            const body = playerBodies.get(cell.bodyName);
            body.positions.push(index);
            body.size++;
            if (currentMyGrid[index].status === 'hit' || currentMyGrid[index].status === 'discovered') {
                body.hits++;
            }
        }
    });

    const cell = currentMyGrid[coord];
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

    const newMyGrid = [...currentMyGrid];
    newMyGrid[coord] = { ...cell, status: result, icon: null }; 
    setMyGrid(newMyGrid);

    conn.send({ 
      type: 'scan_result', 
      result, 
      coord,
      body: discoveredBody ? { name: discoveredBody.name, positions: discoveredBody.positions } : null
    });
    
    if (!currentIsGameOver) {
      setIsMyTurn(true);
    }
  };

  const handleScanResult = (data, currentOpponentGrid) => {
    const { result, coord, body } = data;
    const newOpponentGrid = [...currentOpponentGrid];
    let discoveredCount = 0;

    if (result === 'discovered') {
      setStatusMessage(`¡Descubrimiento Completo! Has catalogado el ${body.name}.`);
      body.positions.forEach(pos => {
        newOpponentGrid[pos] = { ...newOpponentGrid[pos], status: 'discovered', icon: '🛰️' };
      });
    } else {
      newOpponentGrid[coord] = { ...newOpponentGrid[coord], status: result, icon: result === 'hit' ? '🛰️' : '⚫' };
      setStatusMessage(result === 'hit' ? '¡Contacto Estelar! Tus sensores detectan una anomalía.' : 'Vacío Cósmico.');
    }

    newOpponentGrid.forEach(cell => {
        if(cell.status === 'discovered') discoveredCount++;
    });
    const totalBodyCells = CELESTIAL_BODIES.reduce((sum, body) => sum + body.size, 0);

    if(discoveredCount === totalBodyCells){
        endGame(true); // Ganas
        // **PASO 2: Enviar el mensaje de fin de juego al oponente**
        conn.send({ type: 'game_over' }); 
    }
    
    setOpponentGrid(newOpponentGrid);
  };
  
  const endGame = (playerWon) => {
    setIsGameOver(true);
    setIsMyTurn(false);
    setStatusMessage(playerWon ? "¡Victoria! Has sido nombrado Gran Explorador Cósmico." : "Misión terminada. Tu colega ha completado su catálogo primero.");
  };

  const handleCellClick = (index) => {
    if (!isMyTurn || isGameOver || opponentGrid[index].status !== 'empty') return;
    setStatusMessage(`Lanzando sonda de escaneo a la coordenada ${index}...`);
    conn.send({ type: 'scan', coord: index });
    setIsMyTurn(false);
  };

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
