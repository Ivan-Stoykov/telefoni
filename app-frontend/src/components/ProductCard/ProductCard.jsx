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
        src={phone.imageUrl} 
        className="card-img-top product-image" 
        alt={`${phone.name}`} 
      />
      </Link>
      
      <div className="card-body d-flex flex-column">
        {/* Заглавие и Модел */}
        <Link to={`/product/${phone.id}`} className="text-decoration-none text-dark">
        <h6 className="card-title mb-1 fw-bold">
          {phone.name}
        </h6>
        </Link>
        
        {/* Цена */}
        <p className="price-text mb-2">{phone.price.toFixed(2)} €</p>
        
        {/* Характеристики */}
        <div className="specs-list mb-3">
          <div>Processor: {phone.phone_spec.processor.brand + " " + phone.phone_spec.processor.name}</div>
          <div>Battery: {phone.phone_spec.battery}</div>
          <div>RAM: {phone.RAM}</div>
        </div>

        {/* Цветове */}
        <div className="mb-3">
          <div className="small text-muted mb-1">Colors</div>
          <div className="d-flex">
            {phone.colors.map((color) => (
              <span 
                key={color.id} 
                className="color-dot" 
                style={{ backgroundColor: color.color }}
                title={color.color}
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