<template>
    <div class="m-auto" style="width: 50%;">
        <div ref="timelineContainer" class="overflow-scroll py-lg-5 px-4 px-lg-0" :style="`--tick-size: ${tickSize}px; --axis-length: ${axisLength}px; --timeline-container-end: ${timelineContainerEnd}px;`">
            
            <!-- (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) (.)(.) -->
            
            <div class="d-lg-none">
                <div class="border-start border-orange border-2">
                    <div class="d-flex flex-column">
                        <div
                            v-for="(item, index) in data"
                            :key="index"
                        >
                            <div
                                class="point"
                                style="transform: translateX(calc(((var(--point-size) + var(--point-offset) + (var(--point-border-width) * 1.5)) * -1) / 2)); background: var(--timeline-bg-color)"
                            >
                                <div class="point-fg border-orange" style="background: var(--timeline-bg-color)"></div>
                            </div>
                            <div class="ms-4" style="transform: translateY(calc((var(--point-size) * 1.6) * -1))">
                                <div class="fw-bold fs-5">{{ item.label }}</div>
                                <div class="mt-3 p-4 bg-white rounded">{{ item.content }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, ,,!, -->
            
            <div class="x-axis-container shadow rounded-4 d-none d-lg-block">
                <div class="x-axis-start rounded-4 d-flex align-items-center justify-content-center">
                    <span style="color: #757575;">Start</span>
                </div>
                <div class="x-axis-end rounded-3 position-absolute" :class="{ 'd-none': timelineContainerEnd > axisLength }"></div>
                <div class="x-axis"></div>
                <div class="point-group">
                    <div
                        v-for="(item, index) in data"
                        class="point"
                        @click="toggleTooltip($event, item.title, item.content)"
                        :key="index"
                        :style="`transform: translateX(${((index + 1) * tickSize) - tickSize}px)`"
                    >
                        <div class="point-fg"></div>
                        <div class="point-title fw-bold fs-5" style="transform: translateY(calc((var(--point-size) + var(--point-title-offset)) * -1));">{{ item.label }}</div>
                    </div>
                </div>
            </div>
            <div id="tooltip" role="tooltip" :class="{ hidden: isTooltipHidden }">
                <div id="arrow" data-popper-arrow></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { createPopper } from '@popperjs/core'

const tickSize = ref(100)
const timelineContainer = ref<HTMLElement | null>(null)
const data = ref([
    {
        label: '2020',
        title: 'Title',
        content: 'Ahoj já jsem testovací content'
    },
    {
        label: '2021',
        title: 'Title',
        content: 'Jsem testovací content 2'
    },
    {
        label: '2022',
        title: 'Title',
        content: 'Testovací content 3'
    },
    {
        label: 'prosinec 2023',
        title: 'prosinec Title',
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
const timelineContainerEnd = ref(0)
const isTooltipHidden = ref(true)
const axisLength = computed(() => data.value.length * tickSize.value + 50)
const ac = new AbortController()

onMounted(() => {
    window.addEventListener('resize', () => {
        if (timelineContainer.value) {
            timelineContainerEnd.value = timelineContainer.value.getBoundingClientRect().width
        }
    }, { signal: ac.signal })
    if (timelineContainer.value) {
        timelineContainer.value.addEventListener('scroll', () => {
            isTooltipHidden.value = true
        }, { signal: ac.signal })
    }

    timelineContainerEnd.value = timelineContainer.value ? timelineContainer.value.getBoundingClientRect().width : 0
})

onBeforeUnmount(() => ac.abort())

function toggleTooltip (e: MouseEvent, title: string, content: string) {
    const tooltip = document.querySelector('#tooltip') as HTMLElement
    if (tooltip && e.currentTarget instanceof HTMLElement) {
        tooltip.querySelector('.tooltip-title')?.remove()
        tooltip.querySelector('.tooltip-content')?.remove()
        const tooltipTitle = document.createElement('div')
        const tooltipContent = document.createElement('div')
        tooltipTitle.classList.add('tooltip-title')
        tooltipContent.classList.add('tooltip-content')
        tooltipTitle.innerText = title
        tooltipContent.innerText = content
        tooltip.append(tooltipTitle)
        tooltip.append(tooltipContent)
        isTooltipHidden.value = false
        createPopper(e.currentTarget, tooltip, {
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
    }
}
</script>

<style>
:root {
    --timeline-bg-color: var(--body-bg-color, #fff);
    --timeline-container-end: 0;
    --point-size: 20px;
    --point-border-width: 2px;
    --point-offset: 10px;
    --point-title-offset: 45px;
    --tick-size: 200px;
    --axis-width: 2px;
    --axis-length: 0;
    --axis-offset: 40px;
    --axis-container-height: 80px;
}

.point-group {
    transform: translateY(calc(((var(--axis-container-height) / 2) + ((var(--point-size) + var(--point-offset)) / 2) + var(--axis-width)) * -1)) translateX(calc(var(--axis-container-height) + var(--axis-offset)));
    width: var(--axis-length);
}

.x-axis-container {
    width: calc((var(--axis-length) + (var(--tick-size) / 2) + var(--axis-container-height) + (var(--axis-offset) * 2)));
    height: var(--axis-container-height);
    background-color: #fff;

}

.x-axis {
    transform: translateY(calc(((var(--axis-container-height) / 2) + (var(--axis-width) / 2)) * -1)) translateX(calc(var(--axis-container-height) + var(--axis-offset)));
    width: calc(var(--axis-length) + (var(--tick-size) * 0.7));
    height: var(--axis-width);
    background-color: orange;
}

.x-axis-start,
.x-axis-end {
    height: var(--axis-container-height);
    width: var(--axis-container-height);
    background-color: #E0E0E0;
}

.x-axis-end {
    width: calc(var(--axis-container-height) / 2);
    background: linear-gradient(to right, #ffffff00, 15%, #fff, #fff);
    transform: translateX(calc(var(--timeline-container-end) - (var(--axis-container-height) / 2))) translateY(calc(var(--axis-container-height) * -1));
    z-index: 1;
}

.point {
    display: inline-flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    
    border-radius: 50%;
    background-color: #fff;
    width: calc(var(--point-size) + var(--point-offset));
    height: calc(var(--point-size) + var(--point-offset));
}

.point-fg {
    border: var(--point-border-width) solid orange;
    width: var(--point-size);
    height: var(--point-size);
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.1s ease-in-out;
}

.point-fg:hover {
    cursor: pointer;
    background-color: orange;
}

.point-title {
    position: absolute;
    width: max-content;
}

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
  z-index: 1;
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