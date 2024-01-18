<template>
    <div ref="timeline" class="position-relative">
        <div class="tl-container" data-simplebar>
            <div class="d-flex flex-column flex-lg-row">
                <div class="tl-start-box">
                    Start
                </div>
                <div class="tl-tick-group">
                    <div
                        class="tl-tick"
                        v-for="(item, index) in ticks.slice(0, ticksToDisplay)"
                        :key="index"
                        @click="toggleTooltip($event, index)"
                    >
                        <div class="tl-tick-label">{{ item.label }}</div>
                        <div class="tl-tick-point"></div>
                        <div
                            class="tl-tick-tooltip d-lg-none"
                            role="tooltip"
                        >
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">{{ item.title }}</div>
                                <div style="width: 1rem;"></div>
                                <div class="text-orange fw-bold">{{ item.label }}</div>
                            </div>
                            <div class="text-gray-500">
                                {{ item.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tl-fade-box"></div>
        <div class="tl-show-more-button d-lg-none" :class="{ 'd-none': ticks.length < ticksToDisplay }" @click="showMore">
            <span class="me-1">Zobrazit více</span>
            <IconifyIcon icon="mdi:chevron-down" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computePosition } from '@floating-ui/dom'

import SimpleBar from 'simplebar-core'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

import ResizeObserver from 'resize-observer-polyfill'
import { Icon as IconifyIcon } from '@iconify/vue'

window.ResizeObserver = ResizeObserver
const timeline = ref<HTMLElement | null>(null)
const ticksToDisplay = ref<number>(4)
const ticksToDisplayStep = ref<number>(4)
const ticks = ref([
    {
        label: '2020',
        title: 'Title',
        content: 'Karel začal pracovat na projektu'
    },
    {
        label: '2021',
        title: 'Title',
        content: 'Petr začal pracovat na projektu, Petr začal pracovat na projektu, Petr začal pracovat na projektu, Petr začal pracovat na projektu, Petr začal pracovat na projektu,Petr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektuPetr začal pracovat na projektu'
    },
    {
        label: '2022',
        title: 'Title',
        content: 'Projekt byl dokončen'
    },
    {
        label: 'prosinec 2023',
        title: 'prosinec Title',
        content: 'Martin smazal databázi'
    },
    {
        label: 'leden 2024',
        title: 'leden Title',
        content: 'Lukáš byl odejit'
    },
    {
        label: '2022',
        title: 'Title',
        content: 'FX firma'
    },
    {
        label: '2023',
        title: 'Title',
        content: 'Ahoj já jsem testovací content'
    },
    {
        label: 'leden 2024',
        title: 'leden Title',
        content: 'Ahoj já jsem testovací content'
    },
    {
        label: '2022',
        title: 'Title',
        content: 'Testovací content 3'
    },
    {
        label: '2023',
        title: 'Title',
        content: 'Ahoj já jsem testovací content'
    }
])

const showMore = () => {
    ticksToDisplay.value += ticksToDisplayStep.value
}

const toggleTooltip = (e: Event, index: number) => {
    // const tooltipEl = document.querySelector('.tl-tick-tooltip')?.cloneNode(true)
    // if (tooltipEl instanceof HTMLElement && e.currentTarget instanceof HTMLElement) {
    //     const tooltipEls = document.querySelectorAll('.tl-tick-tooltip')
    //     const tickEls = document.querySelectorAll('.tl-tick')
    //     const tooltipData = ticks.value[index]
    //     tooltipEl.querySelector('[data-tick-tooltip-title]')?.append(tooltipData.title)
    //     tooltipEl.querySelector('[data-tick-tooltip-label]')?.append(tooltipData.label)
    //     tooltipEl.querySelector('[data-tick-tooltip-content]')?.append(tooltipData.content)
    // }

    // if (e.currentTarget instanceof HTMLElement && tooltipEl instanceof HTMLElement) {
    //     computePosition(e.currentTarget, tooltip).then(({x, y}) => {
    //         tooltip.style.left = `${x}px`
    //         tooltip.style.top = `${y + 20}px`
    //     })
    //     e.currentTarget.classList.toggle('tl-tick--active')
    //     tooltip.classList.toggle('d-lg-none')
    // }
}

window.addEventListener('resize', () => {
    const tooltips = document.querySelectorAll('.tl-tick-tooltip')

    for (const tooltip of tooltips) {
        tooltip.classList.add('d-lg-none')
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const tl = timeline.value
    const scrollbar = document.querySelector('[data-simplebar]')

    if (scrollbar instanceof HTMLElement) {
        const simplebar = new SimpleBar(scrollbar)
        simplebar.getScrollElement()?.addEventListener('scroll', () => {
            const tooltips = document.querySelectorAll('.tl-tick-tooltip')
            const ticks = document.querySelectorAll('.tl-tick')
    
            if (tl instanceof HTMLElement && tooltips.length !== 0) {
                for (const tooltip of tooltips) {
                    tooltip.classList.add('d-lg-none')
                }
            }

            for (const tick of ticks) {
                tick.classList.remove('tl-tick--active')
            }
        })
    }
})


</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap';

:root {
    --tl-ticks-per-view: 5;

    --tl-start-box-radius: 10px;
    --tl-start-box-color: #757575;
    --tl-start-box-bg: #E0E0E0;

    --tl-box-x-padding: 20px;
    
    --tl-axis-width: 2px;
    --tl-axis-color: orange;
    --tl-axis-x-gap: 20px;
    
    --tl-scrollbar-background: #eea46e;
    
    --tl-tick-bg-color: #fff;

    --tl-tick-point-offset: 6px;
    --tl-tick-point-size: 20px;
    --tl-tick-point-border-width: 2px;
    --tl-tick-point-border-color: orange;
    --tl-tick-point-bg: #fff;

    --tl-tick-tooltip-arrow-size: 15px;
}

.simplebar-scrollbar::before {
    background: var(--tl-scrollbar-background);
}

.tl-container {
    overflow: hidden;

    @include media-breakpoint-up(lg) {
        overflow: auto;
        max-height: unset;
        padding: calc(var(--tl-tick-point-size) * 2) 0 calc(var(--tl-tick-point-size)) 0;
    }
}

.tl-start-box {
    display: none;
    @include media-breakpoint-up(lg) {
        display: inline-flex;
    }

    justify-content: center;
    align-items: center;

    min-width: calc(var(--tl-tick-point-size) * 3);
    min-height: calc(var(--tl-tick-point-size) * 3);
    
    color: var(--tl-start-box-color);
    background: var(--tl-start-box-bg);

    border-radius: var(--tl-start-box-radius) 0 0 var(--tl-start-box-radius);
}

.tl-fade-box {
    position: absolute;
    left: 0;
    transform: translateY(-40px);

    width: 100%;
    height: 40px;

    background: linear-gradient(to bottom, #ffffff00);
    @include media-breakpoint-up(lg) {
        bottom: unset;
        left: unset;
        right: 0;
        top: 0;

        width: calc(var(--tl-tick-point-size));
        height: calc(var(--tl-tick-point-size) * 3);

        background: linear-gradient(to right, #ffffff00, 15%, #fff, #fff);
        transform: translateY(calc((var(--tl-tick-point-size) * 2)));
    }
}

.tl-show-more-button {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;

    font-weight: bold;
    text-align: center;
    text-decoration: underline;

    color: var(--tl-axis-color);

    cursor: pointer;
}

.tl-tick-group {
    width: 100%;
    
    display: flex;
    flex-flow: column nowrap;
    background: transparent;

    white-space: nowrap;
    border-radius: 0 var(--tl-start-box-radius) var(--tl-start-box-radius) 0;

    @include media-breakpoint-up(lg) {
        flex-direction: row;
        padding: 0 calc(var(--tl-box-x-padding) * 2) 0 var(--tl-box-x-padding);

        background: var(--tl-tick-bg-color);
    }

}

.tl-tick {
    position: relative;
    display: inline-flex;
    align-items: start;
    justify-content: start;

    min-height: calc(100vh / var(--tl-ticks-per-view));

    @include media-breakpoint-up(lg) {
        align-items: center;
        justify-content: center;

        padding: var(--tl-tick-point-size) 0;
    
        min-height: unset;
        min-width: calc(100% / var(--tl-ticks-per-view));

        background: var(--tl-tick-bg-color);
    }

    cursor: pointer;

    &:hover > .tl-tick-point {
        @include media-breakpoint-up(lg) {
            background: var(--tl-tick-point-border-color);
        }
    }

    &--active {
        & > .tl-tick-point {
            background: var(--tl-tick-point-border-color);
        }
    }
}

.tl-tick-label {
    position: absolute;
    transform: translateX(calc(var(--tl-tick-point-size) + var(--tl-tick-point-offset) + 0.5rem)) translateY(-0.2rem);

    font-size: 1.2rem;
    font-weight: bold;
    text-align: start;
    @include media-breakpoint-up(lg) {
        top: 0;
        transform: translateY(calc((var(--tl-tick-point-size) * 2) * -1));
    }
}

.tl-tick-point {
    background: transparent;
    @include media-breakpoint-up(lg) {
        background: var(--tl-tick-point-bg);
    }

    height: var(--tl-tick-point-size);
    width: var(--tl-tick-point-size);

    border-radius: 50%;
    border: var(--tl-tick-point-border-width) solid var(--tl-tick-point-border-color);

    &::before,
    &::after {
        content: "";
        display: block;
        width: var(--tl-axis-width);
        height: calc(100% - var(--tl-tick-point-size) - var(--tl-tick-point-offset));
        background: var(--tl-axis-color);
        left: calc((var(--tl-tick-point-size) / 2) - (var(--tl-axis-width) / 2));
        top: 0;
        position: absolute;
        
        @include media-breakpoint-up(lg) {
            top: calc(50% - (var(--tl-axis-width) / 2));
            width: calc(50% - (var(--tl-tick-point-size) / 2) - var(--tl-tick-point-offset));
            height: var(--tl-axis-width);
        }
    }

    &::before {
        height: 0;

        @include media-breakpoint-up(lg) {
            height: var(--tl-axis-width);
            left: 0;
        }
    }

    &::after {
        top: unset;
        bottom: 0;

        @include media-breakpoint-up(lg) {
            top: calc(50% - (var(--tl-axis-width) / 2));
            left: unset;
            bottom: unset;
            right: 0;
        }
    }
}

.tl-tick-tooltip {
    background: #fff;

    margin: 2rem 0;
    padding: 1rem;

    border-radius: 4px;
    transform: translateX(1rem) translateY(1rem);

    width: calc(100% - (var(--tl-tick-point-size) + var(--tl-tick-point-offset) + 1rem));

    transition: display ease-in-out 0.3s;

    @include media-breakpoint-up(lg) {
        display: block;
    }
}

.tl-tick-tooltip > * {
    white-space: normal;
    overflow-wrap: break-word;
}

.tl-tick-tooltip div[data-tooltip-arrow] {
    display: none;

    position: absolute;

    top: calc((var(--tl-tick-tooltip-arrow-size)) * -1);
    left: calc(50% - (var(--tl-tick-tooltip-arrow-size) / 2));

    width: var(--tl-tick-tooltip-arrow-size);
    height: var(--tl-tick-tooltip-arrow-size);
    clip-path: polygon(0 100%, 50% 30%, 100% 100%);
    
    background: inherit;

    @include media-breakpoint-up(lg) {
        display: block;
    }
}
</style>