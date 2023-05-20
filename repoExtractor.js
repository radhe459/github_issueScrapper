const request = require("request")
const cheerio = require("cheerio")
const path = require("path")
const fs = require("fs")
const issuePgobj = require("./issueExtractor")

function repoExtractor(url, repoPath) {
    request(url, (err, response, html) => {
        if (err) {
            console.log(err)
        }
        else {
            issueLoad(html, repoPath)
        }
    })
}


function issueLoad(html, repoPath) {
    const $ = cheerio.load(html)
    const issueLink = $("a[id = 'issues-tab']").attr("href")
    const issueFullLink = "https://github.com/" + issueLink
    issuePgobj.issuepg(issueFullLink, repoPath)
}

module.exports = {
    repoExt: repoExtractor
}