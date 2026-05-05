import { useEffect, useState, useCallback } from "react";
import "./ProductDetails.css";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState();
  const { slug } = useParams();
  const model = slug.split("_")[slug.split("_").length - 1];

  const [phone, setPhone] = useState(null);
  
  // --- НОВИ STATE-ове ЗА РЕВЮТАТА ---
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const { addToCart } = useCart();

  // Взимаме токена и логнатия потребител за авторизация
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null; 
  // Забележка: В зависимост от това как записваш юзъра при логин, може да е currentUser.user.id или директно currentUser.id. Провери го!

  // Изнасяме fetch-а в отделна функция, за да можем да го викаме пак след добавяне/триене на ревю
  const fetchPhone = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/phones/${slug}`);
      if (response.ok) {
        const resData = await response.json();
        setPhone(resData);
        if (resData.phone.colors && resData.phone.colors.length > 0) {
            setSelectedColor(resData.phone.colors[0].color.color);
        }
      }
    } catch (error) {
      console.error("Грешка при зареждане на телефона:", error);
    }
  }, [slug]);

  useEffect(() => {
    fetchPhone();
  }, [fetchPhone]);

  // --- ДОБАВЯНЕ НА РЕВЮ ---
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
        alert("Трябва да влезете в профила си, за да оставите ревю!");
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/phones/${phone.phone.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // За Sanctum
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        setComment("");
        setRating(5);
        fetchPhone(); // Презареждаме данните, за да се появи новото ревю веднага
        //alert("Ревюто е добавено успешно!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Грешка при добавяне на ревю.");
      }
    } catch (error) {
      console.error("Грешка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // --- ОТКАЗ ОТ РЕДАКЦИЯ ---
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  // --- ИЗПРАЩАНЕ НА РЕДАКТИРАНОТО РЕВЮ (PUT заявка) ---
  const handleUpdateReview = async (e, reviewId) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      });

      if (response.ok) {
        setEditingReviewId(null); // Затваряме формата за редакция
        fetchPhone(); // Презареждаме ревютата, за да покажем промените
        //alert("Ревюто е обновено успешно!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Грешка при обновяване на ревюто.");
      }
    } catch (error) {
      console.error("Грешка:", error);
    }
  };

  // --- ИЗТРИВАНЕ НА РЕВЮ ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете това ревю?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        fetchPhone(); // Презареждаме след изтриване
      } else {
        alert("Грешка при изтриване.");
      }
    } catch (error) {
      console.error("Грешка:", error);
    }
  };

  // Помощна функция за форматиране на датата
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Изчисляване на среден рейтинг
  const reviews = phone?.phone?.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="container-fluid px-4 px-xl-5 py-5 bg-white">
      {phone && (
        <>
          {/* ГОРНА ЧАСТ */}
          <div className="row mb-5">
            <div className="col-md-5 d-flex justify-content-center">
              <img
                src={phone.phone.phone_spec.imageUrl}
                alt={phone.phone.name}
                className="product-details-img"
              />
            </div>

            <div className="col-md-7 d-flex flex-column justify-content-center ps-lg-5">
              <h2 className="fw-bold mb-4">{phone.phone.name}</h2>

              <div className="mb-4">
                <h6 className="fw-bold mb-3">Colors:</h6>
                <div>
                  {phone.phone.colors.map((color) => (
                    <span
                      key={color.id}
                      className={`color-dot-large ${selectedColor === color.color.color ? "active" : ""}`}
                      style={{ backgroundColor: color.color.color }}
                      onClick={() => setSelectedColor(color.color.color)}
                    ></span>
                  ))}
                </div>
              </div>
              
              <div className="mb-5">
                <h6 className="fw-bold mb-3">Storage:</h6>
                <div className="storage-options">
                  {phone.models.map((option) => (
                    <Link key={option.id} to={`/product/${option.slug}`}>
                      <div
                        className={`storage-box ${model === option.Storage ? "active" : ""}`}
                      >
                        {option.RAM + " - " + option.Storage}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="d-flex align-items-center gap-5 mt-2">
                <div>
                  <p className="text-muted mb-0 fw-bold">Price:</p>
                  <h2 className="fw-bold mb-0">
                    {phone.phone.price.toFixed(2)} €
                  </h2>
                </div>
                <button
                  className="btn btn-outline-primary px-5 py-2 rounded-pill fw-bold"
                  style={{ borderWidth: "2px" }}
                  onClick={() =>
                    addToCart({ phone: phone.phone, color: selectedColor })
                  }
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* ТАБОВЕ */}
          <div className="custom-tabs">
            <div
              className={`custom-tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </div>
            <div
              className={`custom-tab ${activeTab === "specification" ? "active" : ""}`}
              onClick={() => setActiveTab("specification")}
            >
              Specification
            </div>
            <div
              className={`custom-tab ${activeTab === "review" ? "active" : ""}`}
              onClick={() => setActiveTab("review")}
            >
              Review ({reviews.length})
            </div>
          </div>

          {/* СЪДЪРЖАНИЕ НА ТАБОВЕТЕ */}
          <div className="tab-content py-4 px-3">
            
            {/* ... ТАБ 1 И ТАБ 2 (Остават същите като в твоя код, спестявам ги за краткост) ... */}
            {activeTab === "description" && (
                <div className="row text-muted small lh-lg">
                  {/* Твоето Description съдържание... */}
                  <div className="col-md-6 pe-lg-5">
                    <h6 className="fw-bold text-dark mb-3">Description</h6>
                    <p>{phone.phone.phone_spec.description}</p>
                  </div>
                </div>
            )}
            {activeTab === "specification" && (
              <>
                <div className="row text-muted small lh-lg">
                  <div className="col-md-6 pe-lg-5 border-end">
                    <h6 className="fw-bold text-dark mb-4 fs-5">General</h6>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">
                        Model Number
                      </div>
                      <div className="col-8">
                        {phone.phone.phone_spec.ModelNumber}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Series</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Series}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Dimensions</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Dimensions}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Weight</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Weight}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">
                        Operating system
                      </div>
                      <div className="col-8">{phone.phone.phone_spec.OS}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Colors</div>
                      <div className="col-8">
                        {phone.phone.colors.map((color) => color.color.color)}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Battery</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Battery}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Charging</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Charging}
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-4 fs-5">
                      Display and Audio Features
                    </h6>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Display</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Display}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Screen Size</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.ScreenSize}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">
                        Screen Resolution
                      </div>
                      <div className="col-8">
                        {phone.phone.phone_spec.ScreenResolution}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Screen type</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.ScreenType}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Protection</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Protection}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Speakers</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Speakers}
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-4 fs-5">
                      Connectivity Features
                    </h6>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">
                        Wireless LAN
                      </div>
                      <div className="col-8">{phone.phone.phone_spec.Wifi}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Bluetooth</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Bluetooth}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Port</div>
                      <div className="col-8">{phone.phone.phone_spec.Port}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">NFC</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.NFC == 1 ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 fw-bold text-dark">Positioning</div>
                      <div className="col-8">
                        {phone.phone.phone_spec.Positioning}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 ps-lg-5">
                    <h6 className="fw-bold text-dark mb-4 fs-5">
                      Processor And Memory Features
                    </h6>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Processor Brand
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.processor.brand}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Processor Name
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.processor.name}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">Storage</div>
                      <div className="col-7">{phone.phone.Storage}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">RAM</div>
                      <div className="col-7">{phone.phone.RAM}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Graphic Processor
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.processor.GPU}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Number of Cores
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.processor.coreCount}
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-4 fs-5">Cameras</h6>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">Main Camera</div>
                      <div className="col-7">
                        {phone.phone.phone_spec.mainCamera
                          .split("\\n")
                          .map((c) => (
                            <>
                              {c}
                              <br />
                            </>
                          ))}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Main Camera Features
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.MCFeatures}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Main Camera Video
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.MCVideo}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Selfie Camera
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.SelfieCamera}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Selfie Camera Features
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.SCFeatures}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Selfie Camera Video
                      </div>
                      <div className="col-7">
                        {phone.phone.phone_spec.SCVideo}
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-4 fs-5">Warranty</h6>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Warranty Summary
                      </div>
                      <div className="col-7">2 Year Limited Warranty</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Warranty Service Type
                      </div>
                      <div className="col-7">Onsite</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Covered Warranty
                      </div>
                      <div className="col-7">Manufactory Defects</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Not Covered in Warranty
                      </div>
                      <div className="col-7">Physical Damage</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 fw-bold text-dark">
                        Domestic Warranty
                      </div>
                      <div className="col-7">2 Years</div>
                    </div>
                  </div>
                </div>
              </>
            )}


            {/* ТАБ 3: REVIEW */}
            {activeTab === "review" && (
              <div>
                {/* ГОРНА ЧАСТ: Рейтинг (ляво) и Форма (дясно) на един ред */}
                <div className="row mb-5 align-items-stretch">
                  
                  {/* ЛЯВА КОЛОНА: ОБЩ РЕЙТИНГ */}
                  <div className="col-lg-4 col-md-5 mb-4 mb-md-0 d-flex">
                    <div 
                      className="rating-box p-4 rounded w-100 d-flex flex-column justify-content-center align-items-center text-center shadow-sm"
                      style={{ backgroundColor: '#1e293b', color: '#fff' }} // Тъмен slate фон за отличен контраст
                    >
                      <h1 className="display-2 fw-bold mb-2 text-white">{averageRating}</h1>
                      <div className="mb-2 fs-4 text-warning">
                         {"★".repeat(Math.round(averageRating))}
                         <span style={{ color: '#475569' }}>{"★".repeat(5 - Math.round(averageRating))}</span>
                      </div>
                      <small style={{ color: '#cbd5e1' }}>Customer Reviews ({reviews.length})</small>
                    </div>
                  </div>

                  {/* ДЯСНА КОЛОНА: ФОРМА ЗА РЕВЮ */}
                  <div className="col-lg-8 col-md-7 d-flex">
                    {token ? (
                      <form 
                        onSubmit={handleAddReview} 
                        className="p-4 border rounded shadow-sm w-100 d-flex flex-column justify-content-center" 
                        style={{ backgroundColor: '#f8fafc' }}
                      >
                        <h6 className="fw-bold mb-3">Write a Review</h6>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="fw-bold mb-2 small text-muted">Rating</label>
                            <select 
                              className="form-select" 
                              value={rating} 
                              onChange={(e) => setRating(Number(e.target.value))}
                            >
                              <option value={5}>5 - Excellent ★★★★★</option>
                              <option value={4}>4 - Very Good ★★★★☆</option>
                              <option value={3}>3 - Average ★★★☆☆</option>
                              <option value={2}>2 - Poor ★★☆☆☆</option>
                              <option value={1}>1 - Terrible ★☆☆☆☆</option>
                            </select>
                          </div>
                          <div className="col-md-8 mb-3">
                            <label className="fw-bold mb-2 small text-muted">Your Review</label>
                            <textarea 
                              className="form-control" 
                              rows="2" 
                              placeholder="What do you think about this phone?"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="text-end mt-auto">
                          <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="w-100 p-4 border rounded shadow-sm d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8fafc' }}>
                        <p className="mb-0 text-muted fs-5">
                          Please <Link to="/login" className="fw-bold text-primary text-decoration-none">login</Link> to leave a review.
                        </p>
                      </div>
                    )}
                  </div>
                </div>                
                {/* СПИСЪК С РЕВЮТА */}
                <h6 className="fw-bold mb-4 border-bottom pb-2">Customer Feedback</h6>
                
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    [...reviews]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((review) => {
                        const isEditing = editingReviewId === review.id;
                        const isOwner = currentUser && (currentUser.id === review.user_id || currentUser?.user?.id === review.user_id);

                        return (
                          <div key={review.id} className="pb-4 mb-4 position-relative" style={{ borderBottom: '1px dashed #e2e8f0' }}>
                            
                            <div className="d-flex align-items-center mb-2">
                              <div
                                className="rounded-circle me-3 d-flex justify-content-center align-items-center text-white fw-bold fs-5 shadow-sm"
                                style={{ width: "48px", height: "48px", backgroundColor: '#3b82f6' }}
                              >
                                {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <div className="fw-bold text-dark fs-6">
                                  {review.user?.name || "Unknown User"} 
                                  <span className="text-muted fw-normal ms-2 small" style={{ fontSize: '0.8rem' }}>
                                    • {formatDate(review.created_at)}
                                  </span>
                                </div>
                                {/* Показваме звездите само ако не сме в режим на редакция */}
                                {!isEditing && (
                                  <div className="text-warning" style={{ fontSize: '0.9rem' }}>
                                    {"★".repeat(review.rating)}
                                    <span style={{ color: '#e2e8f0' }}>{"★".repeat(5 - review.rating)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* РЕЖИМ НА РЕДАКЦИЯ ИЛИ НОРМАЛЕН ИЗГЛЕД */}
                            {isEditing ? (
                              <form onSubmit={(e) => handleUpdateReview(e, review.id)} className="ps-5 ms-3 mt-3">
                                <div className="mb-2">
                                  <select 
                                    className="form-select form-select-sm w-auto mb-2" 
                                    value={editRating} 
                                    onChange={(e) => setEditRating(Number(e.target.value))}
                                  >
                                    <option value={5}>5 - Excellent ★★★★★</option>
                                    <option value={4}>4 - Very Good ★★★★☆</option>
                                    <option value={3}>3 - Average ★★★☆☆</option>
                                    <option value={2}>2 - Poor ★★☆☆☆</option>
                                    <option value={1}>1 - Terrible ★☆☆☆☆</option>
                                  </select>
                                  <textarea 
                                    className="form-control" 
                                    rows="2" 
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    required
                                  ></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                  <button type="submit" className="btn btn-sm btn-success">Save</button>
                                  <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-muted small mb-0 lh-lg ps-5 ms-3">
                                {review.comment}
                              </p>
                            )}

                            {/* БУТОНИ ЗА EDIT И DELETE */}
                            {isOwner && !isEditing && (
                              <div className="position-absolute top-0 end-0 mt-1 d-flex gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleStartEdit(review)}
                                  title="Edit your review"
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteReview(review.id)}
                                  title="Delete your review"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    // ... (Празно състояние, ако няма ревюта)
                    <div className="text-center py-5 text-muted">
                      <div className="fs-1 mb-3">💬</div>
                      <p className="fs-5">No reviews yet. Be the first to review this phone!</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;