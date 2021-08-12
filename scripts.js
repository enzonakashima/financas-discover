const Modal = {
    toggle() {
        //Adicionar a classe active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .toggle('active');
            
    }    
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50004, //-500,00
        date: '10/01/2021'
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
    {
        id: 4,
        description: 'Celular',
        amount: -400000,
        date: '23/01/2021'
    },
    {
        id: 5,
        description: 'Salário',
        amount: 300000,
        date: '24/01/2021'
    }

];

const Transaction = {
    all: transactions,
    add(transaction){
        Transaction.all.push(transaction);
        console.log(Transaction.all);
    },
    incomes() {
        let income = 0;
        //pegar todas as transações
        //para cada uma, se for > 0, somar a uma variável
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income = income + transaction.amount; 
            };
        });


        return income;//somar as entradas
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense = expense + transaction.amount;
            }
        });
        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

//Substituir os dados do html pelos dados do js

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);
        DOM.transactionsContainer.appendChild(tr)
    },  

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="assets/minus.svg" alt="Remover transação"></td>
        
        `
        return html;
        
    },

    updateBalance() {
        document.getElementById('income-display').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expense-display').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('total-display').innerHTML = Utils.formatCurrency(Transaction.total());
    }
}           

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, ""); //Muda para string e acha todos que não são números
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        console.log(signal + value);
        return signal + value;
    }
}

const App = {
    //init() {};
    //reload() {};
}

/*
DOM.addTransaction(transactions[0]); 

for(let i in transactions) {
    DOM.addTransaction(transactions[i]);
}
ou forEach
*/

Transaction.add({
    id: 38,
    description: 'Alo',
    amount: 100,
    date: '24/02/2021'
})

transactions.forEach(function(transaction){DOM.addTransaction(transaction)});

DOM.updateBalance();