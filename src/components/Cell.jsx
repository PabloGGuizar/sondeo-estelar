import React from 'react';

/**
 * Componente que renderiza una única celda en el tablero de juego.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.status - El estado actual de la celda (e.g., 'empty', 'hit', 'miss', 'preview', 'body').
 * @param {function} props.onClick - Función que se ejecuta al hacer clic en la celda.
 * @param {function} props.onMouseEnter - Función para el evento hover al entrar el ratón.
 * @param {function} props.onMouseLeave - Función para el evento hover al salir el ratón.
 * @param {React.ReactNode} props.children - Elementos hijos para renderizar dentro de la celda (como los iconos SVG).
 */
function Cell({ status, onClick, onMouseEnter, onMouseLeave, children }) {
  
  // Función para construir el string de clases CSS basado en el estado.
  const getCellClassName = () => {
    // La clase base es 'cell' y se le añade el estado actual.
    // Ejemplo: "cell hit", "cell preview"
    return `cell ${status}`;
  };

  return (
    <div 
      className={getCellClassName()} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Renderiza cualquier elemento hijo que se le pase, como los iconos */}
      {children}
    </div>
  );
}

export default Cell;
