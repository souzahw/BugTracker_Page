const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async () => {
    const doc = new GoogleSpreadSheet('1LbjVt3Xepx53zN7fME9lsEiVhFhnsRO5pEpLR_Xk-kU')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta.')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'Leonardo Souza', email: 'dev.leonardosouza@gmail.com'})
}

addRowToSheet()