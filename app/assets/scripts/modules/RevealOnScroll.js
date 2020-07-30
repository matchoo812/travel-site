import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

class RevealOnScroll {
    constructor(els, scrollThreshold) {
        this.scrollThreshold = scrollThreshold;
        this.itemsToReveal = els;
        this.browserHeight = window.innerHeight;
        this.hideInitially();
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
        this.events();
    }

    // scroll event listener, throttled to every 200ms
    events() {
        window.addEventListener("scroll", this.scrollThrottle);
        // listen for window resizing to ensure element calculation remains accurate, fire after 1/3 sec
        window.addEventListener("resize", debounce( () => {
            this.browserHeight = window.innerHeight;
        }, 333));
    }

    calcCaller() {
        this.itemsToReveal.forEach(el => {
            if (el.isRevealed == false) {
                this.calculateIfScrolledTo(el);
            }
        });
    }

    // calculate if elements have been reached in scrolling
    calculateIfScrolledTo(el) {
        // wait until top of element reaches bottom of the window
        if (window.scrollY + this.browserHeight > el.offsetTop) {
            let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100;
            if (scrollPercent < this.scrollThreshold) {
                el.classList.add("reveal-item--is-visible");
                el.isRevealed = true;
                // remove scroll listener once all hidden items have been revealed
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
        }
    }

    hideInitially() {
        this.itemsToReveal.forEach(el => {
            el.classList.add("reveal-item")
            el.isRevealed = false;
        });
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }

}

export default RevealOnScroll;