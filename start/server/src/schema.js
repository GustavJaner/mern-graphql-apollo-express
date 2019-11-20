const { gql } = require('apollo-server');

// The schema
const typeDefs = gql`
    # Fetch data
    type Query {
        launches( # replace the current launches query with this one.
            """
            The number of results to show. Must be >= 1. Default = 20
            """
            pageSize: Int
            """
            If you add a cursor here, it will only return results _after_ this cursor
            """
            after: String
        ): LaunchConnection!

        launch(id: ID!): Launch
        me: User
    }

    # Modify data
    type Mutation {
        # if false, booking trips failed -- check errors
        bookTrips(launchIds: [ID!]!): TripUpdateResponse!

        # if false, cancellation failed -- check errors
        cancelTrip(launchId: ID!): TripUpdateResponse!

        login(email: String!): String # login token
    }

    type TripUpdateResponse {
        success: Boolean!
        messages: String
        launches: [Launch] # Always return the data your updating
    }

    # Custom object Types
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String!
        type: String!
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch!]!
    }

    type Mission {
        id: ID!
        missionPatch(mission: String, size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type LaunchConnection { # add this below the Query type as an additional type.
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }
`;

module.exports = typeDefs;
