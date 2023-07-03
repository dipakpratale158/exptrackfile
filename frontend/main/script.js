console.log(" Hello  I am Expenses Manager ");
const API_URL = `http://localhost:3000/api/main`;


// TO add the expenses
async function addExpenses() {
  const userData = {};
  userData.amount = document.getElementById("amount").value;
  userData.item = document.getElementById("item").value;
  userData.category = document.getElementById("table").value;
  // TAking token from localstorage
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/savedata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Send token in header
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  let data = await response.json();
  console.log(data);
  showAllExpensesOnScreen();
  showTotalExpenses();
  amount.value = "";
  item.value = "";
}
// To display all expences of user  
async function showAllExpensesOnScreen() {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/main/all-expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Check the response status code
  if (response.status === 401) {
    const loginPageLink = "http://127.0.0.1:5500/frontend/login/login.html";
    const confirmMessage = `Please click OK to go to the login page.`;

    if (window.confirm(confirmMessage)) {
      window.location.href = loginPageLink;
    }

    return;
  }

  const {result} = await response.json();

  const itemList = document.getElementsByClassName("list-group")[0];

  // Clear the existing content
  itemList.innerHTML = "";

  result.forEach((item) => {
    const listItem = document.createElement("li");

    listItem.className = "list-group-item";

    listItem.style.backgroundColor = "#6dbd9f4d";

    listItem.style.color = "#000000";

    listItem.textContent = `Item Name : ${item.item} , Item Price : ${item.amount}    Category  : ${item.category} `;

    const editButton = document.createElement("btn");

    editButton.className = "btn btn-info";

    editButton.style.float = "right";

    editButton.textContent = "Edit";

    editButton.addEventListener("click", () =>
      editItemDetails(item.id, item.item, item.amount, item.category)
    );

    const deleteButton = document.createElement("button");

    deleteButton.className = "btn btn-danger";

    deleteButton.style.float = "right";

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => deleteItem(item.id));

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    itemList.appendChild(listItem);
  });
}
//  TO update existing expences
async function editItemDetails(id, itemvalue, itemprice, itemcategory) {
  const item = prompt(" Change The Item name ", itemvalue);
  const amount = prompt(" Change The Item Price ", itemprice);
  const category = prompt(" Change The Item Category ", itemcategory);
  const updatedDetails = {
    id,
    item,
    amount,
    category,
  };
  const response = await fetch(`${API_URL}/update-expenses`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedDetails),
  });
  showAllExpensesOnScreen();
  showTotalExpenses();
}

// Delete function
async function deleteItem(id) {
  const confirmMessage = `Really want to delete.`;
  if (window.confirm(confirmMessage)) {
    const response = await fetch(`${API_URL}/delete-expenses`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    console.log(" User deleted", response);
    showAllExpensesOnScreen();
    showTotalExpenses();
  } else {
    return;
  }
}

// Show total expenses
async function showTotalExpenses() {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:3000/api/main/total-expenses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  let sum = 0;
  data.forEach((result) => {
    sum += parseInt(result.amount);
  });
  document.getElementById(
    "totalAmount"
  ).textContent = `Total Expenses : ${sum}`;
  console.log("Total expenses:", sum);
}
// 
const premiumFeature = async () => {
  const headerName = document.getElementById("header-title");
  let premiumDiv = document.getElementById('premiumdiv');
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/single-user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  headerName.innerText = `${data.name}'s Expenses Tracker`;
  if (data.isPremium === true) {
    let premiumUser = document.createElement('button');
    premiumUser.className = "btn btn-primary premium-button";
    premiumUser.id = "premium-user";
    premiumUser.textContent = "Premium User";
    premiumUser.onclick = premiumUserButton;
    premiumDiv.appendChild(premiumUser);

  } else {
    let buypremium = document.createElement('button');
    buypremium.className = "btn btn-primary premium-button";
    buypremium.id = "premium-button";
    buypremium.textContent = " Buy Premium ";
    buypremium.onclick = buyPremium;
    premiumDiv.appendChild(buypremium);
  }
}
// To buy a premium membership
const buyPremium = async () => {
  try {
    const token = localStorage.getItem("token");
    const data = await fetch("http://localhost:3000/api/razorpay/key");
    const { key } = await data.json();
    const response = await fetch(
      "http://localhost:3000/api/razorpay/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { details } = await response.json();

    console.log("Order details : ", details);

    const options = {
      key: key,
      currency: "INR",
      description: "Test Transaction",
      image:
        "https://clipartix.com/wp-content/uploads/2016/09/Cartoons-clipart-image-1.jpg",
      order_id: details.id,
      callback_url: `http://localhost:3000/api/razorpay/verify?token=${token}`,
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (err) {
    console.log(err);
  }
}
let premiumUserButton = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/is-premium`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const leadboardLink = "http://127.0.0.1:5500/frontend/leadboard/leadbord.html";
  const data = await response.json();
  if (data.isPremium === true) {
    window.location.href = leadboardLink;
  } else {
    alert("You are not a premium user");
  }
}

const botam = document.getElementById("btn");
botam.addEventListener("click", (e) => {
  e.preventDefault();
  addExpenses();
}); 
showAllExpensesOnScreen();
showTotalExpenses();
premiumFeature();