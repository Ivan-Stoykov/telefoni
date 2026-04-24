import { Link } from "react-router-dom";
import "./AboutUsPage.css";

export default function AboutUsPage() {
  return (
    <div class="content-wrapper">
      <section class="about-hero">
        <h1>About SwaPhone</h1>
        <p>
          We are a specialized hub for mobile technology. We offer a carefully
          curated selection of brand-new devices and professionally refurbished
          phones that combine quality, warranty, and exceptional value.
        </p>
      </section>

      <div class="features-grid">
        <div class="card">
          <h3>Expert Inspection</h3>
          <p>
            Every refurbished phone undergoes a rigorous 30-step hardware and
            software diagnostic before reaching your hands.
          </p>
        </div>
        <div class="card">
          <h3>Eco-Responsibility</h3>
          <p>
            We give technology a second life. We reduce the carbon footprint
            without ever compromising on performance.
          </p>
        </div>
        <div class="card">
          <h3>Reliability</h3>
          <p>
            You get full transparency, dedicated warranty support, and original
            components in every device we sell.
          </p>
        </div>
      </div>

      <div class="table-container">
        <h2>Choose Your Fit</h2>
        <table>
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Brand New Phone</th>
              <th>SwaPhone Refurbished</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Warranty</strong>
              </td>
              <td>24 Months (Manufacturer)</td>
              <td>12 Months (SwaPhone Warranty)</td>
            </tr>
            <tr>
              <td>
                <strong>Visual Condition</strong>
              </td>
              <td>Pristine</td>
              <td>Grade A+ (Like New)</td>
            </tr>
            <tr>
              <td>
                <strong>Battery Health</strong>
              </td>
              <td>100% Capacity</td>
              <td>Above 85% or New Battery</td>
            </tr>
            <tr>
              <td>
                <strong>Price</strong>
              </td>
              <td>Market Price</td>
              <td>
                <span class="check">Save up to 40%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="cta-section">
        <h2>Ready for an Upgrade?</h2>
        <p>
          Explore our latest arrivals and find the perfect model for you today.
        </p>
        <Link to="/" class="btn-primary">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
