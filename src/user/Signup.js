import React, { Component } from "react";
import { signup } from "../auth";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            lastname: "",
            genre: "",
            pseudo: "",
            city: "",            
            age: "",
            about: "",
            hobbies: "",
            email: "",
            password: "",
            error: "",
            open: false
        };
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = event => {
        event.preventDefault();
        const { name, email, password, lastname, genre, pseudo, city, age, about , hobbies} = this.state;
        const user = {
            name,
            lastname,
            genre,
            pseudo,
            city,            
            age,
            about,
            hobbies,
            email,
            password
        };
        // console.log(user);
        signup(user).then(data => {
            if (data.error) {
                this.setState({ error: data.error }); 
                console.log('error: ', data.error)
            } else { 
                console.log('ici');
                this.setState({
                    name: "",
                    lastname: "",
                    genre: "",
                    pseudo: "",
                    city: "",            
                    age: "",
                    about: "",
                    hobbies: "",
                    email: "",
                    password: "",
                    error: "",
                    fileSize: 0,
                    open: true
                });
            }
        });
    };

    signupForm = (name, email, password, lastname, genre, pseudo, city, age, about, hobbies ) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Nom</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Prenom</label>
                <input
                    onChange={this.handleChange("lastname")}
                    type="text"
                    className="form-control"
                    value={lastname}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Pseudo</label>
                <input
                    onChange={this.handleChange("pseudo")}
                    type="text"
                    className="form-control"
                    value={pseudo}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Mot de passe</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Age</label>
                <input
                    onChange={this.handleChange("age")}
                    type="number"
                    className="form-control"
                    min="18"
                    value={age}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Genre</label>
                <select 
                    className="form-control" 
                    value={genre}
                    onChange={this.handleChange("genre")}
                    type="text">
                <option></option>
                <option>Femme</option>
                <option>Homme</option>
                </select>
            </div>
            <div className="form-group">
                <label className="text-muted">A propos de moi</label>
                <textarea
                    onChange={this.handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Loisir</label>
                <textarea
                    onChange={this.handleChange("hobbies")}
                    type="text"
                    className="form-control"
                    value={hobbies}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">City</label>
                <input
                    onChange={this.handleChange("city")}
                    type="text"
                    className="form-control"
                    value={city}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Soumettre
            </button>
        </form>
    );

    render() {
        const { name, email, password, error, open } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Inscription</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                <div
                    className="alert alert-info"
                    style={{ display: open ? "" : "none" }}
                >
                    Votre compte est créé. Vous pouvez vous connecter{" "}
                    {/* <Link to="/signin">Sign In</Link>. */}
                </div>

                <div style={{ display: open ? "none" : "" }}>

                {this.signupForm(name, email, password)}

                </div>

            
            

                
            </div>
        );
    }
}

export default Signup;
