class EditWindow {
    constructor(edit_window) {
        this.edit_window = edit_window;
        this.edit_window_container = this.edit_window.parentNode;
        this.edit_ctx = this.edit_window.getContext("2d");

        this.edit_ctx.fillStyle = "black";
        this.edit_ctx.strokeStyle = "black";

        this.draw_mode = "line";
        let draw_buttons = document.getElementsByClassName("draw_mode_button");
        for (let i = 0; i < draw_buttons.length; i++) {
            draw_buttons[i].addEventListener("click", (ev) => {
                document.getElementById("current_mode").id = "";
                draw_buttons[i].id = "current_mode";
                this.draw_mode = draw_buttons[i].innerHTML;
            });
        }

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

    highlight_points() {
        let result = [];
        this.elements.forEach((el) => {
            el.highlight_points().forEach((point) => {
                if (result.indexOf(point) == -1)
                    result.push(point);
            });
        });
        if (this.first_click())
            return result.slice(0, -1);
        return result;
    }

    find_nearest(point) {
        let result = null;
        this.highlight_points().forEach((hpoint) => {
            if (result === null)
                if (distance(point, hpoint) <= eps) {
                    result = hpoint;
                    return;
                }
        });
        return result;
    }

    clear() {
        this.edit_ctx.clearRect(0, 0, this.edit_window.width, this.edit_window.height);
    }
    draw_all() {
        this.elements.forEach(element => {
            element.draw(this.edit_ctx);
        });
    }
    highlight() {
        this.edit_ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        this.edit_ctx.strokeStyle = "rgba(0, 0, 255, 0.2)";

        this.highlight_points().forEach((point) => {
            circle(this.edit_ctx, point.x, point.y);
        });

        this.edit_ctx.fillStyle = "black";
        this.edit_ctx.strokeStyle = "black";
    }

    set_canvas_size() {
        this.edit_window.width = this.edit_window_container.clientWidth;
        this.edit_window.height = this.edit_window_container.clientHeight;
    }
};

window.onload = function () {
    let edit_window = new EditWindow(document.getElementById("edit_window"));

    edit_window.edit_window.addEventListener("click", (ev) => {
        edit_window.add_click();
        if (edit_window.first_click()) {
            ev_point = new Point(ev.offsetX, ev.offsetY);
            edit_window.elements.push(new Line());
            edit_window.temp_element().begin = ev_point;
            if (ev.ctrlKey) {
                let nearest = edit_window.find_nearest(ev_point);
                if (nearest !== null)
                    edit_window.temp_element().begin = nearest;
            }
        }
    });
    edit_window.edit_window.addEventListener("mousemove", (ev) => {
        if (edit_window.first_click()) {
            ev_point = new Point(ev.offsetX, ev.offsetY);
            edit_window.temp_element().end = ev_point;
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
            else if (ev.ctrlKey) {
                let nearest = edit_window.find_nearest(ev_point);
                if (nearest !== null)
                    edit_window.temp_element().end = nearest;
            }
            edit_window.clear();
            edit_window.draw_all();
            if (ev.ctrlKey)
                edit_window.highlight();
        }
        else {
            edit_window.clear();
            edit_window.draw_all();
            if (ev.ctrlKey)
                edit_window.highlight();
        }
    });
}
