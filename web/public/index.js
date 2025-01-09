var sourceGauges = new Map()

window.addEventListener('load', e => {
    document.querySelectorAll('.sources').forEach(canvas => {
        var type = canvas.id.split('-')[0]
        var capacity = cache.capacities[type]

        if(capacity === 1){
            var ticks = ['0', '0.25', '0.5', '0.75', '1']
            var highlights = [
                { from: 0, to: 0.75, color: 'rgba(100,100,100,.75)' },
                { from: 0.75, to: 1, color: 'rgba(255,0,0,.75)' }
            ]
        } else if(capacity === 2){
            var ticks = ['0', '0.5', '1', '1.5', '2']
            var highlights = [
                { from: 0, to: 1.5, color: 'rgba(100,100,100,.75)' },
                { from: 1.5, to: 2, color: 'rgba(255,0,0,.75)' }
            ]
        } else if(capacity === 3 && type != "PS"){
            var ticks = ['0', '1', '2', '3']
            var highlights = [
                { from: 0, to: 2.5, color: 'rgba(100,100,100,.75)' },
                { from: 2.5, to: 3, color: 'rgba(255,0,0,.75)' }
            ]
        } else if(capacity === 5){
            var ticks = ['0', '1.25', '2.5', '3.75', '5']
            var highlights = [
                { from: 0, to: 5, color: 'rgba(100,100,100,.75)' },
            ]
        } else if(capacity === 15){
            var ticks = ['0', '4', '8', '12', '16']
            var highlights = [
                { from: 0, to: 15, color: 'rgba(100,100,100,.75)' }
            ]
        } else if(capacity === 25){
            var ticks = ['0', '5', '10', '15', '20', '25']
            var highlights = [
                { from: 0, to: 25, color: 'rgba(100,100,100,.75)' }
            ]
        } else if(capacity === 35){
            var ticks = ['0', '5', '10', '15', '20', '25', '30', '35']
            var highlights = [
                { from: 0, to: 20, color: 'rgba(100,100,100,.75)' },
                { from: 20, to: 30, color: 'rgba(255,255,0,.75)' },
                { from: 30, to: 35, color: 'rgba(255,0,0,.75)' },
            ]
        } else if(capacity === 3 && type == "PS"){
            var ticks = ['-3', '-2', '-1', '0', '1', '2', '3']
            var highlights = [
                { from: -3, to: -2.5, color: 'rgba(255,0,0,.75)' },
                { from: -2.5, to: 2.5, color: 'rgba(100,100,100,.75)' },
                { from: 2.5, to: 3, color: 'rgba(255,0,0,.75)' }
            ]
        }

        let min = 0
        if(type === "PS") min = -3

        let meter = drawMeter({
            units: "GW",
            ticks,
            highlights,
            min,
            max: capacity,
            valueDec: 3,
            valueInt: capacity > 9 ? 2 : 1, //if capacity is 10 or more, have 2 integer digits
            element: canvas.id
        })

        sourceGauges.set(type, meter)
    })
})


var frequency_meter = drawFrequencyMeter('frequency-meter')
var rsd_meter = drawRSDMeter('rsd-meter')
var generation_meter = drawGenerationMeter('generation-meter')
var interconnector_meter = drawInterconnectorMeter('interconnector-meter')
var import_meter = drawImportMeter('import-meter')
var export_meter = drawExportMeter('export-meter')

function refreshSources(){
    fetch("/api/sources").then(res => res.json()).then(data => {
        cache.sources = data.sources
        console.log(cache.sources)
        document.querySelectorAll('.sources').forEach(canvas => {
            var type = canvas.id.split('-')[0]
            let meter = sourceGauges.get(type)
            meter.value = data.sources[type].current / 1000
            sourceGauges.set(type, meter)
        })
    })
}

function refreshRSD(){
    fetch("/api/rsd").then(data => data.json()).then(data => {
        rsd_meter.value = data.rsd / 1000
    })
}

function refreshGeneration(){
    fetch("/api/generation").then(data => data.json()).then(data => {
        generation_meter.value = data.generation / 1000
    })
}

function refreshInterconnectors(){
    fetch("/api/interconnectors").then(data => data.json()).then(data => {
        interconnector_meter.value = data.net / 1000
        import_meter.value = data.import / 1000
        export_meter.value = data.export / 1000
    })
}

function refresh(){
    refreshSources()
    refreshRSD()
    refreshGeneration()
    refreshInterconnectors()
}
window.addEventListener('load', e => {
    setInterval(refresh, 30000)
    refresh()
})
