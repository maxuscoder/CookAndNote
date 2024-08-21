import React, { useState } from "react";
import Pasta from "./images/pasta.jpg";
import Burger from "./images/burger.jpg";
import PotatoHam from "./images/potato-ham.jpg";

const initialRecipes = [
  {
    id: 1,
    title: "Beef Cheesy Pasta",
    ingredients: ["pasta", "beef", "cheddar", "parmesan", "cream"],
    difficulty: 2,
    duration: 35,
    imgsrc:
      "https://images.immediate.co.uk/production/volatile/sites/30/2021/03/Cacio-e-Pepe-e44b9f8.jpg?quality=90&resize=556,505",
  },
  {
    id: 2,
    title: "Chicken Burger",
    ingredients: ["bun", "chicken", "salad", "cheese", "tomato", "sauce"],
    difficulty: 1,
    duration: 20,
    imgsrc:
      "https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg",
  },
  {
    id: 3,
    title: "Ham Potato Mix",
    ingredients: ["potato", "ham", "mozzarela", "onion"],
    difficulty: 3,
    duration: 60,
    imgsrc:
      "https://spicedblog.com/wp-content/uploads/2023/10/Cheesy-Ham-and-Potato-Casserole1-500x500.jpg",
  },
];

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  function handleDeleteRecipe(id) {
    setRecipes((recipes) => recipes.filter((recipe) => recipe.id !== id));
  }

  function handleEditRecipe(id) {
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    setEditingRecipe(recipeToEdit);
    setIsEditing(true);
  }

  function handleUpdateRecipe(updatedRecipe) {
    setRecipes((recipes) =>
      recipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    setIsEditing(false);
    setEditingRecipe(null);
  }

  function handleAddNewRecipe(newRecipe) {
    setRecipes((recipes) => [
      ...recipes,
      { ...newRecipe, id: Math.max(...recipes.map((recipe) => recipe.id)) + 1 },
    ]);
    setIsAdding(!isAdding);
  }

  return (
    <div className="app">
      <Header />
      <Panel
        recipes={recipes}
        onDeleteRecipe={handleDeleteRecipe}
        onEditRecipe={handleEditRecipe}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingRecipe={editingRecipe}
        onUpdateRecipe={handleUpdateRecipe}
        onAddRecipe={handleAddNewRecipe}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        toggleAddForm={setIsAdding}
      />
      <Footer recipes={recipes} />
    </div>
  );
}

function Header() {
  return <h1 className="header">🧑🏽‍🍳 cook-n-note</h1>;
}

function Panel({
  recipes,
  onDeleteRecipe,
  onEditRecipe,
  isEditing,
  setIsEditing,
  editingRecipe,
  onUpdateRecipe,
  onAddRecipe,
  isAdding,
  toggleAddForm,
  setIsAdding,
}) {
  return (
    <div className="panel">
      <Left toggleAddForm={toggleAddForm} />

      {!isAdding && !isEditing ? (
        <Mid />
      ) : isAdding ? (
        <AddForm
          recipe={editingRecipe}
          isAdding={isAdding}
          onAddNewRecipe={onAddRecipe}
          setIsAdding={setIsAdding}
        />
      ) : isEditing ? (
        <EditForm
          recipe={editingRecipe}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onUpdateRecipe={onUpdateRecipe}
        />
      ) : (
        <Mid />
      )}

      <Right
        recipes={recipes}
        onDeleteRecipe={onDeleteRecipe}
        onEditRecipe={onEditRecipe}
      />
    </div>
  );
}

function Left({ toggleAddForm }) {
  return (
    <div className="left">
      <h1>What's on your mind...</h1>
      <button className="btn-add-recipe" onClick={toggleAddForm}>
        +
      </button>
    </div>
  );
}
function Mid() {
  return (
    <div className="mid">
      <img
        src="https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_640.jpg"
        alt="cooking_img"
        width="300px"
        height="400px"
        className="mid-img"
      ></img>
    </div>
  );
}
function Right({ recipes, onDeleteRecipe, onEditRecipe }) {
  return (
    <div className="right">
      <h2>YOUR RECIPES 📃</h2>
      <div className="recipes-list">
        {recipes.map((recipe) => (
          <Recipe
            recipe={recipe}
            key={recipe.id}
            onDeleteRecipe={onDeleteRecipe}
            onEditRecipe={onEditRecipe}
          />
        ))}
      </div>
    </div>
  );
}

