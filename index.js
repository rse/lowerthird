/*
**  Lower Third ~ Lower Thirds for OBS Studio
**  Copyright (c) 2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  await DOM...  */
$(document).ready(() => {
    /*  determine scene  */
    const params = (new URL(document.location)).searchParams
    const scene = params.get("scene")

    /*  determine lowerthirds  */
    let lowerthirds = null
    for (const s of MANIFEST.scenes)
        if (s.id === scene)
            lowerthirds = s.lowerThirds
    if (lowerthirds === null) {
        console.log(`lowerthird: WARNING: no such scene "${scene}" found`)
        return
    }

    /*  iterate over all lowerthirds  */
    for (const lowerthird of lowerthirds) {
        /*  determine parameters  */
        const def = Object.assign({}, MANIFEST.defaults, lowerthird)

        /*  render DOM fragment  */
        const fragmentDoor =
            `<div class="door">
                <div class="bar"></div>
            </div>`
        const fragmentContent =
            `<div class="content">
                <div class="line1">
                    <span class="firstname">${def.line1Text1.toUpperCase()}</span>
                    <span class="surname">${def.line1Text2.toUpperCase()}</span>
                </div>
                <div class="line2">${def.line2Text}</div>
            </div>`
        const fragment =
            `<div class="lowerthird lowerthird-${def.boxHandle}">
                ${def.boxHandle.match(/^[tb]l$/) ?
                (fragmentDoor + fragmentContent) :
                (fragmentContent + fragmentDoor)}
            </div>`
        const el = $(fragment)

        /*  style DOM fragment  */
        $(el)
            .css("width",            `${6 + 15 + def.boxWidth + 15}px`)
            .css("height",           `${def.line1Height + def.line2Height + 2 + 4}px`)
        $(".gap", el)
            .css("background-color", def.boxBackground)
        $(".door", el)
            .css("height",           `${2 + def.line1Height + def.line2Height + 4}px`)
        $(".door .bar", el)
            .css("height",           `${2 + def.line1Height + def.line2Height + 4}px`)
            .css("background",       `linear-gradient(180deg, ${def.barColor1}, ${def.barColor2})`)
        $(".line1", el)
            .css("background-color", def.boxBackground)
            .css("width",            `${def.boxWidth - 30 - 6}px`)
            .css("height",           `${def.line1Height}px`)
            .css("font-size",        `${def.line1Height * 0.75}px`)
        $(".line1 .firstname", el)
            .css("color",            def.line1Color1)
            .css("font-style",       def.line1FontStyle1)
            .css("font-weight",      def.line1FontWeight1)
        $(".line1 .surname", el)
            .css("color",            def.line1Color2)
            .css("font-style",       def.line1FontStyle2)
            .css("font-weight",      def.line1FontWeight2)
        if (def.line1Shadow1 !== "transparent")
            $(".line1 .firstname", el)
                .css("text-shadow",  `0px 0px 1px ${def.line1Shadow1}`)
        if (def.line1Shadow2 !== "transparent")
            $(".line1 .surname", el)
                .css("text-shadow",  `0px 0px 1px ${def.line1Shadow2}`)
        $(".line2", el)
            .css("background-color", def.boxBackground)
            .css("width",            `${def.boxWidth - 30 - 6}px`)
            .css("height",           `${def.line2Height}px`)
            .css("color",            def.line2Color)
            .css("font-weight",      def.line2FontWeight)
            .css("font-style",       def.line2FontStyle)
            .css("font-size",        `${def.line2Height * 0.75}px`)
        if (def.line1Shadow !== "transparent")
            $(".line2", el)
                .css("text-shadow",  `0px 0px 1px ${def.line2Shadow}`)

        /*  position DOM fragment  */
        const [ , yd, xd ] = def.boxHandle.match(/^([tb])([lr])$/)
        let [ x, y ] = def.boxPosition
        if (x < 0)
            x = def.canvasWidth + x
        if (y < 0)
            y = def.canvasHeight + y
        if (xd === "r")
            x = x - (6 + 15 + def.boxWidth + 15)
        if (yd === "b")
            y = y - (2 + def.line1Height + def.line2Height + 4)
        $(el)
            .css("left", x)
            .css("top",  y)

        /*  initialize animation positions  */
        if (yd === "t")
            $(".door .bar", el).css("top", -(2 + def.line1Height + def.line2Height + 4))
        else
            $(".door .bar", el).css("top", 2 + def.line1Height + def.line2Height + 4)
        if (xd === "l")
            $(".content .line1, .content .line2", el).css("left", -def.boxWidth)
        else
            $(".content .line1, .content .line2", el).css("left", def.boxWidth)

        /*  add DOM fragment to DOM  */
        $(".canvas").append(el)

        /*  create animation timeline  */
        const tl = anime.timeline({
            autoplay:  true,
            direction: "normal"
        })

        /*  grab the elements in the DOM fragment  */
        const elBar   = $(".door .bar", el).get(0)
        const elLine1 = $(".content .line1", el).get(0)
        const elLine2 = $(".content .line2", el).get(0)

        /*  coming: bar  */
        tl.add({
            targets:   elBar,
            delay:     def.timeDelay,
            duration:  def.timeAnimation1,
            easing:    "easeOutSine",
            ...(yd === "t" ?
                { top: [ - (1 + 2 + def.line1Height + def.line2Height + 4), 0 ] } :
                { top: [    1 + 2 + def.line1Height + def.line2Height + 4,  0 ] })
        })

        /*  coming: line 1  */
        tl.add({
            targets:   elLine1,
            duration:  def.timeAnimation2,
            easing:    "easeOutSine",
            ...(xd === "l" ?
                { left: [ -def.boxWidth, 0 ] } :
                { left: [  def.boxWidth, 0 ] })
        })

        /*  coming: line 2  */
        tl.add({
            targets:   elLine2,
            duration:  def.timeAnimation2,
            endDelay:  def.timeDuration,
            easing:    "easeOutSine",
            ...(xd === "l" ?
                { left: [ -def.boxWidth, 0 ] } :
                { left: [  def.boxWidth, 0 ] })
        }, `-=${def.timeAnimation2 / 3 * 2}`)

        /*  going: line 2  */
        tl.add({
            targets:   elLine2,
            duration:  def.timeAnimation2,
            easing:    "easeInSine",
            ...(xd === "l" ?
                { left: [ 0, -def.boxWidth ] } :
                { left: [ 0,  def.boxWidth ] })
        })

        /*  going: line 1  */
        tl.add({
            targets:   elLine1,
            duration:  def.timeAnimation2,
            easing:    "easeInSine",
            ...(xd === "l" ?
                { left: [ 0, -def.boxWidth ] } :
                { left: [ 0,  def.boxWidth ] })
        }, `-=${def.timeAnimation2 / 3 * 2}`)

        /*  going: bar  */
        tl.add({
            targets:   elBar,
            duration:  def.timeAnimation1,
            easing:    "easeInSine",
            ...(yd === "t" ?
                { top: [ 0, - (1 + 2 + def.line1Height + def.line2Height + 4) ] } :
                { top: [ 0,    1 + 2 + def.line1Height + def.line2Height + 4  ] })
        })
    }
})

