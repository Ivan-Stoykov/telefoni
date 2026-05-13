import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatPrice } from "../../utils/currency";
import "./ComparePage.css";

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const initialPhoneId = searchParams.get("id");

  const [allPhones, setAllPhones] = useState([]);
  const [compareSlots, setCompareSlots] = useState([null, null, null]);
  const [searchTerms, setSearchTerms] = useState(["", "", ""]);

  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await fetch("http://localhost:8000/api/phones");
        if (response.ok) {
          const data = await response.json();
          data.map(phone => { phone.name = phone.phone_spec.brand.name + " " + phone.name });
          setAllPhones(data);

          if (initialPhoneId) {
            const selectedPhone = data.find(
              (p) => p.id === parseInt(initialPhoneId),
            );
            if (selectedPhone) {
              setCompareSlots([selectedPhone, null, null]);
            }
          }
        }
      } catch (error) {
        console.error("Грешка при зареждане:", error);
      }
    }
    fetchPhones();
  }, [initialPhoneId]);

  const handleRemove = (index) => {
    const newSlots = [...compareSlots];
    newSlots[index] = null;
    setCompareSlots(newSlots);
  };

  const handleSelectPhone = (index, phone) => {
    const newSlots = [...compareSlots];
    newSlots[index] = phone;
    setCompareSlots(newSlots);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = "";
    setSearchTerms(newSearchTerms);
  };

  const fallbackImage = "/images/asni.jpg";

  return (
    <div className="container-fluid px-4 px-xl-5 py-5 bg-white">
      <div className="row">
        {compareSlots.map((phone, index) => (
          <div className="col-md-4 px-3 mb-5" key={index}>
            {phone ? (
              <div className="d-flex flex-column h-100">
                <div className="text-center mb-4">
                  <img
                    src={phone.phone_spec?.imageUrl || fallbackImage}
                    alt={phone?.name || "Phone"}
                    style={{ height: "250px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>

                <h5 className="fw-bold mb-3">
                  {phone.name || "Unknown Model"}
                </h5>
                <p className="fw-bold text-dark">
                  {formatPrice(phone.price)}
                </p>

                {/* --- СПЕЦИФИКАЦИИ --- */}
                <h6 className="compare-category-title">Body</h6>
                <ul className="compare-specs-list">
                  <li>
                    <span>Dimensions:</span>{" "}
                    {phone.phone_spec?.Dimensions || "N/A"}
                  </li>
                  <li>
                    <span>Weight:</span> {phone.phone_spec?.Weight || "N/A"}
                  </li>
                </ul>

                <h6 className="compare-category-title">Platform</h6>
                <ul className="compare-specs-list">
                  <li>
                    <span>OS:</span> {phone.phone_spec?.OS || "N/A"}
                  </li>
                  <li>
                    <span>Processor:</span>{" "}
                    {phone.phone_spec?.processor
                      ? `${phone.phone_spec.processor.brand} ${phone.phone_spec.processor.name}`
                      : "N/A"}
                  </li>
                  <li>
                    <span>Battery:</span> {phone.phone_spec?.Battery || "N/A"}
                  </li>
                  <li>
                    <span>RAM:</span> {phone.RAM || "N/A"}
                  </li>
                  <li>
                    <span>Storage:</span> {phone.Storage || "N/A"}
                  </li>
                </ul>

                <h6 className="compare-category-title">Display And Audio</h6>
                <ul className="compare-specs-list">
                  <li>
                    <span>Type:</span> {phone.phone_spec?.ScreenType || "N/A"}
                  </li>
                  <li>
                    <span>Resolution:</span>{" "}
                    {phone.phone_spec?.ScreenResolution || "N/A"}
                  </li>
                  <li>
                    <span>Size:</span> {phone.phone_spec?.ScreenSize || "N/A"}
                  </li>
                  <li>
                    <span>Protection:</span>{" "}
                    {phone.phone_spec?.Protection || "N/A"}
                  </li>
                </ul>

                <h6 className="compare-category-title">
                  Connectivity Features
                </h6>
                <ul className="compare-specs-list">
                  <li>
                    <span>WLAN:</span> {phone.phone_spec?.Wifi || "N/A"}
                  </li>
                  <li>
                    <span>Bluetooth:</span>{" "}
                    {phone.phone_spec?.Bluetooth || "N/A"}
                  </li>
                  <li>
                    <span>NFC:</span> {phone.phone_spec?.NFC ? "Yes" : "No"}
                  </li>
                  <li>
                    <span>Port:</span> {phone.phone_spec?.Port || "N/A"}
                  </li>
                </ul>

                <h6 className="compare-category-title">
                  Cameras
                </h6>
                <ul className="compare-specs-list">
                  <li className="row">
                    <div className="col-lg-2">Main:</div> <div className="col-lg-8">{phone.phone_spec.mainCamera
                          .split("\\n")
                          .map((c) => (
                            <span key={c}>
                              {c}
                              <br />
                            </span>
                          )) || "N/A"}</div>
                  </li>
                  <li className="row">
                    <div className="col-lg-2">Selfie:</div> <div className="col-lg-8">{phone.phone_spec?.SelfieCamera || "N/A"}</div>
                  </li>
                </ul>

                <div className="d-flex gap-3 mt-auto pt-3 border-top">
                  <Link
                    to={`/product/${phone.slug}`}
                    className="btn btn-outline-primary btn-sm w-50 py-2 rounded-pill fw-bold"
                  >
                    View Details
                  </Link>
                  <button
                    className="btn btn-outline-secondary btn-sm w-50 py-2 rounded-pill fw-bold"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-compare-slot position-relative h-100">
                <div className="mb-4">
                  <label className="text-muted small fw-bold mb-2">
                    Compare with
                  </label>
                  <input
                    type="text"
                    className="form-control compare-search-input shadow-sm"
                    placeholder="Search phone..."
                    value={searchTerms[index]}
                    onChange={(e) => {
                      const newSearchTerms = [...searchTerms];
                      newSearchTerms[index] = e.target.value;
                      setSearchTerms(newSearchTerms);
                    }}
                  />

                  {searchTerms[index].length > 0 && (
                    <div
                      className="position-absolute w-100 bg-white border rounded shadow-sm mt-1 z-3"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {allPhones
                        .filter((p) =>
                          p.name
                            ?.toLowerCase()
                            .includes(searchTerms[index].toLowerCase()),
                        )
                        .map((p) => (
                          <div
                            key={p.id}
                            className="p-2 border-bottom d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelectPhone(index, p)}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f8f9fa")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            <img
                              src={p.phone_spec?.imageUrl || "/images/asni.jpg"}
                              alt="phone"
                              style={{
                                width: "40px",
                                height: "40px",
                                minWidth: "40px",
                                objectFit: "contain",
                                marginRight: "10px",
                                top: "0",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/asni.jpg";
                              }}
                            />
                            <span className="small fw-bold text-truncate">
                              {p.name || "Unknown Model"}
                            </span>
                          </div>
                        ))}
                      {allPhones.filter((p) =>
                        p.name
                          ?.toLowerCase()
                          .includes(searchTerms[index].toLowerCase()),
                      ).length === 0 && (
                        <div className="p-2 small text-muted text-center">
                          Няма намерени телефони
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;
