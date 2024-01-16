class TimelineScrollbar extends HTMLElement {
    constructor () {
        super()
    }

    connectedCallback () {
        this.attachShadow({ mode: 'open' })

        const targetElementId = this.dataset.scrollbarId
        const trackWidth = this.dataset.trackWidth
        const trackColor = this.dataset.trackColor
        const thumbColor = this.dataset.thumbColor
        const targetElement = document.querySelector(`#${targetElementId}`)
        console.log(targetElement)
        if (!targetElement) {
            console.warn(`CustomScrollBar: target element with id "${targetElement}" not found`,this, this.dataset.targetId)

            return
        }
        const style = document.createElement('style')
        style.textContent = `
            .custom-scrollbar {
                width: 100%;
                height: 10px;
                position: absolute;
                right: 0;
                bottom: 0;
            }
        
            .custom-scrollbar__track {
                width: 100%;
                height: 100%;
                background-color: ${trackColor ?? '#f2f2f2'};
            }
        
            .custom-scrollbar__thumb {
                width: 100%;
                background-color: ${thumbColor ?? '#25ca'};
                border-radius: ${trackWidth ?? '5px'};
                position: absolute;
                top: 0;
                animation: top 0.25s ease-in;
        
            }
        
            .custom-scrollbar__thumb::hover {
                background-color: red;
            }
        `
        this.shadowRoot?.append(style)
        this.appendPreventNativeScrollStyle()
        this.render()
    }

    appendPreventNativeScrollStyle () {
        const style = document.createElement('style')
        style.textContent = `
            .prevent-scroll {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `
        document.head.append(style)
    }

    render () {
        if (this?.shadowRoot) {
            this.shadowRoot.innerHTML += `
                <div class="custom-scrollbar">
                    <div class="custom-scrollbar__track">
                        <div class="custom-scrollbar__thumb"></div>
                    </div>
                </div>
            `
        } else {
            console.error('Shadow root is not initialized')
        }
    }
}
customElements.define('timeline-scrollbar', TimelineScrollbar)