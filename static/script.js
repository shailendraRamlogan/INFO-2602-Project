let url='http://127.0.0.1:8080';
let server='http://127.0.0.1:8080';
const appID = '09922bc4';
const appKey = '7b4e785f51b5bdfb12595b7b385b35a6';
let query = '';
let search = '';
let recipes=[];
let x= document.getElementById("signup");
let y= document.getElementById("login");
let z= document.getElementById("btn");

function login(){
  x.style.left= "-400px";
  y.style.left= "50px";
  z.style.left= "110px";
}

function signup(){
  x.style.left= "50px";
  y.style.left= "450px";
  z.style.left= "0px";
}

async function signUp(url, data){
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'POST',
        body: JSON.stringify(data),//convert data to JSON string
        headers: {'Content-Type':'application/json'}// JSON data
      },
    );//1. Send http request and get response
     
    let result = await response.text();//2. Get message from response
    alert(result);
  }catch(error){
    alert(error);
    console.log(error);//catch and log any errors
  }
}

async function logIn(url, data){
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'POST',
        body: JSON.stringify(data),//convert data to JSON string
        headers: {'Content-Type':'application/json'}// JSON data
      },
    );//1. Send http request and get response
    
    let result = await response.json();//2. Get message from response
    if(result.hasOwnProperty('access_token')){
      localStorage.setItem("access_token",result.access_token);
      let token = localStorage.getItem("access_token");
      homePage(`${server}/home`, token);
    }else{
      alert(result);//3. Do something with the message
      console.log(result);
    }
  }catch(error){
    alert(error);
    console.log(error);//catch and log any errors
  }
}

async function homePage(url, token){
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        body: null,//convert data to JSON string
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response;
    window.location.replace(result.url);
    console.log(token);
  }catch(e){
    console.log(e);
  }
}

function signUpSubmit(event){
    event.preventDefault();//prevents page redirection
        
    //event target returns the element on which the event is fired upon ie event.target === myForm
   
    //get data from form using elements property
    let myform = event.target.elements;
    let chkbx= document.getElementById("chkbx");
    let cpassword= myform['cpassword'].value;
   
    let data = {
      name: myform['name'].value,
      email: myform['email'].value,
      password: myform['password'].value
    }

    if(data.password !== cpassword){
      alert("Passwords Do Not Match.");
      return false;
    } else if(chkbx.checked!==true){
      alert("Please agree to terms & conditions.");
      return false;
    }
    signUp(`${url}/signup`,data);
    console.log(data);
}

function logInSubmit(event){
    event.preventDefault();//prevents page redirection
        
    //event target returns the element on which the event is fired upon ie event.target === myForm
   
    //get data from form using elements property
    let myform = event.target.elements;
   
    let data = {
      username: myform['name'].value,
      password: myform['password'].value
    }
   
    logIn(`${url}/auth`,data);
}

