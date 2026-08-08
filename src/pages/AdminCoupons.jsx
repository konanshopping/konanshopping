import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {

  FaTicketAlt,

  FaPlusCircle,

  FaTrash,

  FaEdit,

  FaSearch,

  FaFilter,

  FaChartLine,

  FaUsers,

  FaCoins,

  FaShoppingCart,

  FaCalendarAlt,

  FaPercentage,

  FaMoneyBillWave,

  FaCheckCircle,

  FaTimesCircle,

  FaSyncAlt,

  FaHistory,

  FaEye,

  FaChartBar,

  FaCrown,

  FaGift,

} from "react-icons/fa";

function AdminCoupons() {

  // ==========================
  // DATA
  // ==========================

  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const [editingCoupon, setEditingCoupon] =
    useState(null);

  // ==========================
  // FORM
  // ==========================

  const [form, setForm] =
    useState({

      code: "",

      discountType: "percent",

      discountValue: "",

      minPurchase: "",

      maxUses: "",

      active: true,

    });

  // ==========================
  // STATS
  // ==========================

  const totalCoupons =
    coupons.length;

  const activeCoupons =
    coupons.filter(
      c => c.active
    ).length;

  const inactiveCoupons =
    coupons.filter(
      c => !c.active
    ).length;

  const totalUses =
    coupons.reduce(

      (sum, c) =>

        sum + (c.usedCount || 0),

      0

    );

  const totalSavings =
    coupons.reduce(

      (sum, c) =>

        sum +
        (c.totalSavings || 0),

      0

    );

  const topCoupon =
    useMemo(() => {

      if (!coupons.length)
        return null;

      return [...coupons]

        .sort(

          (a, b) =>

            (b.usedCount || 0) -

            (a.usedCount || 0)

        )[0];

    }, [coupons]);

    // ==========================
// LOAD COUPONS
// ==========================

useEffect(() => {

  loadCoupons();

}, []);

const loadCoupons = async () => {

  try {

    setLoading(true);

    const res = await axios.get(
      "https://konanshopping.com/api/coupons"
    );

    setCoupons(res.data);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

};

// ==========================
// AJOUTER
// ==========================

const addCoupon = async () => {

  try {

    await axios.post(

      "https://konanshopping.com/api/coupons",

      {

        ...form,

        discountValue:
          Number(form.discountValue),

        minPurchase:
          Number(form.minPurchase),

        maxUses:
          Number(form.maxUses),

      }

    );

    setForm({

      code: "",

      discountType: "percent",

      discountValue: "",

      minPurchase: "",

      maxUses: "",

      active: true,

    });

    loadCoupons();

  } catch (err) {

    console.log(err);

    alert("Impossible d'ajouter le coupon.");

  }

};

// ==========================
// MODIFIER
// ==========================

const updateCoupon = async () => {

  if (!editingCoupon) return;

  try {

    await axios.put(

      `https://konanshopping.com/api/coupons/${editingCoupon._id}`,

      {

        ...form,

        discountValue:
          Number(form.discountValue),

        minPurchase:
          Number(form.minPurchase),

        maxUses:
          Number(form.maxUses),

      }

    );

    setEditingCoupon(null);

    setForm({

      code: "",

      discountType: "percent",

      discountValue: "",

      minPurchase: "",

      maxUses: "",

      active: true,

    });

    loadCoupons();

  } catch (err) {

    console.log(err);

  }

};

// ==========================
// SUPPRIMER
// ==========================

const deleteCoupon = async (id) => {

  if (
    !window.confirm(
      "Supprimer ce coupon ?"
    )
  )
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

// ==========================
// EDITION
// ==========================

const startEdit = (coupon) => {

  setEditingCoupon(coupon);

  setForm({

    code: coupon.code,

    discountType:
      coupon.discountType,

    discountValue:
      coupon.discountValue,

    minPurchase:
      coupon.minPurchase,

    maxUses:
      coupon.maxUses,

    active:
      coupon.active,

  });

};

// ==========================
// FILTRE + RECHERCHE
// ==========================

const filteredCoupons = useMemo(() => {

  let data = [...coupons];

  if (search) {

    data = data.filter((coupon) =>

      coupon.code

        .toLowerCase()

        .includes(

          search.toLowerCase()

        )

    );

  }

  if (filter === "active") {

    data = data.filter(

      c => c.active

    );

  }

  if (filter === "inactive") {

    data = data.filter(

      c => !c.active

    );

  }

  if (sort === "uses") {

    data.sort(

      (a, b) =>

        (b.usedCount || 0) -

        (a.usedCount || 0)

    );

  }

  if (sort === "discount") {

    data.sort(

      (a, b) =>

        b.discountValue -

        a.discountValue

    );

  }

  if (sort === "newest") {

    data.reverse();

  }

  return data;

}, [

  coupons,

  search,

  filter,

  sort,

]);

return (

<div
  style={{
    minHeight: "100vh",
    background: "#F1F5F9",
    padding: "24px",
  }}
>

{/* ==========================
HEADER
========================== */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  }}
>

  <div>

    <h1
      style={{
        margin: 0,
        fontSize: "34px",
        fontWeight: "900",
        color: "#0F172A",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >

      <FaTicketAlt color="#2563EB" />

      Gestion des coupons

    </h1>

    <p
      style={{
        marginTop: "10px",
        color: "#64748B",
        fontSize: "15px",
      }}
    >

      Gérez les coupons promotionnels de
      Konan Shopping Cameroun.

    </p>

  </div>

  <button

    onClick={
      editingCoupon
        ? updateCoupon
        : addCoupon
    }

    style={{

      border: "none",

      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",

      color: "#fff",

      padding: "14px 22px",

      borderRadius: "14px",

      fontWeight: "700",

      cursor: "pointer",

      display: "flex",

      alignItems: "center",

      gap: "10px",

      boxShadow:
        "0 10px 25px rgba(37,99,235,.25)",

    }}

  >

    <FaPlusCircle />

    {editingCoupon
      ? "Modifier le coupon"
      : "Créer un coupon"}

  </button>

</div>

{/* ==========================
STATISTIQUES
========================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(230px,1fr))",
    gap: "18px",
    marginBottom: "28px",
  }}
>

  <div className="admin-card">

    <FaTicketAlt
      size={30}
      color="#2563EB"
    />

    <h2>{totalCoupons}</h2>

    <span>
      Coupons enregistrés
    </span>

  </div>

  <div className="admin-card">

    <FaCheckCircle
      size={30}
      color="#22C55E"
    />

    <h2>{activeCoupons}</h2>

    <span>
      Coupons actifs
    </span>

  </div>

  <div className="admin-card">

    <FaUsers
      size={30}
      color="#7C3AED"
    />

    <h2>{totalUses}</h2>

    <span>
      Utilisations
    </span>

  </div>

  <div className="admin-card">

    <FaCoins
      size={30}
      color="#F59E0B"
    />

    <h2>

      {Number(
        totalSavings
      ).toLocaleString()} FCFA

    </h2>

    <span>
      Total économisé
    </span>

  </div>

</div>

{/* ==========================
BARRE OUTILS
========================== */}

<div
  style={{

    display: "flex",

    gap: "15px",

    flexWrap: "wrap",

    marginBottom: "30px",

  }}
>

  <div
    style={{

      flex: 1,

      minWidth: "280px",

      display: "flex",

      alignItems: "center",

      background: "#fff",

      borderRadius: "14px",

      padding: "0 15px",

      boxShadow:
        "0 6px 20px rgba(15,23,42,.05)",

    }}
  >

    <FaSearch color="#94A3B8" />

    <input

      placeholder="Rechercher un coupon..."

      value={search}

      onChange={(e)=>
        setSearch(e.target.value)
      }

      style={{

        border: "none",

        outline: "none",

        width: "100%",

        padding: "14px",

        fontSize: "15px",

        background: "transparent",

      }}

    />

  </div>

  <select

    value={filter}

    onChange={(e)=>
      setFilter(e.target.value)
    }

  >

    <option value="all">
      Tous
    </option>

    <option value="active">
      Actifs
    </option>

    <option value="inactive">
      Désactivés
    </option>

  </select>

  <select

    value={sort}

    onChange={(e)=>
      setSort(e.target.value)
    }

  >

    <option value="newest">
      Plus récents
    </option>

    <option value="uses">
      Plus utilisés
    </option>

    <option value="discount">
      Plus grosse réduction
    </option>

  </select>

</div>


{/* ==========================
FORMULAIRE PREMIUM
========================== */}

<div
  style={{
    background: "#FFFFFF",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(15,23,42,.06)",
    marginBottom: "35px",
  }}
>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "25px",
    }}
  >

    <FaGift
      color="#2563EB"
      size={28}
    />

    <div>

      <h2
        style={{
          margin: 0,
          color: "#0F172A",
          fontSize: "24px",
          fontWeight: "800",
        }}
      >

        {editingCoupon
          ? "Modifier un coupon"
          : "Créer un nouveau coupon"}

      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: "#64748B",
        }}
      >
        Configurez votre offre promotionnelle.
      </p>

    </div>

  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",
      gap: "20px",
    }}
  >

    {/* CODE */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Code du coupon
      </label>

      <input
        value={form.code}
        onChange={(e)=>
          setForm({
            ...form,
            code: e.target.value.toUpperCase(),
          })
        }
        placeholder="Ex : WELCOME20"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
          outline: "none",
        }}
      />

    </div>

    {/* TYPE */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Type de réduction
      </label>

      <select
        value={form.discountType}
        onChange={(e)=>
          setForm({
            ...form,
            discountType: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
        }}
      >

        <option value="percent">
          Pourcentage (%)
        </option>

        <option value="fixed">
          Montant fixe (FCFA)
        </option>

      </select>

    </div>

    {/* REDUCTION */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Valeur de la réduction
      </label>

      <input
        type="number"
        value={form.discountValue}
        onChange={(e)=>
          setForm({
            ...form,
            discountValue: e.target.value,
          })
        }
        placeholder="10 ou 5000"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
        }}
      />

    </div>

    {/* ACHAT MINIMUM */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Achat minimum
      </label>

      <input
        type="number"
        value={form.minPurchase}
        onChange={(e)=>
          setForm({
            ...form,
            minPurchase: e.target.value,
          })
        }
        placeholder="20000"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
        }}
      />

    </div>

    {/* UTILISATIONS */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Nombre maximal d'utilisations
      </label>

      <input
        type="number"
        value={form.maxUses}
        onChange={(e)=>
          setForm({
            ...form,
            maxUses: e.target.value,
          })
        }
        placeholder="9999"
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
        }}
      />

    </div>

    {/* ETAT */}

    <div>

      <label
        style={{
          fontWeight: "700",
          color: "#334155",
        }}
      >
        Statut
      </label>

      <select
        value={form.active}
        onChange={(e)=>
          setForm({
            ...form,
            active:
              e.target.value === "true",
          })
        }
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "8px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
        }}
      >

        <option value={true}>
          Actif
        </option>

        <option value={false}>
          Désactivé
        </option>

      </select>

    </div>

  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "28px",
    }}
  >

    <button
      onClick={
        editingCoupon
          ? updateCoupon
          : addCoupon
      }
      style={{
        border: "none",
        background:
          "linear-gradient(135deg,#2563EB,#1D4ED8)",
        color: "#fff",
        padding: "15px 30px",
        borderRadius: "14px",
        fontWeight: "800",
        cursor: "pointer",
        fontSize: "15px",
      }}
    >

      {editingCoupon
        ? "Enregistrer les modifications"
        : "Créer le coupon"}

    </button>

  </div>

