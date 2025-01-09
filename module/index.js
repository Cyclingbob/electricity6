const fetch = require("node-fetch")

const sources = require("./sources")
const interconnectors = require("./connectors.json")

function getCurrentGeneration(){
    return new Promise(async (resolve, reject) => {
        var result = await fetch("https://data.elexon.co.uk/bmrs/api/v1/generation/outturn/current").then(res => res.json()).catch(reject)
        var sources = {}
        result.map(source => {
            sources[source.fuelType] = {
                current: source.currentUsage,
                percentage: source.currentPercentage.toFixed(2)
            }
        })
        resolve(sources)
    })
}

function getCurrentInterconnectors(){
    return new Promise(async (resolve, reject) => {
        var result = await fetch("https://data.elexon.co.uk/bmrs/api/v1/generation/outturn/interconnectors").then(res => res.json()).catch(reject)
        var list = result.data
        var interconnectors = {}
        for(item of list){
            var ic = interconnectors[item.interconnectorName]
            if(ic) continue;
            interconnectors[item.interconnectorName] = item.generation
        }
        resolve(interconnectors)
    })
}

function getHistoricalGeneration2(from, to){
    return new Promise(async (resolve, reject) => {
        from = from.toISOString()
        to = to.toISOString()
        var result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/generation/actual/per-type?from=${from}&to=${to}`).then(res => res.json()).catch(reject)
        var list = result.data
        resolve(list)
    })
}

function getHistoricalGeneration(from, to){
    return new Promise(async (resolve, reject) => {
        from = from.toISOString()
        to = to.toISOString()
        var result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/generation/outturn/summary?from=${from}&to=${to}`).then(res => res.json()).catch(reject)
        var list = result
        resolve(list)
    })
}

function getHistoricalGenerationSource(source, from, to){
    return new Promise(async (resolve, reject) => {
        from = from.toISOString()
        to = to.toISOString()
        let result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/generation/outturn/summary?from=${from}&to=${to}`).then(res => res.json()).catch(reject)
        let source_only = result.map(item => {
            let fuelType = item.data.find(a => a.fuelType === source)
            return {
                generation: fuelType.generation,
                time: item.startTime
            }
        })
        resolve(source_only)
    })
}

function convertDate(date){
    let date_str = ''

    date.setDate(MyDate.getDate() + 20);

    date_str = date.getFullYear() + '-'
        + ('0' + (date.getMonth()+1)).slice(-2) + '-'
        + ('0' + date.getDate()).slice(-2);

    return date_str
}

function getDemandOutturn(from, to){
    return new Promise(async (resolve, reject) => {
        from = convertDate(from)
        to = convertDate(to)
        let result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/demand/outturn/stream?settlementDateFrom=${from}&to=&settlementDateTo=${to}`).then(res => res.json()).catch(reject)
        resolve(result)
    })
}

function getTotalGeneration(){
    return new Promise(async (resolve, reject) => {
        let result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/generation/outturn`).then(res => res.json()).catch(reject)
        try {
            resolve(result.data[result.data.length - 1])
        } catch(err){
            reject(err)
        }
    })
}

function getPumpedStorage(){
    return new Promise(async (resolve, reject) => {
        let result = await fetch(`https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELINST/stream`).then(res => res.json()).catch(reject)
        result = result.filter(a => a.fuelType === "PS")
        try {
            resolve({
                time: result[0].startTime,
                settlement_period: result[0].settlementPeriod,
                generation: result[0].generation
            })
        } catch(err){
            reject(err)
        }
    })
}

module.exports = {
    getCurrentGeneration, getCurrentInterconnectors, getHistoricalGeneration, interconnectors, sources, getHistoricalGenerationSource, getDemandOutturn, getTotalGeneration, getPumpedStorage
}

// getCurrentGeneration().then(console.log)
// getCurrentInterconnectors().then(console.log)

// let from = new Date()
// from.setDate(from.getDate() - 1)
// let to = new Date()
// getHistoricalGenerationSource("WIND", from, to).then(data => console.log(data[0])).catch(console.error)
// getPumpedStorage().then(console.log)