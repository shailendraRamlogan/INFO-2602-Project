let url='http://0.0.0.0:8080';

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
    postData('http://0.0.0.0:8080/signup',data);
    console.log(data);
}

function logInSubmit(event){
    event.preventDefault();//prevents page redirection
        
    //event target returns the element on which the event is fired upon ie event.target === myForm
   
    //get data from form using elements property
    let myform = event.target.elements;
   
    let data = {
      name: myform['name'].value,
      password: myform['password'].value
    }
   
    //postData(url,data);
    console.log(data);
}

async function postData(url, data){
    try{ 
       let response = await fetch(
         url, 
         {
            method: 'POST',
            body: JSON.stringify(data),//convert data to JSON string
            headers: { 'Content-Type':'application/json' }// JSON data
         },
       );//1. Send http request and get response
       
       let result = await response.text();//2. Get message from response
       alert(result);//3. Do something with the message
    }catch(error){
        console.log(error);//catch and log any errors
    }
}

  document.forms['signup'].addEventListener('submit',signUpSubmit);
  document.forms['login'].addEventListener('submit',logInSubmit);