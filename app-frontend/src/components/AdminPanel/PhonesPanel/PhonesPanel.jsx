import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PhonesPanel() {
  const [phones, setPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Забележка: Провери точните URL адреси с бекенд колегите си!
        const headers = {
          Accept: "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        // Изпращаме трите заявки едновременно за максимална бързина
        const phonesRes = await fetch("http://localhost:8000/api/phones", {
          headers,
        });

        // Ако заявките са успешни, парсваме JSON-а
        if (phonesRes.ok) {
          const phonesData = await phonesRes.json();
          // Ако бекендът връща пагинация, може да е phonesData.data
          setPhones(phonesData.data || phonesData);
        }
      } catch (error) {
        console.error(
          "Грешка при изтегляне на данните за Админ панела:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  async function handleDeletePhone(id) {
    const response = await fetch(`http://localhost:8000/api/phones/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.ok) {
      setPhones((prevPhones) => prevPhones.filter((phone) => phone.id !== id));
    }
  }

  return (
    
    <>
    {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#64748b' }}>
            ⏳ Зареждане на данните от базата...
          </div>
        ) : (
          <><div className="admin-header">
        <h2 className="admin-title">Manage Phones</h2>
        <Link to="/admin/phones/add" className="admin-add-btn">
          + Add New Phone
        </Link>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id}>
                <td>#{phone.id}</td>
                <td style={{ fontWeight: "600" }}>
                  {phone.model || phone.name}
                </td>
                <td>€{Number(phone.price).toFixed(2)}</td>
                <td>
                  <Link to={`edit/${phone.slug}`} className="action-btn">Edit</Link>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeletePhone(phone.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></>)}
    </>
  );
}
