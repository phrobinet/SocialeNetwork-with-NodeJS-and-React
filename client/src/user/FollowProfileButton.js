import React, { Component } from "react";
import { unfollow, askFriend } from "./apiUser";
// import { Redirect, Link } from 'react-router-dom';

class FollowProfileButton extends Component {
    ask = () => {
        this.props.onButtonClick(askFriend);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        const userId = this.props.userId;
        return (
            <div className="d-inline-block">
                {!this.props.following ? (
                    <button
                        onClick={this.ask}
                        className="btn btn-success btn-raised mr-5"
                        to={`/user/${userId}`}
                    >
                        Demander en ami
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="btn btn-warning btn-raised"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
