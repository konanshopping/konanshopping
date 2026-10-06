import {



  useEffect,



  useState



} from "react";







import axios from "axios";







import {



  FaUsers,



  FaUserCheck,



  FaGlobe,



  FaSearch,



  FaEnvelope,



  FaPhoneAlt,



} from "react-icons/fa";







import {



  ComposableMap,



  Geographies,



  Geography



} from "react-simple-maps";







import "./AdminClients.css";









/* =========================================================

   SECURITY LAYER — ADMIN CLIENTS

   Compatible avec le JWT administrateur du backend.

   ========================================================= */



const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;



const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};



const getStoredAdmin = () => {
  const admin = safeParse(localStorage.getItem("admin"), null);

  return admin && typeof admin === "object"
    ? admin
    : null;
};

// =========================================================
// 🔐 AUTHENTIFICATION ADMIN PAR COOKIE HTTPONLY
// =========================================================

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (!config) return config;

  config.withCredentials = true;
  config.headers = config.headers || {};
  config.headers.Accept = "application/json";

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      localStorage.removeItem("admin");
      error.userMessage = "Session administrateur expirée ou accès refusé.";
    }

    return Promise.reject(error);
  }
);

const normalizeArrayResponse = (data, key) => {

  if (Array.isArray(data)) return data;



  if (data && Array.isArray(data[key])) {

    return data[key];

  }



  if (data && Array.isArray(data.data)) {

    return data.data;

  }



  return null;

};



