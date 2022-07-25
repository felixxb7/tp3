import {useState} from "react";
import useEth from "../../EthContext/useEth";

function Transfer() {
    const [state, setState] = useState({to_id: "", amount: ""});
    const {state: ethState} = useEth();
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await ethState.contract.methods.transfer(parseInt(state.to_id)).send({
            from: ethState.accounts[0],
            value: parseInt(state.amount)
        })
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <h2 className="header">Transfer</h2>
                <div className="form__div">
                    <input type="text"
                           value={state.amount}
                           onChange={e => setState({to_id: state.to_id, amount: e.target.value})} required/>
                    <label htmlFor="" className="form__label">Amount</label>
                </div>
                <div className="form__div">
                    <input type="text"
                           value={state.to_id}
                           onChange={e => setState({to_id: e.target.value, amount: state.amount})} required/>
                    <label htmlFor="" className="form__label">Sender Id</label>
                </div>
                <div className="form__div">
                    <input className="submite" type="submit"/>
                </div>
            </form>
        </div>
    )
        ;
}

export default Transfer;
