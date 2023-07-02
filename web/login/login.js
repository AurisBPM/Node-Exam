const form = document.querySelector('form');
const info = document.getElementById('info');

const onLogin = async (payload) => {
    try {
      const response = await fetch(`http://localhost:8080/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      })
     
      return await response.json();
    } catch (err) {
     return err;
    }
  };
  
  form.addEventListener("submit", async (event)=> {
  event.preventDefault();
  
  const payload = {
      email: event.target.email.value,
      password: event.target.password.value,
  };
  
  const userData = await onLogin(payload);

  if(userData.error){
    if(userData.error == "Email or password did not match"){
      info.textContent = userData.error;
      return;
    }
    info.textContent = 'Something went wrong';
    return;
  }
  
  console.log(userData);
  if (userData.token) {
 Cookies.set("token", userData.token, { expires: 0.1 });  
 window.location.replace("../groups/groups.html");

  }
  });