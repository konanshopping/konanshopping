import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaTicketAlt } from "react-icons/fa";

function AdminCoupons() {

  const [coupons, setCoupons] = useState([]);

  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minPurchase: "",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await axios.get(
        "https://konanshopping.com/api/coupons"
      );
      setCoupons(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addCoupon = async () => {
    try {

      await axios.post(
        "https://konanshopping.com/api/coupons",
        form
      );

      setForm({
        code: "",
        discountType: "percent",
        discountValue: "",
        minPurchase: "",
      });

      loadCoupons();

    } catch (err) {
      console.log(err);
      alert("Erreur");
    }
  };

  const deleteCoupon = async (id) => {

    if (!window.confirm("Supprimer ce coupon ?"))
      return;

    try {

      await axios.delete(
        `https://konanshopping.com/api/coupons/${id}`
      );

      loadCoupons();

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 700,
        margin: "auto",
      }}
    >

      <h1>
        🎟️ Administration Coupons
      </h1>

      <input
        placeholder="Code"
        value={form.code}
        onChange={(e) =>
          setForm({
            ...form,
            code: e.target.value,
          })
        }
      />

      <br />
      <br />

      <select
        value={form.discountType}
        onChange={(e) =>
          setForm({
            ...form,
            discountType: e.target.value,
          })
        }
      >
        <option value="percent">
          Pourcentage
        </option>

        <option value="fixed">
          FCFA
        </option>

      </select>

      <br />
      <br />

      <input
        type="number"
        placeholder="Réduction"
        value={form.discountValue}
        onChange={(e) =>
          setForm({
            ...form,
            discountValue: e.target.value,
          })
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Achat minimum"
        value={form.minPurchase}
        onChange={(e) =>
          setForm({
            ...form,
            minPurchase: e.target.value,
          })
        }
      />

      <br />
      <br />

      <button onClick={addCoupon}>
        <FaPlus /> Ajouter
      </button>

      <hr />

      {coupons.map((coupon) => (

        <div
          key={coupon._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 10,
          }}
        >

          <h3>
            <FaTicketAlt /> {coupon.code}
          </h3>

          <p>
            Type :
            {coupon.discountType}
          </p>

          <p>
            Valeur :
            {coupon.discountValue}
          </p>

          <p>
            Achat minimum :
            {coupon.minPurchase} FCFA
          </p>

          <button
            onClick={() =>
              deleteCoupon(coupon._id)
            }
          >
            <FaTrash />
            Supprimer
          </button>

        </div>

      ))}

    </div>
  );

}

export default AdminCoupons;