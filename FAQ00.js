const fs = require('fs');
const file = './QA.json'

export class FAQ {
    json = []

    write(qa){
        this.readFile()
        let id = Number.parse(Date.now())
        JSON.parse(qa)
        qa['id'] = id
        this.json.push()
        console.log("Q&A added.")
        let json = JSON.stringify(this.json)
        this.writeFile(json)
    }

    updateAnswer(id, answer){
        this.readFile()
        for (let i of this.json){
            if (this.json[i].id === id){
                this.json[i].answer = answer
                console.log("Answer updated.")
                let json = JSON.stringify(this.json)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    updateTags(id, tags){
        this.readFile()
        for (let i of this.json){
            if (this.json[i].id === id){
                this.json[i].tags = tags
                console.log("Tags updated.")
                let json = JSON.stringify(this.json)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    delete(id){
        this.readFile()
        for (let i of this.json){
            if (this.json[i].id === id){
                delete this.json[i]
                console.log("Q&A deleted.")
                let json = JSON.stringify(this.json)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    search(filter){
        var jsonFilter = JSON.parse(filter)
        this.readFile()
        if (jsonFilter.criteria === "author"){
            let results = []
            for (let i of this.json){
                if (this.json[i].author === jsonFilter.value){
                    results.push(this.this.json[i])
                }
            }
            console.log("Author search complete.")
            return results
        }
        else if (jsonFilter.criteria === "tags"){
            let results = []
            let filterTags = JSON.stringify(jsonFilter.value).split(', ')
            for (let i of this.json){
                let jsonTags = JSON.stringify(this.json[i]).split(', ')
                for (let j of jsonTags){
                    for (let k of filterTags){
                        if (jsonTags[j] === filterTags[k]){
                            results.push(this.json[i])
                        }
                    }
                }
            }
            console.log("Tag search complete.")
            return results
        }
        else if (jsonFilter.criteria === "date"){
            let results = []
            let startDate = Date.parse(jsonFilter.value.startDate)
            let endDate = Date.parse(jsonFilter.value.endDate)
            for (let i of this.json){
                if (this.json[i].date >= startDate && this.json[i].date <= endDate){
                    results.push(this.json[i])
                }
            }
            console.log("Date search complete.")
            return results
        }
    }

    readFile(){
        fs.readFileSync(file, 'utf8')
        console.log("Read from file.")
    }

    writeFile(json){
        fs.writeFileSync(file, json)
        console.log("Wrote to file.")
    }
}
// Constraints on the Q&A service:
// C1. The class should prevent concurrent read/write problems (e.g. lost updates).
// C2. A Q&A is described by the following attributes: question, answer, tags, author, date and id. You
// can decide how you want to create a unique id (they can look different than the one in the
// example)
// C3. The persistent store for the Q&A service must be a JSON file named QA.json and in the same
// directory as your top-level executable code. We will provide an example for you, and you are free
// to generate and share additional test cases.

// Overall Constraints:
// C4. Put your code in 1 file, FAQ00.js.
// C5. You do not have to write a user interface, but you do have to specify the API for your object
// types in your README.txt, and provide example starting files and a sample test case of each
// service. That is, you must provide examples of how to instantiate your service object, and how to
// invoke it so we can test it manually.
// C6. Your code must be clear and well-written.
// C7. Use the synchronous file I/O features in NodeJS (it makes C1 MUCH easier).
