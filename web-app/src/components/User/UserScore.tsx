import React from 'react';

/* the display of the user score as text */
const UserScore: React.FC<{
    score: {
        stars: number;
        rank: number;
    };
}> = (props) => {
    return (
        <>
            R{props.score.rank} - {props.score.stars}<span role="img" aria-label="star">⭐</span>
        </>
    )
}

export default UserScore;
