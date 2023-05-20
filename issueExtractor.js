const request = require("request")
const cheerio = require("cheerio")
const path = require("path")
const fs = require("fs")
const pdfkit = require("pdfkit")




function issuePage(url, repoPath) {
    request(url, (err, response, html) => {
        if (err) {
            console.log(err)
        }
        else {
            issueExtractor(html, repoPath)
        }
    })
}

function issueExtractor(html, repoPath) {
    const $ = cheerio.load(html)
    const issueList = $("a[data-hovercard-type = 'issue']")
    let issueContent = []
    let pdfDoc = new pdfkit()
    pdfDoc.pipe(fs.createWriteStream(repoPath))

    for (let i = 0; i < issueList.length; i++) {
        const linkText = ($(issueList[i]).attr("href"))
        const fullLink = "https://github.com/" + linkText
        issueContent.push(fullLink)
        pdfDoc.fontSize(12)
        pdfDoc.fillColor('blue')
        pdfDoc.text(fullLink)
    }
    pdfDoc.end()
    // let json = JSON.stringify(issueContent)
    console.log(issueContent)


    // fs.writeFileSync(repoPath, json)
}

module.exports = {
    issuepg: issuePage
}