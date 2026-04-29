import { useEffect, useState } from 'react';
import './ProductDetails.css';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('#D1E8FF');
  const {slug} = useParams();
  
  const [phone, setPhone] = useState();
  const [selectedModel, setSelectedModel] = useState();

  useEffect(()=>{
    async function fetchPhone() {
      const response = await fetch(`http://localhost:8000/api/phones/${slug}`);
      if(response.ok){
        const resData = await response.json();
        setPhone(resData);
        console.log(resData);
      }
    }
    fetchPhone();
  }, [slug])

  return (
    // Ползваме същия container-fluid като в HomePage за консистентност
    <div className="container-fluid px-4 px-xl-5 py-5 bg-white">
      {phone && <>
      {/* 1. ГОРНА ЧАСТ (Снимка + Основни данни) */}
      <div className="row mb-5">
        
        {/* Лява колона: Снимка */}
        <div className="col-md-5 d-flex justify-content-center">
          <img src={phone.imageUrl} alt={phone.name} className="product-details-img" />
        </div>
        
        {/* Дясна колона: Детайли */}
        <div className="col-md-7 d-flex flex-column justify-content-center ps-lg-5">
          <h2 className="fw-bold mb-4">{phone.name}</h2>
          
           <div className="mb-4">
            <h6 className="fw-bold mb-3">Colors:</h6>
            <div>
              {phone.phone[0].colors.map((color) => (
                <span 
                  key={color.id}
                  className={`color-dot-large ${selectedColor === color.color.color ? 'active' : ''}`}
                  style={{ backgroundColor: color.color.color }}
                  onClick={() => setSelectedColor(color.color.color)}
                ></span>
              ))}
            </div>
          </div>
          {
          <div className="mb-5">
            <h6 className="fw-bold mb-3">Storage:</h6>
            <div className="storage-options">
              {phone.phone.map((option) => (
                <div 
                  key={option.id}
                  className={`storage-box ${selectedModel === option.RAM + " - " + option.Storage ? 'active' : ''}`}
                  onClick={() => setSelectedModel(option.RAM + " - " + option.Storage)}
                >
                  {option.RAM + " - " + option.Storage}
                </div>
              ))}
            </div>
          </div> }

          <div className="d-flex align-items-center gap-5 mt-2">
            <div>
              <p className="text-muted mb-0 fw-bold">Price:</p>
              <h2 className="fw-bold mb-0">{phone.phone[0].price.toFixed(2)} €</h2>
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
              <p>{phone.description}</p>
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
          <>
          <div className="row text-muted small lh-lg">
            <div className="col-md-6 pe-lg-5 border-end">
              <h6 className="fw-bold text-dark mb-4 fs-5">General</h6>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Model Number</div><div className="col-8 text-primary">{phone.ModelNumber}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Series</div><div className="col-8 text-primary">{phone.Series}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Dimensions</div><div className="col-8">{phone.Dimensions}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Weight</div><div className="col-8 text-primary">{phone.Weight}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Operating system</div><div className="col-8 text-primary">{phone.OS}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Colors</div><div className="col-8 text-primary">{phone.phone[0].colors.map(color => color.color.color)}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Battery</div><div className="col-8 text-primary">{phone.Battery}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Charging</div><div className="col-8 text-primary">{phone.Charging}</div></div>

                            <h6 className="fw-bold text-dark mb-4 fs-5">Display and Audio Features</h6>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Display</div><div className="col-8 text-primary">{phone.Display}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Screen Size</div><div className="col-8">{phone.ScreenSize}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Screen Resolution</div><div className="col-8 text-primary">{phone.ScreenResolution}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Screen type</div><div className="col-8 text-primary">{phone.ScreenType}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Protection</div><div className="col-8 text-primary">{phone.Protection}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Speakers</div><div className="col-8 text-primary">{phone.Speakers}</div></div>

                            <h6 className="fw-bold text-dark mb-4 fs-5">Connectivity Features</h6>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Wireless LAN</div><div className="col-8 text-primary">{phone.Wifi}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Bluetooth</div><div className="col-8">{phone.Bluetooth}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Port</div><div className="col-8 text-primary">{phone.Port}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">NFC</div><div className="col-8 text-primary">{phone.NFC == 1 ? 'Yes' : 'No'}</div></div>
              <div className="row mb-2"><div className="col-4 fw-bold text-dark">Positioning</div><div className="col-8 text-primary">{phone.Positioning}</div></div>
            </div>
            <div className="col-md-6 ps-lg-5">
              <h6 className="fw-bold text-dark mb-4 fs-5">Processor And Memory Features</h6>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Processor Brand</div><div className="col-7 text-primary">{phone.processor.brand}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Processor Name</div><div className="col-7 text-primary">{phone.processor.name}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Storage</div><div className="col-7 text-primary">{phone.phone[0].Storage}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">RAM</div><div className="col-7 text-primary">{phone.phone[0].RAM}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Graphic Processor</div><div className="col-7 text-primary">{phone.processor.GPU}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Number of Cores</div><div className="col-7 text-primary">{phone.processor.coreCount}</div></div>

              <h6 className="fw-bold text-dark mb-4 fs-5">Cameras</h6>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Main Camera</div><div className="col-7 text-primary">{phone.mainCamera}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Main Camera Features</div><div className="col-7 text-primary">{phone.MCFeatures}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Main Camera Video</div><div className="col-7 text-primary">{phone.MCVideo}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Selfie Camera</div><div className="col-7 text-primary">{phone.SelfieCamera}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Selfie Camera Features</div><div className="col-7 text-primary">{phone.SCFeatures}</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Selfie Camera Video</div><div className="col-7 text-primary">{phone.SCVideo}</div></div>

                            <h6 className="fw-bold text-dark mb-4 fs-5">Warranty</h6>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Warranty Summary</div><div className="col-7 text-primary">2 Year Limited Warranty</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Warranty Service Type</div><div className="col-7 text-primary">Onsite</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Covered Warranty</div><div className="col-7 text-primary">Manufactory Defects</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Not Covered in Warranty</div><div className="col-7 text-primary">Physical Damage</div></div>
              <div className="row mb-2"><div className="col-5 fw-bold text-dark">Domestic Warranty</div><div className="col-7 text-primary">2 Years</div></div>
            </div>
          </div>
          </>
          
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
        
      </div></>}
    </div>
  );
};

export default ProductDetails;