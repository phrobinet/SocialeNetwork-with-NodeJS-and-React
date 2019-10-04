import React, { Component } from "react";
import { unfollow, follow } from "./apiUser";

class FollowProfileButton extends Component {
    ask = () => {
        this.props.onButtonClick(follow);
        follow(this.props.user,this.props.token, this.props.following)
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-inline-block">
                {!this.props.following ? (
                    <button
                        onClick={this.ask}
                        className="btn btn-success mr-5"
                    >
                        Accepter
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="btn btn-warning mr-5"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
