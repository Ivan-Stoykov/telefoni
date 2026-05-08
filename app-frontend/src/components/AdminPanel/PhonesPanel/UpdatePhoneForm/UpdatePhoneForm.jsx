import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./UpdatePhoneForm.css";
import { useParams } from "react-router-dom";

const UpdatePhonePage = () => {
  const { slug } = useParams();
  const phoneForm = useForm();
  const [initialData, setInitialData] = useState();
  const specForm = useForm();

  useEffect(() => {
    async function fetchPhone() {
      const response = await fetch(`http://localhost:8000/api/phones/${slug}`);
      const data = await response.json();
      setInitialData(data.phone);
      console.log(data);

      phoneForm.reset({
        name: data.phone.name,
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
  };

  const onSpecSubmit = (data) => {
    console.log("Updating Shared Specifications:", data);
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

              <form onSubmit={specForm.handleSubmit(onSpecSubmit)} className="row g-3">
                <div className="form-subsection-title">General & Build</div>
                <div className="col-md-6">
                  <label>Model Number</label>
                  <input
                    {...specForm.register("ModelNumber")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Series</label>
                  <input
                    {...specForm.register("Series")}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label>Dimensions</label>
                  <input
                    {...specForm.register("Dimensions")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Weight</label>
                  <input
                    {...specForm.register("Weight")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Operating system</label>
                  <input {...specForm.register("OS")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Battery</label>
                  <input
                    {...specForm.register("Battery")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Charging</label>
                  <input
                    {...specForm.register("Charging")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Speakers</label>
                  <select
                    {...specForm.register("Speakers")}
                    className="form-select"
                  >
                    <option value="Stereo speakers">Stereo Speakers</option>
                    <option value="Mono speaker">Mono Speaker</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label>ImageURL</label>
                  <input
                    {...specForm.register("imageUrl")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Display</div>
                <div className="col-12">
                  <label>Display Info</label>
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
                  <label>Screen Resolution</label>
                  <input
                    {...specForm.register("ScreenResolution")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Screen Type</label>
                  <input
                    {...specForm.register("ScreenType")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Protection</label>
                  <input
                    {...specForm.register("Protection")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Connectivity</div>
                <div className="col-12">
                  <label>Wireless LAN</label>
                  <input {...specForm.register("Wifi")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Bluetooth</label>
                  <input
                    {...specForm.register("Bluetooth")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Port</label>
                  <input {...specForm.register("Port")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>NFC</label>
                  <select {...specForm.register("NFC")} className="form-select">
                    <option value={1}>Yes</option>
                    <option value={2}>No</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Positioning</label>
                  <input
                    {...specForm.register("Positioning")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Processor</div>
                <div className="col-md-6">
                  <label>Processor Brand</label>
                  <input
                    {...specForm.register("processor.brand")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Processor Name</label>
                  <input
                    {...specForm.register("processor.name")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>GPU</label>
                  <input
                    {...specForm.register("processor.GPU")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Core Count</label>
                  <input
                    type="number"
                    {...specForm.register("processor.coreCount")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Cameras</div>
                <div className="col-12">
                  <label>Main Camera</label>
                  <input
                    type="text"
                    {...specForm.register("mainCamera")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Main Camera Features</label>
                  <input
                    type="text"
                    {...specForm.register("MCFeatures")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Main Camera Video</label>
                  <input
                    type="text"
                    {...specForm.register("MCVideo")}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label>Selfie Camera</label>
                  <input
                    type="text"
                    {...specForm.register("SelfieCamera")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Selfie Camera Features</label>
                  <input
                    type="text"
                    {...specForm.register("SCFeatures")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Selfie Camera Video</label>
                  <input
                    type="text"
                    {...specForm.register("SCVideo")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Description</div>
                <div className="col-md-12">
                  <textarea
                    {...specForm.register("description")}
                    className="form-control"
                    rows="6"
                  />
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
