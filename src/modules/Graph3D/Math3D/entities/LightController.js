// LightController.jsx
import React from 'react';

const LightController = ({ lightPower, onChange }) => (
    <div style={{
        margin: '10px 0',
        padding: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        width: 180,
        fontSize: 12
    }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ minWidth: 70 }}>Освещение:</span>
            <input
                type="range"
                min="0"
                max="10000"
                step="1"
                value={lightPower}
                onChange={e => onChange(Number(e.target.value))}
                style={{ 
                    flexGrow: 1,
                    height: 4,
                    cursor: 'pointer',
                    background: `linear-gradient(90deg, 
                        rgb(0, 255, 21) ${(lightPower/10000 * 100)}%, 
                        #eee ${(lightPower/10000 * 100)}%)`,
                    borderRadius: 4,
                    appearance: 'none'
                }}
            />
            <span style={{ 
                minWidth: 40,
                marginLeft: 6,
                fontFamily: 'monospace',
                fontSize: 12
            }}>
                {lightPower}
            </span>
        </label>
    </div>
);

export default LightController;