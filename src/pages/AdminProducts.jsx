import {
  useEffect,
  useState
} from "react";

import axios from "axios";

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

        const res =
          await axios.get(
            "https://konanshopping-production.up.railway.app/products"
          );

        setProducts(res.data);

      } catch (err) {

        console.log(err);

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

          return alert(
            "Veuillez remplir tous les champs"
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

await axios.post(
  "http://localhost:5000/add-product",
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

        alert(
          "Produit ajouté dans la boutique ✅"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Erreur ajout produit ❌"
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

        await axios.delete(
          `https://konanshopping-production.up.railway.app/delete-product/${id}`
        );

        fetchProducts();

        alert(
          "Produit supprimé ✅"
        );

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct =
    async () => {

      try {

        setLoading(true);

        await axios.put(
          `https://konanshopping-production.up.railway.app/update-product/${editId}`,
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

        alert(
          "Produit modifié ✅"
        );

      } catch (err) {

        console.log(err);

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

      {/* HEADER */}

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

      {/* STATS */}

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

      {/* FORMULAIRE */}

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

        {/* GRID */}

        <div className="formGrid">

          {/* NOM */}

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

          {/* PRIX */}

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

          {/* CATEGORIE */}

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

              <option>
                Chaussures
              </option>

              <option>
                T-shirts
              </option>

              <option>
                Vestes
              </option>

              <option>
                Sacs
              </option>

              <option>
                Accessoires
              </option>

              <option>
                Jeans
              </option>

            </select>

          </div>

          {/* IMAGE */}

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

        {/* BUTTON */}

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

      {/* PRODUITS */}

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

              {/* IMAGE */}

              <div className="productImage">

                <img
  src={
    product.image.startsWith("http")
      ? product.image
      : `https://konanshopping-production.up.railway.app/${product.image}`
  }
  alt=""
/>

              </div>

              {/* INFO */}

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

              {/* BUTTONS */}

              <div className="productBtns">

                {/* EDIT */}

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

                {/* DELETE */}

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