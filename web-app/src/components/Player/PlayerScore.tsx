import React from 'react';

const PlayerScore: React.FC<{
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

export default PlayerScore;
