class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(begin = new Point(), end = new Point()) {
        this.begin = begin;
        this.end = end;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(this.begin.x, this.begin.y);
        context.lineTo(this.end.x, this.end.y);
        context.stroke();
    }
}

class EditWindow {
    constructor(edit_window) {
        this.edit_window = edit_window;
        this.edit_window_container = this.edit_window.parentNode;
        this.edit_ctx = this.edit_window.getContext("2d");

        this.elements = [];

        this.click_count = 0;

        this.set_canvas_size();
        window.addEventListener("resize", this.set_canvas_size);
    }

    temp_element() {
        return this.elements[this.elements.length - 1];
    }
    add_click() {
        this.click_count = (this.click_count + 1) % 2;
    }
    first_click() {
        return this.click_count == 1;
    }

    clear() {
        this.edit_ctx.clearRect(0, 0, this.edit_window.width, this.edit_window.height);
    }
    draw_all() {
        this.elements.forEach(element => {
            element.draw(this.edit_ctx);
        });
    }

    set_canvas_size() {
        this.edit_window.width = this.edit_window_container.clientWidth;
        this.edit_window.height = this.edit_window_container.clientHeight;
    }
};

window.onload = function () {
    let edit_window = new EditWindow(document.getElementById("edit_window"));

    window.addEventListener("click", (ev) => {
        edit_window.add_click();
        if (edit_window.first_click()) {
            edit_window.elements.push(new Line());
            edit_window.temp_element().begin = new Point(ev.clientX, ev.clientY);
        }
    });
    window.addEventListener("mousemove", (ev) => {
        if (edit_window.first_click()) {
            edit_window.temp_element().end = new Point(ev.clientX, ev.clientY);
            if (ev.shiftKey) {
                dx = Math.abs(ev.clientX - edit_window.temp_element().begin.x);
                dy = Math.abs(ev.clientY - edit_window.temp_element().begin.y);
                if (dx > dy) {
                    edit_window.temp_element().end.y = edit_window.temp_element().begin.y;
                }
                else {
                    edit_window.temp_element().end.x = edit_window.temp_element().begin.x;
                }
            }
            edit_window.clear();
            edit_window.draw_all();
        }
    });
}