</div>

{/* ==========================
TABLEAU PREMIUM
========================== */}

<div
  style={{
    background: "#fff",
    borderRadius: "24px",
    padding: "25px",
    marginTop: "25px",
    boxShadow:
      "0 15px 40px rgba(15,23,42,.06)",
    overflowX: "auto",
  }}
>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1200px",
    }}
  >

    <thead>

      <tr
        style={{
          background: "#F8FAFC",
        }}
      >

        <th style={thStyle}>Coupon</th>

        <th style={thStyle}>Réduction</th>

        <th style={thStyle}>Utilisateurs</th>

        <th style={thStyle}>Utilisations</th>

        <th style={thStyle}>Économies</th>

        <th style={thStyle}>Disponibilité</th>

        <th style={thStyle}>Création</th>

        <th style={thStyle}>Actions</th>

      </tr>

    </thead>

    <tbody>

      {filteredCoupons.map((coupon) => (

        <tr
          key={coupon._id}
          style={{
            borderBottom:
              "1px solid #E2E8F0",
          }}
        >

          <td style={tdStyle}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  background:
                    "linear-gradient(135deg,#2563EB,#1D4ED8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                }}
              >

                <FaGift />

              </div>

              <div>

                <div
                  style={{
                    fontWeight: "800",
                    color: "#0F172A",
                  }}
                >
                  {coupon.code}
                </div>

                <div
                  style={{
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  {coupon.discountType}
                </div>

              </div>

            </div>

          </td>

          <td style={tdStyle}>

            {coupon.discountType === "percent"

              ? `${coupon.discountValue}%`

              : `${coupon.discountValue.toLocaleString()} FCFA`}

          </td>

          <td style={tdStyle}>

            <span
              style={{
                fontWeight: "700",
                color: "#2563EB",
              }}
            >

              {coupon.usedCount || 0}

            </span>

          </td>

          <td style={tdStyle}>

            {coupon.usedCount || 0}

            /

            {coupon.maxUses}

          </td>

          <td style={tdStyle}>

            <span
              style={{
                color: "#16A34A",
                fontWeight: "800",
              }}
            >

              {(coupon.totalSavings || 0)
                .toLocaleString()} FCFA

            </span>

          </td>

          <td style={tdStyle}>

            {coupon.active ? (

              <span
                style={{
                  background: "#DCFCE7",
                  color: "#16A34A",
                  padding: "8px 15px",
                  borderRadius: 999,
                  fontWeight: "700",
                }}
              >

                <FaCheckCircle />

                {" "}

                Actif

              </span>

            ) : (

              <span
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  padding: "8px 15px",
                  borderRadius: 999,
                  fontWeight: "700",
                }}
              >

                <FaTimesCircle />

                {" "}

                Désactivé

              </span>

            )}

          </td>

          <td style={tdStyle}>

            {coupon.createdAt

              ? new Date(
                  coupon.createdAt
                ).toLocaleDateString()

              : "--"}

          </td>

          <td style={tdStyle}>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                style={actionBlue}
              >

                <FaEye />

              </button>

              <button
                onClick={() =>
                  startEdit(coupon)
                }
                style={actionOrange}
              >

                <FaEdit />

              </button>

              <button
                onClick={() =>
                  deleteCoupon(coupon._id)
                }
                style={actionRed}
              >

                <FaTrash />

              </button>

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

{/* ==========================
ANALYTICS PREMIUM
========================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr",
    gap: "22px",
    marginBottom: "25px",
  }}
>

  {/* GRAPHIQUE */}

  <div
    style={{
      background: "#fff",
      borderRadius: "22px",
      padding: "22px",
      boxShadow:
        "0 10px 30px rgba(15,23,42,.06)",
    }}
  >

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >

      <h3
        style={{
          margin: 0,
          fontWeight: "800",
          color: "#0F172A",
        }}
      >
        <FaChartLine
          style={{
            marginRight: 8,
            color: "#2563EB",
          }}
        />

        Utilisation des coupons

      </h3>

    </div>

    {filteredCoupons.map((coupon) => {

      const percent =
        coupon.maxUses
          ? (
              (coupon.usedCount || 0) /
              coupon.maxUses
            ) *
            100
          : 0;

      return (

        <div
          key={coupon._id}
          style={{
            marginBottom: 18,
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 6,
              fontWeight: "700",
            }}
          >

            <span>
              {coupon.code}
            </span>

            <span>
              {coupon.usedCount || 0}/
              {coupon.maxUses}
            </span>

          </div>

          <div
            style={{
              height: 10,
              background: "#E2E8F0",
              borderRadius: 999,
            }}
          >

            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg,#2563EB,#38BDF8)",
              }}
            />

          </div>

        </div>

      );

    })}

  </div>

  {/* TOP COUPON */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",
      color: "#fff",
      borderRadius: "22px",
      padding: "24px",
      boxShadow:
        "0 20px 40px rgba(37,99,235,.25)",
    }}
  >

    <FaCrown
      style={{
        fontSize: 40,
        marginBottom: 20,
      }}
    />

    <div
      style={{
        fontSize: 14,
        opacity: .85,
      }}
    >
      Coupon le plus utilisé
    </div>

    <h2
      style={{
        margin: "12px 0",
        fontSize: 30,
      }}
    >
      {topCoupon
        ? topCoupon.code
        : "--"}
    </h2>

    <div
      style={{
        fontSize: 17,
        fontWeight: "700",
      }}
    >
      {topCoupon?.usedCount || 0}
      {" "}
      utilisations
    </div>

    <div
      style={{
        marginTop: 25,
        background:
          "rgba(255,255,255,.15)",
        borderRadius: 18,
        padding: 18,
      }}
    >

      <div>

        💰 Économies

      </div>

      <h2
        style={{
          margin: "10px 0",
        }}
      >

        {(
          topCoupon?.totalSavings || 0
        ).toLocaleString()}

        FCFA

      </h2>

    </div>

  </div>

