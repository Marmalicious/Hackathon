"""
This file defines the FastAPI app for the API and all of its routes.
To run this API, use the FastAPI CLI
$ fastapi dev src/api.py
"""

import random, requests, re

from fastapi import FastAPI
from pydantic import BaseModel

# The app which manages all of the API routes
app = FastAPI()


# The decorator declares the function as a FastAPI route on the given path.
# This route in particular is a GET route at "/hello" which returns the example
# dictionary as a JSON response with the status code 200 by default.
@app.get("/hello")
def hello() -> dict[str, str]:
    """Get hello message."""
    return {"message": "Hello from FastAPI"}


# The routes that you specify can also be dynamic, which means that any path
# that follows the format `/items/[some integer]` is valid. When providing
# such path parameters, you'll need to follow this specific syntax and state
# the type of this argument.
#
# This path also includes an optional query parameter called "q". By accessing
# the URL "/items/123456?q=testparam", the JSON response:
#
# { "item_id": 123456, "q": "testparam" }
#
# will be returned. Note that if `item_id` isn't an integer, FastAPI will
# return a response containing an error statement instead of our result.
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None) -> dict[str, int | str | None]:
    return {"item_id": item_id, "q": q}


@app.get("/get-random")
def get_random_item() -> dict[str, int]:
    """Get an item with a random ID."""
    return {"item_id": random.randint(0, 1000)}

api_url = "https://api.edamam.com/api/nutrition-data?app_id=69db25ee&app_key=bc0d82f7d39679d94a75479fea326686&nutrition-type=cooking&ingr="
app_id = "69db25ee"
app_key = "bc0d82f7d39679d94a75479fea326686"

class Total:
    def __init__(self, cal=0, prot=0, chole=0, carb=0, fiber=0, fat=0, sugar=0, error=""):
        self.cal = cal
        self.prot = prot
        self.chole = chole
        self.carb = carb
        self.fiber = fiber
        self.fat = fat
        self.sugar = sugar
        self.error = error

    #def __str__(self):

@app.post("/input")
async def recieve(data: dict):
    t = Total()
    ret = [];
    inp = data.get("data", None)
    inpp = inp.get("value", None)
    in_arr = re.split("\n|, |,", inpp)

    for ingri in in_arr:
        Reader(ingri, t, ret)

    return t.cal, t.prot, t.chole, t.carb, t.fiber, t.fat, t.sugar, t.error, ret

"""@app.get("/results")
def results():
    t = Total()
    #inp = d.get("data", None)
    #inpp = inp.get("value", None)
    inp = "1 taco\n2 chocolate\n1 mango"

    in_arr = inp.split("\n")

    for ingri in in_arr:
        Reader(ingri, t)
        print(t.prot)

    return t.cal, t.prot, t.chole, t.carb, t.fiber, t.fat, t.sugar"""

def Reader(ingri, t: Total, ret):
    youarel = api_url + ingri
    if ingri == "":
        t.error = "Empty Line!"
        return

    init = requests.get(youarel).json()
    if init.get("totalNutrients", None).get("ENERC_KCAL", None) == None:
        t.error = "Invalid Ingredient or Quantity!"
        return

    InputReturn(init, ret)
    return Updater(init, t)


def Updater(init, t: Total):
    t.cal += init.get("calories", 0)
    t.prot += Parser(init, "PROCNT")
    t.chole += Parser(init, "CHOLE")
    t.carb += Parser(init, "CHOCDF")
    t.fiber += Parser(init, "FIBTG")
    t.fat += Parser(init, "FAT")
    t.sugar += Parser(init, "SUGAR")
    return


def Parser(top, key): 
    middle = top.get("totalNutrients", None)
    ground = middle.get(key, None)
    if ground == None:
        return 0;
    return ground.get("quantity", 0)


def InputReturn(top, ret):
    middle = top.get("ingredients")
    ground = middle[0].get("parsed")
    ret.append(ground[0].get("quantity"))
    ret.append(ground[0].get("measure"))
    ret.append(ground[0].get("food"))
    return


@app.get("/test")
def toktok():
    youarel = api_url + "1 tacos"
    init = requests.get(youarel).json()
    #return youarel
    return init