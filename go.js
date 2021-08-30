const { MongoClient } = require('mongodb')



const databaseName = 'realtime-chat-app'
const uri = `mongodb+srv://Mike-O:42M3cipTY2Bbeogg@cluster0.wt8rx.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri)

const runServer = async () => {
    await mongoClient.connect()
    console.log('Connected to server...')

    const database = mongoClient.db(databaseName)
    const chats = database.collection('chats')

    chats.find({ room: 'Sports Chat' }).limit(200).toArray((error, res) => {
        if (error) {
            throw error
        }
        console.log(res)
    })
}
runServer()