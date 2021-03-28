/**
 * File: FAQ.js
 * SER 421
 * Lab 2
 *
 * This file implements a Javascript-based question and answer service as specified in Activity 1.
 * The FAQ class contains behaviors for performing CRUD operations on the persistent store (QA.json)
 * and filter-based searching function for one or more criteria.
 *
 * Functions are:
 *    write(qa)
 *    updateAnswer(id, answer)
 *    updateTags(id, tags)
 *    delete(id)
 *    search(criteria, value)
 *    readFile()
 *    writeFile(json)
 */
/* imports */
var fs = require('fs')
/* global variables */
const file = './QA.json'

class FAQ {
    /* class variables */
    json = []
    /* functions */
    /*******************************************************************************************
     * write(qa) - Writes a QA object to the data store.
     *
     * arguments:
     *   string - formatted as JSON and represents one QA object to be written.
     *
     * returns:
     *   nothing
     */
    write(qa){
        this.readFile()
        let id = parseInt(Date.now())
        let qaJson = JSON.parse(qa)
        qaJson['id'] = id
        this.json.push(qaJson)
        console.log("Q&A added.")
        let json = JSON.stringify(this.json, null, 4)
        this.writeFile(json)
    }

    /*******************************************************************************************
     * updateAnswer(id, answer) - Updates the 'answer' value of a QA object.
     *
     * arguments:
     *   number - ID value of QA to be updated.
     *   string - New 'answer' value.
     *
     * returns:
     *   nothing
     */
    updateAnswer(id, answer){
        this.readFile()
        for (let i in this.json){
            if (this.json[i].id === id){
                this.json[i].answer = answer
                console.log("Answer updated.")
                let json = JSON.stringify(this.json, null, 4)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    /*******************************************************************************************
     * updateTags(id, tags) - Updates the 'tags' value of a QA object.
     *
     * arguments:
     *   number - ID value of QA to be updated.
     *   string - New 'tags' value.
     *
     * returns:
     *   nothing
     */
    updateTags(id, tags){
        this.readFile()
        for (let i in this.json){
            if (this.json[i].id === id){
                this.json[i].tags = tags
                console.log("Tags updated.")
                let json = JSON.stringify(this.json, null, 4)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    /*******************************************************************************************
     * delete(id) - Deletes the specified QA object from the data store.
     *
     * arguments:
     *   number - ID value of QA to be deleted.
     *
     * returns:
     *   nothing
     */
    delete(id){
        this.readFile()
        for (let i in this.json){
            if (this.json[i].id === id){
                this.json.splice(i, 1)
                console.log("Q&A deleted.")
                let json = JSON.stringify(this.json, null, 4)
                this.writeFile(json)
                return
            }
        }
        console.log("Q&A not found.")
    }

    /*******************************************************************************************
     * search(criteria, value) - Searches the data store for the specified criteria and
     * value(s).
     *
     * arguments:
     *   Array - One or more criteria to use as filter
     *   Array - One or more values to search based on filter(s)
     *
     * returns:
     *   Set - Unique set of QA objects that meet the search criteria.
     */
    search(criteria, value){
        this.readFile()
        let results = []
        for(let c in criteria) {
            if (criteria[c] === "author") {
                for (let i in this.json) {
                    for (let j in value[c]) {
                        if (this.json[i].author === value[c]) {
                            results.push(this.json[i])
                        }
                    }
                }
                console.log("Author search complete.")
            } else if (criteria[c] === "tags") {
                for (let i in this.json) {
                    let jsonTags = JSON.stringify(this.json[i].tags).replace(/"+/g, '').split(', ')
                    for (let j in jsonTags) {
                        for (let k in value[c]) {
                            if (jsonTags[j] === value[c][k]) {
                                results.push(this.json[i])
                            }
                        }
                    }
                }
                console.log("Tag search complete.")
            } else if (criteria[c] === "date") {
                let startDate = Date.parse(value[c][0])
                let endDate = Date.parse(value[c][1])
                for (let i in this.json) {
                    if (Date.parse(this.json[i].date) >= startDate && Date.parse(this.json[i].date) <= endDate) {
                        results.push(this.json[i])
                    }
                }
                console.log("Date search complete.")
            }
        }
        return [...new Set(results)]
    }

    /*******************************************************************************************
     * readFile() - Class helper function for reading data from QA.json
     *
     * arguments:
     *   none
     *
     * returns:
     *   nothing
     */
    readFile(){
        let jsonString = fs.readFileSync(file, 'utf8')
        this.json = JSON.parse(jsonString)
        console.log("Read from file.")
    }

    /*******************************************************************************************
     * readFile() - Class helper function for writing data to QA.json
     *
     * arguments:
     *   none
     *
     * returns:
     *   nothing
     */
    writeFile(json){
        fs.writeFileSync(file, json)
        console.log("Wrote to file.")
    }
}
exports.FAQ=FAQ