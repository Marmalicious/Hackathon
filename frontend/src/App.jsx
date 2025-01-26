import { useState, useEffect, useRef } from "react";
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
	const ingredients = [];
	const [calories, setCalories] = useState(100);
	const [fat, setFat] = useState(5);
	const [cholesterol, setCholesterol] = useState(0);
	const [carbohydrates, setCarbohydrates] = useState(17);
	const [fiber, setFiber] = useState(4);
	const [sugar, setSugar] = useState(0);
	const [protein, setProtein] = useState(5);
	const [instrOpen, setInstrOpen] = useState(false);
	const instrButRef = useRef(null);

	const handleInstrClick = () => {
		setInstrOpen(true);
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			if(event.key == 'Escape') {
				setInstrOpen(false);
			}
		};
		const handleClick = (event) => {
			//console.log(instrOpen);
			if(instrOpen && instrButRef.current && !instrButRef.current.contains(event.target)) {
				setInstrOpen(false);
			}
		};
		document.addEventListener('click', handleClick);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleEnter = (event) => {
		setInputValue(event.target.value);
	};

	const handleRand = (event) => {
		getRandomItem();
	}

	async function handleUpdate(e) {
        const res = await fetch('/api/results');//, {method: form.method, body: formData});
        const data = await res.json();
		setCalories(data[0]);
		setProtein(data[1].toFixed(1));
		setCholesterol(data[2].toFixed(1));
		setCarbohydrates(data[3].toFixed(1));
		setFiber(data[4].toFixed(1));
		setFat(data[5].toFixed(1));
		setSugar(data[6].toFixed(1));
		console.log(data);
    }

	/*
	async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const res = await fetch("/api/unc",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: "81"
            })
        const data = await res.json();
        console.log(res);
    }
		*/



	
	async function handleSubmit(e) {
		e.preventDefault();
		const form = e.target;
		const value = e.target.input.value;
		//const splitValue = inputValue.split('\n');
		//splitValue.forEach((line) => {
		//	fetch('/api/input', {method: form.method, body: line});
		//})
		//console.log();
		const formData = new FormData(form);
		//console.log({ value});
		
		const res = await fetch('/api/input', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ data: { value } }),
		});
		if (!res.ok) {
			console.log("rip")
		}
		console.log(res);
		const data = await res.json();
		//handleUpdate();
		setCalories(data[0]);
		setProtein(data[1].toFixed(1));
		setCholesterol(data[2].toFixed(1));
		setCarbohydrates(data[3].toFixed(1));
		setFiber(data[4].toFixed(1));
		setFat(data[5].toFixed(1));
		setSugar(data[6].toFixed(1));
		console.log(data);

			
		//const formData = new FormData(form);
		//const temp = fetch('/api/input', {method: form.method, body: formData});
		//const data = await temp.json();
		////console.log(formData);
		//setCalories(0);

		//fetch('/api/input', {method: form.method, body: formData});
		//console.log(formData);
		//const formJson = Object.fromEntries(formData.entries());
    	//console.log(formJson);
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


	async function getNutrData() { // link to enter
		const res = await fetch(`/api/get-nutr`);
		const data = await res.json();
		setCalories(data.calories);
		setFat(data.fat);
		setCholesterol(data.cholesterol);
		setCarbohydrates(data.carbohydrates);
		setFibers(data.fiber);
		setSugar(data.sugar);
		setProtein(data.protein);
	}
	/*
	<div className="entryFields">
						<input className="entryName" placeholder="Ingredient name..."></input>
						<input className="entryQuantity" placeholder="quantity"></input>
						<input className="entryUnit" placeholder="unit (optional)"></input>
					</div>
	*/
	/*
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
	*/
	return (
		<>
			<h1>Recipe Analysis Tool</h1>
			<div className="mainDiv">
				{instrOpen ? <div className="instructions">
					<h2>How it Works</h2>
					<p>Type the ingredient list for a recipe you want to analyze in the entry field,</p>
					<p>each ingredient on an inidividual line. Then click 'Enter' to submit the query!</p>
					<p>In the 'Nutrition' category we will have the nutritional information for your recipe. </p>
					<p>In the 'Price' category we will estimate the cost of the recipe you provided.</p>
				</div> : null}
				<form className="inputForm" method="post" onSubmit={handleSubmit}>
					<textarea className="inputField" name='input' placeholder="Quantity, unit, ingredient name..."></textarea>
					<div className="buttonArea">
						<button className="enter" onClick={handleEnter}>Enter</button>
						<button className="getreand" onClick={handleUpdate}>Random</button>
						<button className="infoButton" ref={instrButRef} onClick={handleInstrClick}>How it Works</button>
					</div>
				</form>
				<div className="nutritionInfo">
					<h2>Nutrition</h2>
					<div className="nutrItem"><div className="label">Calories:</div><div className="value">{calories}</div></div>
					<div className="nutrItem"><div className="label">Total Fat:</div><div className="value">{fat}g</div></div>
					<div className="nutrItem"><div className="label">Cholesterol:</div><div className="value">{cholesterol}g</div></div>
					<div className="nutrItem"><div className="label">Carbohydrates:</div><div className="value">{carbohydrates}g</div></div>
					<div className="nutrItem"><div className="label">Fiber:</div><div className="value">{fiber}g</div></div>
					<div className="nutrItem"><div className="label">Sugar:</div><div className="value">{sugar}g</div></div>
					<div className="nutrItem"><div className="label">Protein:</div><div className="value">{protein}g</div></div>
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
