const xls = require('exceljs')
const Ping = require('ping-wrapper')

Ping.configure()


const wb = new xls.Workbook()
let hostnames = []
let success = []
let fail = []

async function getData() {
    await wb.xlsx.readFile('data.xlsx')
    const data = wb.model.sheets[0].rows
    await data.forEach(row => {
        row.cells.forEach(cell => {
            if (cell.address.includes('I')) {
               hostnames.push(cell.value)
            }
        })
    })
    await pingHosts(hostnames)
}

function attemptSWNA(host) {
    return host + '.swna.wdpr.disney.com'
}

function attemptWDW(host) {
    return host + '.wdw.disney.com'
}

async function pingHosts(hosts) {
    console.log(hosts)
    hosts.forEach(host => {
        fqdnHost = [attemptSWNA(host),attemptWDW(host)]
        fqdnHost.forEach(fqdn => {
            console.log(`pinging ${fqdn}...`)
            let ping = new Ping(fqdn)
            ping.on('ping',function(data) {
                console.log(`${fqdn} is online`)
            })
            ping.on('fail', function(data) {
                console.log(`No response from ${fqdn}`)
            })
        })
    })
}

getData()


console.log(success)