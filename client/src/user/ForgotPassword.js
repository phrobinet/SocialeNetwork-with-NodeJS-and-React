import React, { Component } from "react";
import { forgotPassword } from "../auth";

class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    forgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: "Nous ne connaissons pas cette email" });
            } else {
                console.log(data.message);
                this.setState({ message: "Un mail a été envoyé. Veuillez suivre les instruction pour ré-initialiser votre mot de passe" });
            }
        });
    };

    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Demande pour un nouveau mot de passe</h2>

                {this.state.message && (
                    <h4 className="bg-success">{this.state.message}</h4>
                )}
                {this.state.error && (
                    <h4 className="bg-warning">{this.state.error}</h4>
                )}

                <form>
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Votre adresse mail"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={this.forgotPassword}
                        className="btn btn-primary"
                    >
                        Envoie d'un lien pour votre mot de passe
                    </button>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;