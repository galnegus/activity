module.exports = {
    // how often the spinner updates
	FPS: 30,

    // how fast the spinner spins (max velocity)
	LOOPS_PER_SECOND: 2,

    // acceleration/deceleration time (in approxemate seconds)
    ACCELERATION_TIME: 2,
    DECELERATION_TIME: 5,

	// spinning-text position boundaries
    MIN_POSITION: 0,
    MAX_POSITION: 100,
    MIDDLE_POSITION: 50,

    // ratio between container size and position boundaries
    STEP: 10, 

    // color interpolation (use hsl)
    FROM_COLOR: 'hsl(48, 100%, 50%)',
    TO_COLOR: 'hsl(29, 100%, 50%)',
};
