class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === '' || value < 0) {
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p>Value cannot be empty or negative</p>`;
      const self = this;
      // Within the setTimeout function this refers to the window object, 
      // not the constructor. Hence we assigned the value of this before setTimeout 
      // to another constant to save its functionality.
      setTimeout(function () {
        self.budgetFeedback.classList.remove('showItem');
      }, 4000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  //show balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balanceAmount.classList.remove('showGreen', 'showBlack');
      this.balanceAmount.classList.add('showRed');
    } else if (total > 0) {
      this.balanceAmount.classList.add('showGreen');
      this.balanceAmount.classList.remove('showRed', 'showBlack');
    } else {
      this.balanceAmount.classList.remove('showGreen', 'showRed');
      this.balanceAmount.classList.add('showBlack');
    }

  }
  // submit expense form
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Incorrect data passed</p>`;
      const self = this;
      setTimeout(function () {
        self.expenseFeedback.classList.remove('showItem');
      }, 4000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = '';
      this.amountInput.value = '';
      //Create an object to contain all information from the form
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount,
      }
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  // add expense
  addExpense(exp) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">${exp.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${exp.amount}</h5>

    <div class="expense-icons list-item">

     <a href="#" class="edit-icon mx-2" data-id="${exp.id}">
      <i class="fas fa-edit"></i>
     </a>
     <a href="#" class="delete-icon" data-id="${exp.id}">
      <i class="fas fa-trash"></i>
     </a>
    </div>
   </div>
`;
    this.expenseList.appendChild(div);


  }

  //total expense
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function (acc, curr) {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  //edit expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //element removed from DOM
    this.expenseList.removeChild(parent);
    //id found in array to remove
    let expense = this.itemList.filter(function (item) {
      return item.id === id;
    });
    //show the element to edit using the previous array obtained from filtering
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from list
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();

  }
  //delete expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //element removed from DOM
    this.expenseList.removeChild(parent);
    //remove from list
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();

  }

}

function eventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //New instance of UI of class
  const ui = new UI();

  //budget form submit
  budgetForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    ui.submitBudgetForm();
  });

  //expense form submit
  expenseForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    ui.submitExpenseForm();
  });


  //expense list click: editing, deleting etc.
  expenseList.addEventListener('click', function (evt) {
    if (evt.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(evt.target.parentElement);
    } else if (evt.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(evt.target.parentElement);
    }
  });

}

document.addEventListener('DOMContentLoaded', function () {
  eventListeners();
})