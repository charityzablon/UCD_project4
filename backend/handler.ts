"use strict";

module.exports.hello =async (event) =>{

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Go serverless!! Your Function exceuted Successfuly!",
                input: event,
        },

        null,
        2
        ),
    
    };
};
