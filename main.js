const request = require("request")
const cheerio = require("cheerio")
const path = require("path")
const fs = require("fs")
const repoExtobj = require("./repoExtractor")


const url = "https://github.com/topics"

request(url, (err, response, html) => {
    if (err) {
        console.log(err)
    }
    else {

        extractLink(html)
    }
})

function extractLink(html) {
    const $ = cheerio.load(html)
    const topics = $(".no-underline.d-flex.flex-column.flex-justify-center")
    for (let i = 0; i < topics.length; i++) {
        const link = $(topics[i]).attr("href")
        const fullLink = "https://github.com/" + link
        const topicText = $(topics[i]).find("p")
        const topicName = $(topicText[0]).text().trim()
        const topicPath = path.join(__dirname, topicName)
        dirCreator(topicPath)
        topicExtract(fullLink, topicPath)
    }
}

function topicExtract(url, topicPath) {
    request(url, (err, response, html) => {
        if (err) {
            console.log(err)
        }
        else {
            repoLinkExtractor(html, topicPath)
        }
    })

}

function repoLinkExtractor(html, topicPath) {
    const $ = cheerio.load(html)
    const repoList = $(".text-bold.wb-break-word")
    for (let i = 0; i < 8; i++) {
        const repoLink = $(repoList[i]).attr("href")
        const fullRepoLink = "https://github.com/" + repoLink
        const repoName = $(repoList[i]).text().trim()
        const repoPath = path.join(topicPath, repoName + ".pdf")
        console.log(repoName)
        repoExtobj.repoExt(fullRepoLink, repoPath)
    }
}

function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }
}
