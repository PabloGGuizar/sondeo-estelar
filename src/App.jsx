import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import QRCode from "react-qr-code";
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('CONNECTING');
  const [playerGrid, setPlayerGrid] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOpponentReady, setIsOpponentReady] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [conn, setConn] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [remotePeerId, setRemotePeerId] = useState('');
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => setPeerId(id));
    peer.on('connection', (connection) => {
      console.log('Oponente conectado!');
      setConn(connection);
      setIsHost(true);
      setGameState('SETUP');
    });
    peerInstance.current = peer;
    return () => peer.destroy();
  }, []);

  useEffect(() => {
    if (conn) {
      conn.on('data', (data) => {
        if (data.type === 'player_ready') {
          console.log('El oponente está listo.');
          setIsOpponentReady(true);
        }
      });
    }
  }, [conn]);
  
  useEffect(() => {
    if (isPlayerReady && isOpponentReady) {
      console.log('Ambos jugadores listos. ¡Iniciando batalla!');
      setGameState('BATTLE');
    }
  }, [isPlayerReady, isOpponentReady]);

  const handleConnect = (e) => {
    e.preventDefault();
    if (peerInstance.current && remotePeerId) {
      const connection = peerInstance.current.connect(remotePeerId);
      setConn(connection);
      setIsHost(false);
      setGameState('SETUP');
    }
  };

  const handlePlacementComplete = (finalGrid) => {
    setPlayerGrid(finalGrid);
    setIsPlayerReady(true);
    if (conn) {
      conn.send({ type: 'player_ready' });
    }
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'SETUP':
        return <GameSetup onPlacementComplete={handlePlacementComplete} />;
      case 'BATTLE':
        return <GameBoard conn={conn} isHost={isHost} playerGrid={playerGrid} />;
      case 'CONNECTING':
      default:
        return (
          <div className="container narrative-box">
            <h1>Sondeo Estelar</h1>
            <p className="subtitle">La Búsqueda de Mundos Ocultos</p>
            <p className="narrative-text">Bienvenido, explorador. El telescopio intergaláctico está a tu disposición. Establece un enlace cuántico con tu colega para comenzar la expedición en el Sector Desconocido.</p>
            
            <div className="host-section">
              <h2>1. Crear Enlace (Anfitrión)</h2>
              <p>Genera un código de enlace y compártelo con tu rival amistoso.</p>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', margin: '1em auto', maxWidth: '256px' }}>
                {peerId ? <QRCode value={peerId} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} /> : <p>Generando ID de enlace...</p>}
              </div>
              <p>ID de Enlace Directo:</p>
              <strong>{peerId}</strong>
            </div>
            
            <hr />
            
            <div className="join-section">
              <h2>2. Unirse a Enlace (Invitado)</h2>
              <p>Introduce el ID de enlace de tu colega para sincronizar los mapeados cósmicos.</p>
              <form onSubmit={handleConnect}>
                <input
                  type="text"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  placeholder="ID de Enlace del Anfitrión"
                  required
                />
                <button type="submit">Sincronizar</button>
              </form>
            </div>
          </div>
        );
    }
  };

  return <div className="app-container">{renderGameState()}</div>;
}

export default App;
