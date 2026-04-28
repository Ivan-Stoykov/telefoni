import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';


const ProductCard = ({ phone }) => {
  return (
    // МАХНАХМЕ най-външния <div className="col-md-4">
    // Сега директно започваме с картата:
    <div className="card border-0 h-100 product-card shadow-sm p-2">
      <Link to={`/product/${phone.id}`} className="text-decoration-none text-dark">
      {/* Снимка */}
      <img 
        src={phone.image} 
        className="card-img-top product-image" 
        alt={`${phone.brand} ${phone.model}`} 
      />
      </Link>
      
      <div className="card-body d-flex flex-column">
        {/* Заглавие и Модел */}
        <Link to={`/product/${phone.id}`} className="text-decoration-none text-dark">
        <h6 className="card-title mb-1 fw-bold">
          {phone.brand} {phone.model} {phone.storage}
        </h6>
        </Link>

        {/* Таг за реновиран (ако има) */}
        {phone.refurbished && (
          <p className="text-primary small fw-bold mb-1">Refurbished</p>
        )}
        
        {/* Цена */}
        <p className="price-text mb-2">{phone.price.toFixed(2)} €</p>
        
        {/* Характеристики */}
        <div className="specs-list mb-3">
          <div>Processor: {phone.specs.cpu}</div>
          <div>Battery: {phone.specs.battery}</div>
          <div>RAM: {phone.specs.ram}</div>
        </div>

        {/* Цветове */}
        <div className="mb-3">
          <div className="small text-muted mb-1">Colors</div>
          <div className="d-flex">
            {phone.colors.map((color, index) => (
              <span 
                key={index} 
                className="color-dot" 
                style={{ backgroundColor: color }}
                title={color}
              ></span>
            ))}
          </div>
        </div>

        {/* Бутони (най-отдолу) */}
        <div className="mt-auto d-flex gap-2">
          <button className="btn btn-outline-dark btn-sm w-100 py-2">Add to cart</button>
          <button className="btn btn-outline-secondary btn-sm w-100 py-2">Compare</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;