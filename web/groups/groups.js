const token = Cookies.get("token");

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
      heading.textContent = `ID: ${group.id}`;
      content.textContent = group.name;
      container.append(heading,content);
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

  document.addEventListener("DOMContentLoaded", async () => {
    const userGroups = await getUserGroups();
    console.log(userGroups);
    renderGroups(userGroups, myGroups);
    if (userGroups.error) {
      window.location.replace("../login/login.html");
    }
  
  });