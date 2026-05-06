import { useEffect, useState } from "react";

export default function UsersPanel() {

      const [users, setUsers] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
    
        // State за следене кой потребител се редактира в момента (пази ID-то му)
      const [editingUserId, setEditingUserId] = useState(null);
      
      // State за данните във формата за редакция
      const [editUserForm, setEditUserForm] = useState({ name: '', role: '' });

        useEffect(() => {
          const fetchAllData = async () => {
            try {
              // Забележка: Провери точните URL адреси с бекенд колегите си!
              const headers = {
                Accept: "application/json",
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
              };
      
              // Изпращаме трите заявки едновременно за максимална бързина
              const ordersRes = await fetch("http://localhost:8000/api/users", {
                headers,
              });
      
              if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setUsers(ordersData.data || ordersData);
                setIsLoading(false);
              }
            } catch (error) {
              console.error(
                "Грешка при изтегляне на данните за Админ панела:",
                error,
              );
            }
          };
      
          fetchAllData();
        }, []);

  const handleDeleteUser = async (id) => {
    // Питаме за потвърждение, за да няма случайни изтривания
    if (
      !window.confirm("Сигурни ли сте, че искате да изтриете този потребител?")
    )
      return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert("Възникна грешка при изтриването.");
      }
    } catch (error) {
      console.error("Грешка при триене:", error);
    }
  };

  // --- СТАРТИРАНЕ НА РЕДАКЦИЯ ---
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    // Зареждаме isAdmin (ако е true/1 е админ, иначе е 0)
    setEditUserForm({
      name: user.name,
      isAdmin: user.isAdmin ? 1 : 0,
    });
  };

  // --- ПРОМЯНА НА ПОЛЕТАТА ПРИ РЕДАКЦИЯ ---
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm((prev) => ({
      ...prev,
      [name]: name === "isAdmin" ? Number(value) : value,
    }));
  };

  // --- ЗАПАЗВАНЕ НА ПРОМЕНИТЕ ---
  const handleSaveUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(editUserForm),
      });

      if (response.ok) {
        // Обновяваме данните в таблицата
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, ...editUserForm } : user,
          ),
        );
        setEditingUserId(null); // Затваряме режима за редакция
      } else {
        alert("Грешка при запазване на промените.");
      }
    } catch (error) {
      console.error("Грешка при запазване:", error);
    }
  };
  return (
    <>
    {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#64748b' }}>
            ⏳ Зареждане на данните от базата...
          </div>
        ) : (
            <>
      <div className="admin-header">
        <h2 className="admin-title">Registered Users</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>#{user.id}</td>

                {editingUserId === user.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editUserForm.name}
                        onChange={handleEditFormChange}
                        style={{
                          padding: "5px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      <select
                        name="isAdmin"
                        value={editUserForm.isAdmin}
                        onChange={handleEditFormChange}
                        style={{
                          padding: "5px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <option value={0}>USER</option>
                        <option value={1}>ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleSaveUser(user.id)}
                        style={{ color: "#16a34a" }}
                      >
                        Save
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: "600" }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {/* Проверяваме user.isAdmin (ако е 1 -> admin, ако е 0 -> user) */}
                      <span
                        className={`admin-badge badge-${user.isAdmin ? "admin" : "user"}`}
                      >
                        {user.isAdmin ? "ADMIN" : "USER"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      {/* Бутонът Ban се показва само ако НЕ е админ */}
                      {!user.isAdmin && (
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div></>)}
    </>
  );
}
