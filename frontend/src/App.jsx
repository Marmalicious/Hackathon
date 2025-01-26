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
	const [nutrOpen, setNutrOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [ingrString, setIngrString] = useState('');

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




	
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		const form = e.target;
		const value = e.target.input.value;
		const formData = new FormData(form);
	
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
		setError(data[7]);
		setNutrOpen(true);
		console.log(data);
		setIngrString('');
		let size = data[8].length;
		console.log(size);
		let newS = '';
		for (let i = 0; i < size; i+=3) {
			newS += data[8][i] + ' ' + data[8][i+1] + ' ' + data[8][i+2] + '\n';
			console.log(newS);
			setIngrString(newS);
		}
		setLoading(false);
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

	<button className="getreand" onClick={handleUpdate}>Random</button>
	<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
	*/
	return (
		<>
			<p className="names">By Laviero Mancinelli and Thomas Nguyen</p>
			<h1>Ingredient Nutrition Finder</h1>
			<img className="chickenImg" src="../public/images/chicken.png"/>
			<img className="tacoImg" src="../public/images/taco.png"/>
			<img className="chocolateImg" src="../public/images/chocolate.png"/>
			<img className="sugarImg" src="../public/images/sugar.png"/>
			<div className="mainDiv">
				{instrOpen ? <div className="instructions">
					<h2>How it Works</h2>
					<p>Type the ingredient list for a recipe you want to analyze in the entry field, each ingredient on an inidividual line. Then click 'Enter' to submit the query! In the 'Nutrition' category we will have the nutritional information for your recipe. </p>
				</div> : null}
				<form className="inputForm" method="post" onSubmit={handleSubmit}>
					<textarea className="inputField" name='input' placeholder="Quantity, unit, ingredient name..."></textarea>
					<div className="buttonArea">
						<button className="enter" onClick={handleEnter} type="submit">Enter</button>
						<button className="infoButton" ref={instrButRef} onClick={handleInstrClick} type="button">How it Works</button>
						{loading && <div className="loading">Loading...</div>}
					</div>
				</form>
				{error != '' && <div className="error"><strong>Error:</strong> {error}</div>}
				{ingrString != '' && <div className="ingrList">
					<h2>For:</h2>
					<p>{ingrString}</p>
				</div>}
				{nutrOpen && <div className="nutritionInfo">
					<h2>Nutrition</h2>
					<div className="nutrItem"><div className="label">Calories:</div><div className="value">{calories}</div></div>
					<div className="nutrItem"><div className="label">Total Fat:</div><div className="value">{fat}g</div></div>
					<div className="nutrItem"><div className="label">Cholesterol:</div><div className="value">{cholesterol}g</div></div>
					<div className="nutrItem"><div className="label">Carbohydrates:</div><div className="value">{carbohydrates}g</div></div>
					<div className="nutrItem"><div className="label">Fiber:</div><div className="value">{fiber}g</div></div>
					<div className="nutrItem"><div className="label">Sugar:</div><div className="value">{sugar}g</div></div>
					<div className="nutrItem"><div className="label">Protein:</div><div className="value">{protein}g</div></div>
				</div>}
			</div>
			
		</>
	);
}

export default App;
