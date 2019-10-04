import React, { Component} from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/mountain.jpg";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    }

    renderPosts = posts => {

        return (
            <div className="row">
            {posts.filter(post => post.status !== "Privé").map((post, i) => {
                const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                const bouton = isAuthenticated() ? <Link to={`/post/${post._id}`}  className="btn btn-raised btn-primary btn-sm">En savoir plus</Link> : "";
                const posterName = post.postedBy ? post.postedBy.name : " Unkown"

                return (
                    <div className="card col-md-4" key={i}>
                        <div className="card-body">
                            <img 
                                src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} 
                                alt={post.title} 
                                onError={i => (i.target.src = `${DefaultPost}`)} 
                                className="img-thunbnail mb-3" 
                                style={{height: "200px", width: "100%"}} 
                            />
                            <h5 className="card-title">{post.title}</h5>
                            <p className="card-text">{post.body.substring(0, 100)}</p>
                            <br/>
                            <p className="font-italic mark">
                                Posté par <Link to={`${posterId}`}>{posterName}</Link> le {new Date(post.created).toDateString()}
                            </p>
                            {bouton}
                        </div>
                    </div>
                )
            })}
        </div>
        )
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{!posts.length ? 'Loading...': 'Les articles publics'}</h2>

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
