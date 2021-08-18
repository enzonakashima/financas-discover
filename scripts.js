const Modal = {
    toggle() {
        //Adicionar a classe active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .toggle('active');
            
    }    
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("financas:transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("financas:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction);
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload();
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr)
    },  

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação"></td>
        
        `
        return html;
        
    },

    updateBalance() {
        document.getElementById('income-display').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expense-display').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('total-display').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}           

const Utils = {
    formatAmount(value) {
        //value = Number(value) * 100;
        value = Number(value.replace(/\,\./g,"")) * 100;
        return value; 
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`; //transforma em string
    },

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

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues();
        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Preencha todos os campos.")
            }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields();
            // formatar os dados
            const transaction = Form.formatValues();
            // salvar
            Transaction.add(transaction);
            Form.clearFields();
            Modal.toggle();
        } catch (error){
            alert(error.message)
        }

    }
}

const App = {
    init() {        
        //Transaction.all.forEach(transaction, index => {DOM.addTransaction(transaction, index)});
        Transaction.all.forEach(DOM.addTransaction);
        DOM.updateBalance();
        Storage.set(Transaction.all);
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();




/*
DOM.addTransaction(transactions[0]); 

for(let i in transactions) {
    DOM.addTransaction(transactions[i]);
}
ou forEach
*/

/*
Transaction.add({
    id: 38,
    description: 'Alo',
    amount: 100,
    date: '24/02/2021'
})

transactions.forEach(function(transaction){DOM.addTransaction(transaction)});

DOM.updateBalance();
*/