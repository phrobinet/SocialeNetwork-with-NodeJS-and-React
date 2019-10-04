import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            status: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { title, body,status, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "La taille de l'image doit être de moins d'1Mo",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0 || status.length === 0) {
            this.setState({ error: "Tous les champs sont obligatoire", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        title: "",
                        body: "",
                        loading: false,
                        // redirectToProfile: true
                    });
                    console.log("New Post: ", data);
                }
            });
        }
    };

    newPostForm = (title, body, status) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Une photo?</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Titre</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Message</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>
            <div>
            <label className="text-muted">Choisissez Privé / Public</label>
                <select 
                    className="form-control" 
                    value={status}
                    onChange={this.handleChange("status")}
                    type="text">
                <option></option>
                <option>Privé</option>
                <option>Public</option>
                </select>

            </div>
            <div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary mt-2"
            >
                Create Post
            </button>
            </div>
            

        </form>
    );

    render() {
        const {
            title,
            body,
            photo,
            user,
            error,
            loading,
            status,
            redirectToProfile
        } = this.state;
        const writedBy = this.props.writedBy
        const userId = this.props.userId

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">
                {/* <h2 className="mt-5 mb-5">Create a new post</h2> */}
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

                {this.newPostForm(title, body, status)}
            </div>
        );
    }
}

export default NewPost;
