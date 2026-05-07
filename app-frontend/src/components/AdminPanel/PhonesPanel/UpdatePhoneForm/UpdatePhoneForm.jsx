import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./UpdatePhoneForm.css";
import { useParams } from "react-router-dom";

const UpdatePhonePage = () => {
  // Форма 1: Специфични данни за модела (Table: phones)
  const { slug } = useParams();
  const phoneForm = useForm();
  const [initialData, setInitialData] = useState();
  // Форма 2: Общи технически спецификации (Table: phone_specs)
  const specForm = useForm();

  useEffect(() => {
    async function fetchPhone() {
      const response = await fetch(`http://localhost:8000/api/phones/${slug}`);
      const data = await response.json();
      setInitialData(data.phone);
      console.log(data);
      const nameArr = data.phone.name.split(" ");
      nameArr.shift();
      const name = nameArr.join(" ");

      phoneForm.reset({
        name: name,
        price: data.phone.price,
        brand: data.phone.phone_spec.brand.name,
        RAM: data.phone.RAM,
        Storage: data.phone.Storage,
      });
      specForm.reset(data.phone.phone_spec);
    }
    fetchPhone();
  }, [slug, phoneForm, specForm]);

  const onPhoneSubmit = (data) => {
    console.log("Updating Phone Basic Info:", data);
    // API Call: PUT /api/phones/:id
  };

  const onSpecSubmit = (data) => {
    console.log("Updating Shared Specifications:", data);
    // API Call: PUT /api/specs/:id
  };

  return (
    <div className="update-container">
      <div className="container">
        <div className="row g-4">
          {/* ЛЯВА СТРАНА: ФОРМА ЗА МОДЕЛА */}
          <div className="col-lg-5">
            <div className="edit-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Model Information</h4>
                <span className="badge bg-primary">
                  Device ID: {initialData?.id}
                </span>
              </div>

              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
                <div className="mb-3">
                  <label>Product Name</label>
                  <input
                    {...phoneForm.register("name")}
                    className="form-control"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label>Price (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...phoneForm.register("price")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label>Brand</label>
                    <input
                      {...phoneForm.register("brand")}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label>RAM Configuration</label>
                    <input
                      {...phoneForm.register("RAM")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <label>Internal Storage</label>
                    <input
                      {...phoneForm.register("Storage")}
                      className="form-control"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-save-admin w-100 mt-auto"
                >
                  Update Model Only
                </button>
              </form>
            </div>
          </div>

          {/* ДЯСНА СТРАНА: ФОРМА ЗА СПЕЦИФИКАЦИЯТА */}
          <div className="col-lg-6">
            <div className="edit-card">
              <div className="spec-header mb-4">
                <h4 className="fw-bold mb-0">Technical Specifications</h4>
                <small>Spec ID: #{initialData?.phoneSpecId}</small>
              </div>

              <form onSubmit={specForm.handleSubmit(onSpecSubmit)}>
                {/* Секция: Дисплей */}
                <div className="form-subsection-title">Display & Screen</div>
                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label>Display Technology</label>
                    <input
                      {...specForm.register("Display")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Screen Size</label>
                    <input
                      {...specForm.register("ScreenSize")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Resolution</label>
                    <input
                      {...specForm.register("ScreenResolution")}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Секция: Процесор */}
                <div className="form-subsection-title">Core Performance</div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label>Operating System</label>
                    <input
                      {...specForm.register("OS")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Battery Capacity</label>
                    <input
                      {...specForm.register("Battery")}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Секция: Камери */}
                <div className="form-subsection-title">Imaging System</div>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label>Main Camera Setup</label>
                    <input
                      {...specForm.register("mainCamera")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Selfie Camera</label>
                    <input
                      {...specForm.register("SelfieCamera")}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="alert alert-info border-0 bg-light-blue small mb-4">
                  <strong>Бележка:</strong> Промените тук се отразяват глобално
                  за всички устройства, ползващи този Spec ID.
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-dark fw-bold w-100 py-3 shadow-sm"
                >
                  Update Shared Specifications
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePhonePage;
