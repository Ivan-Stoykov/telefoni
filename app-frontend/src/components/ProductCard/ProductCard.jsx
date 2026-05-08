import './ProductCard.css';
import { Link } from 'react-router-dom';

const ProductCard = ({ phone }) => {

  return (
    
    <div className="card border-0 h-100 product-card shadow-sm p-2">
      <Link to={`/product/${phone.slug}`} className="text-decoration-none text-dark">
        {/* Снимка */}
        <img
          src={phone.phone_spec.imageUrl}
          className="card-img-top product-image"
          alt={`${phone.name}`}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <Link to={`/product/${phone.slug}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-1 fw-bold">
            {phone.phone_spec.brand.name + " " + phone.name}
          </h6>
        </Link>

        <p className="price-text mb-2">{phone.price.toFixed(2)} €</p>

        <div className="specs-list mb-3">
          <div>Processor: {phone.phone_spec.processor.brand + " " + phone.phone_spec.processor.name}</div>
          <div>Battery: {phone.phone_spec.Battery}</div>
          <div>RAM: {phone.RAM}</div>
        </div>

        <div className="mb-3">
          <div className="small text-muted mb-1">Colors</div>
          <div className="d-flex">
            {phone.colors.map((color) => (
              <span
                key={color.id}
                className="color-dot"
                style={{ backgroundColor: color.color.color }}
                title={color.color.color}
              ></span>
            ))}
          </div>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link to={`/product/${phone.slug}`} className="btn btn-outline-dark btn-sm w-100 py-2">
            View Details
          </Link>
          <Link to={`/compare?id=${phone.id}`} className="w-100 text-decoration-none">
            <button className="btn btn-outline-secondary btn-sm w-100 py-2">Compare</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;