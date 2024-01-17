<template>
    <div ref="timeline" class="position-relative">
        <div class="tl-container" data-simplebar>
            <div class="d-flex">
                <div class="tl-start-box">
                    Start
                </div>
                <div class="tl-tick-group">
                    <div
                        class="tl-tick"
                        v-for="(item, index) in ticks"
                        :key="index"
                        @click="toggleTooltip($event, index)"
                    >
                        <div class="tl-tick__label">{{ item.label }}</div>
                        <div class="tl-tick__point"></div>
                        <div class="tl-tick__tooltip d-none" role="tooltip">
                            <div class="d-flex justify-content-between mb-3">
                                <div class="fw-bold">{{ item.title }}</div>
                                <div style="width: 1rem;"></div>
                                <div class="text-orange fw-bold">{{ item.label }}</div>
                            </div>
                            <div class="text-gray-500">
                                {{ item.content }}
                            </div>
                            <div data-tooltip-arrow></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tl-fade-box"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computePosition } from '@floating-ui/dom'

import SimpleBar from 'simplebar-core'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

import ResizeObserver from 'resize-observer-polyfill'

window.ResizeObserver = ResizeObserver

const timeline = ref<HTMLElement | null>(null)
const toggleTooltip = (e: Event, index: number) => {
    const tooltips = document.querySelectorAll('.tl-tick__tooltip')
    const ticks = document.querySelectorAll('.tl-tick')
    const tooltip = tooltips[index]
    for (const tooltip of tooltips) {
        if (tooltip !== tooltips[index]) {
            tooltip.classList.add('d-none')
        }
    }

    for (const tick of ticks) {
        if (ticks[index]) {
            tick.classList.remove('tl-tick--active')
        }
    }

    if (e.currentTarget instanceof HTMLElement && tooltip instanceof HTMLElement) {
        computePosition(e.currentTarget, tooltip).then(({x, y}) => {
            tooltip.style.left = `${x}px`
            tooltip.style.top = `${y + 20}px`
        })
        e.currentTarget.classList.toggle('tl-tick--active')
        tooltip.classList.toggle('d-none')
    }
}

window.addEventListener('resize', () => {
    const tooltips = document.querySelectorAll('.tl-tick__tooltip')

    for (const tooltip of tooltips) {
        tooltip.classList.add('d-none')
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const tooltips = document.querySelectorAll('.tl-tick__tooltip')
    const tl = timeline.value
    const scrollbar = document.querySelector('[data-simplebar]')

    if (scrollbar instanceof HTMLElement) {
        const simplebar = new SimpleBar(scrollbar)
        simplebar.getScrollElement()?.addEventListener('scroll', () => {
            const tooltips = document.querySelectorAll('.tl-tick__tooltip')
            const ticks = document.querySelectorAll('.tl-tick')
    
            if (tl instanceof HTMLElement && tooltips.length !== 0) {
                for (const tooltip of tooltips) {
                    tooltip.classList.add('d-none')
                }
            }

            for (const tick of ticks) {
                tick.classList.remove('tl-tick--active')
            }
        })
    }

    if (tl instanceof HTMLElement && tooltips.length !== 0) {
        for (const tooltip of tooltips) {
            tl.append(tooltip)
        }
    }
})

const ticks = ref([
    {
        label: '2020',
        title: 'Title',
        content: 'Karel začal pracovat na projektu'
    },
    {
        label: '2021',
        title: 'Title',
        content: 'Petr začal pracovat na projektu'
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
</script>

<style lang="scss">
:root {
    --tl-ticks-per-view: 5;

    --tl-start-box-radius: 10px;
    --tl-start-box-color: #757575;
    --tl-start-box-bg: #E0E0E0;

    --tl-tick-bg-color: #fff;
    --tl-box-x-padding: 20px;
    
    --tl-axis-width: 2px;
    --tl-axis-color: orange;
    --tl-axis-x-gap: 20px;

    --tl-scrollbar-background: #eea46e;

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
    padding: calc(var(--tl-tick-point-size) * 2) 0 calc(var(--tl-tick-point-size)) 0;
}

.tl-start-box {
    display: inline-flex;
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
    right: 0;
    top: 0;
    transform: translateY(calc((var(--tl-tick-point-size) * 2)));

    min-width: calc(var(--tl-tick-point-size));
    width: calc(var(--tl-tick-point-size));
    min-height: calc(var(--tl-tick-point-size) * 3);
    height: calc(var(--tl-tick-point-size) * 3);

    background: linear-gradient(to right, #ffffff00, 15%, #fff, #fff);
}

.tl-tick-group {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    white-space: nowrap;

    background: var(--tl-tick-bg-color);
    padding: 0 calc(var(--tl-box-x-padding) * 2) 0 var(--tl-box-x-padding);

    border-radius: 0 var(--tl-start-box-radius) var(--tl-start-box-radius) 0;
}

.tl-tick {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;

    padding: var(--tl-tick-point-size) 0;
    
    min-width: calc(100% / var(--tl-ticks-per-view));
    width: calc(100% / var(--tl-ticks-per-view));
    background: var(--tl-tick-bg-color);

    cursor: pointer;

    &:hover > .tl-tick__point {
        background: var(--tl-tick-point-border-color);
    }

    &--active {
        & > .tl-tick__point {
            background: var(--tl-tick-point-border-color);
        }
    }

    &__label {
        font-weight: bold;
        position: absolute;
        text-align: start;
        top: 0;
        transform: translateY(calc((var(--tl-tick-point-size) * 2) * -1));
    }

    &__point {
        background: var(--tl-tick-point-bg);
        min-height: var(--tl-tick-point-size);
        height: var(--tl-tick-point-size);
        min-width: var(--tl-tick-point-size);
        width: var(--tl-tick-point-size);
        border-radius: 50%;
        border: var(--tl-tick-point-border-width) solid var(--tl-tick-point-border-color);

        &::before,
        &::after {
            content: "";
            display: block;
            width: calc(50% - (var(--tl-tick-point-size) / 2) - var(--tl-tick-point-offset));
            height: var(--tl-axis-width);
            background: var(--tl-axis-color);
            top: calc(50% - (var(--tl-axis-width) / 2));
            position: absolute;
        }

        &::before {
            left: 0;
        }

        &::after {
            right: 0;
        }
    }

    &__tooltip {
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;

        background: #fff;

        padding: 1rem;
        border-radius: 4px;

        transition: display ease-in-out 0.3s;
    }

    &__tooltip div[data-tooltip-arrow] {
        position: absolute;

        top: calc((var(--tl-tick-tooltip-arrow-size)) * -1);
        left: calc(50% - (var(--tl-tick-tooltip-arrow-size) / 2));

        width: var(--tl-tick-tooltip-arrow-size);
        height: var(--tl-tick-tooltip-arrow-size);
        clip-path: polygon(0 100%, 50% 30%, 100% 100%);
        
        background: inherit;
    }
}
</style>