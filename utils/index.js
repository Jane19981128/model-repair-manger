export const debounce = function (func, wait = 2000, immediate = true) {
    let timer;

    return function () {
        const context = this;
        const args = arguments;

        if (timer) clearTimeout(timer);

        if (immediate) {
            const callNow = !timer;

            timer = setTimeout(() => {
                timer = null;
            }, wait);

            if (callNow) func.apply(context, args);
        } else {
            timer = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        }
    };
};