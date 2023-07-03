

const API_URL = `http://localhost:3000/api/main`;



let parent = document.getElementById('premiumuser');

const leadBoard = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/is-premium`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (data.isPremium === true) {
    allUserTotalExpenses()
  } else {
    alert(" you are not a premium user ")
  }
}

// To show alluser tootal expenses
const allUserTotalExpenses = async () => {
  const response = await fetch(`${API_URL}/lead-board`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resultArray = await response.json();
  buildTable(resultArray)
}

// Table 

function buildTable(data) {
  const table = document.getElementById('myTable')

  for (let i = 0; i < data.length; i++) {
    let row = `<tr>
              <td>${data[i].id}</td>
              <td>${data[i].name}</td>
              <td>${data[i].totalamount}</td>
             </tr>`
    table.innerHTML += row
  }
}

leadBoard()