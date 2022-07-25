import useEth from "../../EthContext/useEth";
import { useEffect, useState } from "react";
import transactionState from "../../EthContext/contractCall";
import 'bootstrap/dist/css/bootstrap.min.css';
import Transfer from "./Transfer";

function Transactions() {
    const [state, setState] = useState(transactionState);
    const { state: ethState } = useEth();
    ethState.contract.events.TransactionCreated({}, function (error, event) {
        getState();
    })
        .on('data', function (event) {
        })
        .on('changed', function (event) {
        })
        .on('error', console.error);
    ethState.contract.events.UserAdded({}, function (error, event) { })
        .on('data', function (event) {
            getState();
        })
        .on('changed', function (event) {
        })
        .on('error', console.error);
    const getState = async () => {
        if (ethState.contract !== null) {
            let people = []

            for (let i = 0; i < await ethState.contract.methods.userCount().call(); i++) {
                let currPerson = await ethState.contract.methods.userMapping(i).call();
                let person = {
                    address: currPerson[0],
                    id: i,
                    firstName: currPerson[1],
                    lastName: currPerson[2],
                    balance: currPerson[3]
                }
                people.push(person)

            }
            let transactions = [];
            for (let i = 0; i < await ethState.contract.methods.transactionCount().call(); i++) {
                let currTransaction = await ethState.contract.methods.transactionMapping(i).call();
                let transaction = {
                    sender: currTransaction[0],
                    receiver: currTransaction[1],
                    timestamp: currTransaction[2],
                    amount: currTransaction[3]
                }
                transactions.push(transaction)
            }

            setState({ people: people, transactions: transactions });
        }
    }
    useEffect(() => {
        if (ethState.contract !== null) {
            getState();
        }
    }, [ethState.artifact]);

    const tableRows = [];
    for (let i = 0; i < state.people.length; i++) {
        let rowStyle = "";
        if (state.people[i].address === ethState.accounts[0]) {
            rowStyle = "table-active";
        }
        tableRows.push(
            <tr key={i} className={rowStyle}>
                <td>{state.people[i].id}</td>
                <td>{state.people[i].firstName}</td>
                <td>{state.people[i].lastName}</td>
                <td>{state.people[i].balance}</td>
            </tr>
        )
    }

    const transactionsTable = [];
    for (let index = 0; index < state.transactions.length; index++) {
        transactionsTable.push(
            <tr key={index}>
                <td>{state.transactions[index].sender}</td>
                <td>{state.transactions[index].receiver}</td>
                <td>{state.transactions[index].timestamp}</td>
                <td>{state.transactions[index].amount}</td>
            </tr>
        );
    }


    return (
        <div className="container container-fluid">
            <div className="col">
                <div className="row">
                    <span className="col">
                        <div className="container">
                            <h1>Users</h1>
                            <table className="table-hover table table table-dark">
                                <thead className="">
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows}
                                </tbody>
                            </table>
                        </div>
                    </span>
                    <span className="col">
                        <div className="container">
                            <h1>Transactions</h1>
                            <table className="table table-dark">
                                <thead className="">
                                    <tr>
                                        <th>Sender Id</th>
                                        <th>Receiver Id</th>
                                        <th>Timestamp</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionsTable}
                                </tbody>
                            </table>
                        </div>
                    </span>
                </div>
                <div className="row">
                    <div className="col">
                        <Transfer></Transfer>
                    </div>
                    <div className="col">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
