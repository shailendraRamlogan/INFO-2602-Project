let url='http://127.0.0.1:8080';
let server='http://127.0.0.1:8080';
let message='';
let token='';

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
    
    let result = await response.text();//2. Get message from response
    message=JSON.parse(result);
    if(message.hasOwnProperty('access_token')){
      token=message.access_token;
      console.log(token);
      homePage(server, token);
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
    console.log(result);
    window.location.replace(result.url);
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

async function addIngred(url, data){
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

document.forms['signup'].addEventListener('submit',signUpSubmit);
document.forms['login'].addEventListener('submit',logInSubmit);