async function getRecipes(){
  try{
    let response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${appID}&app_key=${appKey}`);
    let data = await response.json();
    for(let i=0;i<data.hits.length;i++){
      let id=data.hits[i].recipe.label;
      let recipe=data.hits[i].recipe;
      let ringredients=[];
      let ingredients = data.hits[i].recipe.ingredients;
      let count = ingredients.length;
      for(let i=0;i<count;i++){
        ringredients.push(ingredients[i].text);
      }
      let obj={"id":id, "recipe":recipe, "ingredients":ringredients};
      recipes.push(obj);
    }
    displayRecipes(recipes);
    console.log(recipes);
  }
  catch(e){
    console.log(e);
  }
}

function goTo(link){
  window.open(link);
}

function displayRecipes(records){
  let res = document.querySelector('#recipes');
  res.innerHTML = ``;
  for (i=0;i<records.length;i++){
    let ingredients=records[i].ingredients;
    res.innerHTML += `
      <div class="recipe" id="${records[i].recipe.label}">
      <h2>${records[i].recipe.label}</h2>
      <img class="image" src="${records[i].recipe.image}"/>
      <p>Cautions: ${records[i].recipe.cautions}</p>
      <p>Diet Labels: ${records[i].recipe.dietLabels}</p>
      <p>Health Labels: ${records[i].recipe.healthLabels}</p>
      <div class="btns">
      <button onclick="recipeSubmit('${records[i].recipe.label}','${records[i].recipe.url}','${ingredients}')">Save Dish</button>
      <button onclick="goTo('${records[i].recipe.url}')">View Recipe</button>
      <button onclick="viewIngredients('${records[i].id}')">View Ingredients</button>
      </div>
      </div>
    `;
  }
}

function setSearch(e){
  search = e.target.value;
}
function getSearch(e){
  recipes=[];
  e.preventDefault();
  query = search;
  getRecipes();
}

function recipeSubmit(name, url, ingredients){
  event.preventDefault();//prevents page redirection
      
  let data = {
    name: name,
    recipeUrl: url,
    ingredients: ingredients
  }
  addRecipe(`${server}/recipe`, data);
  console.log(data);
}

async function addRecipe(url, data){
  let token=localStorage.getItem("access_token");
  try{
    let response =await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type':'application/json',
                    'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result = await response.text();
    alert(result);
    console.log(result);
    console.log(token);
  }catch(error) {
    alert(error);
    console.log(error);
  }
}

function viewIngredients(name){
  let res = document.getElementById(`${name}`);
  res.innerHTML=``;
  res.innerHTML=`<h2>${name}</h2>`;
  let ingredients=[];
  let url='';
  for(let i=0;i<recipes.length;i++){
    if(recipes[i].id===name){
      ingredients=recipes[i].ingredients;
      url=recipes[i].recipe.url;
    }
  }
  for(let i=0;i<ingredients.length;i++){
    res.innerHTML+=`<p>${ingredients[i]}</p>`;
  }
  res.innerHTML+=`<div class="btns">
                    <button onclick="compareIngredients('${name}')">Compare Ingredients</button>
                    <button onclick="goTo('${url}')">View Recipe</button>
                    <button onclick="reDraw('${name}')">View Info</button>
                  </div>`;
}

function reDraw(name){
  let res=document.getElementById(`${name}`);
  res.innerHTML=``;
  for(let i=0;i<recipes.length;i++){
    if(recipes[i].id==name){
      let ingredients=recipes[i].ingredients;
      res.innerHTML += `
      <h2>${recipes[i].recipe.label}</h2>
      <img class="image" src="${recipes[i].recipe.image}"/>
      <p>Cautions: ${recipes[i].recipe.cautions}</p>
      <p>Diet Labels: ${recipes[i].recipe.dietLabels}</p>
      <p>Health Labels: ${recipes[i].recipe.healthLabels}</p>
      <div class="btns">
      <button onclick="recipeSubmit('${recipes[i].recipe.label}','${recipes[i].recipe.url}','${ingredients}')">Save Dish</button>
      <button onclick="goTo('${recipes[i].recipe.url}')">View Recipe</button>
      <button onclick="viewIngredients('${recipes[i].recipe.label}')">View Ingredients</button>
      </div>
    `;
    }
  }
}

async function getRecipeList(){
  let url=`${server}/recipe`;
  let token=localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response.json();
    console.log(result);
    console.log(token);
  }catch(e){
    console.log(e);
  }
}


async function getRecipe(name){
  try{
    let response = await fetch(`${server}/recipe/${name}`);
    let data = await response.json();
    //displayIngredients(data.ingredients);
    console.log(data);
  }
  catch(e){
    console.log(e);
  }
}

async function addIngred(url, data){
  let token=localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'POST',
        body: JSON.stringify(data),//convert data to JSON string
        headers: { 'Content-Type':'application/json',
                    'Authorization':`jwt ${token}`}// JSON data
      },
    );//1. Send http request and get response
    
    let result = await response.text();//2. Get message from response
    alert(result);//3. Do something with the message
    console.log(result);
  }catch(error){
    alert(error);
    console.log(error);//catch and log any errors
  }
}

async function getIngredientList(){
  let url=`${server}/ingredients`;
  let token=localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response.json();
    console.log(result);
    console.log(token);
  }catch(e){
    console.log(e);
  }
}

function parseIng(ingredients){

}

async function home(){
  let url=`${server}/home`;
  let token = localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response;
    //console.log(result);
    window.location.href=`${result.url}`;
  }catch(e){
    console.log(e);
  }
}

async function myRecipes(){
  let url = `${server}/myrecipes`;
  let token = localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response;
    window.location.href=`${result.url}`;
  }catch(e){
    console.log(e);
  }
}

async function myIngredients(){
  let url = `${server}/myingredients`;
  let token = localStorage.getItem("access_token");
  try{ 
    let response = await fetch(
      url, 
      {
        method: 'GET',
        headers: {'Content-Type':'application/json',
                  'Authorization':`jwt ${token}`}// JSON data
      },
    );
    let result=await response;
    window.location.replace(result.url);
  }catch(e){
    console.log(e);
  }
}

function logout(){
  localStorage.removeItem("access_token");
  window.location.replace(server);
}

document.forms['signup'].addEventListener('submit',signUpSubmit);
document.forms['login'].addEventListener('submit',logInSubmit);