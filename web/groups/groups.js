const token = Cookies.get("token");
console.log(token);
const form = document.querySelector('form');
const info = document.getElementById('info');


if (!token) {
  window.location.replace("../login/login.html");
}

const myGroups = document.getElementById("my-groups");

const renderGroups = (groups, output) => {
    groups.forEach((group) => {
      const container = document.createElement("div");
      const heading = document.createElement("h4");
      const content = document.createElement("p");
  
      container.classList.add("group");
      heading.textContent = `ID: ${group.group_id}`;
      content.textContent = group.name;
      container.append(heading,content);
      container.addEventListener('click', () => {
       
        window.location.replace("../bills/bills.html?group=" + group.group_id);
        
      });
      output.append(container);
    });
  };

const getUserGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (err) {
      return console.log(err);
    }
  };

const pageLoad = async () => {
    myGroups.innerHTML = "";
    const userGroups = await getUserGroups();
    
    if (userGroups.error) {
      window.location.replace("../login/login.html");
    }
    if ( userGroups.length != 0){
        document.getElementById("groupsInfo").textContent = "Select Your Group"
        renderGroups(userGroups, myGroups);
    } else {
        document.getElementById("groupsInfo").textContent = "You do not have any groups added"
    }
}

  document.addEventListener("DOMContentLoaded", async () => {
  
    pageLoad();
  });



  const registerAccount = async (payload) => {
        try {
            const token = Cookies.get("token");
            console.log(token);
          const response = await fetch(`http://localhost:8080/accounts`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          })
         
          return await response.json();
        } catch (err) {
         return console.log(err);
        }
  };

if (form){
    form.addEventListener('submit', async (event) => {
    event.preventDefault();
    info.textContent = '';

    const groupId = event.target.group.value;

    console.log(groupId);

    const payload = {
        group_id: groupId
      };

      const request = await registerAccount(payload);
      if(request.error){
        if(request.error == "You are already in this group"){
          info.textContent = request.error;
          return;
        }
        info.textContent = 'Something went wrong';
        return;
      }
      pageLoad();
    });
};