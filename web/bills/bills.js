 const parameters = new URLSearchParams(window.location.search);
 const groupId = parameters.get('group');
 const token = Cookies.get("token");
 const billsTable = document.getElementById("bills-table");
 const billsTbody = document.getElementById("bills-tbody");
 const form = document.querySelector('form');

console.log(token);

if (!token) {
  window.location.replace("../login/login.html");
}

const renderBills = (bills, output) => {
    bills.forEach((bill) => {
      const row = document.createElement("tr");
      const cellId = row.insertCell(-1);
      const cellDesc = row.insertCell(-1);
      const cellAmount = row.insertCell(-1);
    
      cellId.textContent = bill.id;
      cellDesc.textContent = bill.description;
      cellAmount.textContent = "$" + bill.amount;

      output.append(row);
    
    });
  };

    const getGroupBills = async () => {
        try {
          const response = await fetch(`http://localhost:8080/bills/` + groupId, {
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
        billsTbody.innerHTML = "";
        billsTable.style.display = "none";
        const groupBills = await getGroupBills();
        console.log(groupBills);
        if (groupBills.error) {
          window.location.replace("../login/login.html");
        }
        if ( groupBills.length != 0){
            document.getElementById("billsInfo").textContent = "Group's Bills:";
            renderBills(groupBills, billsTbody);
            billsTable.style.display = "block";
        } else {
            document.getElementById("billsInfo").textContent = "There are no bills in this group";
        }
    }



    document.addEventListener("DOMContentLoaded", async () => {
        pageLoad();
      
      });

      const registerBill = async (payload) => {
        try {
            const token = Cookies.get("token");
            console.log(token);
          const response = await fetch(`http://localhost:8080/bills`, {
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

    const description = event.target.description.value;
    const amount = event.target.amount.value;

    const payload = {
        group_id: groupId,
        description: description,
        amount: amount
      };

      const request = await registerBill(payload);
      if (request.affectedRows == 1){
        pageLoad();
      }
    
    });
};