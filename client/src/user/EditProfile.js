import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./apiUser";
import { Redirect } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            lastname: "",
            email: "",
            genre: "",
            pseudo: "",
            city: "",            
            age: "",
            about: "",
            hobbies: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
        };
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data._id,
                    name: data.name,
                    lastname: data.lastname,
                    email: data.email,
                    genre: data.genre,
                    pseudo: data.pseudo,
                    city: data.city,
                    age: data.age,
                    hobbies: data.hobbies,
                    error: "",
                    about: data.about
                });
            }
        });
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, fileSize, lastname, age, city, genre, hobbies, about,  } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (name.length === 0) {
            this.setState({ error: "Le nom es obligatoire", loading: false });
            return false;
        }
        if (lastname.length === 0) {
            this.setState({ error: "Le prénom est obligatoire", loading: false });
            return false;
        }
        if (age.length <=2) {
            this.setState({ error: "Il faut au moins avoir plus de 10 ans", loading: false });
            return false;
        }
        if (city.length === 0) {
            this.setState({ error: "La ville est obligatoire", loading: false });
            return false;
        }
        if (genre.length === 0) {
            this.setState({ error: "Le genre est obligatoire", loading: false });
            return false;
        }
        if (hobbies.length === 0) {
            this.setState({ error: "Vous n'avez pas de loisir dans la vie", loading: false });
            return false;
        }
        if (about.length === 0) {
            this.setState({ error: "Au moins un mot sur vous", loading: false });
            return false;
        }
        // email@domain.com
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({
                error: "A valid Email is required",
                loading: false
            });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData).then(data => {
                if (data.error){
                        this.setState({ error: data.error })
                } else if (isAuthenticated().user.role === "admin") {
                    this.setState({ redirectToProfile: true})
                } else
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        });
                    });
            });
        }
    };

    signupForm = (name, lastname, pseudo, email, age, genre, about,  hobbies, city) => (
        <form>
                <div className="form-group">
                    <label className="text-muted">Profile Photo</label>
                    <input
                        onChange={this.handleChange("photo")}
                        type="file"
                        accept="image/*"
                        className="form-control"
                    />
                </div>
                <div className="form-group ">
                    <label className="text-muted ">Nom</label>
                    <input
                        onChange={this.handleChange("name")}
                        type="text"
                        className="form-control"
                        value={name}
                    />
                </div>
                <div className="form-group ">
                    <label className="text-muted ">Prenom</label>
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
                <label className="text-muted">Age</label>
                <input
                    onChange={this.handleChange("age")}
                    type="number"
                    className="form-control"
                    value={age}
                />
            </div>
            <div class="form-group">
                <label className="text-muted">Genre</label>
                <select 
                    class="form-control" 
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
                    onChange={this.handleChange("hobbie")}
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
                Update
            </button>
        </form>
    );

    render() {
        const {
            id,
            name,
            email,
            redirectToProfile,
            error,
            loading,
            genre,
            pseudo,
            city,
            age,
            lastname,
            hobbies,
            about
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />;
        }

        const photoUrl = id
            ? `${
                process.env.REACT_APP_API_URL
            }/user/photo/${id}?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}

                <img
                    style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                    alt={name}
                />

                {this.signupForm(name, lastname, pseudo, email, age, genre, about, hobbies, city )}
            </div>
        );
    }
}

export default EditProfile;
