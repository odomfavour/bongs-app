import React from 'react';

const CustomTooltip = ({ active, payload, label, coordinate } : any) => {
  if (active && payload && payload.length) {
    // Get tooltip dimensions
    const tooltipWidth = 150; // Adjust based on your tooltip's actual width
    const tooltipHeight = 50; // Adjust based on your tooltip's actual height

    // Get screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate tooltip position
    let left = coordinate.x + 10;
    let top = coordinate.y + 10;

    // Adjust if tooltip goes off the right side of the screen
    if (left + tooltipWidth > screenWidth) {
      left = screenWidth - tooltipWidth - 10;
    }

    // Adjust if tooltip goes off the bottom side of the screen
    if (top + tooltipHeight > screenHeight) {
      top = screenHeight - tooltipHeight - 10;
    }

    return (
      <div
        className="custom-tooltip"
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
