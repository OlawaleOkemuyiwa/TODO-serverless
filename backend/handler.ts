'use strict'

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v2.21.1! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  }
}
