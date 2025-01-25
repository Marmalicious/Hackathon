import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/*
This is the starting point of our application. Here, we can begin coding 
and transforming this page into whatever best suits our needs. 
For example, we can start by creating a login page, home page, or an about section; 
there are many ways to get your application up and running. 
With App.jsx, we can also define global variables and routes to store information as well as page navigation.
*/
function App() {
	const [count, setCount] = useState(0);
	const [randomItem, setRandomItem] = useState(null);
	const [inputValue, setInputValue] = useState('');

	const handleEnter = (event) => {
		setInputValue(event.target.value);
	};

	function handleSubmit(e) {
		e.preventDefault();
		const form = e.target;
	}

	async function getRandomItem() {
		/*
		Because of the server proxy we set up in our Vite config, there's no
		more need to specify localhost for the backend! Just use `/api/path`.

		We query the backend and store its response into a state variable,
		where we display it in our JSX below.
		*/

		const res = await fetch(`/api/get-random`);
		const data = await res.json();
		setRandomItem(data["item_id"]);
	}

	useEffect(() => {
		getRandomItem();
	}, []);

	/*
	<div className="entryFields">
						<input className="entryName" placeholder="Ingredient name..."></input>
						<input className="entryQuantity" placeholder="quantity"></input>
						<input className="entryUnit" placeholder="unit (optional)"></input>
					</div>
	*/
	return (
		<>
			<h1>Recipe Nutrition Finder</h1>
			<div className="mainDiv">
				<form method="post" onSubmit={handleSubmit}>
					<textarea className="inputField" placeholder="Ingredient name, quantity, unit (optional)"></textarea>
					<button className="enter" onClick={handleEnter}>Enter</button>
				</form>
				<div className="ingredientArea">
					<ul className="ingredientList">
						<div className="ingredient"><button className="ingredientX">X</button>
							<div className="ingredientName">Pasta</div>
							<div className="ingredientQuantity">1</div>
							<div className="ingredientUnit">Cup</div>
						</div>
						<div className="ingredient"><button className="ingredientX">X</button>{inputValue}</div>
					</ul>
				</div>
				
				{/* Here's a trick you can use! If you want to render a JSX element only when a
				state variable becomes not `null` (i.e. truthy), you can do a short circuit
				operation with `&&`. */}
				{randomItem && (
					<p>The item retrieved from the backend has an ID of {randomItem}</p>
				)}
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