function Recipe({ recipe, onDeleteRecipe, onEditRecipe }) {
  return (
    <div className="recipe">
      <div className="recipe-details">
        <h3>🍽️ {recipe.title}</h3>
        <p className="attr">🧾 {recipe.ingredients?.join(", ")}</p>
        <p className="attr">Difficulty: {recipe.difficulty} ⭐</p>
        <p className="attr">Duration: {recipe.duration} min. ⏳</p>
      </div>
      <div className="edit-btns">
        <img src={recipe.imgsrc} alt={recipe.title}></img>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => {
              onDeleteRecipe(recipe.id);
            }}
          >
            ❌
          </button>
          <button
            onClick={() => {
              onEditRecipe(recipe.id);
            }}
          >
            ✏️
          </button>
        </div>
      </div>
    </div>
  );
}

function AddForm({ onAddNewRecipe, isAdding, setIsAdding }) {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: [],
    duration: "",
    difficulty: "",
    imgsrc: "",
  });

  const [image, setImage] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setNewRecipe((prevRecipe) => ({
          ...prevRecipe,
          imgsrc: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({
      ...prev,
      [name]: name === "ingredients" ? value.split(",") : value,
    }));
  }
  function handleCloseForm(e) {
    e.preventDefault();
    setIsAdding(!isAdding);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.duration) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    onAddNewRecipe(newRecipe);
    setNewRecipe({
      title: "",
      ingredients: [],
      duration: "",
      difficulty: "",
      imgsrc: "",
    });
    setImage(null);
  }

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <button onClick={handleCloseForm} className="btn-close-form">
          X
        </button>
        <label>
          🍽️ Title:
          <br />
          <input
            type="text"
            value={newRecipe.title}
            name="title"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          🛒 Ingredients:
          <br />
          <input
            type="text"
            value={newRecipe.ingredients?.join(",")}
            name="ingredients"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          ⌚ Duration:
          <br />
          <input
            type="text"
            value={newRecipe.duration}
            name="duration"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          💪🏾 Difficulty:
          <br />
          <input
            type="text"
            value={newRecipe.difficulty}
            name="difficulty"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />{" "}
        {image && (
          <img src={image} alt="Uploaded" style={{ maxWidth: "100px" }} />
        )}{" "}
        <button type="submit" className="submitRecipeForm">
          Add Recipe
        </button>
      </form>
    </div>
  );
}

function EditForm({ recipe, onUpdateRecipe, isEditing, setIsEditing }) {
  const [updatedRecipe, setUpdatedRecipe] = useState({ ...recipe });
  const [image, setImage] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setUpdatedRecipe((prevRecipe) => ({
          ...prevRecipe,
          imgsrc: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUpdatedRecipe((prev) => ({
      ...prev,
      [name]: name === "ingredients" ? value.split(",") : value,
    }));
  }

  function handleCloseForm(e) {
    e.preventDefault();
    setIsEditing(!isEditing);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateRecipe(updatedRecipe);
  }

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <button onClick={handleCloseForm} className="btn-close-form">
          X
        </button>
        <label>
          🍽️ Title:
          <br />
          <input
            type="text"
            value={updatedRecipe.title}
            name="title"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          🧾 Ingredients:
          <br />
          <input
            type="text"
            value={updatedRecipe.ingredients?.join(", ")}
            name="ingredients"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          ⌛ Duration:
          <br />
          <input
            type="text"
            value={updatedRecipe.duration}
            name="duration"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <label>
          ⭐ Difficulty:
          <br />
          <input
            type="text"
            value={updatedRecipe.difficulty}
            name="difficulty"
            onChange={handleChange}
            className="formInputs"
          />
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />{" "}
        {image && (
          <img src={image} alt="Uploaded" style={{ maxWidth: "100px" }} />
        )}{" "}
        <button type="submit" className="submitRecipeForm">
          Save Changes
        </button>
      </form>
    </div>
  );
}

function Footer({ recipes }) {
  return <div className="footer">You cooked {recipes.length} recipes</div>;
}
