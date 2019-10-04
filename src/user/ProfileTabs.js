import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.jpg";
import { follow } from './apiUser';

class ProfileTabs extends Component {


    render() {
        const { user,  posts } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-primary">Mes Amis</h3>
                        <hr />
                        {user.followers.map((person, i) => (
                            <div key={i}>
                                <div>
                                    {/* <Link to={`/user/${person._id}`}> */}
                                        <img
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid black"
                                            }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${person._id}`}
                                            alt={person.name}
                                        />
                                        <div>
                                            <p className="lead">
                                                {person.name } {person.lastname}
                                            </p>

                                        </div>
                                    {/* </Link> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-primary">Demande d'ajout</h3>
                        <hr />
                        {user.following.map((person, i) => (
                            <div key={i}>
                                <div>
                                        <img
                                            style={{
                                                borderRadius: "50%",
                                                border: "1px solid black"
                                            }}
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            onError={i =>
                                                (i.target.src = `${DefaultProfile}`)
                                            }
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                            }/user/photo/${person._id}`}
                                            alt={person.name}
                                        />
                                        <div>
                                            <p className="lead">
                                                {person.name } {person.lastname}
                                            </p>
                                            <button
                                                onClick={this.followClick}
                                                className="btn btn-success mr-5"
                                            >
                                                Accepter
                                            </button>
                                            <button class="btn btn-warning">Ignorer</button>
                                            
                                        </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-primary">Posts</h3>
                        <hr />
                        {posts.map((post, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/post/${post._id}`}>
                                        <div>
                                            <p className="lead">
                                                {post.title}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;
