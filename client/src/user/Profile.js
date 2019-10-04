import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read, follow } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import FriendProfileButton from "./FriendProfileButton";
import ProfileTabs from "./ProfileTabs";
import NewPost from '../post/NewPost';
import { listByUser } from '../post/apiPost';
class Profile extends Component {

    
    constructor() {
        super();
        this.state = {
            users: [],
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: [],
            toFriend: []
        };
    }


    // check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };

    clickFriendButton = (person, i) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        console.log('person ', person)
        console.log('i: ', i)
        console.log('userId: ', userId)
        console.log('token: ', token)

        follow(userId, token, person._id).then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    let toFriend = this.state.user.following;
                    toFriend.splice(i, 1);
                    this.setState({
                        following: toFriend
                    })
                }
            })
    };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following });
                this.loadPosts(data._id)
            }
        });
    };


    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
                
            }
        });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    renderFollowing = user => (
        <div className="row">
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
                            {/* <FriendProfileButton
                                user={user}
                                token={isAuthenticated().token}
                                following={person._id}
                                onButtonClick={this.clickFriendButton}
                            /> */}
                            <button onClick={() => this.clickFriendButton(person, i)} className="btn btn-success">Accepter</button>
                            <button className="btn btn-warning">Ignorer</button>
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { redirectToSignin, user, posts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                user._id
            }?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile de {user.pseudo}</h2>
                <div className="row">
                    <div className="col-md-2">
                        <img
                            style={{ height: "150px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name}
                        />
                    </div>

                    <div className="col-md-5">
                        <div className=" mt-2">
                            <p><span className="lead">Salut </span>  {user.name} {user.lastname}</p>
                            <p><span className="lead">Email :</span>  {user.email}</p>
                            <p><span className="lead">Age :</span>  {user.age}</p>
                            <p><span className="lead">Genre :</span>  {user.genre}</p>
                            <p><span className="lead">Ville :</span>  {user.city}</p>
                            <p><span className="lead">Loisir :</span>  {user.hobbies}</p>
                            
                            <p><span className="lead">Inscription :</span>{` ${new Date(
                                user.created
                            ).toDateString()}`}</p>
                            <hr />
                        <p className="lead"><span className="lead">A propos de moi : </span>{user.about}</p>
                        <hr />
                        </div>

                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id  ? (
                            <div className="d-inline-block">
                                
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${user._id}`}
                                >
                                    Editer le profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <FollowProfileButton
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton}
                            />
                            
                        )}

                        <div>
                            {isAuthenticated().user &&
                                isAuthenticated().user.role === "admin" && (
                                    <div className="card mt-5">
                                        <div className="card-body ">
                                            <h5 className="card-title">
                                                Admin
                                            </h5>
                                            <p className="mb-2 text-danger">
                                                Modifier/Supprimer en tant qu'admin
                                            </p>
                                            <Link
                                                className="btn btn-raised btn-success mr-5"
                                                to={`/user/edit/${user._id}`}
                                            >
                                                Editer le profile
                                            </Link>
                                            <DeleteUser userId={user._id} />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="col-md-5">
                    <h3 className="text-primary">Mes messages</h3>
                    
                        {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id && isAuthenticated().user.role !== "admin" ? (
                                <>
                                <NewPost writedId={user._id} userId={this.props.match.params.userId} />
                            
                        </>
                        ) : (
                            <div className="d-inline-block">
                            <p>...</p>
                        </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">                     

                        {/* <ProfileTabs
                            user={user}
                            posts={posts}
                        /> */}
                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id && isAuthenticated().user.role !== "admin" ? (
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
                                    {this.renderFollowing(user)}

                                </div>

                                <div className="col-md-4">
                                <div>
                                <h3 className="text-primary">Mes messages</h3>
                                <hr />
                                {posts.map((post, i) => (
                                    <div key={i}>
                                        <div>
                                            <Link to={`/post/${post._id}`}>
                                                <div>
                                                <p className="text-info"><span className="text-primary ">{post.title}</span>  Posté par { post.postedBy.name}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                            ))}
                        </div>

                                </div>
                            </div>
                        </div>                            
                        ) : (                            
                        <div className="d-inline-block">
                            <p>...</p>
                        </div>
                        )}
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
