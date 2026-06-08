import { useState } from "react";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import "./RenderRegisterLogin.css";

function RenderRegisterLogin() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <main className="register-page">
      <section className="register-grid">
        <div className="form-panel">
          {showLogin ? (
            <Login setShowLogin={setShowLogin} />
          ) : (
            <Register setShowLogin={setShowLogin} />
          )}
        </div>
      </section>
    </main>
  );
}

export default RenderRegisterLogin;
