/// Default Configrations!

module.exports = {
    dark_auction: {
        /// This command can run buy admin only!
        multiple: 2, // x2 when bid multiple of times
        time_remaining: 120, // time remaining to bid
    },
    general: {
        start_money: 5000,

        // Work Command!
        work_money_min: 100,
        work_money_max: 650,
        work_cooldown_time: 300,
        work_multiple: 1, // default 1 = boost money 100%

        // Crime Command!
        crime_money_min: 1500,
        crime_money_max: 3000,
        crime_cooldown_time: 120,
        crime_chance: 40,
        crime_multiple: 1, // default  1 = boost money 100%

        // Rob Command!
        rob_cooldown_time: 600,
        rob_chance: 50, // when you rob fail you lose same target money (You have 100 coin you rob 100,000 coin but you lose here -50,000)

        // Roulette Command!
        roulette_start: 100,

        // Coinflip Command!
        coinflip_start: 100,

        // Vote Command!
        vote_cooldown_time: 3600,
    },
    shop: {
        work_reduce_cost: 20000, // Work reduce cost!
        reduce_work_cooldown: 5, // Reduce 5s every buy
        max_work_cooldown_time: 29, // Max reduce work cooldown time! 30s

        work_multiple: 1, // Multiple x1 every buy
        work_multiple_max: 5, // Max work multiple!
        work_multiple_cost: 10000, // Work multiple cost!

        crime_reduce_cost: 50000, // Crime reduce cost!
        reduce_crime_cooldown: 5, // Reduce 1s every buy
        max_crime_cooldown_time: 59, // Max reduce crime cooldown time 120 - 59 = 61s

        crime_multiple: 1, // Multiple x1 every buy
        crime_multiple_max: 5, // Max crime multiple!
        crime_multiple_cost: 50000, // Crime multiple cost!

        rob_cost: 500000,
        rob_reduce_cost: 100000, // Rob reduce cost!
        reduce_rob_cooldown: 10, // Reduce 10s every buy
        max_rob_cooldown_time: 999, // Max reduce rob cooldown time!
    },
    exchange: {
        three_to_four: 10, // Example need 10 | 3 star exchange to 1 | 4 star
        four_to_five: 10,
        five_to_six: 10,
    },
};