</div>

{/* ==========================
TOP 5 + HISTORIQUE
========================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "22px",
    marginTop: "25px",
    marginBottom: "25px",
  }}
>

  {/* TOP 5 */}

  <div
    style={{
      background: "#fff",
      borderRadius: "22px",
      padding: "22px",
      boxShadow: "0 10px 30px rgba(15,23,42,.06)",
    }}
  >

    <h3
      style={{
        margin: 0,
        marginBottom: "20px",
        fontWeight: "800",
        color: "#0F172A",
      }}
    >
      <FaCrown
        style={{
          color: "#F59E0B",
          marginRight: "10px",
        }}
      />

      Top 5 des coupons

    </h3>

    {[...coupons]
      .sort(
        (a, b) =>
          (b.usedCount || 0) -
          (a.usedCount || 0)
      )
      .slice(0, 5)
      .map((coupon, index) => (

        <div
          key={coupon._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderBottom:
              "1px solid #F1F5F9",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563EB,#1D4ED8)",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "800",
              }}
            >

              {index + 1}

            </div>

            <div>

              <div
                style={{
                  fontWeight: "800",
                }}
              >
                {coupon.code}
              </div>

              <div
                style={{
                  color: "#64748B",
                  fontSize: "13px",
                }}
              >
                {(coupon.usedCount || 0)}
                {" "}
                utilisations
              </div>

            </div>

          </div>

          <FaChartBar
            color="#2563EB"
            size={22}
          />

        </div>

      ))}

  </div>

  {/* HISTORIQUE */}

  <div
    style={{
      background: "#fff",
      borderRadius: "22px",
      padding: "22px",
      boxShadow: "0 10px 30px rgba(15,23,42,.06)",
    }}
  >

    <h3
      style={{
        margin: 0,
        marginBottom: "20px",
        fontWeight: "800",
      }}
    >
      <FaHistory
        style={{
          color: "#2563EB",
          marginRight: "10px",
        }}
      />

      Historique

    </h3>

    {filteredCoupons.map((coupon) => (

      <div
        key={coupon._id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 0",
          borderBottom:
            "1px solid #F1F5F9",
        }}
      >

        <div>

          <div
            style={{
              fontWeight: "700",
            }}
          >
            {coupon.code}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: "13px",
            }}
          >
            Créé le{" "}
            {coupon.createdAt
              ? new Date(
                  coupon.createdAt
                ).toLocaleDateString()
              : "--"}
          </div>

        </div>

        <FaCalendarAlt
          color="#2563EB"
        />

      </div>

    ))}

  </div>

</div>

{/* ==========================
FIN PAGE
========================== */}

</div>

);

}

const thStyle = {

  textAlign: "left",

  padding: "16px",

  fontSize: "13px",

  color: "#64748B",

  fontWeight: "800",

  textTransform: "uppercase",

};

const tdStyle = {

  padding: "18px 16px",

  color: "#0F172A",

  fontSize: "14px",

  verticalAlign: "middle",

};

const actionBlue = {

  width: "42px",

  height: "42px",

  border: "none",

  borderRadius: "12px",

  background: "#EFF6FF",

  color: "#2563EB",

  cursor: "pointer",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  fontSize: "16px",

  transition: ".25s",

};

const actionOrange = {

  width: "42px",

  height: "42px",

  border: "none",

  borderRadius: "12px",

  background: "#FFF7ED",

  color: "#EA580C",

  cursor: "pointer",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  fontSize: "16px",

  transition: ".25s",

};

const actionRed = {

  width: "42px",

  height: "42px",

  border: "none",

  borderRadius: "12px",

  background: "#FEF2F2",

  color: "#DC2626",

  cursor: "pointer",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  fontSize: "16px",

  transition: ".25s",

};

export default AdminCoupons;