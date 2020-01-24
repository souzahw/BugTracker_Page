const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

const docId = '1LbjVt3Xepx53zN7fME9lsEiVhFhnsRO5pEpLR_Xk-kU'
const worksheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended:true }))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async(request, response) => {
    try{
        const doc = new GoogleSpreadSheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            issueType: request.body.issueType,
            source: request.body.source || 'direct'
        })  
        if(request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'dev.leonardosouza@gmail.com',
                from: 'dev.leonardosouza@gmail.com',
            subject: 'BUG Critico reportado',
            text:`O Usuário ${request.body.name} reportou o problema.`,
            html: `O Usuário ${request.body.name} reportou o problema.`,
        }
        await sgMail.send(msg);
        }           
        response.render('Sucesso')
    } catch (err) {
        response.send('Erro ao enviar formulário')
        console.log(err)
    }
})

app.listen(3000, (err) => {
    if(err) {
        console.log('aconteceu erro', err)
    } else {
        console.log('bugtracker rodando na porta 3000')
    }
})