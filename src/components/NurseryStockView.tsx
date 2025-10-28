import React from 'react';
import { NurseryStock } from '../types';
import './NurseryStockView.css';

interface NurseryStockViewProps {
  stocks: NurseryStock[];
}

const formatNumber = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const NurseryStockView: React.FC<NurseryStockViewProps> = ({ stocks }) => {
  if (stocks.length === 0) {
    return null;
  }

  return (
    <div className="nursery-stock-view">
      <h3>🏫 保育園にある在庫</h3>
      <div className="stock-list">
        {stocks.map((stock) => {
          const hasRequirement = stock.requiredStock > 0;
          const stockRatio = hasRequirement ? stock.currentStock / stock.requiredStock : 1;
          const statusClass = 
            stockRatio >= 1 ? 'sufficient' :
            stockRatio >= 0.5 ? 'warning' : 'insufficient';
          
          return (
            <div key={stock.itemId} className={`stock-item ${statusClass}`}>
              <div className="stock-icon">{stock.icon}</div>
              <div className="stock-info">
                <div className="stock-name">{stock.itemName}</div>
                <div className="stock-count">
                  {formatNumber(stock.currentStock)} {stock.unit}
                  {hasRequirement && (
                    <span className="stock-required">
                      {' '} / {formatNumber(stock.requiredStock)}{stock.unit}
                    </span>
                  )}
                </div>
                <div className="stock-progress-bar">
                  <div 
                    className="stock-progress-fill"
                    style={{ width: `${Math.min(100, stockRatio * 100)}%` }}
                  />
                </div>
              </div>
              <div className="stock-status">
                {stockRatio >= 1 ? '✅' : stockRatio >= 0.5 ? '⚠️' : '🔴'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NurseryStockView;
