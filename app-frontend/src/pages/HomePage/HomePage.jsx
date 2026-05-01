import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. ДОБАВЕНО: Импортираме hook-а за URL параметри
import ProductCard from '../../components/ProductCard/ProductCard';

const HomePage = () => {
  // 2. ДОБАВЕНО: Взимаме каквото е написано в търсачката от линка (напр. ?search=sam)
  const [searchParams] = useSearchParams();
  const searchWord = searchParams.get('search');

  const [filters, setFilters] = useState({
    brand: [],
    storage: [],
    color: [],
    memory: [],
  });

  const [sortType, setSortType] = useState('');

  const handleFilterChange = (category, value, isChecked) => {
    setFilters(prev => {
      const currentValues = prev[category];
      if (isChecked) {
        return { ...prev, [category]: [...currentValues, value] };
      } else {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const [phones, setPhones] = useState([]);

  useEffect(() => {
    async function fetchPhones() {
      const response = await fetch('http://localhost:8000/api/phones');
      if (response.ok) {
        const data = await response.json();
        setPhones(data);
        console.log('Fetched phones:', data);
      }
    }
      fetchPhones();
  }, []);

  // 3. Филтриране на телефоните
  const filteredPhones = phones.filter(phone => {
    // --- НОВО: Филтър от главната търсачка ---
    if (searchWord) {
      const phoneName = phone.phone_spec?.name || phone.name || "";
      // Ако името не съдържа търсената дума, директно го скриваме
      if (!phoneName.toLowerCase().includes(searchWord.toLowerCase())) {
        return false;
      }
    }
    // -----------------------------------------

    // Ако има избрани марки и марката на телефона не е сред тях -> скрий го
    if (filters.brand.length > 0 && !filters.brand.includes(phone.phone_spec.brand.name)) return false;
    
    // Ако има избрана памет и паметта на телефона не е сред тях -> скрий го
    if (filters.storage.length > 0 && !filters.storage.includes(phone.Storage)) return false;
    if (filters.memory.length > 0 && !filters.memory.includes(phone.RAM)) return false;
    if (filters.color.length > 0 && phone.colors.every(color => !filters.color.includes(color.color.color))) return false;

    return true; // Ако мине всички проверки, го покажи
  });

  const sortedPhones = [...filteredPhones].sort((a, b) => {
    if (sortType === 'price-asc') {
      return a.price - b.price; // Ниска към висока
    } 
    if (sortType === 'price-desc') {
      return b.price - a.price; // Висока към ниска
    } 
    
    // За имената комбинираме Марка + Модел, за да е точно
    const nameA = `${a.name}`.toLowerCase();
    const nameB = `${b.name}`.toLowerCase();
    
    if (sortType === 'name-asc') {
      return nameA.localeCompare(nameB); // От А до Я
    }
    if (sortType === 'name-desc') {
      return nameB.localeCompare(nameA); // От Я до А
    }

    return 0; // Ако няма избрано сортиране, не пипай нищо
  });

  return (
    <div className="container-fluid px-4 px-xl-5 py-5 bg-white">
      <div className="row">
        
        {/* Лява колона: Филтри */}
        <div className="col-md-3 col-xl-2 pe-lg-4">
          
          <div className="filter-section">
            {/* Ако имаме активно търсене, показваме един малък текст, за да знае потребителят */}
            {searchWord && (
              <div className="mb-4 p-2 bg-light rounded text-center border">
                <span className="small text-muted">Showing results for:</span><br/>
                <span className="fw-bold text-primary">"{searchWord}"</span>
              </div>
            )}

            {/* Brand */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3">Brand</h6>
              {['Apple', 'Samsung', 'Motorola', 'Xiaomi', 'Honor'].map(brand => (
                <div className="form-check text-muted mb-2 small" key={brand}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id={brand} 
                    onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={brand}>{brand}</label>
                </div>
              ))}
            </div>

            {/* Color */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3">Color</h6>
              {['White', 'Black', 'Orange', 'Blue', 'Green', 'Purple'].map(color => (
                <div className="form-check text-muted mb-2 small" key={color}>
                  <input className="form-check-input" type="checkbox" id={color}
                                      onChange={(e) => handleFilterChange('color', color, e.target.checked)} />
                  <label className="form-check-label" htmlFor={color}>{color}</label>
                </div>
              ))}
            </div>

            {/* Storage */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3">Storage</h6>
              {['128 GB', '256 GB', '512 GB', '1 TB'].map(size => (
                <div className="form-check text-muted mb-2 small" key={size}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id={size} 
                    onChange={(e) => handleFilterChange('storage', size.replace(' ', ''), e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={size}>{size}</label>
                </div>
              ))}
            </div>

            {/* Memory */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3">Memory</h6>
              {['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'].map(mem => (
                <div className="form-check text-muted mb-2 small" key={mem}>
                  <input className="form-check-input" type="checkbox" id={mem}
                                      onChange={(e) => handleFilterChange('memory', mem.replace(' ',''), e.target.checked)} />
                  <label className="form-check-label" htmlFor={mem}>{mem}</label>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Дясна колона: Списък с продукти */}
        <div className="col-md-9 col-xl-10">
          
          {/* Сортиране */}
          <div className="d-flex justify-content-end mb-4 border-bottom pb-3">
            <select 
              className="form-select w-auto btn-sm border-secondary rounded-pill px-3"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {/* Мрежа с продукти */}
          <div className="row">
            {phones.length > 0 && sortedPhones.length > 0 && sortedPhones.map(phone => (
              <div className="col-md-6 col-xl-4 mb-5" key={phone.id}>
                <ProductCard phone={phone} />
              </div>
            ))}
            {phones.length > 0 && sortedPhones.length === 0 && (
              <div className="col-12">
                <p className="text-center text-muted">No phones match the selected filters.</p>
              </div>
            )}
            {phones.length === 0 && (
              <div className="col-12">
                <p className="text-center text-muted">Loading phones...</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default HomePage;