function AdminClients() {







  // =========================



  // STATES



  // =========================







  const [users, setUsers] =



    useState([]);







  const [visitors, setVisitors] =



    useState([]);







  const [search, setSearch] =



    useState("");







  // =========================



  // FETCH DATA



  // =========================







  useEffect(() => {



    const admin = getStoredAdmin();

    if (!admin) {

      window.location.href = "/admin-login";

      return;

    }









    fetchUsers();







    fetchVisitors();







  }, []);







  // =========================



  // USERS



  // =========================







  const fetchUsers =



    async () => {



      try {







        const res =



          await api.get("/api/users");







        const data = normalizeArrayResponse(res.data, "users");



        if (!data) {

          console.error("Réponse utilisateurs invalide.");

          setUsers([]);

          return;

        }



        setUsers(data);







      } catch (err) {

        if (

          err?.response?.status === 401 ||

          err?.response?.status === 403

        ) {

          window.location.href = "/admin-login";

          return;

        }



        console.error("Erreur API.", err);

      }







    };







  // =========================



  // VISITORS



  // =========================







  const fetchVisitors =



    async () => {



      try {







        const res =



          await api.get("/api/visitors");







        const data = normalizeArrayResponse(res.data, "visitors");



        if (!data) {

          console.error("Réponse visiteurs invalide.");

          setVisitors([]);

          return;

        }



        setVisitors(data);







      } catch (err) {

        if (

          err?.response?.status === 401 ||

          err?.response?.status === 403

        ) {

          window.location.href = "/admin-login";

          return;

        }



        console.error("Erreur API.", err);

      }







    };







  // =========================



  // FILTER USERS



  // =========================







  const filteredUsers =



    users.filter((user)=>







      user.name



        ?.toLowerCase()



        .includes(



          search.toLowerCase()



        )







    );







  // =========================



  // CONNECTED USERS



  // =========================







  const connectedUsers =



    users.filter(



      (u)=>



        u.status ===



        "Connecté"



    ).length;







const onlineVisitors =



  visitors.filter(



    (v)=>v.online



  ).length;







const visitedCountries =



  visitors.map(



    (v)=>v.country



  );







const countryStats = {};







visitors.forEach((visitor)=>{







  if(visitor.country){







    countryStats[visitor.country] =







      (countryStats[visitor.country] || 0) + 1;







  }







});







  // =========================



  // RETURN



  // =========================







  return (







    <div className="adminClients">







      {/* =========================



          HEADER



      ========================= */}







      <div className="clientsTop">







        <div>







          <h1>







            Clients & Visiteurs







          </h1>







          <p>







            Analyse complète des



            utilisateurs connectés



            sur Konan Shopping







          </p>







        </div>







        {/* SEARCH */}







        <div className="searchBox">







          <FaSearch />







          <input



            type="text"



            placeholder="Rechercher un utilisateur..."



            value={search}



            onChange={(e)=>



              setSearch(



                e.target.value



              )



            }



          />







        </div>







      </div>







      {/* =========================



          STATS



      ========================= */}







      <div className="clientsStats">







        {/* USERS */}







        <div className="clientCard">







          <div>







            <p>



              Utilisateurs



            </p>







            <h2>







              {users.length}







            </h2>







          </div>







          <div className="icon purple">







            <FaUsers />







          </div>







        </div>







        {/* CONNECTED */}







        <div className="clientCard">







          <div>







            <p>



              Connectés



            </p>







            <h2>







              {connectedUsers}







            </h2>







          </div>







          <div className="icon green">







            <FaUserCheck />







          </div>







        </div>







        {/* VISITORS */}







        <div className="clientCard">







          <div>







            <p>



              Visiteurs



            </p>







            <h2>







              {visitors.length}







            </h2>







          </div>







          <div className="icon blue">







            <FaGlobe />







          </div>







        </div>







      </div>







      <div className="clientCard">







  <div>







    <p>



      En ligne



    </p>







    <h2>







      {onlineVisitors}







    </h2>







  </div>







  <div className="icon green">







    <FaUserCheck />







  </div>







</div>







<div className="mapCard">







  <div className="mapHeader">







    <h2>



      Visiteurs dans le monde 🌍



    </h2>







    <p>



      Pays visitant votre boutique



    </p>







  </div>







  <ComposableMap



    projectionConfig={{



      scale: 140



    }}



  >







    <Geographies



      geography="https://cdn.jsdelivr.net/npm/world-atlas\@2/countries-110m.json"



    >







      {({



        geographies



      }) =>







        geographies.map(



          (geo)=>(







            <Geography







              key={geo.rsmKey}







              geography={geo}







              style={{







                default:{







                  fill:







visitedCountries.includes(



  geo.properties.NAME



)







? "#7c3aed"







: "#e5e7eb",







                  outline:"none",







                },







                hover:{







                  fill:"#f59e0b",







                  outline:"none",







                },







                pressed:{







                  fill:"#4c1d95",







                  outline:"none",







                },







              }}







            />







          )



        )



      }







    </Geographies>







  </ComposableMap>







</div>







<div className="countriesCard">







  <div className="countriesHeader">







    <h2>



      Visiteurs par pays



    </h2>







    <p>



      Pays les plus actifs



    </p>







  </div>







  <div className="countriesList">







    {







      Object.entries(countryStats)







      .sort((a,b)=>b[1]-a[1])







      .map(([country,count],index)=>(







        <div



          key={index}



          className="countryItem"



        >







          <div>







            <h4>



              {country}



            </h4>







            <p>



              {count} visiteurs



            </p>







          </div>







          <span>







            #{index + 1}







          </span>







        </div>







      ))







    }







  </div>







</div>







      {/* =========================



          USERS TABLE



      ========================= */}







      <div className="clientsTable">







        <div className="tableHeader">







          <h2>







            Utilisateurs inscrits







          </h2>







        </div>







        <table>







          <thead>







            <tr>







              <th>



                Utilisateur



              </th>







              <th>



                Email



              </th>







              <th>



                Téléphone



              </th>







              <th>



                Adresse



              </th>







              <th>



                Statut



              </th>







            </tr>







          </thead>







          <tbody>







            {filteredUsers.map(



              (



                user,



                index



              ) => (







                <tr key={index}>







                  {/* USER */}







                  <td>







  <div className="userBox">







    <div className="userAvatar">







     <img



  src={

                      typeof user.avatar === "string" &&

                      user.avatar.trim()

                        ? user.avatar

                        : "/logo.jpg"

                    }



  alt={user.name || "Konan Shopping"}



/>







    </div>







    <div className="userInfo">







      <h4>



        {user.name}



      </h4>







      <p>



        Client Konan Shopping



      </p>







    </div>







  </div>







</td>















                  {/* EMAIL */}







                  <td>







                    <div className="miniInfo">







                      <FaEnvelope />







                      {user.email}







                    </div>







                  </td>







                  {/* PHONE */}







                  <td>







                    <div className="miniInfo">







                      <FaPhoneAlt />







                      {



                        user.phone ||



                        "Aucun"



                      }







                    </div>







                  </td>







                  {/* ADDRESS */}







                  <td>







                    {



                      user.address ||



                      "Non renseignée"



                    }







                  </td>







                  {/* STATUS */}







                  <td>







                    <span



                      className={



                        user.status ===



                        "Connecté"







                          ? "online"







                          : "offline"



                      }



                    >







                      {



                        user.status



                      }







                    </span>







                  </td>







                </tr>







              )



            )}







          </tbody>







        </table>







      </div>







      {/* =========================



          VISITORS



      ========================= */}







      <div className="visitorsTable">







        <div className="tableHeader">







          <h2>







            Activité visiteurs







          </h2>







        </div>







        <table>







          <thead>







            <tr>







              <th>



                IP



              </th>







              <th>



                Pays



              </th>







              <th>



  Ville



</th>







              <th>



                Appareil



              </th>







              <th>



                Heure



              </th>







            </tr>







          </thead>







          <tbody>







            {visitors.map(



              (



                visitor,



                index



              ) => (







                <tr key={index}>







                  <td>







                    {visitor.ip}







                  </td>







                  <td>







                    {



                      visitor.country



                    }







                  </td>







     <td>







  {visitor.city}







</td>







                  <td>







                    {



                      visitor.device



                    }







                  </td>







                  <td>







                    {visitor.time}







                  </td>







                </tr>







              )



            )}







          </tbody>







        </table>







      </div>







    </div>







  );







}







export default AdminClients;