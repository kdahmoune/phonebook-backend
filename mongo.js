const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5){
    console.log('Please provide the password as an argument: node mongo.js <password> OR node mongo.js <password> <username> <phone number>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://karimdahmoune_db_user:${password}@cluster0.kphtpb8.mongodb.net/?appName=Cluster0`

mongoose
    .connect(url)
    .then(result => {
        const peopleSchema = new mongoose.Schema({
            name: String,
            number: String,
        })

        const People = mongoose.model('People', peopleSchema)

        if (process.argv.length === 3){
            People.find({}).then(result => {
                result.forEach(people => {
                    console.log(`${people.name} ${people.number}`)
                })
                mongoose.connection.close()
            })
        }

        const name = process.argv[3]
        const phone_number = process.argv[4]

        if (process.argv.length === 5){
            const people = new People({
                name: name,
                number: phone_number
            })

            people.save()
            .then(result => {
                console.log(`added ${name} number ${phone_number} to phonebook`)
                mongoose.connection.close()
            })
        }
        console.log('connected')
    })
   
