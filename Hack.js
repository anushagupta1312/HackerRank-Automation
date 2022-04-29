const loginLink = "https://www.hackerrank.com/auth/login";
const puppeteer = require('puppeteer')
const codeFile = require('./code')

console.log('Before')

let email = 'cabewix597@wodeda.com'
let password = 'hacker_3112'

let page; //global variable taki bar bar newPage vala promise return na krna pde

let browserPromise = puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null
})

browserPromise.then(function (browserInstance) {
    let newTabPromise = browserInstance.newPage()
    return newTabPromise
}).then(function (newTab) {
    page = newTab
    let websiteOpened = newTab.goto(loginLink)
    return websiteOpened
}).then(function () {
    // console.log("Our Website is opened")
    let emailEnteredPromise = page.type('input[id="input-1"]', email, { delay: 50 })
    return emailEnteredPromise
}).then(function () {
    let passwordEnteredPromise = page.type('input[id="input-2"]', password, { delay: 50 })
    return passwordEnteredPromise
}).then(function () {
    let loginButtonClickPromise = page.click('button[data-analytics="LoginPassword"]', { delay: 50 })
    return loginButtonClickPromise
}).then(function () {
    let algoSecClickPromise = waitAndClick('.topic-card a[data-attr1="algorithms"]', page)
    //wait an click use kr rhe h kyuki login click hone ke bad delay leta h next page load krne me
    return algoSecClickPromise
}).then(function () {
    // console.log("Algo section opened")
    let warmUpPromise = waitAndClick('input[value="warmup"]', page)
    return warmUpPromise
}).then(function () {
    let allquestionArrayPromise = page.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled', {delay:100})
    return allquestionArrayPromise
}).then(function (TotalQuestionArray) {
    // console.log('No of question is  -> ', TotalQuestionArray.length)
    let questionsolvedPromise = questionSolver(page, TotalQuestionArray[0], codeFile.answers[0])
    return questionsolvedPromise
})
// })

function waitAndClick(selector, currPage) {//use this method when there is a page jump i.e jab bhi click 
    //krne pr page load ho aur link change ho
    //my code without creating a new promise
    // let waitPromise = currPage.waitForSelector(selector)
    // waitPromise.then(function(){
    //     let clickPromise = currPage.click(selector)
    //     return clickPromise
    // })

    // sir code
    return new Promise(function (resolve, reject) {
        let waitPromise = currPage.waitForSelector(selector) //this will wait on every page jo bhi us
        // currpage se linked hoga aur har page pr selector
        // search hoga
        waitPromise.then(function () {
            let clickPromise = currPage.click(selector, { delay: 100 })
            return clickPromise
        }).then(function () { resolve() }).catch(function () { reject() })
        //two types ke error aa skte h
        //1. agar given selector h hi nhi page pr
        //2. agar jo selected element h vo clickable nhi h(<p>, <h1> eg.)
    })
}

function questionSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let questionWillBeClickedPromise = question.click()
        questionWillBeClickedPromise.then(function () {
            let waitForEditorPromise = waitAndClick(
                ".monaco-editor.no-user-select.vs",
                page
            );
            return waitForEditorPromise;
        })
            .then(function () {
                return waitAndClick(".checkbox-input", page);
            })
            .then(function () {
                return page.waitForSelector(".text-area.custominput");
            })
            .then(function () {
                return page.type(".text-area.custominput", answer, { delay: 20 });
            })
            .then(function () {
                let ctrlonHoldPromise = page.keyboard.down('Control');
                return ctrlonHoldPromise
            }).then(function () {
                let AisPressedPromise = page.keyboard.press('A', { delay: 20 });
                return AisPressedPromise
            }).then(function () {
                let XisPressedPromise = page.keyboard.press('X', { delay: 20 })
                return XisPressedPromise
            }).then(function () {
                let ctrlIsReleasedPromise = page.keyboard.up('Control')
                return ctrlIsReleasedPromise
            }).then(function () {
                let waitForEditorPromise = waitAndClick(
                    ".monaco-editor.no-user-select.vs",
                    page
                );
                return waitForEditorPromise;
            }).then(function () {
                let ctrlonHoldPromise = page.keyboard.down('Control');
                return ctrlonHoldPromise
            }).then(function () {
                let AisPressedPromise = page.keyboard.press('A', { delay: 20 });
                return AisPressedPromise
            }).then(function () {
                let VisPressedPromise = page.keyboard.press('V', { delay: 20 })
                return VisPressedPromise
            }).then(function () {
                let ctrlIsReleasedPromise = page.keyboard.up('Control')
                return ctrlIsReleasedPromise
            }).then(function () {
                return page.click('.hr-monaco__run-code', { delay: 20 })
            }).then(function () {
                resolve()
            }).catch(function (err) {
                console.log(err)
            })
    });
}

console.log("after")