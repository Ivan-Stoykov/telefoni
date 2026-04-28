import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('#D1E8FF');
  const [selectedStorage, setSelectedStorage] = useState('1TB - 16GB RAM');

  // Фашливи данни
  const phone = {
    brand: 'SAMSUNG',
    model: 'GALAXY S26 ULTRA',
    price: 1949.00,
    image: '/images/asni3.jpg',
    colors: ['#D1E8FF', '#9181B1', '#2D2D2D', '#FFFFFF'],
    storageOptions: ['1TB - 16GB RAM', '512GB - 12GB RAM', '256GB - 12GB RAM'],
    specs: {
      general: {
        modelNumber: 'SM-S948B',
        dimensions: '163.6 x 78.1 x 7.9 mm',
        weight: '214g',
        os: 'Android 16, One UI 8.5',
        battery: 'Li-Ion 5000 mAh'
      },
      processor: {
        brand: 'Qualcomm',
        name: 'Snapdragon 8 Elite Gen 5',
        ram: '16 GB'
      }
    }
  };

  return (
    // Ползваме същия container-fluid като в HomePage за консистентност
    <div className="container-fluid px-4 px-xl-5 py-5 bg-white">
      
      {/* 1. ГОРНА ЧАСТ (Снимка + Основни данни) */}
      <div className="row mb-5">
        
        {/* Лява колона: Снимка */}
        <div className="col-md-5 d-flex justify-content-center">
          <img src={phone.image} alt={phone.model} className="product-details-img" />
        </div>
        
        {/* Дясна колона: Детайли */}
        <div className="col-md-7 d-flex flex-column justify-content-center ps-lg-5">
          <h2 className="fw-bold mb-4">{phone.brand} {phone.model}</h2>
          
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Colors:</h6>
            <div>
              {phone.colors.map((color, index) => (
                <span 
                  key={index}
                  className={`color-dot-large ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h6 className="fw-bold mb-3">Storage:</h6>
            <div className="storage-options">
              {phone.storageOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`storage-box ${selectedStorage === option ? 'active' : ''}`}
                  onClick={() => setSelectedStorage(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-5 mt-2">
            <div>
              <p className="text-muted mb-0 fw-bold">Price:</p>
              <h2 className="fw-bold mb-0">{phone.price.toFixed(2)} €</h2>
            </div>
            <button className="btn btn-outline-primary px-5 py-2 rounded-pill fw-bold" style={{ borderWidth: '2px' }}>
              Add to cart
            </button>
          </div>
        </div>
        
      </div> {/* <-- ТУК ПРИКЛЮЧВА ГОРНАТА ЧАСТ (Много е важно!) */}

      {/* 2. ТАБОВЕ (Навигация) */}
      <div className="custom-tabs">
        <div 
          className={`custom-tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >Description</div>
        <div 
          className={`custom-tab ${activeTab === 'specification' ? 'active' : ''}`}
          onClick={() => setActiveTab('specification')}
        >Specification</div>
        <div 
          className={`custom-tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >Review</div>
      </div>

      {/* 3. СЪДЪРЖАНИЕ НА ТАБОВЕТЕ */}
      <div className="tab-content py-4 px-3">
        
        {/* ТАБ 1: DESCRIPTION */}
        {activeTab === 'description' && (
          <div className="row text-muted small lh-lg">
            <div className="col-md-6 pe-lg-5">
              <h6 className="fw-bold text-dark mb-3">Description</h6>
              <p>Galaxy S26 Ultra automates your life with the power of Galaxy AI. Prevent unwanted onlookers with the built-in privacy display. It can be preset to instantly turn on when receiving notifications...</p>
              <p>Shooting at night is no longer a challenge. Nightography adjusts in real time to illuminate low light videos and photos...</p>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold text-dark mb-3">Feature</h6>
              <ul className="list-unstyled">
                <li className="mb-2">🛡️ Free 1 Year Warranty</li>
                <li className="mb-2">🚚 Free Shipping & Fast Delivery</li>
                <li className="mb-2">🤝 100% Money-back guarantee</li>
                <li className="mb-2">🎧 24/7 Customer support</li>
                <li className="mb-2">💳 Secure payment method</li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold text-dark mb-3">Shipping Information</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><span className="text-dark fw-semibold">Courier:</span> 2 - 4 days, free shipping</li>
                <li className="mb-2"><span className="text-dark fw-semibold">Local Shipping:</span> up to one week, $19.00</li>
                <li className="mb-2"><span className="text-dark fw-semibold">UPS Ground:</span> 4 - 6 days, $29.00</li>
              </ul>
            </div>
          </div>
        )}

        {/* ТАБ 2: SPECIFICATION */}
        {activeTab === 'specification' && (
          <div className="row text-muted small lh-lg">
            <div className="col-md-6 pe-lg-5 border-end">
              <h6 className="fw-bold text-dark mb-4 fs-5">General</h6>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Model Number</div><div className="col-8 text-primary">{phone.specs.general.modelNumber}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Dimensions</div><div className="col-8">{phone.specs.general.dimensions}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Weight</div><div className="col-8 text-primary">{phone.specs.general.weight}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Operating system</div><div className="col-8 text-primary">{phone.specs.general.os}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Battery</div><div className="col-8 text-primary">{phone.specs.general.battery}</div></div>
            </div>
            <div className="col-md-6 ps-lg-5">
              <h6 className="fw-bold text-dark mb-4 fs-5">Processor And Memory Features</h6>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Processor Brand</div><div className="col-7 text-primary">{phone.specs.processor.brand}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Processor Name</div><div className="col-7 text-primary">{phone.specs.processor.name}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">RAM</div><div className="col-7 text-primary">{phone.specs.processor.ram}</div></div>
            </div>
          </div>
        )}

        {/* ТАБ 3: REVIEW */}
        {activeTab === 'review' && (
          <div>
            <div className="row mb-5 align-items-center">
              <div className="col-md-3">
                <div className="rating-box">
                  <h1 className="display-4 fw-bold mb-0">4.7</h1>
                  <p className="mb-2 fs-5 text-warning">★★★★★</p>
                  <small>Customer Rating (934,516)</small>
                </div>
              </div>
              <div className="col-md-7 ps-lg-5 small fw-bold text-secondary">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-primary">★★★★★</div>
                  <div className="progress flex-grow-1 mx-3" style={{ height: '6px' }}><div className="progress-bar bg-primary" style={{ width: '63%' }}></div></div>
                  <div style={{ width: '80px' }}>63% <span className="text-muted fw-normal">(94k)</span></div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-primary">★★★★<span className="text-muted">★</span></div>
                  <div className="progress flex-grow-1 mx-3" style={{ height: '6px' }}><div className="progress-bar bg-primary" style={{ width: '24%' }}></div></div>
                  <div style={{ width: '80px' }}>24% <span className="text-muted fw-normal">(6k)</span></div>
                </div>
              </div>
            </div>

            <h6 className="fw-bold mb-4">Customer Feedback</h6>
            <div className="border-bottom pb-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-secondary rounded-circle me-3" style={{ width: '45px', height: '45px' }}></div>
                <div>
                  <div className="fw-bold">Dianne Russell <span className="text-muted fw-normal ms-2 small">• Just now</span></div>
                  <div className="text-warning small">★★★★★</div>
                </div>
              </div>
              <p className="text-muted small mb-0 lh-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper ut lectus nec tincidunt.</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProductDetails;