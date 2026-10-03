import {



  useEffect,



  useState



} from "react";







import axios from "axios";



// ============================================================

// SÉCURITÉ ADMIN — AdminProducts

// La logique métier et les endpoints sont conservés.

// Le backend reste l'autorité finale pour les droits admin.

// ============================================================



const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;



const MAX_NAME_LENGTH = 150;

const MAX_CATEGORY_LENGTH = 100;

const MAX_SEARCH_LENGTH = 100;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;



const ALLOWED_STATUSES = []; // Conservé sans changer la logique métier.



const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};



const getAuthToken = () => {

  try {

    const token = localStorage.getItem("token");

    return typeof token === "string" && token.trim()

      ? token.trim()

      : null;

  } catch {

    return null;

  }

};



const getStoredAdmin = () => {

  try {

    return safeParse(localStorage.getItem("admin"), null);

  } catch {

    return null;

  }

};



const isValidObjectId = (id) =>

  typeof id === "string" &&

  /^[a-f\d]{24}$/i.test(id);



const normalizeProductsResponse = (data) =>

  Array.isArray(data) ? data : [];



const normalizeText = (value, maxLength) =>

  typeof value === "string"

    ? value.trim().slice(0, maxLength)

    : "";



const normalizePrice = (value) => {

  const number = Number(value);

  return Number.isFinite(number) && number >= 0

    ? number

    : null;

};



const isValidImageFile = (file) => {

  if (!file) return false;



  const allowedTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "image/gif",

  ];



  return (

    allowedTypes.includes(file.type) &&

    file.size > 0 &&

    file.size <= MAX_IMAGE_SIZE

  );

};



const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: API_TIMEOUT,

  headers: {

    Accept: "application/json",

  },

});



api.interceptors.request.use(

  (config) => {

    const token = getAuthToken();



    if (token) {

      config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;

    }



    return config;

  },

  (error) => Promise.reject(error)

);



api.interceptors.response.use(

  (response) => response,

  (error) => {

    const status = error?.response?.status;



    if (status === 401 || status === 403) {

      try {

        localStorage.removeItem("token");

        localStorage.removeItem("admin");

      } catch {

        // Ne bloque pas l'application.

      }



      if (

        typeof window !== "undefined" &&

        window.location.pathname !== "/admin-login"

      ) {

        window.location.replace("/admin-login");

      }

    }



    return Promise.reject(error);

  }

);



const requireAdminSession = () => {

  const token = getAuthToken();

  const admin = getStoredAdmin();



  if (!token || !admin) {

    if (

      typeof window !== "undefined" &&

      window.location.pathname !== "/admin-login"

    ) {

      window.location.replace("/admin-login");

    }



    return false;

  }



  return true;

};









import { toast } from "react-toastify";







import {



  FaPlus,



  FaTrash,



  FaEdit,



  FaBox,



  FaSearch,



  FaTags,



  FaImage,



} from "react-icons/fa";







import "./AdminProducts.css";







