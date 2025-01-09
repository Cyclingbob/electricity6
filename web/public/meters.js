function drawMeter({ units, ticks, highlights, element, min, max, valueDec, valueInt }){
    var gauge = new RadialGauge({
        renderTo: element, // identifier of HTML canvas element or element itself
        width: 200,
        height: 200,
        units,
        // title: "Frequency",
        value: 0,
        valueBox: true,
        valueBoxWidth: 10,
        valueBoxStroke: 1,
        valueBoxBorderRadius: 10,
        colorValueText: "#fff",
        colorValueBoxRect: "#FFF",
        colorValueBoxRectEnd: "#FFF",
        colorValueBoxBackground: "#000",
        minValue: min,
        maxValue: max,
        majorTicks: ticks,
        minorTicks: 2,
        strokeTicks: true,
        highlights,
        colorPlate: '#3B3B3B', //background colour of the meter/gauge
        colorMajorTicks: '#f5f5f5', //colour of the larger of the little spikes on the edge of the meter on the coloured bits
        colorMinorTicks: '#FFF', //colour of the little of the little spikes on the edge of the meter on the coloured bits
        colorTitle: '#fff', //title colour
        colorUnits: '#ccc', //colour of units (Hz)
        colorNumbers: '#FFF', //colour of number values eg 49.5 that are labelled inside the meter
        colorNeedle: '#919191',
        colorNeedleStart: 'rgba(255, 255, 255, 1)',
        colorNeedleEnd: '#919191',
        // colorNeedleShadowUp: 'rgba(255, 255, 255, 0)',
        // colorNeedleShadowDown: 'rgba(255, 255, 255, 0)',
        animationRule: 'linear',
        borders: true,
        colorBorderOuterEnd: "#000",
        colorBorderOuter: "#000",
        colorBorderMiddleEnd: "#000",
        colorBorderMiddle: "#000",
        colorBorderInnerEnd: "#000",
        colorBorderInner: "#000",
        colorBorderShadow: "#000",
        valueDec,
        valueInt,
        fontNumbersSize: 25,
        fontNumbersWeight: 200,
        fontTitleSize: 30
    });
    // draw initially
    gauge.draw();
    // animate
    return gauge
}

function drawFrequencyMeter(id){
    let ticks = ['49', '49.5', '50', '50.5', '51']
    let highlights = [
        { from: 49, to: 49.5, color: 'rgba(255,0,0,.75)' },
        { from: 49.5, to: 49.9, color: 'rgba(255, 200, 0,.75)' },
        { from: 49.9, to: 50.1, color: 'rgba(100, 100, 100,.75)' },
        { from: 50.1, to: 50.5, color: 'rgba(255, 200, 0,.75)' },
        { from: 50.5, to: 51, color: 'rgba(255,0,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: 49,
        max: 51,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

function drawRSDMeter(id){
    let ticks = ['15', '20', '25', '30', '35', '40', '45', '50', '55']
    let highlights = [
        { from: 15, to: 17, color: 'rgba(255,0,0,.75)' },
        { from: 17, to: 45, color: 'rgba(100,100,100,.75)' },
        { from: 45, to: 50, color: 'rgba(255,200,0,.75)' },
        { from: 50, to: 55, color: 'rgba(255,0,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: 15,
        max: 55,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

function drawGenerationMeter(id){
    let ticks = ['10', '15', '20', '25', '30', '35', '40', '45', '50']
    let highlights = [
        { from: 10, to: 15, color: 'rgba(255,0,0,.75)' },
        { from: 15, to: 45, color: 'rgba(100,100,100,.75)' },
        { from: 45, to: 50, color: 'rgba(255,200,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: 10,
        max: 50,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

function drawInterconnectorMeter(id){
    let ticks = ['-11', '-5.5', '0', '5.5', '11']
    let highlights = [
        { from: -11, to: -9, color: 'rgba(255,200,0,.75)' },
        { from: -9, to: 9, color: 'rgba(100,100,100,.75)' },
        { from: 9, to: 11, color: 'rgba(255,200,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: -11,
        max: 11,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

function drawImportMeter(id){
    let ticks = ['0', '2.75', '5.5', '8.25', '11']
    let highlights = [
        { from: 0, to: 9, color: 'rgba(100,100,100,.75)' },
        { from: 9, to: 11, color: 'rgba(255,200,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: 0,
        max: 11,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

function drawExportMeter(id){
    let ticks = ['0', '2.75', '5.5', '8.25', '11']
    let highlights = [
        { from: 0, to: 9, color: 'rgba(100,100,100,.75)' },
        { from: 9, to: 11, color: 'rgba(255,200,0,.75)' }
    ]

    let meter = drawMeter({
        units: "GW",
        ticks,
        highlights,
        min: 0,
        max: 11,
        valueDec: 3,
        valueInt: 2, //if capacity is 10 or more, have 2 integer digits
        element: id
    })

    return meter
}

var cache = {
    capacities: {
        SOLAR: 15,
        CCGT: 35,
        OCGT: 3,
        COAL: 1,
        OIL: 1,
        NUCLEAR: 5,
        NPSHYD: 3,
        PS: 3,
        OTHER: 5,
        BIOMASS: 5,
        WIND: 25
    }
}
