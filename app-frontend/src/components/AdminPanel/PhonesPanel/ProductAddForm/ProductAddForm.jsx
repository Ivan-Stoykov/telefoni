import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { formatPrice } from "../../../../utils/currency";
import "./ProductAddForm.css";

const ProductAddForm = () => {
  const [useExistingSpecs, setUseExistingSpecs] = useState(false);
  const [phoneSpecs, setPhoneSpecs] = useState([]);

  const { register, control, handleSubmit, unregister } = useForm({
    defaultValues: { colors: [{ colorName: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "colors" });

  const onSubmit = async (data) => {
    console.log("Submit Data:", data);
    const response = await fetch("http://localhost:8000/api/phones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("Product added successfully!");
    }
  };

  useEffect(() => {
    async function fetchSpecs() {
      const response = await fetch("http://localhost:8000/api/phoneSpecs");
      const data = await response.json();
      setPhoneSpecs(data);
    }
    fetchSpecs();
  }, []);

  return (
    <div className="container py-5">
      <div className="admin-form-card p-4 p-md-5">
        <h2>Product & Specifications Details</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Секция: Обща информация */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label>Product Model</label>
              <input {...register("name")} className="form-control" />
            </div>

            <div className="col-12">
              <label>Price (€)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label>RAM</label>
              <input {...register("RAM")} className="form-control" />
            </div>
            <div className="col-md-6">
              <label>Storage</label>
              <input {...register("Storage")} className="form-control" />
            </div>
          </div>

          <div className="section-header d-flex justify-content-between align-items-center">
            <div className="section-title mb-0">Technical Specifications</div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => {
                  setUseExistingSpecs(e.target.checked);
                  if (e.target.checked) {
                    unregister("specs");
                  } else {
                    unregister("phoneSpecId");
                  }
                }}
              />
              <label
                className="form-check-label ms-2"
                style={{ fontSize: "0.8rem" }}
              >
                Use existing specification
              </label>
            </div>
          </div>

          <div
            className="spec-container p-3 rounded-3 mb-4"
            style={{ backgroundColor: "#f8f9fa", border: "1px solid #eee" }}
          >
            {useExistingSpecs ? (
              <div className="col-12">
                <label>Existing Specification</label>
                <select
                  type="number"
                  {...register("phoneSpecId")}
                  className="form-select"
                  placeholder=""
                >
                  {phoneSpecs.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.specName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="row g-3">
                <div className="form-subsection-title">General & Build</div>
                <div className="col-md-12">
                  <label>Brand</label>
                  <input
                    type="text"
                    {...register("brand")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Model Number</label>
                  <input
                    {...register("specs.ModelNumber")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Series</label>
                  <input
                    {...register("specs.Series")}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label>Dimensions</label>
                  <input
                    {...register("specs.Dimensions")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Weight</label>
                  <input
                    {...register("specs.Weight")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Operating system</label>
                  <input {...register("specs.OS")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Battery</label>
                  <input
                    {...register("specs.Battery")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Charging</label>
                  <input
                    {...register("specs.Charging")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Speakers</label>
                  <select
                    {...register("specs.Speakers")}
                    className="form-select"
                  >
                    <option value="Stereo speakers">Stereo Speakers</option>
                    <option value="Mono speaker">Mono Speaker</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label>ImageURL</label>
                  <input
                    {...register("specs.imageUrl")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Display</div>
                <div className="col-12">
                  <label>Display Info</label>
                  <input
                    {...register("specs.Display")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Screen Size</label>
                  <input
                    {...register("specs.ScreenSize")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Screen Resolution</label>
                  <input
                    {...register("specs.ScreenResolution")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Screen Type</label>
                  <input
                    {...register("specs.ScreenType")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Protection</label>
                  <input
                    {...register("specs.Protection")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Connectivity</div>
                <div className="col-12">
                  <label>Wireless LAN</label>
                  <input {...register("specs.Wifi")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Bluetooth</label>
                  <input
                    {...register("specs.Bluetooth")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Port</label>
                  <input {...register("specs.Port")} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>NFC</label>
                  <select {...register("specs.NFC")} className="form-select">
                    <option value={1}>Yes</option>
                    <option value={2}>No</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label>Positioning</label>
                  <input
                    {...register("specs.Positioning")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Processor</div>
                <div className="col-md-6">
                  <label>Processor Brand</label>
                  <input
                    {...register("specs.processor.brand")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Processor Name</label>
                  <input
                    {...register("specs.processor.name")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>GPU</label>
                  <input
                    {...register("specs.processor.GPU")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Core Count</label>
                  <input
                    type="number"
                    {...register("specs.processor.coreCount")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Cameras</div>
                <div className="col-12">
                  <label>Main Camera</label>
                  <input
                    type="text"
                    {...register("specs.MainCamera")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Main Camera Features</label>
                  <input
                    type="text"
                    {...register("specs.MCFeatures")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Main Camera Video</label>
                  <input
                    type="text"
                    {...register("specs.MCVideo")}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label>Selfie Camera</label>
                  <input
                    type="text"
                    {...register("specs.SelfieCamera")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Selfie Camera Features</label>
                  <input
                    type="text"
                    {...register("specs.SCFeatures")}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label>Selfie Camera Video</label>
                  <input
                    type="text"
                    {...register("specs.SCVideo")}
                    className="form-control"
                  />
                </div>
                <div className="form-subsection-title">Description</div>
                <div className="col-md-12">
                  <textarea
                    {...register("specs.description")}
                    className="form-control"
                    rows="6"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="section-title">Colors & Inventory</div>
          {fields.map((item, index) => (
            <div key={item.id} className="row g-3 mb-2 align-items-end">
              <div className="col-5">
                <label>Color</label>
                <input
                  type="text"
                  {...register(`colors.${index}.colorName`)}
                  className="form-control"
                />
              </div>
              <div className="col-5">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  {...register(`colors.${index}.quantity`)}
                  className="form-control"
                />
              </div>
              <div className="col-2 text-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn btn-outline-danger border-0"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none mb-4"
            onClick={() => append({ colorName: "", quantity: 1 })}
          >
            + Add color variant
          </button>

          <button type="submit" className="btn btn-save-admin mt-4">
            {useExistingSpecs ? "Link & Save Product" : "Create & Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductAddForm;
