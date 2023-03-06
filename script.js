class EditWindow {
    constructor(edit_window) {
        this._edit_window = edit_window;

        this._konva_stage = new Konva.Stage({
            container: this._edit_window.id,
            width: this._edit_window.clientWidth,
            height: this._edit_window.clientHeight
        })
        this._konva_layer = new Konva.Layer();
        this._konva_stage.add(this._konva_layer);

        this.draw_mode = "line";
        let draw_buttons = document.getElementsByClassName("draw_mode_button");
        for (let i = 0; i < draw_buttons.length; i++) {
            draw_buttons[i].addEventListener("click", (ev) => {
                document.getElementById("current_mode").id = "";
                draw_buttons[i].id = "current_mode";
                this.draw_mode = draw_buttons[i].innerHTML;
            });
        }

        this._elements = [];
        this._hpoints = [];

        this._click_count = 0;

        window.addEventListener("resize", (ev) => {
            this._konva_stage.width = this._edit_window.clientWidth;
            this._konva_stage.height = this._edit_window.clientHeight;
        });
    }

    temp_element() {
        return this._elements[this._elements.length - 1];
    }
    add_click() {
        this._click_count = (this._click_count + 1) % 2;
    }
    first_click() {
        return this._click_count == 1;
    }

    add_element(el) {
        this._elements.push(el);
        this._konva_layer.add(el.konva_element);
    }


    highlight_points() {
        let result = [];
        let elements = (this.first_click())? this._elements.slice(0, -1) : this._elements;
        elements.forEach((el) => {
            el.highlight_points().forEach((point) => {
                let found = false;
                result.forEach((result_point) => {
                    if (point.x == result_point.x && point.y == result_point.y)
                        found = true;
                });
                if (!found) result.push(point);
            });
        });
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

    highlight() {
        this._hpoints = [];
        this.highlight_points().forEach((hpoint) => {
            let circle = new Konva.Circle({
                x: hpoint.x,
                y: hpoint.y,
                radius: eps,
                fill: "rgba(0, 0, 255, 0.2)",
                stroke: "rgba(0, 0, 255, 0.2)",
                strokeWidth: 2
            });
            this._konva_layer.add(circle);
            this._hpoints.push(circle);
        });
    }

    remove_highlight() {
        this._hpoints.forEach((hpoint) => {
            hpoint.destroy();
        });
        this._hpoints = [];
    }
};

window.onload = function () {
    let edit_window = new EditWindow(document.getElementById("edit_window"));

    edit_window._edit_window.addEventListener("click", (ev) => {
        if (!edit_window.first_click()) {
            let ev_point = new Point(ev.offsetX, ev.offsetY);
            let nearest = (ev.ctrlKey)? edit_window.find_nearest(ev_point) : null;
            let result_point = (nearest === null)? ev_point : nearest;

            if (edit_window.draw_mode == "line") {
                edit_window.add_element(new Line(
                    new Point(result_point), new Point(result_point)
                ));
            }
            else if (edit_window.draw_mode == "arrow") {
                edit_window.add_element(new Arrow(
                    new Point(result_point), new Point(result_point)
                ));
            }
            else if (edit_window.draw_mode == "rect") {
                edit_window.add_element(new Rect(
                    new Point(result_point), new Point(result_point)
                ));
            }
        }
        edit_window.add_click();
    });

    edit_window._edit_window.addEventListener("mousemove", (ev) => {
        if (edit_window.first_click()) {
            let ev_point = new Point(ev.offsetX, ev.offsetY);
            let nearest = (ev.ctrlKey)? edit_window.find_nearest(ev_point) : null;
            let result_point = (nearest === null)? ev_point : nearest;

            if (edit_window.draw_mode == "line" || edit_window.draw_mode == "arrow") {
                edit_window.temp_element().end(result_point);

                if (ev.shiftKey) {
                    dx = Math.abs(ev.clientX - edit_window.temp_element().begin().x);
                    dy = Math.abs(ev.clientY - edit_window.temp_element().begin().y);

                    point = edit_window.temp_element().end();
                    if (dx > dy) {
                        point.y = edit_window.temp_element().begin().y;
                    }
                    else {
                        point.x = edit_window.temp_element().begin().x;
                    }
                    edit_window.temp_element().end(point);
                }
            }
            else if (edit_window.draw_mode == "rect") {
                edit_window.temp_element().bottom_right(result_point);
            }
        }

        edit_window.remove_highlight();
        if (ev.ctrlKey)
            edit_window.highlight();
    });
}
