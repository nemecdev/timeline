<template>
    <div style="width: 50%; margin: 0 auto;">
        <svg ref="timeline" id="timeline" overflow="auto" width="100%" :height="maxHeight">
            <defs>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="1" stdDeviation="4" flood-color="#00000022"></feDropShadow>
                </filter>
                <linearGradient id="lastTickGradient">
                    <stop offset="0" stop-color="#ffffff00"></stop>
                    <stop offset="50%" stop-color="#fff"></stop>
                </linearGradient>
            </defs>
            <g id="x-axis-wrapper" :transform="`translate(0, ${maxHeight * 0.5})`">
                <g id="x-axis">
                    <g style="transform: translate(0, -40px)">
                        <rect rx="15" :width="`${ticksPxSize < timelineWidth ? (timelineWidth * 2) : (ticksPxSize * 2)}px`" height="80px" fill="#fff" filter="url(#shadow)" />
                        <g id="starting-point">
                            <rect rx="15" width="80px" height="80px" fill="#E0E0E0" />
                            <text fill="#757575" x="40px" y="45px" class="fs-5">Start</text>
                        </g>
                    </g>
                </g>
            </g>
            <rect id="last-tick-gradient" fill="url(#lastTickGradient)" width="80px" height="80px" x="100%" y="50%" transform="translate(-80, -40)"></rect>
        </svg>
    </div>
    <div id="tooltip" role="tooltip" class="hidden">
        Testovací tooltip
        <div id="arrow" data-popper-arrow></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { select } from 'd3-selection'
import { zoom as plugInZoom } from 'd3-zoom'
import { axisBottom } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { easeLinear } from 'd3-ease'
import { createPopper } from '@popperjs/core'

// const ticks = ref<string[]>(['2020', 'Leden 2021', '2022', '2023'])
const ticks = ref<string[]>(['2020', 'Leden 2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'])
const tickPxSize = ref<number>(200)
const ticksPxSize = ref<number>((ticks.value.length - 1) * tickPxSize.value)
const maxHeight = ref<number>(200)
const scrollDuration = ref<number>(200)
const axisMarginPercentageStart = ref<number>(0)
const axisMarginPercentageEnd = ref<number>(0)

const zoom = plugInZoom()
const timeline = ref<SVGElement | null>(null)
const isScrollingBlocked = ref(false)
const ac = new AbortController()

const timelineWidth = computed(() => {
    if (!timeline.value) {
        return 0
    }

    return timeline.value.getBoundingClientRect().width
})

onMounted(() => {
    window.addEventListener('resize', () => {
        drawXAxis()
        drawTicks()
    }, { signal: ac.signal })
    window.addEventListener('timeline:tick:click', (e) => {
        const tickElement = e.detail.target
        const tooltip = document.querySelector('#tooltip')
        createPopper(tickElement, tooltip, {
            placement: 'bottom',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 50]
                    }
                }
            ]
        })
        tooltip?.classList.remove('hidden')
    }, { signal: ac.signal })
    initD3()
    drawXAxis()
    drawTicks()
})

onBeforeUnmount(() => {
    ac.abort()
})

function initD3 () {
    select('svg#timeline')
        .call(zoom)
        .on('wheel.zoom', scroll)
}

let scrollInterval = 0
function scroll (e: any) {
    const tooltip = document.querySelector('#tooltip')
    if (tooltip) {
        tooltip.classList.add('hidden')
    }

    if (isScrollingBlocked.value || ticksPxSize.value < window.innerWidth) {
        return
    }

    const currentTransform = select('svg#timeline g#x-axis-wrapper').attr('transform')
    const { x, y } = parseTransformTranslate(currentTransform)
    let driftX = e.wheelDelta < 0 ? x - tickPxSize.value : x + tickPxSize.value
    if (driftX > (tickPxSize.value * -1)) {
        driftX = 0
    }

    if (Math.abs(x - timelineWidth.value) > ticksPxSize.value && Math.abs(driftX) > ticksPxSize.value - timelineWidth.value) {
        driftX = x
    }

    select<SVGGElement, unknown>('svg#timeline g#x-axis-wrapper')
        .transition()
        .duration(scrollDuration.value * 2)
        .ease(easeLinear)
        .attr('transform', `translate(${driftX}, ${y})`)

    isScrollingBlocked.value = true

    clearInterval(scrollInterval)
    scrollInterval = setInterval(() => {
        isScrollingBlocked.value = false
    }, scrollDuration.value)

    
}

function drawXAxis () {
    // We need to remove the last tick because it's not visible, so ticks.length is not decremented
    const scale = scaleLinear()
        .domain([0, ticks.value.length])
        .range([0 + window.innerWidth * (axisMarginPercentageStart.value / 100) + 120, ticksPxSize.value - ((axisMarginPercentageEnd.value / 100) * window.innerWidth)])
    select('#timeline g#x-axis').call(
        axisBottom(scale).ticks(ticks.value.length, 'f').tickSizeOuter(0)
    )
    select('#timeline #x-axis-wrapper .domain')
        .attr('class', 'domain text-orange')
        .style('stroke-width', '2px')
    select('#timeline #x-axis-wrapper .tick:last-of-type').remove()
    select('#timeline #x-axis-wrapper .domain').call(function (selection) {
        const d = selection.attr('d')
        const [move, lineTo] = d?.split('H')
        if (ticksPxSize.value < timelineWidth.value) {
            selection.attr('d', `${move}H${timelineWidth.value}`)

            return
        }
        selection.attr('d', `${move}H${ticksPxSize.value - (tickPxSize.value * 0.2)}`)
    })
}

function drawTicks () {
    select('#timeline #x-axis-wrapper')
        .selectAll('.tick')
        .each(function (_v, i) {
            const tick = select(this)
            const text = tick.select('text')
            tick.select('line').remove()
            tick.append('circle')
                .attr('class', 'text-orange')
                .attr('r', 15)
                .style('fill', 'white')
            tick.append('circle')
                .attr('class', 'text-orange')
                .attr('r', 8)
                .style('fill', 'white')
                .style('stroke', 'currentcolor')
                .style('stroke-width', '2px')
                .style('transition', 'all 0.2s ease-in-out')
                .style('cursor', 'pointer')
                .on('mouseover', function () {
                    select(this).style('fill', 'currentcolor')
                })
                .on('mouseout', function () {
                    select(this).style('fill', 'white')
                })
                .on('click', function () {
                    const event = new CustomEvent('timeline:tick:click', {
                        detail: {
                            target: tick.node()
                        }
                    })
                    window.dispatchEvent(event)
                })
            text.raise().raise()
            text.text(ticks.value[i])
            text.attr('class', 'fw-bold fs-5')
            text.style('transform', 'translateY(-80px)')
        })
}

function parseTransformTranslate (transform: string) {
    const [x, y] = transform.split('translate(')[1].split(')')[0].split(',').map(v => Number(v.trim()))
    return { x, y }
}
</script>

<style>
.hidden {
    display: none;
}

#tooltip {
  background: #ffffff;
  color: #643045;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 20px;
  border-radius: 4px;
}

#arrow,
#arrow::before {
  position: absolute;
  width: 25px;
  height: 25px;
  top: -15px;
  background: inherit;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  clip-path: polygon(50% 0%, 0% 80%, 100% 80%);
}

#tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}
</style>
