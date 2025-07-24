import React from 'react';
import Cell from './Cell';

/**
 * Componente que renderiza un tablero de juego completo.
 * @param {object} props - Las propiedades del componente.
 * @param {Array<object>} props.gridData - Un array de objetos, donde cada objeto representa una celda.
 * @param {function} props.onCellClick - Función que se ejecuta al hacer clic en una celda.
 * @param {function} props.onCellHover - Función para el evento hover al entrar el ratón en una celda.
 */
function Grid({ gridData, onCellClick, onCellHover }) {
  return (
    <div className="grid">
      {/* Mapea sobre el array de datos del grid */}
      {gridData.map((cell, index) => (
        <Cell
          key={index}
          // Pasa el estado de la celda (e.g., 'body', 'preview')
          status={cell.status} 
          // Pasa las funciones de evento
          onClick={() => onCellClick && onCellClick(index)}
          onMouseEnter={() => onCellHover && onCellHover(index)}
        >
          {/* Pasa el icono como un elemento "hijo" para que se renderice dentro de la celda */}
          {cell.icon} 
        </Cell>
      ))}
    </div>
  );
}

export default Grid;