function AdminProducts() {







  // =========================



  // STATES



  // =========================







  const [products, setProducts] =



    useState([]);







  const [name, setName] =



    useState("");







  const [price, setPrice] =



    useState("");







  const [category, setCategory] =



    useState("");







  const [image, setImage] =



    useState(null);







  const [search, setSearch] =



    useState("");







  const [editId, setEditId] =



    useState(null);







  const [loading, setLoading] =



    useState(false);







  // =========================



  // FETCH PRODUCTS



  // =========================







  useEffect(() => {







    fetchProducts();







  }, []);







  const fetchProducts =



    async () => {







      try {







        const res = await api.get(



  "https://konanshopping.com/api/products"



);







        setProducts(normalizeProductsResponse(res.data));







      } catch (err) {







        console.error("Erreur AdminProducts :", err?.message || "Erreur inconnue");







      }







    };







  // =========================



  // ADD PRODUCT



  // =========================







  const addProduct =



    async () => {







      try {







        if (



          !name ||



          !price ||



          !category ||



          !image



        ) {







          return toast.warning(



  "Veuillez remplir tous les champs ⚠️",



  {



    position: "top-right",



    autoClose: 2500,



  }



);







        }







        setLoading(true);







        // IMAGE







        // SAVE DATABASE







        const formData =



  new FormData();







formData.append("name", name);







formData.append("price", price);







formData.append("category", category);







formData.append("image", image);







await api.post(



  "https://konanshopping.com/api/add-product",



  formData,



  {



    headers: {



      "Content-Type": "multipart/form-data",



    },



  }



);







        // RESET







        setName("");







        setPrice("");







        setCategory("");







        setImage(null);







        fetchProducts();







        toast.success(



  "Produit ajouté dans la boutique ✅",



  {



    position: "top-right",



    autoClose: 2500,



  }



);







      } catch (err) {







        console.error("Erreur AdminProducts :", err?.message || "Erreur inconnue");







        toast.error(



  "Erreur lors de l'ajout du produit ❌",



  {



    position: "top-right",



    autoClose: 3000,



  }



);







      } finally {







        setLoading(false);







      }







    };







  // =========================



  // DELETE PRODUCT



  // =========================







  const deleteProduct =



    async (id) => {







      const confirmDelete =



        window.confirm(



          "Supprimer ce produit ?"



        );







      if (!confirmDelete)



        return;







      try {







        await api.delete(



  `https://konanshopping.com/api/delete-product/${id}`



);







        fetchProducts();







        toast.success(



  "Produit supprimé avec succès 🗑️",



  {



    position: "top-right",



    autoClose: 2500,



  }



);







      } catch (err) {







        console.error("Erreur AdminProducts :", err?.message || "Erreur inconnue");







      }







    };







  // =========================



  // UPDATE PRODUCT



  // =========================







  const updateProduct =



    async () => {







      try {







        setLoading(true);







        await api.put(



  `https://konanshopping.com/api/update-product/${editId}`,



  {



    name,



    price,



    category,



  }



);







        setEditId(null);







        setName("");







        setPrice("");







        setCategory("");







        setImage(null);







        fetchProducts();







        toast.success(



  "Produit modifié avec succès ✏️",



  {



    position: "top-right",



    autoClose: 2500,



  }



);







      } catch (err) {







        console.error("Erreur AdminProducts :", err?.message || "Erreur inconnue");







      } finally {







        setLoading(false);







      }







    };







  // =========================



  // SEARCH



  // =========================







  const filteredProducts =



    products.filter((product) =>







      product.name



        ?.toLowerCase()



        .includes(



          search.toLowerCase()



        )







    );







  // =========================



  // RETURN



  // =========================







  return (







    <div className="adminProducts">







      {/**\\\*** HEADER **\\\***/}







      <div className="productsHeader">







        <div>







          <h1>







            Gestion Produits







          </h1>







          <p>







            Gérez facilement



            tous vos produits



            ecommerce premium







          </p>







        </div>







        <div className="searchBox">







          <FaSearch />







          <input



            type="text"



            placeholder="Rechercher..."



            value={search}



            onChange={(e) =>



              setSearch(



                e.target.value



              )



            }



          />







        </div>







      </div>







      {/**\\\*** STATS **\\\***/}







      <div className="productsStats">







        <div className="statCard">







          <div>







            <p>



              Produits



            </p>







            <h2>



              {products.length}



            </h2>







          </div>







          <FaBox />







        </div>







        <div className="statCard">







          <div>







            <p>



              Catégories



            </p>







            <h2>







              {



                [



                  ...new Set(



                    products.map(



                      (p) =>



                        p.category



                    )



                  )



                ].length



              }







            </h2>







          </div>







          <FaTags />







        </div>







      </div>







      {/**\\\*** FORMULAIRE **\\\***/}







      <div className="productForm">







        <div className="formHeader">







          <div>







            <h2>







              {editId



                ? "Modifier Produit"



                : "Ajouter Produit"}







            </h2>







            <p>







              Ajoutez rapidement



              vos nouveaux produits



              premium dans la boutique







            </p>







          </div>







        </div>







        {/**\\\*** GRID **\\\***/}







        <div className="formGrid">







          {/**\\\*** NOM **\\\***/}







          <div className="inputBox">







            <label>



              Nom produit



            </label>







            <input



              type="text"



              placeholder="Ex: Jordan 4"



              value={name}



              onChange={(e) =>



                setName(



                  e.target.value



                )



              }



            />







          </div>







          {/**\\\*** PRIX **\\\***/}







          <div className="inputBox">







            <label>



              Prix



            </label>







            <input



              type="number"



              placeholder="20000"



              value={price}



              onChange={(e) =>



                setPrice(



                  e.target.value



                )



              }



            />







          </div>







          {/**\\\*** CATEGORIE **\\\***/}







          <div className="inputBox">







            <label>



              Catégorie



            </label>







            <select



              value={category}



              onChange={(e) =>



                setCategory(



                  e.target.value



                )



              }



            >







  <option value="">



    Choisir catégorie



  </option>







  <option>T-shirts</option>



  <option>Chemises</option>



  <option>Blouses</option>



  <option>Polos</option>



  <option>Débardeurs</option>



  <option>Pulls</option>



  <option>Gilets</option>



  <option>Sweats</option>



  <option>Hoodies</option>



  <option>Vestes</option>



  <option>Blousons</option>



  <option>Manteaux</option>



  <option>Costumes</option>



  <option>Blazers</option>



  <option>Robes</option>



  <option>Jupes</option>



  <option>Pantalons</option>



  <option>Jeans</option>



  <option>Leggings</option>



  <option>Shorts</option>



  <option>Combinaisons</option>



  <option>Pyjamas</option>



  <option>Sous-vêtements</option>



  <option>Lingerie</option>



  <option>Chaussettes</option>



  <option>Maillots de bain</option>



  <option>Vêtements de sport</option>



  <option>Tenues de yoga</option>



  <option>Mode homme</option>



  <option>Mode femme</option>



  <option>Mode enfant</option>



  <option>Mode bébé</option>



  <option>Chaussures</option>



  <option>Baskets</option>



  <option>Chaussures de ville</option>



  <option>Bottes</option>



  <option>Bottines</option>



  <option>Sandales</option>



  <option>Mocassins</option>



  <option>Escarpins</option>



  <option>Ballerines</option>



  <option>Claquettes</option>



  <option>Sacs à main</option>



  <option>Sacs à dos</option>



  <option>Sacs de voyage</option>



  <option>Valises</option>



  <option>Portefeuilles</option>



  <option>Ceintures</option>



  <option>Montres</option>



  <option>Bijoux</option>



  <option>Lunettes</option>



  <option>Casquettes</option>



  <option>Chapeaux</option>



  <option>Écharpes</option>



  <option>Foulards</option>



  <option>Gants</option>



  <option>Accessoires</option>



  <option>Accessoires de mode</option>



  <option>Luxe</option>



  <option>Nouveautés</option>



  <option>Promotions</option>



</select>







          </div>







          {/**\\\*** IMAGE **\\\***/}







          <div className="inputBox">







            <label>



              Image produit



            </label>







            <div className="uploadBox">







              <FaImage />







              <input



                type="file"



                onChange={(e) =>



                  setImage(



                    e.target.files[0]



                  )



                }



              />







            </div>







          </div>







        </div>







        {/**\\\*** BUTTON **\\\***/}







        <button



          className="addBtn"



          onClick={



            editId



              ? updateProduct



              : addProduct



          }



        >







          {loading ? (







            "Chargement..."







          ) : (







            <>



              {editId



                ? <FaEdit />



                : <FaPlus />}







              {editId



                ? "Modifier Produit"



                : "Ajouter à la boutique"}



            </>







          )}







        </button>







      </div>







      {/**\\\*** PRODUITS **\\\***/}







      <div className="productsGrid">







        {filteredProducts.map(



          (



            product,



            index



          ) => (







            <div



              key={index}



              className="productCard"



            >







              {/**\\\*** IMAGE **\\\***/}







              <div className="productImage">







                <img



  src={



    product.image.startsWith("http")



      ? product.image



      : `https://konanshopping.com/api/${product.image}`



  }



   alt=""



/>







              </div>







              {/**\\\*** INFO **\\\***/}







              <div className="productInfo">







                <h3>







                  {



                    product.name



                  }







                </h3>







                <h4>







                  {



                    product.price



                  } FCFA







                </h4>







                <span>







                  {



                    product.category



                  }







                </span>







              </div>







              {/**\\\*** BUTTONS **\\\***/}







              <div className="productBtns">







                {/**\\\*** EDIT **\\\***/}







                <button



                  className="editBtn"







                  onClick={() => {







                    setEditId(



                      product._id



                    );







                    setName(



                      product.name



                    );







                    setPrice(



                      product.price



                    );







                    setCategory(



                      product.category



                    );







                    window.scrollTo({



                      top:0,



                      behavior:"smooth",



                    });







                  }}



                >







                  <FaEdit />







                  Modifier







                </button>







                {/**\\\*** DELETE **\\\***/}







                <button



                  className="deleteBtn"







                  onClick={() =>



                    deleteProduct(



                      product._id



                    )



                  }



                >







                  <FaTrash />







                  Supprimer







                </button>







              </div>







            </div>







          )



        )}







      </div>







    </div>







  );







}







export default AdminProducts;