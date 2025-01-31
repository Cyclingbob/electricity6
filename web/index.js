const express = require("express")
const app = express()

const path = require("path")

const view_dir = path.join(__dirname, "views")
const public_dir = path.join(__dirname, "public")

app.set("view-engine", "ejs")
app.use("/public", express.static(public_dir))

const grid = require("../module")

let cache = {
    sources: {},
    interconnectors: {},
    rsd: 0,
    generation: 0,
    import: 0,
    export: 0,
    net: 0,
    pumped: 0
}

function refresh(){
    grid.getCurrentGeneration().then(data => {
        cache.sources = data
        
        cache.rsd = Object.values(cache.sources).reduce((accumulator, value) => {
            accumulator = accumulator + value.current
            return accumulator
        }, 0)

        cache.generation = Object.entries(cache.sources).reduce((accumulator, value) => {
            if(!value[0].startsWith("INT")) accumulator = accumulator + value[1].current
            return accumulator
        }, 0)
    })
    grid.getCurrentInterconnectors().then(data => {
        let power_import = 0
        let power_export = 0

        for(item in data){
            let interconnector = grid.interconnectors.find(a => a.api_name === item)
            cache.interconnectors[interconnector.technical_name] = data[item]
            if(data[item] > 0) power_import = power_import + data[item]
            else if(data[item] < 0) power_export = power_export + (data[item] * -1)
        }

        cache.import = power_import
        cache.export = power_export
        cache.net = power_import - power_export
    })
    // grid.getTotalGeneration().then(data => {
    //     cache.rsd = 0
    // })
    grid.getPumpedStorage().then(result => {
        cache.pumped = result.generation
    })
}

app.get("/source/:source", async (req, res) => {
    let source = req.params.source
    let found = grid.sources.find(a => a.current_generation_name === source)
    if(!found){ return res.status(404).end("Couldn't find source " + source) }
    
    let from = new Date()
    from.setDate(from.getDate() - 1)
    let to = new Date()
    let history = await grid.getHistoricalGenerationSource(source, from, to)
    
    res.render(path.join(view_dir, "source.ejs"), {
        graph: {
            day: history
        }
    })
})

app.get("/", (req, res) => {
    res.render(path.join(view_dir, "index.ejs"), {
        sources: grid.sources,
        interconnectors: grid.interconnectors
    })
})

app.get("/demand", (req, res) => {
    res.render(path.join(view_dir, "demand.ejs"), {})
})


app.get("/api/sources", (req, res) => {
    let sources = cache.sources
    cache.sources.PS = { current: cache.pumped, percentage: Math.round(cache.pumped / cache.generation) }
    res.json({
        success: true,
        sources: sources
    })
})

app.get("/api/rsd", (req, res) => {
    res.json({
        success: true,
        rsd: cache.rsd
    })
})

app.get("/api/generation", (req, res) => {
    res.json({
        success: true,
        generation: cache.generation
    })
})

app.get("/api/interconnectors", (req, res) => {
    res.json({
        success: true,
        interconnectors: cache.interconnectors,
        import: cache.import,
        export: cache.export,
        net: cache.net
    })
})

setInterval(refresh, 60 * 1000)
refresh()
app.listen(80)

// let from = 
// grid.getDemandOutturn()