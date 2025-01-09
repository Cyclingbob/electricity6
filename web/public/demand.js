var frequency_meter = drawFrequencyMeter('frequency-meter')
var rsd_meter = drawRSDMeter('rsd-meter')
var generation_meter = drawGenerationMeter('generation-meter')
var import_meter = drawImportMeter('import-meter')
var export_meter = drawExportMeter('export-meter')

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
        import_meter.value = data.import / 1000
        export_meter.value = data.export / 1000
    })
}

function refresh(){
    refreshRSD()
    refreshGeneration()
    refreshInterconnectors()
}
window.addEventListener('load', e => {
    setInterval(refresh, 30000)
    refresh()
})
