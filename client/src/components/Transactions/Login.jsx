import { useState, useEffect } from "react";
import useEth from "../../EthContext/useEth";
import Transactions from "./Transactions";
import './login.css';


function Login() {
    const [state, setState] = useState({ firstName: "", lastName: "", isLogged: false });
    const { state: ethState } = useEth();
    const logUser = async (evt) => {
        if (evt !== undefined) {
            evt.preventDefault();
        }

        let isLogged = evt !== undefined;
        if (!(await ethState.contract.methods.isUserRegistered(ethState.accounts[0]).call())) {
            if (evt !== undefined) {
                await ethState.contract.methods.addPerson(state.firstName, state.lastName).send({ from: ethState.accounts[0] });
            }
        }
        else if (evt === undefined) {
            isLogged = true;
        }

        setState({ firstName: state.firstName, lastName: state.lastName, isLogged: isLogged });
    }

    useEffect(() => {
        if (ethState.accounts !== null && ethState.accounts.length > 0) {
            logUser();
        }
    }, [ethState.accounts]);

    const handleChangeFirstName = async (evt) => {
        evt.preventDefault();
        setState({
            firstName: evt.target.value,
            lastName: state.lastName,
            isLogged: false
        });
    }


    const handleChangeLastName = async (evt) => {
        evt.preventDefault();
        setState({
            firstName: state.firstName,
            lastName: evt.target.value,
            isLogged: false
        })
    }

    if (state.isLogged) {
        return (
            <div>
                <Transactions></Transactions>
            </div>
        )
    }
    return (
        <div className="container">
            <div className="form">
                <h2 className="header">Crypto Transfer</h2>
                <div className="form__div">
                    <input type="text"
                        value={state.firstName}
                        onChange={handleChangeFirstName} required />
                    <label className="form__label">First Name</label>
                </div>
                <div className="form__div">
                    <input type="text"
                        value={state.lastName}
                        onChange={handleChangeLastName} required />
                    <label className="form__label">Last Name</label>
                </div>
                <div className="form__div">
                    <input className="submite" type="submit" onClick={logUser} />
                </div>
            </div>
        </div>
    );
}

export default Login;
